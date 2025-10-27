import { useState, useEffect } from 'react'; // ✅ ИСПРАВЛЕНИЕ: Добавлен импорт useState и useEffect
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Download, FileText, CalendarDays, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- НАЧАЛО ИМПОРТОВ PDF ---
// 1 Курс
import A11 from '@/assets/file/class/A11.pdf';
import V11 from '@/assets/file/class/V11.pdf';
import D11 from '@/assets/file/class/D11.pdf';
import D12 from '@/assets/file/class/D12.pdf';
import KS11 from '@/assets/file/class/KS11.pdf';
import KS12 from '@/assets/file/class/KS12.pdf';
import KS13 from '@/assets/file/class/KS13.pdf';
import L11 from '@/assets/file/class/L11.pdf';
import L12 from '@/assets/file/class/L12.pdf';
import L13 from '@/assets/file/class/L13.pdf';
import L14 from '@/assets/file/class/L14.pdf';
import L15 from '@/assets/file/class/L15.pdf';
import P11 from '@/assets/file/class/P11.pdf';
import PM11 from '@/assets/file/class/PM11.pdf';
import R11 from '@/assets/file/class/R11.pdf';
import S11 from '@/assets/file/class/S11.pdf';
import SP11 from '@/assets/file/class/SP11.pdf';
import ES11 from '@/assets/file/class/ES11.pdf';

// 2 Курс
import A21 from '@/assets/file/class/A21.pdf';
import V21 from '@/assets/file/class/V21.pdf';
import D21 from '@/assets/file/class/D21.pdf';
import D22 from '@/assets/file/class/D22.pdf';
import D23 from '@/assets/file/class/D23.pdf';
import KS21 from '@/assets/file/class/KS21.pdf';
import KS22 from '@/assets/file/class/KS22.pdf';
import KS23 from '@/assets/file/class/KS23.pdf';
import L21 from '@/assets/file/class/L21.pdf';
import L22 from '@/assets/file/class/L22.pdf';
import L23 from '@/assets/file/class/L23.pdf';
import L24 from '@/assets/file/class/L24.pdf';
import L25 from '@/assets/file/class/L25.pdf';
import P21 from '@/assets/file/class/P21.pdf';
import PM21 from '@/assets/file/class/PM21.pdf';
import R21 from '@/assets/file/class/R21.pdf';
import S21 from '@/assets/file/class/S21.pdf';
import SP21 from '@/assets/file/class/SP21.pdf';
import E21 from '@/assets/file/class/E21.pdf';
import ES21 from '@/assets/file/class/ES21.pdf';

// 3 Курс
import A31 from '@/assets/file/class/A31.pdf';
import V31 from '@/assets/file/class/V31.pdf';
import D31 from '@/assets/file/class/D31.pdf';
import D32 from '@/assets/file/class/D32.pdf';
import D33 from '@/assets/file/class/D33.pdf';
import KS31 from '@/assets/file/class/KS31.pdf';
import KS32 from '@/assets/file/class/KS32.pdf';
import L31 from '@/assets/file/class/L31.pdf';
import L32 from '@/assets/file/class/L32.pdf';
import L33 from '@/assets/file/class/L33.pdf';
import L34 from '@/assets/file/class/L34.pdf';
import L35 from '@/assets/file/class/L35.pdf';
import L36 from '@/assets/file/class/L36.pdf';
import P31 from '@/assets/file/class/P31.pdf';
import PM31 from '@/assets/file/class/PM31.pdf';
import PM32 from '@/assets/file/class/PM32.pdf';
import R31 from '@/assets/file/class/R31.pdf';
import S31 from '@/assets/file/class/S31.pdf';
import SP31 from '@/assets/file/class/SP31.pdf';
import ES31 from '@/assets/file/class/ES31.pdf';

// 4 Курс
import A41 from '@/assets/file/class/A41.pdf';
import V41 from '@/assets/file/class/V41.pdf';
import KS41 from '@/assets/file/class/KS41.pdf';
import KS42 from '@/assets/file/class/KS42.pdf';
import L41 from '@/assets/file/class/L41.pdf';
import L42 from '@/assets/file/class/L42.pdf';
import L43 from '@/assets/file/class/L43.pdf';
import L44 from '@/assets/file/class/L44.pdf';
import L45 from '@/assets/file/class/L45.pdf';
import PM41 from '@/assets/file/class/PM41.pdf';
import R41 from '@/assets/file/class/R41.pdf';
import S41 from '@/assets/file/class/S41.pdf';
import SP41 from '@/assets/file/class/SP41.pdf';
import ES41 from '@/assets/file/class/ES41.pdf';

