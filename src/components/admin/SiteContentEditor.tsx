import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Save, Upload, Edit, FileText } from 'lucide-react';
import { settingsApi } from '@/api/settings';
import { filesApi } from '@/api/files';
import { BASE_URL } from '@/api/config';
import RichTextEditor from './RichTextEditor';

// Импорты картинок
import image1930 from '@/assets/pictures/ttgt_30.jpg'; 
import imageWar from '@/assets/pictures/ttgt_95.jpg';
import imageModern from '@/assets/pictures/Zavyalov.png';
import adm_1 from '@/assets/pictures/Zavyalov.png';
import adm_2 from '@/assets/pictures/adm_2.png';
import adm_3 from '@/assets/pictures/adm_3.png';
import adm_4 from '@/assets/pictures/adm_4.png';
import adm_5 from '@/assets/pictures/adm_5.png';
import adm_6 from '@/assets/pictures/adm_6.png';
import adm_7 from '@/assets/pictures/adm_7.png';
import ob from '@/assets/pictures/ob.png';
import vag from '@/assets/pictures/vag.png';
import pm from '@/assets/pictures/pm.png';
import ad from '@/assets/pictures/ad.png';
import ct from '@/assets/pictures/ctpoitel.png';
import person from '@/assets/pictures/YArceva.png';
import akimov from '@/assets/pictures/akimov1.png';
import perevozchikov from '@/assets/pictures/perevozchikov.png';
import tcykanova from '@/assets/pictures/tcykanova.png';
import gamachek from '@/assets/pictures/gamachek.png';
import VNOKO from '@/assets/file/Pol_VNOKO_31.08.2021.pdf';

import lib_1 from '@/assets/pictures/phoca_thumb_l_276.jfif';
import lib_2 from '@/assets/pictures/phoca_thumb_l_277.jfif';
import lib_3 from '@/assets/pictures/phoca_thumb_l_278.jfif';
import lib_4 from '@/assets/pictures/phoca_thumb_l_279.jfif';
import lib_5 from '@/assets/pictures/phoca_thumb_l_280.jfif';
import lib_6 from '@/assets/pictures/phoca_thumb_l_281.jfif';
import lib_7 from '@/assets/pictures/phoca_thumb_l_282.jfif';
import lib_8 from '@/assets/pictures/phoca_thumb_l_283.jfif';
import lib_9 from '@/assets/pictures/phoca_thumb_l_284.jfif';

import img1 from '@/assets/pictures/home/phoca_thumb_l_285.jpg';
import img2 from '@/assets/pictures/home/phoca_thumb_l_287.jpg';
import img3 from '@/assets/pictures/home/phoca_thumb_l_289.jpg';
import img4 from '@/assets/pictures/home/phoca_thumb_l_292.jpg';
import img5 from '@/assets/pictures/home/phoca_thumb_l_297.jpg';
import img6 from '@/assets/pictures/home/phoca_thumb_l_298.jpg';
import img7 from '@/assets/pictures/home/phoca_thumb_l_8499.jpg';
import img8 from '@/assets/pictures/home/phoca_thumb_l_8500.jpg';

import avto1 from '@/assets/pictures/School.jpg';
import avto2 from '@/assets/pictures/phoca_thumb_l_5237.jpg';

import dover from '@/assets/pictures/tel_dov_deti.jpg';
import pam from '@/assets/pictures/2.jpg';

import acr_1 from '@/assets/pictures/acr_1.jpg';
import acr_2 from '@/assets/pictures/acr_2.jpg';
import acr_3 from '@/assets/pictures/acr_3.jpg';
import qr1 from '@/assets/pictures/qr_akkr_2024.jpg';

import lc_1 from '@/assets/pictures/Licen1.jpg';
import lc_2 from '@/assets/pictures/Licen2.jpg';
import lc_3 from '@/assets/pictures/ttzht_prilog1.jpg';
import lc_4 from '@/assets/pictures/ttzht_prilog2.jpg';
import qr_lc from '@/assets/pictures/qr_lic_2024.jpg';

import sw_1 from '@/assets/pictures/phoca_thumb_l_321.jpg';
import sw_2 from '@/assets/pictures/phoca_thumb_l_322.jpg';
import sw_3 from '@/assets/pictures/phoca_thumb_l_323.jpg';
import sw_4 from '@/assets/pictures/phoca_thumb_l_324.jpg';
import sw_5 from '@/assets/pictures/phoca_thumb_l_325.jpg';
import sw_6 from '@/assets/pictures/phoca_thumb_l_326.jpg';

import eat_1 from '@/assets/pictures/phoca_thumb_l_312.jpg';
import eat_2 from '@/assets/pictures/phoca_thumb_l_313.jpg';
import eat_3 from '@/assets/pictures/phoca_thumb_l_314.jpg';
import eat_4 from '@/assets/pictures/phoca_thumb_l_315.jpg';
import eat_5 from '@/assets/pictures/phoca_thumb_l_316.jfif';
import eat_6 from '@/assets/pictures/phoca_thumb_l_319.jpg';
import eat_7 from '@/assets/pictures/phoca_thumb_l_320.jpg';

import workshop1 from '@/assets/pictures/phoca_thumb_l_442.jpg';
import workshop2 from '@/assets/pictures/phoca_thumb_l_443.jpg';
import workshop3 from '@/assets/pictures/phoca_thumb_l_444.jpg';
import workshop4 from '@/assets/pictures/phoca_thumb_l_445.jpg';
import workshop5 from '@/assets/pictures/phoca_thumb_l_446.jpg';
import workshop6 from '@/assets/pictures/phoca_thumb_l_447.jpg';
import workshop7 from '@/assets/pictures/phoca_thumb_l_448.jpg';
import workshop8 from '@/assets/pictures/phoca_thumb_l_449.jpg';
import workshop9 from '@/assets/pictures/phoca_thumb_l_450.jpg';
import workshop10 from '@/assets/pictures/phoca_thumb_l_451.jpg';

// --- ДЕФОЛТНЫЕ ДАННЫЕ ---

const DEFAULT_HISTORY = [
    {
        year: "1930",
        title: "Основание техникума",
        imageUrl: image1930,
        imageAlt: "Историческое фото 1930",
        imageOnLeft: true,
        content: `<p>Открытие техникума в городе Тихорецке состоялось в октябре 1930 года. Учебное заведение получило название - Тихорецкий механический техникум Азово-Черноморской железной дороги дирекции Народного комиссариата путей сообщения СССР. Начальником был назначен Макашин В.П.</p><p>В 30-е годы техникум располагался в двухэтажном здании, на углу улиц Красноармейской и Угольной, в одном здании шли занятия, в другом - было общежитие для иногородних студентов. Обучение проводилось по двум специальностям: «Паровозы и паровозное хозяйство», «Вагоны и вагонное хозяйство».</p>`
    },
    {
        year: "1934",
        title: "Военные годы и Восстановление",
        imageUrl: "",
        imageAlt: "",
        imageOnLeft: false,
        content: `<p>В декабре 1934 году учебное заведение возглавил опытный производственник Сакварелидзе М.А. Техникум успешно развивался, но грянула Великая Отечественная война. С сентября 1941 года Тихорецк подвергался постоянным вражеским налетам. В начале войны почти пятая часть тихоречан ушла на фронт.</p><p>С 5 августа 1942 года по 30 января 1943 года город Тихорецк подвергся оккупации. Техникум был эвакуирован в Закавказье, затем в Ставрополь. Студенты, выпускники и сотрудники техникума уходили на фронт в числе первых.</p><p>В 1947 году техникум под руководством Артеменко А.Г. был возвращён в город Тихорецк и продолжил свою деятельность в здании школы № 35.</p>`
    },
    {
        year: "70-е",
        title: "Рост и Развитие",
        imageUrl: imageWar,
        imageAlt: "Современный вид",
        imageOnLeft: true,
        content: `<p>С годами расширялась и укреплялась учебно-лабораторная база техникума. В 70-е годы XX века Северо-Кавказская железная дорога выделила средства на пристройку к учебному корпусу. В 80-е гг. XX в. было построено пятиэтажное здание общежития на 360 мест.</p><p>В начале ХХ века под руководством директора Арефьева В.М. проведен капитальный ремонт 1-го и 2-го учебных корпусов, открыт 3-й корпус, 2-е общежитие, учебный полигон железнодорожных машин.</p>`
    },
    {
        year: "2025",
        title: "Новая эра: Инновации и Лидерство",
        imageUrl: imageModern,
        imageAlt: "Завьялов Андрей Александрович",
        imageOnLeft: false,
        content: `<p>С июня 2025 года ТТЖТ-филиал РГУПС возглавил <strong>Андрей Александрович Завьялов</strong>, кандидат философских наук. Инновационная деятельность педагогического коллектива направлена на повышение качества состава и создание современной базы.</p><p>Это позволяет техникуму ежегодно осуществлять обучение по 11 лицензированным специальностям.</p>`
    }
];

const DEFAULT_HISTORY_ACHIEVEMENTS = {
    achievements_text: "По результатам рейтинговой оценки деятельности филиалов и структурных подразделений среднего профессионального образования государственных университетов путей сообщения Росжелдора более 10 лет ТТЖТ-филиал РГУПС занимает лидирующие места, 2023 и 2024 год – первое место среди образовательных организаций железнодорожного транспорта России.\n\nНа базе техникума ежегодно проходит большое количество мероприятий... В конференциях принимают участие студенты техникумов, колледжей и университетов из городов Беларуси, Казахстана и России.\n\nС 2014 года в техникуме формируются студенческие трудовые отряды, которые становятся победителями в ежегодном краевом конкурсе среди студенческих трудовых отрядов.\n\nВот уже 95 лет Тихорецкий техникум железнодорожного транспорта – филиал ФГБОУ ВО РГУПС выпускает высококлассных специалистов. Количество выпускников с момента основания ТТЖТ-филиала РГУПС по программам СПО – свыше 26 000 человек, по программам дополнительного профессионального обучения более 30 000 человек. И славная история техникума продолжается!"
};

const DEFAULT_ADMINISTRATION = [
    { id: 1, name: 'Завьялов Андрей Александрович', position: 'Директор техникума', phone: '6-20-03', email: 'director@ttgt.org', schedule: 'ежедневно четверг 14.00 - 15.00 час.', photo: adm_1 },
    { id: 2, name: 'Штикова Наталья Юрьевна', position: 'Зам. директора техникума по УР:', phone: '6-20-03 доб.112', email: 'zamus@ttgt.org', schedule: 'ежедневно среда 14.00 - 15.00 час.', photo: adm_2 },
    { id: 3, name: 'Жестеров Сергей Валентинович', position: 'Зам. директора техникума по УПР:', phone: '6-20-03 доб.132', email: 'zamupr@ttgt.org', schedule: 'ежедневно среда 14.00 - 15.00 час.', photo: adm_3 },
    { id: 4, name: 'Ярошевская Ольга Николаевна', position: 'Зам.директора техникума по ВР:', phone: '6-20-03 доб.127', email: 'zamuvr@ttgt.org', schedule: 'ежедневно пятница 14.00 - 15.00 час.', photo: adm_4 },
    { id: 5, name: 'Лисиченко Геннадий Юрьевич', position: 'Зам. директора по информатизации', phone: '6-20-03 доб.118', email: 'lic@ttgt.org', schedule: '-', photo: adm_5 },
    { id: 6, name: 'Коробейникова Ольга Романовна', position: 'Главный бухгалтер', phone: '6-20-03 доб.112', email: 'buh@ttgt.org', schedule: '-', photo: adm_6 },
    { id: 7, name: 'Чикида Иван Иванович', position: 'Зам. директора по АХЧ:', phone: '6-20-03 доб.117', email: 'axch@ttgt.org', schedule: '-', photo: adm_7 }
];

