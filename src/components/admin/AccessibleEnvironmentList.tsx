// src/components/admin/AccessibleEnvironmentList.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Loader2,
  Filter
} from 'lucide-react';
import accessibleEnvironmentApi, { ACCESSIBLE_ENV_SECTIONS, type AccessibleEnvironmentDocument } from '@/api/accessible-environment';

interface AccessibleEnvironmentListProps {
  onEdit: (document: AccessibleEnvironmentDocument) => void;
  onDelete: (document: AccessibleEnvironmentDocument) => void;
  onCreate: () => void;
  refreshTrigger: number;
}

const AccessibleEnvironmentList = ({ 
  onEdit, 
  onDelete, 
  onCreate, 
  refreshTrigger 
}: AccessibleEnvironmentListProps) => {
  const [documents, setDocuments] = useState<AccessibleEnvironmentDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSection, setFilterSection] = useState<string>('all');

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      // ИЗМЕНЕНИЕ: Запрашиваем 10000 записей, чтобы показать все документы без пагинации
      const docs = await accessibleEnvironmentApi.getAll({ limit: 10000 });
      setDocuments(docs);
    } catch (error) {
      console.error(error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const filteredDocuments = filterSection === 'all' 
    ? documents 
    : documents.filter(doc => doc.section_title === filterSection);

  const getSectionColor = (section: string) => {
    const index = ACCESSIBLE_ENV_SECTIONS.indexOf(section);
    const colors = [
      'bg-blue-100 text-blue-700 hover:bg-blue-100',
      'bg-emerald-100 text-emerald-700 hover:bg-emerald-100', 
      'bg-violet-100 text-violet-700 hover:bg-violet-100',
      'bg-amber-100 text-amber-700 hover:bg-amber-100'
    ];
    return colors[index % colors.length] || 'bg-gray-100 text-gray-800';
  };

  const getFileName = (doc: AccessibleEnvironmentDocument) => {
    if (doc.use_external_link) return 'Внешняя ссылка';
    if (doc.files?.length > 0) return doc.files[0].name;
    return doc.file_name || 'PDF документ';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
        <p>Загрузка документов...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header / Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md text-gray-600">
            <FileText size={16} />
            <span className="font-semibold text-gray-900">{documents.length}</span> всего
          </div>
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <div className="text-gray-500">
            <span className="text-green-600 font-medium">{documents.filter(d => d.is_published).length}</span> опубликовано
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-[280px]">
             <Select value={filterSection} onValueChange={setFilterSection}>
              <SelectTrigger className="w-full h-9">
                <div className="flex items-center gap-2 text-gray-600">
                    <Filter size={14} />
                    <SelectValue placeholder="Фильтр по разделу" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все разделы</SelectItem>
                {ACCESSIBLE_ENV_SECTIONS.map(section => (
                  <SelectItem key={section} value={section}>{section}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={onCreate} size="sm" className="h-9 whitespace-nowrap bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Добавить документ
          </Button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
              <FileText className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Нет документов</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
              {filterSection === 'all' 
                ? 'Список документов пуст. Создайте первый документ.' 
                : `В разделе "${filterSection}" пока нет документов.`}
            </p>
            <Button onClick={onCreate} variant="outline" className="mt-4">
              Добавить документ
            </Button>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md hover:border-blue-200 transition-all duration-200"
            >
              <div className="flex-1 min-w-0 pr-4 mb-3 sm:mb-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                   <Badge variant="secondary" className={`font-normal rounded-sm ${getSectionColor(doc.section_title)}`}>
                      {doc.section_title}
                   </Badge>
                   {doc.is_published ? (
                      <span className="flex items-center text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                         <Eye size={10} className="mr-1" /> Опубликован
                      </span>
                   ) : (
                      <span className="flex items-center text-[10px] uppercase tracking-wider font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                         <EyeOff size={10} className="mr-1" /> Черновик
                      </span>
                   )}
                </div>
                
                <h4 className="text-base font-medium text-gray-900 mb-1 leading-snug">
                  {doc.document_title}
                </h4>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                   <div className="flex items-center gap-1.5" title={getFileName(doc)}>
                      {doc.use_external_link ? <LinkIcon size={12} /> : <FileText size={12} />}
                      <span className="truncate max-w-[200px]">{getFileName(doc)}</span>
                   </div>
                   <span className="text-gray-300">|</span>
                   <span>
                      {new Date(doc.publish_date * 1000).toLocaleDateString('ru-RU', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                   </span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => onEdit(doc)} className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600">
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(doc)} className="h-8 w-8 p-0 text-gray-500 hover:text-red-600">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccessibleEnvironmentList;