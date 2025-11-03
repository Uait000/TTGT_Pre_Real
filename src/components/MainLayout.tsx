
import Carousel from '@/components/Carousel';
import React from 'react';
import Header from './Header'; 
import Sidebar from './Sidebar';
import InfoBlocks from './InfoBlocks'; 
import SidebarCards from './SidebarCards';
import ContactStrip from './ContactStrip'; 
import Footer from './Footer';        

interface MainLayoutProps {
  children: React.ReactNode; 
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col"> 
        <Header />
        <div className="flex flex-1 relative"> 
            <Sidebar /> 
            <main className="flex-1 flex flex-col justify-between"> 
                <div className="container mx-auto px-6 py-4 flex-grow"> 
                    <ContactStrip /> 
                    <InfoBlocks /> 
                    {children}
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

export default MainLayout;