const DEFAULT_DEPARTMENTS = [
    {
        id: 1, name: 'Отделение технической эксплуатации подвижного состава ж/д',
        iconName: 'TrainFront', color: 'blue',
        specialties: ['Техническая эксплуатация подвижного состава железных дорог (электровозы, тепловозы)', 'Техническая эксплуатация подвижного состава железных дорог (вагоны)'],
        head: 'Ярцева О.Б',
        description: `<p><strong>Специальности:</strong></p><ul><li>Техническая эксплуатация подвижного состава железных дорог (электровозы, тепловозы);</li><li>Техническая эксплуатация подвижного состава железных дорог (вагоны).</li></ul><p>Отделение существует со дня образования техникума, с 1930 года. В разные годы имело названия: «Вагоны и вагонное хозяйство», «Паровозы и паровозное хозяйство», «Изотермический подвижной состав и холодильное хозяйство». Сегодня – это отделение 23.02.06 Технической эксплуатации подвижного состава железных дорог.</p><p>В настоящее время обучение специалистов ведется по двум направлениям «Локомотивы» и «Вагоны». Студенты получают знания и навыки в области организации производственных работ, технического обслуживания и эксплуатации подвижного состава железных дорог. Стать хорошим специалистом помогают опытные преподаватели, а также учебно-лабораторная база техникума.</p><p><strong>Возглавляет отделение Ярцева Ольга Борисовна.</strong></p>`,
        departmentImage: vag, headPhoto: person, videoUrl: 'https://rutube.ru/video/98338d34561bd75e1d0504ab9a2e2808/'
    },
    {
        id: 2, name: 'Отделение электромеханики',
        iconName: 'Bolt', color: 'yellow',
        specialties: ['Техническая эксплуатация ПТ, строительных, дорожных машин и оборудования', 'Сварочное производство', 'Электроснабжение'],
        head: 'Акимов Р.С',
        description: `<p><strong>Специальности:</strong></p><ul><li>Техническая эксплуатация подъемно - транспортных, строительных, дорожных машин и оборудования (по отраслям);</li><li>Сварочное производство;</li><li>Электроснабжение.</li></ul><p>Специальность – Путевые и строительные машины железнодорожного транспорта – так она называлась, одна из самых старых в техникуме, открыта в 1955 году. Выпущено более 3500 специалистов среднего руководящего состава.</p><p>В связи с большой потребностью специалистов на предприятиях ОАО «РЖД» в 2006 году были открыты специальности Электроснабжение и Сварочное производство.</p><p><strong>Возглавляет отделение выпускник техникума – Акимов Роман Сергеевич.</strong></p>`,
        departmentImage: pm, headPhoto: akimov, videoUrl: 'https://rutube.ru/video/4f5729f0f402d2c74b6c63c9233a0b82/'
    },
    {
        id: 3, name: 'Отделение автоматики и телемеханики',
        iconName: 'Cpu', color: 'green',
        specialties: ['Автоматика и телемеханика на транспорте (железнодорожном транспорте)'],
        head: 'Перевозчиков А.А',
        description: `<p><strong>Специальность:</strong> Автоматика и телемеханика на транспорте (железнодорожном транспорте)</p><p>Отделение открыто в 1961 году. За время существования отделения подготовлено более 4000 специалистов. Выпускники отделения работают на предприятиях железнодорожного транспорта, в организациях связи и других отраслях народного хозяйства.</p><p>Студенты отделения изучают современные системы автоматики и телемеханики, микропроцессорную технику, системы связи и передачи данных. Практические навыки отрабатываются в современных лабораториях, оснащенных новейшим оборудованием.</p><p><strong>Возглавляет отделение Перевозчиков Александр Анатольевич.</strong></p>`,
        departmentImage: ct, headPhoto: perevozchikov, videoUrl: 'https://rutube.ru/video/example3/'
    },
    {
        id: 4, name: 'Отделение организации перевозок и управления на транспорте',
        iconName: 'Map', color: 'orange',
        specialties: ['Организация перевозок и управление на транспорте (железнодорожном транспорте)'],
        head: 'Цыканова Т.В',
        description: `<p><strong>Специальность:</strong> Организация перевозок и управление на транспорте (железнодорожном транспорте)</p><p>Отделение осуществляет подготовку специалистов по организации перевозочного процесса с 1965 года. За это время подготовлено более 3000 специалистов, которые успешно работают на железнодорожном транспорте и в логистических компаниях.</p><p>Студенты изучают современные технологии управления перевозками, логистику, экономику транспорта, информационные системы в управлении перевозками. Особое внимание уделяется практической подготовке на предприятиях железнодорожного транспорта.</p><p><strong>Возглавляет отделение Цыканова Татьяна Владимировна.</strong></p>`,
        departmentImage: ob, headPhoto: tcykanova, videoUrl: 'https://rutube.ru/video/example4/'
    },
    {
        id: 5, name: 'Отделение строительства железных дорог',
        iconName: 'Hammer', color: 'purple',
        specialties: ['Компьютерные системы и комплексы','ехническая эксплуатация транспортного радиоэлектронного оборудования (по видам транспорта)','Экономика и бухгалтерский учет (по отраслям)'],
        head: 'Гамачек С.В',
        description: `<p><strong>Специальность:</strong> Строительство железных дорог, путь и путевое хозяйство</p><p>Отделение было открыто в 1972 году и за время своего существования подготовило более 2500 специалистов. Выпускники отделения работают в путевых хозяйствах железных дорог, строительных организациях и проектных институтах.</p><p>Обучение включает изучение современных технологий строительства и содержания железнодорожного пути, путевых машин и механизмов, организации путевого хозяйства. Студенты проходят практику на современных путевых машинах и в лабораториях, оснащенных современным оборудованием.</p><p><strong>Возглавляет отделение Гамачек Сергей Владимирович.</strong></p>`,
        departmentImage: ad, headPhoto: gamachek, videoUrl: 'https://rutube.ru/video/example5/'
    }
];

const DEFAULT_WORKSHOPS = {
    practice_text: 'График учебной практики 2025-2026',
    practice_file_url: 'https://ttgt.org/images/files/grafik_UPM_25_26.pdf',
    description: 'Учебная база ТТЖТ – филиала РГУПС для формирования практических умений.',
    features_text: 'Производственная деятельность зависит от базы. Все цеха оснащены современным оборудованием.',
    workshop_list_1: [
        'Слесарные. Слесарно-механические. Слесарно-монтажные',
        'Механообрабатывающие. Токарные',
        'Цифровая передача информации',
        'Сварочные. Сварочная',
        'Газосварочные',
        'Электросварочные'
    ],
    workshop_list_2: [
        'Технические средства информации дистанционных обучающих технологий...',
        'Каменных работ...',
        'Лаборатория неразрушающего контроля...',
        'Электромонтажные...'
    ],
    slides: [workshop1, workshop2, workshop3, workshop4, workshop5, workshop6, workshop7, workshop8, workshop9, workshop10]
};

const DEFAULT_NOKO = [
    { title: 'Положение о проведении внутренней независимой оценки качества образования в ТТЖТ - филиале РГУПС', url: VNOKO },
    { title: 'Отчет о результатах самообследования', url: 'https://rgups.ru/site/assets/files/90788/othet_o_samoobsledovanii_26_03_2024.pdf' }
];

// Новые дефолтные данные
const DEFAULT_LIBRARY = {
    slides: [lib_1, lib_2, lib_3, lib_4, lib_5, lib_6, lib_7, lib_8, lib_9],
    work_time: "ежедневно с 8.00 до 17.00\nсуббота с 8.00 до 13.00\nвыходной – воскресенье\nСанитарный день – последний рабочий день каждого месяца.",
    staff_info: "Библиотекарь – Бурлакова Екатерина Валерьевна\nЗаведующая библиотекой: Костромина Елена Александровна\nКурирует работу библиотеки: Шитикова Наталья Юрьевна",
    description: "Библиотека является структурным подразделением ТТЖТ – филиала РГУПС, располагающим организованным библиотечным фондом изданий для предоставления их во временное пользование обучающимся, педагогическим, другим работникам техникума и обеспечения учебного, учебно-методического, научно-исследовательского, воспитательного, административного процессов в техникуме. Библиотека является центром распространения знаний, духовного и интеллектуального общения, культуры."
};

const DEFAULT_SURVEYS = [
    { id: 1, title: 'Анкета по оценке значимого отношения к экстремизму в детско-подростковой и молодёжной среде', url: 'https://forms.yandex.ru/u/67e62c0684227c4fd4332654/' },
    { id: 2, title: 'Анкета для опроса обучающихся об удовлетворенности качеством условий осуществления образовательной деятельности филиала РГУПС по образовательным программам среднего профессионального образования', url: 'https://forms.yandex.ru/u/67a9e062f47e737afdfdc05f/' },
    { id: 3, title: 'Анкета для опроса педагогических работников (преподавателей, мастеров производственного обучения) для выявления удовлетворенности качеством оказания образовательных услуг, условиями ведения образовательной деятельности в филиале ФГБОУ ВО РГУПС', url: 'https://forms.yandex.ru/u/67a9e188e010db7ba81208f5/' },
    { id: 4, title: 'Анкета для опроса работодателей об удовлетворенности качеством условий осуществления образовательной деятельности филиала РГУПС по образовательным программам среднего профессионального образования', url: 'https://forms.yandex.ru/u/67a9e22c02848f7c2f234803/' }
];

const DEFAULT_DORMITORY = {
    slides: [img1, img2, img3, img4, img5, img6, img7, img8],
    conditions_text: "Студенческое общежитие нашего техникума признано одним из лучших среди техникумов Краснодарского края. В общежитии 396 мест для иногородних студентов дневного обучения.\n\nСтуденты проживают в 2-х и 3-х местных комнатах, укомплектованы необходимой мебелью: кроватями, прикроватными тумбочками , шкафами для хранения одежды, пеналами для хранения посуды и продуктов ,столами, стульями, а так же мягким инвентарём (матрацами, одеялами, подушками и постельным бельём). На каждом этаже располагается по две кухни, душевые и туалетные комнаты, гладильная. Организована работа прачечной, в течении дня (с 9:00час. до 17 час.), имеется изолятор.",
    security_text: "Согласно Закону Краснодарского края №1539-КЗ «О мерах по профилактике безнадзорности и правонарушений несовершеннолетних в Краснодарском крае» студенты должны находиться в общежитии в 22:00 час. В случаи необходимости выезда из общежития, студент должен согласовать свой отъезд с администрацией техникума и зарегистрироваться в журнале отъезда.\n\nДля обеспечения личной и общественной безопасности проживающих в общежитии студентов действует пропускная система. На входе в общежитие постоянно находится дежурный по общежитию. Пост дежурного по общежитию обеспечен телефонной и радиосвязью, имеется кнопка экстренного вызова, видеонаблюдение всех этажей и наружное наблюдение. Установлена современная противопожарная сигнализация.",
    staff_text: "Койко-место в общежитии предоставляется на основании заявления студента. В первую очередь обеспечивает общежитием социально-незащищённые студенты: учащиеся из числа детей-сирот и детей, оставшихся без попечения родителей, неполных, малообеспеченных, многодетных семей и студенты, обучающиеся по целевым направлениям. В общежитии есть wi-fi.\n\nКруглосуточно со студентами работают воспитатели.",
    accessibility_text: "Здания общежитий ТТЖТ - филиала РГУПС оборудованы элементами доступа для инвалидов, среди которых: наличие кнопки вызова персонала, установленной на входе в общежитие; наличие широких дверных проемов, двери с механизмом доводчика, комнаты для проживания на первом этаже.",
    contact_phone: "8 (86196) 6-20-03 доб. 129",
    contact_name: "Алферова Галина Васильевна"
};

const DEFAULT_DRIVING_SCHOOL = {
    slides: [avto1, avto2],
    price: "60 000 ₽",
    description: "Автошкола по подготовке водителей транспортных средств категории «В» с механической и автоматической трансмиссией открыта на отделении дополнительного профессионального образования ТТЖТ - филиала РГУПС и работает на рынке образовательных услуг с октября 2010 года.",
    goals_text: "Основная цель работы автошколы – обучение основам безопасного управления, практическая отработка наиболее важных элементов управления автомобилем, преодоление психологического барьера непонимания между действиями новичка-водителя и поведением автомобиля на дороге.",
    cars_list: ["Шевролет-Авео", "Рено Логан", "Педали дополнительного управления", "Камеры видеонаблюдения", "Современное техническое оснащение"],
    advantages_list: [
        "Качественная подготовка водителей", "Поэтапная оплата", "Вечернее время теории",
        "Индивидуальный график вождения", "Обучение в выходные", "Широкий выбор авто",
        "Свидетельство гос. образца", "Сдача в ГИБДД с нами", "Сопровождение до прав",
        "Профессиональные инструкторы"
    ],
    contacts_text: "Адрес: ТТЖТ – филиал РГУПС, ул. Красноармейская, 57, каб. 116, 106а\nТелефон: 8(86196) 6-20-03, доб. 125, 135\nМобильный: 89884728160\nЗаведующий отделом: Токарев Максим Викторович",
    docs_list: ["Паспорт", "Действующая мед. справка", "Фото 3×4 см (1 шт.)"]
};

