import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { BookOpen } from 'lucide-react';
import { settingsApi } from '@/api/settings';

// Импорты для fallback (дефолтные картинки)
import image1930 from '@/assets/pictures/ttgt_30.jpg';
import imageWar from '@/assets/pictures/ttgt_95.jpg';
import imageModern from '@/assets/pictures/Zavyalov.png';

const DEFAULT_HISTORY = [
    { year: "1930", title: "Основание техникума", imageUrl: image1930, imageAlt: "Историческое фото 1930", imageOnLeft: true, content: `<p>Открытие техникума в городе Тихорецке состоялось в октябре 1930 года. Учебное заведение получило название - Тихорецкий механический техникум Азово-Черноморской железной дороги дирекции Народного комиссариата путей сообщения СССР. Начальником был назначен Макашин В.П.</p><p>В 30-е годы техникум располагался в двухэтажном здании, на углу улиц Красноармейской и Угольной, в одном здании шли занятия, в другом - было общежитие для иногородних студентов. Обучение проводилось по двум специальностям: «Паровозы и паровозное хозяйство», «Вагоны и вагонное хозяйство».</p>` },
    { year: "1934", title: "Военные годы и Восстановление", imageUrl: "", imageAlt: "", imageOnLeft: false, content: `<p>В декабре 1934 году учебное заведение возглавил опытный производственник Сакварелидзе М.А. Техникум успешно развивался, но грянула Великая Отечественная война. С сентября 1941 года Тихорецк подвергался постоянным вражеским налетам. В начале войны почти пятая часть тихоречан ушла на фронт.</p><p>С 5 августа 1942 года по 30 января 1943 года город Тихорецк подвергся оккупации. Техникум был эвакуирован в Закавказье, затем в Ставрополь. Студенты, выпускники и сотрудники техникума уходили на фронт в числе первых.</p><p>В 1947 году техникум под руководством Артеменко А.Г. был возвращён в город Тихорецк и продолжил свою деятельность в здании школы № 35.</p>` },
    { year: "70-е", title: "Рост и Развитие", imageUrl: imageWar, imageAlt: "Современный вид", imageOnLeft: true, content: `<p>С годами расширялась и укреплялась учебно-лабораторная база техникума. В 70-е годы XX века Северо-Кавказская железная дорога выделила средства на пристройку к учебному корпусу. В 80-е гг. XX в. было построено пятиэтажное здание общежития на 360 мест.</p><p>В начале ХХ века под руководством директора Арефьева В.М. проведен капитальный ремонт 1-го и 2-го учебных корпусов, открыт 3-й корпус, 2-е общежитие, учебный полигон железнодорожных машин.</p>` },
    { year: "2025", title: "Новая эра: Инновации и Лидерство", imageUrl: imageModern, imageAlt: "Завьялов Андрей Александрович", imageOnLeft: false, content: `<p>С июня 2025 года ТТЖТ-филиал РГУПС возглавил <strong>Андрей Александрович Завьялов</strong>, кандидат философских наук. Инновационная деятельность педагогического коллектива направлена на повышение качества состава и создание современной базы.</p><p>Это позволяет техникуму ежегодно осуществлять обучение по 11 лицензированным специальностям.</p>` }
];

const DEFAULT_ACHIEVEMENTS = {
    title: "Современность и достижения",
    achievements_text: `<p>По результатам рейтинговой оценки деятельности филиалов и структурных подразделений среднего профессионального образования государственных университетов путей сообщения Росжелдора более 10 лет ТТЖТ-филиал РГУПС занимает лидирующие места, 2023 и 2024 год – первое место среди образовательных организаций железнодорожного транспорта России.</p>
    <p>На базе техникума ежегодно проходит большое количество мероприятий... В конференциях принимают участие студенты техникумов, колледжей и университетов из городов Беларуси, Казахстана и России.</p>
    <p>С 2014 года в техникуме формируются студенческие трудовые отряды, которые становятся победителями в ежегодном краевом конкурсе среди студенческих трудовых отрядов.</p>
    <p>Вот уже 95 лет Тихорецкий техникум железнодорожного транспорта – филиал ФГБОУ ВО РГУПС выпускает высококлассных специалистов. Количество выпускников с момента основания ТТЖТ-филиала РГУПС по программам СПО – свыше 26 000 человек, по программам дополнительного профессионального обучения более 30 000 человек. И славная история техникума продолжается!</p>`
};

