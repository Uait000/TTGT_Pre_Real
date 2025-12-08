// src/components/admin/IOSContentForm.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import { iosContentApi, type IOSContent, type CreateIOSContentPayload } from '@/api/ios-content';

interface IOSContentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editContent?: IOSContent | null;
}

const CONTENT_TYPES = [
  { value: 'main', label: 'Основные документы' },
  { value: 'specialty', label: 'Ресурсы по специальностям' },
  { value: 'external', label: 'Внешние библиотеки' },
  { value: 'internal', label: 'Внутренние системы' },
  { value: 'federal', label: 'Федеральные ресурсы' }
];

export default function IOSContentForm({ open, onClose, onSuccess, editContent }: IOSContentFormProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateIOSContentPayload>({
    title: '',
    type: 'main',
    external_url: '',
    order_index: 0,
    is_published: true
  });

  useEffect(() => {
    if (open && editContent) {
      console.log('📝 Редактирование IOS контента:', {
        id: editContent.id,
        title: editContent.title,
        type: editContent.type,
        is_published: editContent.is_published
      });
      
      setFormData({
        title: editContent.title,
        type: editContent.type,
        external_url: editContent.external_url || '',
        order_index: editContent.order_index,
        is_published: editContent.is_published
      });
      setFile(null);
    } else if (open && !editContent) {
      console.log('➕ Создание нового IOS контента');
      setFormData({
        title: '',
        type: 'main',
        external_url: '',
        order_index: 0,
        is_published: true
      });
      setFile(null);
    }
  }, [editContent, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, заполните название', 
        variant: 'destructive' 
      });
      return;
    }

    if ((formData.type === 'external' || formData.type === 'federal') && !formData.external_url?.trim()) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, укажите внешнюю ссылку', 
        variant: 'destructive' 
      });
      return;
    }

    if ((formData.type === 'main' || formData.type === 'specialty') && !file && !editContent) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, загрузите PDF файл', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      if (editContent) {
        await iosContentApi.update(editContent.id, formData, file || undefined);
      } else {
        await iosContentApi.create(formData, file || undefined);
      }

      toast({ 
        title: 'Успешно', 
        description: `Контент ${formData.is_published ? 'опубликован' : 'сохранен как черновик'}`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Ошибка сохранения контента:', error);
      
      let errorMessage = 'Не удалось сохранить контент';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({ 
        title: 'Ошибка', 
        description: errorMessage,
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: 'main',
      external_url: '',
      order_index: 0,
      is_published: true
    });
    setFile(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast({ 
          title: 'Ошибка', 
          description: 'Пожалуйста, загрузите PDF файл', 
          variant: 'destructive' 
        });
      }
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const requiresFile = formData.type === 'main' || formData.type === 'specialty';
  const requiresUrl = formData.type === 'external' || formData.type === 'federal';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editContent ? 'Редактировать контент IOS' : 'Добавить контент IOS'}</DialogTitle>
          <DialogDescription>
            Управление контентом для страницы "Электронная информационно-образовательная среда"
            {editContent && ` (ID: ${editContent.id})`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Тип контента *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Textarea 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
              placeholder="Введите название..."
              className="min-h-[60px] resize-none"
              required 
            />
          </div>

          {/* Order Index */}
          <div className="space-y-2">
            <Label htmlFor="order_index">Порядок отображения</Label>
            <Input 
              id="order_index"
              type="number" 
              value={formData.order_index} 
              onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))} 
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500">
              Элементы с меньшим значением отображаются первыми
            </p>
          </div>

          {/* File Upload / External URL */}
          {requiresFile && (
            <div className="space-y-2">
              <Label>PDF файл {!editContent && '*'}</Label>
              {file || (editContent && editContent.file_url) ? (
                <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {file ? file.name : (editContent?.file_name || 'PDF файл')}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">Нажмите для загрузки</span> или перетащите PDF файл
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Поддерживается только PDF формат
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {requiresUrl && (
            <div className="space-y-2">
              <Label htmlFor="external_url">Внешняя ссылка *</Label>
              <div className="flex space-x-2">
                <Input
                  id="external_url"
                  type="url"
                  value={formData.external_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, external_url: e.target.value }))}
                  placeholder="https://example.com"
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="icon">
                  <LinkIcon size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Publication Status */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(isChecked) => {
                    console.log('🔘 Переключатель публикации:', isChecked ? 'Опубликовано' : 'Черновик');
                    setFormData(prev => ({
                      ...prev,
                      is_published: isChecked,
                    }));
                  }}
                />
                <Label htmlFor="is_published" className="text-base font-normal cursor-pointer">
                  Опубликовать контент
                </Label>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.is_published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {formData.is_published ? 'ОПУБЛИКОВАН' : 'ЧЕРНОВИК'}
              </div>
            </div>

            {/* Статус контента */}
            <div className={`p-3 rounded-lg ${
              formData.is_published 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  formData.is_published ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span className="font-medium">
                  {formData.is_published ? '📢 Контент будет опубликован' : '📝 Контент будет сохранен как черновик'}
                </span>
              </div>
              <p className="text-sm mt-1">
                {formData.is_published 
                  ? 'Пользователи смогут видеть этот контент на странице IOS' 
                  : 'Контент будет скрыт от пользователей до публикации'
                }
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : editContent ? (
                `Обновить ${formData.is_published ? 'и опубликовать' : 'как черновик'}`
              ) : (
                `Создать ${formData.is_published ? 'и опубликовать' : 'как черновик'}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}