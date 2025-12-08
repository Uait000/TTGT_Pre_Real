import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { ChevronLeft, ChevronRight, Users, Clock, MapPin, BookOpen } from 'lucide-react';
import { settingsApi } from '@/api/settings';
import { Card, CardContent } from '@/components/ui/card';

// Дефолтные импорты
import lib_1 from '@/assets/pictures/phoca_thumb_l_276.jfif';
import lib_2 from '@/assets/pictures/phoca_thumb_l_277.jfif';
import lib_3 from '@/assets/pictures/phoca_thumb_l_278.jfif';
import lib_4 from '@/assets/pictures/phoca_thumb_l_279.jfif';
import lib_5 from '@/assets/pictures/phoca_thumb_l_280.jfif';
import lib_6 from '@/assets/pictures/phoca_thumb_l_281.jfif';
import lib_7 from '@/assets/pictures/phoca_thumb_l_282.jfif';
import lib_8 from '@/assets/pictures/phoca_thumb_l_283.jfif';
import lib_9 from '@/assets/pictures/phoca_thumb_l_284.jfif';

const DEFAULT_DESCRIPTION = `<p>Библиотека является структурным подразделением ТТЖТ – филиала РГУПС, располагающим организованным библиотечным фондом изданий для предоставления их во временное пользование обучающимся, педагогическим, другим работникам техникума и обеспечения учебного, учебно-методического, научно-исследовательского, воспитательного, административного процессов в техникуме. Библиотека является центром распространения знаний, духовного и интеллектуального общения, культуры.</p>`;

const Library = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [data, setData] = useState({
        slides: [lib_1, lib_2, lib_3, lib_4, lib_5, lib_6, lib_7, lib_8, lib_9],
        work_time: "ежедневно с 8.00 до 17.00\nсуббота с 8.00 до 13.00\nвыходной – воскресенье\nСанитарный день – последний рабочий день каждого месяца.",
        staff_info: "Библиотекарь – Бурлакова Екатерина Валерьевна\nЗаведующая библиотекой: Костромина Елена Александровна\nКурирует работу библиотеки: Шитикова Наталья Юрьевна",
        description: DEFAULT_DESCRIPTION
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const settings = await settingsApi.getPageData('library_page');
                if (settings) {
                    setData(prevData => ({
                        ...prevData,
                        ...settings,
                        slides: (settings.slides && settings.slides.length > 0) ? settings.slides : prevData.slides,
                        work_time: settings.work_time || prevData.work_time,
                        staff_info: settings.staff_info || prevData.staff_info,
                        description: settings.description || prevData.description
                    }));
                }
            } catch (error) {
                console.error('Error loading library data:', error);
            }
        };
        loadData();
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % data.slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + data.slides.length) % data.slides.length);

    // Автоматическое переключение слайдов (можно отключить, если мешает)
    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [data.slides.length]);

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50 pb-20">
                {/* --- HERO SECTION (Слайдер на всю ширину) --- */}
                <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-gray-900 group">
                    {/* Картинки */}
                    {data.slides.map((src, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <img
                                src={src}
                                alt="Slide"
                                className="w-full h-full object-cover opacity-50" // Немного затемняем для читаемости текста
                            />
                        </div>
                    ))}
                    
                    {/* Градиент поверх картинок */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50"></div>

                    {/* Контент поверх слайдера */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
                        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                                Библиотека ТТЖТ
                            </h1>
                            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
                                Пространство для учебы, вдохновения и культурного развития
                            </p>
                        </div>
                    </div>

                    {/* Кнопки управления (Теперь всегда видны и имеют высокий z-index) */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10 z-30 cursor-pointer"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10 z-30 cursor-pointer"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Индикаторы */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-20">
                         {data.slides.map((_, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* --- FLOATING CARDS SECTION (Карточки с наложением) --- */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Карточка: Адрес */}
                        <Card className="bg-white border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                            <div className="h-1.5 bg-blue-500 w-full"></div>
                            <CardContent className="p-8 flex items-start gap-6">
                                <div className="bg-blue-50 p-4 rounded-2xl flex-shrink-0">
                                    <MapPin className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Как нас найти</h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        352120, Краснодарский край,<br/>
                                        г. Тихорецк, ул. Красноармейская, 53
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Карточка: Время работы */}
                        <Card className="bg-white border-none shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                            <div className="h-1.5 bg-emerald-500 w-full"></div>
                            <CardContent className="p-8 flex items-start gap-6">
                                <div className="bg-emerald-50 p-4 rounded-2xl flex-shrink-0">
                                    <Clock className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">График работы</h3>
                                    <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                                        {data.work_time}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* --- MAIN CONTENT SECTION --- */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* Левая колонка: Описание (8 колонок) */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                                    <span className="w-2 h-8 bg-primary rounded-full mr-4"></span>
                                    О библиотеке
                                </h2>
                                <div 
                                    className="rich-text-content text-lg text-gray-700 leading-loose"
                                    dangerouslySetInnerHTML={{ __html: data.description }}
                                />
                            </div>
                        </div>

                        {/* Правая колонка: Сотрудники (4 колонки) - СВЕТЛАЯ ВЕРСИЯ */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 h-full relative overflow-hidden">
                                {/* Декоративные элементы (светлые) */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -ml-10 -mb-10"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Наши сотрудники</h3>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        {/* Текст сотрудников */}
                                        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line border-l-4 border-blue-200 pl-5">
                                            {data.staff_info}
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 italic">
                                            "Библиотека – это открытый стол идей, за который приглашается каждый."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Library;