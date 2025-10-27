import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useFetchNews } from '@/hooks/useFetchNews';
import NewsCard from './NewsCard';
import { NewsPost, POST_TAGS, BASE_URL } from '@/api/config';

interface NewsDetailPost extends NewsPost {
  content?: string;
}

const NewsList = () => {
  const { posts, loading, hasMore, loadMore, error, offset } = useFetchNews();
  const [selectedNews, setSelectedNews] = useState<NewsDetailPost | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    if (posts.length > 0) {
      console.log('ДАННЫЕ СПИСКА НОВОСТЕЙ С СЕРВЕРА:', posts);
    }
  }, [posts]);

  const getCategoryBadge = (type: number) => {
    const badges = [
      'bg-blue-600/90 text-white',
      'bg-green-600/90 text-white',
      'bg-orange-600/90 text-white',
      'bg-red-600/90 text-white'
    ];
    const categoryLabel = POST_TAGS[type] || 'Новости';
    const badgeClass = badges[type] || badges[0];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
        {categoryLabel}
      </span>
    );
  };

  const formatDate = (dateInSeconds: number) => {
    if (!dateInSeconds) return '';
    const date = new Date(dateInSeconds * 1000);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleReadMore = async (post: NewsPost) => {
    if (abortController) {
      abortController.abort();
    }

    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    setLoadingDetail(true);
    setSelectedNews(post);
    setCurrentImageIndex(0);

    const identifier = post.slug || post.id;

    if (!identifier) {
      console.error('Ошибка: Пост не содержит ни slug, ни id для детального запроса.');
      setLoadingDetail(false);
      return;
    }

    try {
      const url = `${BASE_URL}/content/posts/${identifier}`;
      const response = await fetch(url, { signal: newAbortController.signal });
      if (!response.ok) throw new Error('Failed to fetch news detail');

      const detailData: NewsDetailPost = await response.json();

      const finalDetail: NewsDetailPost = {
        ...detailData,
        content: (detailData as any).text || detailData.content || detailData.body,
      };

      if (!newAbortController.signal.aborted) {
        setSelectedNews(finalDetail);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error loading news detail:', err);
      }
    } finally {
      if (!newAbortController.signal.aborted) {
        setLoadingDetail(false);
      }
    }
  };

  const closeModal = () => {
    if (abortController) {
      abortController.abort();
    }
    setSelectedNews(null);
    setCurrentImageIndex(0);
    setIsImageZoomed(false);
  };

  const getModalImages = (): string[] => {
    if (!selectedNews) return [];
    const images: string[] = [];
    const cleanBaseUrl = BASE_URL.replace('/api', '');

    if (Array.isArray((selectedNews as any).images) && (selectedNews as any).images.length > 0) {
      (selectedNews as any).images.forEach((imageId: string) => {
        if (imageId) {
          const fullUrl = `${cleanBaseUrl}/files/${imageId}`;
          images.push(fullUrl);
        }
      });
    } else if (selectedNews.image_urls && selectedNews.image_urls.length > 0) {
      selectedNews.image_urls.forEach((url: string) => {
        if (url) {
          const fullUrl = url.startsWith('http') ? url : `${cleanBaseUrl}${url}`;
          images.push(fullUrl);
        }
      });
    } else if (selectedNews.image_url) {
      const fullUrl = selectedNews.image_url.startsWith('http')
        ? selectedNews.image_url
        : `${cleanBaseUrl}${selectedNews.image_url}`;
      images.push(fullUrl);
    }

    return images;
  };

  const nextImage = () => {
    const images = getModalImages();
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = getModalImages();
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  if (error) {
    return (
      <section className="py-12 text-center">
        <p className="text-red-500">Ошибка загрузки новостей: {error}</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Новости и события</h2>
        <p className="text-muted-foreground text-lg">
          Следите за последними новостями нашего образовательного центра
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} onReadMore={handleReadMore} />
        ))}
      </div>

      {loading && <div className="text-center"><p>Загрузка...</p></div>}

      {!loading && hasMore && posts.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => loadMore(9, offset)}
            className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Показать еще
          </button>
        </div>
      )}

      {selectedNews && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">{selectedNews.title}</h2>
                  <div className="inline-block">{getCategoryBadge(selectedNews.type)}</div>
                </div>
              </div>

              {loadingDetail ? (
                <p className="text-center py-8">Загрузка...</p>
              ) : (
                <>
                  {getModalImages().length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getModalImages().map((img, index) => (
                          <div
                            key={index}
                            className="relative group cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => {
                              setCurrentImageIndex(index);
                              setIsImageZoomed(true);
                            }}
                          >
                            <img
                              src={img}
                              alt={`${selectedNews.title} - изображение ${index + 1}`}
                              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{ __html: selectedNews.content || '' }}
                  />

                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-medium">
                        Опубликовано: {formatDate(selectedNews.publish_date)}
                      </span>
                      {selectedNews.author && (
                        <span className="font-medium">Автор: {selectedNews.author}</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg z-40"
              aria-label="Закрыть"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {isImageZoomed && selectedNews && (
        <div
          className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center">
            <img
              src={getModalImages()[currentImageIndex]}
              alt={selectedNews.title}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {getModalImages().length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Предыдущее изображение"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Следующее изображение"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="text-white text-sm font-medium">
                    {currentImageIndex + 1} / {getModalImages().length}
                  </span>
                </div>
              </>
            )}

            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
              aria-label="Закрыть"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsList;
