import { useState, useEffect } from 'react'; // Добавлен useEffect для автопрокрутки
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Используем Card
import { ChevronLeft, ChevronRight, Utensils, Clock, Phone, Accessibility } from 'lucide-react'; // Добавлены иконки
import eat_1 from '@/assets/pictures/phoca_thumb_l_312.jpg';
import eat_2 from '@/assets/pictures/phoca_thumb_l_313.jpg';
import eat_3 from '@/assets/pictures/phoca_thumb_l_314.jpg';
import eat_4 from '@/assets/pictures/phoca_thumb_l_315.jpg';
import eat_5 from '@/assets/pictures/phoca_thumb_l_316.jfif';
import eat_6 from '@/assets/pictures/phoca_thumb_l_319.jpg';
import eat_7 from '@/assets/pictures/phoca_thumb_l_320.jpg';

const Cafeteria = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { id: 1, src: eat_1, alt: 'Столовая 1' },
    { id: 2, src: eat_2, alt: 'Столовая 2' },
    { id: 3, src: eat_3, alt: 'Столовая 3' },
    { id: 4, src: eat_4, alt: 'Столовая 4' },
    { id: 5, src: eat_5, alt: 'Столовая 5' },
    { id: 6, src: eat_6, alt: 'Столовая 6' },
    { id: 7, src: eat_7, alt: 'Столовая 7' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  // Автопрокрутка карусели каждые 4 секунды
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 4000);
    return () => clearInterval(slideInterval); // Очистка интервала при размонтировании компонента
  }, []);


  return (
    <div className="min-h-screen bg-gray-50"> {/* Слегка изменен фон */}
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-12"> {/* Улучшенная основная карточка */}
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                <Utensils className="w-10 h-10 mr-4 text-amber-500" /> {/* Иконка */}
                Столовая ТТЖТ
              </h1>
              <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">Вкусно, полезно и доступно!</p>
              
              {/* ✅ Новый дизайн секций */}
              <div className="space-y-12">

                {/* Секция "Добро пожаловать" */}
                <section className="text-center">
                   <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                    Правильное питание – основа здоровья, а вкусная еда – залог хорошего настроения. Столовая Тихорецкого техникума железнодорожного транспорта предлагает обеды на выбор посетителей – широкий ассортимент первых горячих блюд, холодных закусок, мясных и рыбных изделий. Аппетитная выпечка порадует каждого, кто наведается в нашу просторную столовую. Меню ежедневно пополняется разнообразными блюдами. Возможность размещения посетителей - <span className="font-semibold text-primary">150 посадочных мест</span>.
                   </p>
                </section>

                {/* Карусель изображений */}
                <section className="relative max-w-5xl mx-auto group"> {/* Увеличен max-w */}
                  <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200"> {/* Добавлена тень и рамка */}
                    {/* Контейнер для слайдов */}
                    <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                      {images.map((image) => (
                        <div key={image.id} className="w-full flex-shrink-0">
                           <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-[50vh] object-cover" // Высота задана относительно высоты экрана
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Стрелки навигации */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-[-15px] md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6 text-primary" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-[-15px] md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </button>

                  {/* Индикаторы */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-white scale-125 shadow-md' : 'bg-white/50 hover:bg-white/80'
                        }`}
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
                           <p className="text-gray-700 leading-relaxed">
                             Входные двери столовой предусмотрены для инвалидов и лиц с ограниченными возможностями здоровья. Над дверями имеются навесы. В столовой стоит стол для обслуживания инвалидов.
                           </p>
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
                          <p className="text-gray-700 text-lg">
                           Мы ждем Вас с <span className="font-semibold text-amber-900">11:00</span> до <span className="font-semibold text-amber-900">16:00</span>
                          </p>
                          <p className="text-sm text-gray-500">
                           Каждый день, кроме субботы и воскресенья.
                          </p>
                      </CardContent>
                   </Card>
                   <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
                     <CardHeader className="pb-3">
                         <CardTitle className="text-xl font-semibold text-teal-800 flex items-center">
                            <Phone className="w-6 h-6 mr-3 text-teal-600"/> Контакты
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1">
                          <p className="text-gray-700">
                           <strong>Телефон:</strong> 8 (86196) 6-20-03 доб. 146
                          </p>
                           <p className="text-gray-700">
                           <strong>Заведующая столовой:</strong> Филатова Марина Ивановна
                          </p>
                      </CardContent>
                   </Card>
                </section>

                {/* Заключительная секция */}
                <section className="text-center bg-gradient-to-r from-primary via-blue-600 to-secondary rounded-xl p-10 shadow-lg text-white">
                  <h2 className="text-3xl font-bold mb-4">Приятного аппетита!</h2>
                  <p className="text-lg font-medium max-w-3xl mx-auto">
                    Столовая ТТЖТ – это уютная обстановка, доброжелательное отношение персонала, доступные цены и очень вкусные обеды!
                  </p>
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

export default Cafeteria;