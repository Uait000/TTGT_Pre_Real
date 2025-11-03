// src/components/MainLayout.tsx
import Carousel from '@/components/Carousel';
import React from 'react';
// Убедитесь, что пути к вашим компонентам верны
import Header from './Header'; 
import Sidebar from './Sidebar';
import InfoBlocks from './InfoBlocks'; 
import SidebarCards from './SidebarCards';
import ContactStrip from './ContactStrip'; // Теперь импопорт по default
import Footer from './Footer';           // Теперь импопорт по default

interface MainLayoutProps {
  children: React.ReactNode; 
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    // Главный контейнер: flex-col для прижатия футера к низу
    <div className="min-h-screen bg-gray-100 flex flex-col"> 
        
        {/* 1. ГЛАВНОЕ МЕНЮ (на всю ширину) */}
        <Header />
      
        {/* 2. FLEX КОНТЕЙНЕР для Sidebar, Content и SidebarCards */}
        <div className="flex flex-1 relative"> 
            
            {/* ЛЕВАЯ БОКОВАЯ ПАНЕЛЬ */}
            <Sidebar /> 
            
            {/* ГЛАВНАЯ ОБЛАСТЬ (flex-col для позиционирования Footer) */}
            <main className="flex-1 flex flex-col justify-between"> 
                
                {/* ВЕСЬ ОСНОВНОЙ КОНТЕНТ (ограничен container mx-auto) */}
                <div className="container mx-auto px-6 py-4 flex-grow"> 
                    
                    {/* ContactStrip: в середине, как и InfoBlocks */}
                    <ContactStrip /> 
                    
                    {/* InfoBlocks */}
                    <InfoBlocks /> 
                    
                    {/* Уникальный контент страницы */}
                    {children}
                </div>
                 <div className="mt-8"> {/* Добавляем отступ сверху */}
                        <Carousel />
                    </div>
                {/* Footer: Внутри <main>, ограничен ее шириной */}
                <Footer />
            </main>

            {/* ПРАВАЯ БОКОВАЯ ПАНЕЛЬ */}
            <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto hidden lg:block">
                <SidebarCards />
            </aside>
        </div>
        
    </div>
  );
};

// Исправленный экспорт
export default MainLayout;