import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { ExternalLink, FileText, Snowflake, ClipboardCheck, Download, Loader2 } from 'lucide-react';
import { pageContentApi, ContentType, type PageContent } from '@/api/page-content';
import { BASE_URL } from '@/api/config';

const Memo = () => {
    const [documents, setDocuments] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const docs = await pageContentApi.getPublicAll(ContentType.Memo);
            setDocuments(docs);
        } catch (error) {
            console.error('Ошибка загрузки документов:', error);
            setDocuments([]);
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

    const mainDocument = documents.find(doc => doc.order_index === 0) || documents[0];
    const otherDocuments = documents.filter(doc => doc !== mainDocument);

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-12 text-center tracking-tight flex items-center justify-center">
                    <ClipboardCheck className="w-10 h-10 mr-4 text-accent" />
                    Памятки и документы
                </h1>
                
                <div className="space-y-10">
                    {/* Основной документ */}
                    {mainDocument && (
                        <section className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-blue-200 p-8 shadow-lg">
                            <div className="flex items-center mb-5">
                                <Snowflake className="w-10 h-10 text-blue-600 mr-4 flex-shrink-0" />
                                <h2 className="text-2xl font-bold text-blue-800">
                                    {mainDocument.title}
                                </h2>
                            </div>
                            
                            {mainDocument.description && (
                                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                                    {mainDocument.description}
                                </p>
                            )}
                            
                            {mainDocument.files && mainDocument.files.length > 0 && (
                                <a
                                    href={`${BASE_URL}/files/${mainDocument.files[0].id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    <FileText className="w-5 h-5 mr-2" />
                                    Скачать памятку
                                </a>
                            )}
                        </section>
                    )}

                    {/* Остальные документы */}
                    {otherDocuments.length > 0 && (
                        <section className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 p-8 shadow-inner">
                            <h2 className="text-2xl font-bold text-green-800 mb-4">
                                Дополнительные материалы
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {otherDocuments.map((doc, index) => {
                                    const fileUrl = doc.files && doc.files.length > 0 
                                        ? `${BASE_URL}/files/${doc.files[0].id}`
                                        : null;

                                    return (
                                        <a
                                            key={doc.id}
                                            href={fileUrl || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 hover:bg-white hover:border-green-400 hover:shadow-md transition-all duration-300 group"
                                        >
                                            <span className="text-foreground font-medium group-hover:text-green-700 transition-colors">
                                                {doc.title}
                                            </span>
                                            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                                        </a>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Если документов нет */}
                    {documents.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">Документы будут добавлены в ближайшее время</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Memo;