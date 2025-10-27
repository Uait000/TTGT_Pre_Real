import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { ExternalLink, FileText } from 'lucide-react';

// ✅ ИСПРАВЛЕНИЕ 1: Опечатка в именах переменных (кириллическая 'о' заменена на латинскую 'o')
import doc_1 from '@/assets/file/Spisok_EOR_08.02.01.pdf';
import doc_2 from '@/assets/file/Spisok_EOR_08.02.10.pdf';
import doc_3 from '@/assets/file/Spisok_EOR_09.02.01.pdf';
import doc_4 from '@/assets/file/Spisok_EOR_11.02.06.pdf';
import doc_5 from '@/assets/file/Spisok_EOR_13.02.07.pdf';
import doc_6 from '@/assets/file/Spisok_EOR_22.02.06.pdf';
import doc_7 from '@/assets/file/Spisok_EOR_23.02.01.pdf';
import doc_8 from '@/assets/file/Spisok_EOR_23.02.04.pdf';
import doc_9 from '@/assets/file/Spisok_EOR_23.02.06.01.pdf';
import doc_10 from '@/assets/file/Spisok_EOR_23.02.06.03.pdf';
import doc_11 from '@/assets/file/Spisok_EOR_27.02.03.pdf';
import doc_12 from '@/assets/file/Spisok_EOR_38.02.01.pdf';
import dogovor from '@/assets/file/Dogovor_Internet_2025.pdf';
import pol_1 from '@/assets/file/pologenieoEOISN_TTGT_2023.pdf';
import pol_2 from '@/assets/file/Pologenie_EIOS_izm_15.05.2024.pdf';

