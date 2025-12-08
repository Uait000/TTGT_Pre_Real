import { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, TrainFront, Bolt, HardHat, TrafficCone, Laptop, BookOpen, ChevronRight, X } from 'lucide-react';
import { settingsApi, DepartmentItem } from '@/api/settings';

// Импорты картинок (оставляем как было)
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

const ICON_MAP: {[key: string]: any} = {
    'TrainFront': TrainFront,
    'Bolt': Bolt,
    'HardHat': HardHat,
    'TrafficCone': TrafficCone,
    'Laptop': Laptop
};

const DEFAULT_DEPARTMENTS: DepartmentItem[] = [
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
        specialties: ['Компьютерные системы и комплексы','Техническая эксплуатация транспортного радиоэлектронного оборудования (по видам транспорта)','Экономика и бухгалтерский учет (по отраслям)'],
        head: 'Гамачек С.В',
        description: `<p><strong>Специальности:</strong></p><ul><li>Компьютерные системы и комплексы</li><li>Техническая эксплуатация транспортного радиоэлектронного оборудования (по видам транспорта)</li><li>Экономика и бухгалтерский учет (по отраслям)</li></ul><p>Отделение было открыто в 1972 году и за время своего существования подготовило более 2500 специалистов. Выпускники отделения работают в путевых хозяйствах железных дорог, строительных организациях и проектных институтах.</p><p>Обучение включает изучение современных технологий строительства и содержания железнодорожного пути, путевых машин и механизмов, организации путевого хозяйства. Студенты проходят практику на современных путевых машинах и в лабораториях, оснащенных современным оборудованием.</p><p><strong>Возглавляет отделение Гамачек Сергей Владимирович.</strong></p>`,
        departmentImage: ad, headPhoto: gamachek, videoUrl: 'https://rutube.ru/video/example5/'
    }
];

