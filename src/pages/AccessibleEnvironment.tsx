// src/pages/AccessibleEnvironment.tsx
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { FileText, Download, Info, Loader2, RefreshCw } from 'lucide-react';
import accessibleEnvironmentApi, { ACCESSIBLE_ENV_SECTIONS, type AccessibleEnvironmentDocument } from '@/api/accessible-environment';
import { BASE_URL } from '@/api/config';
import { Button } from '@/components/ui/button';

import dost from '@/assets/pictures/Gos_programma.png';

const AccessibleEnvironment = () => {
  const [documents, setDocuments] = useState<AccessibleEnvironmentDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для загрузки документов
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Начало загрузки документов доступной среды...');
      
      // Пробуем сначала получить через публичный API
      let accessibleEnvDocs: AccessibleEnvironmentDocument[] = [];
      
      try {
        accessibleEnvDocs = await accessibleEnvironmentApi.getPublicAll();
        console.log('✅ Данные получены через публичный API:', accessibleEnvDocs.length);
      } catch (publicError) {
        console.log('⚠️ Публичный API не доступен, пробуем через админский...');
        // Если публичный не работает, пробуем через админский (только опубликованные)
        accessibleEnvDocs = await accessibleEnvironmentApi.getAll();
        // Фильтруем только опубликованные для публичной страницы
        accessibleEnvDocs = accessibleEnvDocs.filter(doc => doc.is_published);
        console.log('✅ Данные получены через админский API:', accessibleEnvDocs.length);
      }
      
      console.log('📋 Загруженные документы:', accessibleEnvDocs);
      setDocuments(accessibleEnvDocs);
      
    } catch (err) {
      console.error('❌ Ошибка загрузки документов доступной среды:', err);
      setError('Не удалось загрузить документы. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Группируем документы по разделам
  const groupedDocuments = ACCESSIBLE_ENV_SECTIONS.map(section => ({
    title: section,
    documents: documents.filter(doc => doc.section_title === section)
  }));

  console.log('📊 Сгруппированные документы:', groupedDocuments);

  // Функция для получения URL файла
  const getFileUrl = (document: AccessibleEnvironmentDocument) => {
    if (document.use_external_link && document.external_link) {
      return document.external_link;
    }
    if (document.files && document.files.length > 0) {
      return `${BASE_URL}/files/${document.files[0].id}`;
    }
    return document.file_url;
  };

  if (error) {
    return (
      <MainLayout>
        <div className="bg-white rounded-xl shadow-lg border border-border/50 p-6 md:p-10">
          <div className="text-center py-8">
            <div className="text-red-600 text-lg mb-2">Ошибка</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <Button 
              onClick={fetchDocuments}
              className="flex items-center space-x-2 mx-auto"
            >
              <RefreshCw size={16} />
              <span>Попробовать снова</span>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-lg border border-border/50 overflow-hidden">
        <div className="w-full h-64 sm:h-80 md:h-96 relative">
          <img
            src={dost} 
            alt="Доступная среда"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Доступная среда
            </h1>
          </div>
        </div>
        
        <div className="p-6 md:p-10 space-y-10">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            groupedDocuments.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6 md:p-8 shadow-inner">
                <h2 className="text-2xl font-semibold text-primary mb-6 border-b-2 border-primary/20 pb-3">
                  {section.title}
                </h2>
                
                {section.documents.length > 0 ? (
                  <div className={`grid grid-cols-1 ${section.documents.length > 2 ? 'lg:grid-cols-2' : ''} gap-4`}>
                    {section.documents.map((doc, index) => (
                      <a
                        key={doc.id}
                        href={getFileUrl(doc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between space-x-4 p-4 pr-5 bg-white rounded-lg border border-border/70 shadow-sm hover:shadow-md hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-4 min-w-0"> 
                          <FileText className="w-6 h-6 text-primary/80 group-hover:text-primary transition-colors flex-shrink-0" />
                          <span className="text-foreground font-medium group-hover:text-primary transition-colors truncate">
                            {doc.document_title}
                          </span>
                        </div>
                        <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3 bg-white/50 rounded-lg p-6 text-center border border-dashed border-border">
                    <Info className="w-5 h-5 text-muted-foreground" />
                    <p className="text-muted-foreground">Информация для данного раздела будет добавлена позже.</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AccessibleEnvironment;