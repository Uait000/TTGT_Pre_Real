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
                <Sidebar />

                <main className="flex-1 flex flex-col justify-between">

                    <div className="container mx-auto px-6 py-4 flex-grow">
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