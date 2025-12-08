import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Waves, FileText, Users, Phone, Film, ExternalLink } from 'lucide-react';
import { settingsApi } from '@/api/settings';

import Prik1 from '@/assets/file/Prikaz_Stoim_05072024.pdf';
import Prik2 from '@/assets/file/Prikaz_Stoim_01012025.pdf';
import Prav from '@/assets/file/Pravila_polz_bass_30122021.pdf';
import Polog from '@/assets/file/Polog_bas_30122021.pdf';
import Rasp from '@/assets/file/RaspRab_Bass_okt_2025.pdf';
import sw_1 from '@/assets/pictures/phoca_thumb_l_321.jpg';
import sw_2 from '@/assets/pictures/phoca_thumb_l_322.jpg';
import sw_3 from '@/assets/pictures/phoca_thumb_l_323.jpg';
import sw_4 from '@/assets/pictures/phoca_thumb_l_324.jpg';
import sw_5 from '@/assets/pictures/phoca_thumb_l_325.jpg';
import sw_6 from '@/assets/pictures/phoca_thumb_l_326.jpg';

// Дефолтные HTML таблицы (для начального рендера)
const DEFAULT_TABLE1_HTML = `<table class="w-full border-collapse border border-gray-300">
<thead><tr class="bg-green-100"><th class="border border-gray-300 p-2 font-semibold text-green-900 text-center">Наименование услуги</th><th class="border border-gray-300 p-2 font-semibold text-green-900 text-center">Количество занятий</th><th class="border border-gray-300 p-2 font-semibold text-green-900 text-center">Стоимость (руб.)</th></tr></thead>
<tbody>
<tr><td class="border border-gray-300 p-2 text-center">Обучение спортивному плаванию</td><td class="border border-gray-300 p-2 text-center">4 (1 раз в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">2000</td></tr>
<tr><td class="border border-gray-300 p-2 text-center">Обучение первичным навыкам плавания</td><td class="border border-gray-300 p-2 text-center">4 (1 раз в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">2000</td></tr>
<tr><td class="border border-gray-300 p-2 text-center">Обучение спортивному плаванию</td><td class="border border-gray-300 p-2 text-center">8 (2 раза в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">4000</td></tr>
<tr><td class="border border-gray-300 p-2 text-center">Обучение первичным навыкам плавания</td><td class="border border-gray-300 p-2 text-center">8 (2 раза в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">4000</td></tr>
<tr><td class="border border-gray-300 p-2 text-center">Обучение спортивному плаванию</td><td class="border border-gray-300 p-2 text-center">12 (3 раза в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">6000</td></tr>
<tr><td class="border border-gray-300 p-2 text-center">Обучение первичным навыкам плавания</td><td class="border border-gray-300 p-2 text-center">12 (3 раза в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">6000</td></tr>
</tbody></table>`;

const DEFAULT_TABLE2_HTML = `<table class="w-full border-collapse border border-gray-300">
<thead><tr class="bg-blue-100"><th class="border border-gray-300 p-2 font-semibold text-blue-900 text-center">Наименование услуги</th><th class="border border-gray-300 p-2 font-semibold text-blue-900 text-center">Количество занятий</th><th class="border border-gray-300 p-2 font-semibold text-blue-900 text-center">Стоимость (руб.)</th></tr></thead>
<tbody>
<tr><td class="border border-gray-300 p-2 text-center">Разовое посещение</td><td class="border border-gray-300 p-2 text-center">1</td><td class="border border-gray-300 p-2 text-center font-medium">450</td></tr>
<tr><td class="border border-gray-300 p-2 text-center">Абонемент</td><td class="border border-gray-300 p-2 text-center">4 в месяц</td><td class="border border-gray-300 p-2 text-center font-medium">1 600</td></tr>
<tr><td class="border border-gray-300 p-2 text-center">Абонемент</td><td class="border border-gray-300 p-2 text-center">8 в месяц</td><td class="border border-gray-300 p-2 text-center font-medium">3 200</td></tr>
</tbody></table>`;

