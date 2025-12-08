import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { Download, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { pageContentApi, ContentType, type PageContent } from '@/api/page-content';
import { BASE_URL } from '@/api/config';

const AdmissionNumbers = () => {
    const [content, setContent] = useState<PageContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const contents = await pageContentApi.getPublicAll(ContentType.AdmissionNumbers);
            // Берем первый опубликованный контент или null если нет
            setContent(contents.length > 0 ? contents[0] : null);
        } catch (error) {
            console.error('Ошибка загрузки контента:', error);
            setContent(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </MainLayout>
        );
    }

    if (!content) {
        return (
            <MainLayout>
                <div className="bg-white rounded-lg shadow-sm border border-border p-8 text-center">
                    <h1 className="text-3xl font-bold text-primary mb-4">Контрольные цифры приема</h1>
                    <p className="text-gray-600">Информация будет доступна в ближайшее время</p>
                </div>
            </MainLayout>
        );
    }

    const imageUrl = content.image_url 
        ? (content.image_url.startsWith('http') ? content.image_url : `${BASE_URL}/files/${content.image_url}`)
        : null;
    
    const fileUrl = content.files && content.files.length > 0 
        ? `${BASE_URL}/files/${content.files[0].id}`
        : null;

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Контрольные цифры приема</h1>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                    {/* Изображение */}
                    {imageUrl && (
                        <div className="w-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden shadow-lg mb-6">
                            <img
                                src={imageUrl}
                                alt={content.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Описание */}
                    {content.description && (
                        <div className="text-center mb-6">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {content.description}
                            </p>
                        </div>
                    )}

                    {/* Кнопка скачивания */}
                    {fileUrl && (
                        <div className="text-center">
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-3 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <Download className="w-5 h-5" />
                                <span>Скачать контрольные цифры приема</span>
                            </a>
                        </div>
                    )}

                    {/* Если нет файла, но есть описание */}
                    {!fileUrl && content.description && (
                        <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <FileText className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                            <p className="text-yellow-800 font-medium">
                                Файл для скачивания будет доступен в ближайшее время
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default AdmissionNumbers;