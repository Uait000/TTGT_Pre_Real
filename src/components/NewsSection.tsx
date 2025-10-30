import { useState } from 'react';
// --- ИЗМЕНЕНО: убираем useEffect, добавляем useQuery ---
import { postsApi, Post, PostCategory } from '@/api/posts'; 
import type { Post as NewsPost } from '@/api/posts'; 
// --- ИСПРАВЛЕНЫ ПУТИ (судя по вашей структуре) ---
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';
// --- ДОБАВЛЕНО: ---
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

// --- ДОБАВЛЕНО: Функция загрузки данных для useQuery ---
const fetchNewsPosts = async () => {
  return await postsApi.getAll({ 
    limit: 100, // Загружаем больше для "Загрузить ещё"
    category: PostCategory.News,
  });
};

const NewsSection = () => {
    // --- ИЗМЕНЕНО: Получаем посты через useQuery ---
    const { data: posts = [], isLoading: isLoadingPosts } = useQuery<NewsPost[]>({
      // Ключ ['posts', PostCategory.News] позволяет WS-хуку найти эти данные
      queryKey: ['posts', PostCategory.News], 
      queryFn: fetchNewsPosts,
    });
    // ---
    
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    // --- УДАЛЕНО: useEffect(loadPosts) больше не нужен ---

    const handleReadMore = async (post: NewsPost) => {
        if (abortController) {
            abortController.abort();
        }
        const newAbortController = new AbortController();
        setAbortController(newAbortController);

        setSelectedPost(post);
        setIsLoadingDetails(true);

        try {
            // (Ваша логика getById остается без изменений)
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

            {/* --- ДОБАВЛЕНО: Состояние загрузки --- */}
            {isLoadingPosts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
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
              </>
            )}

            {selectedPost && <NewsModal post={selectedPost} onClose={closeModal} isLoading={isLoadingDetails} />}
        </section>
    );
};

export default NewsSection;