const DEFAULT_TABLE3_HTML = `<table class="w-full border-collapse border border-gray-300">
<thead><tr class="bg-purple-100"><th class="border border-gray-300 p-2 font-semibold text-purple-900 text-center">Наименование услуги</th><th class="border border-gray-300 p-2 font-semibold text-purple-900 text-center">Количество занятий</th><th class="border border-gray-300 p-2 font-semibold text-purple-900 text-center">Стоимость (руб.)</th></tr></thead>
<tbody>
<tr><td class="border border-gray-300 p-2 text-center">Разовое посещение для работников</td><td class="border border-gray-300 p-2 text-center">1</td><td class="border border-gray-300 p-2 text-center font-medium text-green-600">Бесплатно</td></tr>
<tr><td class="border border-gray-300 p-2 text-center">Абонемент для работников</td><td class="border border-gray-300 p-2 text-center">2 в неделю</td><td class="border border-gray-300 p-2 text-center font-medium">1600 / месяц</td></tr>
<tr><td class="border border-gray-300 p-2 text-center">Разовое посещение для студентов (внеурочно)</td><td class="border border-gray-300 p-2 text-center">1</td><td class="border border-gray-300 p-2 text-center font-medium">200</td></tr>
</tbody></table>`;

const DEFAULT_INSTRUCTORS = [
    { name: "Шароглазов Константин Леонидович", position: "призер Чемпионата России на открытой воде, КМС по плаванию" },
    { name: "Фастова Маргарита Витальевна", position: "преподаватель физ. культуры, отличник ГТО" },
    { name: "Бердыч Светлана Александровна", position: "преподаватель физ. культуры, КМС по спорт. ориентированию" },
    { name: "Буров Андрей Викторович", position: "преподаватель физ. культуры, КМС по легкой атлетике, Чемпион России" }
];

const DEFAULT_DESCRIPTION = `<p><strong>«Плавать рекомендуется с детства и до глубокой старости.»</strong> - Заведующая бассейном Г.А. Лапова</p>
<p>Во время плавания увеличивается объем легких, ускоряется процесс насыщения кислородом организма. Вода обладает массирующим и расслабляющим эффектом, что благотворно влияет на нервную систему. Люди, посещающие бассейн, меньше подвержены нервным расстройствам, бессонницам, реже болеют и дольше живут.</p>
<p>Возможность плавать в любое время года без ограничений по возрасту и состоянию здоровья – вот, что по-настоящему ценно!</p>
<p><strong>Приглашаем всех желающих посетить бассейн Тихорецкого техникума железнодорожного транспорта!</strong></p>`;

