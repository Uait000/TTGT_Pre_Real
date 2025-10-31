import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import InfoBlocks from '@/components/InfoBlocks';
import NewsSection from '@/components/NewsSection'; 
import SidebarCards from '@/components/SidebarCards';
import Carousel from '@/components/Carousel';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex relative">
        <Sidebar />
        <main className="flex-1 min-h-screen central-content-area">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            <NewsSection /> 

          </div>
          <Carousel />
        </main>
        <aside className="fixed-right-panel">
          <div className="p-6">
            <SidebarCards />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;