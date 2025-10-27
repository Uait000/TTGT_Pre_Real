import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Placeholder carousel items - you can replace with actual content
  const carouselItems = [
    { id: 1, text: '2015', description: 'Год основания современного кампуса' },
    { id: 2, text: '2016', description: 'Получение государственной аккредитации' },
    { id: 3, text: '2017', description: 'Открытие центра дистанционного обучения' },
    { id: 4, text: '2018', description: 'Запуск программ международного обмена' },
    { id: 5, text: '2019', description: 'Модернизация лабораторного оборудования' },
    { id: 6, text: '2020', description: 'Внедрение цифровых технологий' },
    { id: 7, text: '2021', description: 'Расширение спектра специальностей' },
    { id: 8, text: '2022', description: 'Создание инновационного центра' },
    { id: 9, text: '2023', description: 'Партнерство с ведущими предприятиями' },
    { id: 10, text: '2024', description: 'Открытие нового учебного корпуса' }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, carouselItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-white border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main carousel content */}
          <div className="flex items-center justify-center h-32 bg-gradient-to-r from-primary/10 to-primary/20 rounded-xl">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {carouselItems[currentSlide].text}
              </div>
              <div className="text-muted-foreground">
                {carouselItems[currentSlide].description}
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border border-border rounded-full p-2 hover:bg-gray-50 transition-colors shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border border-border rounded-full p-2 hover:bg-gray-50 transition-colors shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-primary'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;