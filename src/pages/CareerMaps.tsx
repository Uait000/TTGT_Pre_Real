import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
// Иконки для нового, чистого дизайна
import { Download } from 'lucide-react';

// --- ИМПОРТ ВСЕХ PDF ФАЙЛОВ ИЗ ПАПКИ 'careercard' ---
import pdf_08_02_01 from '@/assets/file/careercard/08.02.01.pdf';
import pdf_08_02_10 from '@/assets/file/careercard/08.02.10.pdf';
import pdf_09_02_01 from '@/assets/file/careercard/09.02.01.pdf';
import pdf_11_02_06 from '@/assets/file/careercard/11.02.06.pdf';
import pdf_13_02_07 from '@/assets/file/careercard/13.02.07.pdf';
import pdf_22_02_06 from '@/assets/file/careercard/22.02.06.pdf';
import pdf_23_02_01 from '@/assets/file/careercard/23.02.01.pdf';
import pdf_23_02_04 from '@/assets/file/careercard/23.02.04.pdf';
import pdf_23_02_06_01 from '@/assets/file/careercard/23.02.06.01.pdf';
import pdf_23_02_06_03 from '@/assets/file/careercard/23.02.06.03.pdf';
import pdf_27_02_03 from '@/assets/file/careercard/27.02.03.pdf';
import pdf_38_02_01 from '@/assets/file/careercard/38.02.01.pdf';
// ---------------------------------------------------

const CareerMaps = () => {
  // --- ОБНОВЛЕННЫЙ МАССИВ С КОДАМИ СПЕЦИАЛЬНОСТЕЙ ---
  const careerMaps = [
    {
      code: '08.02.01',
      title: 'Строительство и эксплуатация зданий и сооружений',
      url: pdf_08_02_01
    },
    {
      code: '08.02.10',
      title: 'Строительство железных дорог, путь и путевое хозяйство',
      url: pdf_08_02_10
    },
    {
      code: '09.02.01',
      title: 'Компьютерные системы и комплексы',
      url: pdf_09_02_01
    },
    {
      code: '11.02.06',
      title: 'Техническая эксплуатация транспортного радиоэлектронного оборудования (по видам транспорта)',
      url: pdf_11_02_06
    },
    {
      code: '13.02.07',
      title: 'Электроснабжение',
      url: pdf_13_02_07
    },
    {
      code: '22.02.06',
      title: 'Сварочное производство',
      url: pdf_22_02_06
    },
    {
      code: '23.02.01',
      title: 'Организация перевозок и управление на транспорте (по видам)',
      url: pdf_23_02_01
    },
    {
      code: '23.02.04',
      title: 'Техническая эксплуатация подъемно-транспортных, строительных, дорожных машин и оборудования (по отраслям)',
      url: pdf_23_02_04
    },
    {
      code: '23.02.06.01',
      title: 'Техническая эксплуатация подвижного состава железных дорог (электроподвижной состав)',
      url: pdf_23_02_06_01
    },
    {
      code: '23.02.06.03',
      title: 'Техническая эксплуатация подвижного состава железных дорог (вагоны)',
      url: pdf_23_02_06_03
    },
    {
      code: '27.02.03',
      title: 'Автоматика и телемеханика на транспорте (железнодорожном транспорте)',
      url: pdf_27_02_03
    },
    {
      code: '38.02.01',
      title: 'Экономика и бухгалтерский учет (по отраслям)',
      url: pdf_38_02_01
    }
  ];
  // ---------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100"> {/* Чистый фон */}
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        {/* --- НАЧАЛО: РЕДИЗАЙН ЦЕНТРАЛЬНОГО БЛОКА --- */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-4 lg:px-6 py-12">
            
            {/* 1. Заголовок (чистый и простой) */}
            <h1 className="text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900">
              Карьерные карты
            </h1>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Выберите специальность, чтобы узнать о своем карьерном пути и возможностях.
            </p>
            
            {/* 2. Новый "журнальный" список с ИСПРАВЛЕННЫМ ВЫРАВНИВАНИЕМ */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {careerMaps.map((map, index) => (
                  <li key={index}>
                    <a
                      href={map.url} // Ссылка на импортированный PDF
                      target="_blank"
                      rel="noopener noreferrer"
                      // 'group' - включает отслеживание hover для дочерних элементов
                      // Используем flex-контейнер для всего элемента
                      className="group flex items-center justify-between p-6 lg:p-8 transition-all duration-300 hover:bg-primary/5" // Очень легкий фон при наведении
                    >
                      
                      {/* Левая часть (Код + Название) - теперь она занимает все место */}
                      <div className="flex flex-1 items-start gap-5 lg:gap-8"> {/* Используем items-start для выравнивания по верху */}
                        
                        {/* Колонка 1: Код (фиксированная ширина) */}
                        <div className="w-24 lg:w-32 flex-shrink-0">
                          <span className="text-xl lg:text-2xl font-bold text-primary/50 transition-all duration-300 group-hover:text-primary">
                            {map.code}
                          </span>
                        </div>

                        {/* Колонка 2: Название (гибкая, занимает остаток) */}
                        <div className="flex-1">
                          <h3 className="text-base lg:text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-primary">
                            {map.title}
                            {/* Теперь, если текст перенесется, он начнется с этой же точки */}
                          </h3>
                        </div>
                      </div>

                      {/* Правая часть: "Скрытая" кнопка */}
                      <div className="flex-shrink-0 flex items-center gap-2 text-primary font-medium opacity-0 transform translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ml-4">
                        <span className="hidden md:inline">Скачать PDF</span>
                        <Download className="w-5 h-5" />
                      </div>

                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </main>
        {/* --- КОНЕЦ: РЕДИЗАЙН ЦЕНТРАЛЬНОГО БЛОКА --- */}
        
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default CareerMaps;