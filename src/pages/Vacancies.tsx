import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { vacanciesApi } from '@/api/vacancies';
import type { Vacancy } from '@/api/config';
import { Briefcase, MapPin, Banknote, Phone, Clock, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Vacancies = () => {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVacancies = async () => {
            try {
                const data = await vacanciesApi.getPublicAll();
                setVacancies(data);
            } catch (error) {
                console.error('Failed to load vacancies:', error);
            } finally {
                setLoading(false);
            }
        };

        loadVacancies();
    }, []);

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight flex items-center justify-center gap-3">
                        <Briefcase className="w-10 h-10 md:w-12 md:h-12 text-accent" />
                        Вакансии
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Присоединяйтесь к команде профессионалов ТТЖТ - филиала РГУПС
                    </p>
                </div>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border/50 p-6 md:p-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                             <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                             <p className="text-muted-foreground animate-pulse">Загрузка списка вакансий...</p>
                        </div>
                    ) : vacancies.length === 0 ? (
                        <div className="text-center py-16 bg-white/50 rounded-xl border border-dashed border-gray-300">
                            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl font-medium text-gray-600">В данный момент открытых вакансий нет</p>
                            <p className="text-muted-foreground mt-2">Пожалуйста, загляните позже или свяжитесь с отделом кадров.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {vacancies.map((vacancy) => (
                                <Card key={vacancy.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary overflow-hidden bg-white">
                                    <CardContent className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                                                        {vacancy.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                                            <Building2 className="w-4 h-4" />
                                                            {vacancy.department || "Общий отдел"}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                                            <MapPin className="w-4 h-4" />
                                                            г. Тихорецк
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                                            <Clock className="w-4 h-4" />
                                                            Полная занятость
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Описание вакансии с поддержкой HTML (из Rich Text) */}
                                                {vacancy.description && (
                                                    <div 
                                                        className="text-gray-600 leading-relaxed text-base rich-text-content border-l-2 border-gray-100 pl-4 ml-1"
                                                        dangerouslySetInnerHTML={{ __html: vacancy.description }}
                                                    />
                                                )}
                                            </div>

                                            {/* Блок с зарплатой */}
                                            <div className="flex-shrink-0 md:text-right">
                                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-3 rounded-xl border border-green-100">
                                                    <Banknote className="w-6 h-6" />
                                                    <span className="text-xl font-bold whitespace-nowrap">
                                                        {vacancy.salary ? `${vacancy.salary}` : "По договоренности"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    
                    <div className="mt-12 bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm max-w-2xl mx-auto">
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Не нашли подходящую вакансию?</h4>
                        <p className="text-muted-foreground mb-6">
                            Свяжитесь с отделом кадров, возможно, мы просто еще не успели опубликовать то, что вам нужно.
                        </p>
                        <div className="inline-flex items-center justify-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary/20 transition-colors cursor-pointer">
                            <Phone className="w-5 h-5" />
                            <span>8 (86196) 6-20-03</span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Vacancies;