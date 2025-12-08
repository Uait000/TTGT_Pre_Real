// src/pages/StateExam.tsx
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { ExternalLink, CalendarDays, FileText, BookOpen, ArrowRight, Download, Loader2 } from 'lucide-react';
import { pageContentApi, ContentType, type PageContent } from '@/api/page-content';
import { BASE_URL } from '@/api/config';

type ActiveTab = 'schedule' | 'programs' | 'recommendations';

const StateExam = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('schedule');
    const [scheduleDocuments, setScheduleDocuments] = useState<PageContent[]>([]);
    const [programDocuments, setProgramDocuments] = useState<PageContent[]>([]);
    const [recommendationDocuments, setRecommendationDocuments] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            // ИСПРАВЛЕНИЕ ЗДЕСЬ:
            // Передаем параметры как объект { blockType: '...' }, а не как строку.
            // Также добавляем limit: 1000, чтобы загрузить все файлы.
            const [schedules, programs, recommendations] = await Promise.all([
                pageContentApi.getPublicAll(ContentType.StateExam, { blockType: 'schedule', limit: 1000 }),
                pageContentApi.getPublicAll(ContentType.StateExam, { blockType: 'programs', limit: 1000 }),
                pageContentApi.getPublicAll(ContentType.StateExam, { blockType: 'recommendations', limit: 1000 })
            ]);

            // Дополнительная фильтрация на клиенте для надежности
            // (на случай если в базе данных есть старые записи с неправильными типами)
            setScheduleDocuments(schedules.filter(doc => doc.content_type === 'schedule'));
            setProgramDocuments(programs.filter(doc => doc.content_type === 'programs'));
            setRecommendationDocuments(recommendations.filter(doc => doc.content_type === 'recommendations'));

        } catch (error) {
            console.error('Ошибка загрузки документов:', error);
            setScheduleDocuments([]);
            setProgramDocuments([]);
            setRecommendationDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const TabButton = ({ tabId, title, icon: Icon }: { tabId: ActiveTab; title: string; icon: React.ElementType }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex-1 p-5 text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 border-b-4 ${
                activeTab === tabId
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
            <Icon className="w-6 h-6" />
            <span>{title}</span>
        </button>
    );

    const getFileUrl = (doc: PageContent) => {
        if (doc.link) {
            return doc.link;
        }
        if (doc.files && doc.files.length > 0) {
            return `${BASE_URL}/files/${doc.files[0].id}`;
        }
        if (doc.file_url) {
            return doc.file_url;
        }
        return null;
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
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                        <span className="text-5xl mr-2">🎓</span>
                        Государственная Итоговая Аттестация
                    </h1>
                    <p className="text-lg text-gray-600">
                        {scheduleDocuments.length > 0 && scheduleDocuments[0].schedule_start && scheduleDocuments[0].schedule_end 
                            ? `График проведения ГИА с ${scheduleDocuments[0].schedule_start} по ${scheduleDocuments[0].schedule_end}`
                            : 'Все необходимые документы для подготовки к ГИА'
                        }
                    </p>
                </div>
                
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-t-2xl shadow-xl border border-gray-200 flex overflow-hidden flex-col sm:flex-row">
                        <TabButton tabId="schedule" title="График ГИА" icon={CalendarDays} />
                        <TabButton tabId="programs" title="Программы" icon={BookOpen} />
                        <TabButton tabId="recommendations" title="Рекомендации" icon={FileText} />
                    </div>
                    
                    <div className="bg-white rounded-b-2xl shadow-xl border border-t-0 border-gray-200 p-8 min-h-[400px]">
                        {/* Вкладка ГРАФИК */}
                        {activeTab === 'schedule' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    График проведения ГИА
                                </h2>
                                {scheduleDocuments.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <CalendarDays className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg">График будет опубликован в ближайшее время</p>
                                        <p className="text-sm text-gray-400 mt-2">с 15.06.2025 г. по 28.06.2025</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {scheduleDocuments.map((doc) => {
                                            const fileUrl = getFileUrl(doc);

                                            return (
                                                <div key={doc.id} className="flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                                        <CalendarDays className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                        {doc.title}
                                                    </h3>
                                                    {doc.description && (
                                                        <p className="text-gray-600 mb-4 max-w-2xl">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                    {fileUrl && (
                                                        <a
                                                            href={fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-3 py-3 px-8 bg-primary text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                                                        >
                                                            <Download className="w-5 h-5" />
                                                            {doc.button_text || 'Скачать график (PDF)'}
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Вкладка ПРОГРАММЫ */}
                        {activeTab === 'programs' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Программы государственной итоговой аттестации
                                </h2>
                                {programDocuments.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg">Программы будут добавлены в ближайшее время</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        {programDocuments.map((doc) => {
                                            const fileUrl = getFileUrl(doc);

                                            return (
                                                <a
                                                    key={doc.id}
                                                    href={fileUrl || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex justify-between items-center p-4 rounded-xl transition-all duration-300 hover:bg-primary/10 hover:shadow-lg border border-transparent hover:border-primary/20"
                                                >
                                                    <span className="text-base font-medium text-gray-700 group-hover:text-primary transition-colors pr-4">
                                                        {doc.title}
                                                    </span>
                                                    <div className="flex-shrink-0 text-primary/60 group-hover:text-primary transition-all duration-300">
                                                        {fileUrl ? (
                                                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                                        ) : (
                                                            <FileText className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Вкладка РЕКОМЕНДАЦИИ */}
                        {activeTab === 'recommendations' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Методические рекомендации
                                </h2>
                                {recommendationDocuments.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg">Рекомендации будут добавлены в ближайшее время</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {recommendationDocuments.map((doc) => {
                                            const fileUrl = getFileUrl(doc);

                                            return (
                                                <a
                                                    key={doc.id}
                                                    href={fileUrl || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-start gap-3 p-4 rounded-lg hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20"
                                                >
                                                    <FileText className="w-4 h-4 text-primary/70 mt-1 flex-shrink-0" />
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                                                        {doc.title}
                                                    </span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default StateExam;