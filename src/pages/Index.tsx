import React, { useState } from 'react'; // 1. Импортируем useState
import { List, X } from 'lucide-react'; // 2. Импортируем иконки
// ИСПРАВЛЕНИЕ: Возвращаем пути к alias-импортам,
// так как ваш проект настроен на них.
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import Carousel from '@/components/Carousel';
import ContactStrip from '@/components/ContactStrip'; 
import Footer from '@/components/Footer'; 
import NewsSection from '@/components/NewsSection';

const Index: React.FC = () => {
    // 3. Добавляем состояние для мобильной боковой панели
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            <Header />

            {/* 4. Новая кнопка-бургер для боковой панели (только на мобильных) */}
            {/*
              ИЗМЕНЕНИЯ ЗДЕСЬ:
              - top-[5.5rem] -> top-[6.5rem] (Опускаем кнопку ниже)
              - z-30 -> z-40 (Поднимаем кнопку на слой выше шапки)
            */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden fixed top-[6.5rem] left-3 z-40 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg text-primary border border-border/50"
              aria-label="Открыть быстрое меню"
            >
              <List className="w-5 h-5" />
            </button>

            {/* 5. Мобильная боковая панель (выезжающая) */}
            {/*
              ИЗМЕНЕНИЯ ЗДЕСЬ:
              - z-40 -> z-50 (Слой затемнения)
              - z-50 -> z-60 (Слой самой панели)
            */}
            {isSidebarOpen && (
              <div 
                className="lg:hidden fixed inset-0 z-50 bg-black/50" 
                onClick={() => setIsSidebarOpen(false)}
              >
                <div 
                  className="fixed top-0 left-0 h-full w-72 bg-white z-60 p-6 shadow-xl"
                  onClick={(e) => e.stopPropagation()} // Не закрывать при клике внутри
                >
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="absolute top-4 right-4 text-muted-foreground"
                    aria-label="Закрыть меню"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  {/* Вставляем ваш компонент Sidebar внутрь */}
                  <Sidebar />
                </div>
              </div>
            )}
            
            <div className="flex flex-1 relative"> 

                {/* Статическая боковая панель для ПК (как и было) */}
                <div className="hidden lg:block">
                  <Sidebar />
                </div>

                <main className="flex-1 flex flex-col justify-between min-w-0">

                    <div className="container mx-auto px-3 sm:px-6 py-4 flex-grow">
                        <ContactStrip />
                        <InfoBlocks />
                        <NewsSection />
                    </div>

                    <div className="mt-8"> 
                        <Carousel />
                    </div>
                    
                    <Footer />
                </main>

                <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto hidden lg:block">
                    <SidebarCards />
                </aside>
            </div>
        </div>
    );
};

export default Index;

