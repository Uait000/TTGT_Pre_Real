import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    ExternalLink, 
    Download, 
    FileText, 
    CalendarDays, 
    Smartphone,
    Search,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scheduleApi, type ScheduleData } from '@/api/schedule';
import documentsApi from '@/api/documents';
import { useToast } from '@/hooks/use-toast';
import { BASE_URL } from '@/api/config';
import { settingsApi } from '@/api/settings';

interface ScheduleTab {
  course: string;
  groups: string[];
}

const Schedule = () => {
    const [scheduleData, setScheduleData] = useState<ScheduleData>({ 
      courses: { '1': [], '2': [], '3': [], '4': [] }, 
      teachers: [] 
    });
    const [scheduleTabs, setScheduleTabs] = useState<ScheduleTab[]>([]);
    const [activeTab, setActiveTab] = useState<string>('');
    const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [loadingSchedule, setLoadingSchedule] = useState<string | null>(null);
    const [apiAvailable, setApiAvailable] = useState(true);
    
    const [generalDocuments, setGeneralDocuments] = useState<any[]>([]);
    const [correspondenceDocuments, setCorrespondenceDocuments] = useState<any[]>([]);
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const [sessionPeriod, setSessionPeriod] = useState('c 15 сентября 2025 г. по 27 сентября 2025 г.:');

    const { toast } = useToast();

    const loadScheduleData = async () => {
        setIsLoading(true);
        try {
            const data = await scheduleApi.getScheduleData();
            setScheduleData(data);
            setApiAvailable(true);
            
            console.log('📊 Формируем вкладки из данных:', data);
            
            const tabs: ScheduleTab[] = [];
            
            if (data.courses) {
              Object.entries(data.courses).forEach(([courseNumber, groups]) => {
                if (Array.isArray(groups) && groups.length > 0) {
                  tabs.push({
                    course: `${courseNumber} курс`,
                    groups: groups
                  });
                }
              });
            }
            
            if (Array.isArray(data.teachers) && data.teachers.length > 0) {
              tabs.push({
                course: 'Преподавателям',
                groups: data.teachers
              });
            }
            
            console.log('📑 Созданные вкладки:', tabs);
            setScheduleTabs(tabs);
            
            if (tabs.length > 0 && !activeTab) {
              setActiveTab(tabs[0].course);
            } else if (tabs.length === 0) {
              setActiveTab('1 курс');
            }
            
        } catch (error) {
            console.error('❌ Ошибка загрузки данных расписания:', error);
            setApiAvailable(false);
            setScheduleData({ 
              courses: { '1': [], '2': [], '3': [], '4': [] }, 
              teachers: [] 
            });
            setScheduleTabs([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Загрузка документов
    const loadDocuments = async () => {
      setDocumentsLoading(true);
      try {
        console.log('🔄 Начинаем загрузку документов...');
        
        let allDocuments = [];
        
        // Пробуем сначала админский endpoint
        try {
          console.log('📥 Пробуем загрузить через getAll (админский)...');
          allDocuments = await documentsApi.getAll();
          console.log('✅ getAll успешно:', allDocuments.length, 'документов');
          
          // Фильтруем только опубликованные документы
          allDocuments = allDocuments.filter(doc => doc.is_published === true);
          console.log('✅ После фильтрации опубликованных:', allDocuments.length, 'документов');
          
        } catch (adminError) {
          console.log('❌ getAll не сработал, пробуем getPublicAll...');
          try {
            allDocuments = await documentsApi.getPublicAll();
            console.log('✅ getPublicAll успешно:', allDocuments.length, 'документов');
          } catch (publicError) {
            console.error('❌ Оба метода не сработали:', publicError);
            allDocuments = [];
          }
        }

        console.log('📄 Все загруженные документы:', allDocuments);

        // ФИЛЬТРАЦИЯ ДОКУМЕНТОВ
        const generalDocs = allDocuments.filter(doc => {
          if (!doc) return false;
          
          // Проверяем наличие файла
          const hasFile = doc.file_url || (doc.files && doc.files.length > 0);
          if (!hasFile) {
            console.log('❌ Документ без файла:', doc.document_title || doc.title);
            return false;
          }
          
          const sectionTitle = (doc.section_title || '').toLowerCase();
          const docTitle = (doc.document_title || doc.title || '').toLowerCase();
          
          // Общие документы - все, что НЕ относится к заочному отделению
          const isGeneral = !sectionTitle.includes('заоч') && 
                           !sectionTitle.includes('сесси') && 
                           !sectionTitle.includes('график') &&
                           !docTitle.includes('заоч') &&
                           !docTitle.includes('сесси') &&
                           !docTitle.includes('график') &&
                           !docTitle.match(/\(\w\)$/);
          
          if (isGeneral) {
            console.log('✅ Общий документ:', docTitle);
          }
          
          return isGeneral;
        });

        const correspondenceDocs = allDocuments.filter(doc => {
          if (!doc) return false;
          
          // Проверяем наличие файла
          const hasFile = doc.file_url || (doc.files && doc.files.length > 0);
          if (!hasFile) {
            return false;
          }
          
          const sectionTitle = (doc.section_title || '').toLowerCase();
          const docTitle = (doc.document_title || doc.title || '').toLowerCase();
          
          // Документы заочного отделения
          const isCorrespondence = sectionTitle.includes('заоч') || 
                                  sectionTitle.includes('сесси') ||
                                  sectionTitle.includes('график') ||
                                  docTitle.includes('заоч') ||
                                  docTitle.includes('сесси') ||
                                  docTitle.includes('график') ||
                                  docTitle.match(/\(\w\)$/);
          
          if (isCorrespondence) {
            console.log('✅ Документ заочного отделения:', docTitle);
          }
          
          return isCorrespondence;
        });

        console.log('📊 Результаты фильтрации:', {
          general: generalDocs.length,
          correspondence: correspondenceDocs.length
        });

        setGeneralDocuments(generalDocs);
        setCorrespondenceDocuments(correspondenceDocs);
        
      } catch (error) {
        console.error('❌ Критическая ошибка загрузки документов:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить документы',
          variant: 'destructive'
        });
        setGeneralDocuments([]);
        setCorrespondenceDocuments([]);
      } finally {
        setDocumentsLoading(false);
      }
    };

    // Загрузка периода сессии из настроек
    const loadSessionPeriod = async () => {
      try {
        const settings = await settingsApi.getScheduleSettings();
        setSessionPeriod(settings.session_period);
        console.log('📅 Период сессии загружен:', settings.session_period);
      } catch (error) {
        console.error('❌ Ошибка загрузки периода сессии:', error);
      }
    };

    useEffect(() => {
        loadScheduleData();
        loadDocuments();
        loadSessionPeriod();
    }, []);

    const handleScheduleClick = async (name: string) => {
        setLoadingSchedule(name);
        try {
            const url = scheduleApi.getScheduleUrl(name);
            console.log('🔗 Открываем расписание:', url);
            window.open(url, '_blank');
        } catch (error) {
            console.error('❌ Ошибка открытия расписания:', error);
        } finally {
            setLoadingSchedule(null);
        }
    };

    const getFilteredTeachers = () => {
        const teacherTab = scheduleTabs.find(tab => tab.course === 'Преподавателям');
        if (!teacherTab) return [];
        
        return teacherTab.groups.filter(teacher => 
            teacher.toLowerCase().includes(teacherSearchQuery.toLowerCase())
        );
    };

    const getActiveCourseGroups = () => {
      if (!activeTab) return [];
      
      const activeTabData = scheduleTabs.find(tab => tab.course === activeTab);
      return activeTabData ? activeTabData.groups : [];
    };

    // Вспомогательные функции для получения URL файла
    const getFileUrl = (doc: any) => {
      if (doc.file_url) return doc.file_url;
      if (doc.files && doc.files.length > 0 && doc.files[0].url) {
        return doc.files[0].url;
      }
      if (doc.files && doc.files.length > 0 && doc.files[0].id) {
        return `${BASE_URL}/files/${doc.files[0].id}`;
      }
      return '';
    };

    // Вспомогательные функции для получения названия документа
    const getDocumentTitle = (doc: any) => {
      return doc.document_title || doc.title || 'Документ';
    };

    // Вспомогательные функции для фильтрации документов
    const getGeneralDocuments = () => {
      return generalDocuments.filter(doc => {
        if (!doc) return false;
        const fileUrl = getFileUrl(doc);
        return fileUrl && fileUrl !== '';
      });
    };

    const getCorrespondenceGraphs = () => {
      return correspondenceDocuments.filter(doc => {
        if (!doc) return false;
        const sectionTitle = (doc.section_title || '').toLowerCase();
        const docTitle = (doc.document_title || doc.title || '').toLowerCase();
        const fileUrl = getFileUrl(doc);
        
        return (sectionTitle.includes('график') || docTitle.includes('график')) && 
               fileUrl && fileUrl !== '';
      });
    };

    const getCorrespondenceSchedules = () => {
      return correspondenceDocuments.filter(doc => {
        if (!doc) return false;
        const sectionTitle = (doc.section_title || '').toLowerCase();
        const docTitle = (doc.document_title || doc.title || '').toLowerCase();
        const fileUrl = getFileUrl(doc);
        
        return (sectionTitle.includes('сесси') || 
                docTitle.includes('сесси') ||
                docTitle.match(/\(\w\)$/)) && 
               fileUrl && fileUrl !== '';
      });
    };

    const totalGroups = scheduleData.courses ? 
      Object.values(scheduleData.courses).flat().length : 0;
    const totalTeachers = Array.isArray(scheduleData.teachers) ? 
      scheduleData.teachers.length : 0;
    const totalItems = totalGroups + totalTeachers;

    const activeGroups = getActiveCourseGroups();
    const filteredTeachers = getFilteredTeachers();
    const isTeacherTab = activeTab === 'Преподавателям';
    const itemsToShow = isTeacherTab ? filteredTeachers : activeGroups;

    if (isLoading) {
        return (
            <MainLayout>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                        <p className="text-lg text-gray-600">Загрузка расписания...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
                        <CalendarDays className="w-10 h-10 mr-4 text-accent" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                            Расписание занятий
                        </h1>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                          loadScheduleData();
                          loadDocuments();
                          loadSessionPeriod();
                        }}
                        disabled={isLoading || documentsLoading}
                        className="flex items-center gap-2 self-center"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Обновить
                    </Button>
                </div>

                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CalendarDays className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-800 font-semibold">Группы</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{totalGroups}</p>
                        <p className="text-sm text-blue-600">учебных групп</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-semibold">Преподаватели</span>
                        </div>
                        <p className="text-2xl font-bold text-green-700">{totalTeachers}</p>
                        <p className="text-sm text-green-600">преподавателей</p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-purple-600" />
                            <span className="text-purple-800 font-semibold">Всего</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-700">{totalItems}</p>
                        <p className="text-sm text-purple-600">расписаний</p>
                    </div>
                </div>

                {!apiAvailable && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-red-800">API расписания недоступно</h3>
                                <p className="text-red-700 text-sm">
                                    Не удалось загрузить данные расписания. Пожалуйста, попробуйте позже.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

<section className="mb-12 bg-gradient-to-r from-primary to-blue-700 rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between text-white">
    <div className="flex items-center mb-4 md:mb-0">
        <Smartphone className="w-12 h-12 mr-5 flex-shrink-0" />
        <div>
            <h2 className="text-2xl font-bold">Расписание всегда под рукой!</h2>
            <p className="text-blue-100">Скачайте наше приложение, чтобы отслеживать замены и расписание в реальном времени.</p>
        </div>
    </div>

    {/* --- НАЧАЛО ИЗМЕНЕНИЙ --- */}
    {/* Оборачиваем кнопки в div с flex-col и gap-3 */}
    <div className="flex flex-col gap-3 w-full md:w-auto"> 
        <Button 
            variant="secondary" 
            className="bg-white text-primary hover:bg-gray-100 font-semibold shadow-md transition-transform transform hover:scale-105 w-full"
            onClick={() => window.open('https://schedulettgt-static.website.yandexcloud.net/', '_blank')}
        >
            <Download className="w-5 h-5 mr-2" />
            Приложение веб
        </Button>

        <Button 
            variant="secondary" 
            className="bg-white text-primary hover:bg-gray-100 font-semibold shadow-md transition-transform transform hover:scale-105 w-full"
            onClick={() => window.open('https://ttgt-api-isxb.onrender.com/schedule/android/download', '_blank')}
        >
            <Download className="w-5 h-5 mr-2" />
            Скачать приложение apk
        </Button>
    </div>
    {/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */}

</section>

                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Очное отделение</h2>
                    
                    <div className="flex justify-center flex-wrap gap-2 mb-6">
                        {['1 курс', '2 курс', '3 курс', '4 курс', 'Преподавателям'].map((courseName) => (
                            <Button
                                key={courseName}
                                variant={activeTab === courseName ? 'default' : 'outline'}
                                className={`text-lg font-semibold py-3 px-6 rounded-full transition-all duration-300 ${
                                    activeTab === courseName 
                                    ? 'bg-primary text-white shadow-lg scale-105' 
                                    : 'text-gray-600 bg-white hover:bg-gray-100'
                                }`}
                                onClick={() => {
                                    setActiveTab(courseName);
                                    setTeacherSearchQuery(''); 
                                }}
                            >
                                {courseName}
                            </Button>
                        ))}
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 min-h-[200px]">
                        {isTeacherTab && (
                            <div className="mb-6 max-w-lg mx-auto">
                                <label htmlFor="teacher-search" className="sr-only">Поиск по фамилии</label>
                                <div className="relative rounded-full shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="search"
                                        name="teacher-search"
                                        id="teacher-search"
                                        className="block w-full border-gray-300 rounded-full pl-11 pr-4 py-3 text-base focus:ring-primary focus:border-primary"
                                        placeholder="Поиск по фамилии"
                                        value={teacherSearchQuery}
                                        onChange={(e) => setTeacherSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div className="flex flex-wrap gap-3 justify-center">
                            {itemsToShow.length > 0 ? (
                                itemsToShow.map((item) => {
                                    const isLoadingItem = loadingSchedule === item;
                                    
                                    return (
                                        <button
                                            key={item}
                                            onClick={() => handleScheduleClick(item)}
                                            disabled={isLoadingItem}
                                            className={`
                                                inline-flex items-center justify-center font-semibold px-5 py-2.5 rounded-lg text-base
                                                transition-all duration-300 shadow-sm border-2
                                                hover:scale-105 hover:shadow-md relative
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                bg-white text-gray-800 border-blue-200 hover:bg-blue-50 hover:border-blue-300
                                            `}
                                            title={`Открыть расписание для ${item}`}
                                        >
                                            {isLoadingItem ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Загрузка...
                                                </>
                                            ) : (
                                                <>
                                                    {item}
                                                    <CheckCircle2 className="w-4 h-4 ml-2 text-blue-600" />
                                                </>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 w-full">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">
                                        {isTeacherTab 
                                            ? teacherSearchQuery 
                                                ? 'Преподаватель не найден' 
                                                : 'Нет данных о преподавателях'
                                            : `Нет данных для ${activeTab.toLowerCase()}`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Общие документы и графики</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documentsLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="flex items-center justify-between p-5 bg-gray-50 rounded-lg border-2 border-gray-200 animate-pulse">
                                    <div className="flex items-center">
                                        <FileText className="w-6 h-6 mr-3 text-gray-300" />
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    </div>
                                    <Download className="w-5 h-5 text-gray-300" />
                                </div>
                            ))
                        ) : getGeneralDocuments().length > 0 ? (
                            getGeneralDocuments().map((doc) => {
                                const fileUrl = getFileUrl(doc);
                                const title = getDocumentTitle(doc);
                                
                                return (
                                    <a
                                        key={doc.id}
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-5 bg-blue-50 rounded-lg border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center">
                                            <FileText className="w-6 h-6 mr-3 text-blue-600" />
                                            <span className="text-blue-800 font-semibold">{title}</span>
                                        </div>
                                        <Download className="w-5 h-5 text-blue-500 group-hover:text-blue-700 transition-colors" />
                                    </a>
                                );
                            })
                        ) : (
                            <div className="md:col-span-2 text-center py-8">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Нет доступных документов</p>
                                {!documentsLoading && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        Всего документов в системе: {generalDocuments.length}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Заочное отделение</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <Card className="border-gray-200 shadow-md">
                            <CardHeader className="bg-gray-50 p-5 border-b border-gray-200">
                                <CardTitle className="text-xl font-semibold text-gray-800">Учебные графики</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3">
                                {documentsLoading ? (
                                    Array.from({ length: 2 }).map((_, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
                                            <div className="flex items-center">
                                                <FileText className="w-5 h-5 mr-3 text-gray-300" />
                                                <div className="h-4 bg-gray-200 rounded w-40"></div>
                                            </div>
                                            <ExternalLink className="w-5 h-5 text-gray-300" />
                                        </div>
                                    ))
                                ) : getCorrespondenceGraphs().length > 0 ? (
                                    getCorrespondenceGraphs().map((doc) => {
                                        const fileUrl = getFileUrl(doc);
                                        const title = getDocumentTitle(doc);
                                        
                                        return (
                                            <a
                                                key={doc.id}
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-primary/50 transition-all duration-300 group"
                                            >
                                                <div className="flex items-center">
                                                    <FileText className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary transition-colors" />
                                                    <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                                                        {title}
                                                    </span>
                                                </div>
                                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                            </a>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">Нет доступных учебных графиков</p>
                                        {!documentsLoading && (
                                            <p className="text-sm text-gray-400 mt-1">
                                                Всего документов заочного отделения: {correspondenceDocuments.length}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 shadow-md">
                            <CardHeader className="bg-gray-50 p-5 border-b border-gray-200">
                                <CardTitle className="text-xl font-semibold text-gray-800">Расписание сессий</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <p className="text-gray-600 mb-4 font-medium">{sessionPeriod}</p>
                                <div className="flex flex-wrap gap-2">
                                    {documentsLoading ? (
                                        Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="inline-block bg-gray-100 border border-gray-200 font-medium px-4 py-2 rounded-full text-sm animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            </div>
                                        ))
                                    ) : getCorrespondenceSchedules().length > 0 ? (
                                        getCorrespondenceSchedules().map((doc) => {
                                            const fileUrl = getFileUrl(doc);
                                            const title = getDocumentTitle(doc);
                                            
                                            return (
                                                <a
                                                    key={doc.id}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block bg-white text-primary border border-gray-300 font-medium px-4 py-2 rounded-full text-sm 
                                                                    transition-all duration-200 shadow-sm 
                                                                    hover:bg-primary hover:text-white hover:border-primary hover:scale-105 hover:shadow-md"
                                                >
                                                    {title}
                                                </a>
                                            );
                                        })
                                    ) : (
                                        <div>
                                            <p className="text-gray-500">Нет доступных расписаний сессий</p>
                                            {!documentsLoading && (
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Всего документов заочного отделения: {correspondenceDocuments.length}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default Schedule;