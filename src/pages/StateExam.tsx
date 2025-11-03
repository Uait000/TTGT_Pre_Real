// src/pages/StateExam.tsx

import { useState } from 'react';
import MainLayout from '@/components/MainLayout'; // Импортируем компонент макета
// Удалены: import Header, Sidebar, SidebarCards, InfoBlocks

import { ExternalLink, CalendarDays, FileText, BookOpen, ArrowRight } from 'lucide-react';

// Импорты PDF-файлов остаются
import gia08_02_01 from '@/assets/file/gia/GIA_08_02_01.pdf';
import gia09_02_01 from '@/assets/file/gia/GIA_09_02_01.pdf';
import gia11_02_06 from '@/assets/file/gia/GIA_11_02_06.pdf';
import gia13_02_07 from '@/assets/file/gia/GIA_13_02_07.pdf';
import gia15_02_19 from '@/assets/file/gia/GIA_15_02_19.pdf';
import gia23_02_01 from '@/assets/file/gia/GIA_23_02_01.pdf';
import gia23_02_04 from '@/assets/file/gia/GIA_23_02_04.pdf';
import gia23_02_06_01 from '@/assets/file/gia/GIA_23_02_06_01.pdf';
import gia23_02_06_03 from '@/assets/file/gia/GIA_23_02_06_03.pdf';
import gia23_02_08 from '@/assets/file/gia/GIA_23_02_08.pdf';
import gia27_02_03 from '@/assets/file/gia/GIA_27_02_03.pdf';
import gia38_02_01 from '@/assets/file/gia/GIA_38_02_01.pdf';
import metodRekEkonomika from '@/assets/file/gia/Metod_Rek_Ekonomika_DR_080210_Kochetkova_11012021.pdf';
import metodUkazOformlDP080210Kochetkova from '@/assets/file/gia/Metod_Ukaz_Oforml_DP_080210_Kochetkova_12032021.pdf';
import metodUkazOformlDP080210OrgTehnStroit from '@/assets/file/gia/Metod_Ukaz_Oforml_DP_080210_Org_i_Tehn_stroit_now_gd_Malyhina_12032021.pdf';
import metodUkazOformlDP080210Orishhenko from '@/assets/file/gia/Metod_Ukaz_Oforml_DP_080210_Orishhenko_12032021.pdf';
import metodUkazOformlDP080210Proektir from '@/assets/file/gia/Metod_Ukaz_Oforml_DP_080210_Proektir_uchastka_now_gd_linii_Malyhina_12032021.pdf';
import metodUkazOformlKPDP from '@/assets/file/gia/Metod_Ukaz_Oforml_KP_DP_07.04.2021.pdf';
import metodrek from '@/assets/file/gia/Metod_Rek_Ekonomika_DR_080210_Kochetkova_11012021.pdf';

type ActiveTab = 'schedule' | 'programs' | 'recommendations';

