import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // ✅ ИСПРАВЛЕНО: Добавлен импорт Button
import { CalendarCheck, FileText, Download, ClipboardCheck } from 'lucide-react'; // ✅ ИСПРАВЛЕНО: Добавлен импорт ClipboardCheck

// ИМПОРТЫ PDF-ФАЙЛОВ
import Kurs1 from '@/assets/file/receiptexam/1_kurs.pdf';
import A31 from '@/assets/file/receiptexam/A31.pdf';
import D21 from '@/assets/file/receiptexam/D21.pdf';
import D22 from '@/assets/file/receiptexam/D22.pdf';
import D23 from '@/assets/file/receiptexam/D23.pdf';
import D31 from '@/assets/file/receiptexam/D31.pdf';
import D32 from '@/assets/file/receiptexam/D32.pdf';
import ES21 from '@/assets/file/receiptexam/ES21.pdf';
import ES31 from '@/assets/file/receiptexam/ES31.pdf';
import KS3 from '@/assets/file/receiptexam/KS3.pdf';
import KS21 from '@/assets/file/receiptexam/KS21.pdf';
import KS22 from '@/assets/file/receiptexam/KS22.pdf';
import LV2 from '@/assets/file/receiptexam/LV2.pdf';
import P21 from '@/assets/file/class/P21.pdf';
import P31 from '@/assets/file/receiptexam/P31.pdf';
import PM31 from '@/assets/file/receiptexam/PM31.pdf';
import R31 from '@/assets/file/receiptexam/R31.pdf';
import S21 from '@/assets/file/class/S21.pdf';
import SP21 from '@/assets/file/class/SP21.pdf';
import SP31 from '@/assets/file/class/SP31.pdf';

// Объект-словарь для связи названий групп с импортами
const examPdfs: Record<string, string> = {
  '1 курс': Kurs1,
  'Д-2-1': D21,
  'Д-2-2': D22,
  'Д-2-3': D23,
  'КС-2-1': KS21,
  'КС-2-2': KS22,
  'П-2-1': P21,
  'А-2-1': A31,
  'ПМ-2-1, ПМ-2-2': PM31,
  'Р-2-1': R31,
  'С-2-1': S21,
  'СП-2-1': SP21,
  'ЭС-2-1': ES21,
  'В-2-1, Л-2-1, Л-2-2, Л-2-3, Л-2-4, Л-2-5, Л-2-6': LV2,
  'А-3-1': A31,
  'Д-3-1': D31,
  'Д-3-2': D32,
  'КС-3-1, КС-3-2': KS3,
  'П-3-1': P31,
  'ПМ-3-1': PM31,
  'Р-3-1': R31,
  'СП-3-1': SP31,
  'ЭС-3-1': ES31,
};

// ✅ ИСПРАВЛЕНО: Добавлен объект со статичными классами для корректной работы Tailwind CSS
const colorClasses = {
  blue: {
    bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700', border: 'border-blue-200', text: 'text-blue-800',
    from: 'from-blue-50', to: 'to-blue-100', linkBg: 'bg-blue-50', hoverLinkBg: 'hover:bg-blue-100',
    hoverLinkBorder: 'hover:border-blue-300', iconText: 'text-blue-600', downloadIcon: 'text-blue-500',
    hoverDownloadIcon: 'group-hover:text-blue-700',
  },
  green: {
    bg: 'bg-green-600', hoverBg: 'hover:bg-green-700', border: 'border-green-200', text: 'text-green-800',
    from: 'from-green-50', to: 'to-green-100', linkBg: 'bg-green-50', hoverLinkBg: 'hover:bg-green-100',
    hoverLinkBorder: 'hover:border-green-300', iconText: 'text-green-600', downloadIcon: 'text-green-500',
    hoverDownloadIcon: 'group-hover:text-green-700',
  },
  orange: {
    bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700', border: 'border-orange-200', text: 'text-orange-800',
    from: 'from-orange-50', to: 'to-orange-100', linkBg: 'bg-orange-50', hoverLinkBg: 'hover:bg-orange-100',
    hoverLinkBorder: 'hover:border-orange-300', iconText: 'text-orange-600', downloadIcon: 'text-orange-500',
    hoverDownloadIcon: 'group-hover:text-orange-700',
  },
};

