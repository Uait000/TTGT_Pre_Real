import MainLayout from '@/components/MainLayout';
import { ExternalLink } from 'lucide-react';

const OnlineSurvey = () => {
    const surveys = [
        {
            id: 1,
            title: 'Анкета по оценке значимого отношения к экстремизму в детско-подростковой и молодёжной среде',
            url: 'https://forms.yandex.ru/u/67e62c0684227c4fd4332654/'
        },
        {
            id: 2,
            title: 'Анкета для опроса обучающихся об удовлетворенности качеством условий осуществления образовательной деятельности филиала РГУПС по образовательным программам среднего профессионального образования',
            url: 'https://forms.yandex.ru/u/67a9e062f47e737afdfdc05f/'
        },
        {
            id: 3,
            title: 'Анкета для опроса педагогических работников (преподавателей, мастеров производственного обучения) для выявления удовлетворенности качеством оказания образовательных услуг, условиями ведения образовательной деятельности в филиале ФГБОУ ВО РГУПС',
            url: 'https://forms.yandex.ru/u/67a9e188e010db7ba81208f5/'
        },
        {
            id: 4,
            title: 'Анкета для опроса работодателей об удовлетворенности качеством условий осуществления образовательной деятельности филиала РГУПС по образовательным программам среднего профессионального образования',
            url: 'https://forms.yandex.ru/u/67a9e22c02848f7c2f234803/'
        }
    ];

    return (

        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Онлайн-опрос</h1>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                    <div className="text-center mb-8">
                        <p className="text-lg text-foreground leading-relaxed">
                            Примите участие в опросах для улучшения качества образовательных услуг
                        </p>
                    </div>

                    <div className="space-y-6">
                        {surveys.map((survey) => (
                            <a
                                key={survey.id}
                                href={survey.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-white rounded-lg p-6 border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-foreground font-medium leading-relaxed group-hover:text-primary transition-colors">
                                            {survey.title}
                                        </h3>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-primary ml-4 group-hover:scale-110 transition-transform" />
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="mt-8 bg-white rounded-lg p-6 text-center">
                        <p className="text-muted-foreground text-sm">
                            Ваше мнение важно для нас! Участие в опросах поможет улучшить качество образовательных услуг.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default OnlineSurvey;