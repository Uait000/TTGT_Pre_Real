import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
// ИСПРАВЛЕНИЕ 1: Импорты разделены и обновлены
import { Post, POST_TAGS } from '@/api/posts'; // Post и POST_TAGS из posts.ts (Post включает author и views)
import { BASE_URL } from '@/api/config'; // BASE_URL из config.ts

// Тип post изменен на Post
const NewsModal = ({ post, onClose, isLoading }: { post: Post; onClose: () => void; isLoading: boolean }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const getModalImages = (): string[] => {
    const images: string[] = [];
    const cleanBaseUrl = BASE_URL.replace('/api', ''); // Убираем /api, чтобы получить корень сайта

    // ИСПРАВЛЕНИЕ 2: Логика картинок обновлена для использования post.files (BackendFile[])
    if (Array.isArray(post.files) && post.files.length > 0) {
      post.files.forEach((file) => {
        if (file && file.id) {
          images.push(`${cleanBaseUrl}/files/${file.id}`);
        }
      });
    } 
    // Старую логику для post.image_urls, которую мы не видим в Post, можно временно оставить закомментированной или удалить
    /*
    else if ((post as any).image_urls && (post as any).image_urls.length > 0) {
      (post as any).image_urls.forEach((url: string) => {
        if (url) images.push(url.startsWith('http') ? url : `${cleanBaseUrl}${url}`);
      });
    }
    */
    
    return images;
  };

  const modalImages = getModalImages();

  // Логика карусели
  const nextImage = useCallback(() => {
    // Внимание: Ваша логика карусели (modalImages.length > 2) кажется странной
    // и ведет к непредсказуемому поведению. Но поскольку она работает на вашей стороне,
    // я оставляю ее. Исправлен только делитель на (modalImages.length)
    if (modalImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % modalImages.length);
    }
  }, [modalImages.length]);

  const prevImage = useCallback(() => {
    if (modalImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
    }
  }, [modalImages.length]);

  useEffect(() => {
    if (modalImages.length > 0) { // Проверяем, что картинки вообще есть
      const timer = setInterval(() => {
        nextImage();
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [modalImages.length, nextImage]);
  
  const formatDate = (dateInSeconds: number) => {
    if (!dateInSeconds) return '';
    const date = new Date(dateInSeconds * 1000);
    return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const getCategoryBadge = (type: number) => {
    const badges = ['bg-blue-600/90 text-white', 'bg-green-600/90 text-white', 'bg-orange-600/90 text-white', 'bg-red-600/90 text-white'];
    const categoryLabel = POST_TAGS[type] || 'Новости';
    const badgeClass = badges[type] || badges[0];
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{categoryLabel}</span>;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] w-full flex flex-col overflow-hidden" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Шапка модального окна */}
          <div className="sticky top-0 bg-white z-20 p-6 pb-4 border-b border-gray-200">
            {/* ✅ ИСПРАВЛЕНИЕ: Добавлен отступ справа `pr-12` чтобы освободить место для крестика */}
            <div className="flex items-start justify-between gap-4 pr-12">
              <h2 className="text-3xl font-bold text-gray-900 flex-1">{post.title}</h2>
              {getCategoryBadge(post.type)}
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100/80 hover:bg-gray-200 p-2 rounded-full z-30">
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Контент модального окна */}
          <div className="overflow-y-auto">
            <div className="p-6 pt-4">
              {isLoading ? <p className="text-center py-8">Загрузка...</p> : (
                <>
                  {/* Карусель */}
                  {modalImages.length > 0 && (
                    <div className="relative mb-6 group">
                      <div className="overflow-hidden rounded-lg">
                        <div 
                          className="flex transition-transform duration-500 ease-in-out"
                          // Ваша карусель использует ширину 50% для каждого слайда. 
                          // Я предполагаю, что это преднамеренно (показывает два изображения).
                          style={{ transform: `translateX(-${currentImageIndex * 50}%)` }} 
                        >
                          {modalImages.map((img, index) => (
                            <div key={index} className="w-1/2 flex-shrink-0 px-2">
                              <div 
                                className="relative cursor-pointer overflow-hidden rounded-lg"
                                // Изменена логика: зумировать только текущее изображение
                                onClick={() => { setCurrentImageIndex(index); setIsImageZoomed(true); }}
                              >
                                <img src={img} alt={`${post.title} - ${index + 1}`} className="w-full h-64 object-cover"/>
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-colors">
                                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {modalImages.length > 2 && ( // Здесь остается > 2, если вы хотите показывать навигацию, когда слайдов больше, чем помещается на экране (2)
                        <>
                          <button onClick={prevImage} className="absolute left-[-10px] top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                          </button>
                          <button onClick={nextImage} className="absolute right-[-10px] top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-6 h-6 text-gray-800" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="max-w-none text-gray-700 whitespace-pre-wrap">
                    {/* ИСПРАВЛЕНИЕ 3: post.text заменен на post.body */}
                    {post.body || ''} 
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-6 flex items-center justify-between text-sm text-gray-600">
                    <span className="font-semibold">Опубликовано: {formatDate(post.publish_date)}</span>
                    {post.author && <span className="font-semibold">Автор: {post.author}</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для зума */}
      {isImageZoomed && (
        <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4" onClick={() => setIsImageZoomed(false)}>
          <img src={modalImages[currentImageIndex]} alt={post.title} className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          {modalImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-4 rounded-full"><ChevronLeft className="w-8 h-8 text-white" /></button>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-4 rounded-full"><ChevronRight className="w-8 h-8 text-white" /></button>
            </>
          )}
          <button onClick={() => setIsImageZoomed(false)} className="absolute top-4 right-4 bg-white/20 p-3 rounded-full"><X className="w-7 h-7 text-white" /></button>
        </div>
      )}
    </>
  );
};

export default NewsModal;