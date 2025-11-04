import React, { useState } from 'react'; 
import { List, X } from 'lucide-react'; 
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import Carousel from '@/components/Carousel';
import ContactStrip from '@/components/ContactStrip'; 
import Footer from '@/components/Footer'; 
import NewsSection from '@/components/NewsSection';

const Index: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            <Header />
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
            
            <div className="flex flex-1 relative"> 

                {/* Статическая боковая панель для ПК */}
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

