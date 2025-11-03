import { useState, useMemo } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, TrainFront, Bolt, HardHat, TrafficCone, Laptop, BookOpen, ChevronRight, X, ChevronLeft } from 'lucide-react';
import ob from '@/assets/pictures/ob.png';
import vag from '@/assets/pictures/vag.png';
import pm from '@/assets/pictures/pm.png';
import ad from '@/assets/pictures/ad.png';
import ct from '@/assets/pictures/ctpoitel.png';
import person from '@/assets/pictures/person.png';
import akimov from '@/assets/pictures/akimov1.png';
import perevozchikov from '@/assets/pictures/perevozchikov.png';
import tcykanova from '@/assets/pictures/tcykanova.png';
import gamachek from '@/assets/pictures/gamachek.png';

const Departments = () => {
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const departments = [
        {
            id: 1,
            name: 'Отделение технической эксплуатации подвижного состава ж/д',
            icon: TrainFront,
            color: 'blue', 
            specialties: [
                'Техническая эксплуатация подвижного состава железных дорог (электровозы, тепловозы)',
                'Техническая эксплуатация подвижного состава железных дорог (вагоны)'
            ],
            head: 'Ярцева О.Б',
            description: `Специальности:\n- Техническая эксплуатация подвижного состава железных дорог (электровозы, тепловозы);\n- Техническая эксплуатация подвижного состава железных дорог (вагоны).\n\nОтделение существует со дня образования техникума, с 1930 года... (и т.д., полный текст описания)`,
            departmentImage: vag,
            headPhoto: person,
            videoUrl: 'https://rutube.ru/video/98338d34561bd75e1d0504ab9a2e2808/'
        },
        {
            id: 2,
            name: 'Отделение электромеханики',
            icon: Bolt,
            color: 'yellow',
            specialties: [
                'Техническая эксплуатация ПТ, строительных, дорожных машин и оборудования',
                'Сварочное производство',
                'Электроснабжение'
            ],
            head: 'Акимов Р.С',
            description: `Специальности:\n- Техническая эксплуатация подъемно - транспортных, строительных, дорожных машин и оборудования (по отраслям);\n- Сварочное производство;\n- Электроснабжение.\n\nСпециальность – Путевые и строительные машины железнодорожного транспорта – так она называлась... (и т.д., полный текст описания)`,
            departmentImage: pm,
            headPhoto: akimov,
            videoUrl: 'https://rutube.ru/video/4f5729f0f402d2c74b6c63c9233a0b82/'
        },
        {
            id: 3,
            name: 'Строительное отделение',
            icon: HardHat,
            color: 'orange',
            specialties: [
                'Строительство железных дорог, путь и путевое хозяйство',
                'Строительство и эксплуатация зданий и сооружений'
            ],
            head: 'Перевозчиков В.В',
            description: `Специальности:\n- Строительство железных дорог, путь и путевое хозяйство;\n- Строительство и эксплуатация зданий и сооружений.\n\nСпециальность 08.02.10 «Строительство железных дорог, путь и путевое хозяйство» открыта в техникуме в 1990 году... (и т.д., полный текст описания)`,
            departmentImage: ct,
            headPhoto: perevozchikov,
            videoUrl: 'https://rutube.ru/video/bfb45668da5a62d3c20419dfe81959d5/'
        },
        {
            id: 4,
            name: 'Отделение автоматики и организации перевозок',
            icon: TrafficCone,
            color: 'green',
            specialties: [
                'Автоматика и телемеханика на транспорте (ж/д)',
                'Организация перевозок и управление на транспорте'
            ],
            head: 'Цуканова Т.В',
            description: `Специальности:\n- Автоматика и телемеханика на транспорте (на железнодорожном транспорте);\n- Организация перевозок и управление на транспорте (по видам).\n\nСпециальности «Автоматика и телемеханика на транспорте», «Организация перевозок и управление на транспорте» одни из молодых и престижных специальностей... (и т.д., полный текст описания)`,
            departmentImage: ad,
            headPhoto: tcykanova,
            videoUrl: 'https://rutube.ru/video/9b67567b44a0bd391b55ef9675bba3e0/'
        },
        {
            id: 5,
            name: 'Отделение информационных технологий и экономики',
            icon: Laptop,
            color: 'purple',
            specialties: [
                'Компьютерные системы и комплексы',
                'Техническая эксплуатация транспортного радиоэлектронного оборудования',
                'Экономика и бухгалтерский учет'
            ],
            head: 'Гамачек Т.В.',
            description: `Специальности:\n- Компьютерные системы и комплексы;\n- Техническая эксплуатация транспортного радиоэлектронного оборудования (по видам транспорта);\n- Экономика и бухгалтерский учет (по отраслям)\n\nПостроение и развитие информационного общества признается ведущей мировой тенденцией XXI в... (и т.д., полный текст описания)`,
            departmentImage: ob,
            headPhoto: gamachek,
            videoUrl: 'https://rutube.ru/video/9714e413cad2ff1d9a88116ebf3b78cb/'
        }
    ];


    const activeDepartment = useMemo(() => {
        if (selectedDepartment === null) return null;
        return departments.find(d => d.id === selectedDepartment);
    }, [selectedDepartment, departments]);

    const openDescriptionModal = (deptId: number) => {
        setSelectedDepartment(deptId);
        setIsDescriptionOpen(true);
    };
    

    const renderDescription = (description: string) => {
        const headings = [
            'Специальности:',
            'Возглавляет отделение', 
        ];
        
        const paragraphs = description.split('\n\n');
        
        return paragraphs.map((paragraph, pIndex) => {
            const isHeading = headings.some(h => paragraph.startsWith(h) && paragraph.length < 100); 
            if (paragraph.startsWith('Специальности:\n-')) {
                const items = paragraph.split('\n'); 
                const title = items.shift(); 
                return (
                    <div key={pIndex} className="my-5">
                        <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {items.map((item, iIndex) => (
                                <li key={iIndex}>{item.substring(2).trim()}</li> 
                            ))}
                        </ul>
                    </div>
                );
            }
            
            if (isHeading) {
                return (
                    <h3 key={pIndex} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                        {paragraph}
                    </h3>
                );
            }
            
            return (
                <p key={pIndex} className="text-gray-700 leading-relaxed text-justify text-base mb-4">
                    {paragraph}
                </p>
            );
        });
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
            {/* 2. ВЕСЬ КОНТЕНТ (который был внутри <main>) ПЕРЕНОСИМ СЮДА */}
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                    <BookOpen className="w-10 h-10 mr-4 text-accent" />
                    Наши отделения
                </h1>
                <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
                    Исследуйте наши передовые отделения и специальности, которые формируют будущее железнодорожного транспорта и смежных отраслей.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> 
                    {departments.map((dept) => {
                        const IconComponent = dept.icon;
                        const theme = colors[dept.color as keyof typeof colors] || colors.blue;

                        return (
                            <div 
                                key={dept.id} 
                                className={`relative ${theme.gradient} rounded-2xl shadow-lg border ${theme.border} p-6
                                            transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl 
                                            flex flex-col group overflow-hidden`}
                            >
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
                                        <h2 className={`text-2xl font-bold ${theme.text} leading-tight`}>{dept.name}</h2>
                                    </div>

                                    <div 
                                        className="flex items-center space-x-4 mb-6 bg-white/60 p-4 rounded-lg border border-gray-100 shadow-sm cursor-pointer group/avatar"
                                        onClick={(e) => { e.stopPropagation(); setLightboxImage(dept.headPhoto); }}
                                    >
                                        <div className="w-32 h-40 rounded-lg overflow-hidden flex-shrink-0 border-2 border-white shadow">
                                            <img 
                                                src={dept.headPhoto} 
                                                alt={dept.head} 
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Заведующий:</p>
                                            <p className={`text-lg font-semibold ${theme.text}`}>{dept.head}</p>
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
                                        <Button 
                                            onClick={() => openDescriptionModal(dept.id)}
                                            variant="outline"
                                            className={`${theme.buttonOutline} bg-white/80 px-5 py-2.5 text-sm rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto flex items-center justify-center`}
                                        >
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            Подробнее
                                        </Button>
                                        <Button 
                                            onClick={(e) => { e.stopPropagation(); window.open(dept.videoUrl, '_blank'); }}
                                            className={`${theme.buttonBg} ${theme.hoverBgColor} text-white px-5 py-2.5 text-sm rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto flex items-center justify-center`}
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Визитка
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Модальное окно с описанием отделения */}
            <Dialog open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                <DialogContent className="max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl bg-white">
                    {activeDepartment && (
                        <>
                            <DialogHeader className="text-center pb-4 border-b border-gray-200 mb-6 relative">
                                {activeDepartment.icon && (
                                    <div className={`mx-auto w-16 h-16 bg-gradient-to-br from-${activeDepartment.color}-100 to-${activeDepartment.color}-200 rounded-full p-3 shadow-lg border-4 border-white flex items-center justify-center`}>
                                        <activeDepartment.icon className={`w-8 h-8 text-${activeDepartment.color}-600`} />
                                    </div>
                                )}
                                <DialogTitle className="text-3xl font-extrabold text-primary pt-4">
                                    {activeDepartment.name}
                                </DialogTitle>
                                <p className="text-lg text-muted-foreground mt-2">{activeDepartment.head}</p>
                            </DialogHeader>
                            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-4">
                                {renderDescription(activeDepartment.description)}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            
            {/* Лайтбокс для фото заведующего */}
            {lightboxImage && (
                <div 
                    className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4" 
                    onClick={() => setLightboxImage(null)} 
                >
                    <img 
                        src={lightboxImage} 
                        alt="Фото заведующего" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()} 
                    />
                    <button 
                        onClick={() => setLightboxImage(null)} 
                        className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
                    >
                        <X className="w-7 h-7" />
                    </button>
                </div>
            )}
        </MainLayout>
    );
};

export default Departments;