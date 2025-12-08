import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import { CalendarCheck, FileText, Download, ClipboardCheck, Loader2 } from 'lucide-react'; 
import examScheduleApi from '@/api/exam-schedule';
import type { ExamSchedule, GroupFile } from '@/api/exam-schedule';
import { BASE_URL } from '@/api/config';

const colorClasses = {
    blue: {
        bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700', border: 'border-blue-200', text: 'text-blue-800',
        from: 'from-blue-50', to: 'to-blue-100', linkBg: 'bg-blue-50', hoverLinkBg: 'hover:bg-blue-100',
        hoverLinkBorder: 'hover:border-blue-300', iconText: 'text-blue-600', downloadIcon: 'text-blue-500',
        hoverDownloadIcon: 'group-hover:text-blue-700',
        blockBg: 'bg-blue-50/50',
        blockBorder: 'border-blue-100',
    },
    green: {
        bg: 'bg-green-600', hoverBg: 'hover:bg-green-700', border: 'border-green-200', text: 'text-green-800',
        from: 'from-green-50', to: 'to-green-100', linkBg: 'bg-green-50', hoverLinkBg: 'hover:bg-green-100',
        hoverLinkBorder: 'hover:border-green-300', iconText: 'text-green-600', downloadIcon: 'text-green-500',
        hoverDownloadIcon: 'group-hover:text-green-700',
        blockBg: 'bg-green-50/50',
        blockBorder: 'border-green-100',
    },
    orange: {
        bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700', border: 'border-orange-200', text: 'text-orange-800',
        from: 'from-orange-50', to: 'to-orange-100', linkBg: 'bg-orange-50', hoverLinkBg: 'hover:bg-orange-100',
        hoverLinkBorder: 'hover:border-orange-300', iconText: 'text-orange-600', downloadIcon: 'text-orange-500',
        hoverDownloadIcon: 'group-hover:text-orange-700',
        blockBg: 'bg-orange-50/50',
        blockBorder: 'border-orange-100',
    },
    purple: {
        bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700', border: 'border-purple-200', text: 'text-purple-800',
        from: 'from-purple-50', to: 'to-purple-100', linkBg: 'bg-purple-50', hoverLinkBg: 'hover:bg-purple-100',
        hoverLinkBorder: 'hover:border-purple-300', iconText: 'text-purple-600', downloadIcon: 'text-purple-500',
        hoverDownloadIcon: 'group-hover:text-purple-700',
        blockBg: 'bg-purple-50/50',
        blockBorder: 'border-purple-100',
    },
};

