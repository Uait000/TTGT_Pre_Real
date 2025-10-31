

import { useEffect, useState } from 'react';
import { wsService, WebSocketEvent, IncompletePost } from '@/services/websocketService';

import { PostCategory, PostStatus } from '@/api/posts'; 

/**
 * Хук для управления списком постов в реальном времени.
 * Слушает WebSocket и добавляет/удаляет посты, соответствующие категории страницы.
 * * @param initialPosts Начальный список постов, загруженный при монтировании компонента.
 * @param requiredCategory Категория (News или Professionals), по которой фильтруются события.
 * @returns Текущий список постов.
 */
export const useRealTimePostList = (
    initialPosts: IncompletePost[], 
    requiredCategory: PostCategory
) => {
    
    const [posts, setPosts] = useState<IncompletePost[]>(initialPosts);   
    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    useEffect(() => {
        
        if (window.location.pathname.startsWith('/admin')) {
            return; 
        }
        wsService.connect('/websocket/');

        const handleEvent = (event: WebSocketEvent) => {
            setPosts(prevPosts => {
                
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
                
                if (event.removePost) {
                    const removedId = event.removePost;
                    
                    return prevPosts.filter(p => p.id !== removedId);
                }

                
                return prevPosts;
            });
        };
        const unsubscribe = wsService.subscribe(handleEvent);
        return () => {
            unsubscribe();
            wsService.close();
        };
    }, [requiredCategory]); 

    return posts;
};