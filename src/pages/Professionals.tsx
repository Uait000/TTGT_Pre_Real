import { useState, useEffect } from 'react';
import { postsApi, Post, PostCategory } from '@/api/posts'; 
import type { Post as NewsPost } from '@/api/posts';
import NewsCard from '@/components/NewsCard';
import NewsModal from '@/components/NewsModal'; 
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';

const Professionals = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await postsApi.getAll({ 
          limit: 100,
          category: PostCategory.Professionals,
        });
        
        setPosts(fetchedPosts as NewsPost[]); 
      } catch (error) {
        console.error("Failed to fetch professionals:", error);
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
      // ИСПРАВЛЕНИЕ: getById ожидает ID. 
      // Если ваш API ожидает строку, используйте post.id.toString()
      const detailData = await postsApi.getById(post.id); 
      
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex relative">
        <Sidebar />

        <main className="flex-1 min-h-screen central-content-area">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-foreground mb-8">Наши профессионалы</h1>
            
            {posts.length === 0 ? (
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
          </div>
        </main>

        <aside className="fixed-right-panel">
          <div className="p-6">
            <SidebarCards />
          </div>
        </aside>
      </div>

      {selectedPost && (
        <NewsModal 
          post={selectedPost} 
          onClose={closeModal} 
          isLoading={isLoadingDetails} 
        />
      )}
    </div>
  );
};

export default Professionals;