const ExamSchedule = () => {
    const [activeTab, setActiveTab] = useState('1 курс');
    const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSchedules = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await examScheduleApi.getPublicAll();
            setSchedules(data);
        } catch (err) {
            console.error('Ошибка загрузки расписания экзаменов:', err);
            setError('Не удалось загрузить расписание экзаменов');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const getColorForCourse = (course: string): keyof typeof colorClasses => {
        const colorMap: Record<string, keyof typeof colorClasses> = {
            '1 курс': 'blue',
            '2 курс': 'green',
            '3 курс': 'orange',
            '4 курс': 'purple'
        };
        return colorMap[course] || 'blue';
    };

    const getGroupFileUrl = (groupName: string, course: string): string | null => {
        const courseSchedule = schedules.find(schedule => schedule.course === course);
        if (!courseSchedule) return null;

        const groupFile = courseSchedule.group_files?.find(gf => gf.groupName === groupName);
        if (groupFile) {
            return `${BASE_URL}/files/${groupFile.fileId}`;
        }
        return null;
    };

    // Берем курсы ТОЛЬКО из загруженных расписаний
    const scheduleCourses = schedules.map(s => s.course);
    
    // Формируем список курсов. Если расписаний нет вообще, показываем заглушки, но пустые внутри.
    const allUniqueCourses = Array.from(new Set([
        ...scheduleCourses, 
        '1 курс', '2 курс', '3 курс', '4 курс'
    ])).sort();

    const examData = allUniqueCourses.map(course => {
        // Ищем данные ТОЛЬКО из постов (админки)
        const courseSchedules = schedules.filter(schedule => schedule.course === course);
        const mainSchedule = courseSchedules[0];
        
        let displayPeriods: { date: string; groups: string[] }[] = [];
        
        if (mainSchedule && mainSchedule.groups && mainSchedule.groups.length > 0) {
            displayPeriods = mainSchedule.groups.map(g => ({
                date: g.date,
                groups: g.list
            }));
        } 
        // Если поста нет, displayPeriods остается пустым массивом []
        
        const displayTitle = mainSchedule ? mainSchedule.title : course;
        const groupFiles: GroupFile[] = mainSchedule?.group_files || [];
        
        return {
            id: course,
            title: displayTitle,
            courseName: course,
            periods: displayPeriods,
            file: mainSchedule?.files && mainSchedule.files.length > 0 
                ? `${BASE_URL}/files/${mainSchedule.files[0].id}`
                : mainSchedule?.file_url,
            groupFiles: groupFiles,
            color: getColorForCourse(course)
        };
    });

    if (isLoading) {
        return (
            <MainLayout>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                        <span className="text-lg text-gray-600">Загрузка расписания экзаменов...</span>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                    <div className="text-center py-20">
                        <div className="text-red-600 text-lg mb-4">{error}</div>
                        <Button onClick={() => { setIsLoading(true); fetchSchedules(); }} variant="outline">
                            Попробовать снова
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                    <ClipboardCheck className="w-10 h-10 mr-4 text-accent" />
                    Расписание экзаменов
                </h1>
                <p className="text-center text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
                    Актуальное расписание экзаменационной сессии для очного отделения.
                </p>

                <section className="mb-12">
                    <div className="flex justify-center flex-wrap gap-4 mb-6">
                        {examData.map((course) => {
                            const colors = colorClasses[course.color];
                            return (
                                <Button
                                    key={course.id}
                                    variant={activeTab === course.id ? 'default' : 'outline'}
                                    className={`text-lg font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-sm ${
                                        activeTab === course.id 
                                        ? `${colors.bg} ${colors.hoverBg} text-white shadow-lg scale-105` 
                                        : `text-gray-600 bg-white hover:bg-gray-100 border-gray-300`
                                    }`}
                                    onClick={() => setActiveTab(course.id)}
                                >
                                    {course.courseName}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="relative">
                        {examData.map((course) => {
                            const colors = colorClasses[course.color];
                            const hasFile = !!course.file;
                            const hasPeriods = course.periods.length > 0;

                            return (
                                <div 
                                    key={course.id}
                                    className={`transition-opacity duration-300 ${activeTab === course.id ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 w-full'}`}
                                    style={{ display: activeTab === course.id ? 'block' : 'none' }}
                                >
                                    <Card className={`${colors.border} shadow-lg overflow-hidden`}>
                                        <CardHeader className={`bg-gradient-to-br ${colors.from} ${colors.to} p-5 border-b ${colors.border}`}>
                                            <CardTitle className={`text-2xl font-bold ${colors.text}`}>
                                                {course.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 md:p-8 space-y-8">
                                            
                                            {/* 1. Блок общего файла */}
                                            {hasFile && (
                                                <div className="mb-8">
                                                    <a
                                                        href={course.file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center justify-between p-6 ${colors.linkBg} rounded-xl border-2 ${colors.border} ${colors.hoverLinkBg} ${colors.hoverLinkBorder} transition-all duration-300 group shadow-sm hover:shadow-md`}
                                                    >
                                                        <div className="flex items-center">
                                                            <FileText className={`w-8 h-8 mr-4 ${colors.iconText}`} />
                                                            <span className={`${colors.text} text-xl font-bold`}>Скачать общее расписание - {course.courseName}</span>
                                                        </div>
                                                        <Download className={`w-6 h-6 ${colors.downloadIcon} ${colors.hoverDownloadIcon} transition-colors`} />
                                                    </a>
                                                </div>
                                            )}

                                            {/* 2. Блок периодов и групп (Сетка Grid) */}
                                            {hasPeriods ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {course.periods.map((period, periodIndex) => (
                                                        <div 
                                                            key={periodIndex} 
                                                            className={`
                                                                rounded-2xl border-2 ${colors.blockBorder} ${colors.blockBg} 
                                                                p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300
                                                            `}
                                                        >
                                                            {/* Заголовок периода (Дата) */}
                                                            {period.date && (
                                                                <div className="flex items-center mb-6 pb-4 border-b border-gray-200/50">
                                                                    <CalendarCheck className={`w-6 h-6 mr-3 ${colors.iconText}`} />
                                                                    <h3 className={`font-bold text-gray-800 text-xl md:text-2xl`}>
                                                                        {period.date}
                                                                    </h3>
                                                                </div>
                                                            )}

                                                            {/* Кнопки групп */}
                                                            <div className="flex flex-wrap gap-4">
                                                                {period.groups.map((group) => {
                                                                    const groupFileUrl = getGroupFileUrl(group, course.id);
                                                                    return groupFileUrl ? (
                                                                        <a
                                                                            key={group}
                                                                            href={groupFileUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className={`
                                                                                flex-grow md:flex-grow-0 justify-center
                                                                                inline-flex items-center space-x-3 
                                                                                bg-white text-gray-800 border-2 border-gray-200 
                                                                                font-bold text-lg px-6 py-4 rounded-xl
                                                                                transition-all duration-200 
                                                                                hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 hover:shadow-md
                                                                            `}
                                                                            title={`Скачать расписание ${group}`}
                                                                        >
                                                                            <span>{group}</span>
                                                                            <Download size={20} className="opacity-70" />
                                                                        </a>
                                                                    ) : (
                                                                        <span
                                                                            key={group}
                                                                            className={`
                                                                                inline-block bg-white text-gray-600 border border-gray-200 
                                                                                font-semibold text-lg px-6 py-4 rounded-xl
                                                                                opacity-80
                                                                            `}
                                                                        >
                                                                            {group}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                !hasFile && (
                                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                                        <p className="text-gray-500 text-lg">
                                                            Расписание для {course.courseName} пока не добавлено
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default ExamSchedule;