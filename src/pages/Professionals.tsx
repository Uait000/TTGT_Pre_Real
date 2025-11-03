
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout'; 


import { Loader2 } from 'lucide-react';
import { postsApi, Post, PostCategory } from '@/api/posts'; 
import type { Post as NewsPost } from '@/api/posts';
import NewsCard from '@/components/NewsCard'; 
import NewsModal from '@/components/NewsModal'; 


const fetchProfessionalsPosts = async () => {
    return await postsApi.getPublicAll({ 
        limit: 100,
        category: PostCategory.Professionals,
    });
};

const Professionals = () => {
    const { data: posts = [], isLoading: isLoadingPosts } = useQuery<NewsPost[]>({
        queryKey: ['posts', PostCategory.Professionals], 
        queryFn: fetchProfessionalsPosts,
    });

    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const handleReadMore = async (post: NewsPost) => {
        if (abortController) {
            abortController.abort();
        }
        const newAbortController = new AbortController();
        setAbortController(newAbortController);

        setSelectedPost(post);
        setIsLoadingDetails(true);

        try {
            
            const detailData = await postsApi.getPublicById(post.id); 
            
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
        <MainLayout>
            
            <h1 className="text-4xl font-bold text-foreground mb-8">Наши профессионалы</h1>
            {isLoadingPosts ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Нет записей о профессионалах</p>
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
                                Загрузить ещё
                            </button>
                        </div>
                    )}
                </>
            )}
            

            {/* Модальное окно остается частью страницы */}
            {selectedPost && (
                <NewsModal 
                    post={selectedPost} 
                    onClose={closeModal} 
                    isLoading={isLoadingDetails} 
                />
            )}
        </MainLayout>
    );
};

export default Professionals;