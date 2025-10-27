import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
// ИСХОДНОЕ ИСПРАВЛЕНИЕ: Импортируем POST_TAGS и Post (а не IncompletePost)
import { POST_TAGS, Post } from '@/api/posts'; 
import { BASE_URL } from '@/api/config';

interface NewsCardProps {
    // Используем Post, который теперь включает author и views
    post: Post; 
    onReadMore: (post: Post) => void;
}

const NewsCard = ({ post, onReadMore }: NewsCardProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!post || !post.title || !post.id) {
        return null;
    }

    // ✅ ИСПРАВЛЕНИЕ: Логика сборки URL картинок
    const images: string[] = [];
    const cleanBaseUrl = BASE_URL.replace('/api', '');

    // Используем post.files (как в IncompletePost), где каждый элемент - BackendFile
    if (Array.isArray(post.files) && post.files.length > 0) { 
        // В BackendFile есть id: string, который используется для ссылки
        post.files.forEach((file) => { 
            if (file && file.id) {
                const fullUrl = `${cleanBaseUrl}/files/${file.id}`; 
                images.push(fullUrl);
            }
        });
    } 
    // Старая логика для совместимости, если картинки приходят в других полях
    // post.image_urls отсутствует в Post, но оставляем на всякий случай, если оно может прийти динамически (пока игнорируем, если подчеркнуто)
    /*
    else if ((post as any).image_urls && (post as any).image_urls.length > 0) {
        (post as any).image_urls.forEach((url: string) => {
            if (url) {
                const fullUrl = url.startsWith('http') ? url : `${cleanBaseUrl}${url}`;
                images.push(fullUrl);
            }
        });
    }
    */
    // Примечание: post.image_urls отсутствует в Post. Если оно действительно нужно, его нужно добавить в интерфейс Post.

    const hasMultipleImages = images.length > 1;
    const hasImage = images.length > 0;

    // post.body используется, что соответствует IncompletePost
    const postText = post.body || ''; 
    const snippet = postText.replace(/<[^>]*>?/gm, '').substring(0, 150);

    const formatDate = (dateInSeconds: number) => {
        if (!dateInSeconds) return '';
        const date = new Date(dateInSeconds * 1000);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        }
    };

    const handleReadMoreClick = () => {
        onReadMore(post);
    };

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

    return (
        <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
            <div className="relative group flex-shrink-0">
                {hasImage ? (
                    <>
                        <img
                            src={images[currentImageIndex]}
                            alt={post.title}
                            className="w-full h-56 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                            onClick={handleReadMoreClick}
                        />
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                                    aria-label="Предыдущее изображение"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                                    aria-label="Следующее изображение"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                    {images.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                index === currentImageIndex ? 'bg-white w-6' : 'bg-white/60'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-white/40" />
                    </div>
                )}

                <div className="absolute top-3 left-3 z-10">
                    {getCategoryBadge(post.type)}
                </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {snippet}
                    </p>
                </div>

                <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{formatDate(post.publish_date)}</span>
                    </div>

                    {post.author && (
                        <div className="text-xs text-gray-600 mb-3">
                            <span className="font-medium">Автор: {post.author}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            {/* post.views теперь доступно, если вы внесли изменение в posts.ts */}
                            <span>{post.views || 0}</span> 
                        </div>

                        <button
                            onClick={handleReadMoreClick}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors hover:underline"
                        >
                            Читать →
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default NewsCard;