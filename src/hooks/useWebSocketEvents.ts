import { useEffect, useState } from 'react';
import { wsService } from '@/services/websocketService';
// ИСПОЛЬЗУЕМ НОВЫЙ ФАЙЛ ТИПОВ
import { WebSocketEvent, IncompletePost } from '@/types/websocket'; 

export interface RealTimeData {
    onlineUsers: number | undefined; 
    lastNewPost: IncompletePost | null;
    lastRemovedPostId: number | null;
}

export const useWebSocketEvents = () => {
    const [realTimeData, setRealTimeData] = useState<RealTimeData>({
        onlineUsers: undefined, 
        lastNewPost: null,
        lastRemovedPostId: null,
    });

    useEffect(() => {
        // Хук ТОЛЬКО СЛУШАЕТ СОБЫТИЯ
        const handleEvent = (event: WebSocketEvent) => {
            setRealTimeData(prev => {
                let newData = { ...prev };

                if (event.updateStats) {
                    // ЕСЛИ ПРИШЛИ НОВЫЕ ДАННЫЕ, ОБНОВЛЯЕМ onlineUsers
                    newData.onlineUsers = event.updateStats.online;
                }
                if (event.newPost) {
                    newData.lastNewPost = event.newPost;
                }
                if (event.removePost) {
                    newData.lastRemovedPostId = event.removePost;
                }
                return newData;
            });
        };

        const unsubscribe = wsService.subscribe(handleEvent);

        return () => {
            unsubscribe();
        };
    }, []); 

    return realTimeData;
};
