import React, { useRef } from 'react';
import { BookOpen, CheckCircle, Users, Briefcase, Phone, Banknote, ArrowRight, Link as LinkIcon, Menu, X } from 'lucide-react';

// --- Ваши реальные импорты ---
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';

// --- Импорт изображений ---
import HeroImage from '@/assets/pictures/1_ObrKredit_ObrKredit.jfif';
import AboutImage from '@/assets/pictures/2_ObrKredit_O_Proekte.jfif';
import ConditionsImage from '@/assets/pictures/3_ObrKredit_Usloviya_Predost.jfif';
import StudentsImage from '@/assets/pictures/4_ObrKredit_Materialy_Stud.jfif';
import TeachersImage from '@/assets/pictures/5_ObrKredit_Mater_Pedag.jfif';
import ContactsImage from '@/assets/pictures/6_ObrKredit_Kontakty.jfif';

// --- Импорт PDF документов ---
import SberCreditPdf from '@/assets/file/obcred/Sber_Obr_Kredit.pdf';
import RnkBCreditPdf from '@/assets/file/obcred/RNKB.pdf';
import RekomCreditPdf from '@/assets/file/obcred/Rekom_Obr_kredit.pdf';

// Функция для парсинга текста и замены ключевых фраз на ссылки
const parseContent = (text: string) => {
    // Добавлена проверка на случай, если text будет undefined
    if (!text) return null;

    const links: Record<string, string> = {
        'Чек-лист по оформлению': 'https://disk.yandex.ru/i/n_vuufHeE_589Q',
        'Консультация онлайн': 'https://open.edu.gov.ru/faq/#type=73',
        '«Что делать, если не поступил на бюджет?»': 'https://disk.yandex.ru/i/i-cUyb2wXpB99g',
        'Интервью с участником проекта': 'https://disk.yandex.ru/i/KoPmFR_EX79mMQ',
        'Информационный плакат об изменениях договора': 'https://vk.com/s/v1/doc/cady-s2ugsAbdjZvFqLww-6fv0_IDTYy0vhZEIsIkCarDxUSE6o',
        'Буклет «Что делать, если не поступил на бюджет?»': 'https://disk.yandex.ru/i/i-cUyb2wXpB99g',
        'Интервью с участником проекта «Обркредит в СПО»': 'https://disk.yandex.ru/i/KoPmFR_EX79mMQ',
        'Информационный плакат «Образовательный кредит: за и против»': 'https://disk.yandex.ru/i/jsWcxSwzpXKFqQ',
        'Постановление Правительства РФ от 15.09.2020 № 1448': 'https://firpo.ru/netcat_files/368/760/h_2665f95a1d1374f2234aa0d7843bc452',
        'Методические рекомендации': 'https://disk.yandex.ru/i/VNdskTMuLQAm-w',
        'Статистику по востребованности программы в разных регионах;': 'https://disk.yandex.ru/d/kzQ6xAsaz_wfCQ',
        'Анализ эффективности реализации Проекта;': 'https://vk.com/doc-224704750_685300661?hash=jJVjCy78g7KsTKnVpyNRT9sUN0ashgZEuIkRLRoPlzX&dl=fVAjJEvqqZNtAPsuUXpnRN6PJcooAIuN6HFLlw6LnKL',
        'Презентационные материалы для использования в работе.': 'https://vk.com/doc-224704750_688500043?hash=1G9zzcU4QFztzrBvEX5smOFIGRKsw79wH8gFk4gF8x8',
        'Образовательный кредит Сбербанка с государственной поддержкой': SberCreditPdf,
        'Образовательный кредит с господержкой': RnkBCreditPdf,
        'ПАО Сбербанк, РНКБ Банк (ПАО) информируют студентов, получивших кредит на образование': RekomCreditPdf,
    };

    return text.split('\n').map((paragraph, pIndex) => {
        if (paragraph.trim() === '') return <div key={pIndex} className="h-4" />;

        let processedParagraph: (string | JSX.Element)[] = [paragraph];
        for (const [phrase, url] of Object.entries(links)) {
            let tempProcessed: (string | JSX.Element)[] = [];
            processedParagraph.forEach(part => {
                if (typeof part === 'string' && part.includes(phrase)) {
                    const splitParts = part.split(phrase);
                    splitParts.forEach((textPart, i) => {
                        tempProcessed.push(textPart);
                        if (i < splitParts.length - 1) {
                            tempProcessed.push(
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={`${phrase}-${i}`}
                                    className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition duration-300"
                                >
                                    {phrase}
                                    <LinkIcon className="inline-block w-4 h-4 ml-1 -mt-1" />
                                </a>
                            );
                        }
                    });
                } else {
                    tempProcessed.push(part);
                }
            });
            processedParagraph = tempProcessed;
        }
        return <p key={pIndex}>{processedParagraph}</p>;
    });
};


