import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronRight, ChevronLeft, X, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { postsApi, Post, PostCategory } from '@/api/posts';
import { BASE_URL } from '@/api/config';

const Victory80 = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [slideIndices, setSlideIndices] = useState<{[key: number]: number}>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Запрашиваем посты категории "80 лет Победы"
        const data = await postsApi.getPublicAll({ category: PostCategory.Victory80, limit: 100 });
        setPosts(data);
        
        const initialIndices: {[key: number]: number} = {};
        data.forEach(post => { initialIndices[post.id] = 0; });
        setSlideIndices(initialIndices);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getImageUrl = (file: any) => {
      if (!file) return '';
      if (typeof file === 'string') {
           if (file.startsWith('http')) return file;
           return `${BASE_URL}${file}`;
      }
      if (file.url) {
           if (file.url.startsWith('http')) return file.url;
           return `${BASE_URL}${file.url}`;
      }
      if (file.id) {
          return `${BASE_URL}/files/${file.id}`;
      }
      return '';
  };

  const nextSlide = (postId: number, totalImages: number) => {
    setSlideIndices(prev => ({
        ...prev,
        [postId]: (prev[postId] + 1) % totalImages
    }));
  };

  const prevSlide = (postId: number, totalImages: number) => {
    setSlideIndices(prev => ({
        ...prev,
        [postId]: (prev[postId] - 1 + totalImages) % totalImages
    }));
  };

  if (loading) {
      return (
          <MainLayout>
              <div className="flex justify-center items-center h-[50vh]">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
          </MainLayout>
      );
  }

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm border border-border p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">80 лет Великой Победы</h1>

        {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">Разделы скоро появятся...</p>
        ) : (
            <Accordion type="single" collapsible className="space-y-4">
            {posts.map((post) => {
                const currentSlide = slideIndices[post.id] || 0;
                
                // === ВАРИАНТ 1: ГАЛЕРЕЯ (Только картинки сеткой) ===
                // 4 - это индекс "Галерея (Сетка картинок)" в POST_TAGS (проверьте в PostForm.tsx)
                if (post.type === 4) { 
                    return (
                        <AccordionItem key={post.id} value={`item-${post.id}`} className="border border-border rounded-lg">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                <h2 className="text-2xl font-bold text-primary text-left">{post.title}</h2>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {post.files && post.files.map((file, index) => (
                                            <div 
                                                key={index} 
                                                className="aspect-[3/4] bg-white rounded-lg overflow-hidden cursor-pointer shadow-sm border border-border hover:shadow-md transition-all"
                                                onClick={() => setSelectedImage(getImageUrl(file))}
                                            >
                                                <img 
                                                    src={getImageUrl(file)} 
                                                    alt="Фото" 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => (e.target as HTMLImageElement).src = '/placeholder-image.jpg'}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {/* Если есть текст, показываем его под галереей с классом rich-text-content */}
                                    {post.body && post.body.trim().length > 5 && (
                                        <div 
                                            className="prose max-w-none text-foreground leading-relaxed mt-6 pt-6 border-t border-border/30 rich-text-content"
                                            dangerouslySetInnerHTML={{ __html: post.body }}
                                        />
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                }

                // === ВАРИАНТ 2: СТАНДАРТНЫЙ ПОСТ (Текст + Слайдер + АВТОР) ===
                const currentFile = post.files && post.files.length > 0 ? post.files[currentSlide] : null;
                const imageUrl = currentFile ? getImageUrl(currentFile) : null;

                return (
                    <AccordionItem key={post.id} value={`item-${post.id}`} className="border border-border rounded-lg">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <h2 className="text-2xl font-bold text-primary text-left">{post.title}</h2>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6">
                            {/* Блок с Автором и Датой */}
                            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-muted-foreground border-b border-border/30 pb-4">
                                <p className="mb-2 sm:mb-0">
                                    <strong>Автор:</strong> <span className="text-foreground">{post.author || 'Администрация'}</span>
                                </p>
                                <p>
                                    <strong>Создано:</strong> {new Date(post.publish_date * 1000).toLocaleDateString()}
                                </p>
                            </div>

                            {imageUrl && (
                                <div className="relative max-w-4xl mx-auto mb-6">
                                    <div 
                                        className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden shadow-lg cursor-pointer flex items-center justify-center bg-gray-100"
                                        onClick={() => setSelectedImage(imageUrl)}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>

                                    {post.files && post.files.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); prevSlide(post.id, post.files.length); }}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                                            >
                                                <ChevronLeft className="w-6 h-6 text-primary" />
                                            </button>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); nextSlide(post.id, post.files.length); }}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                                            >
                                                <ChevronRight className="w-6 h-6 text-primary" />
                                            </button>

                                            <div className="flex justify-center space-x-2 mt-4 flex-wrap gap-y-2">
                                                {post.files.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSlideIndices(prev => ({ ...prev, [post.id]: index }))}
                                                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                                            index === (slideIndices[post.id] || 0) ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Добавлен класс rich-text-content для текста */}
                            <div 
                                className="prose max-w-none text-foreground leading-relaxed rich-text-content"
                                dangerouslySetInnerHTML={{ __html: post.body }}
                            />
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                );
            })}
            </Accordion>
        )}
      </div>
      
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="w-auto max-h-[90vh] p-0 border-none bg-transparent shadow-none flex justify-center">
          <DialogTitle className="sr-only">Изображение</DialogTitle>
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Увеличенное изображение"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Victory80;