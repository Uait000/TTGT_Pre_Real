import React, { useState, useEffect } from 'react';
import { List, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import InfoBlocks from './InfoBlocks';
import SidebarCards from './SidebarCards';
import ContactStrip from './ContactStrip';
import Footer from './Footer';
import Carousel from './Carousel';
import { wsService } from '../services/websocketService';
import { useWebSocketEvents } from '../hooks/useWebSocketEvents';
import Ticker from './Ticker';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { onlineUsers } = useWebSocketEvents();
  
  useEffect(() => {
    if (!window.location.pathname.startsWith('/admin')) {
      console.log('MainLayout: Connecting WebSocket...');
      wsService.connect('/websocket/');
    }
    return () => {
      console.log('MainLayout: Closing WebSocket.');
      wsService.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <Ticker />
      
      {/* Кнопка мобильного меню */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="xl:hidden fixed top-[6.5rem] left-3 z-40 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg text-primary border border-border/50"
        aria-label="Открыть быстрое меню"
      >
        <List className="w-5 h-5" />
      </button>
      
      {/* Оверлей мобильного меню */}
      {isSidebarOpen && (
        <div 
          className="xl:hidden fixed inset-0 z-50 bg-black/50" 
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="fixed top-0 left-0 h-full w-72 bg-white z-60 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="absolute top-4 right-4 text-muted-foreground"
              aria-label="Закрыть меню"
            >
              <X className="w-6 h-6" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Основной контейнер. Убран жесткий container, добавлен ограничитель 1920px */}
      <div className="flex flex-1 relative w-full max-w-[1920px] mx-auto">
        
        {/* ЛЕВЫЙ САЙДБАР (Скрыт до xl) */}
        <div className="hidden xl:block flex-shrink-0 w-64 border-r border-border bg-sidebar-background">
          <Sidebar />
        </div>

        {/* ЦЕНТРАЛЬНЫЙ КОНТЕНТ */}
        <main className="flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
          {/* Используем w-full вместо container, чтобы контент сжимался корректно */}
          <div className="w-full px-3 sm:px-6 py-4 flex-grow">
            
            {/* БЛОК ЛОГОТИПА */}
            <div 
              className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 md:p-8 
                          rounded-xl shadow-lg mb-6 flex justify-center items-center
                          transition-all duration-300 hover:shadow-xl hover:scale-[1.01]`}
            >
              <Link to="/" className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8">
                <img 
                  src="https://s2.radikal.cloud/2025/09/30/educenter-logo18562125e990d0a1.png" 
                  alt="Логотип" 
                  className="h-24 w-24 md:h-28 md:w-28 rounded-xl object-cover 
                             bg-white p-3 shadow-lg flex-shrink-0"
                />
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
                    Тихорецкий техникум железнодорожного транспорта
                  </h1>
                  <h2 className="text-sm md:text-base text-blue-100 leading-tight mt-1">
                    филиала РГУПС
                  </h2>
                </div>
              </Link>
            </div>
            
            <ContactStrip />
            <InfoBlocks />
            
            {/* Здесь рендерится страница */}
            {children}
            
          </div>

          <div className="mt-8">
            <Carousel />
          </div>
          <Footer onlineUsers={onlineUsers} />
        </main>

        {/* ПРАВЫЙ САЙДБАР (Скрыт до xl) */}
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto hidden xl:block flex-shrink-0">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default MainLayout;