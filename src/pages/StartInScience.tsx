import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { ExternalLink, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Sp1 from '@/assets/file/start/VIII_RSIK_Srart_v_nauku_2025_Spisok_uch.pdf';
import Sp2 from '@/assets/file/start/VIII_RSIK_Srart_v_nauku_2025_progr_10041.pdf';
import Sp3 from '@/assets/file/start/VIII_RSIK_Srart_v_nauku_2025_progr_1004.pdf';
import Sp4 from '@/assets/file/start/VIII_RSIK_Srart_v_nauku_2025_rezult.pdf';
import Sp5 from '@/assets/file/start/Pol_Start_v_nauku_2024.pdf';
import Sp6 from '@/assets/file/start/Start_v_Nauku_Pod_zayavl_2024.pdf';
import Sp7 from '@/assets/file/start/Start_v_Nauku_Progr_8_04_2024.pdf';
import Sp8 from '@/assets/file/start/Start_v_Nauku_Progr_9_04_2024.pdf';
import Sp9 from '@/assets/file/start/Start_v_nauku_24_Itog_Protokol.pdf';
import Sp10 from '@/assets/file/start/Start_v_nauku_24_Itog_Protokol_ball.pdf';
import Sp11 from '@/assets/file/start/Materialy_VII_sk.pdf';
import Sp12 from '@/assets/file/start/Pol_VII_Start_v_nauku_2023.pdf';
import Sp13 from '@/assets/file/start/Programma_VII_Start_v_nauku_20231.pdf';
import Lp14 from '@/assets/file/start/Start_v_nauku_Prot_1_Vlasova.pdf';
import Lp15 from '@/assets/file/start/Start_v_nauku_Prot_1_V.pdf';
import Lp16 from '@/assets/file//start/Start_v_nauku_Prot_1_Korobeynikov.pdf';
import Lp17 from '@/assets/file/start/Start_v_nauku_Prot_1_Leshhinskaya.pdf';
import Sp18 from '@/assets/file/start/Start_v_nauku_Itog_Prot_1.pdf';
import Sp19 from '@/assets/file/start/Start_v_nauku_Prot_2_Vlasova.pdf';
import Sp20 from '@/assets/file/start/Start_v_nauku_Prot_2_Vyalov.pdf';
import Sp21 from '@/assets/file/start/Start_v_nauku_Prot_2_Korobeynikov.pdf';
import Sp22 from '@/assets/file/start/Start_v_nauku_Prot_2_Leshhinskaya.pdf';
import Sp23 from '@/assets/file/start/Start_v_nauku_Itog_Prot_2.pdf';
import Sp24 from '@/assets/file/start/Start_v_nauku_Prot_3_Vlasova.pdf';
import Sp25 from '@/assets/file/start/Start_v_nauku_Prot_3_Vyalov.pdf';
import Sp26 from '@/assets/file/start/Start_v_nauku_Prot_3_Korobeynikov.pdf';
import Sp27 from '@/assets/file/start/Start_v_nauku_Prot_3_Leshhinskaya.pdf';
import Sp28 from '@/assets/file/start/Start_v_nauku_Itog_Prot_3.pdf';
import Sp29 from '@/assets/file/start/Start_v_nauku_Prot_4_Vlasova.pdf';
import Sp30 from '@/assets/file/start/Start_v_nauku_Prot_4_Vyalov.pdf';
import Sp31 from '@/assets/file/start/Start_v_nauku_Prot_4_Korobeynikov.pdf';
import Sp32 from '@/assets/file/start/Start_v_nauku_Prot_4_Leshhinskaya.pdf';
import Sp33 from '@/assets/file/start/Start_v_nauku_Itog_Prot_4.pdf';
import Sp34 from '@/assets/file/start/Start_v_nauku_Prot_5_Vlasova.pdf';
import Sp35 from '@/assets/file/start/Start_v_nauku_Prot_5_Vyalov.pdf';
import Sp36 from '@/assets/file/start/Start_v_nauku_Prot_5_Korobeynikov.pdf';
import Sp37 from '@/assets/file/start/Start_v_nauku_Prot_5_Leshhinskaya.pdf';
import Sp38 from '@/assets/file/start/Start_v_nauku_Itog_Prot_5.pdf';
import Sp39 from '@/assets/file/start/Start_v_nauku_Prot_6_Vlasova.pdf';
import Sp40 from '@/assets/file/start/Start_v_nauku_Prot_6_Vyalov.pdf';
import Sp41 from '@/assets/file/start/Start_v_nauku_Prot_6_Korobeynikov.pdf';
import Sp42 from '@/assets/file/start/Start_v_nauku_Prot_6_Leshhinskaya.pdf';
import Sp43 from '@/assets/file/start/Start_v_nauku_Itog_Prot_6.pdf';
import Sp44 from '@/assets/file/start/Start_V_Nauku_2023_sbornik.pdf';

const StartInScience = () => {
  const documents2025 = [
    { name: 'Положение о проведении VIII региональной студенческой исследовательской конференции (с международным участием) посвящённой Десятилетию науки и технологий в Российской Федерации «Старт в науку»', url: '/science/2025/polozhenie.pdf' },
    { name: 'Список подавших документы для участия в VIII региональной студенческой исследовательской конференции (с международным участием) посвященной десятилетию науки и технологий в Российской Федерации "СТАРТ В НАУКУ"', url: Sp1  },
    { name: 'Программа работы конференции 10 апреля 2025 г.', url: Sp2 },
    { name: 'Программа работы конференции 11 апреля 2025 г.', url: Sp3 },
    { name: 'Итоговый протокол (результаты) оценивания участников', url: Sp4 }
  ];

  const documents2024 = [
    { name: 'ВНИМАНИЕ! Конференция переносится на 8 - 9 апреля 2024 года', isAlert: true },
    { name: 'Положение о проведении VII региональной студенческой исследовательской конференции (с международным участием) посвящённой Десятилетию науки и технологий в Российской Федерации «Старт в науку»', url: Sp5 },
    { name: 'Список подавших документы для участия', url: Sp6 },
    { name: 'Программа работы конференции 8 апреля 2024 г.', url: Sp7 },
    { name: 'Программа работы конференции 9 апреля 2024 г.', url: Sp8 },
    { name: 'ИТОГОВЫЙ ПРОТОКОЛ (РЕЗУЛЬТАТЫ) оценивания участников', url: Sp9 },
    { name: 'ИТОГОВЫЕ ПРОТОКОЛЫ оценивания участников', url: Sp10 },
    { name: 'Материалы VII региональной студенческой исследовательской конференции (с международным участием) посвящённой Десятилетию науки и технологий в Российской Федерации «СТАРТ В НАУКУ»', url: Sp11 }
  ];

  const documents2023Main = [
    { name: 'Положение о проведении VI региональной студенческой исследовательской конференции (с международным участием) посвящённой Десятилетию науки и технологий в Российской Федерации «Старт в науку»', url: Sp12 },
    { name: 'СПИСОК ПОДАВШИХ ДОКУМЕНТЫ ДЛЯ УЧАСТИЯ' },
    { name: 'Программа работы конференции', url: Sp13 }
  ];

  const nominations2023 = [
    {
      name: 'Система управления качеством, повышение производительности труда и экономической эффективности железнодорожного трансорта. Интеллектуальные системы управления',
      experts: [
        { name: 'член Экспертного совета В.Н. Власова', url: Lp14 },
        { name: 'член Экспертного совета С.А. Вялов', url: Lp15 },
        { name: 'член Экспертного совета Т.А. Коробейников', url: Lp16 },
        { name: 'член Экспертного совета В.И. Лещинская', url: Lp17 }
      ],
      finalUrl: Sp18
    },
    {
      name: 'Научно-популярный туризм (развитие туристической индустрии/внутренний туризм',
      experts: [
        { name: 'член Экспертного совета В.Н. Власова', url: Sp19 },
        { name: 'член Экспертного совета С.А. Вялов', url: Sp20 },
        { name: 'член Экспертного совета Т.А. Коробейников', url: Sp21 },
        { name: 'член Экспертного совета В.И. Лещинская', url: Sp22 }
      ],
      finalUrl: Sp23
    },
    {
      name: 'Повышение престижа рабочих профессий. Техническое творчество в образовательном процессе',
      experts: [
        { name: 'член Экспертного совета В.Н. Власова', url: Sp24 },
        { name: 'член Экспертного совета С.А. Вялов', url: Sp25 },
        { name: 'член Экспертного совета Т.А. Коробейников', url: Sp26 },
        { name: 'член Экспертного совета В.И. Лещинская', url: Sp27 }
      ],
      finalUrl: Sp28
    },
    {
      name: 'Повышение надежности работы и увеличение эксплуатационного ресурса технических средств железнодорожного транспорта',
      experts: [
        { name: 'член Экспертного совета В.Н. Власова', url: Sp29 },
        { name: 'член Экспертного совета С.А. Вялов', url: Sp30 },
        { name: 'член Экспертного совета Т.А. Коробейников', url: Sp31 },
        { name: 'член Экспертного совета В.И. Лещинская', url: Sp32 }
      ],
      finalUrl: Sp33
    },
    {
      name: 'Безопасность и охрана окружающей среды на железнодорожном транспорте, на объектах транспортной инфраструктуры и при выполнении работ',
      experts: [
        { name: 'член Экспертного совета В.Н. Власова', url: Sp34 },
        { name: 'член Экспертного совета С.А. Вялов', url: Sp35 },
        { name: 'член Экспертного совета Т.А. Коробейников', url: Sp36 },
        { name: 'член Экспертного совета В.И. Лещинская', url: Sp37 }
      ],
      finalUrl: Sp38
    },
    {
      name: 'История науки и технологий. Научные юбилеи',
      experts: [
        { name: 'член Экспертного совета В.Н. Власова', url: Sp39 },
        { name: 'член Экспертного совета С.А. Вялов', url: Sp40 },
        { name: 'член Экспертного совета Т.А. Коробейников', url: Sp41 },
        { name: 'член Экспертного совета В.И. Лещинская', url: Sp42 }
      ],
      finalUrl: Sp43
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
              <h1 className="text-3xl font-bold text-primary mb-4 text-center">
                Региональная студенческая исследовательская конференция "Старт в науку"
              </h1>

              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8">
                <p className="text-center text-foreground leading-relaxed">
                  Ежегодная региональная студенческая исследовательская конференция (с международным участием), посвящённая Десятилетию науки и технологий в Российской Федерации
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {/* 2025 год */}
                <AccordionItem value="year-2025" className="border border-border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <h2 className="text-2xl font-bold text-primary">2025 год</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-3">
                      {documents2025.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                              <span className="text-foreground font-medium text-sm">{doc.name}</span>
                            </div>
                            <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 ml-3" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 2024 год */}
                <AccordionItem value="year-2024" className="border border-border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <h2 className="text-2xl font-bold text-primary">2024 год</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-3">
                      {documents2024.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block p-4 rounded-lg border hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ${
                            doc.isAlert
                              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
                              : 'bg-gradient-to-r from-secondary/5 to-accent/5 border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <FileText className={`w-5 h-5 flex-shrink-0 ${doc.isAlert ? 'text-red-600' : 'text-primary'}`} />
                              <span className={`font-medium text-sm ${doc.isAlert ? 'text-red-800' : 'text-foreground'}`}>
                                {doc.name}
                              </span>
                            </div>
                            <ExternalLink className={`w-5 h-5 flex-shrink-0 ml-3 ${doc.isAlert ? 'text-red-600' : 'text-primary'}`} />
                          </div>
                        </a>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 2023 год */}
                <AccordionItem value="year-2023" className="border border-border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <h2 className="text-2xl font-bold text-primary">2023 год</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6">
                      {/* Основные документы */}
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-3">Основные документы</h3>
                        <div className="space-y-3">
                          {documents2023Main.map((doc, index) => (
                            <a
                              key={index}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-4 bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg border border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                  <span className="text-foreground font-medium text-sm">{doc.name}</span>
                                </div>
                                <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 ml-3" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Протоколы оценивания по номинациям */}
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-3">Протоколы оценивания участников</h3>
                        <div className="space-y-4">
                          {nominations2023.map((nomination, nomIndex) => (
                            <div key={nomIndex} className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-5 border border-border">
                              <h4 className="font-semibold text-foreground mb-3 text-sm">{nomination.name}</h4>
                              <div className="space-y-2 mb-3">
                                {nomination.experts.map((expert, expertIndex) => (
                                  <a
                                    key={expertIndex}
                                    href={expert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-2 pl-4 bg-white rounded border border-border hover:shadow-md hover:border-primary/50 transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-foreground text-sm">{expert.name}</span>
                                      <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                                    </div>
                                  </a>
                                ))}
                              </div>
                              <a
                                href={nomination.finalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-primary/10 rounded border border-primary/30 hover:bg-primary/20 transition-all duration-200"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-primary font-medium text-sm">Итоговый протокол</span>
                                  <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                                </div>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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

export default StartInScience;
