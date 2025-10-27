import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dc_1 from '@/assets/file/Zapovedi_rodit.pdf';
import dc_2 from '@/assets/file/Zakon_na_zashshite_det.pdf';
import dc_3 from '@/assets/file/Vospit_bez_nasil_kons_bes.pdf';
import dc_4 from '@/assets/file/Prin_sem_blagop.pdf';
import dc_5 from '@/assets/file/Predupr_prestup.pdf';
import dc_6 from '@/assets/file/Poved_rod_v_konf_rek.pdf';
import dc_7 from '@/assets/file/Detctvo_bez_nasil_kons_dlya_rodit.pdf';
import dover from '@/assets/pictures/tel_dov_deti.jpg';
import pam from '@/assets/pictures/2.jpg';

const EducationalWork = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { id: 1, src: dover, alt: 'Воспитательная работа 1' },
    { id: 2, src: pam, alt: 'Воспитательная работа 2' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const pdfDocuments = [
    { title: 'Закон на защите детства', file: dc_2 },
    { title: 'Детство без насилия и жестокости (консультация для родителей)', file: dc_7 },
    { title: 'Консультативная беседа с родителями на тему: "Воспитание без насилия"', file: dc_3 },
    { title: 'Памятка для родителей (заповеди)', file: dc_1 },
    { title: 'Предупреждение преступлений в отношении детей, защита их жизни и здоровья...', file: dc_5 },
    { title: 'Принципы семейного благополучия. Основные параметры неправильного воспитания', file: dc_4 },
    { title: 'Поведение родителей в конфликте с подростком (рекомендации)', file: dc_6 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Воспитательная работа</h1>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                {/* Карусель изображений */}
                <div className="relative max-w-4xl mx-auto mb-8">
                  {/* ✅ ИСПРАВЛЕНИЕ: Убраны классы, задающие фиксированную высоту/пропорции */}
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={images[currentSlide].src}
                      alt={images[currentSlide].alt}
                      // ✅ ИСПРАВЛЕНИЕ: Высота теперь подстраивается автоматически
                      className="w-full h-auto"
                    />
                  </div>

                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-6 h-6 text-primary" />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </button>

                  <div className="flex justify-center space-x-2 mt-4">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentSlide
                            ? 'bg-primary scale-125'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Основной текст */}
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                    ОПЕРАТИВНО – ПРОФИЛАКТИЧЕСКОЕ МЕРОПРИЯТИЕ «ЗАЩИТА» С 1 ПО 10 ИЮНЯ 2024 ГОДА В ТТЖТ – ФИЛИАЛЕ РГУПС
                  </h2>
                  
                  <div className="prose prose-gray max-w-none space-y-4">
                    <p className="text-foreground leading-relaxed">
                      С 1 по 10 июня 2024 года в ТТЖТ – филиале РГУПС проводится оперативно-профилактическое мероприятие «Защита».
                    </p>
                    
                    <p className="text-foreground leading-relaxed">
                      <strong>Цель:</strong> выявление и пресечение преступных посягательств в отношении детей, установление лиц, жестоко обращающихся с ними, совершающих насильственные действия, вовлекающих подростков в совершение антиобщественных действий, а также родителей, законных представителей, иных членов их семей, нарушающих права и законные интересы несовершеннолетних.
                    </p>
                    
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                      <h3 className="font-semibold text-primary mb-4">В рамках проведения мероприятия проводится работа, направленная на:</h3>
                      <ul className="space-y-3 text-foreground">
                        <li>• проведение предупредительно-профилактических бесед со студентами и их родителями (законными представителями);</li>
                        <li>• доведение до сведения обучающихся в местах массового пребывания, а так же на официальных аккаунтах ТТЖТ – филиала РГУПС в социальных сетях информации о детском телефоне доверия с единым номером (8-800-2000-122), с разъяснением возможности получения консультативно-психологической помощи при возникновении любой сложной жизненной ситуации;</li>
                        <li>• разъяснение основ безопасного поведения и способов реагирования на противоправные действия со стороны взрослых лиц.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* PDF документы */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-primary mb-6 text-center">Документы для скачивания</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pdfDocuments.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">📄</div>
                          <span className="text-sm text-foreground font-medium">{doc.title}</span>
                        </div>
                      </a>
                    ))}
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
    </div>
  );
};

export default EducationalWork;