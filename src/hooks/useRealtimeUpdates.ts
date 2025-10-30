import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/api/config';
import type { Post } from '@/api/posts';

// 1. Генерируем WebSocket URL из вашего BASE_URL
// http://185.13.47.146:50123 -> ws://185.13.47.146:50123/websocket/
const wsUrl = BASE_URL.replace('http', 'ws') + '/websocket/';

// 2. Определяем типы событий (согласно вашему ТЗ)
interface WSEvent {
  event: 'updateStats' | 'newPost' | 'removePost';
  payload: any;
}

interface UpdateStatsPayload {
  id: number;
  views: number;
}

/**
 * Этот хук должен вызываться ОДИН РАЗ в App.tsx.
 * Он управляет WebSocket-соединением и обновляет кэш react-query.
 */
export const useRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      console.log('WebSocket: Connecting...');
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket: Connected');
        if (reconnectTimer) clearTimeout(reconnectTimer);
      };

      ws.onmessage = (event) => {
        try {
          const data: WSEvent = JSON.parse(event.data);

          // Обновляем кэш react-query в зависимости от события
          switch (data.event) {
            
            // Событие: updateStats (Обновление просмотров)
            case 'updateStats': {
              const { id, views } = data.payload as UpdateStatsPayload;

              // Обновляем кэш для ВСЕХ списков постов (['posts', ...])
              queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
                if (!oldData || !Array.isArray(oldData)) return oldData;
                
                return oldData.map((post: Post) => 
                  post.id === id ? { ...post, views } : post
                );
              });
              
              // Обновляем кэш для детального просмотра поста (если он открыт)
              queryClient.setQueryData(['post', id], (oldData: any) => {
                 if (!oldData) return oldData;
                 return { ...oldData, views };
              });
              queryClient.setQueryData(['post', id.toString()], (oldData: any) => {
                 if (!oldData) return oldData;
                 return { ...oldData, views };
              });
              
              break;
            }

            // События: newPost или removePost
            case 'newPost':
            case 'removePost': {
              // Инвалидируем кэш, чтобы NewsSection и Professionals.tsx
              // автоматически перезагрузили данные.
              console.log(`WebSocket: Received ${data.event}, invalidating 'posts' cache.`);
              queryClient.invalidateQueries({ queryKey: ['posts'] });
              break;
            }
          }

        } catch (e) {
          console.error('WebSocket: Error parsing message', e);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket: Disconnected. Reconnecting in 3s...');
        // Попытка переподключения каждые 3 секунды
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket: Error', err);
        ws.close(); // Это вызовет onclose и запустит логику переподключения
      };
    };

    connect(); // Первое подключение

    // Очистка при размонтировании
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
    };
  }, [queryClient]);
};