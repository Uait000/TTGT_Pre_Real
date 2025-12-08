import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { ExternalLink, ClipboardList, MessageCircleQuestion, ChevronRight, CheckCircle2 } from 'lucide-react';
import { settingsApi } from '@/api/settings';
import { Card, CardContent } from '@/components/ui/card';

const DEFAULT_SURVEYS = [
    { id: 1, title: 'Анкета по оценке значимого отношения к экстремизму в детско-подростковой и молодёжной среде', url: 'https://forms.yandex.ru/u/67e62c0684227c4fd4332654/' },
    { id: 2, title: 'Анкета для опроса обучающихся об удовлетворенности качеством условий осуществления образовательной деятельности', url: 'https://forms.yandex.ru/u/67a9e062f47e737afdfdc05f/' },
    { id: 3, title: 'Анкета для опроса педагогических работников для выявления удовлетворенности качеством оказания образовательных услуг', url: 'https://forms.yandex.ru/u/67a9e188e010db7ba81208f5/' },
    { id: 4, title: 'Анкета для опроса работодателей об удовлетворенности качеством условий осуществления образовательной деятельности', url: 'https://forms.yandex.ru/u/67a9e22c02848f7c2f234803/' }
];

const OnlineSurvey = () => {
    const [surveys, setSurveys] = useState(DEFAULT_SURVEYS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await settingsApi.getPageData('survey_page');
                
                let realData: any[] = [];
                if (data) {
                    if (Array.isArray(data)) {
                        realData = data;
                    } else if (data.items && Array.isArray(data.items)) {
                        realData = data.items;
                    } else if (typeof data === 'object') {
                        const values = Object.values(data);
                        if (values.length > 0) realData = values;
                    }
                }

                if (realData.length > 0) {
                    const mergedSurveys = realData.map((item: any, index: number) => {
                        const defaultSurvey = DEFAULT_SURVEYS[index] || {};
                        return {
                            id: item.id || defaultSurvey.id || index + 1,
                            title: item.title || defaultSurvey.title,
                            url: item.url || defaultSurvey.url || '#'
                        };
                    });
                    setSurveys(mergedSurveys);
                }
            } catch (error) {
                console.error('Error loading survey data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="h-12 w-12 bg-primary/20 rounded-full"></div>
                        <div className="h-4 w-48 bg-primary/20 rounded"></div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
             <div className="max-w-5xl mx-auto">
                {/* Заголовок страницы с иконкой */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 ring-8 ring-primary/5">
                        <MessageCircleQuestion className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Онлайн-опросы
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Ваше мнение важно для нас. Примите участие в опросах для улучшения качества образовательного процесса.
                    </p>
                </div>

                {/* Список опросов */}
                <div className="space-y-6">
                    {surveys.map((survey, index) => {
                        // Чередуем иконки для визуального разнообразия
                        const Icon = index % 2 === 0 ? ClipboardList : CheckCircle2;
                        const iconColorClass = index % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600';

                        return (
                        <a 
                            key={survey.id} 
                            href={survey.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block group relative"
                        >
                            <Card className="border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group-hover:-translate-y-1">
                                {/* Декоративный фон при наведении */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                
                                <CardContent className="p-6 sm:p-8 flex items-start gap-6 relative z-10">
                                    {/* Иконка слева */}
                                    <div className={`flex-shrink-0 p-4 rounded-2xl ${iconColorClass} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8" />
                                    </div>

                                    {/* Контент */}
                                    <div className="flex-1 pt-1">
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-primary transition-colors pr-8">
                                            {survey.title}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500 font-medium">
                                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                Яндекс Формы
                                            </span>
                                            <span className="ml-4 flex items-center gap-1 text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                                Нажмите, чтобы начать <ExternalLink className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Стрелка справа */}
                                    <div className="hidden sm:flex h-12 w-12 rounded-full bg-gray-50 items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 absolute right-6 top-1/2 -translate-y-1/2 shadow-sm group-hover:shadow-md group-hover:translate-x-2">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    )})}
                </div>

                {/* Нижний блок поддержки */}
                <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <p className="text-gray-600">
                        Благодарим за уделенное время! Ваши ответы помогают нам становиться лучше.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Все опросы анонимны.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
};

export default OnlineSurvey;