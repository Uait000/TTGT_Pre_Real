import React from 'react'; 
import InfoBlocks from '@/components/InfoBlocks';
import NewsSection from '@/components/NewsSection';
import Carousel from '@/components/Carousel';
// Импортируем MainLayout, предполагая, что вы его создали или восстановили.
// Если MainLayout еще не существует, замените этот импорт на правильный путь.
import MainLayout from '@/components/MainLayout'; 

const Index: React.FC = () => {
    
    // Вся логика Sidebar, Header, Footer и WebSocket теперь внутри MainLayout.
    // Index.tsx просто предоставляет контент, который будет обернут.

    return (
        // Используем MainLayout как обертку для всей страницы
        <MainLayout>
            {/* 1. Основное содержимое, которое было внутри MainLayout/Index */}
            <div className="container mx-auto px-3 sm:px-6 py-4 flex-grow">
                <NewsSection />
            </div>

            {/* 2. Элемент, который обычно идет перед футером */}
            <div className="mt-8"> 
            </div>
        </MainLayout>
    );
};

export default Index;
