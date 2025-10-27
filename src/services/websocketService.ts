// src/services/websocketService.ts

export interface UpdateStatsEvent {
    online: number;
}

export interface IncompletePost {
    id: number;
    title: string;
    body: string;
    publish_date: number;
    type: number;
    files: any[]; // Используйте реальный тип BackendFile[]
    category: number;
    status: number;
}

export interface WebSocketEvent {
    updateStats?: UpdateStatsEvent;
    newPost?: IncompletePost;
    removePost?: number; // ID поста
}

const WS_PATH = '/websocket/'; 

class WebSocketService {
    private socket: WebSocket | null = null;
    private listeners: ((event: WebSocketEvent) => void)[] = [];
    private reconnectTimeout: number | null = null;

    public connect(url: string) {
        if (this.socket) {
            this.socket.close();
        }

        // Заменяем HTTP на WS/WSS для подключения
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const fullUrl = `${protocol}//${host}${url}`;

        this.socket = new WebSocket(fullUrl);

        this.socket.onopen = () => {
            console.log('WebSocket: Connection established.');
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = null;
            }
        };

        this.socket.onmessage = (event) => {
            try {
                const data: WebSocketEvent = JSON.parse(event.data);
                this.listeners.forEach(listener => listener(data));
            } catch (error) {
                console.error('WebSocket: Failed to parse message:', error);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket: Connection closed. Attempting reconnect in 5s...');
            this.reconnect();
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket: Error occurred:', error);
            this.socket?.close();
        };
    }

    private reconnect() {
        if (this.reconnectTimeout) return;
        this.reconnectTimeout = window.setTimeout(() => {
            this.connect(WS_PATH);
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
        this.socket?.close();
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }
}

export const wsService = new WebSocketService();