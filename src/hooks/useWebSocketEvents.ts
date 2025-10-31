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
    useEffect(() => {
        
        if (window.location.pathname.startsWith('/admin')) {
             return; 
        }
        wsService.connect('/websocket/'); 
        const handleEvent = (event: WebSocketEvent) => {
            setRealTimeData(prev => {
                let newData = { ...prev };

                if (event.updateStats) {
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
            wsService.close(); 
        };
    }, []);

    return realTimeData;
};