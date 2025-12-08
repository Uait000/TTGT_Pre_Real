import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, FileText, ArrowRight } from 'lucide-react';
import { settingsApi } from '@/api/settings';

// Дефолтные импорты картинок
import cont from '@/assets/pictures/kursis/cont.jpg';
import rasp1 from '@/assets/pictures/kursis/rasp.jpg';
import dist from '@/assets/pictures/kursis/dist.jpg';
import docum from '@/assets/pictures/kursis/docum.jpg';
import dopobr from '@/assets/pictures/kursis/dopobr.jpg';
import programm from '@/assets/pictures/kursis/programm.jpg';
import ob from '@/assets/pictures/kursis/ob.jpg';
import money from '@/assets/pictures/kursis/money.jpg';
import za from '@/assets/pictures/kursis/za.jpg';
import dogovor from '@/assets/pictures/kursis/dogovor.jpg';

// Дефолтные документы
import rasp from '@/assets/file/kurs/Kal_Grafik_ODPO_25_26.pdf';
import perh from '@/assets/file/kurs/Perehen_i_stoim_obuch_celevikov_2024_2025.pdf';

const DEFAULT_COURSE_ITEMS = [
  { 
    id: 1, 
    name: 'Расписание', 
    image: rasp1, 
    url: rasp, 
    modalId: '',
    modalContent: {
      title: 'Расписание',
      content: '',
      documents: []
    }
  },
  { 
    id: 2, 
    name: 'Документы', 
    image: docum, 
    modalId: 'documents',
    modalContent: {
      title: 'Документы',
      content: '',
      documents: []
    }
  },
  { 
    id: 3, 
    name: 'Объявление', 
    image: ob, 
    modalId: 'announcement',
    modalContent: {
      title: 'Объявление',
      content: '',
      documents: []
    }
  },
  { 
    id: 4, 
    name: 'Дистанционное обучение', 
    image: dist, 
    url: 'http://дистанционное24.рф/', 
    modalId: '',
    modalContent: {
      title: 'Дистанционное обучение',
      content: '',
      documents: []
    }
  },
  { 
    id: 5, 
    name: 'Об отделении дополнительного профессионального образования', 
    image: dopobr, 
    modalId: 'about',
    modalContent: {
      title: 'Об отделении дополнительного профессионального образования',
      content: '',
      documents: []
    }
  },
  { 
    id: 6, 
    name: 'Контакты', 
    image: cont, 
    modalId: 'contacts',
    modalContent: {
      title: 'Контакты',
      content: '',
      documents: []
    }
  },
  { 
    id: 7, 
    name: 'Программы профессионального обучения', 
    image: programm, 
    modalId: 'programs',
    modalContent: {
      title: 'Программы профессионального обучения',
      content: '',
      documents: []
    }
  },
  { 
    id: 8, 
    name: 'Стоимость услуг', 
    image: money, 
    modalId: 'cost',
    modalContent: {
      title: 'Стоимость услуг',
      content: '',
      documents: []
    }
  }, 
  { 
    id: 9, 
    name: 'Заявление', 
    image: za, 
    modalId: 'application',
    modalContent: {
      title: 'Заявление',
      content: '',
      documents: []
    }
  },
  { 
    id: 10, 
    name: 'Договор на обучение', 
    image: dogovor, 
    modalId: 'contract',
    modalContent: {
      title: 'Договор на обучение',
      content: '',
      documents: []
    }
  }
];

const DEFAULT_TARGET_PREPARATION = {
  title: 'Целевая подготовка студентов',
  url: perh
};

const DEFAULT_COURSES_DATA = {
  items: DEFAULT_COURSE_ITEMS,
  target_preparation: DEFAULT_TARGET_PREPARATION
};

