import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Wrench, GalleryThumbnails, ListChecks, Accessibility, FileText } from 'lucide-react';
import { settingsApi } from '@/api/settings';

// Импорты картинок
import workshop1 from '@/assets/pictures/phoca_thumb_l_442.jpg';
import workshop2 from '@/assets/pictures/phoca_thumb_l_443.jpg';
import workshop3 from '@/assets/pictures/phoca_thumb_l_444.jpg';
import workshop4 from '@/assets/pictures/phoca_thumb_l_445.jpg';
import workshop5 from '@/assets/pictures/phoca_thumb_l_446.jpg';
import workshop6 from '@/assets/pictures/phoca_thumb_l_447.jpg';
import workshop7 from '@/assets/pictures/phoca_thumb_l_448.jpg';
import workshop8 from '@/assets/pictures/phoca_thumb_l_449.jpg';
import workshop9 from '@/assets/pictures/phoca_thumb_l_450.jpg';
import workshop10 from '@/assets/pictures/phoca_thumb_l_451.jpg';

const Workshops = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Дефолтные данные с восстановленным текстом
    const [data, setData] = useState({
        description: '<p>Учебная база ТТЖТ – филиала РГУПС для формирования практических умений и получения первоначального опыта.</p>',
        features_text: '<p>Производственная деятельность учебных мастерских во многом зависит от материально-технической базы, оснащенности оборудованием, обеспеченности материалами и инструментом. Все цеха и лаборатории мастерских оснащены современным оборудованием, инструментом и программным обеспечением, необходимым для выполнения практических работ.</p>',
        workshop_list_1: [
            'Слесарные. Слесарно-механические. Слесарно-монтажные', 
            'Механообрабатывающие. Токарные', 
            'Цифровая передача информации', 
            'Сварочные. Сварочная', 
            'Газосварочные', 
            'Электросварочные'
        ],
        workshop_list_2: [
            'Технические средства информации дистанционных обучающих технологий...', 
            'Каменных работ...', 
            'Лаборатория неразрушающего контроля...', 
            'Электромонтажные...'
        ],
        slides: [
            workshop1, workshop2, workshop3, workshop4, workshop5, 
            workshop6, workshop7, workshop8, workshop9, workshop10
        ],
        practice_text: 'График учебной практики 2025-2026',
        practice_file_url: 'https://ttgt.org/images/files/grafik_UPM_25_26.pdf',
        accessibility_text: '<p>Здание учебно-производственных мастерских адаптировано для инвалидов и лиц с ограниченными возможностями здоровья.</p>'
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const settings = await settingsApi.getPageData('workshops_page');
                if (settings) {
                    // Объединяем полученные данные с дефолтными, чтобы не потерять структуру
                    setData(prev => ({
                        ...prev,
                        ...settings,
                        slides: (settings.slides && settings.slides.length > 0) ? settings.slides : prev.slides,
                        workshop_list_1: settings.workshop_list_1 || prev.workshop_list_1,
                        workshop_list_2: settings.workshop_list_2 || prev.workshop_list_2,
                    }));
                }
            } catch (error) {
                console.error('Error loading workshops data:', error);
            }
        };
        loadData();
    }, []);

    const images = data.slides.map((src, id) => ({ id, src }));

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    
    useEffect(() => { 
        const i = setInterval(nextSlide, 10000); 
        return () => clearInterval(i); 
    }, [images.length]);

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl shadow-xl border border-border p-6 md:p-12"> 
                <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                    <Wrench className="w-10 h-10 mr-4 text-orange-500" /> Учебно-производственные мастерские
                </h1>
                
                {/* Добавлен класс rich-text-content */}
                <div 
                    className="text-center text-lg text-muted-foreground mb-12 max-w-4xl mx-auto prose prose-lg rich-text-content" 
                    dangerouslySetInnerHTML={{ __html: data.description }} 
                />
                
                <div className="space-y-12">
                    {/* Блок особенностей (восстановленный текст) */}
                    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8 shadow-sm">
                        {/* Добавлен класс rich-text-content для HTML контента */}
                        <div 
                            className="text-gray-700 leading-relaxed text-lg rich-text-content"
                            dangerouslySetInnerHTML={{ __html: data.features_text }}
                        />
                    </section>

                    <section className="relative max-w-5xl mx-auto group">
                         <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8 flex items-center justify-center">
                            <GalleryThumbnails className="w-8 h-8 mr-3 text-gray-500"/> Галерея
                         </h2>
                         <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                {images.map((img) => (
                                    <div key={img.id} className="w-full flex-shrink-0">
                                        <img src={img.src} className="w-full h-[40vh] md:h-[60vh] object-cover" alt="Workshop slide" />
                                    </div>
                                ))}
                            </div>
                         </div>
                         <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white"><ChevronLeft/></button>
                         <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white"><ChevronRight/></button>
                    </section>

                    <section className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 p-8 shadow-sm">
                         <h2 className="text-3xl font-semibold text-green-800 mb-8 text-center flex items-center justify-center">
                            <ListChecks className="w-8 h-8 mr-3 text-green-600"/> Наши цеха и лаборатории
                         </h2>
                         
                         {/* ИСПРАВЛЕНА СЕТКА ЗДЕСЬ */}
                         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                {data.workshop_list_1.map((item, i) => (
                                    <Card key={i} className="p-4 flex items-center hover:shadow-md transition-shadow">
                                            <Wrench className="w-5 h-5 mr-3 text-green-500 flex-shrink-0"/>
                                            <span className="text-sm">{item}</span>
                                    </Card>
                                ))}
                            </div>
                            <div className="space-y-4">
                                {data.workshop_list_2.map((item, i) => (
                                    <Card key={i} className="p-4 flex items-center hover:shadow-md transition-shadow">
                                            <Wrench className="w-5 h-5 mr-3 text-green-500 flex-shrink-0"/>
                                            <span className="text-sm">{item}</span>
                                    </Card>
                                ))}
                            </div>
                         </div>
                    </section>

                    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-8 shadow-sm flex items-center justify-center text-center">
                        <Accessibility className="w-8 h-8 mr-4 text-indigo-600 flex-shrink-0"/>
                        {/* Добавлен класс rich-text-content */}
                        <div 
                            className="text-lg text-indigo-800 font-medium rich-text-content"
                            dangerouslySetInnerHTML={{ __html: data.accessibility_text }}
                        />
                    </section>

                    <section className="text-center">
                        <a href={data.practice_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <FileText className="w-6 h-6" />
                            <span className="text-lg">{data.practice_text}</span>
                        </a>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
};
export default Workshops;