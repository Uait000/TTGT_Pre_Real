import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { vacanciesApi } from '@/api/vacancies';
import type { Vacancy } from '@/api/config';

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
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Вакансии</h1>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Загрузка...</p>
                        </div>
                    ) : vacancies.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Нет доступных вакансий</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {vacancies.map((vacancy) => (
                                <div key={vacancy.id} className="bg-white rounded-lg p-6 border border-border hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-primary mb-2">{vacancy.title}</h3>
                                            <p className="text-muted-foreground mb-2">{vacancy.department}</p>
                                            <p className="text-foreground font-medium">{vacancy.salary}</p>
                                            {vacancy.description && (
                                                <p className="text-muted-foreground mt-3">{vacancy.description}</p>
                                            )}
                                        </div>
                                        <div className="text-4xl">💼</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="mt-8 bg-white rounded-lg p-6 text-center">
                        <p className="text-muted-foreground">
                            По вопросам трудоустройства обращайтесь в отдел кадров техникума
                        </p>
                        <p className="text-primary font-semibold mt-2">
                            Телефон: 8 (86196) 6-20-03
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Vacancies;