// src/pages/Index.tsx (НОВАЯ ФИНАЛЬНАЯ СТРУКТУРА)

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import Carousel from '@/components/Carousel';
import ContactStrip from '@/components/ContactStrip'; 
import Footer from '@/components/Footer'; 
import NewsSection from '@/components/NewsSection';

const Index: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            

            <Header />
            
            <div className="flex flex-1 relative"> 
                {/* Левая боковая панель */}
                <Sidebar />

                <main className="flex-1 flex flex-col justify-between">
                    
                    {/* 1. Ограниченный контент (NewsSection, InfoBlocks) */}
                    <div className="container mx-auto px-6 py-4 flex-grow">
                        <ContactStrip />
                        <InfoBlocks />
                        <NewsSection />
                    </div>
                    
                    {/* 2. Карусель на всю ширину (ей нужно быть ВНЕ container, но ВНУТРИ main) */}
                    <div className="mt-8"> {/* Добавляем отступ сверху */}
                        <Carousel />
                    </div>
                    
                    <Footer />
                </main>

                {/* Правая боковая панель */}
                <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto hidden lg:block">
                    <SidebarCards />
                </aside>
            </div>
        </div>
    );
};

export default Index;