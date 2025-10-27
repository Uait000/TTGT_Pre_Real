// src/hooks/useRealTimePostList.ts

import { useEffect, useState } from 'react';
import { wsService, WebSocketEvent, IncompletePost } from '@/services/websocketService';
// Импортируем типы и константы из API
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
    // Используем состояние для хранения и обновления списка
    const [posts, setPosts] = useState<IncompletePost[]>(initialPosts);

    // Обновляем состояние, если меняются начальные посты (например, при пагинации)
    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    useEffect(() => {
        // Защита от использования в админке
        if (window.location.pathname.startsWith('/admin')) {
            return; 
        }

        // Подключаемся к WebSocket
        wsService.connect('/websocket/');

        const handleEvent = (event: WebSocketEvent) => {
            setPosts(prevPosts => {
                // 1. Обработка нового поста (newPost)
                if (event.newPost) {
                    const newPost = event.newPost;
                    
                    // Условие:
                    // a) Пост должен быть в нужной категории (Новости/Профессионалы)
                    // б) Пост должен быть опубликован (PostStatus.Published)
                    // в) Поста еще нет в списке (для избежания дубликатов)
                    if (
                        newPost.category === requiredCategory && 
                        newPost.status === PostStatus.Published &&
                        !prevPosts.some(p => p.id === newPost.id)
                    ) { 
                         // Добавляем новый пост в начало списка
                        return [newPost, ...prevPosts];
                    }
                }

                // 2. Обработка удаления/приватизации поста (removePost)
                if (event.removePost) {
                    const removedId = event.removePost;
                    // Удаляем пост с данным ID из списка
                    return prevPosts.filter(p => p.id !== removedId);
                }

                // Если нет подходящих событий, возвращаем предыдущее состояние
                return prevPosts;
            });
        };

        // Подписываемся и получаем функцию отписки
        const unsubscribe = wsService.subscribe(handleEvent);

        // Функция очистки: отписываемся и закрываем соединение
        return () => {
            unsubscribe();
            wsService.close();
        };
    }, [requiredCategory]); // Переподключаемся, если меняется категория

    return posts;
};