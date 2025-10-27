import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { FileText } from 'lucide-react';
import rushabel from '@/assets/pictures/ria_8451769hr_c79.webp'
import R1 from '@/assets/file/russia/V_Vser_stud_konf_Rossia_Belarus_2025_Programma.pdf';
import R2 from '@/assets/file/russia/V_Vser_stud_konf_Rossiya_Belarus_2025_Spisok_Uchastn.pdf';
import R3 from '@/assets/file/russia/V_Vser_stud_konf_Rossia_Belarus_2025_Protokol_S_bal.pdf';
import R4 from '@/assets/file/russia/V_Vser_stud_konf_Rossia_Belarus_2025_Itog_Protokol.pdf';
import R5 from '@/assets/file/russia/V_Vser_stud_konf_Rossia_Belarus_2025_Sbornik.pdf';
import R6 from '@/assets/file/russia/Rossiya_Belorus_2024_Spisok_Pod_Doc.pdf';
import R7 from '@/assets/file/russia/Rossiya_Belorus_2024_Programma.pdf';
import R8 from '@/assets/file/russia/Rossiya_Belorus_2024_Protokol_zas_kom.pdf';
import R9 from '@/assets/file/russia/Rossiya_Belorus_2024_Protokol_itog_zas_kom.pdf';
import R10 from '@/assets/file/russia/Rossiya_Belorus_2024_Sbornik.pdf';
import R11 from '@/assets/file/russia/III_MK_Ros_Belars_pol_31.03.2023.pdf';
import R12 from '@/assets/file/russia/III_MK_Ros_Belars_programma_31.03.2023.pdf';
import R13 from '@/assets/file/russia/III_MK_Ros_Belars_spisok_uch_31.03.2023.pdf';
import R14 from '@/assets/file/russia/III_MK_Ros_Belars__Protokol_it_zased_kom.pdf';
import R15 from '@/assets/file/russia/III_MK_Ros_Belars_spisok_pobedit_31.03.2023.pdf';
import R16 from '@/assets/file/russia/III_MK_Ros_Belars_Sbornik_tezisov_31032023.pdf';

const RussiaBelarusConference = () => {
  const documents2025 = [
    {
      title: 'Положение о проведении V Всероссийской студенческой конференции с международным участием "Россия и Беларусь - вехи общей истории", посвященной Победе советского народа в Великой Отечественной войне',
      url: '#'
    },
    {
      title: 'Программа работы V Всероссийской студенческой конференции с международным участием "Россия и Беларусь - вехи общей истории", посвященной Победе советского народа в Великой Отечественной войне',
      url: R1
    },
    {
      title: 'Список подавших документы для участия в V Всероссийской студенческой конференции с международным участием "Россия и Беларусь - вехи общей истории", посвященной Победе советского народа в Великой Отечественной войне',
      url: R2
    },
    {
      title: 'Протокол заседания экспертной комиссии участников очного этапа V Всероссийской студенческой конференции с международным участием "Россия и Беларусь – вехи общей истории", посвященной Победе советского народа в Великой Отечественной войне (27-28 марта 2025 г.)',
      url: R3
    },
    {
      title: 'Протокол итогового заседания экспертной комиссии. Результаты V Всероссийской студенческой конференции с международным участием "Россия и Беларусь - вехи общей истории", посвящённой Победе советского народа в Великой Отечественной войне (27-28 марта 2025 г.)',
      url: R4
    },
    {
      title: 'Материалы V Всероссийской студенческой конференции с международным участием "Россия и Беларусь - вехи общей истории", посвященной Победе советского народа в Великой Отечественной войне',
      url: R5
    }
  ];

  const documents2024 = [
    {
      title: 'Положение о проведении IV Всероссийской студенческой конференции с международным участием "Россия и Беларусь - вехи общей истории", посвященной Победе советского народа в Великой Отечественной войне',
      url: '#' //не ставить файл
    },
    {
      title: 'Список подавших документы для участия в IV Всероссийской студенческой конференции с международным участием "Россия и Беларусь - вехи общей истории", посвященной Победе советского народа в Великой Отечественной войне',
      url: R6
    },
    {
      title: 'Программа работы IV Всероссийской студенческой конференции с международным участием "Россия и Беларусь - вехи общей истории", посвященной Победе советского народа в Великой Отечественной войне',
      url: R7
    },
    {
      title: 'Протокол заседания экспертной комиссии участников очного этапа IV Всероссийской студенческой конференции с международным участием «Россия и Беларусь - вехи общей истории», посвящённой Победе советского народа в Великой Отечественной войне (28-29 марта 2024 г.)',
      url: R8
    },
    {
      title: 'Протокол итогового заседания экспертной комиссии. Результаты IV Всероссийской студенческой конференции с международным участием «Россия и Беларусь - вехи общей истории», посвящённой Победе советского народа в Великой Отечественной войне (28-29 марта 2024 г.)',
      url: R9
    },
    {
      title: 'Материалы IV Всероссийской студенческой конференции с международным участием "Россия и Беларусь - вехи общей истории", посвященной Победе советского народа в Великой Отечественной войне',
      url: R10
    }
  ];

  const documents2023 = [
    {
      title: 'Положение о проведении III межрегиональной студенческой конференции с международным участием «Россия и Беларусь - вехи общей истории», посвящённой Победе советского народа в Великой Отечественной войне',
      url: R11
    },
    {
      title: 'Программа конференции',
      url: R12
    },
    {
      title: 'Список подавших документы для участия',
      url: R13
    },
    {
      title: 'Протокол итогового заседания экспертной комиссии оценивания участников очного этапа с применением дистанционных технологий',
      url: R14
    },
    {
      title: 'Список победителей, призёров и соискателей III межрегиональной студенческой конференции',
      url: R15
    },
    {
      title: 'Сборник тезисов работ участников III межрегиональной студенческой конференции с международным участием «Россия и Беларусь – вехи общей истории»',
      url: R16
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
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Россия и Беларусь - вехи общей истории</h1>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                {/* Hero image */}
                <div className="w-full aspect-[16/6] bg-gradient-to-br from-red-100 to-red-200 rounded-lg overflow-hidden shadow-lg mb-8">
                  <img
                    src= {rushabel}
                    alt="Россия и Беларусь - вехи общей истории"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-8">
                  {/* 2025 год */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-red-600 mb-6 border-b border-red-200 pb-3">2025 год:</h2>
                    <div className="space-y-4">
                      {documents2025.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                        >
                          <FileText className="w-5 h-5 text-red-600 group-hover:text-red-700 transition-colors flex-shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium group-hover:text-red-700 transition-colors leading-relaxed">
                            {doc.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* 2024 год */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b border-blue-200 pb-3">2024 год:</h2>
                    <div className="space-y-4">
                      {documents2024.map((doc, index) => (
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

                  {/* 2023 год */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-green-600 mb-6 border-b border-green-200 pb-3">2023 год:</h2>
                    <div className="space-y-4">
                      {documents2023.map((doc, index) => (
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

export default RussiaBelarusConference;