import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { settingsApi } from '@/api/settings';

import dover from '@/assets/pictures/tel_dov_deti.jpg';
import pam from '@/assets/pictures/2.jpg';

const DEFAULT_CONTENT = `<p>С 1 по 10 июня 2024 года в ТТЖТ – филиале РГУПС проводится оперативно-профилактическое мероприятие «Защита».</p>
<p><strong>Цель:</strong> выявление и пресечение преступных посягательств в отношении детей, установление лиц, жестоко обращающихся с ними, совершающих насильственные действия, вовлекающих подростков в совершение антиобщественных действий, а также родителей, законных представителей, иных членов их семей, нарушающих права и законные интересы несовершеннолетних.</p>`;

const EducationalWork = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [data, setData] = useState({
        slides: [dover, pam],
        title: "ОПЕРАТИВНО – ПРОФИЛАКТИЧЕСКОЕ МЕРОПРИЯТИЕ «ЗАЩИТА» С 1 ПО 10 ИЮНЯ 2024 ГОДА В ТТЖТ – ФИЛИАЛЕ РГУПС",
        content: DEFAULT_CONTENT,
        documents: [
            { title: "Закон на защите детства", file: "#" },
            { title: "Детство без насилия и жестокости (консультация для родителей)", file: "#" },
            { title: "Консультативная беседа с родителями на тему: 'Воспитание без насилия'", file: "#" },
            { title: "Памятка для родителей (заповеди)", file: "#" },
            { title: "Предупреждение преступлений в отношении детей, защита их жизни и здоровья...", file: "#" },
            { title: "Принципы семейного благополучия. Основные параметры неправильного воспитания", file: "#" },
            { title: "Поведение родителей в конфликте с подростком (рекомендации)", file: "#" }
        ]
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const settings = await settingsApi.getPageData('educational_work_page');
                if (settings) {
                    setData(prevData => ({
                        ...prevData,
                        ...settings,
                        slides: (settings.slides && settings.slides.length > 0) ? settings.slides : prevData.slides,
                        title: settings.title || prevData.title,
                        content: settings.content || prevData.content,
                        documents: (settings.documents && settings.documents.length > 0) ? settings.documents : prevData.documents
                    }));
                }
            } catch (error) {
                console.error('Error loading educational work data:', error);
            }
        };
        loadData();
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % data.slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + data.slides.length) % data.slides.length);

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Воспитательная работа</h1>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                    <div className="relative max-w-4xl mx-auto mb-8">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <img src={data.slides[currentSlide]} className="w-full h-auto" alt="Воспитательная работа"/>
                        </div>
                        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:shadow-lg"><ChevronLeft className="w-6 h-6 text-primary" /></button>
                        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:shadow-lg"><ChevronRight className="w-6 h-6 text-primary" /></button>
                    </div>

                    <div className="bg-white rounded-lg p-6 mb-6">
                        <h2 className="text-2xl font-bold text-primary mb-6 text-center">{data.title}</h2>
                        {/* Добавлен класс rich-text-content для корректного отображения списков */}
                        <div 
                            className="prose prose-gray max-w-none space-y-4 prose-lg rich-text-content"
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        />
                    </div>

                    <div className="bg-white rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-primary mb-6 text-center">Документы для скачивания</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.documents.map((doc, index) => (
                                <a key={index} href={doc.file} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">📄</div>
                                        <span className="text-sm text-foreground font-medium">{doc.title}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default EducationalWork;