const Departments = () => {
    const [departments, setDepartments] = useState<DepartmentItem[]>(DEFAULT_DEPARTMENTS);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await settingsApi.getPageData('departments_page');
                if (data) {
                    const realData = Array.isArray(data) ? data : (data.items || []);
                    if (realData.length > 0) {
                        const mergedData = DEFAULT_DEPARTMENTS.map((defaultItem, index) => ({
                            ...defaultItem,
                            ...(realData[index] || {}),
                            departmentImage: realData[index]?.departmentImage || defaultItem.departmentImage,
                            headPhoto: realData[index]?.headPhoto || defaultItem.headPhoto
                        }));
                        setDepartments(mergedData);
                    }
                }
            } catch (error) {
                console.error('Error loading departments data:', error);
            }
        };
        loadData();
    }, []);

    const activeDepartment = useMemo(() => {
        if (selectedDepartment === null) return null;
        return departments.find(d => d.id === selectedDepartment);
    }, [selectedDepartment, departments]);

    const openDescriptionModal = (deptId: number) => {
        setSelectedDepartment(deptId);
        setIsDescriptionOpen(true);
    };

    const renderDescription = (description: string) => {
        if (!description) return null;
        return (
            <div 
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-4 rich-text-content"
                dangerouslySetInnerHTML={{ __html: description }}
            />
        );
    };

    const colors = {
        blue: { gradient: 'from-blue-50 to-indigo-100', border: 'border-blue-200', text: 'text-blue-800', iconBg: 'bg-blue-100', iconText: 'text-blue-600', buttonBg: 'bg-blue-600 hover:bg-blue-700', buttonOutline: 'border-blue-500 text-blue-700 hover:bg-blue-50', hoverBgColor: 'hover:bg-blue-700' },
        yellow: { gradient: 'from-yellow-50 to-amber-100', border: 'border-yellow-200', text: 'text-amber-800', iconBg: 'bg-yellow-100', iconText: 'text-amber-600', buttonBg: 'bg-yellow-500 hover:bg-yellow-600', buttonOutline: 'border-yellow-500 text-yellow-700 hover:bg-yellow-50', hoverBgColor: 'hover:bg-yellow-600' },
        orange: { gradient: 'from-orange-50 to-red-100', border: 'border-orange-200', text: 'text-orange-800', iconBg: 'bg-orange-100', iconText: 'text-orange-600', buttonBg: 'bg-orange-500 hover:bg-orange-600', buttonOutline: 'border-orange-500 text-orange-700 hover:bg-orange-50', hoverBgColor: 'hover:bg-orange-600' },
        green: { gradient: 'from-green-50 to-emerald-100', border: 'border-green-200', text: 'text-green-800', iconBg: 'bg-green-100', iconText: 'text-green-600', buttonBg: 'bg-green-600 hover:bg-green-700', buttonOutline: 'border-green-500 text-green-700 hover:bg-green-50', hoverBgColor: 'hover:bg-green-700' },
        purple: { gradient: 'from-purple-50 to-violet-100', border: 'border-purple-200', text: 'text-purple-800', iconBg: 'bg-purple-100', iconText: 'text-purple-600', buttonBg: 'bg-purple-600 hover:bg-purple-700', buttonOutline: 'border-purple-500 text-purple-700 hover:bg-purple-50', hoverBgColor: 'hover:bg-purple-700' },
    };

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                    <BookOpen className="w-10 h-10 mr-4 text-accent" /> Наши отделения
                </h1>
                <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
                    Исследуйте наши передовые отделения и специальности.
                </p>
                
                {/* ИСПРАВЛЕНА СЕТКА */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-8"> 
                    {departments.map((dept) => {
                        const IconComponent = ICON_MAP[dept.iconName] || BookOpen; 
                        const theme = colors[dept.color as keyof typeof colors] || colors.blue;

                        return (
                            <div key={dept.id} className={`relative ${theme.gradient} rounded-2xl shadow-lg border ${theme.border} p-6 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col group overflow-hidden`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${theme.buttonBg}`}></div>
                                <div className="flex-1 flex flex-col pt-6">
                                    <div className="flex items-start space-x-4 mb-5">
                                        <div className={`relative w-20 h-20 ${theme.iconBg} rounded-full p-2.5 shadow-md flex items-center justify-center flex-shrink-0 border-2 border-white ring-2 ${theme.border}`}>
                                            {dept.departmentImage ? (
                                                <img src={dept.departmentImage} alt={`Лого ${dept.name}`} className="w-full h-full object-contain"/>
                                            ) : (
                                                <IconComponent className={`w-10 h-10 ${theme.iconText}`} />
                                            )}
                                        </div>
                                        <h2 className={`text-xl md:text-2xl font-bold ${theme.text} leading-tight`}>{dept.name}</h2>
                                    </div>
                                    <div className="flex items-center space-x-4 mb-6 bg-white/60 p-4 rounded-lg border border-gray-100 shadow-sm cursor-pointer group/avatar" onClick={(e) => { e.stopPropagation(); setLightboxImage(dept.headPhoto); }}>
                                        <div className="w-24 h-32 md:w-32 md:h-40 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white shadow">
                                            <img src={dept.headPhoto} alt={dept.head} className="w-full h-full object-cover transition-transform duration-300 group-hover/avatar:scale-105" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Заведующий:</p>
                                            <p className={`text-base md:text-lg font-semibold ${theme.text}`}>{dept.head}</p>
                                        </div>
                                    </div>
                                    <div className="mb-6 flex-1">
                                        <h3 className="font-semibold text-gray-700 mb-3 text-base">Специальности:</h3>
                                        <ul className="space-y-2">
                                            {dept.specialties.map((specialty, index) => (
                                                <li key={index} className="flex items-start text-sm text-gray-700"> 
                                                    <ChevronRight className={`w-4 h-4 mr-1.5 mt-0.5 ${theme.iconText} flex-shrink-0`} /> {specialty}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-auto pt-4 border-t border-gray-200/60">
                                        <Button onClick={() => openDescriptionModal(dept.id)} variant="outline" className={`${theme.buttonOutline} bg-white/80 w-full sm:w-auto`}>
                                            <BookOpen className="w-4 h-4 mr-2" /> Подробнее
                                        </Button>
                                        <Button onClick={(e) => { e.stopPropagation(); window.open(dept.videoUrl, '_blank'); }} className={`${theme.buttonBg} ${theme.hoverBgColor} text-white w-full sm:w-auto`}>
                                            <Play className="w-4 h-4 mr-2" /> Визитка
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Dialog open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                <DialogContent className="max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl bg-white">
                    {activeDepartment && (
                        <>
                            <DialogHeader className="text-center pb-4 border-b border-gray-200 mb-6 relative">
                                <DialogTitle className="text-3xl font-extrabold text-primary pt-4">{activeDepartment.name}</DialogTitle>
                                <p className="text-lg text-muted-foreground mt-2">{activeDepartment.head}</p>
                            </DialogHeader>
                            {renderDescription(activeDepartment.description)}
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {lightboxImage && (
                <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
                    <img src={lightboxImage} alt="Фото" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
                    <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50"><X className="w-7 h-7" /></button>
                </div>
            )}
        </MainLayout>
    );
};

export default Departments;