const SwimmingPool = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [data, setData] = useState({
        slides: [sw_1, sw_2, sw_3, sw_4, sw_5, sw_6],
        description: DEFAULT_DESCRIPTION,
        instructors: DEFAULT_INSTRUCTORS,
        contact_phone: "8 (86196) 6-20-03",
        contact_name: "Лапова Г.А.",
        documents: [
            { title: "Приказ 'Об установлении стоимости физкультурно-оздоровительных услуг...' с 01.01.2025 г.", file: Prik2 },
            { title: "Приказ 'Об установлении стоимости услуг по обучению...' с 06.07.2024 г.", file: Prik1 },
            { title: "Правила пользования бассейном ТТЖТ - филиала РГУПС", file: Prav },
            { title: "Положение о плавательном бассейне ТТЖТ - филиала РГУПС", file: Polog },
            { title: "Расписание занятий с 01 октября по 31 октября 2025 года", file: Rasp }
        ],
        table1_html: DEFAULT_TABLE1_HTML,
        table2_html: DEFAULT_TABLE2_HTML,
        table3_html: DEFAULT_TABLE3_HTML
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const settings = await settingsApi.getPageData('swimming_pool_page');
                if (settings) {
                    setData(prevData => ({
                        ...prevData,
                        ...settings,
                        slides: (settings.slides && settings.slides.length > 0) ? settings.slides : prevData.slides,
                        description: settings.description || prevData.description,
                        instructors: (settings.instructors && settings.instructors.length > 0) ? settings.instructors : prevData.instructors,
                        contact_phone: settings.contact_phone || prevData.contact_phone,
                        contact_name: settings.contact_name || prevData.contact_name,
                        documents: (settings.documents && settings.documents.length > 0) ? settings.documents : prevData.documents,
                        table1_html: settings.table1_html || prevData.table1_html,
                        table2_html: settings.table2_html || prevData.table2_html,
                        table3_html: settings.table3_html || prevData.table3_html
                    }));
                }
            } catch (error) {
                console.error('Error loading swimming pool data:', error);
            }
        };
        loadData();
    }, []);

    const images = data.slides.map((src, id) => ({ id, src }));

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 4500);
        return () => clearInterval(slideInterval);
    }, [images.length]);

    const renderTableFromHTML = (html: string) => {
        if (!html) {
            return (
                <div className="text-center py-8 text-gray-500">
                    Таблица будет доступна после заполнения через админ-панель
                </div>
            );
        }
        return (
            <div 
                className="table-container"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    };

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                    <Waves className="w-10 h-10 mr-4 text-blue-500" />
                    Плавательный бассейн ТТЖТ
                </h1>
                <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">Плавайте с удовольствием и пользой для здоровья!</p>

                <div className="space-y-12">

                    <section className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-8 shadow-sm">
                        {/* Добавлен класс rich-text-content */}
                        <div 
                            className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto prose prose-lg rich-text-content"
                            dangerouslySetInnerHTML={{ __html: data.description }}
                        />
                    </section>

                    {/* --- Карусель --- */}
                    <section className="relative max-w-5xl mx-auto group">
                        <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                {images.map((image) => (
                                    <div key={image.id} className="w-full flex-shrink-0">
                                        <img src={image.src} alt={`Бассейн ${image.id + 1}`} className="w-full h-[60vh] object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={prevSlide} className="absolute left-[-15px] md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                            <ChevronLeft className="w-6 h-6 text-primary" />
                        </button>
                        <button onClick={nextSlide} className="absolute right-[-15px] md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                            <ChevronRight className="w-6 h-6 text-primary" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {images.map((_, index) => (
                                <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${ index === currentSlide ? 'bg-white scale-125 shadow-md' : 'bg-white/50 hover:bg-white/80' }`} />
                            ))}
                        </div>
                    </section>

                    <section className="space-y-8">
                        <Card className="border-green-300 shadow-sm overflow-hidden"> 
                            <CardHeader className="bg-green-100 p-4 border-b border-green-300"> 
                                <CardTitle className="text-xl font-semibold text-green-800 text-center">Групповые занятия для детей с 7 лет</CardTitle>
                                <p className="text-sm text-green-700 text-center">Дополнительные общеобразовательные программы</p>
                            </CardHeader>
                            <CardContent className="p-0">
                                {renderTableFromHTML(data.table1_html)}
                            </CardContent>
                        </Card>

                        <Card className="border-blue-300 shadow-sm overflow-hidden"> 
                            <CardHeader className="bg-blue-100 p-4 border-b border-blue-300"> 
                                <CardTitle className="text-xl font-semibold text-blue-800 text-center">Для взрослых и детей старше 14 лет</CardTitle>
                                <p className="text-sm text-blue-700 text-center">Оказание услуг по плаванию с 01.01.2025 г.</p>
                            </CardHeader>
                            <CardContent className="p-0">
                                {renderTableFromHTML(data.table2_html)}
                            </CardContent>
                        </Card>

                        <Card className="border-purple-300 shadow-sm overflow-hidden"> 
                            <CardHeader className="bg-purple-100 p-4 border-b border-purple-300"> 
                                <CardTitle className="text-xl font-semibold text-purple-800 text-center">Для работников и студентов ТТЖТ</CardTitle>
                                <p className="text-sm text-purple-700 text-center">Оказание услуг по плаванию с 01.01.2025 г.</p>
                            </CardHeader>
                            <CardContent className="p-0">
                                {renderTableFromHTML(data.table3_html)}
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
                            <FileText className="w-7 h-7 mr-3 text-gray-500"/> Документы для скачивания
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.documents.map((doc, index) => (
                                <a
                                    key={index}
                                    href={doc.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary/50 transition-all duration-300 group transform hover:scale-[1.01] shadow-sm hover:shadow-md"
                                >
                                    <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary mr-3 flex-shrink-0 transition-colors" />
                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">{doc.title}</span>
                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary ml-auto flex-shrink-0 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </section>

                    <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
                            <Users className="w-7 h-7 mr-3 text-gray-500"/> Наши инструкторы и контакты
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Инструкторы по плаванию:</h3>
                                <ul className="space-y-3 text-gray-600">
                                    {data.instructors.map((instructor, index) => (
                                        <li key={index} className="flex items-start">
                                            <Waves className="w-5 h-5 mr-3 mt-1 text-blue-400 flex-shrink-0"/>
                                            <div>
                                                <strong>{instructor.name}</strong><br/>
                                                <span className="text-sm">({instructor.position})</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center shadow-inner">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Узнать подробности:</h3>
                                <p className="flex items-center justify-center text-gray-800 text-lg mb-2">
                                    <Phone className="w-5 h-5 mr-2 text-primary"/>
                                    <a href={`tel:${data.contact_phone.replace(/\D/g,'')}`} className="hover:text-primary transition-colors">{data.contact_phone}</a>, доб. 134
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Заведующая бассейном: {data.contact_name}
                                </p>
                                <p className="text-xs text-gray-400 mt-4">Реклама</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </MainLayout>
    );
};

export default SwimmingPool;