const DEFAULT_EDUCATIONAL_WORK = {
    slides: [dover, pam],
    title: "ОПЕРАТИВНО – ПРОФИЛАКТИЧЕСКОЕ МЕРОПРИЯТИЕ «ЗАЩИТА» С 1 ПО 10 ИЮНЯ 2024 ГОДА В ТТЖТ – ФИЛИАЛЕ РГУПС",
    content: "С 1 по 10 июня 2024 года в ТТЖТ – филиале РГУПС проводится оперативно-профилактическое мероприятие «Защита».\n\nЦель: выявление и пресечение преступных посягательств в отношении детей, установление лиц, жестоко обращающихся с ними, совершающих насильственные действия, вовлекающих подростков в совершение антиобщественных действий, а также родителей, законных представителей, иных членов их семей, нарушающих права и законные интересы несовершеннолетних.",
    documents: [
        { title: "Закон на защите детства", file: "#" },
        { title: "Детство без насилия и жестокости (консультация для родителей)", file: "#" },
        { title: "Консультативная беседа с родителями на тему: 'Воспитание без насилия'", file: "#" },
        { title: "Памятка для родителей (заповеди)", file: "#" },
        { title: "Предупреждение преступлений в отношении детей, защита их жизни и здоровья...", file: "#" },
        { title: "Принципы семейного благополучия. Основные параметры неправильного воспитания", file: "#" },
        { title: "Поведение родителей в конфликте с подростком (рекомендации)", file: "#" }
    ]
};

const DEFAULT_ACCREDITATION = {
    docs: [acr_1, acr_2, acr_3],
    qr_code: qr1,
    description: "Государственная аккредитация образовательной деятельности проводится по основным образовательным программам, реализуемым в соответствии с федеральными государственными образовательными стандартами.\n\nСвидетельство о государственной аккредитации подтверждает соответствие качества подготовки обучающихся и выпускников требованиям федеральных государственных образовательных стандартов."
};

const DEFAULT_LICENSE = {
    docs: [lc_1, lc_2, lc_3, lc_4],
    qr_code: qr_lc,
    description: "Лицензия на осуществление образовательной деятельности выдается лицензирующим органом на основании заявления соискателя лицензии и прилагаемых к нему документов.\n\nЛицензия подтверждает право образовательной организации на ведение образовательной деятельности по указанным в ней образовательным программам."
};

const DEFAULT_SWIMMING_POOL = {
    slides: [sw_1, sw_2, sw_3, sw_4, sw_5, sw_6],
    description: "«Плавать рекомендуется с детства и до глубокой старости.» - Заведующая бассейном Г.А. Лапова\n\nВо время плавания увеличивается объем легких, ускоряется процесс насыщения кислородом организма. Вода обладает массирующим и расслабляющим эффектом, что благотворно влияет на нервную систему. Люди, посещающие бассейн, меньше подвержены нервным расстройствам, бессонницам, реже болеют и дольше живут.\n\nВозможность плавать в любое время года без ограничений по возрасту и состоянию здоровья – вот, что по-настоящему ценно!\n\nПриглашаем всех желающих посетить бассейн Тихорецкого техникума железнодорожного транспорта!",
    table1_html: `<table class="w-full border-collapse border border-gray-300">
        <thead>
            <tr class="bg-green-100">
                <th class="border border-gray-300 p-2 font-semibold text-green-900 text-center">Наименование услуги</th>
                <th class="border border-gray-300 p-2 font-semibold text-green-900 text-center">Количество занятий</th>
                <th class="border border-gray-300 p-2 font-semibold text-green-900 text-center">Стоимость (руб.)</th>
            </tr>
        </thead>
        <tbody>
            <tr><td class="border border-gray-300 p-2 text-center">Обучение спортивному плаванию</td><td class="border border-gray-300 p-2 text-center">4 (1 раз в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">2000</td></tr>
            <tr><td class="border border-gray-300 p-2 text-center">Обучение первичным навыкам плавания</td><td class="border border-gray-300 p-2 text-center">4 (1 раз в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">2000</td></tr>
            <tr><td class="border border-gray-300 p-2 text-center">Обучение спортивному плаванию</td><td class="border border-gray-300 p-2 text-center">8 (2 раза в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">4000</td></tr>
            <tr><td class="border border-gray-300 p-2 text-center">Обучение первичным навыкам плавания</td><td class="border border-gray-300 p-2 text-center">8 (2 раза в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">4000</td></tr>
            <tr><td class="border border-gray-300 p-2 text-center">Обучение спортивному плаванию</td><td class="border border-gray-300 p-2 text-center">12 (3 раза в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">6000</td></tr>
            <tr><td class="border border-gray-300 p-2 text-center">Обучение первичным навыкам плавания</td><td class="border border-gray-300 p-2 text-center">12 (3 раза в неделю)</td><td class="border border-gray-300 p-2 text-center font-medium">6000</td></tr>
        </tbody>
    </table>`,
    table2_html: `<table class="w-full border-collapse border border-gray-300">
        <thead>
            <tr class="bg-blue-100">
                <th class="border border-gray-300 p-2 font-semibold text-blue-900 text-center">Наименование услуги</th>
                <th class="border border-gray-300 p-2 font-semibold text-blue-900 text-center">Количество занятий</th>
                <th class="border border-gray-300 p-2 font-semibold text-blue-900 text-center">Стоимость (руб.)</th>
            </tr>
        </thead>
        <tbody>
            <tr><td class="border border-gray-300 p-2 text-center">Разовое посещение</td><td class="border border-gray-300 p-2 text-center">1</td><td class="border border-gray-300 p-2 text-center font-medium">450</td></tr>
            <tr><td class="border border-gray-300 p-2 text-center">Абонемент</td><td class="border border-gray-300 p-2 text-center">4 в месяц</td><td class="border border-gray-300 p-2 text-center font-medium">1 600</td></tr>
            <tr><td class="border border-gray-300 p-2 text-center">Абонемент</td><td class="border border-gray-300 p-2 text-center">8 в месяц</td><td class="border border-gray-300 p-2 text-center font-medium">3 200</td></tr>
        </tbody>
    </table>`,
    table3_html: `<table class="w-full border-collapse border border-gray-300">
        <thead>
            <tr class="bg-purple-100">
                <th class="border border-gray-300 p-2 font-semibold text-purple-900 text-center">Наименование услуги</th>
                <th class="border border-gray-300 p-2 font-semibold text-purple-900 text-center">Количество занятий</th>
                <th class="border border-gray-300 p-2 font-semibold text-purple-900 text-center">Стоимость (руб.)</th>
            </tr>
        </thead>
        <tbody>
            <tr><td class="border border-gray-300 p-2 text-center">Разовое посещение для работников</td><td class="border border-gray-300 p-2 text-center">1</td><td class="border border-gray-300 p-2 text-center font-medium text-green-600">Бесплатно</td></tr>
            <tr><td class="border border-gray-300 p-2 text-center">Абонемент для работников</td><td class="border border-gray-300 p-2 text-center">2 в неделю</td><td class="border border-gray-300 p-2 text-center font-medium">1600 / месяц</td></tr>
            <tr><td class="border border-gray-300 p-2 text-center">Разовое посещение для студентов (внеурочно)</td><td class="border border-gray-300 p-2 text-center">1</td><td class="border border-gray-300 p-2 text-center font-medium">200</td></tr>
        </tbody>
    </table>`,
    instructors: [
        { name: "Шароглазов Константин Леонидович", position: "призер Чемпионата России на открытой воде, КМС по плаванию" },
        { name: "Фастова Маргарита Витальевна", position: "преподаватель физ. культуры, отличник ГТО" },
        { name: "Бердыч Светлана Александровна", position: "преподаватель физ. культуры, КМС по спорт. ориентированию" },
        { name: "Буров Андрей Викторович", position: "преподаватель физ. культуры, КМС по легкой атлетике, Чемпион России" }
    ],
    contact_phone: "8 (86196) 6-20-03",
    contact_name: "Лапова Г.А.",
    documents: [
        { title: "Приказ 'Об установлении стоимости физкультурно-оздоровительных услуг...' с 01.01.2025 г.", file: "#" },
        { title: "Приказ 'Об установлении стоимости услуг по обучению...' с 06.07.2024 г.", file: "#" },
        { title: "Правила пользования бассейном ТТЖТ - филиала РГУПС", file: "#" },
        { title: "Положение о плавательном бассейне ТТЖТ - филиала РГУПС", file: "#" },
        { title: "Расписание занятий с 01 октября по 31 октября 2025 года", file: "#" }
    ]
};

const DEFAULT_CAFETERIA = {
    slides: [eat_1, eat_2, eat_3, eat_4, eat_5, eat_6, eat_7],
    description: "Правильное питание – основа здоровья, а вкусная еда – залог хорошего настроения. Столовая Тихорецкого техникума железнодорожного транспорта предлагает обеды на выбор посетителей – широкий ассортимент первых горячих блюд, холодных закусок, мясных и рыбных изделий. Аппетитная выпечка порадует каждого, кто наведается в нашу просторную столовую. Меню ежедневно пополняется разнообразными блюдами. Возможность размещения посетителей - 150 посадочных мест.",
    features_text: "Входные двери столовой предусмотрены для инвалидов и лиц с ограниченными возможностями здоровья. Над дверями имеются навесы. В столовой стоит стол для обслуживания инвалидов.",
    work_time: "Мы ждем Вас с 11:00 до 16:00\nКаждый день, кроме субботы и воскресенья.",
    contact_phone: "8 (86196) 6-20-03 доб. 146",
    contact_name: "Филатова Марина Ивановна",
    final_text: "Столовая ТТЖТ – это уютная обстановка, доброжелательное отношение персонала, доступные цены и очень вкусные обеды!"
};

// Новые дефолтные данные для страниц
const DEFAULT_COURSES = {
    items: [
        { 
            id: 1, 
            name: 'Расписание', 
            image: '', 
            modalId: '', 
            url: '',
            modalContent: {
                title: 'Расписание',
                content: '',
                documents: []
            }
        },
        { 
            id: 2, 
            name: 'Документы', 
            image: '', 
            modalId: 'documents', 
            url: '',
            modalContent: {
                title: 'Документы',
                content: '',
                documents: []
            }
        },
        { 
            id: 3, 
            name: 'Объявление', 
            image: '', 
            modalId: 'announcement', 
            url: '',
            modalContent: {
                title: 'Объявление',
                content: '',
                documents: []
            }
        },
        { 
            id: 4, 
            name: 'Дистанционное обучение', 
            image: '', 
            modalId: '', 
            url: 'http://дистанционное24.рф/',
            modalContent: {
                title: 'Дистанционное обучение',
                content: '',
                documents: []
            }
        },
        { 
            id: 5, 
            name: 'Об отделении дополнительного профессионального образования', 
            image: '', 
            modalId: 'about', 
            url: '',
            modalContent: {
                title: 'Об отделении дополнительного профессионального образования',
                content: '',
                documents: []
            }
        },
        { 
            id: 6, 
            name: 'Контакты', 
            image: '', 
            modalId: 'contacts', 
            url: '',
            modalContent: {
                title: 'Контакты',
                content: '',
                documents: []
            }
        },
        { 
            id: 7, 
            name: 'Программы профессионального обучения', 
            image: '', 
            modalId: 'programs', 
            url: '',
            modalContent: {
                title: 'Программы профессионального обучения',
                content: '',
                documents: []
            }
        },
        { 
            id: 8, 
            name: 'Стоимость услуг', 
            image: '', 
            modalId: 'cost', 
            url: '',
            modalContent: {
                title: 'Стоимость услуг',
                content: '',
                documents: []
            }
        },
        { 
            id: 9, 
            name: 'Заявление', 
            image: '', 
            modalId: 'application', 
            url: '',
            modalContent: {
                title: 'Заявление',
                content: '',
                documents: []
            }
        },
        { 
            id: 10, 
            name: 'Договор на обучение', 
            image: '', 
            modalId: 'contract', 
            url: '',
            modalContent: {
                title: 'Договор на обучение',
                content: '',
                documents: []
            }
        }
    ]
};

