import React, { useState, useEffect } from 'react'; 
import { List, X } from 'lucide-react'; 
import Header from '@/components/Header'; 
import Sidebar from '@/components/Sidebar';
import InfoBlocks from '@/components/InfoBlocks'; 
import SidebarCards from '@/components/SidebarCards';
import ContactStrip from '@/components/ContactStrip'; 
import Footer from '@/components/Footer'; 
import Carousel from '@/components/Carousel'; 
// Импортируем наш сервис и хук
import { wsService } from '@/services/websocketService';
import { useWebSocketEvents } from '@/hooks/useWebSocketEvents';

interface MainLayoutProps {
  children: React.ReactNode; 
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. Вызываем хук, чтобы начать слушать события
  const { onlineUsers } = useWebSocketEvents();

  // 2. --- ЗАПУСКАЕМ ПОДКЛЮЧЕНИЕ ---
  useEffect(() => {
    // Подключаемся, только если мы не в админке
    if (!window.location.pathname.startsWith('/admin')) {
      console.log('MainLayout: Connecting WebSocket...');
      wsService.connect('/websocket/'); // <--- ЗАПУСК!
    }

    // Отключаемся, когда компонент MainLayout "умирает"
    return () => {
      console.log('MainLayout: Closing WebSocket.');
      wsService.close();
    };
  }, []); // [] = выполнить только один раз при загрузке


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col"> 
      <Header />

      {/* ... (мобильная боковая панель) ... */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-[6.5rem] left-3 z-40 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg text-primary border border-border/50"
        aria-label="Открыть быстрое меню"
      >
        <List className="w-5 h-5" />
      </button>
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50" 
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
      {/* ... (конец мобильной боковой панели) ... */}


      <div className="flex flex-1 relative"> 
        <div className="hidden lg:block">
          <Sidebar /> 
        </div>

        <main className="flex-1 flex flex-col justify-between min-w-0"> 
          <div className="container mx-auto px-3 sm:px-6 py-4 flex-grow"> 
            <ContactStrip /> 
            <InfoBlocks /> 
            {children}
          </div>
          <div className="mt-8"> 
            <Carousel />
          </div>

          {/* 3. Передаем onlineUsers в Footer */}
          <Footer onlineUsers={onlineUsers} />
        </main>
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto hidden lg:block">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default MainLayout;
