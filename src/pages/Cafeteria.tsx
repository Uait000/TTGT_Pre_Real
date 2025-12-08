import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Utensils, Clock, Phone, Accessibility } from 'lucide-react';
import { settingsApi } from '@/api/settings';

// Дефолтные импорты
import eat_1 from '@/assets/pictures/phoca_thumb_l_312.jpg';
import eat_2 from '@/assets/pictures/phoca_thumb_l_313.jpg';
import eat_3 from '@/assets/pictures/phoca_thumb_l_314.jpg';
import eat_4 from '@/assets/pictures/phoca_thumb_l_315.jpg';
import eat_5 from '@/assets/pictures/phoca_thumb_l_316.jfif';
import eat_6 from '@/assets/pictures/phoca_thumb_l_319.jpg';
import eat_7 from '@/assets/pictures/phoca_thumb_l_320.jpg';

const DEFAULT_DESCRIPTION = `<p>Правильное питание – основа здоровья, а вкусная еда – залог хорошего настроения. Столовая Тихорецкого техникума железнодорожного транспорта предлагает обеды на выбор посетителей – широкий ассортимент первых горячих блюд, холодных закусок, мясных и рыбных изделий. Аппетитная выпечка порадует каждого, кто наведается в нашу просторную столовую. Меню ежедневно пополняется разнообразными блюдами. Возможность размещения посетителей - <strong>150 посадочных мест</strong>.</p>`;

const DEFAULT_FEATURES = `<p>Входные двери столовой предусмотрены для инвалидов и лиц с ограниченными возможностями здоровья. Над дверями имеются навесы. В столовой стоит стол для обслуживания инвалидов.</p>`;

const DEFAULT_FINAL_TEXT = `<p>Столовая ТТЖТ – это уютная обстановка, доброжелательное отношение персонала, доступные цены и очень вкусные обеды!</p>`;

const Cafeteria = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [data, setData] = useState({
        slides: [eat_1, eat_2, eat_3, eat_4, eat_5, eat_6, eat_7],
        description: DEFAULT_DESCRIPTION,
        features_text: DEFAULT_FEATURES,
        work_time: "Мы ждем Вас с 11:00 до 16:00\nКаждый день, кроме субботы и воскресенья.",
        contact_phone: "8 (86196) 6-20-03 доб. 146",
        contact_name: "Филатова Марина Ивановна",
        final_text: DEFAULT_FINAL_TEXT
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const settings = await settingsApi.getPageData('cafeteria_page');
                if (settings) {
                    setData(prevData => ({
                        ...prevData,
                        ...settings,
                        slides: (settings.slides && settings.slides.length > 0) ? settings.slides : prevData.slides,
                        description: settings.description || prevData.description,
                        features_text: settings.features_text || prevData.features_text,
                        work_time: settings.work_time || prevData.work_time,
                        contact_phone: settings.contact_phone || prevData.contact_phone,
                        contact_name: settings.contact_name || prevData.contact_name,
                        final_text: settings.final_text || prevData.final_text
                    }));
                }
            } catch (error) {
                console.error('Error loading cafeteria data:', error);
            }
        };
        loadData();
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % data.slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + data.slides.length) % data.slides.length);
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 4000);
        return () => clearInterval(slideInterval);
    }, [data.slides.length]);

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                    <Utensils className="w-10 h-10 mr-4 text-amber-500" />
                    Столовая ТТЖТ
                </h1>
                <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">Вкусно, полезно и доступно!</p>
                <div className="space-y-12">

                    <section className="text-center">
                        {/* Добавлен класс rich-text-content */}
                        <div 
                            className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto prose prose-lg rich-text-content"
                            dangerouslySetInnerHTML={{ __html: data.description }}
                        />
                    </section>

                    {/* Карусель изображений */}
                    <section className="relative max-w-5xl mx-auto group">
                        <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                {data.slides.map((src, index) => (
                                    <div key={index} className="w-full flex-shrink-0">
                                        <img src={src} alt={`Столовая ${index + 1}`} className="w-full h-[50vh] object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={prevSlide} className="absolute left-[-15px] md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                            <ChevronLeft className="w-6 h-6 text-primary" />
                        </button>
                        <button onClick={nextSlide} className="absolute right-[-15px] md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                            <ChevronRight className="w-6 h-6 text-primary" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {data.slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125 shadow-md' : 'bg-white/50 hover:bg-white/80'}`}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Секция "Особенности" */}
                    <section>
                        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl font-semibold text-indigo-800 flex items-center">
                                    <Accessibility className="w-6 h-6 mr-3 text-indigo-600"/> Для лиц с ОВЗ
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Добавлен класс rich-text-content */}
                                <div 
                                    className="text-gray-700 leading-relaxed prose prose-lg rich-text-content"
                                    dangerouslySetInnerHTML={{ __html: data.features_text }}
                                />
                            </CardContent>
                        </Card>
                    </section>

                    {/* Секция "Часы работы и Контакты" */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl font-semibold text-amber-800 flex items-center">
                                    <Clock className="w-6 h-6 mr-3 text-amber-600"/> Часы работы
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="whitespace-pre-line text-gray-700 text-lg">
                                    {data.work_time}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl font-semibold text-teal-800 flex items-center">
                                    <Phone className="w-6 h-6 mr-3 text-teal-600"/> Контакты
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-gray-700 text-lg">
                                    <strong>Телефон:</strong> {data.contact_phone}
                                </p>
                                <p className="text-gray-700 text-lg">
                                    <strong>Заведующая столовой:</strong> {data.contact_name}
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="text-center bg-gradient-to-r from-primary via-blue-600 to-secondary rounded-xl p-10 shadow-lg text-white">
                        {/* Добавлен класс rich-text-content */}
                        <div 
                            className="text-lg font-medium max-w-3xl mx-auto prose prose-invert prose-lg rich-text-content"
                            dangerouslySetInnerHTML={{ __html: data.final_text }}
                        />
                    </section>
                </div>
            </div>
        </MainLayout>
    );
};

export default Cafeteria;