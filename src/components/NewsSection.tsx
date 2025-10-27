import { useState, useEffect } from 'react';
// ИСПРАВЛЕНИЕ 1: Импортируем Post и PostCategory из posts.ts
import { postsApi, Post, PostCategory } from '@/api/posts'; 
// Используем Post под именем NewsPost для совместимости
import type { Post as NewsPost } from '@/api/posts'; 
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';

const NewsSection = () => {
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                // ИСПРАВЛЕНИЕ: Теперь getAll в posts.ts работает с '0'
                const fetchedPosts = await postsApi.getAll({ 
                    limit: 9,
                    category: PostCategory.News,
                });
                
                // Нормализация больше не нужна
                setPosts(fetchedPosts as NewsPost[]); 
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        loadPosts();
    }, []);

    const handleReadMore = async (post: NewsPost) => {
        if (abortController) {
            abortController.abort();
        }
        const newAbortController = new AbortController();
        setAbortController(newAbortController);

        setSelectedPost(post);
        setIsLoadingDetails(true);

        try {
            // ИСПРАВЛЕНИЕ: postsApi.getById
            const detailData = await postsApi.getById(post.id.toString());
            
            if (!newAbortController.signal.aborted) {
                const finalPost: NewsPost = {
                    ...post,
                    ...detailData, 
                };
                setSelectedPost(finalPost);
            }
        } catch (error) {
            console.error("Failed to fetch post details:", error);
        } finally {
            if (!newAbortController.signal.aborted) {
                setIsLoadingDetails(false);
            }
        }
    };
    
    const closeModal = () => {
        if (abortController) {
            abortController.abort();
        }
        setSelectedPost(null);
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    return (
        <section className="py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Новости и события</h2>
                <p className="text-muted-foreground text-lg">Следите за последними новостями нашего образовательного центра</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.slice(0, visibleCount).map((post) => (
                    <NewsCard 
                        key={post.id} 
                        post={post} 
                        onReadMore={handleReadMore}
                    />
                ))}
            </div>

            {visibleCount < posts.length && (
                <div className="text-center">
                    <button onClick={loadMore} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium">
                        Загрузить ещё новости
                    </button>
                </div>
            )}

            {selectedPost && <NewsModal post={selectedPost} onClose={closeModal} isLoading={isLoadingDetails} />}
        </section>
    );
};

export default NewsSection;