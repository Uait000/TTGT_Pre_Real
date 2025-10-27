import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Bell, ZoomIn } from 'lucide-react';
import rasp1 from '@/assets/pictures/rasp1kurs.jpg';
import rasp2 from '@/assets/pictures/rasp234kurs.jpg';

const BellSchedule = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50"> {/* Легкий фон */}
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                <Bell className="w-10 h-10 mr-4 text-accent" />
                Расписание звонков
              </h1>
              <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
                Актуальное расписание учебных занятий для всех курсов.
              </p>
              
              {/* ✅ ИСПРАВЛЕНИЕ: Блоки теперь в одной колонке с отступом */}
              <div className="flex flex-col gap-8 max-w-4xl mx-auto"> {/* Центрируем и задаем макс. ширину */}
                
                {/* --- Карточка 1 --- */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                  <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Расписание звонков (1 курс)</h2>
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer group shadow-inner"
                    onClick={() => setSelectedImage(rasp1)}
                  >
                    <img
                      src={rasp1}
                      alt="Расписание звонков - 1 курс"
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-opacity duration-300">
                      <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                    </div>
                  </div>
                </div>

                {/* --- Карточка 2 --- */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                  <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Расписание звонков (2-4 курс)</h2>
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer group shadow-inner"
                    onClick={() => setSelectedImage(rasp2)}
                  >
                    <img
                      src={rasp2}
                      alt="Расписание звонков - 2-4 курс"
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-opacity duration-300">
                      <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </main>
        
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>

      {/* Модальное окно (Лайтбокс) */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] p-2 bg-transparent border-none shadow-none">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Расписание звонков (увеличено)"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BellSchedule;