const StateExam = () => {
    
    const [activeTab, setActiveTab] = useState<ActiveTab>('schedule');

    const programs = [
        { name: 'Автоматика и телемеханика на транспорте (железнодорожном транспорте)', url: gia27_02_03 },
        { name: 'Компьютерные системы и комплексы', url: gia09_02_01 },
        { name: 'Организация перевозок и управление на транспорте (по видам)', url: gia23_02_01 },
        { name: 'Сварочное производство', url: gia15_02_19 },
        { name: 'Строительство железных дорог, путь и путевое хозяйство', url: gia23_02_08 },
        { name: 'Строительство и эксплуатация зданий и сооружений', url: gia08_02_01 },
        { name: 'Техническая эксплуатация подъемно-транспортных , строительных , дорожных машин и оборудования (по отраслям)', url: gia23_02_04 },
        { name: 'Техническая эксплуатация подвижного состава железных дорог (электроподвижной состав)', url: gia23_02_06_01 },
        { name: 'Техническая эксплуатация подвижного состава железных дорог (вагоны)', url: gia23_02_06_03 },
        { name: 'Техническая эксплуатация транспортного радиоэлектронного оборудования (по видам траснпорта)', url: gia11_02_06 },
        { name: 'Экономика и бухгалтерский учет (по отраслям)', url: gia38_02_01 },
        { name: 'Электроснабжение', url: gia13_02_07 }
    ];

    const methodicalRecommendations = [
        { name: 'Методические рекомендации (указания) по оформлению дипломных проектов (работ)', url: metodUkazOformlKPDP },
        { name: 'Методические указания по оформлению курсового и дипломного проекта (работ) (Н.А. Рашевская)', url: metodrek },
        { name: 'Методические рекомендации к выполнению экономической части дипломной работы для студентов специальности 08.02.10 (Т.Г. Кочеткова)', url: metodRekEkonomika },
        { name: 'Методические рекомендации по оформлению дипломного проекта для студентов специальности 08.02.10 (Т.Г. Кочеткова)', url: metodUkazOformlDP080210Kochetkova },
        { name: 'Методические рекомендации по дипломному проектированию по теме: Организация и технология строительства новой железной дороги (С.В. Малыхина)', url: metodUkazOformlDP080210OrgTehnStroit },
        { name: 'Методические рекомендации по дипломному проектированию по теме: Проектирование участка новой железнодорожной линии (С.В. Малыхина)', url: metodUkazOformlDP080210Proektir },
        { name: 'Методические указания по дипломному проектированию для специальности 08.02.10 (А.Н. Орищенко)', url: metodUkazOformlDP080210Orishhenko }
    ];

    
    const TabButton = ({ tabId, title, icon: Icon }: { tabId: ActiveTab; title: string; icon: React.ElementType }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex-1 p-5 text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 border-b-4 ${
                activeTab === tabId
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
            <Icon className="w-6 h-6" />
            <span>{title}</span>
        </button>
    );

    return (
        // Оборачиваем уникальный контент в MainLayout
        <MainLayout>
            {/* MainLayout уже добавит: ContactStrip, InfoBlocks и обернет контент в container mx-auto. 
               Нам нужно только содержимое, которое раньше было внутри <main>.
            */}
            
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                        <span className="text-5xl mr-2">🎓</span>
                        Государственная Итоговая Аттестация
                    </h1>
                    <p className="text-lg text-gray-600">Все необходимые документы для подготовки к ГИА</p>
                </div>
                
                <div className="max-w-5xl mx-auto">
                    
                    <div className="bg-white rounded-t-2xl shadow-xl border border-gray-200 flex overflow-hidden">
                        <TabButton tabId="schedule" title="График ГИА" icon={CalendarDays} />
                        <TabButton tabId="programs" title="Программы" icon={BookOpen} />
                        <TabButton tabId="recommendations" title="Рекомендации" icon={FileText} />
                    </div>
                    
                    <div className="bg-white rounded-b-2xl shadow-xl border border-t-0 border-gray-200 p-8 min-h-[400px]">
                        {activeTab === 'schedule' && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                    <CalendarDays className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    График проведения ГИА
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    с 15.06.2025 г. по 28.06.2025
                                </p>
                                <a
                                    href="https://ttgt.org/images/raspisanie/Pr_GIA/Grafik_GIA_2025.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 py-3 px-8 bg-primary text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Открыть график (PDF)
                                </a>
                            </div>
                        )}
                        
                        {activeTab === 'programs' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Программы государственной итоговой аттестации
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    {programs.map((program, index) => (
                                        <a
                                            key={index}
                                            href={program.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex justify-between items-center p-4 rounded-xl transition-all duration-300 hover:bg-primary/10 hover:shadow-lg"
                                        >
                                            <span className="text-base font-medium text-gray-700 group-hover:text-primary transition-colors pr-4">
                                                {program.name}
                                            </span>
                                            <div className="flex-shrink-0 text-primary/60 group-hover:text-primary transition-all duration-300">
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'recommendations' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    Методические рекомендации
                                </h2>
                                <div className="space-y-3">
                                    {methodicalRecommendations.map((recommendation, index) => (
                                        <a
                                            key={index}
                                            href={recommendation.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-start gap-3 p-4 rounded-lg hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20"
                                        >
                                            <FileText className="w-4 h-4 text-primary/70 mt-1 flex-shrink-0" />
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                                                {recommendation.name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};

export default StateExam;