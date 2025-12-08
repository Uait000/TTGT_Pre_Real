import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { FileText, Download, Loader2 } from 'lucide-react';
import { pageContentApi, ContentType, type PageContent } from '@/api/page-content';
import { BASE_URL } from '@/api/config';
import rushabel from '@/assets/pictures/ria_8451769hr_c79.webp';

const RussiaBelarusConference = () => {
    const [documents, setDocuments] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const docs = await pageContentApi.getPublicAll(ContentType.RussiaBelarus);
            setDocuments(docs);
        } catch (error) {
            console.error('Ошибка загрузки документов:', error);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    // Группируем документы по годам
    const documentsByYear = documents.reduce((acc, doc) => {
        const year = doc.year || new Date().getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(doc);
        return acc;
    }, {} as Record<number, PageContent[]>);

    // Сортируем года по убыванию
    const sortedYears = Object.keys(documentsByYear)
        .map(Number)
        .sort((a, b) => b - a);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Россия и Беларусь - вехи общей истории</h1>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                    {/* Изображение */}
                    <div className="w-full aspect-[16/6] bg-gradient-to-br from-red-100 to-red-200 rounded-lg overflow-hidden shadow-lg mb-8">
                        <img
                            src={rushabel}
                            alt="Россия и Беларусь - вехи общей истории"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {sortedYears.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">Материалы конференции будут добавлены в ближайшее время</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {sortedYears.map((year) => {
                                const yearDocuments = documentsByYear[year];
                                const yearColor = yearDocuments[0]?.color || '#3b82f6';

                                return (
                                    <div key={year} className="bg-white rounded-lg p-6 shadow-sm">
                                        <h2 
                                            className="text-2xl font-bold mb-6 border-b pb-3"
                                            style={{ color: yearColor, borderColor: yearColor }}
                                        >
                                            {year} год:
                                        </h2>
                                        <div className="space-y-4">
                                            {yearDocuments.map((doc) => {
                                                const fileUrl = doc.files && doc.files.length > 0 
                                                    ? `${BASE_URL}/files/${doc.files[0].id}`
                                                    : null;

                                                return (
                                                    <a
                                                        key={doc.id}
                                                        href={fileUrl || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-start space-x-4 p-4 rounded-lg border hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                                                        style={{ 
                                                            background: `linear-gradient(to right, ${yearColor}10, ${yearColor}05)`,
                                                            borderColor: `${yearColor}30`
                                                        }}
                                                    >
                                                        <FileText 
                                                            className="w-5 h-5 transition-colors flex-shrink-0 mt-0.5" 
                                                            style={{ color: yearColor }}
                                                        />
                                                        <div className="flex-1">
                                                            <span 
                                                                className="font-medium group-hover:underline transition-colors leading-relaxed"
                                                                style={{ color: yearColor }}
                                                            >
                                                                {doc.title}
                                                            </span>
                                                            {doc.description && (
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {doc.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {fileUrl && (
                                                            <Download 
                                                                className="w-4 h-4 flex-shrink-0 mt-0.5" 
                                                                style={{ color: yearColor }}
                                                            />
                                                        )}
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default RussiaBelarusConference;