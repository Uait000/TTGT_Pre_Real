import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { FileText, ExternalLink } from 'lucide-react';
import S1 from '@/assets/file/sferum/Metod_rek_2023.pdf';
import S2 from '@/assets/file/sferum/Pol_Sferum_31.08.2023.pdf';
const SferumMySchool = () => {
  const sferumDocuments = [
    {
      title: 'Библиотека полезных материалов',
      url: 'https://prof.sferum.ru/start_docs#tab3'
    },
    {
      title: 'Пройти онлайн-курс и получить сертификат по платформе',
      url: 'https://prof.sferum.ru/kurs'
    },
    {
      title: 'Методические рекомендации для педагогических работников образовательных организаций общего образования, образовательных организаций среднего профессионального образования, образовательных организаций дополнительного образования по использованию российского программного обеспечения при взаимодействии с обучающимися и их родителями (законными представителями)',
      url: S1
    },
    {
      title: 'Положение об использовании в ТТЖТ - филиале РГУПС ИКОП "Сферум"',
      url: S2
    }
  ];

  const mySchoolDocuments = [
    {
      title: 'Портал информационно-методической поддержки пользователей ФГИС "Моя школа"',
      url: 'https://myschool.eduprosvet.ru'
    },
    {
      title: 'Инструкции',
      url: 'https://myschool.eduprosvet.ru/data/instructions/'
    },
    {
      title: 'Видео',
      url: 'https://myschool.eduprosvet.ru/data/video/'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">ИКОП "Сферум" и ФГИС "Моя школа"</h1>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                {/* Hero image */}
                <div className="w-full aspect-[16/6] bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden shadow-lg mb-8">
                  <img
                    src="https://senkino.dobryanka-edu.ru/upload/versions/20851/82358/prorrl.png"
                    alt="Цифровые образовательные платформы"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-8">
                  {/* Сферум */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-6 rounded-lg mb-6">
                      <h2 className="text-2xl font-bold text-green-700 mb-4">Единое безопасное пространство для общения по учёбе "СФЕРУМ в МАХ"</h2>
                      <a 
                        href="https://sferum.ru" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                      >
                        <span>https://sferum.ru</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <p className="text-foreground mt-4">
                        Инструкции, видео, часто задаваемые вопросы по СФЕРУМ в МАХе смотрите на сайте{' '}
                        <a 
                          href="https://prof.sferum.ru/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 underline"
                        >
                          https://prof.sferum.ru/
                        </a>
                      </p>
                    </div>

                    <div className="space-y-4">
                      {sferumDocuments.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                        >
                          <FileText className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors flex-shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium group-hover:text-green-700 transition-colors leading-relaxed">
                            {doc.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Моя школа */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                      <h2 className="text-2xl font-bold text-blue-700 mb-4">Федеральная государственная информационная система "Моя школа"</h2>
                      <a 
                        href="https://myschool.edu.ru" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        <span>https://myschool.edu.ru</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="space-y-4">
                      {mySchoolDocuments.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                        >
                          <FileText className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors flex-shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium group-hover:text-blue-700 transition-colors leading-relaxed">
                            {doc.title}
                          </span>
                        </a>
                      ))}
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
    </div>
  );
};

export default SferumMySchool;