// Общие файлы
import Kurs1 from '@/assets/file/class/1kurs.pdf';
import Kurs2 from '@/assets/file/class/2kurs.pdf';
import Kurs3 from '@/assets/file/class/3kurs.pdf';
import Kurs4 from '@/assets/file/class/4kurs.pdf';
import GrafKons from '@/assets/file/class/Grafik_Proved_Konsult_Prepodavat_1sem_25_26.pdf';

// ✅ ДОБАВЛЕНЫ НОВЫЕ ИМПОРТЫ ДЛЯ ЗАОЧНОГО
import Grafzo from '@/assets/file/class/graf_zo_2025.pdf';
import D41z from '@/assets/file/class/D41z.pdf';
import L41z from '@/assets/file/class/L41z.pdf';
import P41z from '@/assets/file/class/P41z.pdf';
// --- КОНЕЦ ИМПОРТОВ ---


// Объект-словарь для связи названий групп с импортами
const schedulePdfs: Record<string, string> = {
  'A11': A11, 'V11': V11, 'D11': D11, 'D12': D12, 'KS11': KS11, 'KS12': KS12, 'KS13': KS13, 'L11': L11, 'L12': L12, 'L13': L13, 'L14': L14, 'L15': L15, 'P11': P11, 'PM11': PM11, 'R11': R11, 'S11': S11, 'SP11': SP11, 'ES11': ES11,
  'A21': A21, 'V21': V21, 'D21': D21, 'D22': D22, 'D23': D23, 'KS21': KS21, 'KS22': KS22, 'KS23': KS23, 'L21': L21, 'L22': L22, 'L23': L23, 'L24': L24, 'L25': L25, 'P21': P21, 'PM21': PM21, 'R21': R21, 'S21': S21, 'SP21': SP21, 'E21': E21, 'ES21': ES21,
  'A31': A31, 'V31': V31, 'D31': D31, 'D32': D32, 'D33': D33, 'KS31': KS31, 'KS32': KS32, 'L31': L31, 'L32': L32, 'L33': L33, 'L34': L34, 'L35': L35, 'L36': L36, 'P31': P31, 'PM31': PM31, 'PM32': PM32, 'R31': R31, 'S31': S31, 'SP31': SP31, 'ES31': ES31,
  'A41': A41, 'V41': V41, 'KS41': KS41, 'KS42': KS42, 'L41': L41, 'L42': L42, 'L43': L43, 'L44': L44, 'L45': L45, 'PM41': PM41, 'R41': R41, 'S41': S41, 'SP41': SP41, 'ES41': ES41,
};