const DEFAULT_SELECTION_COMMITTEE = {
    sections: [
        {
            id: 1,
            title: 'СПЕЦИАЛЬНЫЕ ТЕЛЕФОННЫЕ ЛИНИИ ДЛЯ ОБРАЩЕНИЯ, СВЯЗАННЫЕ С ПРИЁМОМ НА ОБУЧЕНИЕ',
            content: `<p>Специальная телефонная линия для ответов на обращения, связанные с приёмом в ТТЖТ - филиал РГУПС:</p>
<p><strong>Приёмная комиссия:</strong></p>
<ul>
<li>8(86196) 6-20-03, доб. 150, 8 (918) 682-52-97 г. Тихорецк.</li>
<li>8(863) 255-31-61, 245-37-13, г. Ростов-на-Дону</li>
</ul>
<p>Вопросы, касающиеся приёма в ТТЖТ - филиал РГУПС можно также отправить на адрес электронной почты: <a href="mailto:abiturient@ttgt.org">abiturient@ttgt.org</a></p>
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
<li>Личный кабинет абитуриента на сайте техникуме <a href="http://www.ttgt.org">http://www.ttgt.org</a>;</li>
<li>С использованием функционала федеральной государственной информационной системы «Единый портал государственных и муниципальных услуг (функций)»</li>
</ol>
<p>Направляемые документы одним из перечисленных способов, принимаются не позднее сроков, установленных в Правила приёма в 2025 году.</p>`
        }
    ]
};

const DEFAULT_CORRUPTION_REPORT = {
    documents: [
        { title: 'План мероприятий ТТЖТ - филиала РГУПС по противодействию коррупции... на 2024-2025 учебный год', url: '' },
        { title: 'Положение о комиссии по противодействию коррупции ТТЖТ - филиала РГУПС', url: '' },
        { title: 'Приказ "О комиссии по противодействию коррупции и урегулированию конфликта интересов..."', url: '' },
        { title: 'Изменения в приказ "О комиссии по противодействию коррупции..."', url: '' },
        { title: 'Запрет на дарение подарков', url: '' }
    ]
};

export default function SiteContentEditor() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("history");
    const { toast } = useToast();

    // --- States ---
    const [historyData, setHistoryData] = useState<any[]>(DEFAULT_HISTORY);
    const [historyAchievements, setHistoryAchievements] = useState<any>(DEFAULT_HISTORY_ACHIEVEMENTS);
    const [adminData, setAdminData] = useState<any[]>(DEFAULT_ADMINISTRATION);
    const [deptData, setDeptData] = useState<any[]>(DEFAULT_DEPARTMENTS);
    const [workshopsData, setWorkshopsData] = useState<any>(DEFAULT_WORKSHOPS);
    const [nokoData, setNokoData] = useState<any[]>(DEFAULT_NOKO);
    
    // Новые состояния
    const [libraryData, setLibraryData] = useState<any>(DEFAULT_LIBRARY);
    const [surveyData, setSurveyData] = useState<any[]>(DEFAULT_SURVEYS);
    const [dormitoryData, setDormitoryData] = useState<any>(DEFAULT_DORMITORY);
    const [drivingSchoolData, setDrivingSchoolData] = useState<any>(DEFAULT_DRIVING_SCHOOL);
    const [educationalWorkData, setEducationalWorkData] = useState<any>(DEFAULT_EDUCATIONAL_WORK);
    const [accreditationData, setAccreditationData] = useState<any>(DEFAULT_ACCREDITATION);
    const [licenseData, setLicenseData] = useState<any>(DEFAULT_LICENSE);
    const [swimmingPoolData, setSwimmingPoolData] = useState<any>(DEFAULT_SWIMMING_POOL);
    const [cafeteriaData, setCafeteriaData] = useState<any>(DEFAULT_CAFETERIA);

    // Новые состояния для страниц
    const [coursesData, setCoursesData] = useState<any>(DEFAULT_COURSES);
    const [selectionCommitteeData, setSelectionCommitteeData] = useState<any>(DEFAULT_SELECTION_COMMITTEE);
    const [corruptionReportData, setCorruptionReportData] = useState<any>(DEFAULT_CORRUPTION_REPORT);

    // --- Load Data ---
    useEffect(() => {
        loadAllSettings();
    }, []);

const loadAllSettings = async () => {
    setLoading(true);
    try {
        console.log('🔄 Загрузка всех настроек...');
        
        const pageNames = [
            'history_page', 'history_achievements', 'administration_page', 'departments_page', 'workshops_page', 'noko_page',
            'library_page', 'survey_page', 'dormitory_page', 'driving_school_page', 
            'educational_work_page', 'accreditation_page', 'license_page', 'swimming_pool_page', 'cafeteria_page',
            'courses_page', 'selection_committee_page', 'corruption_report_page'
        ];
        
        console.log('📋 Запрашиваемые настройки:', pageNames);
        
        // Запрашиваем все настройки
        const settings = await settingsApi.getSettings(pageNames);

        console.log('📦 Загруженные настройки (после обработки):', settings);
        
        // Если сервер вернул пустой массив - значит настройки не созданы в БД
        if (!settings || settings.length === 0) {
            console.log('ℹ️ Настройки не найдены в БД. Это нормально при первом запуске.');
            console.log('ℹ️ При сохранении через админку настройки будут созданы автоматически.');
            
            // Показываем пользователю, что нужно сохранить данные
            toast({
                title: "Добро пожаловать!",
                description: "Настройки еще не созданы. Сохраните данные через форму ниже, чтобы создать их.",
                variant: "default",
                duration: 5000
            });
            
            // Продолжаем работу - данные будут взяты из дефолтных значений
            // Это нормально, так как настройки создаются при первом сохранении
            
            // Показываем какие настройки доступны для редактирования
            console.log('📝 Доступные для редактирования разделы:');
            pageNames.forEach((name, index) => {
                console.log(`   ${index + 1}. ${name}`);
            });
            
            return;
        }

        // Выводим список найденных настроек
        console.log('✅ Найдено настроек:', settings.length);
        settings.forEach((setting, index) => {
            console.log(`   ${index + 1}. ${setting.name}:`, setting.enabled ? 'включено' : 'выключено');
        });

        // --- Универсальная функция для нормализации значения ---
        const normalizeValue = (value: any) => {
            if (value === null || value === undefined) return null;
            let result = value;

            // Если это строка, пытаемся распарсить как JSON
            if (typeof result === 'string') {
                try {
                    result = JSON.parse(result);
                    // Если после парсинга получилась строка, пробуем еще раз
                    if (typeof result === 'string') {
                        try {
                            result = JSON.parse(result);
                        } catch (e) {
                            // Оставляем как есть
                        }
                    }
                } catch (e) {
                    // Если не парсится, оставляем как строку
                }
            }
            
            return result;
        };

        const getSettingData = (name: string) => {
            const setting = settings.find(s => s.name === name);
            if (!setting) {
                console.log(`ℹ️ Настройка "${name}" не найдена. Будет использовано значение по умолчанию.`);
                return null;
            }
            console.log(`✅ Настройка "${name}" найдена и загружена`);
            return normalizeValue(setting.value);
        };
        
        // Универсальное извлечение массива
        const extractArray = (data: any) => {
            if (!data) return null;
            
            // Если это уже массив
            if (Array.isArray(data)) return data;
            
            // Если это объект с полем items
            if (data.items && Array.isArray(data.items)) return data.items;
            
            // Если это объект с индексами 0,1,2... (преобразованный массив)
            if (typeof data === 'object') {
                const keys = Object.keys(data);
                // Проверяем, все ли ключи числовые
                const allNumericKeys = keys.every(key => !isNaN(Number(key)) && Number.isInteger(Number(key)));
                if (allNumericKeys && keys.length > 0) {
                    return Object.values(data);
                }
                // Если это объект с одним элементом, который может быть массивом
                if (keys.length === 1) {
                    const firstKey = keys[0];
                    const firstValue = data[firstKey];
                    if (Array.isArray(firstValue)) {
                        return firstValue;
                    }
                }
            }
            
            // Если это строка, пытаемся распарсить
            if (typeof data === 'string') {
                try {
                    const parsed = JSON.parse(data);
                    return extractArray(parsed);
                } catch (e) {
                    // Не удалось распарсить
                }
            }
            
            return null;
        }

        // --- ЗАГРУЗКА ДАННЫХ ИЗ БД ---
        // Загружаем только те данные, которые найдены в БД
        
        const historyVal = getSettingData('history_page');
        if (historyVal !== null) {
            const historyArr = extractArray(historyVal);
            if (historyArr) {
                console.log(`✅ История загружена из БД: ${historyArr.length} событий`);
                setHistoryData(historyArr);
            } else {
                console.log('ℹ️ История: данные в БД, но не удалось извлечь массив');
            }
        }

        const achieveVal = getSettingData('history_achievements');
        if (achieveVal !== null) {
            console.log('✅ Достижения загружены из БД');
            setHistoryAchievements(achieveVal);
        }

        const adminVal = getSettingData('administration_page');
        if (adminVal !== null) {
            const adminArr = extractArray(adminVal);
            if (adminArr) {
                console.log(`✅ Администрация загружена из БД: ${adminArr.length} сотрудников`);
                setAdminData(adminArr);
            }
        }

        // --- ОТДЕЛЕНИЯ (DEPARTMENTS) ---
        const deptVal = getSettingData('departments_page');
        if (deptVal !== null) {
            const deptArr = extractArray(deptVal);
            if (deptArr) {
                console.log(`✅ Отделения загружены из БД: ${deptArr.length} отделений`);
                setDeptData(deptArr);
            } else if (deptVal && typeof deptVal === 'object') {
                console.log('✅ Отделения: один объект загружен из БД');
                setDeptData([deptVal] as any);
            }
        }

        // Аналогично для всех остальных страниц...
        const workshopsVal = getSettingData('workshops_page');
        if (workshopsVal !== null) {
            console.log('✅ Мастерские загружены из БД');
            setWorkshopsData(workshopsVal);
        }

        const nokoVal = getSettingData('noko_page');
        if (nokoVal !== null) {
            const nokoArr = extractArray(nokoVal);
            if (nokoArr) {
                console.log(`✅ НОКО загружены из БД: ${nokoArr.length} документов`);
                setNokoData(nokoArr);
            }
        }

        // Новые страницы
        const libVal = getSettingData('library_page');
        if (libVal !== null) {
            console.log('✅ Библиотека загружена из БД');
            setLibraryData(libVal);
        }

        const surveyVal = getSettingData('survey_page');
        if (surveyVal !== null) {
            const surveyArr = extractArray(surveyVal);
            if (surveyArr) {
                console.log(`✅ Опросы загружены из БД: ${surveyArr.length} опросов`);
                setSurveyData(surveyArr);
            }
        }

        const dormVal = getSettingData('dormitory_page');
        if (dormVal !== null) {
            console.log('✅ Общежитие загружено из БД');
            setDormitoryData(dormVal);
        }

        const drivVal = getSettingData('driving_school_page');
        if (drivVal !== null) {
            console.log('✅ Автошкола загружена из БД');
            setDrivingSchoolData(drivVal);
        }

        const eduVal = getSettingData('educational_work_page');
        if (eduVal !== null) {
            console.log('✅ Воспитательная работа загружена из БД');
            setEducationalWorkData(eduVal);
        }

        const accrVal = getSettingData('accreditation_page');
        if (accrVal !== null) {
            console.log('✅ Аккредитация загружена из БД');
            setAccreditationData(accrVal);
        }

        const licVal = getSettingData('license_page');
        if (licVal !== null) {
            console.log('✅ Лицензия загружена из БД');
            setLicenseData(licVal);
        }

        const poolVal = getSettingData('swimming_pool_page');
        if (poolVal !== null) {
            console.log('✅ Бассейн загружен из БД');
            setSwimmingPoolData(poolVal);
        }

        const cafeVal = getSettingData('cafeteria_page');
        if (cafeVal !== null) {
            console.log('✅ Столовая загружена из БД');
            setCafeteriaData(cafeVal);
        }

        const coursesVal = getSettingData('courses_page');
        if (coursesVal !== null) {
            console.log('✅ Курсы загружены из БД');
            setCoursesData(coursesVal);
        }

        const selectVal = getSettingData('selection_committee_page');
        if (selectVal !== null) {
            console.log('✅ Отборочная комиссия загружена из БД');
            setSelectionCommitteeData(selectVal);
        }

        const corruptVal = getSettingData('corruption_report_page');
        if (corruptVal !== null) {
            console.log('✅ Противодействие коррупции загружено из БД');
            setCorruptionReportData(corruptVal);
        }

        console.log('✅ Загрузка настроек завершена');
        console.log('ℹ️ Для настроек, которые не найдены в БД, используются значения по умолчанию');

    } catch (e) {
        console.error("❌ Ошибка при загрузке настроек:", e);
        toast({ 
            title: "Ошибка загрузки", 
            description: "Не удалось загрузить настройки из БД. Используются значения по умолчанию.", 
            variant: "default" 
        });
    } finally {
        setLoading(false);
    }
};

    // --- Handlers ---
