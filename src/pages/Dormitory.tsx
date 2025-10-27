import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Dormitory = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { id: 1, src: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg', alt: 'Общежитие 1' },
    { id: 2, src: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg', alt: 'Общежитие 2' },
    { id: 3, src: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg', alt: 'Общежитие 3' },
    { id: 4, src: 'https://images.pexels.com/photos/1181678/pexels-photo-1181678.jpeg', alt: 'Общежитие 4' },
    { id: 5, src: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg', alt: 'Общежитие 5' },
    { id: 6, src: 'https://images.pexels.com/photos/1181680/pexels-photo-1181680.jpeg', alt: 'Общежитие 6' },
    { id: 7, src: 'https://images.pexels.com/photos/1181681/pexels-photo-1181681.jpeg', alt: 'Общежитие 7' },
    { id: 8, src: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg', alt: 'Общежитие 8' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            {/* Info Blocks */}
            <InfoBlocks />
            
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Общежитие</h1>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                {/* Карусель изображений */}
                <div className="relative max-w-4xl mx-auto mb-8">
                  <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={images[currentSlide].src}
                      alt={images[currentSlide].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Стрелки навигации */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-6 h-6 text-primary" />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </button>

                  {/* Индикаторы */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentSlide
                            ? 'bg-primary scale-125'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Основной текст */}
                <div className="bg-white rounded-lg p-8 space-y-6">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-foreground leading-relaxed mb-4">
                      Студенческое общежитие нашего техникума признано одним из лучших среди техникумов Краснодарского края. В общежитии 396 мест для иногородних студентов дневного обучения. Студенты проживают в 2-х и 3-х местных комнатах, укомплектованы необходимой мебелью: кроватями, прикроватными тумбочками , шкафами для хранения одежды, пеналами для хранения посуды и продуктов ,столами, стульями, а так же мягким инвентарём (матрацами, одеялами, подушками и постельным бельём) .На каждом этаже располагается по две кухни, душевые и туалетные комнаты, гладильная. Организована работа прачечной, в течении дня (с 9:00час. до 17 час.), имеется изолятор.
                    </p>

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                      <p className="text-foreground leading-relaxed">
                        Согласно Закону Краснодарского края №1539-КЗ «О мерах по профилактике безнадзорности и правонарушений несовершеннолетних в Краснодарском крае» студенты должны находиться в общежитии в 22:00 час. В случаи необходимости выезда из общежития, студент должен согласовать свой отъезд с администрацией техникума и зарегистрироваться в журнале отъезда.
                      </p>
                    </div>

                    <p className="text-foreground leading-relaxed">
                      Для обеспечения личной и общественной безопасности проживающих в общежитии студентов действует пропускная система. На входе в общежитие постоянно находится дежурный по общежитию. Пост дежурного по общежитию обеспечен телефонной и радиосвязью, имеется кнопка экстренного вызова дежурной группы Отдела вневедомственной охраны по Тихорецкому району, на монитор дежурного выведено видеонаблюдение всех этажей и наружное наблюдение. Кроме этого круглосуточно со студентами работают воспитатели. Установлена современная противопожарная сигнализация и соответствующие средства пожаротушения.
                    </p>

                    <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-6">
                      <p className="text-foreground leading-relaxed">
                        Койко-место в общежитии предоставляется на основании заявления студента. В первую очередь обеспечивает общежитием социально-незащищённые студенты: учащиеся из числа детей-сирот и детей, оставшихся без попечения родителей, неполных, малообеспеченных, многодетных семей и студенты, обучающиеся по целевым направлениям. В общежитии есть wi-fi.
                      </p>
                    </div>

                    <p className="text-foreground leading-relaxed">
                      Здания общежитий ТТЖТ - филиала РГУПС оборудованы элементами доступа для инвалидов, среди которых: наличие кнопки вызова персонала, установленной на входе в общежитие; наличие широких дверных проемов, двери с механизмом доводчика, комнаты для проживания на первом этаже.
                    </p>

                    <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-6 text-center">
                      <p className="text-foreground font-semibold">
                        Телефон: 8 (86196) 6-20-03 доб. 129
                      </p>
                      <p className="text-foreground font-semibold">
                        Заведующая общежитием: Алферова Галина Васильевна
                      </p>
                    </div>
                  </div>
                </div>
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

export default Dormitory;