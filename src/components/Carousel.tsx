
import { useState, useEffect, useCallback } from 'react';
import image2006 from '@/assets/pictures/data/2006.jpg';
import image20007 from '@/assets/pictures/data/2007.jpg';
import image2007 from '@/assets/pictures/data/2007Kuban.jpg';
import image2007R from '@/assets/pictures/data/2007Rossia.jpg';
import image20008R from '@/assets/pictures/data/2008Rossia.jpg';
import image2013 from '@/assets/pictures/data/2013.jpg';
import image2014 from '@/assets/pictures/data/2014.jpg';
import image2015 from '@/assets/pictures/data/2015.jpg';
import image2016 from '@/assets/pictures/data/2016.jpg';
import image2017 from '@/assets/pictures/data/2017.jpg';
import image2018 from '@/assets/pictures/data/2018.jpg';
import image2019 from '@/assets/pictures/data/2019.jpg';
import image2020 from '@/assets/pictures/data/2020.jpg';
import image2023 from '@/assets/pictures/data/2023.jpg';
import image2024 from '@/assets/pictures/data/2024.jpg';
import imagetop10 from '@/assets/pictures/data/top10_2019.jpg';
import imagetop500 from '@/assets/pictures/data/top500_2019.jpg';
// Объект для удобного доступа к изображениям
const CAROUSEL_IMAGES: Record<string, string> = {
    '2006': image2006,
    '2007': image20007,
    '2007Kuban': image2007,
    '2007Rossia': image2007R,
    '2008Rossia': image20008R,
    '2013': image2013,
    '2014': image2014,
    '2015': image2015,
    '2016': image2016,
    '2017': image2017,
    '2018': image2018,
    '2019': image2019,
    '2020': image2020,
    '2023': image2023,
    '2024': image2024,
    'top10_2019': imagetop10,
    'top500_2019': imagetop500,
};

const CAROUSEL_DATA = [
    { imageKey: '2025' },
    { imageKey: '2024' },
    { imageKey: '2023' },
    { imageKey: '2022' },
    { imageKey: '2021' },
    { imageKey: '2020' },
    { imageKey: '2019' }, 
    { imageKey: 'top10_2019' }, 
    { imageKey: 'top500_2019' }, 
    { imageKey: '2018' },
    { imageKey: '2017' },
    { imageKey: '2016' },
    { imageKey: '2015' },
    { imageKey: '2014' },
    { imageKey: '2013' },
    { imageKey: '2008Rossia' },
    { imageKey: '2007Rossia' },
    { imageKey: '2007Kuban' },
    { imageKey: '2007' },
    { imageKey: '2006' },
];

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    const slidesCount = CAROUSEL_DATA.length; 
    const maxIndex = Math.max(0, slidesCount - 3); 

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    const goToSlide = (index: number) => {
        setCurrentSlide(Math.min(index, maxIndex));
    };

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isHovered, nextSlide]);
    
    return (
        <div className="w-full bg-transparent pt-4 pb-8"> 
            <div
                className="relative overflow-hidden" 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div 
                    className="flex transition-transform duration-700 ease-in-out gap-x-4 px-12" 
                    style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
                >
                    {CAROUSEL_DATA.map((item, index) => {
                        const imageSrc = CAROUSEL_IMAGES[item.imageKey] || CAROUSEL_IMAGES['2023']; 
                        
                        return (
                            <div 
                                key={index}
                                className="flex-shrink-0 w-1/3 p-2" 
                            >
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200/0 overflow-hidden flex flex-col items-center justify-center h-40"> 
                                    
                                    {/* Контейнер для изображения */}
                                    <div className="flex items-center justify-center p-2 w-full h-full"> 
                                        <img 
                                            src={imageSrc} 
                                            alt={`Событие ${item.imageKey}`} 
                                            className="max-h-full max-w-full object-contain" 
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Индикаторы */}
                <div className="flex justify-center space-x-2 mt-6">
                    {/* Индикаторы только для прокручиваемых позиций */}
                    {Array.from({ length: slidesCount - 2 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)} 
                            className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentSlide
                                    ? 'bg-primary scale-110'
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel;



