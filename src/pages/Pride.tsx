import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pride = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Placeholder images for the pride gallery
  const prideImages = [
    { id: 1, src: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg', alt: 'Выпускники техникума' },
    { id: 2, src: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg', alt: 'Достижения студентов' },
    { id: 3, src: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg', alt: 'Награды техникума' },
    { id: 4, src: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg', alt: 'Почетные грамоты' },
    { id: 5, src: 'https://images.pexels.com/photos/1181678/pexels-photo-1181678.jpeg', alt: 'Лучшие студенты' },
    { id: 6, src: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg', alt: 'Преподаватели года' },
    { id: 7, src: 'https://images.pexels.com/photos/1181680/pexels-photo-1181680.jpeg', alt: 'Спортивные достижения' },
    { id: 8, src: 'https://images.pexels.com/photos/1181681/pexels-photo-1181681.jpeg', alt: 'Научные проекты' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % prideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + prideImages.length) % prideImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
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
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Наша гордость</h1>
              
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 mb-8">
                <p className="text-center text-foreground leading-relaxed">
                  Доска почета - место, где мы с гордостью представляем наших лучших студентов, выпускников и преподавателей, 
                  которые своими достижениями прославляют наш техникум.
                </p>
              </div>

              {/* Carousel */}
              <div className="relative max-w-4xl mx-auto">
                <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={prideImages[currentSlide].src}
                    alt={prideImages[currentSlide].alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Navigation arrows */}
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

                {/* Image title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 text-white px-4 py-2 rounded-lg">
                    <p className="text-center font-medium">{prideImages[currentSlide].alt}</p>
                  </div>
                </div>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center space-x-2 mt-6">
                {prideImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSlide
                        ? 'bg-primary scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              {/* Image counter */}
              <div className="text-center mt-4">
                <span className="text-muted-foreground text-sm">
                  {currentSlide + 1} из {prideImages.length}
                </span>
              </div>

              {/* Additional info */}
              <div className="mt-8 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-primary mb-4 text-center">О наших достижениях</h2>
                <p className="text-foreground leading-relaxed text-center">
                  Здесь представлены фотографии наших лучших студентов, выпускников и преподавателей. 
                  Каждый из них внес значительный вклад в развитие техникума и достиг выдающихся результатов 
                  в учебе, науке, спорте или профессиональной деятельности.
                </p>
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

export default Pride;