import { useEffect, useState } from 'react';
import { wsService } from '@/services/websocketService';
// ИСПОЛЬЗУЕМ НОВЫЙ ФАЙЛ ТИПОВ
import { WebSocketEvent, IncompletePost } from '@/types/websocket'; 
import { PostCategory, PostStatus } from '@/api/posts'; 

export const useRealTimePostList = (
    initialPosts: IncompletePost[],
    requiredCategory: PostCategory
) => {
    
    const [posts, setPosts] = useState<IncompletePost[]>(initialPosts);
    
    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    useEffect(() => {
        // Хук ТОЛЬКО СЛУШАЕТ СОБЫТИЯ
        const handleEvent = (event: WebSocketEvent) => {
            setPosts(prevPosts => {
                
                // 1. Добавление нового поста
                if (event.newPost) {
                    const newPost = event.newPost;
                    if (
                        newPost.category === requiredCategory &&
                        newPost.status === PostStatus.Published &&
                        !prevPosts.some(p => p.id === newPost.id)
                    ) {
                        return [newPost, ...prevPosts];
                    }
                }
                
                // 2. Удаление поста
                if (event.removePost) {
                    const removedId = event.removePost;
                    return prevPosts.filter(p => p.id !== removedId);
                }

                // 3. Обновление просмотров (для "глазика")
                if (event.postViewUpdated) {
                    const { id, views } = event.postViewUpdated;
                    if (prevPosts.some(p => p.id === id)) {
                        return prevPosts.map(post =>
                            post.id === id ? { ...post, views: views } : post
                        );
                    }
                }
                
                return prevPosts;
            });
        };
        
        const unsubscribe = wsService.subscribe(handleEvent);
        
        return () => {
            unsubscribe();
        };
    }, [requiredCategory]); 

    return posts;
};
