import { useState, useEffect } from 'react';
import { FileText, Download, Loader2, Briefcase, ExternalLink } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { postsApi, Post, PostCategory } from '@/api/posts';
import { BASE_URL } from '@/api/config';
import prov from '@/assets/pictures/prov.jpg';
import vac from '@/assets/pictures/vak_svar_gazstroy_2025.jpg';

// Компонент кнопки для файла/ссылки
const DocLink = ({ href, text, isFile = true }: { href: string, text: string, isFile?: boolean }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm shadow-sm hover:shadow-md ${
      isFile 
        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
    }`}
  >
    {isFile ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
    <span>{text}</span>
  </a>
);

const RailwayEmployers = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // Загружаем посты категории "Работодатели" (ID 13 - проверьте в api/posts.ts, какой ID у RailwayEmployers)
                // Если его нет в enum, используйте 13 напрямую
                const data = await postsApi.getPublicAll({ 
                    category: 13, // ID категории "Работодатели"
                    limit: 1000   // Загружаем много постов
                });
                setPosts(data);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const getFileUrl = (fileId: string) => `${BASE_URL.replace('/api', '')}/files/${fileId}`;

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50/50 py-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    
                    {/* Заголовок */}
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl mb-4">
                            <Briefcase size={32} />
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            Взаимодействие с профильными работодателями<br/>железнодорожного транспорта
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Актуальные вакансии, стажировки и предложения от ведущих компаний отрасли.
                        </p>
                    </div>

                    {/* Баннеры */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <img src={prov} alt="Партнеры" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <img src={vac} alt="Вакансии" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>

                    {/* Список вакансий */}
                    <div className="space-y-6">
                        {posts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">На данный момент вакансий нет</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <article 
                                    key={post.id} 
                                    className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            {/* Заголовок вакансии */}
                                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                            </h2>

                                            {/* Тело вакансии (HTML) */}
                                            <div 
                                                className="prose prose-blue max-w-none text-gray-600 mb-6 text-sm md:text-base leading-relaxed"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: post.body
                                                        .replace(/<img/g, '<img class="rounded-lg shadow-md my-4 w-full md:w-auto max-h-[400px] object-contain"') 
                                                        .replace(/<a/g, '<a class="text-blue-600 hover:underline font-medium"')
                                                }}
                                            />

                                            {/* Кнопки скачивания (если есть файлы в post.files) */}
                                            {post.files && post.files.length > 0 && (
                                                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                                                    {post.files.map((file, index) => (
                                                        <DocLink 
                                                            key={file.id} 
                                                            href={getFileUrl(file.id)} 
                                                            text={file.name || `Документ ${index + 1}`} 
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default RailwayEmployers;