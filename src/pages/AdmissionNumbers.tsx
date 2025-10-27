import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { Download } from 'lucide-react';
import tikhr from '../assets/file/tikhoretck_na_us_05_ot_28_02_2025.pdf';
import tik from '@/assets/pictures/tikhoretck_na_us_05_ot_28_02_2025.jpg';

const AdmissionNumbers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Контрольные цифры приема</h1>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                {/* Document image */}
                <div className="w-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden shadow-lg mb-6">
                  <img
                    src= {tik}
                    alt="Контрольные цифры приема"
                    className="w-full h-auto"
                  />
                </div>

                <div className="text-center">
                  <a
                    href= {tikhr}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    <span>Скачать контрольные цифры приема</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default AdmissionNumbers;