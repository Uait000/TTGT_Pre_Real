import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import { settingsApi } from '@/api/settings';

// Импорты документов
import PamyatkaAbiturCelevoe from '@/assets/file/com/Pamyatka_abitur_celevoe_2025.pdf';
import PamyatkaCelevoe from '@/assets/file/com/Pamyatka_celevoe_2025.pdf';
import PrikazOchnaya from '@/assets/file/com/prikaz_671os_ot_21_04_2025_OO.pdf';
import PrikazZaochnaya from '@/assets/file/com/prikaz_681os_ot_22_04_2025_zo.pdf';
import SoglasieZachislenie from '@/assets/file/com/soglasie_na_zachislenie_2025.pdf';
import SoglasieObrabPD from '@/assets/file/com/Soglasie_Obrab_PD_2025.pdf';
import SoglasieObrabPDNesov from '@/assets/file/com/Soglasie_Obrab_PD_nesov_2025.pdf';
import SoglasieObrabPDPredstav from '@/assets/file/com/Soglasie_Obrab_PD_predstav_2025.pdf';
import SoglasieRasprostrPD from '@/assets/file/com/Soglasie_Rasprostr_PD_2025.pdf';
import SoglasieRasprostrPDNesov from '@/assets/file/com/Soglasie_Rasprostr_PD_nesov_2025.pdf';
import Spravka086 from '@/assets/file/com/spravka_086_y.pdf';
import UsloviaPriemaPlatno from '@/assets/file/com/usloviia_priema_platno_2025.pdf';
import ZayavlObshh from '@/assets/file/com/Zayavl_Obshh_2021.pdf';
import ZayavlenieAbitur from '@/assets/file/com/Zayavlenie_Abirur_2025.pdf';
import dogovor1 from '@/assets/file/com/dogovor_platnie_obraz_usluga_2.pdf';
import dogovor2 from '@/assets/file/com/dogovor_platnie_obraz_usluga_3.pdf';

// Дефолтные секции
const DEFAULT_SECTIONS = [
    {
        id: 1,
        title: 'СПЕЦИАЛЬНЫЕ ТЕЛЕФОННЫЕ ЛИНИИ ДЛЯ ОБРАЩЕНИЯ, СВЯЗАННЫЕ С ПРИЁМОМ НА ОБУЧЕНИЕ',
        content: `<p>Специальная телефонная линия для ответов на обращения, связанные с приёмом в ТТЖТ - филиал РГУПС:</p>
<p><strong>Приёмная комиссия:</strong></p>
<ul>
<li>8(86196) 6-20-03, доб. 150, 8 (918) 682-52-97 г. Тихорецк.</li>
<li>8(863) 255-31-61, 245-37-13, г. Ростов-на-Дону</li>
</ul>
<p>Вопросы, касающиеся приёма в ТТЖТ - филиал РГУПС можно также отправить на адрес электронной почты: <a href="mailto:abiturient@ttgt.org" class="text-primary hover:underline">abiturient@ttgt.org</a></p>
<p><strong>Председатель отборочной комиссии ТТЖТ - филиал РГУПС:</strong> директор ТТЖТ - филиала РГУПС Завьялов Андрей Александрович.</p>
<p><strong>Секретарь отборочной комиссии ТТЖТ - филиал РГУПС:</strong> Сафронова Оксана Владимировна.</p>`
    },
    {
        id: 2,
        title: 'ИНФОРМАЦИЯ О ВОЗМОЖНОСТИ ПРИЁМА ЗАЯВЛЕНИЙ',
        content: `<p>Приём заявлений в 2025 году в ТТЖТ - филиал РГУПС проводится на первый курс по личному заявлению граждан.</p>
<p>Поступающие вправе направить/представить в ФГБОУ ВО РГУПС заявление о приеме, а также необходимые документы одним из следующих способов:</p>
<ol>
<li>Лично в отборочную комиссию филиала/техникума ФГБОУ ВО РГУПС по месту нахождения филиала/техникума;</li>
<li>Через операторов почтовой связи общего пользования (далее – по почте) заказным письмом с уведомлением о вручении.<br />
При направлении документов по почте поступающий к заявлению о приеме прилагает копии документов, удостоверяющих его личность и гражданство, документа об образовании и (или) документа об образовании и о квалификации, а также иных документов, предусмотренных настоящими Правилами;</li>
<li>В электронной форме, посредством электронной почты ТТЖТ - филиал РГУПС;</li>
<li>Личный кабинет абитуриента на сайте техникуме <a href="http://www.ttgt.org" class="text-primary hover:underline">http://www.ttgt.org</a>;</li>
<li>С использованием функционала федеральной государственной информационной системы «Единый портал государственных и муниципальных услуг (функций)»</li>
</ol>
<p>Направляемые документы одним из перечисленных способов, принимаются не позднее сроков, установленных в Правила приёма в 2025 году.</p>`
    },
    // ... (остальные секции, если они есть, можно добавить здесь)
];

const PdfLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary font-medium hover:text-secondary hover:underline transition-all duration-200 group"
    >
        <FileText className="w-4 h-4 flex-shrink-0" />
        <span className="group-hover:translate-x-1 transition-transform">{children}</span>
    </a>
);

const WebLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary font-medium hover:text-secondary hover:underline transition-all duration-200 group"
    >
        <ExternalLink className="w-4 h-4 flex-shrink-0" />
        <span className="group-hover:translate-x-1 transition-transform">{children}</span>
    </a>
);

const SelectionCommittee = () => {
    const [openSection, setOpenSection] = useState<number | null>(null);
    const [sections, setSections] = useState(DEFAULT_SECTIONS);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Используем правильный метод getPageSettings или getPublicPageSettings
                // Если settingsApi.getPublicPageSettings не существует, используем getPageSettings или аналог
                // Предположим, что у вас есть метод getPageData, который мы добавили ранее
                const data = await settingsApi.getPageData('selection_committee_page');
                
                if (data && data.sections) {
                    // Объединяем данные с дефолтными, сохраняя структуру
                    // Если секций в базе больше, чем дефолтных, они тоже будут отображены
                    const mergedSections = data.sections.map((section: any, index: number) => {
                         // Пытаемся найти соответствие по ID или индексу
                         const defaultSection = DEFAULT_SECTIONS.find(s => s.id === section.id) || DEFAULT_SECTIONS[index] || {};
                         
                         return {
                             ...defaultSection,
                             ...section,
                             // Используем контент из базы, если он есть, иначе дефолтный
                             content: section.content || defaultSection.content
                         };
                    });
                    
                    // Если в базе меньше секций, чем в дефолте, добавляем оставшиеся дефолтные (опционально)
                    if (mergedSections.length < DEFAULT_SECTIONS.length) {
                        const existingIds = new Set(mergedSections.map((s: any) => s.id));
                        DEFAULT_SECTIONS.forEach(defSection => {
                            if (!existingIds.has(defSection.id)) {
                                mergedSections.push(defSection);
                            }
                        });
                        // Сортируем по ID
                        mergedSections.sort((a: any, b: any) => a.id - b.id);
                    }
                    
                    setSections(mergedSections);
                }
            } catch (error) {
                console.error('Error loading selection committee data:', error);
            }
        };
        loadData();
    }, []);

    const toggleSection = (sectionId: number) => {
        setOpenSection(openSection === sectionId ? null : sectionId);
    };

    // Функция для рендеринга специальных секций с документами (статичными)
    const renderSpecialSection = (sectionId: number) => {
        switch (sectionId) {
            case 17: // Как стать студентом-целевиком
                return (
                    <>
                        <p>В целях организации и проведения конкурсного отбора кандидатов на целевое обучение... на Карьерном портале холдинга «РЖД» создана страница...</p>
                        <p>Начиная с 2023 года, конкурсный отбор кандидатов на целевое обучение будет проводиться компанией только на основе заявок, поступивших с Карьерного портала холдинга «РЖД».</p>
                        <p>Сссылка на страницу «Подать заявку в РЖД на целевое обучение».</p>
                        <p>Адрес страницы: <WebLink href="https://team.rzd.ru/targets">https://team.rzd.ru/targets</WebLink></p>
                        <p><strong>Единый контакт-центр "Приём в ВУЗ":</strong></p>
                        <ul className="list-disc list-inside pl-4">
                            <li>сайт <WebLink href="https://priemvuz.ru/">https://priemvuz.ru/</WebLink></li>
                            <li>телефон 8 (800) 301-44-55 (для звонков по России), 8 (495) 122-22-68 (для звонков из-за рубежа).</li>
                        </ul>
                        <div className="space-y-2 mt-4">
                            <PdfLink href={PamyatkaAbiturCelevoe}>Памятка об организации целевого обучения для абитуриента, поступающего на обучение</PdfLink>
                            <PdfLink href={PamyatkaCelevoe}>Памятка о целевом обучении</PdfLink>
                        </div>
                    </>
                );
            case 22: // Условия приёма на платное обучение
                return (
                    <div className="space-y-2">
                        <PdfLink href={UsloviaPriemaPlatno}>Условия приёма на обучение по договорам об оказании платных образовательных услуг по программам среднего профессионального образования</PdfLink>
                        <PdfLink href={UsloviaPriemaPlatno}>Условия приёма на обучение по договорам об оказании платных образовательных услуг по программам среднего профессионального образования с 20.06.2025 г.</PdfLink>
                    </div>
                );
            case 25: // Образцы документов
                return (
                    <div className="flex flex-col space-y-2">
                        <PdfLink href={ZayavlenieAbitur}>Заявление абитуриента</PdfLink>
                        <PdfLink href={SoglasieZachislenie}>Согласие на зачисление</PdfLink>
                        <PdfLink href={ZayavlObshh}>Заявление на проживание в общежитии</PdfLink>
                        <PdfLink href={SoglasieObrabPD}>Согласие абитуриента на обработку персональных данных (совершеннолетний)</PdfLink>
                        <PdfLink href={SoglasieObrabPDNesov}>Согласие абитуриента на обработку персональных данных (несовершеннолетний)</PdfLink>
                        <PdfLink href={SoglasieRasprostrPD}>Согласие на обработку персональных данных, разрешенных... для распространения (совершеннолетний)</PdfLink>
                        <PdfLink href={SoglasieRasprostrPDNesov}>Согласие на обработку персональных данных, разрешенных... для распространения (несовершеннолетний)</PdfLink>
                        <PdfLink href={SoglasieObrabPDPredstav}>Согласие законного представителя абитуриента на обработку персональных данных</PdfLink>
                        <PdfLink href={Spravka086}>Справка ф. № 086/У</PdfLink>
                    </div>
                );
            case 28: // Приказы об оплате
                return (
                    <div className="flex flex-col space-y-2">
                        <PdfLink href={PrikazOchnaya}>Приказ об установлении размера оплаты за обучение (очная форма обучения) на 1 полугодие (семестр) 2025/2026 учебного года</PdfLink>
                        <PdfLink href={PrikazZaochnaya}>Приказ об установлении размера оплаты за обучение (заочная форма обучения) на 1 полугодие (семестр) 2025/2026 учебного года</PdfLink>
                    </div>
                );
            case 29: // Образцы договоров
                return (
                    <div className="flex flex-col space-y-2">
                        <PdfLink href={dogovor1}>Образец договора об оказании платных образовательных услуг среднее профессиональное образование (двухсторонний)</PdfLink>
                        <PdfLink href={dogovor2}>Образец договора об оказании платных образовательных услуг среднее профессиональное образование (трехсторонний)</PdfLink>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <MainLayout>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-12 text-center">
                Отборочная комиссия
            </h1>
            <div className="max-w-4xl mx-auto">
                <div className="space-y-6"> 
                    {sections.map((section) => (
                        <div 
                            key={section.id} 
                            className="bg-white rounded-xl shadow-lg shadow-primary/10 overflow-hidden transition-all duration-300 ease-in-out"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full p-6 text-left flex items-center justify-between group"
                            >
                                <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-200">
                                    {section.title}
                                </h2>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-all duration-200">
                                    {openSection === section.id ? (
                                        <ChevronUp className="w-5 h-5 text-primary" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-primary" />
                                    )}
                                </div>
                            </button>
                            
                            {openSection === section.id && (
                                <div className="px-6 pb-6 border-t border-gray-200">
                                    <div className="pt-6 text-base text-gray-700 leading-relaxed space-y-4">
                                        {/* Для специальных секций с документами используем статичный рендер */}
                                        {renderSpecialSection(section.id) ? (
                                            renderSpecialSection(section.id)
                                        ) : (
                                            // Для обычных секций используем HTML из админки с классом rich-text-content
                                            <div 
                                                className="prose prose-gray max-w-none rich-text-content"
                                                dangerouslySetInnerHTML={{ __html: section.content }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
};

export default SelectionCommittee;