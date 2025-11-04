// Этот файл содержит только интерфейсы TypeScript,
// чтобы сделать код чище.

export interface UpdateStatsEvent {
    online: number;
}

export interface IncompletePost {
    id: number;
    title: string;
    body: string;
    publish_date: number;
    type: number;
    files: any[]; 
    category: number;
    status: number;
    views?: number; // Добавляем просмотры
}

// Интерфейс для "глазика"
export interface PostViewUpdate {
    id: number;
    views: number;
}

// Главный интерфейс событий
export interface WebSocketEvent {
    updateStats?: UpdateStatsEvent;     // Для счетчика в футере
    newPost?: IncompletePost;           // Для новых постов
    removePost?: number;                // Для удаления постов
    postViewUpdated?: PostViewUpdate;   // Для "глазика" (когда Егор его добавит)
}