const ImageModal = ({ src, alt, onClose }: { src: string | null; alt: string; onClose: () => void; }) => {
    if (!src) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 cursor-pointer" onClick={onClose}>
            <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
                <img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded-lg" />
                <button className="absolute -top-2 -right-2 text-white bg-black/30 rounded-full p-1 hover:bg-black/50" onClick={onClose}>✕</button>
            </div>
        </div>
    );
};

const TimelineItem = ({ year, title, content, imageUrl, imageAlt, openModal, imageOnLeft = false }: any) => {
    const contentBlock = (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
            {/* ДОБАВЛЕН КЛАСС rich-text-content ДЛЯ ОТОБРАЖЕНИЯ СПИСКОВ И ИНТЕРВАЛОВ */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed rich-text-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
    const imageBlock = imageUrl ? (
        <div className="w-full h-full rounded-2xl shadow-xl overflow-hidden cursor-pointer group" onClick={() => openModal(imageUrl, imageAlt)}>
            <img src={imageUrl} alt={imageAlt || title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
    ) : null;
    
    return (
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            <div className="hidden md:flex justify-center md:col-span-1">
                <div className="absolute top-8 h-full border-l-2 border-primary/30 z-0"></div>
                <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                    <span className="text-white text-lg font-bold">{year}</span>
                </div>
            </div>
            <div className={`md:col-span-4 ${imageOnLeft ? 'md:order-last' : ''}`}>{contentBlock}</div>
            {imageBlock && <div className={`md:col-span-4 ${imageOnLeft ? 'md:order-first' : ''} ${!imageOnLeft ? 'md:col-start-2' : ''}`}>{imageBlock}</div>}
        </div>
    );
};

const History = () => {
    const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
    const [items, setItems] = useState(DEFAULT_HISTORY);
    const [achievements, setAchievements] = useState(DEFAULT_ACHIEVEMENTS);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [historyData, achievementsData] = await Promise.all([
                    settingsApi.getPageData('history_page'),
                    settingsApi.getPageData('history_achievements')
                ]);
                
                if (historyData) {
                    const realData = Array.isArray(historyData) ? historyData : (historyData.items || []);
                    
                    if (realData.length > 0) {
                        // Если в базе есть данные, используем их
                        // Пытаемся подтянуть дефолтные картинки только если год совпадает с дефолтным, иначе используем то, что есть
                        const processedData = realData.map((item: any) => {
                            // Ищем совпадение в дефолтных данных по году, чтобы взять картинку-заглушку, если своей нет
                            const defaultItem = DEFAULT_HISTORY.find(d => d.year === item.year);
                            return {
                                ...item,
                                imageUrl: item.imageUrl || (defaultItem ? defaultItem.imageUrl : '')
                            };
                        });
                        setItems(processedData);
                    }
                }
                
                if (achievementsData) {
                    setAchievements(prev => ({
                        ...prev,
                        ...achievementsData,
                        // Поддержка разных названий поля контента (на всякий случай)
                        content: achievementsData.achievements_text || achievementsData.content || prev.achievements_text
                    }));
                }
            } catch (error) {
                console.error('Error loading history data:', error);
            }
        };
        loadData();
    }, []);

    return (
        <MainLayout>
            <ImageModal src={modalImageSrc} alt="" onClose={() => setModalImageSrc(null)} />
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12"> 
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-12 text-center tracking-tight flex items-center justify-center">
                    <BookOpen className="w-10 h-10 mr-4 text-accent" /> История техникума
                </h1>
                
                <div className="relative space-y-16 mb-16">
                    {items.map((item, idx) => (
                        <TimelineItem key={idx} {...item} openModal={(src: string) => setModalImageSrc(src)} />
                    ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                    <h2 className="text-3xl font-bold text-primary mb-6 text-center">{achievements.title || "Современность и достижения"}</h2>
                    {/* ДОБАВЛЕН КЛАСС rich-text-content ДЛЯ ОТОБРАЖЕНИЯ СПИСКОВ И ИНТЕРВАЛОВ */}
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed rich-text-content" dangerouslySetInnerHTML={{ __html: achievements.achievements_text || achievements.content }} />
                </div>
            </div>
        </MainLayout>
    );
};

export default History;