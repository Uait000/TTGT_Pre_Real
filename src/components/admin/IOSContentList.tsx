// src/components/admin/IOSContentList.tsx
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
  Loader2,
  RefreshCw,
  AlignLeft
} from 'lucide-react';
import { iosContentApi, type IOSContent } from '@/api/ios-content';

interface IOSContentListProps {
  onEdit: (content: IOSContent) => void;
  onDelete: (content: IOSContent) => void;
  onCreate: () => void;
  refreshTrigger: number;
}

export default function IOSContentList({ onEdit, onDelete, onCreate, refreshTrigger }: IOSContentListProps) {
  const [content, setContent] = useState<IOSContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const fetchContent = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      
      const data = await iosContentApi.getAll();
      setContent(data);
    } catch (error) {
      console.error('Ошибка загрузки контента IOS:', error);
      setContent([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    fetchContent(true);
  };

  // Получаем уникальные типы из загруженных данных для фильтра
  const uniqueTypes = Array.from(new Set(content.map(item => item.type))).sort();

  const filteredContent = filterType === 'all' 
    ? content 
    : content.filter(item => item.type === filterType);

  // Функция для генерации цвета бейджа на основе строки типа (чтобы одинаковые типы имели одинаковый цвет)
  const getTypeColorClass = (type: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-teal-100 text-teal-800'
    ];
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      hash = type.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-1">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{content.length}</span> элементов
          </div>
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            disabled={isRefreshing}
            className="flex items-center space-x-1 h-8"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px]"
          >
            <option value="all">Все типы</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <Button onClick={onCreate} size="sm" className="flex items-center space-x-1">
            <Plus size={14} />
            <span>Добавить</span>
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filteredContent.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <div className="text-gray-500 text-sm">
                Нет контента
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <Badge variant="secondary" className={getTypeColorClass(item.type)}>
                        {item.type}
                      </Badge>
                      
                      {item.order_index > 0 && (
                        <Badge variant="outline" className="text-xs text-gray-500 font-normal">
                          Порядок: {item.order_index}
                        </Badge>
                      )}

                      {!item.is_published && (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          Черновик
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2">
                      {item.title}
                    </h3>
                    
                    {/* Content Indicators */}
                    <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
                      {item.external_url ? (
                        <div className="flex items-center gap-1 text-blue-600" title={item.external_url}>
                          <LinkIcon size={12} />
                          <span className="truncate max-w-[150px]">Ссылка</span>
                        </div>
                      ) : null}

                      {(item.file_name || (item.files && item.files.length > 0)) ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <FileText size={12} />
                          <span>Файл</span>
                        </div>
                      ) : null}

                      {/* Проверка на наличие текста (assuming backend returns text_content) */}
                      {(item as any).text_content && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlignLeft size={12} />
                          <span>Текст</span>
                        </div>
                      )}
                      
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-400">ID: {item.id}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
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
    </div>
  );
}