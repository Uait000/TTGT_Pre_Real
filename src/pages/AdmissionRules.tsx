import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { FileText, Download, Loader2 } from 'lucide-react';
import { pageContentApi, ContentType, type PageContent } from '@/api/page-content';
import { BASE_URL } from '@/api/config';
import book from '@/assets/pictures/books-bookstore-book-reading-159711.jpeg';

const AdmissionRules = () => {
    const [documents, setDocuments] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const docs = await pageContentApi.getPublicAll(ContentType.AdmissionRules);
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

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Правила приема</h1>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                    {/* Изображение */}
                    <div className="w-full aspect-[16/6] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden shadow-lg mb-8">
                        <img
                            src={book}
                            alt="Правила приема"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="bg-white rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-primary mb-6 text-center">
                            {documents.length > 0 ? 'Нормативные документы' : 'Документы'}
                        </h2>
                        
                        {documents.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">Документы будут добавлены в ближайшее время</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {documents.map((doc, index) => {
                                    const fileUrl = doc.files && doc.files.length > 0 
                                        ? `${BASE_URL}/files/${doc.files[0].id}`
                                        : null;

                                    return (
                                        <a
                                            key={doc.id}
                                            href={fileUrl || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-start space-x-4 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                                        >
                                            <FileText className="w-5 h-5 text-primary group-hover:text-primary-hover transition-colors flex-shrink-0 mt-0.5" />
                                            <span className="text-foreground font-medium group-hover:text-primary transition-colors leading-relaxed">
                                                {doc.title}
                                            </span>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AdmissionRules;