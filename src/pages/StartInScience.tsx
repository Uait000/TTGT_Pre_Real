import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { ExternalLink, FileText, Download, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { pageContentApi, ContentType, type PageContent } from '@/api/page-content';
import { BASE_URL } from '@/api/config';

const StartInScience = () => {
    const [documents, setDocuments] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const docs = await pageContentApi.getPublicAll(ContentType.StartInScience);
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
                <h1 className="text-3xl font-bold text-primary mb-4 text-center">
                    Региональная студенческая исследовательская конференция "Старт в науку"
                </h1>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8">
                    <p className="text-center text-foreground leading-relaxed">
                        Ежегодная региональная студенческая исследовательская конференция (с международным участием), посвящённая Десятилетию науки и технологий в Российской Федерации
                    </p>
                </div>

                {sortedYears.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">Материалы конференции будут добавлены в ближайшее время</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="space-y-4">
                        {sortedYears.map((year) => (
                            <AccordionItem key={year} value={`year-${year}`} className="border border-border rounded-lg">
                                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                    <h2 className="text-2xl font-bold text-primary">{year} год</h2>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6">
                                    <div className="space-y-3">
                                        {documentsByYear[year].map((doc) => {
                                            const fileUrl = doc.files && doc.files.length > 0 
                                                ? `${BASE_URL}/files/${doc.files[0].id}`
                                                : null;

                                            return (
                                                <a
                                                    key={doc.id}
                                                    href={fileUrl || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3 flex-1">
                                                            <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                                            <span className="text-foreground font-medium text-sm">{doc.title}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {fileUrl && (
                                                                <Download className="w-4 h-4 text-primary flex-shrink-0" />
                                                            )}
                                                            <ExternalLink className="w-5 h-5 text-primary flex-shrink-0" />
                                                        </div>
                                                    </div>
                                                    {doc.description && (
                                                        <p className="text-sm text-gray-600 mt-2 ml-8">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
        </MainLayout>
    );
};

export default StartInScience;