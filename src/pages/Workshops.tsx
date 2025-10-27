import { useState, useEffect } from 'react'; // Добавлен useEffect
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Используем Card
import { Button } from '@/components/ui/button'; // Используем Button для ссылки
import { ChevronLeft, ChevronRight, Wrench, GalleryThumbnails, ListChecks, Accessibility, FileText } from 'lucide-react'; // Добавлены иконки

// Импорты изображений для карусели
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

  const images = [
    { id: 1, src: workshop1, alt: 'Мастерские 1' },
    { id: 2, src: workshop2, alt: 'Мастерские 2' },
    { id: 3, src: workshop3, alt: 'Мастерские 3' },
    { id: 4, src: workshop4, alt: 'Мастерские 4' },
    { id: 5, src: workshop5, alt: 'Мастерские 5' },
    { id: 6, src: workshop6, alt: 'Мастерские 6' },
    { id: 7, src: workshop7, alt: 'Мастерские 7' },
    { id: 8, src: workshop8, alt: 'Мастерские 8' },
    { id: 9, src: workshop9, alt: 'Мастерские 9' },
    { id: 10, src: workshop10, alt: 'Мастерские 10' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  // Автопрокрутка
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000); // 5 секунд
    return () => clearInterval(slideInterval);
  }, []);

  const workshopList1 = [
    'Слесарные. Слесарно-механические. Слесарно-монтажные',
    'Механообрабатывающие. Токарные',
    'Цифровая передача информации',
    'Сварочные. Сварочная',
    'Газосварочные',
    'Электросварочные',
  ];

  const workshopList2 = [
    'Технические средства информации дистанционных обучающих технологий. Информационных технологий в проф. деятельности.',
    'Каменных работ. Штукатурных и облицовочных работ. Малярных работ. Испытания строит. материалов и конструкций.',
    'Лаборатория неразрушающего контроля рельсов, машин механизмов. Ремонтно- строит. работ.',
    'Электромонтажные. Монтажа электронных устройств. Монтажа устройств систем СЦБ и ЖАТ. Монтажа и регулировки устройств связи.',
  ];

  return (
    <div className="min-h-screen bg-gray-50"> {/* Фон страницы */}
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-12"> {/* Основной контейнер */}
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                <Wrench className="w-10 h-10 mr-4 text-orange-500" /> {/* Иконка */}
                Учебно-производственные мастерские
              </h1>
              <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
                Учебная база ТТЖТ – филиала РГУПС для формирования практических умений и получения первоначального опыта.
              </p>
              
              {/* ✅ Новый дизайн секций */}
              <div className="space-y-12">

                {/* --- Секция "О мастерских" --- */}
                <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-lg mb-4">
                    Производственная деятельность учебных мастерских во многом зависит от материально-технической базы, оснащенности оборудованием, обеспеченности материалами и инструментом.
                  </p>
                  <p className="text-gray-800 leading-relaxed text-lg font-medium">
                    Все цеха и лаборатории мастерских оснащены <span className="text-blue-700">современным оборудованием</span>, инструментом и программным обеспечением, необходимым для выполнения практических работ.
                  </p>
                </section>

                {/* --- Карусель --- */}
                <section className="relative max-w-5xl mx-auto group">
                   <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8 flex items-center justify-center">
                      <GalleryThumbnails className="w-8 h-8 mr-3 text-gray-500"/> Галерея
                   </h2>
                  <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                    <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                      {images.map((image) => (
                        <div key={image.id} className="w-full flex-shrink-0">
                           <img src={image.src} alt={image.alt} className="w-full h-[60vh] object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Стрелки */}
                  <button onClick={prevSlide} className="absolute left-[-15px] md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ChevronLeft className="w-6 h-6 text-primary" />
                  </button>
                  <button onClick={nextSlide} className="absolute right-[-15px] md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </button>
                  {/* Индикаторы */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                      <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${ index === currentSlide ? 'bg-white scale-150 ring-2 ring-white/50' : 'bg-white/50 hover:bg-white/80' }`} />
                    ))}
                  </div>
                </section>

                {/* --- Секция "Наши цеха и лаборатории" --- */}
                <section className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 p-8 shadow-sm">
                   <h2 className="text-3xl font-semibold text-green-800 mb-8 text-center flex items-center justify-center">
                      <ListChecks className="w-8 h-8 mr-3 text-green-600"/> Наши цеха и лаборатории
                   </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Левая колонка */}
                     <div className="space-y-4">
                       {workshopList1.map((item, index) => (
                          <Card key={index} className="p-4 bg-white border-green-100 shadow-sm flex items-center group hover:border-green-300 transition-colors">
                              <Wrench className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 group-hover:text-green-700 transition-colors"/>
                              <span className="text-gray-700 text-sm">{item}</span>
                          </Card>
                       ))}
                     </div>
                      {/* Правая колонка */}
                     <div className="space-y-4">
                       {workshopList2.map((item, index) => (
                          <Card key={index} className="p-4 bg-white border-green-100 shadow-sm flex items-center group hover:border-green-300 transition-colors">
                               <Wrench className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 group-hover:text-green-700 transition-colors"/>
                              <span className="text-gray-700 text-sm">{item}</span>
                          </Card>
                       ))}
                     </div>
                  </div>
                </section>

                {/* --- Секция "Доступная среда" --- */}
                 <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-8 shadow-sm flex items-center justify-center text-center">
                    <Accessibility className="w-8 h-8 mr-4 text-indigo-600 flex-shrink-0"/>
                    <p className="text-lg text-indigo-800 font-medium">
                       Здание учебно-производственных мастерских адаптировано для инвалидов и лиц с ограниченными возможностями здоровья.
                    </p>
                 </section>

                {/* --- Секция "График практики" (Кнопка) --- */}
                <section className="text-center">
                  <a
                    href="https://ttgt.org/images/files/grafik_UPM_25_26.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <FileText className="w-6 h-6" />
                    <span className="text-lg">График учебной практики 2025-2026</span>
                  </a>
                </section>

              </div>
            </div>
          </div>
        </main>
        
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default Workshops;