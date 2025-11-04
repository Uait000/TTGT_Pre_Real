// Импортируем типы из нового файла
import { WebSocketEvent } from '@/types/websocket';

// Константа для пути WebSocket
const WS_PATH = '/websocket/';

class WebSocketService {
    private socket: WebSocket | null = null;
    private listeners: ((event: WebSocketEvent) => void)[] = [];
    private reconnectTimeout: number | null = null;

    /**
     * Подключается к WebSocket-серверу через proxy.
     * @param path - Должно быть '/websocket/'
     */
    public connect(path: string) { 
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
             console.log('WebSocket: Already connected.');
             return;
        }
        
        if (this.socket) {
            this.socket.close();
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        // Собираем полный URL для proxy: ws://localhost:8080/websocket/
        const fullUrl = `${protocol}//${host}${path}`; 
        console.log(`WebSocket: Attempting connection to proxy: ${fullUrl}`);

        try {
            this.socket = new WebSocket(fullUrl);
        } catch (error) {
            console.error("WebSocket: Failed to create connection:", error);
            this.reconnect(path); 
            return;
        }

        this.socket.onopen = () => {
            console.log('WebSocket: Connection established.');
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = null;
            }
        };

        this.socket.onmessage = (event) => {
            console.log('WebSocket: Message received:', event.data); 
            try {
                const data: WebSocketEvent = JSON.parse(event.data);
                this.listeners.forEach(listener => listener(data));
            } catch (error) {
                console.error('WebSocket: Failed to parse message:', error);
            }
        };

        this.socket.onclose = (event) => {
            console.log(`WebSocket: Connection closed (Code: ${event.code}). Attempting reconnect in 5s...`);
            this.reconnect(path);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket: Error occurred:', error);
            this.socket?.close();
        };
    }

    private reconnect(path: string) {
        if (this.reconnectTimeout) return;
        this.reconnectTimeout = window.setTimeout(() => {
            console.log("WebSocket: Reconnecting...");
            this.connect(path);
            this.reconnectTimeout = null;
        }, 5000);
    }

    public subscribe(listener: (event: WebSocketEvent) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public close() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.socket) {
             this.socket.onclose = null; 
             this.socket.close();
             this.socket = null;
        }
    }
}

export const wsService = new WebSocketService();
