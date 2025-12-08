// src/components/admin/PageContentList.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { pageContentApi, type PageContent, ContentType } from '@/api/page-content';

interface PageContentListProps {
  onEdit: (content: PageContent) => void;
  onDelete: (content: PageContent) => void;
  onCreate: () => void;
  refreshTrigger: number;
  contentType: ContentType;
}

export default function PageContentList({ 
  onEdit, 
  onDelete, 
  onCreate, 
  refreshTrigger,
  contentType 
}: PageContentListProps) {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      
      // ИСПРАВЛЕНИЕ: Увеличен лимит до 10000, чтобы показать все записи
      const data = await pageContentApi.getAll(contentType, { limit: 10000 });
      
      const sortedData = data.sort((a, b) => {
        if (a.order_index !== b.order_index) {
          return a.order_index - b.order_index;
        }
        if (a.year && b.year) {
          return b.year - a.year;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setContents(sortedData);
    } catch (error) {
      console.error(error);
      setContents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [refreshTrigger, contentType]);

  const getFileName = (content: PageContent) => {
    if (content.files?.length > 0) return content.files[0].name;
    return content.file_name || 'PDF документ';
  };

  const getFileIcon = (content: PageContent) => {
    if (contentType === ContentType.AdmissionNumbers && content.image_url) {
      return <ImageIcon size={14} />;
    }
    return <FileText size={14} />;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
        <p>Загрузка контента...</p>
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
            <span className="font-semibold text-gray-900">{contents.length}</span> всего
          </div>
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <div className="text-gray-500">
            <span className="text-green-600 font-medium">{contents.filter(d => d.is_published).length}</span> опубликовано
          </div>
        </div>
        
        <Button onClick={onCreate} size="sm" className="h-9 whitespace-nowrap bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Добавить контент
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-3">
        {contents.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
              <FileText className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Нет контента</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
              Список контента пуст. Создайте первый элемент.
            </p>
            <Button onClick={onCreate} variant="outline" className="mt-4">
              Добавить контент
            </Button>
          </div>
        ) : (
          contents.map((content) => (
            <div 
              key={content.id} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md hover:border-blue-200 transition-all duration-200"
            >
              <div className="flex-1 min-w-0 pr-4 mb-3 sm:mb-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                   {/* Год для StartInScience и RussiaBelarus */}
                   {(contentType === ContentType.StartInScience || contentType === ContentType.RussiaBelarus) && content.year && (
                     <Badge variant="secondary" className="font-normal rounded-sm bg-blue-100 text-blue-700 hover:bg-blue-100">
                       {content.year} год
                     </Badge>
                   )}
                   
                   {/* Цвет для RussiaBelarus */}
                   {contentType === ContentType.RussiaBelarus && content.color && (
                     <Badge variant="secondary" className="font-normal rounded-sm flex items-center gap-1">
                       <div 
                         className="w-2 h-2 rounded-full" 
                         style={{ backgroundColor: content.color }}
                       />
                       Цвет
                     </Badge>
                   )}
                   
                   {/* Статус публикации */}
                   {content.is_published ? (
                      <span className="flex items-center text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                         <Eye size={10} className="mr-1" /> Опубликован
                      </span>
                   ) : (
                      <span className="flex items-center text-[10px] uppercase tracking-wider font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                         <EyeOff size={10} className="mr-1" /> Черновик
                      </span>
                   )}

                   {/* Порядок */}
                   <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                     Порядок: {content.order_index}
                   </span>
                </div>
                
                <h4 className="text-base font-medium text-gray-900 mb-1 leading-snug">
                  {content.title}
                </h4>
                
                {content.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {content.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                   {/* Информация о файле/изображении */}
                   {(content.files?.length > 0 || content.image_url || content.file_url) && (
                     <div className="flex items-center gap-1.5" title={getFileName(content)}>
                        {getFileIcon(content)}
                        <span className="truncate max-w-[200px]">
                          {contentType === ContentType.AdmissionNumbers && content.image_url 
                            ? 'Изображение' 
                            : getFileName(content)
                          }
                        </span>
                     </div>
                   )}
                   
                   {(content.files?.length > 0 || content.image_url) && (
                     <span className="text-gray-300">|</span>
                   )}
                   
                   <span>
                      {new Date(content.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                   </span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => onEdit(content)} className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600">
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(content)} className="h-8 w-8 p-0 text-gray-500 hover:text-red-600">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}