const DocLink = ({ href = "#", children }: { href?: string, children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 text-primary hover:underline group"
  >
    <FileText className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
    <span>{children}</span>
  </a>
);

const Courses = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', content: <></> });
  const [coursesData, setCoursesData] = useState(DEFAULT_COURSES_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('📥 Загрузка данных курсов...');
        
        const data = await settingsApi.getPageData('courses_page');
        console.log('✅ Данные курсов загружены:', data);
        
        if (data && data.items) {
          // Объединяем данные с дефолтными, чтобы сохранить функциональность
          // Если элементов в базе меньше или у них нет картинок, берем из дефолтных по индексу или ID
          const mergedItems = data.items.map((item: any, index: number) => {
            // Ищем дефолтный элемент по ID, если он есть, или по индексу
            const defaultItem = DEFAULT_COURSE_ITEMS.find(d => d.id === item.id) || DEFAULT_COURSE_ITEMS[index] || {};
            
            return {
              ...defaultItem,
              ...item,
              // Сохраняем оригинальные URL и modalId если они не заданы в админке
              url: item.url || defaultItem.url,
              modalId: item.modalId || defaultItem.modalId,
              // Используем дефолтные изображения если в админке не загружены
              image: item.image || defaultItem.image,
              // Объединяем modalContent
              modalContent: {
                ...defaultItem.modalContent,
                ...(item.modalContent || {}),
                // Объединяем документы (если в базе их нет, оставляем дефолтные пустые или берем из базы)
                documents: (item.modalContent?.documents && item.modalContent.documents.length > 0) 
                  ? item.modalContent.documents 
                  : (defaultItem.modalContent?.documents || [])
              }
            };
          });
          
          // Если в базе элементов меньше, чем в дефолтных, добавляем оставшиеся дефолтные (опционально, но для сохранения верстки лучше оставить)
          if (mergedItems.length < DEFAULT_COURSE_ITEMS.length) {
             const existingIds = new Set(mergedItems.map((i: any) => i.id));
             DEFAULT_COURSE_ITEMS.forEach(defItem => {
                 if (!existingIds.has(defItem.id)) {
                     mergedItems.push(defItem);
                 }
             });
             // Сортируем по ID, чтобы порядок сохранился
             mergedItems.sort((a: any, b: any) => a.id - b.id);
          }
          
          setCoursesData({
            items: mergedItems,
            target_preparation: data.target_preparation || DEFAULT_TARGET_PREPARATION
          });
        } else {
          // Используем дефолтные данные если нет сохраненных
          setCoursesData(DEFAULT_COURSES_DATA);
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки данных курсов:', error);
        // При ошибке используем дефолтные данные
        setCoursesData(DEFAULT_COURSES_DATA);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const getModalContent = (modalContent: any) => {
    if (modalContent && (modalContent.title || modalContent.content)) {
      return {
        title: modalContent.title || 'Информация',
        content: (
          <div className="space-y-4">
            {/* Добавлен класс rich-text-content */}
            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: modalContent.content }} />
            {modalContent.documents && modalContent.documents.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Документы для скачивания:</h4>
                {modalContent.documents.map((doc: any, index: number) => (
                  <DocLink key={index} href={doc.url}>
                    {doc.title}
                  </DocLink>
                ))}
              </div>
            )}
          </div>
        )
      };
    }

    // Статичный контент по умолчанию
    return {
      title: 'Информация',
      content: (
        <div className="space-y-4">
            <p className="text-muted-foreground">Содержание будет доступно после заполнения через админ-панель.</p>
        </div>
      )
    };
  };

  const handleItemClick = (item: any) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else if (item.modalId || item.modalContent) {
      const content = getModalContent(item.modalContent);
      setModalData(content);
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg">Загрузка данных...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm border border-border p-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">Курсы</h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesData.items.slice(0, 9).map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group text-left w-full"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-4 text-center text-sm leading-tight group-hover:text-primary transition-colors h-8">
                  {item.name}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-primary group-hover:text-primary-hover transition-colors">
                  {item.url ? (
                    <>
                      <span className="text-sm font-medium">Перейти</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium">Открыть</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {coursesData.items.length > 9 && (
            <div className="w-full">
                <button
                onClick={() => handleItemClick(coursesData.items[9])}
                className="block w-full bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-border/50 p-8 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="aspect-square bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg overflow-hidden">
                    <img 
                        src={coursesData.items[9].image} 
                        alt={coursesData.items[9].name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    </div>
                    <div className="lg:col-span-2 text-center lg:text-left">
                    <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                        {coursesData.items[9].name}
                    </h3>
                    <div className="flex items-center justify-center lg:justify-start space-x-2 text-primary group-hover:text-primary-hover transition-colors">
                        <span className="font-medium">Открыть</span>
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    </div>
                </div>
                </button>
            </div>
          )}

          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
            <a
              href={coursesData.target_preparation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {coursesData.target_preparation.title}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-primary group-hover:text-primary-hover transition-colors">
                  <span className="font-medium">Подробнее</span>
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{modalData.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 pr-3">
            {modalData.content}
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Courses;