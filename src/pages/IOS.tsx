// src/pages/IOS.tsx
import MainLayout from '@/components/MainLayout'; 
import { ExternalLink, FileText, AlignLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import iosContentApi, { type IOSContent } from '@/api/ios-content';
import { BASE_URL } from '@/api/config';

// Расширяем интерфейс, так как API может возвращать text_content, который мы добавили
interface ExtendedIOSContent extends IOSContent {
    text_content?: string;
}

const IOS = () => {
    // Храним данные сгруппированными по типам: { "Название раздела": [массив элементов] }
    const [groupedContent, setGroupedContent] = useState<Record<string, ExtendedIOSContent[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            setIsLoading(true);
            const data = await iosContentApi.getAll();
            
            // 1. Фильтруем опубликованные
            const publishedContent = data.filter(item => item.is_published) as ExtendedIOSContent[];

            // 2. Группируем по полю type (которое теперь мы пишем вручную)
            const groups: Record<string, ExtendedIOSContent[]> = {};
            
            publishedContent.forEach(item => {
                const typeName = item.type || 'Прочее'; // Если тип не указан, кидаем в "Прочее"
                if (!groups[typeName]) {
                    groups[typeName] = [];
                }
                groups[typeName].push(item);
            });

            // 3. Сортируем элементы внутри групп по order_index
            Object.keys(groups).forEach(key => {
                groups[key].sort((a, b) => a.order_index - b.order_index);
            });

            setGroupedContent(groups);
        } catch (error) {
            console.error('Ошибка загрузки контента IOS:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для получения URL
    const getFileUrl = (item: ExtendedIOSContent) => {
        if (item.external_url) {
            return item.external_url;
        }
        
        if (item.files && item.files.length > 0) {
            if (item.files[0].url && item.files[0].url.startsWith('http')) {
                return item.files[0].url;
            }
            if (item.files[0].id) {
                return `${BASE_URL}/files/${item.files[0].id}`;
            }
        }
        
        // Fallback для старых данных
        if (item.file_url) {
            return item.file_url.startsWith('http') ? item.file_url : `${BASE_URL}${item.file_url}`;
        }
        
        return '#';
    };

    // Проверка, есть ли ссылка/файл (чтобы рисовать кнопку)
    const hasLink = (item: ExtendedIOSContent) => {
        return !!(item.external_url || (item.files && item.files.length > 0) || item.file_url);
    };

    // Проверка, является ли ссылка внешней (для иконки)
    const isExternal = (item: ExtendedIOSContent) => {
        return !!item.external_url;
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Получаем список разделов (ключей) и сортируем их (опционально можно добавить логику порядка разделов)
    const sectionKeys = Object.keys(groupedContent).sort();

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-2 text-center">Электронная информационно-образовательная среда</h1>
                <p className="text-center text-muted-foreground mb-12">Доступ к информационным системам и образовательным ресурсам</p>
                
                <div className="space-y-12">
                    {sectionKeys.length > 0 ? (
                        sectionKeys.map((sectionTitle) => (
                            <section key={sectionTitle}>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-l-4 border-primary pl-4">
                                    {sectionTitle}
                                </h2>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    {groupedContent[sectionTitle].map((item) => (
                                        <div 
                                            key={item.id} 
                                            className="bg-white rounded-lg border border-gray-200 p-5 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                                        >
                                            {/* 1. Заголовок элемента */}
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {item.title}
                                            </h3>

                                            {/* 2. Текстовый контент (HTML из редактора) */}
                                            {item.text_content && (
                                                <div 
                                                    className="prose prose-sm max-w-none text-gray-600 mb-4"
                                                    dangerouslySetInnerHTML={{ __html: item.text_content }}
                                                />
                                            )}

                                            {/* 3. Кнопка/Ссылка на файл или ресурс (если есть) */}
                                            {hasLink(item) && (
                                                <div className="mt-3">
                                                    <a 
                                                        href={getFileUrl(item)} 
                                                        target="_blank"
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center px-4 py-2 bg-gray-50 text-primary rounded-md hover:bg-primary hover:text-white transition-colors text-sm font-medium border border-gray-200 hover:border-primary"
                                                    >
                                                        {isExternal(item) ? (
                                                            <>
                                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                                Перейти к ресурсу
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FileText className="w-4 h-4 mr-2" />
                                                                Открыть документ
                                                            </>
                                                        )}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            Информация пока не добавлена
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default IOS;