const Schedule = () => {
  const scheduleData = [
    { course: '1 курс', groups: ['А-1-1', 'В-1-1', 'Д-1-1', 'Д-1-2', 'КС-1-1', 'КС-1-2', 'КС-1-3', 'Л-1-1', 'Л-1-2', 'Л-1-3', 'Л-1-4', 'Л-1-5', 'П-1-1', 'ПМ-1-1', 'Р-1-1', 'С-1-1', 'СП-1-1', 'ЭС-1-1'] },
    { course: '2 курс', groups: ['А-2-1', 'В-2-1', 'Д-2-1', 'Д-2-2', 'Д-2-3', 'КС-2-1', 'КС-2-2', 'КС-2-3', 'Л-2-1', 'Л-2-2', 'Л-2-3', 'Л-2-4', 'Л-2-5', 'П-2-1', 'ПМ-2-1', 'Р-2-1', 'С-2-1', 'СП-2-1', 'Э-2-1', 'ЭС-2-1'] },
    { course: '3 курс', groups: ['А-3-1', 'В-3-1', 'Д-3-1', 'Д-3-2', 'Д-3-3', 'КС-3-1', 'КС-3-2', 'Л-3-1', 'Л-3-2', 'Л-3-3', 'Л-3-4', 'Л-3-5', 'Л-3-6', 'П-3-1', 'ПМ-3-1', 'ПМ-3-2', 'Р-3-1', 'С-3-1', 'СП-3-1', 'ЭС-3-1'] },
    { course: '4 курс', groups: ['А-4-1', 'В-4-1', 'КС-4-1', 'КС-4-2', 'Л-4-1', 'Л-4-2', 'Л-4-3', 'Л-4-4', 'Л-4-5', 'ПМ-4-1', 'Р-4-1', 'С-4-1', 'СП-4-1', 'ЭС-4-1'] }
  ];

  const [activeTab, setActiveTab] = useState(scheduleData[0].course);

  // Функция-помощник для преобразования имени
  const formatGroupName = (groupName: string) => {
    let formattedName = groupName.replace(/-/g, ''); // "А-1-1" -> "А11"
    // Транслитерация
    if (formattedName.startsWith('КС')) formattedName = formattedName.replace('КС', 'KS');
    else if (formattedName.startsWith('ПМ')) formattedName = formattedName.replace('ПМ', 'PM');
    else if (formattedName.startsWith('СП')) formattedName = formattedName.replace('СП', 'SP');
    else if (formattedName.startsWith('ЭС')) formattedName = formattedName.replace('ЭС', 'ES');
    else if (formattedName.startsWith('А')) formattedName = formattedName.replace('А', 'A');
    else if (formattedName.startsWith('В')) formattedName = formattedName.replace('В', 'V');
    else if (formattedName.startsWith('Д')) formattedName = formattedName.replace('Д', 'D');
    else if (formattedName.startsWith('Л')) formattedName = formattedName.replace('Л', 'L');
    else if (formattedName.startsWith('П')) formattedName = formattedName.replace('П', 'P');
    else if (formattedName.startsWith('Р')) formattedName = formattedName.replace('Р', 'R');
    else if (formattedName.startsWith('С')) formattedName = formattedName.replace('С', 'S');
    else if (formattedName.startsWith('Э')) formattedName = formattedName.replace('Э', 'E');
    return formattedName;
  }

  const getSchedulePdfUrl = (groupName: string) => {
    const formattedName = formatGroupName(groupName); // "А-1-1" -> "A11"
    const file = schedulePdfs[formattedName];
    if (!file) {
      console.warn(`PDF not found for group: ${groupName} (formatted as ${formattedName}).`);
      return '#'; 
    }
    return file;
  };
  
  const mainScheduleDocs = [
    { title: 'Расписание учебных занятий 1 курс', file: Kurs1 },
    { title: 'Расписание учебных занятий 2 курс', file: Kurs2 },
    { title: 'Расписание учебных занятий 3 курс', file: Kurs3 },
    { title: 'Расписание учебных занятий 4 курс', file: Kurs4 },
  ];

  const consultationDoc = {
    title: 'График проведения консультаций преподавателями в 1 семестре 2025 - 2026 учебного года',
    file: GrafKons
  };
  
  // ✅ ИСПРАВЛЕНИЕ: Подключен PDF
  const partTimeSchedules = [
    { title: 'Календарный учебный график заочного отделения на 2025 - 2026 учебный год', url: Grafzo },
  ];
  // ✅ ИСПРАВЛЕНИЕ: Подключены PDF
  const partTimeSessions = [
    { title: 'Д-4-1(з)', url: D41z },
    { title: 'Л-4-1(з)', url: L41z },
    { title: 'П-4-1(з)', url: P41z },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                <CalendarDays className="w-10 h-10 mr-4 text-accent" />
                Расписание занятий
              </h1>
              <p className="text-center text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
                Актуальное расписание занятий для очного и заочного отделений.
              </p>

              {/* Яркая секция для скачивания приложения */}
              <section className="mb-12 bg-gradient-to-r from-primary to-blue-700 rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between text-white">
                <div className="flex items-center mb-4 md:mb-0">
                  <Smartphone className="w-12 h-12 mr-5 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold">Расписание всегда под рукой!</h2>
                    <p className="text-blue-100">Скачайте наше приложение, чтобы отслеживать замены и расписание в реальном времени.</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-gray-100 font-semibold shadow-md transition-transform transform hover:scale-105"
                  onClick={() => alert('Ссылка на приложение!')} // Замените на вашу ссылку
                >
                  <Download className="w-5 h-5 mr-2" />
                  Скачать приложение
                </Button>
              </section>

              {/* Дизайн для Очного отделения (Вкладки) */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Очное отделение</h2>
                
                {/* --- Вкладки --- */}
                <div className="flex justify-center flex-wrap gap-2 mb-6">
                  {scheduleData.map((course) => (
                    <Button
                      key={course.course}
                      variant={activeTab === course.course ? 'default' : 'outline'}
                      className={`text-lg font-semibold py-3 px-6 rounded-full transition-all duration-300 ${
                        activeTab === course.course 
                        ? 'bg-primary text-white shadow-lg scale-105' 
                        : 'text-gray-600 bg-white hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(course.course)}
                    >
                      {course.course}
                    </Button>
                  ))}
                </div>

                {/* --- Контент вкладок --- */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 min-h-[200px]">
                  {scheduleData.map((course) => (
                    <div 
                      key={course.course}
                      className={`flex flex-wrap gap-3 justify-center ${activeTab === course.course ? 'flex' : 'hidden'}`}
                    >
                      {course.groups.map((group) => {
                        const pdfUrl = getSchedulePdfUrl(group);
                        const isLinkDisabled = pdfUrl === '#';
                        
                        return (
                          <a
                            key={group}
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                              inline-block bg-white text-primary border-2 border-gray-300 font-semibold px-5 py-2.5 rounded-lg text-base
                              transition-all duration-300 shadow-sm 
                              hover:bg-primary hover:text-white hover:border-primary hover:scale-105 hover:shadow-md
                              ${isLinkDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500 line-through' : ''}
                            `}
                            title={isLinkDisabled ? 'Расписание для этой группы скоро появится' : `Скачать расписание ${group}`}
                            onClick={(e) => isLinkDisabled && e.preventDefault()} 
                          >
                            {group}
                          </a>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </section>

              {/* Раздел "Важные документы" */}
              <section className="mb-12">
                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Общие документы и графики</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Общее расписание */}
                    {mainScheduleDocs.map((doc) => (
                      <a
                        key={doc.title}
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-5 bg-blue-50 rounded-lg border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 group"
                      >
                        <div className="flex items-center">
                          <FileText className="w-6 h-6 mr-3 text-blue-600" />
                          <span className="text-blue-800 font-semibold">{doc.title}</span>
                        </div>
                        <Download className="w-5 h-5 text-blue-500 group-hover:text-blue-700 transition-colors" />
                      </a>
                    ))}
                     {/* График консультаций */}
                     <a
                        href={consultationDoc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="md:col-span-2 flex items-center justify-between p-5 bg-green-50 rounded-lg border-2 border-green-200 hover:bg-green-100 hover:border-green-300 transition-all duration-300 group"
                      >
                        <div className="flex items-center">
                          <FileText className="w-6 h-6 mr-3 text-green-600" />
                          <span className="text-green-800 font-semibold">{consultationDoc.title}</span>
                        </div>
                        <Download className="w-5 h-5 text-green-500 group-hover:text-green-700 transition-colors" />
                      </a>
                 </div>
              </section>

              {/* Дизайн для Заочного отделения */}
              <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Заочное отделение</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <Card className="border-gray-200 shadow-md">
                    <CardHeader className="bg-gray-50 p-5 border-b border-gray-200">
                      <CardTitle className="text-xl font-semibold text-gray-800">Учебные графики</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3">
                      {partTimeSchedules.map((doc, index) => (
                         <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-primary/50 transition-all duration-300 group"
                        >
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary transition-colors" />
                            <span className="text-foreground font-medium group-hover:text-primary transition-colors">{doc.title}</span>
                          </div>
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 shadow-md">
                    <CardHeader className="bg-gray-50 p-5 border-b border-gray-200">
                      <CardTitle className="text-xl font-semibold text-gray-800">Расписание сессий</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                       <p className="text-gray-600 mb-4 font-medium">c 15 сентября 2025 г. по 27 сентября 2025 г.:</p>
                       <div className="flex flex-wrap gap-2">
                          {partTimeSessions.map((session) => (
                            <a
                              key={session.title}
                              href={session.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-white text-primary border border-gray-300 font-medium px-4 py-2 rounded-full text-sm 
                                         transition-all duration-200 shadow-sm 
                                         hover:bg-primary hover:text-white hover:border-primary hover:scale-105 hover:shadow-md"
                            >
                              {session.title}
                            </a>
                          ))}
                        </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

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

export default Schedule;