const ExamSchedule = () => {
  const [activeTab, setActiveTab] = useState('1 курс');

  const examData = [
    { 
      id: '1 курс', 
      title: '1 курс',
      date: 'c 15 июня по 28 июня 2025 года', 
      groups: [],
      file: Kurs1,
      color: 'blue' as keyof typeof colorClasses // ✅ ИСПРАВЛЕНО: Типизация для ключей colorClasses
    },
    { 
      id: '2 курс', 
      title: '2 курс',
      date: 'c 15 июня по 28 июня 2025 года', 
      groups: [
        { date: 'с 15 июня по 28 июня 2025 года', list: ['Д-2-1', 'Д-2-2', 'Д-2-3', 'КС-2-1', 'КС-2-2', 'П-2-1'] },
        { date: 'с 22 июня по 28 июня 2025 года', list: ['А-2-1', 'ПМ-2-1, ПМ-2-2', 'Р-2-1', 'С-2-1', 'СП-2-1', 'ЭС-2-1'] }
      ],
      color: 'green' as keyof typeof colorClasses // ✅ ИСПРАВЛЕНО: Типизация для ключей colorClasses
    },
    { 
      id: '3 курс', 
      title: '3 курс',
      date: 'с 29 июня по 05 июля 2025 года', 
      groups: [
        { date: 'с 29 июня по 05 июля 2025 года', list: ['В-2-1, Л-2-1, Л-2-2, Л-2-3, Л-2-4, Л-2-5, Л-2-6', 'А-3-1', 'Д-3-1', 'Д-3-2', 'КС-3-1, КС-3-2', 'П-3-1', 'ПМ-3-1', 'Р-3-1', 'СП-3-1', 'ЭС-3-1'] }
      ],
      color: 'orange' as keyof typeof colorClasses // ✅ ИСПРАВЛЕНО: Типизация для ключей colorClasses
    }
  ];

  const getExamScheduleUrl = (groupName: string) => {
    const file = examPdfs[groupName];
    if (!file) {
      console.warn(`PDF not found for group: ${groupName}.`);
      return '#'; 
    }
    return file;
  };

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
                <ClipboardCheck className="w-10 h-10 mr-4 text-accent" />
                Расписание экзаменов
              </h1>
              <p className="text-center text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
                Актуальное расписание экзаменационной сессии для очного отделения.
              </p>

              <section className="mb-12">
                <div className="flex justify-center flex-wrap gap-4 mb-6">
                  {examData.map((course) => {
                    const colors = colorClasses[course.color];
                    return (
                      <Button
                        key={course.id}
                        variant={activeTab === course.id ? 'default' : 'outline'}
                        className={`text-lg font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-sm ${
                          activeTab === course.id 
                          ? `${colors.bg} ${colors.hoverBg} text-white shadow-lg scale-105` 
                          : `text-gray-600 bg-white hover:bg-gray-100 border-gray-300`
                        }`}
                        onClick={() => setActiveTab(course.id)}
                      >
                        {course.title}
                      </Button>
                    );
                  })}
                </div>

                <div className="relative">
                  {examData.map((course) => {
                    const colors = colorClasses[course.color];
                    return (
                      <div 
                        key={course.id}
                        className={`transition-opacity duration-300 ${activeTab === course.id ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full'}`}
                        style={{ display: activeTab === course.id ? 'block' : 'none' }}
                      >
                        <Card className={`${colors.border} shadow-lg overflow-hidden`}>
                          <CardHeader className={`bg-gradient-to-br ${colors.from} ${colors.to} p-5 border-b ${colors.border}`}>
                            <CardTitle className={`text-2xl font-bold ${colors.text}`}>
                              {course.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 space-y-6">
                            {course.file ? (
                              <a
                                href={course.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-between p-5 ${colors.linkBg} rounded-lg border-2 ${colors.border} ${colors.hoverLinkBg} ${colors.hoverLinkBorder} transition-all duration-300 group`}
                              >
                                <div className="flex items-center">
                                  <FileText className={`w-6 h-6 mr-3 ${colors.iconText}`} />
                                  <span className={`${colors.text} font-semibold`}>Расписание экзаменов - {course.title}</span>
                                </div>
                                <Download className={`w-5 h-5 ${colors.downloadIcon} ${colors.hoverDownloadIcon} transition-colors`} />
                              </a>
                            ) : (
                              course.groups.map((session, index) => (
                                <div key={index}>
                                  <h3 className="font-semibold text-gray-700 mb-3">{session.date}:</h3>
                                  <div className="flex flex-wrap gap-3">
                                    {session.list.map((group) => (
                                      <a
                                        key={group}
                                        href={getExamScheduleUrl(group)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`
                                          inline-block bg-white text-primary border-2 border-gray-300 font-semibold px-5 py-2.5 rounded-lg text-base
                                          transition-all duration-300 shadow-sm 
                                          hover:bg-primary hover:text-white hover:border-primary hover:scale-105 hover:shadow-md
                                          ${getExamScheduleUrl(group) === '#' ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-500' : ''}
                                        `}
                                        title={getExamScheduleUrl(group) === '#' ? 'Расписание скоро появится' : `Скачать расписание ${group}`}
                                        onClick={(e) => getExamScheduleUrl(group) === '#' && e.preventDefault()} 
                                      >
                                        {group}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              ))
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
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

export default ExamSchedule;