const IOS = () => {
  // ✅ ИСПРАВЛЕНИЕ 2: Данные реструктурированы для удобства и правильного связывания с файлами
  const mainDocuments = [
    { title: 'Договор на оказание услуг по доступу к сети Интернет на 2025 г.', file: dogovor },
    { title: 'Положение об электронной информационно-образовательной среде ТТЖТ - филиала РГУПС', file: pol_1 },
    { title: 'Изменения в Положение об электронной информационно-образовательной среде ТТЖТ - филиала РГУПС', file: pol_2 },
  ];

  const specialtyResources = [
    { title: '08.02.01 Строительство и эксплуатация зданий и сооружений', file: doc_1 },
    { title: '08.02.10 Строительство железных дорог, путь и путевое хозяйство', file: doc_2 },
    { title: '09.02.01 Компьютерные системы и комплексы', file: doc_3 },
    { title: '11.02.06 Техническая эксплуатация транспортного радиоэлектронного оборудования', file: doc_4 },
    { title: '13.02.07 Электроснабжение', file: doc_5 },
    { title: '22.02.06 Сварочное производство', file: doc_6 },
    { title: '23.02.01 Организация перевозок и управление на транспорте', file: doc_7 },
    { title: '23.02.04 Техническая эксплуатация подъемно-транспортных, строительных, дорожных машин', file: doc_8 },
    { title: '23.02.06 Техническая эксплуатация подвижного состава (электроподвижной состав)', file: doc_9 },
    { title: '23.02.06 Техническая эксплуатация подвижного состава (вагоны)', file: doc_10 },
    { title: '27.02.03 Автоматика и телемеханика на транспорте', file: doc_11 },
    { title: '38.02.01 Экономика и бухгалтерский учет', file: doc_12 },
  ];

  const externalLibraries = [
    { title: 'Электронная библиотека УМЦ ЖДТ', url: 'http://umczdt.ru/books/' },
    { title: 'Электронно-библиотечная система Лань', url: 'https://e.lanbook.com' },
    { title: 'Электронно-библиотечная система IPR SMART', url: 'http://www.iprbookshop.ru/' },
    { title: 'Образовательная платформа Юрайт', url: 'https://urait.ru/' },
    { title: 'Электронный архив и база данных СМИ Public.ru', url: 'https://rgups.public.ru/' },
    { title: 'Национальная электронная библиотека', url: 'https://rusneb.ru/' },
  ];
  
  const internalSystems = [
    { title: 'Электронно-образовательная среда ТТЖТ', url: 'http://tihtgt.ru/' },
    { title: '"Сетевой город.Образование". Модуль ПОО', url: 'https://spo.rso23.ru' },
    { title: 'ФГИС "Моя школа"', url: 'https://myschool.edu.ru' },
    { title: 'Дистанционные образовательные технологии в ТТЖТ', url: 'http://дистанционное24.рф' },
    { title: 'Информационно-коммуникативная образовательная платформа «Сферум»', url: 'http://sferum.ru/' },
  ];

  const federalResources = [
    { title: 'Министерство науки и высшего образования Российской Федерации', url: 'https://minobrnauki.gov.ru/' },
    { title: 'Министерство просвещения Российской Федерации', url: 'https://edu.gov.ru/' },
    { title: 'Федеральная служба по надзору в сфере образования и науки', url: 'https://obrnadzor.gov.ru/' },
    { title: 'Федеральный портал «Российское образование»', url: 'https://www.edu.ru/' },
    { title: 'Информационная система «Единое окно доступа к образовательным ресурсам»', url: 'http://window.edu.ru/' },
    { title: 'Федеральный центр информационно-образовательных ресурсов', url: 'http://fcior.edu.ru/' },
    { title: 'Единая коллекция цифровых образовательных ресурсов', url: 'http://school-collection.edu.ru/' }
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
              <h1 className="text-3xl font-bold text-primary mb-2 text-center">Электронная информационно-образовательная среда</h1>
              <p className="text-center text-muted-foreground mb-12">Доступ к информационным системам и образовательным ресурсам</p>
              
              {/* ✅ ИЗМЕНЕНИЕ 3: Полностью новый дизайн страницы */}
              <div className="space-y-12">

                {/* --- Секция основных документов --- */}
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-l-4 border-primary pl-4">Основные документы</h2>
                  <div className="space-y-3">
                    {mainDocuments.map((doc, index) => (
                      <a key={index} href={doc.file} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-primary/50 transition-all duration-300 group">
                        <FileText className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                        <span className="text-foreground group-hover:text-primary transition-colors">{doc.title}</span>
                      </a>
                    ))}
                  </div>
                </section>

                {/* --- Секция ресурсов по специальностям --- */}
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-l-4 border-primary pl-4">Списки электронных образовательных ресурсов по специальностям</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specialtyResources.map((res, index) => (
                       <a key={index} href={res.file} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group transform hover:scale-[1.02]">
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 transition-colors" />
                        <span className="text-sm text-foreground">{res.title}</span>
                      </a>
                    ))}
                  </div>
                </section>

                {/* --- Секция внешних библиотек и внутренних систем --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-l-4 border-primary pl-4">Внешние электронные библиотеки и платформы</h2>
                    <div className="space-y-3">
                      {externalLibraries.map((lib, index) => (
                        <a key={index} href={lib.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary/50 transition-all duration-300 group">
                          <span className="text-foreground">{lib.title}</span>
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-l-4 border-primary pl-4">Внутренние информационные системы</h2>
                     <div className="space-y-3">
                      {internalSystems.map((sys, index) => (
                        <a key={index} href={sys.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary/50 transition-all duration-300 group">
                          <span className="text-foreground">{sys.title}</span>
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  </section>
                </div>
                
                {/* --- Секция федеральных ресурсов --- */}
                <section>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-l-4 border-primary pl-4">Федеральные образовательные ресурсы</h2>
                  <div className="space-y-3">
                    {federalResources.map((res, index) => (
                      <a key={index} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-primary/50 transition-all duration-300 group">
                        <span className="text-foreground">{res.title}</span>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </section>

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

export default IOS;