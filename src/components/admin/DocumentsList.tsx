// src/components/admin/DocumentsList.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import documentsApi from '@/api/documents';
import type { Document } from '@/api/documents';
import { BASE_URL } from '@/api/config';

// Список разрешенных разделов для этой страницы
const DOCUMENT_SECTIONS = [
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

interface DocumentsListProps {
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onCreate: () => void;
  refreshTrigger: number;
}

const DocumentsList = ({ onEdit, onDelete, onCreate, refreshTrigger }: DocumentsListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSection, setFilterSection] = useState<string>('all');

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await documentsApi.getAll();
      setDocuments(data);
    } catch (error) {
      console.error('Ошибка загрузки документов:', error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  // 1. Сначала фильтруем документы, оставляя только те, что относятся к разрешенным разделам.
  // Это уберет документы из "Доступной среды" или других модулей.
  const validDocuments = documents.filter(doc => 
    DOCUMENT_SECTIONS.includes(doc.section_title)
  );

  // 2. Затем применяем пользовательский фильтр по разделу
  const filteredDocuments = filterSection === 'all' 
    ? validDocuments 
    : validDocuments.filter(doc => doc.section_title === filterSection);

  const getSectionColor = (section: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-cyan-100 text-cyan-800'
    ];
    const index = DOCUMENT_SECTIONS.indexOf(section) % colors.length;
    return colors[index] || 'bg-gray-100 text-gray-800';
  };

  const getFileName = (document: Document) => {
    if (document.use_external_link) {
      return 'Внешняя ссылка';
    }
    if (document.files && document.files.length > 0) {
      return document.files[0].name;
    }
    return document.file_name || 'PDF файл';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-1">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{validDocuments.length}</span> документов
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {validDocuments.filter(d => d.is_published).length}
            </span> опубликовано
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px]"
          >
            <option value="all">Все разделы</option>
            {DOCUMENT_SECTIONS.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
          
          <Button onClick={onCreate} size="sm" className="flex items-center space-x-1">
            <Plus size={14} />
            <span>Добавить документ</span>
          </Button>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-2">
        {filteredDocuments.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <div className="text-gray-500 text-sm">
                {filterSection === 'all' ? 'Нет документов' : 'Нет документов в этом разделе'}
              </div>
              <Button onClick={onCreate} variant="outline" size="sm" className="mt-3">
                <Plus size={14} className="mr-1" />
                Добавить первый документ
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  {/* Document Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className={getSectionColor(doc.section_title)}>
                        {doc.section_title}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs">
                        {doc.is_published ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Eye size={12} />
                            <span>Опубликовано</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-gray-500">
                            <EyeOff size={12} />
                            <span>Черновик</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
                      {doc.document_title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        {doc.use_external_link ? (
                          <>
                            <LinkIcon size={12} />
                            <span>Внешняя ссылка</span>
                          </>
                        ) : (
                          <>
                            <FileText size={12} />
                            <span className="max-w-xs truncate">{getFileName(doc)}</span>
                          </>
                        )}
                      </div>
                      <span>Обновлено: {new Date(doc.updated_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(doc)}
                      className="h-8 w-8 p-0"
                      title="Редактировать"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(doc)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Удалить"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      {filteredDocuments.length > 0 && (
        <div className="flex items-center justify-center pt-2">
          <div className="text-xs text-gray-500">
            Показано {filteredDocuments.length} документов
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;