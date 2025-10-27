import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MapPin, Phone, User, FileText, Target, Car, GraduationCap, Building, X, ChevronLeft, ChevronRight } from 'lucide-react';
import avto1 from '@/assets/pictures/School.jpg';
import avto2 from '@/assets/pictures/phoca_thumb_l_5237.jpg';

// Убраны импорты react-image-lightbox

const DrivingSchool = () => {
  // Состояние для простого лайтбокса
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { src: avto1, alt: 'Автодром' },
    { src: avto2, alt: 'Учебные автомобили' },
  ];

  // Функция для ОТКРЫТИЯ лайтбокса
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true); // <--- Устанавливает флаг открытия
  };

  // Функция для ЗАКРЫТИЯ лайтбокса
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + images.length - 1) % images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center tracking-tight">Автошкола ТТЖТ</h1>
              <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">Качественная подготовка водителей категории «В» с 2010 года.</p>
              
              <div className="space-y-12">

                {/* Секция "Об автошколе" и Стоимость */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                   {/* ... (код секции без изменений) ... */}
                   <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md h-full">
                    <CardHeader className="pb-4">
                       <CardTitle className="text-2xl font-semibold text-blue-800 flex items-center">
                         <GraduationCap className="w-6 h-6 mr-3 text-blue-600"/> О нашей автошколе
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed text-base">
                        Автошкола по подготовке водителей транспортных средств категории «В» с механической и автоматической трансмиссией открыта на отделении дополнительного профессионального образования ТТЖТ - филиала РГУПС и работает на рынке образовательных услуг с октября 2010 года.
                      </p>
                       <div className="mt-6 bg-white rounded-lg p-4 border border-blue-100">
                         <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
                           <Target className="w-5 h-5 mr-2 text-blue-500"/> Цели обучения
                         </h3>
                         <p className="text-gray-600 leading-relaxed text-sm">
                            Основная цель работы автошколы – обучение основам безопасного управления, практическая отработка наиболее важных элементов управления автомобилем, преодоление психологического барьера непонимания между действиями новичка-водителя и поведением автомобиля на дороге.
                          </p>
                       </div>
                    </CardContent>
                  </Card>
                   <Card className="p-8 bg-gradient-to-br from-green-50 to-teal-50 border-green-200 shadow-md flex flex-col items-center justify-center text-center h-full">
                      <h3 className="text-xl font-semibold text-green-800 mb-3">Стоимость обучения</h3>
                      <p className="text-5xl font-bold text-green-700 mb-1">60 000 ₽</p>
                      <p className="text-base text-gray-600">с 1 сентября 2025 г.</p>
                  </Card>
                </section>

                 {/* Секция с изображениями */}
                 <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ✅ КЛИК ПО ЭТОМУ DIV ОТКРЫВАЕТ ЛАЙТБОКС С ПЕРВОЙ КАРТИНКОЙ */}
                    <div 
                      className="rounded-xl overflow-hidden shadow-lg group relative cursor-pointer"
                      onClick={() => openLightbox(0)} 
                    >
                       <img src={images[0].src} alt={images[0].alt} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"/>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                       <p className="absolute bottom-4 left-4 text-white font-semibold text-lg z-10">{images[0].alt}</p>
                    </div>
                     {/* ✅ КЛИК ПО ЭТОМУ DIV ОТКРЫВАЕТ ЛАЙТБОКС СО ВТОРОЙ КАРТИНКОЙ */}
                     <div 
                       className="rounded-xl overflow-hidden shadow-lg group relative cursor-pointer"
                       onClick={() => openLightbox(1)} 
                     >
                       <img src={images[1].src} alt={images[1].alt} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"/>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                       <p className="absolute bottom-4 left-4 text-white font-semibold text-lg z-10">{images[1].alt}</p>
                    </div>
                 </section>

                {/* Остальные секции без изменений... */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* ... (код секции без изменений) ... */}
                   <Card className="p-6 border-gray-200 shadow-sm">
                     <CardHeader className="pb-4">
                       <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                          <Building className="w-6 h-6 mr-3 text-gray-500"/> Материально-техническая база
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-base text-gray-700 list-disc list-inside">
                        <li>2 учебных класса с методическими материалами</li>
                        <li>Компьютерный класс на 15 мест</li>
                        <li>Автодром площадью 3 га</li>
                        <li>Учебные автомобили с двойным управлением</li>
                        <li>Современное оборудование и тренажеры</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-6 border-gray-200 shadow-sm">
                     <CardHeader className="pb-4">
                       <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                          <Car className="w-6 h-6 mr-3 text-gray-500"/> Автопарк
                       </CardTitle>
                    </CardHeader>
                     <CardContent>
                      <ul className="space-y-2 text-base text-gray-700 list-disc list-inside">
                        <li>Шевролет-Авео</li>
                        <li>Рено Логан</li>
                        <li>Педали дополнительного управления</li>
                        <li>Камеры видеонаблюдения</li>
                        <li>Современное техническое оснащение</li>
                      </ul>
                     </CardContent>
                  </Card>
                </section>

                 <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-8 shadow-sm">
                   {/* ... (код секции без изменений) ... */}
                   <h2 className="text-2xl font-semibold text-indigo-800 mb-6 text-center">Наши преимущества</h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[
                       'Качественная подготовка водителей', 'Поэтапная оплата', 'Вечернее время теории',
                       'Индивидуальный график вождения', 'Обучение в выходные', 'Широкий выбор авто',
                       'Свидетельство гос. образца', 'Сдача в ГИБДД с нами', 'Сопровождение до прав',
                       'Профессиональные инструкторы'
                     ].map((item, index) => (
                       <div key={index} className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-indigo-100 hover:border-indigo-300 transition-colors duration-200">
                         <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                         <span className="text-gray-700">{item}</span>
                       </div>
                     ))}
                   </div>
                 </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* ... (код секции без изменений) ... */}
                   <Card className="lg:col-span-2 p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm">
                    <CardHeader className="pb-4">
                       <CardTitle className="text-2xl font-semibold text-gray-800">Контакты и запись</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-base text-gray-700">
                      <p className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-gray-500"/> <strong>Адрес:</strong> ТТЖТ – филиал РГУПС, ул. Красноармейская, 57, каб. 116, 106а</p>
                      <p className="flex items-center"><Phone className="w-5 h-5 mr-3 text-gray-500"/> <strong>Телефон:</strong> 8(86196) 6-20-03, доб. 125, 135</p>
                      <p className="flex items-center"><Phone className="w-5 h-5 mr-3 text-gray-500"/> <strong>Мобильный:</strong> 89884728160</p>
                      <p className="flex items-center"><User className="w-5 h-5 mr-3 text-gray-500"/> <strong>Заведующий отделом:</strong> Токарев Максим Викторович</p>
                    </CardContent>
                  </Card>
                   <Card className="p-6 bg-blue-50 border-blue-200 shadow-sm">
                     <CardHeader className="pb-3">
                       <CardTitle className="text-lg font-semibold text-blue-800 flex items-center">
                         <FileText className="w-5 h-5 mr-2 text-blue-600"/> Документы для зачисления
                       </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-base text-blue-900 space-y-2 list-disc list-inside">
                        <li>Паспорт</li>
                        <li>Действующая мед. справка</li>
                        <li>Фото 3×4 см (1 шт.)</li>
                      </ul>
                     </CardContent>
                  </Card>
                </section>

                 <section className="text-center bg-gradient-to-r from-primary to-blue-700 rounded-xl p-10 shadow-lg text-white">
                   {/* ... (код секции без изменений) ... */}
                   <h2 className="text-3xl font-bold mb-4">До встречи в нашем техникуме!</h2>
                  <p className="text-lg font-medium max-w-2xl mx-auto">
                    Уметь качественно управлять транспортным средством – нелегкая задача.
                    Так не лучше ли учиться этому у профессионалов?!
                  </p>
                 </section>
              </div>
            </div>
          </div>
        </main>
        
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>

      {/* ✅ ЭТОТ БЛОК ОТВЕЧАЕТ ЗА ОТОБРАЖЕНИЕ ЛАЙТБОКСА */}
      {/* Он показывается только когда lightboxOpen === true */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4" 
          onClick={closeLightbox} 
        >
          <img 
            src={images[currentImageIndex].src} 
            alt={images[currentImageIndex].alt} 
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()} 
          />

          <button 
            onClick={closeLightbox} 
            className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>

          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); goToPrevImage(); }} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-3 hover:bg-black/50 transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); goToNextImage(); }} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-3 hover:bg-black/50 transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DrivingSchool;