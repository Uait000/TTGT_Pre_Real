import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { FileText, Download, Info } from 'lucide-react';

import dost from '@/assets/pictures/Gos_programma.png'
import dorozhnaiaKarta from '@/assets/file/wednesday/dorozhnaia_karta.pdf';
import mrSoprObuch from '@/assets/file/wednesday/MR_Sopr_obuch_OVZ_30112020.pdf';
import nalichSpecTex from '@/assets/file/wednesday/Nalich_spec_tex_i_progr_sr_OVZ.pdf';
import pasportOVZk1 from '@/assets/file/wednesday/Pasport_OVZ_k1_2025.pdf';
import pasportOVZob1 from '@/assets/file/wednesday/Pasport_OVZ_ob1_2025.pdf';
import pologenieOxranaZdorov from '@/assets/file/wednesday/Pologenie_Oxrana_Zdorov_Obuch_2024.pdf';
import polozhObObuchInvalidov from '@/assets/file/wednesday/polozh_ob_obuch_invalidov_ttgt_07.10.2019.pdf';
import polozhenieObOrganiztciiTekushchego from '@/assets/file/wednesday/polozhenie_ob_organizatcii_i_provedenii_tekushchego_kontrolia_znanii_i_p_.pdf';
import polozhenieObOrganiztciiPraktiki from '@/assets/file/wednesday/polozhenie_ob_organizatcii_praktiki_dlia_litc_s_ovz_ot_30.08.2017.pdf';
import programmaSozdaniyaBezbariernoy from '@/assets/file/wednesday/programma_sozdaniya_bezbariernoy_sredi.pdf';
import rabprogrammaFizkult from '@/assets/file/wednesday/rabprogramma_fizkult_invalid_i_ovz_11.01.2021.pdf';

const AccessibleEnvironment = () => {
  const sections = [
    {
      title: 'Условия для обучения инвалидов и лиц с ограниченными возможностями здоровья',
      documents: [
        {
          title: 'Положение об охране здоровья обучающихся, в том числе инвалидов и лиц с ограниченными возможностями здоровья',
          url: pologenieOxranaZdorov
        },
        {
          title: 'Программа создания безбарьерной среды для инвалидов и лиц с ограниченными возможностями здоровья',
          url: programmaSozdaniyaBezbariernoy
        },
        {
          title: 'План мероприятий (Дорожная карта) по повышению значений показателей доступности для инвалидов объектов и услуг в сфере образования на 2015-2030 годы ФГБОУ ВО РГУПС',
          url: dorozhnaiaKarta
        },
        {
          title: 'Паспорт доступности для инвалидов объекта и предоставляемых на нем услуг в сфере образования (корпус 1)',
          url: pasportOVZk1
        },
        {
          title: 'Паспорт доступности для инвалидов объекта и предоставляемых на нем услуг в сфере образования (общежитие 1)',
          url: pasportOVZob1
        },
      ]
    },
    {
      title: 'Адаптированные образовательные программы для инвалидов и лиц с ограниченными возможностями здоровья',
      documents: [
        {
          title: 'Положение об обучении инвалидов и лиц с ограниченными возможностями здоровья',
          url: polozhObObuchInvalidov
        },
        {
          title: 'Рабочая программа учебной дисциплины "Адаптивная физическая культура" для обучающихся с инвалидностью и лиц с ограниченными возможностями здоровья',
          url: rabprogrammaFizkult
        },
        {
          title: 'Положение об организации и проведении текущего контроля знаний и промежуточной аттестации инвалидов и лиц с ограниченными возможностями здоровья',
          url: polozhenieObOrganiztciiTekushchego
        },
        {
          title: 'Положение об организации практики по образовательным программам высшего и среднего профессионального образования для лиц с ограниченными возможностями здоровья, обучающихся в ФГБОУ ВПО РГУПС и его филиалах',
          url: polozhenieObOrganiztciiPraktiki
        },
      ]
    },
    {
      title: 'Виды и формы сопровождения обучения',
      documents: [
        {
          title: 'Методические рекомендации "Организация психолого-педагогического сопровождения обучающихся с ограниченными возможностями здоровья"',
          url: mrSoprObuch
        }
      ]
    },
    {
      title: 'Наличие специальных технических и программных средств обучения',
      documents: [
        {
          title: 'Информация о наличии специальных технических и программных средств обучения',
          url: nalichSpecTex
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-xl shadow-lg border border-border/50 overflow-hidden">
              
              <div className="w-full h-64 sm:h-80 md:h-96 relative">
                <img
                  src= {dost} 
                  alt="Доступная среда"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    Доступная среда
                  </h1>
                </div>
              </div>

              {/* Контентная часть */}
              <div className="p-6 md:p-10 space-y-10">
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6 md:p-8 shadow-inner">
                    
                    <h2 className="text-2xl font-semibold text-primary mb-6 border-b-2 border-primary/20 pb-3">
                      {section.title}
                    </h2>
                    
                    {section.documents.length > 0 ? (
                      <div className={`grid grid-cols-1 ${section.documents.length > 2 ? 'lg:grid-cols-2' : ''} gap-4`}>
                        {section.documents.map((doc, index) => (
                          <a
                            key={index}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between space-x-4 p-4 pr-5 bg-white rounded-lg border border-border/70 shadow-sm hover:shadow-md hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 group"
                          >
                            <div className="flex items-center space-x-4 min-w-0"> 
                              <FileText className="w-6 h-6 text-primary/80 group-hover:text-primary transition-colors flex-shrink-0" />
                              <span className="text-foreground font-medium group-hover:text-primary transition-colors truncate">
                                {doc.title}
                              </span>
                            </div>
                            <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      
                      <div className="flex items-center justify-center space-x-3 bg-white/50 rounded-lg p-6 text-center border border-dashed border-border">
                        <Info className="w-5 h-5 text-muted-foreground" />
                        <p className="text-muted-foreground">Информация для данного раздела будет добавлена позже.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
        <aside className="hidden lg:block w-80 bg-white border-l border-border p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default AccessibleEnvironment;