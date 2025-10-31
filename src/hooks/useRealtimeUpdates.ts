import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/api/config';
import type { Post } from '@/api/posts';

const wsUrl = BASE_URL.replace('http', 'ws') + '/websocket/';
interface WSEvent {
  event: 'updateStats' | 'newPost' | 'removePost';
  payload: any;
}

interface UpdateStatsPayload {
  id: number;
  views: number;
}
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
          switch (data.event) {
            case 'updateStats': {
              const { id, views } = data.payload as UpdateStatsPayload;

              
              queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
                if (!oldData || !Array.isArray(oldData)) return oldData;
                
                return oldData.map((post: Post) => 
                  post.id === id ? { ...post, views } : post
                );
              });

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

            
            case 'newPost':
            case 'removePost': {
              
              
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
        
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket: Error', err);
        ws.close(); 
      };
    };

    connect(); 
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.close();
      }
    };
  }, [queryClient]);
};