// src/pages/Documents.tsx
import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { FileText, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import documentsApi from '@/api/documents';
import type { Document } from '@/api/documents';
import { BASE_URL } from '@/api/config';

// Импорты картинок
import doc from '../assets/pictures/doc.jpg';

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Начало загрузки документов...');
      
      // Используем getAll() вместо getPublicAll() чтобы получить все документы
      const data = await documentsApi.getAll();
      console.log('✅ Получены данные:', data);
      
      // Детальная информация о каждом документе
      data.forEach((doc, index) => {
        console.log(`📄 Документ ${index + 1}:`, {
          id: doc.id,
          title: doc.document_title,
          section: doc.section_title,
          is_published: doc.is_published,
          status: doc.is_published ? 'ОПУБЛИКОВАН' : 'ЧЕРНОВИК',
          files: doc.files?.length || 0,
          use_external_link: doc.use_external_link,
          publish_date: doc.publish_date
        });
      });
      
      setDocuments(data);
    } catch (error) {
      console.error('❌ Ошибка загрузки документов:', error);
      setError('Не удалось загрузить документы: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Группировка документов по разделам (только опубликованные)
  const groupedDocuments = documents
    .filter(doc => {
      const isPublished = doc.is_published;
      console.log(`🔍 Документ "${doc.document_title}": ${isPublished ? 'ОПУБЛИКОВАН' : 'ЧЕРНОВИК'}`);
      return isPublished;
    })
    .reduce((acc, doc) => {
      if (!acc[doc.section_title]) {
        acc[doc.section_title] = [];
      }
      acc[doc.section_title].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);

  console.log('📂 Сгруппированные документы:', groupedDocuments);
  console.log('🔢 Количество опубликованных разделов:', Object.keys(groupedDocuments).length);

  // Статические разделы для ссылок
  const staticSections = [
    {
      title: 'Документы об организации образовательного процесса и по обеспечению доступа в техникуме инвалидов и лиц с ограниченными возможностями здоровья',
      internalLink: '/accessible-environment'
    }
  ];

  // Предопределенный порядок разделов
  const sectionOrder = [
    'Организационные документы и приказы',
    'Образовательная деятельность',
    'Перевод студентов с платного обучения на бесплатное',
    'Воспитательная работа и социальная сфера',
    'Кадровое обеспечение образовательной деятельности',
    'Информационно-коммуникационное сопровождение деятельности техникума',
    'Финансово-хозяйственная деятельность техникума',
    'Административно-хозяйственное обеспечение деятельности техникума',
    'Формирование сведений о трудовой деятельности в электронном виде ("Электронная трудовая книжка")'
  ];

  const getFileUrl = (document: Document) => {
    if (document.use_external_link && document.external_link) {
      return document.external_link;
    }
    if (document.files && document.files.length > 0) {
      return `${BASE_URL}/files/${document.files[0].id}`;
    }
    return document.file_url;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-white rounded-lg shadow-sm border border-border p-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка документов...</p>
            <p className="text-sm text-gray-500 mt-2">Пожалуйста, подождите</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-white rounded-lg shadow-sm border border-border p-8">
          <div className="text-center py-8 text-red-600">
            <FileText className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium mb-2">Ошибка загрузки</p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchDocuments} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center mx-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Попробовать снова
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalDocuments = documents.length;
  const publishedDocuments = documents.filter(d => d.is_published).length;
  const draftDocuments = documents.filter(d => !d.is_published).length;
  const hasDocuments = Object.keys(groupedDocuments).length > 0;

  console.log('🎯 Итоговая статистика:', {
    totalDocuments,
    publishedDocuments,
    draftDocuments,
    hasDocuments
  });

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow-sm border border-border p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-8 text-center">Документы</h1>
        
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-4 md:p-8">
          {/* Картинка сверху */}
          <div className="w-full aspect-[16/6] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden shadow-lg mb-6 md:mb-8">
            <img
              src={doc}
              alt="Документы техникума"
              className="w-full h-full object-cover"
            />
          </div>

          {!hasDocuments ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {totalDocuments === 0 ? 'Документы не найдены' : 'Нет опубликованных документов'}
              </h3>
              <p className="text-gray-600 mb-4">
                {totalDocuments === 0 
                  ? 'На данный момент нет документов в системе.' 
                  : 'Все документы находятся в статусе черновика.'}
              </p>
              
              {draftDocuments > 0 && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-orange-700">
                    <strong>Внимание:</strong> В системе есть {draftDocuments} документ(ов) в черновике.
                    Для отображения на странице необходимо изменить их статус на "Опубликовано" в админ-панели.
                  </p>
                </div>
              )}
              
              <div className="text-sm text-gray-500 space-y-1">
                <p>• Проверьте статус публикации документов в админ-панели</p>
                <p>• Убедитесь, что переключатель "Опубликовать документ" включен</p>
                <p>• Сохраните изменения после редактирования документа</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {/* Отображаем сгруппированные документы из API в правильном порядке */}
              {sectionOrder.map((sectionTitle) => {
                const sectionDocs = groupedDocuments[sectionTitle];
                if (!sectionDocs || sectionDocs.length === 0) return null;

                console.log(`📂 Рендерим раздел "${sectionTitle}":`, sectionDocs.length, 'документов');

                return (
                  <div key={sectionTitle} className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                    <h2 className="text-lg md:text-xl font-semibold text-primary mb-4 md:mb-6 border-b border-primary/20 pb-3">
                      {sectionTitle} <span className="text-sm font-normal text-gray-500">({sectionDocs.length})</span>
                    </h2>
                    
                    <div className="space-y-3">
                      {sectionDocs.map((doc) => (
                        <a
                          key={doc.id}
                          href={getFileUrl(doc)}
                          target={doc.use_external_link ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50 hover:shadow-lg hover:scale-105 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 group"
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {doc.use_external_link ? (
                              <ExternalLink className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                            ) : (
                              <FileText className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-foreground font-medium group-hover:text-blue-600 transition-colors leading-relaxed break-words block">
                              {doc.document_title}
                            </span>
                            {doc.use_external_link && (
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                  Внешняя ссылка
                                </span>
                              </div>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Статические разделы с ссылками */}
              {staticSections.map((section, index) => (
                <div key={index} className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                  <Link to={section.internalLink}>
                    <h2 className="text-lg md:text-xl font-semibold text-primary hover:text-primary-hover hover:underline transition-all mb-4 md:mb-6 border-b border-primary/20 pb-3">
                      {section.title}
                    </h2>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Documents;