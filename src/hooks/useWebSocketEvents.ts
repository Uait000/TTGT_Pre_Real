// src/hooks/useWebSocketEvents.ts

import { useEffect, useState } from 'react';
import { wsService, WebSocketEvent, IncompletePost, UpdateStatsEvent } from '@/services/websocketService';

export interface RealTimeData {
    onlineUsers: number;
    lastNewPost: IncompletePost | null;
    lastRemovedPostId: number | null;
}

export const useWebSocketEvents = () => {
    const [realTimeData, setRealTimeData] = useState<RealTimeData>({
        onlineUsers: 0,
        lastNewPost: null,
        lastRemovedPostId: null,
    });
    
    // Подключаемся при монтировании и отключаемся при размонтировании
    useEffect(() => {
        // Проверяем, что не находимся в админ-панели (хотя это логика роутера)
        if (window.location.pathname.startsWith('/admin')) {
             return; 
        }
        
        // Начинаем подключение к WebSocket
        wsService.connect('/websocket/'); 

        // Функция-обработчик для входящих событий
        const handleEvent = (event: WebSocketEvent) => {
            setRealTimeData(prev => {
                let newData = { ...prev };

                if (event.updateStats) {
                    newData.onlineUsers = event.updateStats.online;
                }
                if (event.newPost) {
                    // Можно использовать newPost для добавления поста в список
                    newData.lastNewPost = event.newPost; 
                }
                if (event.removePost) {
                    // Можно использовать removePost для удаления поста из списка
                    newData.lastRemovedPostId = event.removePost; 
                }

                return newData;
            });
        };

        // Подписываемся на события
        const unsubscribe = wsService.subscribe(handleEvent);

        // Функция очистки при размонтировании компонента
        return () => {
            unsubscribe();
            wsService.close(); // Закрываем соединение
        };
    }, []);

    return realTimeData;
};