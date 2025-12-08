import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, Loader2, Calendar, User, Image as ImageIcon } from 'lucide-react';
import { postsApi, Post, PostCategory } from '@/api/posts';
import { BASE_URL } from '@/api/config';

const Anniversary95 = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [slideIndices, setSlideIndices] = useState<{[key: number]: number}>({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await postsApi.getPublicAll({ category: PostCategory.Anniversary95, limit: 100 });
                console.log("Anniversary95 posts:", data);
                setPosts(data);

                const initialIndices: {[key: number]: number} = {};
                data.forEach(post => { initialIndices[post.id] = 0; });
                setSlideIndices(initialIndices);
            } catch (error) {
                console.error("Ошибка загрузки:", error);
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

    const nextSlide = (postId: number, total: number) => {
        setSlideIndices(prev => ({ ...prev, [postId]: (prev[postId] + 1) % total }));
    };

    const prevSlide = (postId: number, total: number) => {
        setSlideIndices(prev => ({ ...prev, [postId]: (prev[postId] - 1 + total) % total }));
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600"/>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4 tracking-wide uppercase">
                            Юбилейная дата
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                            95 лет <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ТТЖТ</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            История Тихорецкого техникума железнодорожного транспорта в лицах, событиях и воспоминаниях.
                        </p>
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <p className="text-xl text-gray-500">Разделы скоро появятся...</p>
                        </div>
                    ) : (
                        <div className="space-y-20">
                            {posts.map((post) => {
                                const currentSlide = slideIndices[post.id] || 0;
                                const hasFiles = post.files && post.files.length > 0;
                                const totalSlides = hasFiles ? post.files.length : 0;
                                const currentFile = hasFiles ? post.files[currentSlide] : null;
                                const mainImage = currentFile ? getImageUrl(currentFile) : null;

                                return (
                                    <article
                                        key={post.id}
                                        className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl flex flex-col"
                                    >
                                        {/* Image Gallery Section */}
                                        {mainImage && (
                                            <div className="relative w-full bg-gray-100 dark:bg-gray-800 group h-[500px]">
                                                <div
                                                    className="relative w-full h-full cursor-zoom-in overflow-hidden"
                                                    onClick={() => setSelectedImage(mainImage)}
                                                >
                                                    <img
                                                        src={mainImage}
                                                        alt={post.title}
                                                        // ИЗМЕНЕНИЕ: object-contain заменен на object-cover для заполнения всей ширины
                                                        className="w-full h-full object-cover bg-gray-100 dark:bg-gray-800 transition-transform duration-500 group-hover:scale-105"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                </div>

                                                {/* Image Navigation */}
                                                {totalSlides > 1 && (
                                                    <>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); prevSlide(post.id, totalSlides); }}
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-black/50 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                                        >
                                                            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); nextSlide(post.id, totalSlides); }}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-black/50 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                                        >
                                                            <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
                                                        </button>

                                                        {/* Counter Badge */}
                                                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
                                                            <div className="flex items-center gap-1">
                                                                <ImageIcon size={12} />
                                                                <span>{currentSlide + 1} / {totalSlides}</span>
                                                            </div>
                                                        </div>

                                                        {/* Dots Indicators */}
                                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                                            {post.files.map((_, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={(e) => { e.stopPropagation(); setSlideIndices(prev => ({ ...prev, [post.id]: idx })); }}
                                                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                                                        idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Content Section */}
                                        <div className="p-8 md:p-12 lg:p-16">
                                            {/* Title */}
                                            {/* ИЗМЕНЕНИЕ: Размер заголовка уменьшен с text-3xl md:text-5xl на text-2xl md:text-4xl */}
                                            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                                {post.title}
                                            </h2>

                                            {/* Meta Data */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                                                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg text-blue-700 dark:text-blue-300 font-medium">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(post.publish_date)}
                                                </div>

                                                {post.author && post.author !== 'Администрация' && (
                                                    <>
                                                        <div className="hidden sm:block w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                                        <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                                                            <User className="w-4 h-4 text-blue-600" />
                                                            {post.author}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Body Text */}
                                            <div
                                                className="prose prose-lg prose-blue dark:prose-invert max-w-none w-full leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: post.body
                                                        .replace(/<img/g, '<img class="rounded-xl shadow-lg my-8 w-full object-cover max-h-[600px]"')
                                                        .replace(/<p>/g, '<p class="mb-6 text-gray-700 dark:text-gray-300">')
                                                }}
                                            />
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Lightbox for Zoomed Image */}
                <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                    <DialogContent className="max-w-[98vw] max-h-[98vh] w-auto h-auto p-0 border-none bg-transparent shadow-none flex justify-center items-center outline-none">
                        <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
                        <div className="relative">
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 sm:-right-12 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 transition-all group"
                            >
                                <X className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                            </button>
                            {selectedImage && (
                                <img
                                    src={selectedImage}
                                    alt="Full screen"
                                    className="max-w-[95vw] max-h-[95vh] rounded-lg shadow-2xl object-contain"
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
};

export default Anniversary95;