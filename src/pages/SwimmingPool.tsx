import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Waves, FileText, Users, Phone, Film, ExternalLink } from 'lucide-react'; // Changed Swimmer to Waves
import Prik1 from '@/assets/file/Prikaz_Stoim_05072024.pdf';
import Prik2 from '@/assets/file/Prikaz_Stoim_01012025.pdf';
import Prav from '@/assets/file/Pravila_polz_bass_30122021.pdf';
import Polog from '@/assets/file/Polog_bas_30122021.pdf';
import Rasp from '@/assets/file/RaspRab_Bass_okt_2025.pdf';
import sw_1 from '@/assets/pictures/phoca_thumb_l_321.jpg';
import sw_2 from '@/assets/pictures/phoca_thumb_l_322.jpg';
import sw_3 from '@/assets/pictures/phoca_thumb_l_323.jpg';
import sw_4 from '@/assets/pictures/phoca_thumb_l_324.jpg';
import sw_5 from '@/assets/pictures/phoca_thumb_l_325.jpg';
import sw_6 from '@/assets/pictures/phoca_thumb_l_326.jpg';


const SwimmingPool = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { id: 1, src: sw_1, alt: 'Бассейн 1' },
    { id: 2, src: sw_2, alt: 'Бассейн 2' },
    { id: 3, src: sw_3, alt: 'Бассейн 3' },
    { id: 4, src: sw_4, alt: 'Бассейн 4' },
    { id: 5, src: sw_5, alt: 'Бассейн 5' },
    { id: 6, src: sw_6, alt: 'Бассейн 6' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 4500);
    return () => clearInterval(slideInterval);
  }, [images.length]);

  const documents = [
    { title: 'Приказ "Об установлении стоимости физкультурно-оздоровительных услуг..." с 01.01.2025 г.', file: Prik2, type: 'pdf' },
    { title: 'Приказ "Об установлении стоимости услуг по обучению..." с 06.07.2024 г.', file: Prik1, type: 'pdf' },
    { title: 'Правила пользования бассейном ТТЖТ - филиала РГУПС', file: Prav, type: 'pdf' },
    { title: 'Положение о плавательном бассейне ТТЖТ - филиала РГУПС', file: Polog, type: 'pdf' },
    { title: 'Расписание занятий с 01 октября по 31 октября 2025 года', file: Rasp, type: 'pdf' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />

            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                <Waves className="w-10 h-10 mr-4 text-blue-500" />
                Плавательный бассейн ТТЖТ
              </h1>
              <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">Плавайте с удовольствием и пользой для здоровья!</p>

              <div className="space-y-12">

                {/* --- Секция "Приветствие" --- */}
                <section className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-8 shadow-sm">
                   {/* ... (текст без изменений) ... */}
                   <p className="text-lg text-gray-700 leading-relaxed mb-4">
                     <em>"Плавать рекомендуется с детства и до глубокой старости."</em> - Заведующая бассейном Г.А. Лапова
                   </p>
                   <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto mb-4">
                     Во время плавания увеличивается объем легких, ускоряется процесс насыщения кислородом организма. Вода обладает массирующим и расслабляющим эффектом, что благотворно влияет на нервную систему. Люди, посещающие бассейн, меньше подвержены нервным расстройствам, бессонницам, реже болеют и дольше живут.
                   </p>
                    <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
                     Возможность плавать в любое время года без ограничений по возрасту и состоянию здоровья – вот, что по-настоящему ценно!
                   </p>
                   <p className="text-blue-700 text-xl font-semibold">
                     Приглашаем всех желающих посетить бассейн Тихорецкого техникума железнодорожного транспорта!
                   </p>
                </section>

                {/* --- Карусель --- */}
                <section className="relative max-w-5xl mx-auto group">
                   {/* ... (карусель без изменений) ... */}
                   <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                    <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                      {images.map((image) => (
                        <div key={image.id} className="w-full flex-shrink-0">
                           <img src={image.src} alt={image.alt} className="w-full h-[60vh] object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={prevSlide} className="absolute left-[-15px] md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ChevronLeft className="w-6 h-6 text-primary" />
                  </button>
                  <button onClick={nextSlide} className="absolute right-[-15px] md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${ index === currentSlide ? 'bg-white scale-125 shadow-md' : 'bg-white/50 hover:bg-white/80' }`} />
                    ))}
                  </div>
                </section>

                {/* --- Секция "Цены" --- */}
                <section className="space-y-8">
                   <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Прейскурант цен</h2>

                   {/* Таблица 1 */}
                   <Card className="border-green-300 shadow-sm overflow-hidden"> {/* Изменен цвет рамки */}
                     <CardHeader className="bg-green-100 p-4 border-b border-green-300"> {/* Изменен фон */}
                       <CardTitle className="text-xl font-semibold text-green-800 text-center">Групповые занятия для детей с 7 лет</CardTitle>
                       <p className="text-sm text-green-700 text-center">Дополнительные общеобразовательные программы</p>
                     </CardHeader>
                     <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-green-50"> {/* Изменен фон */}
                              {/* ✅ ИСПРАВЛЕНИЕ: Добавлен text-center */}
                              <TableHead className="font-semibold text-green-900 text-center">Наименование услуги</TableHead>
                              <TableHead className="font-semibold text-green-900 text-center">Количество занятий</TableHead>
                              <TableHead className="font-semibold text-green-900 text-center">Стоимость (руб.)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {/* ✅ ИСПРАВЛЕНИЕ: Добавлен text-center */}
                            <TableRow><TableCell className="text-center">Обучение спортивному плаванию</TableCell><TableCell className="text-center">4 (1 раз в неделю)</TableCell><TableCell className="text-center font-medium">2000</TableCell></TableRow>
                            <TableRow><TableCell className="text-center">Обучение первичным навыкам плавания</TableCell><TableCell className="text-center">4 (1 раз в неделю)</TableCell><TableCell className="text-center font-medium">2000</TableCell></TableRow>
                            <TableRow><TableCell className="text-center">Обучение спортивному плаванию</TableCell><TableCell className="text-center">8 (2 раза в неделю)</TableCell><TableCell className="text-center font-medium">4000</TableCell></TableRow>
                            <TableRow><TableCell className="text-center">Обучение первичным навыкам плавания</TableCell><TableCell className="text-center">8 (2 раза в неделю)</TableCell><TableCell className="text-center font-medium">4000</TableCell></TableRow>
                            <TableRow><TableCell className="text-center">Обучение спортивному плаванию</TableCell><TableCell className="text-center">12 (3 раза в неделю)</TableCell><TableCell className="text-center font-medium">6000</TableCell></TableRow>
                            <TableRow><TableCell className="text-center">Обучение первичным навыкам плавания</TableCell><TableCell className="text-center">12 (3 раза в неделю)</TableCell><TableCell className="text-center font-medium">6000</TableCell></TableRow>
                          </TableBody>
                        </Table>
                     </CardContent>
                   </Card>

                   {/* Таблица 2 */}
                   <Card className="border-blue-300 shadow-sm overflow-hidden"> {/* Изменен цвет рамки */}
                     <CardHeader className="bg-blue-100 p-4 border-b border-blue-300"> {/* Изменен фон */}
                       <CardTitle className="text-xl font-semibold text-blue-800 text-center">Для взрослых и детей старше 14 лет</CardTitle>
                       <p className="text-sm text-blue-700 text-center">Оказание услуг по плаванию с 01.01.2025 г.</p>
                     </CardHeader>
                      <CardContent className="p-0">
                         <Table>
                          <TableHeader>
                            <TableRow className="bg-blue-50"> {/* Изменен фон */}
                              {/* ✅ ИСПРАВЛЕНИЕ: Добавлен text-center */}
                              <TableHead className="font-semibold text-blue-900 text-center">Наименование услуги</TableHead>
                              <TableHead className="font-semibold text-blue-900 text-center">Количество занятий</TableHead>
                              <TableHead className="font-semibold text-blue-900 text-center">Стоимость (руб.)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                             {/* ✅ ИСПРАВЛЕНИЕ: Добавлен text-center */}
                            <TableRow><TableCell className="text-center">Разовое посещение</TableCell><TableCell className="text-center">1</TableCell><TableCell className="text-center font-medium">450</TableCell></TableRow>
                            <TableRow><TableCell className="text-center">Абонемент</TableCell><TableCell className="text-center">4 в месяц</TableCell><TableCell className="text-center font-medium">1 600</TableCell></TableRow>
                            <TableRow><TableCell className="text-center">Абонемент</TableCell><TableCell className="text-center">8 в месяц</TableCell><TableCell className="text-center font-medium">3 200</TableCell></TableRow>
                           </TableBody>
                        </Table>
                      </CardContent>
                   </Card>

                   {/* Таблица 3 */}
                   <Card className="border-purple-300 shadow-sm overflow-hidden"> {/* Изменен цвет рамки */}
                     <CardHeader className="bg-purple-100 p-4 border-b border-purple-300"> {/* Изменен фон */}
                       <CardTitle className="text-xl font-semibold text-purple-800 text-center">Для работников и студентов ТТЖТ</CardTitle>
                        <p className="text-sm text-purple-700 text-center">Оказание услуг по плаванию с 01.01.2025 г.</p>
                     </CardHeader>
                     <CardContent className="p-0">
                       <Table>
                         <TableHeader>
                            <TableRow className="bg-purple-50"> {/* Изменен фон */}
                              {/* ✅ ИСПРАВЛЕНИЕ: Добавлен text-center */}
                              <TableHead className="font-semibold text-purple-900 text-center">Наименование услуги</TableHead>
                              <TableHead className="font-semibold text-purple-900 text-center">Количество занятий</TableHead>
                              <TableHead className="font-semibold text-purple-900 text-center">Стоимость (руб.)</TableHead>
                            </TableRow>
                          </TableHeader>
                         <TableBody>
                             {/* ✅ ИСПРАВЛЕНИЕ: Добавлен text-center */}
                            <TableRow><TableCell className="text-center">Разовое посещение для работников</TableCell><TableCell className="text-center">1</TableCell><TableCell className="text-center font-medium text-green-600">Бесплатно</TableCell></TableRow>
                            <TableRow><TableCell className="text-center">Абонемент для работников</TableCell><TableCell className="text-center">2 в неделю</TableCell><TableCell className="text-center font-medium">1600 / месяц</TableCell></TableRow>
                            <TableRow><TableCell className="text-center">Разовое посещение для студентов (внеурочно)</TableCell><TableCell className="text-center">1</TableCell><TableCell className="text-center font-medium">200</TableCell></TableRow>
                         </TableBody>
                       </Table>
                     </CardContent>
                   </Card>
                </section>

                {/* --- Секция Документы --- */}
                <section>
                   <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
                      <FileText className="w-7 h-7 mr-3 text-gray-500"/> Документы для скачивания
                   </h2>
                   {/* ... (секция документов без изменений) ... */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary/50 transition-all duration-300 group transform hover:scale-[1.01] shadow-sm hover:shadow-md"
                      >
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 transition-colors" />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">{doc.title}</span>
                         <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary ml-auto flex-shrink-0 transition-colors" />
                      </a>
                    ))}
                  </div>
                </section>

                 {/* --- Секция Инструкторы и Контакты --- */}
                <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-8 shadow-sm">
                   {/* ... (секция инструкторов и контактов без изменений) ... */}
                   <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
                     <Users className="w-7 h-7 mr-3 text-gray-500"/> Наши инструкторы и контакты
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Инструкторы по плаванию:</h3>
                        <ul className="space-y-3 text-gray-600">
                          <li className="flex items-start">
                             <Waves className="w-5 h-5 mr-3 mt-1 text-blue-400 flex-shrink-0"/>
                             <div>
                               <strong>Шароглазов Константин Леонидович</strong><br/>
                               <span className="text-sm">(призер Чемпионата России на открытой воде, КМС по плаванию)</span>
                             </div>
                          </li>
                           <li className="flex items-start">
                             <Waves className="w-5 h-5 mr-3 mt-1 text-blue-400 flex-shrink-0"/>
                              <div>
                               <strong>Фастова Маргарита Витальевна</strong><br/>
                               <span className="text-sm">(преподаватель физ. культуры, отличник ГТО)</span>
                             </div>
                          </li>
                           <li className="flex items-start">
                             <Waves className="w-5 h-5 mr-3 mt-1 text-blue-400 flex-shrink-0"/>
                             <div>
                               <strong>Бердыч Светлана Александровна</strong><br/>
                                <span className="text-sm">(преподаватель физ. культуры, КМС по спорт. ориентированию)</span>
                             </div>
                           </li>
                             <li className="flex items-start">
                             <Waves className="w-5 h-5 mr-3 mt-1 text-blue-400 flex-shrink-0"/>
                              <div>
                               <strong>Буров Андрей Викторович</strong><br/>
                               <span className="text-sm">(преподаватель физ. культуры, КМС по легкой атлетике, Чемпион России)</span>
                             </div>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-white p-6 rounded-lg border border-gray-200 text-center shadow-inner">
                         <h3 className="text-lg font-semibold text-gray-700 mb-4">Узнать подробности:</h3>
                         <p className="flex items-center justify-center text-gray-800 text-lg mb-2">
                            <Phone className="w-5 h-5 mr-2 text-primary"/>
                            <a href="tel:88619662003" className="hover:text-primary transition-colors">8 (86196) 6-20-03</a>, доб. 134
                         </p>
                          <p className="text-gray-600 text-sm">
                           Заведующая бассейном: Лапова Г.А.
                          </p>
                         <p className="text-xs text-gray-400 mt-4">Реклама</p>
                      </div>
                   </div>
                </section>

                {/* --- Секция Видео --- */}
                 <a
                  href="https://open.edu.gov.ru/quality-of-education/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-8 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all duration-300 group transform hover:-translate-y-1"
                >
                   {/* ... (секция видео без изменений) ... */}
                    <div className="flex items-center mb-4">
                     <Film className="w-8 h-8 text-purple-600 mr-4 flex-shrink-0" />
                    <h2 className="text-2xl font-semibold text-purple-800 group-hover:text-purple-900 transition-colors">Ролик о НОКО</h2>
                  </div>
                  <p className="text-gray-700 group-hover:text-gray-800 transition-colors flex items-center justify-between">
                    <span>Ролик о проведении независимой оценки качества условий осуществления образовательной деятельности организациями</span>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 ml-4" />
                  </p>
                </a>

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

export default SwimmingPool;