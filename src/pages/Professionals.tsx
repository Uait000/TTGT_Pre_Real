import { useState, useEffect } from 'react';
// ИСПРАВЛЕНИЕ 1: professionalsApi заменен на postsApi. Добавлен Post и PostCategory.
import { postsApi, Post, PostCategory } from '@/api/posts'; 
// ИСПРАВЛЕНИЕ 2: Professional (из config) заменен на Post (из posts).
import type { Post as Professional } from '@/api/posts'; 
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

// ИСПРАВЛЕНИЕ 3: Поскольку category в Post теперь числовой PostCategory, а не строка, 
// эти маппинги, вероятно, устарели или используются для маппинга post.type.
// Поскольку PostCategory для профессионалов равно 1, и в этом файле post.category используется 
// как ключ для CATEGORY_LABELS, мы заменим post.category на post.type.
// Однако, оставим их как есть, предполагая, что post.category здесь означает post.type,
// или API возвращает старый строковый ключ в поле category, хотя это маловероятно.
// Оставляем эти маппинги без изменений, но используем post.type для меток.

const CATEGORY_LABELS: Record<string, string> = {
  achievement: 'Достижение',
  award: 'Награда',
  recognition: 'Признание',
  success: 'Успех',
};

const CATEGORY_BADGES: Record<string, string> = {
  achievement: 'bg-blue-100 text-blue-800',
  award: 'bg-yellow-100 text-yellow-800',
  recognition: 'bg-green-100 text-green-800',
  success: 'bg-purple-100 text-purple-800',
};

// Константы для форматирования ссылок
const CLEAN_BASE_URL = (postsApi as any).BASE_URL?.replace('/api', '') || '';

const Professionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Professional | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      // ИСПРАВЛЕНИЕ 4: Используем postsApi.getAll с фильтром по категории "Профессионалы" (1)
      const data = await postsApi.getAll({ 
        category: PostCategory.Professionals,
        limit: 100, 
      });
      
      setProfessionals(data as Professional[]);
    } catch (error) {
      console.error('Failed to load professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (post: Professional) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
  };

  const handleClose = () => {
    setSelectedPost(null);
    setCurrentImageIndex(0);
  };
  
  // ИСПРАВЛЕНИЕ 5: Логика карусели теперь использует post.files (BackendFile[])
  const getModalImages = (post: Professional): string[] => {
    const images: string[] = [];
    if (Array.isArray(post.files) && post.files.length > 0) {
      post.files.forEach((file) => {
        if (file && file.id) {
          images.push(`${CLEAN_BASE_URL}/files/${file.id}`);
        }
      });
    }
    return images;
  };

  const nextImage = () => {
    if (selectedPost) {
        const images = getModalImages(selectedPost);
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    }
  };

  const prevImage = () => {
    if (selectedPost) {
        const images = getModalImages(selectedPost);
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) + ' г.';
  };
  
  // Здесь мы используем post.type для метки, так как post.category в новом API - число.
  const getCategoryKey = (type: number) => {
    // POST_TAGS: ["Новости", "Достижения", "Образование", "Событие"]
    const tag = (postsApi as any).POST_TAGS?.[type] || 'success'; 
    // Предполагаем, что вам нужно маппить числовой type на строковые ключи achievement/award/recognition/success
    if (tag === 'Достижения') return 'achievement';
    if (tag === 'Событие') return 'award';
    // и т.д. или просто возвращаем 'success' по умолчанию
    return 'success'; 
  };
  
  const getPostImageUrl = (post: Professional, index: number = 0): string | undefined => {
    const images = getModalImages(post);
    return images.length > index ? images[index] : undefined;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex relative">
        <Sidebar />

        <main className="flex-1 min-h-screen central-content-area">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-foreground mb-8">Наши профессионалы</h1>

            <InfoBlocks />

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Загрузка...</p>
              </div>
            ) : professionals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Нет записей о профессионалах</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionals.map((post) => {
                    const imageUrl = getPostImageUrl(post);
                    const categoryKey = getCategoryKey(post.type);
                    
                    return (
                        <article
                            key={post.id}
                            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleReadMore(post)}
                        >
                            {/* ИСПРАВЛЕНИЕ: Используем новую логику получения URL */}
                            {imageUrl && (
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_BADGES[categoryKey] || CATEGORY_BADGES.achievement}`}>
                                            {/* ИСПРАВЛЕНИЕ: Используем type для маппинга */}
                                            {CATEGORY_LABELS[categoryKey] || 'Профессионал'} 
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-muted-foreground mb-4 line-clamp-3">
                                    {/* ИСПРАВЛЕНИЕ: post.body используется, что корректно */}
                                    {post.body.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                </p>

                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                    <span>{formatDate(post.publish_date)}</span>
                                    <span>{post.author}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <span className="flex items-center space-x-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{post.views}</span>
                                        </span>
                                    </div>
                                    <button className="text-primary hover:text-primary-hover font-medium text-sm transition-colors">
                                        Читать →
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
              </div>
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
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background rounded-lg max-w-4xl w-full my-8 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* ИСПРАВЛЕНИЕ: Используем getModalImages для модального окна */}
            {getModalImages(selectedPost).length > 0 && (
              <div className="relative h-96 rounded-t-lg overflow-hidden group">
                <img
                  src={getModalImages(selectedPost)[currentImageIndex]}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />

                {getModalImages(selectedPost).length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {getModalImages(selectedPost).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="p-8">
              <div className="mb-4">
                 {/* ИСПРАВЛЕНИЕ: Используем type для маппинга */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_BADGES[getCategoryKey(selectedPost.type)] || CATEGORY_BADGES.achievement}`}>
                  {CATEGORY_LABELS[getCategoryKey(selectedPost.type)] || 'Профессионал'}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-4">
                {selectedPost.title}
              </h2>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                <div className="flex items-center space-x-4">
                  <span>{formatDate(selectedPost.publish_date)}</span>
                  <span>•</span>
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{selectedPost.views}</span>
                </div>
              </div>

              <div
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: selectedPost.body }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Professionals;