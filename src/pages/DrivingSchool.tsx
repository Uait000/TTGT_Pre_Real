import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MapPin, Phone, User, FileText, Target, Car, GraduationCap, X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { settingsApi } from '@/api/settings';

import avto1 from '@/assets/pictures/School.jpg';
import avto2 from '@/assets/pictures/phoca_thumb_l_5237.jpg';

const DrivingSchool = () => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [data, setData] = useState({
        slides: [avto1, avto2],
        price: "60 000 ₽",
        description: `<p>Автошкола по подготовке водителей транспортных средств категории «В» с механической и автоматической трансмиссией открыта на отделении дополнительного профессионального образования ТТЖТ - филиала РГУПС и работает на рынке образовательных услуг с октября 2010 года.</p>`,
        goals_text: `<p>Основная цель работы автошколы – обучение основам безопасного управления, практическая отработка наиболее важных элементов управления автомобилем, преодоление психологического барьера непонимания между действиями новичка-водителя и поведением автомобиля на дороге.</p>`,
        cars_list: ["Шевролет-Авео", "Рено Логан", "Педали дополнительного управления", "Камеры видеонаблюдения", "Современное техническое оснащение"],
        advantages_list: [
            "Качественная подготовка водителей", "Поэтапная оплата", "Вечернее время теории",
            "Индивидуальный график вождения", "Обучение в выходные", "Широкий выбор авто",
            "Свидетельство гос. образца", "Сдача в ГИБДД с нами", "Сопровождение до прав",
            "Профессиональные инструкторы"
        ],
        contacts_text: "Адрес: ТТЖТ – филиал РГУПС, ул. Красноармейская, 57, каб. 116, 106а\nТелефон: 8(86196) 6-20-03, доб. 125, 135\nМобильный: 89884728160\nЗаведующий отделом: Токарев Максим Викторович",
        docs_list: ["Паспорт", "Действующая мед. справка", "Фото 3×4 см (1 шт.)"]
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const settings = await settingsApi.getPageData('driving_school_page');
                if (settings) {
                    setData(prevData => ({
                        ...prevData,
                        ...settings,
                        slides: (settings.slides && settings.slides.length > 0) ? settings.slides : prevData.slides,
                        price: settings.price || prevData.price,
                        description: settings.description || prevData.description,
                        goals_text: settings.goals_text || prevData.goals_text,
                        cars_list: settings.cars_list || prevData.cars_list,
                        advantages_list: settings.advantages_list || prevData.advantages_list,
                        contacts_text: settings.contacts_text || prevData.contacts_text,
                        docs_list: settings.docs_list || prevData.docs_list
                    }));
                }
            } catch (error) {
                console.error('Error loading driving school data:', error);
            }
        };
        loadData();
    }, []);

    const openLightbox = (index: number) => { setCurrentImageIndex(index); setLightboxOpen(true); };
    const closeLightbox = () => setLightboxOpen(false);
    const goToNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % data.slides.length);
    const goToPrevImage = () => setCurrentImageIndex((prev) => (prev + data.slides.length - 1) % data.slides.length);

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 text-center tracking-tight flex items-center justify-center gap-3">
                    <Car className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
                    Автошкола ТТЖТ
                </h1>
                
                <div className="space-y-16">
                    {/* Блок 1: Описание и Цена */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm h-full flex flex-col">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl font-semibold text-blue-800 flex items-center">
                                    <GraduationCap className="w-7 h-7 mr-3 text-blue-600"/> О нашей автошколе
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <div className="text-gray-700 leading-relaxed text-base rich-text-content mb-6" dangerouslySetInnerHTML={{__html: data.description}} />
                                <div className="mt-auto bg-white/60 rounded-xl p-5 border border-blue-100 shadow-sm">
                                    <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
                                        <Target className="w-5 h-5 mr-2 text-blue-500"/> Цели обучения
                                    </h3>
                                    <div className="text-gray-600 leading-relaxed text-sm rich-text-content" dangerouslySetInnerHTML={{__html: data.goals_text}} />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <div className="flex flex-col gap-6 h-full">
                             <Card className="p-8 bg-gradient-to-br from-green-50 to-teal-50 border-green-200 shadow-sm flex flex-col items-center justify-center text-center h-full hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                    <Car className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-green-800 mb-2">Стоимость обучения</h3>
                                <p className="text-5xl md:text-6xl font-extrabold text-green-600 mb-2 tracking-tight">{data.price}</p>
                                <p className="text-sm font-medium text-green-700 bg-green-100/80 px-4 py-1.5 rounded-full">Категория "B"</p>
                            </Card>

                            <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-sm flex-1">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-semibold text-orange-800 flex items-center">
                                        <FileText className="w-6 h-6 mr-3 text-orange-600"/> Документы для зачисления
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {data.docs_list.map((item, i) => (
                                            <li key={i} className="flex items-center text-base text-orange-900 bg-white/60 p-3 rounded-lg border border-orange-100/50">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-3 text-orange-600 font-bold text-xs shrink-0">
                                                    {i + 1}
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Блок 2: Галерея */}
                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-6 text-center flex items-center justify-center gap-2">
                            <span className="w-8 h-1 bg-primary rounded-full hidden sm:block"></span>
                            Наш автопарк и учебные классы
                            <span className="w-8 h-1 bg-primary rounded-full hidden sm:block"></span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {data.slides.map((src, i) => (
                                <div 
                                    key={i} 
                                    className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100" 
                                    onClick={() => openLightbox(i)}
                                >
                                    <img src={src} alt="Slide" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                            <ChevronRight className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Блок 3: Списки (Автопарк и Преимущества) - ОБНОВЛЕННЫЙ ДИЗАЙН */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-none shadow-lg ring-1 ring-gray-100 h-full flex flex-col">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-4">
                                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3 text-blue-600">
                                        <Car className="w-6 h-6"/> 
                                    </div>
                                    Автопарк и Оснащение
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 flex-1">
                                <ul className="space-y-3">
                                    {data.cars_list.map((item, i) => (
                                        <li key={i} className="flex items-start text-base text-gray-700 p-3 rounded-lg hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                                            <CheckCircle className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg ring-1 ring-gray-100 h-full flex flex-col">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-4">
                                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg mr-3 text-green-600">
                                        <Target className="w-6 h-6"/>
                                    </div>
                                    Преимущества обучения
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 flex-1">
                                <ul className="grid grid-cols-1 gap-3">
                                    {data.advantages_list.map((item, i) => (
                                        <li key={i} className="flex items-start text-base text-gray-700 p-3 rounded-lg hover:bg-green-50/50 transition-colors border border-transparent hover:border-green-100">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Блок 4: Контакты - ОБНОВЛЕННЫЙ ДИЗАЙН (Светлый) */}
                    <Card className="bg-white border border-gray-200 shadow-xl overflow-hidden relative">
                        {/* Декоративная полоса слева */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                        
                        <CardHeader className="pb-6 border-b border-gray-100 bg-gray-50/50">
                            <CardTitle className="text-2xl font-bold flex items-center text-gray-800">
                                <MapPin className="w-7 h-7 mr-3 text-red-500"/> 
                                Контакты и запись
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8 px-6 md:px-10">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {/* Адрес */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center text-blue-600 font-semibold mb-1">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        Адрес
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        {data.contacts_text.split('\n')[0].replace('Адрес:', '').trim()}
                                    </p>
                                    <div className="mt-auto pt-2 text-sm text-gray-400">Главный корпус</div>
                                </div>

                                {/* Телефоны */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center text-green-600 font-semibold mb-1">
                                        <Phone className="w-5 h-5 mr-2" />
                                        Связь
                                    </div>
                                    <div className="space-y-1">
                                        {data.contacts_text.split('\n').slice(1, 3).map((line, idx) => (
                                            <p key={idx} className="text-lg font-medium text-gray-800">
                                                {line.replace('Телефон:', '').replace('Мобильный:', '').trim()}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="mt-auto pt-2 text-sm text-gray-400">Звоните в рабочее время</div>
                                </div>

                                {/* Заведующий */}
                                <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center text-amber-600 font-semibold mb-1">
                                        <User className="w-5 h-5 mr-2" />
                                        Руководство
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Заведующий отделом</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {data.contacts_text.split('\n').find(l => l.includes('Заведующий'))?.replace('Заведующий отделом:', '').trim() || 'Токарев Максим Викторович'}
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeLightbox}>
                    <img 
                        src={data.slides[currentImageIndex]} 
                        className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl" 
                        onClick={e => e.stopPropagation()} 
                        alt="Просмотр"
                    />
                    <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all">
                        <X className="w-8 h-8" />
                    </button>
                    
                    {data.slides.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); goToPrevImage(); }} 
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); goToNextImage(); }} 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </MainLayout>
    );
};

export default DrivingSchool;