const handleUpload = async (file: File) => {
    try {
        const id = await filesApi.upload(file);
        return `${BASE_URL}/files/${id}`;
    } catch (e) {
        toast({ title: "Ошибка загрузки файла", variant: "destructive" });
        return null;
    }
}

 const saveSettings = async (name: string, value: any) => {
    setLoading(true);
    try {
        console.log(`💾 Сохранение настройки "${name}"...`);
        
        // Всегда сохраняем в формате { items: [...] } для массивов и как объект для остальных
        let payload;
        
        // Список ключей, которые ДОЛЖНЫ быть массивами
        const arrayKeys = ['history_page', 'administration_page', 'departments_page', 'noko_page', 'survey_page'];
        
        if (arrayKeys.includes(name)) {
            // Если это массив, оборачиваем. Если уже объект с items, оставляем.
            if (Array.isArray(value)) {
                payload = { items: value };
            } else if (value && value.items) {
                payload = value;
            } else {
                // Fallback
                payload = { items: [] };
            }
        } else {
            payload = value;
        }
        
        console.log(`📤 Отправка данных для "${name}":`, payload);
        
        await settingsApi.savePageSettings(name, payload);
        
        toast({ 
            title: "Сохранено успешно!", 
            description: `Настройки "${name}" сохранены в БД. Теперь они будут загружаться при обновлении страницы.`,
            duration: 3000
        });
        
        // Перезагружаем настройки через 1 секунду
        setTimeout(() => {
            console.log('🔄 Перезагрузка настроек после сохранения...');
            loadAllSettings();
        }, 1000);
        
    } catch (e) {
        console.error(`❌ Ошибка сохранения "${name}":`, e);
        toast({ 
            title: "Ошибка сохранения", 
            description: `Не удалось сохранить "${name}". Проверьте консоль для подробностей.`, 
            variant: "destructive" 
        });
    } finally {
        setLoading(false);
    }
};

    // --- RENDER FUNCTIONS ---
    
    // 1. HISTORY FORM
    const renderHistoryForm = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">События истории</h3>
                <Button onClick={() => setHistoryData([...historyData, { year: '2026', title: '', content: '', imageUrl: '', imageOnLeft: false }])}><Plus className="w-4 h-4 mr-2"/> Добавить событие</Button>
            </div>
            {historyData.map((item, idx) => (
                <Card key={idx}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between">
                            <CardTitle>Событие: {item.year}</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => {
                                const newData = [...historyData]; newData.splice(idx, 1); setHistoryData(newData);
                            }}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Год</Label>
                                <Input value={item.year} onChange={(e) => {
                                    const newData = [...historyData]; newData[idx].year = e.target.value; setHistoryData(newData);
                                }} />
                            </div>
                            <div className="space-y-2">
                                <Label>Заголовок</Label>
                                <Input value={item.title} onChange={(e) => {
                                    const newData = [...historyData]; newData[idx].title = e.target.value; setHistoryData(newData);
                                }} />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Текст</Label>
                            <RichTextEditor 
                                value={item.content} 
                                onChange={(val) => {
                                    const newData = [...historyData]; 
                                    newData[idx].content = val;
                                    setHistoryData(newData);
                                }}
                                placeholder="Введите текст события..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Изображение</Label>
                            <div className="flex items-center gap-4">
                                {item.imageUrl && <img src={item.imageUrl} className="h-16 w-16 object-cover rounded" />}
                                <Input type="file" onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const url = await handleUpload(e.target.files[0]);
                                        if (url) {
                                            const newData = [...historyData]; newData[idx].imageUrl = url; setHistoryData(newData);
                                        }
                                    }
                                }} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id={`left-${idx}`} checked={item.imageOnLeft} onChange={(e) => {
                                const newData = [...historyData]; newData[idx].imageOnLeft = e.target.checked; setHistoryData(newData);
                            }} />
                            <Label htmlFor={`left-${idx}`}>Картинка слева</Label>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Card>
                <CardHeader>
                    <CardTitle>Современность и достижения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Текст достижений</Label>
                        <RichTextEditor 
                            value={historyAchievements.achievements_text} 
                            onChange={(val) => setHistoryAchievements({...historyAchievements, achievements_text: val})}
                            placeholder="Введите текст достижений..."
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button className="flex-1" onClick={() => saveSettings('history_page', historyData)} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Историю
                </Button>
                <Button className="flex-1" onClick={() => saveSettings('history_achievements', historyAchievements)} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Достижения
                </Button>
            </div>
        </div>
    );

    // 2. ADMINISTRATION FORM
    const renderAdminForm = () => (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Сотрудники</h3>
                <Button onClick={() => setAdminData([...adminData, { id: Date.now(), name: '', position: '', phone: '', email: '', schedule: '', photo: '' }])}><Plus className="w-4 h-4 mr-2"/> Добавить сотрудника</Button>
            </div>
            {adminData.map((item, idx) => (
                <Card key={idx}>
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                         <CardTitle>{item.name || 'Сотрудник'}</CardTitle>
                         <Button variant="ghost" size="sm" onClick={() => {
                                const newData = [...adminData]; newData.splice(idx, 1); setAdminData(newData);
                            }}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="ФИО" value={item.name} onChange={(e) => {
                                const newData = [...adminData]; newData[idx].name = e.target.value; setAdminData(newData);
                            }} />
                            <Input placeholder="Должность" value={item.position} onChange={(e) => {
                                const newData = [...adminData]; newData[idx].position = e.target.value; setAdminData(newData);
                            }} />
                            <Input placeholder="Телефон" value={item.phone} onChange={(e) => {
                                const newData = [...adminData]; newData[idx].phone = e.target.value; setAdminData(newData);
                            }} />
                            <Input placeholder="Email" value={item.email} onChange={(e) => {
                                const newData = [...adminData]; newData[idx].email = e.target.value; setAdminData(newData);
                            }} />
                             <Input placeholder="График приема" className="md:col-span-2" value={item.schedule} onChange={(e) => {
                                const newData = [...adminData]; newData[idx].schedule = e.target.value; setAdminData(newData);
                            }} />
                         </div>
                         <div className="space-y-2">
                            <Label>Фото</Label>
                            <div className="flex items-center gap-4">
                                {item.photo && <img src={item.photo} className="h-16 w-16 object-cover rounded" />}
                                <Input type="file" onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const url = await handleUpload(e.target.files[0]);
                                        if (url) {
                                            const newData = [...adminData]; newData[idx].photo = url; setAdminData(newData);
                                        }
                                    }
                                }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button className="w-full" onClick={() => saveSettings('administration_page', adminData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Администрацию
            </Button>
        </div>
    );

    // 3. DEPARTMENTS FORM
    const renderDeptForm = () => (
         <div className="space-y-6">
            {deptData.map((item, idx) => (
                 <Card key={idx}>
                      <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                              {item.name}
                              <Button variant="outline" size="sm" onClick={() => {
                                  const newData = [...deptData];
                                  newData.splice(idx, 1);
                                  setDeptData(newData);
                              }}>
                                  <Trash2 className="w-4 h-4 text-red-500"/>
                              </Button>
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><Label>Название</Label><Input value={item.name} onChange={(e) => { const n = [...deptData]; n[idx].name = e.target.value; setDeptData(n); }} /></div>
                              <div><Label>Заведующий</Label><Input value={item.head} onChange={(e) => { const n = [...deptData]; n[idx].head = e.target.value; setDeptData(n); }} /></div>
                          </div>
                          <div><Label>Ссылка на Визитку</Label><Input value={item.videoUrl} onChange={(e) => { const n = [...deptData]; n[idx].videoUrl = e.target.value; setDeptData(n); }} /></div>
                          
                          <div className="space-y-2">
                              <Label>Специальности (каждая с новой строки)</Label>
                              <textarea 
                                  value={item.specialties.join('\n')}
                                  onChange={(e) => {
                                      const n = [...deptData];
                                      n[idx].specialties = e.target.value.split('\n').filter(s => s.trim() !== '');
                                      setDeptData(n);
                                  }}
                                  className="w-full min-h-[100px] p-2 border rounded-md"
                                  placeholder="Каждая специальность с новой строки..."
                              />
                          </div>
                          
                          <div className="space-y-2">
                              <Label>Описание и Специальности</Label>
                              <RichTextEditor 
                                  value={item.description} 
                                  onChange={(val) => { 
                                      const n = [...deptData]; 
                                      n[idx].description = val; 
                                      setDeptData(n); 
                                  }}
                                  placeholder="Опишите специальности и отделение..."
                              />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Картинка отделения</Label>
                                  <div className="flex items-center gap-2">
                                      {item.departmentImage && <img src={item.departmentImage} className="h-12 w-12 object-cover" />}
                                      <Input type="file" onChange={async (e) => { if (e.target.files?.[0]) { const url = await handleUpload(e.target.files[0]); if (url) { const n = [...deptData]; n[idx].departmentImage = url; setDeptData(n); }}}} />
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <Label>Фото заведующего</Label>
                                  <div className="flex items-center gap-2">
                                      {item.headPhoto && <img src={item.headPhoto} className="h-12 w-12 object-cover" />}
                                      <Input type="file" onChange={async (e) => { if (e.target.files?.[0]) { const url = await handleUpload(e.target.files[0]); if (url) { const n = [...deptData]; n[idx].headPhoto = url; setDeptData(n); }}}} />
                                  </div>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
             ))}
             <Button className="w-full" onClick={() => saveSettings('departments_page', deptData)} disabled={loading}>
                 {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Отделения
             </Button>
         </div>
     );

    // 4. WORKSHOPS FORM
    const renderWorkshopsForm = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Описание мастерских</Label>
                        <RichTextEditor 
                            value={workshopsData.description} 
                            onChange={(val) => setWorkshopsData({...workshopsData, description: val})}
                            placeholder="Введите описание мастерских..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Особенности</Label>
                        <RichTextEditor 
                            value={workshopsData.features_text} 
                            onChange={(val) => setWorkshopsData({...workshopsData, features_text: val})}
                            placeholder="Введите особенности..."
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Списки цехов и лабораторий</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Список 1 (каждый элемент с новой строки)</Label>
                            <textarea 
                                value={workshopsData.workshop_list_1.join('\n')} 
                                onChange={(e) => setWorkshopsData({...workshopsData, workshop_list_1: e.target.value.split('\n')})}
                                className="w-full min-h-[200px] p-2 border rounded-md"
                                placeholder="Каждый элемент с новой строки..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Список 2 (каждый элемент с новой строки)</Label>
                            <textarea 
                                value={workshopsData.workshop_list_2.join('\n')} 
                                onChange={(e) => setWorkshopsData({...workshopsData, workshop_list_2: e.target.value.split('\n')})}
                                className="w-full min-h-[200px] p-2 border rounded-md"
                                placeholder="Каждый элемент с новой строки..."
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>График практики</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div><Label>Текст на кнопке</Label><Input value={workshopsData.practice_text} onChange={(e) => setWorkshopsData({...workshopsData, practice_text: e.target.value})} /></div>
                    <div className="space-y-2">
                        <Label>Файл графика (PDF)</Label>
                        <div className="flex items-center gap-4">
                             <div className="flex-1 truncate text-sm text-gray-500 border p-2 rounded bg-gray-50">{workshopsData.practice_file_url || "Файл не выбран"}</div>
                             <Label htmlFor="practice-upload" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md flex items-center"><Upload className="w-4 h-4 mr-2" /> Загрузить</Label>
                             <Input id="practice-upload" type="file" className="hidden" accept=".pdf" onChange={async (e) => { if (e.target.files?.[0]) { const url = await handleUpload(e.target.files[0]); if (url) setWorkshopsData({...workshopsData, practice_file_url: url}); }}} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Слайды мастерских</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {workshopsData.slides.map((slide: string, idx: number) => (
                            <div key={idx} className="relative">
                                <img src={slide} className="w-full h-32 object-cover rounded border" />
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 h-6 w-6"
                                    onClick={() => {
                                        const newSlides = [...workshopsData.slides];
                                        newSlides.splice(idx, 1);
                                        setWorkshopsData({...workshopsData, slides: newSlides});
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Добавить слайды</Label>
                        <Input type="file" multiple onChange={async (e) => {
                            if (e.target.files) {
                                const newSlides = [...workshopsData.slides];
                                for (let i = 0; i < e.target.files.length; i++) {
                                    const url = await handleUpload(e.target.files[i]);
                                    if (url) newSlides.push(url);
                                }
                                setWorkshopsData({...workshopsData, slides: newSlides});
                            }
                        }} />
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveSettings('workshops_page', workshopsData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Мастерские
            </Button>
        </div>
    );

    // 5. NOKO FORM
    const renderNokoForm = () => (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Документы НОКО</h3>
                <Button onClick={() => setNokoData([...nokoData, { title: 'Новый документ', url: '' }])}><Plus className="w-4 h-4 mr-2"/> Добавить документ</Button>
            </div>
            {nokoData.map((doc, idx) => (
                <Card key={idx}>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2"><Label>Название</Label><Input value={doc.title} onChange={(e) => { const n = [...nokoData]; n[idx].title = e.target.value; setNokoData(n); }} /></div>
                            <Button variant="ghost" className="mt-8" onClick={() => { const n = [...nokoData]; n.splice(idx, 1); setNokoData(n); }}><Trash2 className="text-red-500 w-4 h-4"/></Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Файл</Label>
                            <div className="flex items-center gap-4">
                                 <Input value={doc.url} placeholder="Ссылка на файл" readOnly className="bg-gray-50" />
                                 <Label htmlFor={`noko-upload-${idx}`} className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md flex items-center"><Upload className="w-4 h-4" /></Label>
                                 <Input id={`noko-upload-${idx}`} type="file" className="hidden" onChange={async (e) => { if (e.target.files?.[0]) { const url = await handleUpload(e.target.files[0]); if (url) { const n = [...nokoData]; n[idx].url = url; setNokoData(n); }}}} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button className="w-full" onClick={() => saveSettings('noko_page', nokoData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить НОКО
            </Button>
        </div>
    );

    // 6. LIBRARY FORM
    const renderLibraryForm = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Библиотека - Основная информация</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Режим работы</Label>
                        <textarea 
                            value={libraryData.work_time} 
                            onChange={(e) => setLibraryData({...libraryData, work_time: e.target.value})}
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Введите режим работы..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Информация о сотрудниках</Label>
                        <textarea 
                            value={libraryData.staff_info} 
                            onChange={(e) => setLibraryData({...libraryData, staff_info: e.target.value})}
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Введите информацию о сотрудниках..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Описание библиотеки</Label>
                        <RichTextEditor 
                            value={libraryData.description} 
                            onChange={(val) => setLibraryData({...libraryData, description: val})}
                            placeholder="Введите описание библиотеки..."
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Слайды библиотеки</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {libraryData.slides.map((slide: string, idx: number) => (
                            <div key={idx} className="relative">
                                <img src={slide} className="w-full h-32 object-cover rounded border" />
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 h-6 w-6"
                                    onClick={() => {
                                        const newSlides = [...libraryData.slides];
                                        newSlides.splice(idx, 1);
                                        setLibraryData({...libraryData, slides: newSlides});
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Добавить слайды</Label>
                        <Input type="file" multiple onChange={async (e) => {
                            if (e.target.files) {
                                const newSlides = [...libraryData.slides];
                                for (let i = 0; i < e.target.files.length; i++) {
                                    const url = await handleUpload(e.target.files[i]);
                                    if (url) newSlides.push(url);
                                }
                                setLibraryData({...libraryData, slides: newSlides});
                            }
                        }} />
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveSettings('library_page', libraryData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Библиотеку
            </Button>
        </div>
    );

    // 7. SURVEY FORM
    const renderSurveyForm = () => (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Онлайн-опросы</h3>
                <Button onClick={() => setSurveyData([...surveyData, { id: Date.now(), title: '', url: '' }])}><Plus className="w-4 h-4 mr-2"/> Добавить опрос</Button>
            </div>
            {surveyData.map((survey, idx) => (
                <Card key={idx}>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label>Название опроса</Label>
                                <Input value={survey.title} onChange={(e) => { const n = [...surveyData]; n[idx].title = e.target.value; setSurveyData(n); }} />
                            </div>
                            <Button variant="ghost" className="mt-8" onClick={() => { const n = [...surveyData]; n.splice(idx, 1); setSurveyData(n); }}><Trash2 className="text-red-500 w-4 h-4"/></Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Ссылка на опрос</Label>
                            <Input value={survey.url} onChange={(e) => { const n = [...surveyData]; n[idx].url = e.target.value; setSurveyData(n); }} placeholder="https://..." />
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button className="w-full" onClick={() => saveSettings('survey_page', surveyData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Опросы
            </Button>
        </div>
    );

    // 8. DORMITORY FORM
    const renderDormitoryForm = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Общежитие - Основная информация</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Условия проживания</Label>
                        <RichTextEditor 
                            value={dormitoryData.conditions_text} 
                            onChange={(val) => setDormitoryData({...dormitoryData, conditions_text: val})}
                            placeholder="Опишите условия проживания..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Правила и безопасность</Label>
                        <RichTextEditor 
                            value={dormitoryData.security_text} 
                            onChange={(val) => setDormitoryData({...dormitoryData, security_text: val})}
                            placeholder="Опишите правила безопасности..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Персонал и доступ</Label>
                        <RichTextEditor 
                            value={dormitoryData.staff_text} 
                            onChange={(val) => setDormitoryData({...dormitoryData, staff_text: val})}
                            placeholder="Информация о персонале..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Доступная среда</Label>
                        <RichTextEditor 
                            value={dormitoryData.accessibility_text} 
                            onChange={(val) => setDormitoryData({...dormitoryData, accessibility_text: val})}
                            placeholder="Информация о доступной среде..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Контактный телефон</Label>
                            <Input value={dormitoryData.contact_phone} onChange={(e) => setDormitoryData({...dormitoryData, contact_phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Контактное лицо</Label>
                            <Input value={dormitoryData.contact_name} onChange={(e) => setDormitoryData({...dormitoryData, contact_name: e.target.value})} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Слайды общежития</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {dormitoryData.slides.map((slide: string, idx: number) => (
                            <div key={idx} className="relative">
                                <img src={slide} className="w-full h-32 object-cover rounded border" />
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 h-6 w-6"
                                    onClick={() => {
                                        const newSlides = [...dormitoryData.slides];
                                        newSlides.splice(idx, 1);
                                        setDormitoryData({...dormitoryData, slides: newSlides});
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Добавить слайды</Label>
                        <Input type="file" multiple onChange={async (e) => {
                            if (e.target.files) {
                                const newSlides = [...dormitoryData.slides];
                                for (let i = 0; i < e.target.files.length; i++) {
                                    const url = await handleUpload(e.target.files[i]);
                                    if (url) newSlides.push(url);
                                }
                                setDormitoryData({...dormitoryData, slides: newSlides});
                            }
                        }} />
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveSettings('dormitory_page', dormitoryData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Общежитие
            </Button>
        </div>
    );

    // 9. DRIVING SCHOOL FORM
    const renderDrivingSchoolForm = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Автошкола - Основная информация</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Стоимость обучения</Label>
                            <Input value={drivingSchoolData.price} onChange={(e) => setDrivingSchoolData({...drivingSchoolData, price: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Описание автошколы</Label>
                        <RichTextEditor 
                            value={drivingSchoolData.description} 
                            onChange={(val) => setDrivingSchoolData({...drivingSchoolData, description: val})}
                            placeholder="Опишите автошколу..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Цели обучения</Label>
                        <RichTextEditor 
                            value={drivingSchoolData.goals_text} 
                            onChange={(val) => setDrivingSchoolData({...drivingSchoolData, goals_text: val})}
                            placeholder="Опишите цели обучения..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Контактная информация</Label>
                        <textarea 
                            value={drivingSchoolData.contacts_text} 
                            onChange={(e) => setDrivingSchoolData({...drivingSchoolData, contacts_text: e.target.value})}
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Введите контактную информацию..."
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Автопарк (каждый элемент с новой строки)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <textarea 
                        value={drivingSchoolData.cars_list.join('\n')} 
                        onChange={(e) => setDrivingSchoolData({...drivingSchoolData, cars_list: e.target.value.split('\n')})}
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        placeholder="Каждый элемент с новой строки..."
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Преимущества (каждый элемент с новой строки)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <textarea 
                        value={drivingSchoolData.advantages_list.join('\n')} 
                        onChange={(e) => setDrivingSchoolData({...drivingSchoolData, advantages_list: e.target.value.split('\n')})}
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        placeholder="Каждый элемент с новой строки..."
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Документы для зачисления (каждый элемент с новой строки)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <textarea 
                        value={drivingSchoolData.docs_list.join('\n')} 
                        onChange={(e) => setDrivingSchoolData({...drivingSchoolData, docs_list: e.target.value.split('\n')})}
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        placeholder="Каждый элемент с новой строки..."
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Слайды автошколы</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {drivingSchoolData.slides.map((slide: string, idx: number) => (
                            <div key={idx} className="relative">
                                <img src={slide} className="w-full h-32 object-cover rounded border" />
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 h-6 w-6"
                                    onClick={() => {
                                        const newSlides = [...drivingSchoolData.slides];
                                        newSlides.splice(idx, 1);
                                        setDrivingSchoolData({...drivingSchoolData, slides: newSlides});
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Добавить слайды</Label>
                        <Input type="file" multiple onChange={async (e) => {
                            if (e.target.files) {
                                const newSlides = [...drivingSchoolData.slides];
                                for (let i = 0; i < e.target.files.length; i++) {
                                    const url = await handleUpload(e.target.files[i]);
                                    if (url) newSlides.push(url);
                                }
                                setDrivingSchoolData({...drivingSchoolData, slides: newSlides});
                            }
                        }} />
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveSettings('driving_school_page', drivingSchoolData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Автошколу
            </Button>
        </div>
    );

    // 10. EDUCATIONAL WORK FORM
    const renderEducationalWorkForm = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Воспитательная работа - Основная информация</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Заголовок</Label>
                        <Input value={educationalWorkData.title} onChange={(e) => setEducationalWorkData({...educationalWorkData, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Содержание</Label>
                        <RichTextEditor 
                            value={educationalWorkData.content} 
                            onChange={(val) => setEducationalWorkData({...educationalWorkData, content: val})}
                            placeholder="Введите содержание..."
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Слайды</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {educationalWorkData.slides.map((slide: string, idx: number) => (
                            <div key={idx} className="relative">
                                <img src={slide} className="w-full h-32 object-cover rounded border" />
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 h-6 w-6"
                                    onClick={() => {
                                        const newSlides = [...educationalWorkData.slides];
                                        newSlides.splice(idx, 1);
                                        setEducationalWorkData({...educationalWorkData, slides: newSlides});
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Добавить слайды</Label>
                        <Input type="file" multiple onChange={async (e) => {
                            if (e.target.files) {
                                const newSlides = [...educationalWorkData.slides];
                                for (let i = 0; i < e.target.files.length; i++) {
                                    const url = await handleUpload(e.target.files[i]);
                                    if (url) newSlides.push(url);
                                }
                                setEducationalWorkData({...educationalWorkData, slides: newSlides});
                            }
                        }} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Документы для скачивания</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Документы</h4>
                        <Button onClick={() => setEducationalWorkData({
                            ...educationalWorkData, 
                            documents: [...educationalWorkData.documents, { title: '', file: '' }]
                        })}><Plus className="w-4 h-4 mr-2"/> Добавить документ</Button>
                    </div>
                    {educationalWorkData.documents.map((doc: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-end border p-4 rounded">
                            <div className="flex-1 space-y-2">
                                <Label>Название документа</Label>
                                <Input value={doc.title} onChange={(e) => {
                                    const newDocs = [...educationalWorkData.documents];
                                    newDocs[idx].title = e.target.value;
                                    setEducationalWorkData({...educationalWorkData, documents: newDocs});
                                }} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label>Файл</Label>
                                <div className="flex items-center gap-2">
                                    <Input value={doc.file} placeholder="Ссылка на файл" readOnly className="bg-gray-50" />
                                    <Label htmlFor={`edu-doc-${idx}`} className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md flex items-center"><Upload className="w-4 h-4" /></Label>
                                    <Input id={`edu-doc-${idx}`} type="file" className="hidden" onChange={async (e) => { 
                                        if (e.target.files?.[0]) { 
                                            const url = await handleUpload(e.target.files[0]); 
                                            if (url) { 
                                                const newDocs = [...educationalWorkData.documents];
                                                newDocs[idx].file = url;
                                                setEducationalWorkData({...educationalWorkData, documents: newDocs});
                                            }
                                        }
                                    }} />
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => {
                                const newDocs = [...educationalWorkData.documents];
                                newDocs.splice(idx, 1);
                                setEducationalWorkData({...educationalWorkData, documents: newDocs});
                            }}><Trash2 className="text-red-500 w-4 h-4"/></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveSettings('educational_work_page', educationalWorkData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Воспитательную работу
            </Button>
        </div>
    );

    // 11. ACCREDITATION FORM
    const renderAccreditationForm = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Аккредитация - Документы</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Описание аккредитации</Label>
                        <RichTextEditor 
                            value={accreditationData.description} 
                            onChange={(val) => setAccreditationData({...accreditationData, description: val})}
                            placeholder="Введите описание аккредитации..."
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <Label>Документы аккредитации</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {accreditationData.docs.map((doc: string, idx: number) => (
                                <div key={idx} className="space-y-2">
                                    <Label>Документ {idx + 1}</Label>
                                    <div className="flex items-center gap-2">
                                        {doc && <img src={doc} className="h-20 w-full object-cover rounded border" />}
                                    </div>
                                    <Input type="file" onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                            const url = await handleUpload(e.target.files[0]);
                                            if (url) {
                                                const newDocs = [...accreditationData.docs];
                                                newDocs[idx] = url;
                                                setAccreditationData({...accreditationData, docs: newDocs});
                                            }
                                        }
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>QR-код</Label>
                        <div className="flex items-center gap-4">
                            {accreditationData.qr_code && <img src={accreditationData.qr_code} className="h-32 w-32 object-cover rounded border" />}
                            <Input type="file" onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    const url = await handleUpload(e.target.files[0]);
                                    if (url) {
                                        setAccreditationData({...accreditationData, qr_code: url});
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveSettings('accreditation_page', accreditationData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Аккредитацию
            </Button>
        </div>
    );

    // 12. LICENSE FORM
    const renderLicenseForm = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Лицензия - Документы</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Описание лицензии</Label>
                        <RichTextEditor 
                            value={licenseData.description} 
                            onChange={(val) => setLicenseData({...licenseData, description: val})}
                            placeholder="Введите описание лицензии..."
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <Label>Документы лицензии</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {licenseData.docs.map((doc: string, idx: number) => (
                                <div key={idx} className="space-y-2">
                                    <Label>Документ {idx + 1}</Label>
                                    <div className="flex items-center gap-2">
                                        {doc && <img src={doc} className="h-32 w-full object-cover rounded border" />}
                                    </div>
                                    <Input type="file" onChange={async (e) => {
                                        if (e.target.files?.[0]) {
                                            const url = await handleUpload(e.target.files[0]);
                                            if (url) {
                                                const newDocs = [...licenseData.docs];
                                                newDocs[idx] = url;
                                                setLicenseData({...licenseData, docs: newDocs});
                                            }
                                        }
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>QR-код</Label>
                        <div className="flex items-center gap-4">
                            {licenseData.qr_code && <img src={licenseData.qr_code} className="h-32 w-32 object-cover rounded border" />}
                            <Input type="file" onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    const url = await handleUpload(e.target.files[0]);
                                    if (url) {
                                        setLicenseData({...licenseData, qr_code: url});
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveSettings('license_page', licenseData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Лицензию
            </Button>
        </div>
    );

    // 13. SWIMMING POOL FORM
    const renderSwimmingPoolForm = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader><CardTitle>Бассейн - Основная информация</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Описание бассейна</Label>
                    <RichTextEditor 
                        value={swimmingPoolData.description} 
                        onChange={(val) => setSwimmingPoolData({...swimmingPoolData, description: val})}
                        placeholder="Введите описание бассейна..."
                    />
                </div>
                
                <div className="space-y-4">
                    <Label>Таблицы цен</Label>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Таблица 1 - Групповые занятия для детей</Label>
                            <div className="border rounded-md p-4 bg-white">
                                <div dangerouslySetInnerHTML={{ __html: swimmingPoolData.table1_html || '' }} />
                            </div>
                            <textarea 
                                value={swimmingPoolData.table1_html} 
                                onChange={(e) => setSwimmingPoolData({...swimmingPoolData, table1_html: e.target.value})}
                                className="w-full min-h-[200px] p-2 border rounded-md font-mono text-sm"
                                placeholder="Введите HTML таблицы..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Таблица 2 - Для взрослых и детей старше 14 лет</Label>
                            <div className="border rounded-md p-4 bg-white">
                                <div dangerouslySetInnerHTML={{ __html: swimmingPoolData.table2_html || '' }} />
                            </div>
                            <textarea 
                                value={swimmingPoolData.table2_html} 
                                onChange={(e) => setSwimmingPoolData({...swimmingPoolData, table2_html: e.target.value})}
                                className="w-full min-h-[200px] p-2 border rounded-md font-mono text-sm"
                                placeholder="Введите HTML таблицы..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Таблица 3 - Для работников и студентов ТТЖТ</Label>
                            <div className="border rounded-md p-4 bg-white">
                                <div dangerouslySetInnerHTML={{ __html: swimmingPoolData.table3_html || '' }} />
                            </div>
                            <textarea 
                                value={swimmingPoolData.table3_html} 
                                onChange={(e) => setSwimmingPoolData({...swimmingPoolData, table3_html: e.target.value})}
                                className="w-full min-h-[200px] p-2 border rounded-md font-mono text-sm"
                                placeholder="Введите HTML таблицы..."
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Инструкторы и контакты</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    <Label>Инструкторы по плаванию</Label>
                    {(swimmingPoolData.instructors || []).map((instructor: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-end border p-4 rounded">
                            <div className="flex-1 space-y-2">
                                <Label>ФИО инструктора</Label>
                                <Input value={instructor.name} onChange={(e) => {
                                    const newInstructors = [...(swimmingPoolData.instructors || [])];
                                    newInstructors[idx].name = e.target.value;
                                    setSwimmingPoolData({...swimmingPoolData, instructors: newInstructors});
                                }} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label>Должность/достижения</Label>
                                <Input value={instructor.position} onChange={(e) => {
                                    const newInstructors = [...(swimmingPoolData.instructors || [])];
                                    newInstructors[idx].position = e.target.value;
                                    setSwimmingPoolData({...swimmingPoolData, instructors: newInstructors});
                                }} />
                            </div>
                            <Button variant="ghost" onClick={() => {
                                const newInstructors = [...(swimmingPoolData.instructors || [])];
                                newInstructors.splice(idx, 1);
                                setSwimmingPoolData({...swimmingPoolData, instructors: newInstructors});
                            }}><Trash2 className="text-red-500 w-4 h-4"/></Button>
                        </div>
                    ))}
                    <Button onClick={() => setSwimmingPoolData({
                        ...swimmingPoolData, 
                        instructors: [...(swimmingPoolData.instructors || []), { name: '', position: '' }]
                    })}><Plus className="w-4 h-4 mr-2"/> Добавить инструктора</Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Контактный телефон</Label>
                        <Input value={swimmingPoolData.contact_phone} onChange={(e) => setSwimmingPoolData({...swimmingPoolData, contact_phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Контактное лицо</Label>
                        <Input value={swimmingPoolData.contact_name} onChange={(e) => setSwimmingPoolData({...swimmingPoolData, contact_name: e.target.value})} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Слайды бассейна</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(swimmingPoolData.slides || []).map((slide: string, idx: number) => (
                        <div key={idx} className="relative">
                            <img src={slide} className="w-full h-32 object-cover rounded border" />
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 h-6 w-6"
                                onClick={() => {
                                    const newSlides = [...(swimmingPoolData.slides || [])];
                                    newSlides.splice(idx, 1);
                                    setSwimmingPoolData({...swimmingPoolData, slides: newSlides});
                                }}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <Label>Добавить слайды</Label>
                    <Input type="file" multiple onChange={async (e) => {
                        if (e.target.files) {
                            const newSlides = [...(swimmingPoolData.slides || [])];
                            for (let i = 0; i < e.target.files.length; i++) {
                                const url = await handleUpload(e.target.files[i]);
                                    if (url) newSlides.push(url);
                            }
                            setSwimmingPoolData({...swimmingPoolData, slides: newSlides});
                        }
                    }} />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Документы бассейна</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Документы</h4>
                    <Button onClick={() => setSwimmingPoolData({
                        ...swimmingPoolData, 
                        documents: [...(swimmingPoolData.documents || []), { title: '', file: '' }]
                    })}><Plus className="w-4 h-4 mr-2"/> Добавить документ</Button>
                </div>
                {(swimmingPoolData.documents || []).map((doc: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-end border p-4 rounded">
                        <div className="flex-1 space-y-2">
                            <Label>Название документа</Label>
                            <Input value={doc.title} onChange={(e) => {
                                const newDocs = [...(swimmingPoolData.documents || [])];
                                newDocs[idx].title = e.target.value;
                                setSwimmingPoolData({...swimmingPoolData, documents: newDocs});
                            }} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label>Файл</Label>
                            <div className="flex items-center gap-2">
                                <Input value={doc.file} placeholder="Ссылка на файл" readOnly className="bg-gray-50" />
                                <Label htmlFor={`pool-doc-${idx}`} className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md flex items-center"><Upload className="w-4 h-4" /></Label>
                                <Input id={`pool-doc-${idx}`} type="file" className="hidden" onChange={async (e) => { 
                                    if (e.target.files?.[0]) { 
                                        const url = await handleUpload(e.target.files[0]); 
                                        if (url) { 
                                            const newDocs = [...(swimmingPoolData.documents || [])];
                                            newDocs[idx].file = url;
                                            setSwimmingPoolData({...swimmingPoolData, documents: newDocs});
                                        }
                                    }
                                }} />
                            </div>
                        </div>
                        <Button variant="ghost" onClick={() => {
                            const newDocs = [...(swimmingPoolData.documents || [])];
                            newDocs.splice(idx, 1);
                            setSwimmingPoolData({...swimmingPoolData, documents: newDocs});
                        }}><Trash2 className="text-red-500 w-4 h-4"/></Button>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Button className="w-full" onClick={() => saveSettings('swimming_pool_page', swimmingPoolData)} disabled={loading}>
            {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Бассейн
        </Button>
    </div>
);

    // 14. CAFETERIA FORM
    const renderCafeteriaForm = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Столовая - Основная информация</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Описание столовой</Label>
                        <RichTextEditor 
                            value={cafeteriaData.description} 
                            onChange={(val) => setCafeteriaData({...cafeteriaData, description: val})}
                            placeholder="Введите описание столовой..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Особенности (для лиц с ОВЗ)</Label>
                        <RichTextEditor 
                            value={cafeteriaData.features_text} 
                            onChange={(val) => setCafeteriaData({...cafeteriaData, features_text: val})}
                            placeholder="Введите особенности..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Часы работы</Label>
                        <textarea 
                            value={cafeteriaData.work_time} 
                            onChange={(e) => setCafeteriaData({...cafeteriaData, work_time: e.target.value})}
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Введите часы работы..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Контактный телефон</Label>
                            <Input value={cafeteriaData.contact_phone} onChange={(e) => setCafeteriaData({...cafeteriaData, contact_phone: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Контактное лицо</Label>
                            <Input value={cafeteriaData.contact_name} onChange={(e) => setCafeteriaData({...cafeteriaData, contact_name: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Финальный текст</Label>
                        <RichTextEditor 
                            value={cafeteriaData.final_text} 
                            onChange={(val) => setCafeteriaData({...cafeteriaData, final_text: val})}
                            placeholder="Введите финальный текст..."
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Слайды столовой</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {cafeteriaData.slides.map((slide: string, idx: number) => (
                            <div key={idx} className="relative">
                                <img src={slide} className="w-full h-32 object-cover rounded border" />
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 h-6 w-6"
                                    onClick={() => {
                                        const newSlides = [...cafeteriaData.slides];
                                        newSlides.splice(idx, 1);
                                        setCafeteriaData({...cafeteriaData, slides: newSlides});
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Добавить слайды</Label>
                        <Input type="file" multiple onChange={async (e) => {
                            if (e.target.files) {
                                const newSlides = [...cafeteriaData.slides];
                                for (let i = 0; i < e.target.files.length; i++) {
                                    const url = await handleUpload(e.target.files[i]);
                                    if (url) newSlides.push(url);
                                }
                                setCafeteriaData({...cafeteriaData, slides: newSlides});
                            }
                        }} />
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full" onClick={() => saveSettings('cafeteria_page', cafeteriaData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Столовую
            </Button>
        </div>
    );

    // 15. COURSES FORM (с редактированием модальных окон)
    const renderCoursesForm = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Элементы страницы "Курсы"</h3>
                <Button onClick={() => setCoursesData({
                    ...coursesData, 
                    items: [...coursesData.items, { 
                        id: Date.now(), 
                        name: '', 
                        image: '', 
                        modalId: '', 
                        url: '',
                        modalContent: {
                            title: '',
                            content: '',
                            documents: []
                        }
                    }]
                })}><Plus className="w-4 h-4 mr-2"/> Добавить элемент</Button>
            </div>
            {coursesData.items.map((item: any, idx: number) => (
                <Card key={idx}>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Название элемента</Label>
                                    <Input value={item.name} onChange={(e) => {
                                        const newItems = [...coursesData.items];
                                        newItems[idx].name = e.target.value;
                                        setCoursesData({...coursesData, items: newItems});
                                    }} />
                                </div>
                                <div className="space-y-2">
                                    <Label>URL ссылки (если нет модального окна)</Label>
                                    <Input value={item.url} onChange={(e) => {
                                        const newItems = [...coursesData.items];
                                        newItems[idx].url = e.target.value;
                                        setCoursesData({...coursesData, items: newItems});
                                    }} placeholder="https://..." />
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => {
                                const newItems = [...coursesData.items];
                                newItems.splice(idx, 1);
                                setCoursesData({...coursesData, items: newItems});
                            }}><Trash2 className="text-red-500 w-4 h-4"/></Button>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Изображение</Label>
                            <div className="flex items-center gap-4">
                                {item.image && <img src={item.image} className="h-16 w-16 object-cover rounded" />}
                                <Input type="file" onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const url = await handleUpload(e.target.files[0]);
                                        if (url) {
                                            const newItems = [...coursesData.items];
                                            newItems[idx].image = url;
                                            setCoursesData({...coursesData, items: newItems});
                                        }
                                    }
                                }} />
                            </div>
                        </div>

                        {/* РЕДАКТИРОВАНИЕ МОДАЛЬНОГО ОКНА */}
                        <div className="border-t pt-6">
                            <h4 className="text-lg font-semibold mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Содержание модального окна
                            </h4>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Заголовок модального окна</Label>
                                    <Input 
                                        value={item.modalContent.title} 
                                        onChange={(e) => {
                                            const newItems = [...coursesData.items];
                                            newItems[idx].modalContent.title = e.target.value;
                                            setCoursesData({...coursesData, items: newItems});
                                        }}
                                        placeholder="Введите заголовок..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Текст модального окна</Label>
                                    <RichTextEditor 
                                        value={item.modalContent.content} 
                                        onChange={(val) => {
                                            const newItems = [...coursesData.items];
                                            newItems[idx].modalContent.content = val;
                                            setCoursesData({...coursesData, items: newItems});
                                        }}
                                        placeholder="Введите текст модального окна..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Документы для скачивания</Label>
                                        <Button 
                                            size="sm"
                                            onClick={() => {
                                                const newItems = [...coursesData.items];
                                                newItems[idx].modalContent.documents.push({ title: '', url: '' });
                                                setCoursesData({...coursesData, items: newItems});
                                            }}
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Добавить документ
                                        </Button>
                                    </div>
                                    
                                    {item.modalContent.documents.map((doc: any, docIdx: number) => (
                                        <div key={docIdx} className="flex gap-4 items-end border p-4 rounded">
                                            <div className="flex-1 space-y-2">
                                                <Label>Название документа</Label>
                                                <Input 
                                                    value={doc.title} 
                                                    onChange={(e) => {
                                                        const newItems = [...coursesData.items];
                                                        newItems[idx].modalContent.documents[docIdx].title = e.target.value;
                                                        setCoursesData({...coursesData, items: newItems});
                                                    }}
                                                    placeholder="Название документа..."
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Label>Файл</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input 
                                                        value={doc.url} 
                                                        placeholder="Ссылка на файл" 
                                                        readOnly 
                                                        className="bg-gray-50" 
                                                    />
                                                    <Label 
                                                        htmlFor={`course-doc-${idx}-${docIdx}`} 
                                                        className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md flex items-center"
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                    </Label>
                                                    <Input 
                                                        id={`course-doc-${idx}-${docIdx}`} 
                                                        type="file" 
                                                        className="hidden" 
                                                        onChange={async (e) => { 
                                                            if (e.target.files?.[0]) { 
                                                                const url = await handleUpload(e.target.files[0]); 
                                                                if (url) { 
                                                                    const newItems = [...coursesData.items];
                                                                    newItems[idx].modalContent.documents[docIdx].url = url;
                                                                    setCoursesData({...coursesData, items: newItems});
                                                                }
                                                            }
                                                        }} 
                                                    />
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                onClick={() => {
                                                    const newItems = [...coursesData.items];
                                                    newItems[idx].modalContent.documents.splice(docIdx, 1);
                                                    setCoursesData({...coursesData, items: newItems});
                                                }}
                                            >
                                                <Trash2 className="text-red-500 w-4 h-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button className="w-full" onClick={() => saveSettings('courses_page', coursesData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Курсы
            </Button>
        </div>
    );

    // 16. SELECTION COMMITTEE FORM
    const renderSelectionCommitteeForm = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Секции отборочной комиссии</h3>
                <Button onClick={() => setSelectionCommitteeData({
                    ...selectionCommitteeData, 
                    sections: [...selectionCommitteeData.sections, { 
                        id: Date.now(), 
                        title: '', 
                        content: '' 
                    }]
                })}><Plus className="w-4 h-4 mr-2"/> Добавить секцию</Button>
            </div>
            {selectionCommitteeData.sections.map((section: any, idx: number) => (
                <Card key={idx}>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <Label>Заголовок секции</Label>
                                    <Input 
                                        value={section.title} 
                                        onChange={(e) => {
                                            const newSections = [...selectionCommitteeData.sections];
                                            newSections[idx].title = e.target.value;
                                            setSelectionCommitteeData({...selectionCommitteeData, sections: newSections});
                                        }}
                                        placeholder="Введите заголовок секции..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Содержание секции</Label>
                                    <RichTextEditor 
                                        value={section.content} 
                                        onChange={(val) => {
                                            const newSections = [...selectionCommitteeData.sections];
                                            newSections[idx].content = val;
                                            setSelectionCommitteeData({...selectionCommitteeData, sections: newSections});
                                        }}
                                        placeholder="Введите содержание секции..."
                                    />
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => {
                                    const newSections = [...selectionCommitteeData.sections];
                                    newSections.splice(idx, 1);
                                    setSelectionCommitteeData({...selectionCommitteeData, sections: newSections});
                                }}
                            >
                                <Trash2 className="text-red-500 w-4 h-4"/>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button className="w-full" onClick={() => saveSettings('selection_committee_page', selectionCommitteeData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Отборочную комиссию
            </Button>
        </div>
    );

    // 17. CORRUPTION REPORT FORM
    const renderCorruptionReportForm = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Документы по противодействию коррупции</h3>
                <Button onClick={() => setCorruptionReportData({
                    ...corruptionReportData, 
                    documents: [...corruptionReportData.documents, { title: '', url: '' }]
                })}><Plus className="w-4 h-4 mr-2"/> Добавить документ</Button>
            </div>
            {corruptionReportData.documents.map((doc: any, idx: number) => (
                <Card key={idx}>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <Label>Название документа</Label>
                                <Input 
                                    value={doc.title} 
                                    onChange={(e) => {
                                        const newDocs = [...corruptionReportData.documents];
                                        newDocs[idx].title = e.target.value;
                                        setCorruptionReportData({...corruptionReportData, documents: newDocs});
                                    }}
                                    placeholder="Введите название документа..."
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label>Файл документа</Label>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        value={doc.url} 
                                        placeholder="Ссылка на файл" 
                                        readOnly 
                                        className="bg-gray-50" 
                                    />
                                    <Label 
                                        htmlFor={`corruption-doc-${idx}`} 
                                        className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md flex items-center"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </Label>
                                    <Input 
                                        id={`corruption-doc-${idx}`} 
                                        type="file" 
                                        className="hidden" 
                                        onChange={async (e) => { 
                                            if (e.target.files?.[0]) { 
                                                const url = await handleUpload(e.target.files[0]); 
                                                if (url) { 
                                                    const newDocs = [...corruptionReportData.documents];
                                                    newDocs[idx].url = url;
                                                    setCorruptionReportData({...corruptionReportData, documents: newDocs});
                                                }
                                            }
                                        }} 
                                    />
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => {
                                    const newDocs = [...corruptionReportData.documents];
                                    newDocs.splice(idx, 1);
                                    setCorruptionReportData({...corruptionReportData, documents: newDocs});
                                }}
                            >
                                <Trash2 className="text-red-500 w-4 h-4"/>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button className="w-full" onClick={() => saveSettings('corruption_report_page', corruptionReportData)} disabled={loading}>
                {loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Сохранить Противодействие коррупции
            </Button>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Редактор контента страниц</h2>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto overflow-x-auto">
                    <TabsTrigger value="history">История</TabsTrigger>
                    <TabsTrigger value="administration">Администрация</TabsTrigger>
                    <TabsTrigger value="departments">Отделения</TabsTrigger>
                    <TabsTrigger value="workshops">Мастерские</TabsTrigger>
                    <TabsTrigger value="noko">НОКО</TabsTrigger>
                    <TabsTrigger value="library">Библиотека</TabsTrigger>
                    <TabsTrigger value="survey">Опросы</TabsTrigger>
                    <TabsTrigger value="dormitory">Общежитие</TabsTrigger>
                    <TabsTrigger value="driving_school">Автошкола</TabsTrigger>
                    <TabsTrigger value="educational_work">Воспитательная работа</TabsTrigger>
                    <TabsTrigger value="accreditation">Аккредитация</TabsTrigger>
                    <TabsTrigger value="license">Лицензия</TabsTrigger>
                    <TabsTrigger value="swimming_pool">Бассейн</TabsTrigger>
                    <TabsTrigger value="cafeteria">Столовая</TabsTrigger>
                    <TabsTrigger value="courses">Курсы</TabsTrigger>
                    <TabsTrigger value="selection_committee">Отборочная комиссия</TabsTrigger>
                    <TabsTrigger value="corruption_report">Противодействие коррупции</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                    <TabsContent value="history">{renderHistoryForm()}</TabsContent>
                    <TabsContent value="administration">{renderAdminForm()}</TabsContent>
                    <TabsContent value="departments">{renderDeptForm()}</TabsContent>
                    <TabsContent value="workshops">{renderWorkshopsForm()}</TabsContent>
                    <TabsContent value="noko">{renderNokoForm()}</TabsContent>
                    <TabsContent value="library">{renderLibraryForm()}</TabsContent>
                    <TabsContent value="survey">{renderSurveyForm()}</TabsContent>
                    <TabsContent value="dormitory">{renderDormitoryForm()}</TabsContent>
                    <TabsContent value="driving_school">{renderDrivingSchoolForm()}</TabsContent>
                    <TabsContent value="educational_work">{renderEducationalWorkForm()}</TabsContent>
                    <TabsContent value="accreditation">{renderAccreditationForm()}</TabsContent>
                    <TabsContent value="license">{renderLicenseForm()}</TabsContent>
                    <TabsContent value="swimming_pool">{renderSwimmingPoolForm()}</TabsContent>
                    <TabsContent value="cafeteria">{renderCafeteriaForm()}</TabsContent>
                    <TabsContent value="courses">{renderCoursesForm()}</TabsContent>
                    <TabsContent value="selection_committee">{renderSelectionCommitteeForm()}</TabsContent>
                    <TabsContent value="corruption_report">{renderCorruptionReportForm()}</TabsContent>
                </div>
            </Tabs>
        </div>
    );
}