const EducationCredit = () => {
    const sectionsRef = {
        about: useRef<HTMLDivElement>(null),
        conditions: useRef<HTMLDivElement>(null),
        students: useRef<HTMLDivElement>(null),
        teachers: useRef<HTMLDivElement>(null),
        contacts: useRef<HTMLDivElement>(null),
        banks: useRef<HTMLDivElement>(null),
    };

    const scrollToSection = (key: keyof typeof sectionsRef) => {
        sectionsRef[key].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMenuOpen(false);
    };
    
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const originalBlocks = [
        { id: 'about', title: 'О Проекте', image: AboutImage, content: `Среднее профессиональное образование сегодня – это не просто диплом, а реальный старт для карьеры в перспективных отраслях: от IT и медицины до инженерного дела и сервиса. Колледжи и техникумы с каждым годом становятся всё популярнее, ведь они дают не только знания, но и практические навыки, востребованные работодателями.\n\nНо что делать, если бюджетное место не досталось, а платить за обучение самостоятельно сложно?\n\nНе отказывайтесь от мечты! Государство предлагает льготный кредит на образование с фиксированной ставкой всего 3%. Это гораздо выгоднее обычных кредитов: государство компенсирует большую часть процентов, а начать оплачивать основной долг можно после трудоустройства.\n\nПочему это работает?\n• Доступно с 14 лет (с согласия родителей);\n• Срок погашения – до 15 лет;\n• Не нужен залог или поручитель.\n\nКак это поможет именно вам?\nПредставьте: вы учитесь на (наименование профессии/специальности), осваиваете современные производственные технологии, а после выпуска начинаете работать в престижной организации или на предприятии. Ваш кредит не станет обузой – первые выплаты начнутся только через 9 месяцев после трудоустройства, а низкая ставка сделает платежи комфортными.\n\nХотите узнать больше?\nПереходите в раздел «О проекте», где собраны ответы на все вопросы: от списка документов до пошаговой инструкции по оформлению. Не упустите шанс получить профессию мечты – даже если сегодня кажется, что финансы стоят на пути!\n\nP.S. Уже более 37 000 студентов СПО воспользовались программой. Присоединяйтесь – ваше будущее начинается сейчас!\n\nОБРАЗОВАТЕЛЬНЫЙ КРЕДИТ` },
        { id: 'about_2', title: 'О Проекте', image: 'placeholder', content: `О проекте Образовательный кредит с господдержкой – это уникальная программа, созданная для того, чтобы каждый абитуриент или студент мог получить качественное профессиональное образование, даже если бюджетное место недоступно. Фиксированная ставка в 3% – ключевое преимущество программы, ведь на рынке обычные потребительские кредиты сегодня предлагаются под 21–28%, а иногда и выше.\n\nКак это работает?\nГосударство берет на себя большую часть расходов по кредиту: пока вы учитесь, оно компенсирует разницу между рыночной и льготной ставкой. Это значит, что ваша переплата будет в разы меньше, чем при обычном кредитовании. Например, за обучение стоимостью 300 000 рублей за весь срок вы заплатите всего около 45 000 рублей процентов, а не 150 000–200 000, как в других случаях.\n\nПочему это удобно?\n• Длительный срок погашения – до 15 лет, что снижает ежемесячную нагрузку. Платежи можно начать через 9 месяцев после трудоустройства.\n• Никаких скрытых комиссий – вы платите только 3% годовых от суммы кредита.\n• Доступно для всех, кто поступил на платное отделение колледжа или техникума, начиная с 14 лет (с согласия родителей).\n\nРеальные примеры:\nНиколай Рехтин из Забайкальского края взял кредит на обучение по специальности «Организация перевозок и управление на транспорте». Его ежемесячный платеж после выпуска составил всего 2 000 рублей – это меньше, чем он тратит на проезд и обеды.\n\nГде узнать подробности?\n• Скачайте Пособие для студентов СПО с пошаговой инструкцией;\n• Изучите ответы на частые вопросы в разделе «Вопросы и ответы» на сайте Минпросвещения;\n• Познакомьтесь с Чек-листом по оформлению кредита.\n\nНе откладывайте будущее!\nДаже если сегодня финансы кажутся препятствием, образовательный кредит с господдержкой открывает двери в профессию мечты. В 2024 году программой уже воспользовались более 37 000 студентов – присоединяйтесь и вы!.` },
        { id: 'conditions', title: 'Условия предоставления', image: ConditionsImage, content: `Кто может получить кредит?\n1. Граждане РФ в возрасте от 14 лет:\n• Для заемщиков 14–18 лет необходимо письменное согласие родителя или законного представителя;\n• Важно! Кредит недоступен лицам, находящимся под опекой (согласно ст. 37 ГК РФ и закону «Об опеке и попечительстве»).\n2. Требования к обучению:\n• Поступление на платную программу СПО в колледж, техникум или иные учебные заведения, имеющие лицензию на образовательную деятельность.\n• Наличие договора с образовательной организацией.\n\nКак оформить кредит?\nПошаговая инструкция:\n1. Заключите договор на обучение;\n• Убедитесь, что учебное заведение имеет государственную лицензию на образовательную деятельность.\n2. Соберите документы\n• Паспорт заемщика (и родителя, если заемщик младше 18 лет);\n• Договор на платное обучение;\n• Счет для перечисления средств от банка.\n3. Выберите банк-партнер\nВ 2025 году кредит доступен в:\n• ПАО Сбербанк;\n• РНКБ (ПАО).\n4. Подайте заявку\n• Лично в отделении банка;\n• Через сайт банка (приложите скан-копии документов).\n5. Подпишите кредитный договор\n• Внимательно изучите график платежей и условия льготного периода.\n6. Дождитесь перевода средств\n• Банк перечислит деньги напрямую учебному заведению;\n• Вы получите уведомление о зачислении средств.\n\nПреимущества программы:\n• Низкая процентная ставка;\n• Льготный период: основные платежи начинаются через 9 месяцев после успешного завершения обучения;\n• Гибкий срок погашения: до 15 лет;\n\nПолезные материалы:\n• Чек-лист по оформлению – скачайте и следуйте шагам.\n• Консультация онлайн – ответы на частые вопросы от Минпросвещения.\n\nНе откладывайте!\nДаже если вы только планируете поступление, уже сейчас можно подать предварительную заявку и рассчитать ежемесячный платеж в калькуляторе. Ваше образование – лучшая инвестиция в будущее!\n\nP.S. Для примера использован онлайн калькулятор ПАО Сбербанк.` },
        { id: 'students', title: 'Материалы для студентов и абитуриентов', image: StudentsImage, content: `Здесь собраны все необходимые материалы, которые помогут вам разобраться в программе образовательного кредита с господдержкой. Если вы только планируете поступление или уже оформили кредит – эти документы ответят на ваши вопросы и упростят взаимодействие с банком.\n\nЧто вы найдёте в этом разделе?\n1. Буклет «Что делать, если не поступил на бюджет?»\nВ буклете простым языком объясняется, что делать, если не хватило баллов для зачисления на бюджет, как работает кредит с господдержкой, какие у него преимущества перед обычными кредитами и как избежать распространённых ошибок при оформлении;\n2. Интервью с участником проекта\nВ интервью участник программы господдержки рассказывает почему образовательный, а не обычный кредит, как проходило оформление, насколько удобно погашать, как кредит поможет карьере и многое другое;\n3. Информационный плакат об изменениях договора\nЕсли условия кредита изменились (например, из-за перевода на другую специальность или академического отпуска), этот материал подскажет, как действовать;\n\nПочему это полезно?\n• Экономия времени: вместо долгих поисков в интернете – вся информация в одном месте.\n• Актуальные данные: материалы регулярно обновляются с учётом изменений в законодательстве.\n• Понятно даже новичку: никаких сложных терминов – только конкретные примеры и инструкции.\n\nСовет: сохраните чек-лист на телефон, чтобы он был под рукой при визите в банк.\n\nГде скачать?\nВсе материалы доступны в формате PDF – их можно распечатать или открыть на любом устройстве:\n• Буклет «Что делать, если не поступил на бюджет?»\n• Интервью с участником проекта «Обркредит в СПО»\n• Информационный плакат «Образовательный кредит: за и против»\n\nЕсли остались вопросы, получите информационную поддержку:\n• На сайте Минпросвещения в разделе «Вопросы и ответы»;\n• По телефону горячей линии: +7 (499) 009-05-51 (доб. 5505);\n• По электронной почте: obrkreditspo@firpo.ru` },
        { id: 'teachers', title: 'Материалы для педагогов и руководителей', image: TeachersImage, content: `Этот раздел создан специально для сотрудников образовательных организаций, которые помогают студентам воспользоваться программой государственной поддержки образовательного кредитования. Здесь собраны все необходимые документы и методические материалы, чтобы эффективно организовать работу по информированию и сопровождению участников Проекта.\n\nКлючевые документы программы:\n• Постановление Правительства РФ от 15.09.2020 № 1448 — основной нормативный акт, регулирующий условия предоставления образовательного кредита;\n• Методические рекомендации оператора Проекта с подробными разъяснениями по работе с заемщиками.\n\nПрактические инструменты для работы:\nДля вашего удобства мы подготовили готовые решения, которые помогут в повседневной деятельности. Эти материалы оформлены в виде интерактивного модуля «Медиатека проекта «Обркредит в СПО».\n\nПрямая ссылка: https://clck.ru/3HmdxJ\n\nАналитика и отчетность:\nВ медиатеке доступны актуальные отчеты за 2022-2024 гг., включая:\n• Статистику по востребованности программы в разных регионах;\n• Анализ эффективности реализации Проекта;\n• Презентационные материалы для использования в работе.\n\nВажно: Все материалы регулярно обновляются с учетом изменений законодательства и практики реализации программы.\n\nЕсли вам нужна дополнительная консультация, вы можете:\n• Написать на почту оператора Проекта: obrkreditspo@firpo.ru;\n• Позвонить по телефону горячей линии: +7 (499) 009-05-51 (доб. 5505);\n• Принять участие в регулярно проводимых вебинарах для представителей образовательных организаций.` },
        { id: 'contacts', title: 'Контакты оператора Проекта', image: ContactsImage, content: `Оператором Проекта выступает Казанский филиал федерального государственного бюджетного образовательного учреждения дополнительного профессионального образования «Институт развития профессионального образования»\n\nПолучить методическую и информационно-консультационную поддержку можно:\n• На сайте Минпросвещения РФ в разделе «Вопросы и ответы»;\n• По телефону горячей линии: +7 (499) 009-05-51 (доб. 5505);\n• По электронной почте: obrkreditspo@firpo.ru\n\nВсе разработанные материалы по Проекту находятся в социальной сети ВКонтакте в Банке материалов «Обркредит в СПО», доступ по ссылке: https://vk.com/obrkredit_spo`},
        { id: 'banks', title: 'Банки партнёры', image: HeroImage, content: `БАНКИ ПАРТНЕРЫ\n\nСбербанк\nОбразовательный кредит Сбербанка с государственной поддержкой\nТихорецкий техникум ЖД транспорта добавлен в список кредитуемых учебных заведений по Образовательному кредиту в Сбербанке.\n\nКонсультация и оказание помощи в оформлении по номеру тел. 8(995)7396091 Евгения или по адресу г. Тихорецк, ул. Энгельса, 91 кабинет 13(вход ближе к библиотеке), также возможен выезд сотрудника в учебное заведение.\n\nРНКБ Банк\nОбразовательный кредит с господержкой\nБанк стал участником программы, согласно постановления Правительства РФ от 15 сентября 2020 г. №1448 "О государственной поддержке образовательного кредитования" и запустил Образовательный кредит с государственной поддержкой под 3%.\n\nОбращаться по адресу: ДО №349 РНКБ Банк (ПАО). г. Тихорецк, ул. Подвойского55 /Энгельса78. Телефон для справок: +7989-215-56-72 Наталья; +7967-654-77-11 Яна. +7961-509-05-88 Екатерина; +7928-929-56-31 Ольга\n\nПАО Сбербанк, РНКБ Банк (ПАО) информируют студентов, получивших кредит на образование`},
    ];
    
    // Объединение контента для секций
    const contentData = [
        { id: 'about', title: 'О Проекте', image: AboutImage, content: originalBlocks[0].content + '\n\n' + originalBlocks[1].content },
        { id: 'conditions', title: 'Условия предоставления', image: ConditionsImage, content: originalBlocks[2].content },
        { id: 'students', title: 'Материалы для студентов и абитуриентов', image: StudentsImage, content: originalBlocks[3].content },
        { id: 'teachers', title: 'Материалы для педагогов и руководителей', image: TeachersImage, content: originalBlocks[4].content },
        { id: 'contacts', title: 'Контакты оператора Проекта', image: ContactsImage, content: originalBlocks[5].content },
        // ✅ ИСПРАВЛЕНО: Источник данных для 'banks' изменен на originalBlocks[6]
        { id: 'banks', title: 'Банки партнёры', image: HeroImage, content: originalBlocks[6].content.split('БАНКИ ПАРТНЕРЫ')[1] }
    ];

    const navItems = [
        { name: 'О Проекте', key: 'about', icon: BookOpen },
        { name: 'Условия предоставления', key: 'conditions', icon: CheckCircle },
        { name: 'Материалы для студентов', key: 'students', icon: Users },
        { name: 'Материалы для педагогов', key: 'teachers', icon: Briefcase },
        { name: 'Контакты оператора', key: 'contacts', icon: Phone },
        { name: 'Банки-партнёры', key: 'banks', icon: Banknote },
    ];
    
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 min-h-screen">
                    <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-black overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-20"></div>
                        <img src={HeroImage} alt="Студенты на лекции" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="container mx-auto px-6 py-20 md:py-32 text-center relative z-10">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
                               
                            </h1>
                            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto drop-shadow-md">
                                
                            </p>
                            <button 
                                onClick={() => scrollToSection('about')}
                                className="mt-10 bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                            >
                                Узнать больше <ArrowRight className="inline-block w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="container mx-auto px-6 py-12">
                        <div className="lg:flex lg:gap-12">
                            <aside className="lg:w-1/4 mb-12 lg:mb-0">
                                <div className="sticky top-24">
                                    <div className="flex justify-between items-center lg:hidden mb-4 p-4 bg-white rounded-2xl shadow-md border border-gray-200/80">
                                        <h3 className="text-xl font-bold text-gray-800">Навигация по странице</h3>
                                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-gray-100">
                                            {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                                        </button>
                                    </div>
                                    <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block bg-white p-6 rounded-2xl shadow-md border border-gray-200/80`}>
                                        <ul className="space-y-2">
                                            {navItems.map(item => (
                                                <li key={item.key}>
                                                    <button 
                                                        onClick={() => scrollToSection(item.key as keyof typeof sectionsRef)}
                                                        className="w-full flex items-center text-left p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 group"
                                                    >
                                                        <item.icon className="w-5 h-5 mr-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                                        <span className="font-medium">{item.name}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </div>
                            </aside>
                            <div className="lg:w-3/4 space-y-16">
                               {contentData.map(section => (
                                    <Section 
                                        key={section.id}
                                        ref={sectionsRef[section.id as keyof typeof sectionsRef]} 
                                        id={section.id} 
                                        title={section.title} 
                                        image={section.image}
                                    >
                                        {parseContent(section.content)}
                                    </Section>
                               ))}
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

const Section = React.forwardRef<HTMLDivElement, { id: string, title: string, image: string, children: React.ReactNode }>(({ id, title, image, children }, ref) => (
    <div id={id} ref={ref} className="bg-white rounded-3xl shadow-lg border border-gray-200/80 overflow-hidden scroll-mt-24">
        <img src={image} alt={title} className="w-full h-56 md:h-64 object-cover" />
        <div className="p-8 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                {children}
            </div>
        </div>
    </div>
));

export default EducationCredit;

