// src/components/admin/DocumentForm.tsx
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
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import documentsApi from '@/api/documents';
import type { Document, CreateDocumentPayload } from '@/api/documents';

interface DocumentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editDocument?: Document | null;
}

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

// Расширяем тип payload для включения publish_date
interface DocumentPayload extends CreateDocumentPayload {
  publish_date: number;
}

export default function DocumentForm({ open, onClose, onSuccess, editDocument }: DocumentFormProps) {
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<DocumentPayload>({
    section_title: DOCUMENT_SECTIONS[0],
    document_title: '',
    file_url: '',
    file_name: '',
    is_published: true,
    use_external_link: false,
    external_link: '',
    files: [],
    publish_date: Math.floor(Date.now() / 1000) // Текущее время в секундах (Unix timestamp)
  });

  useEffect(() => {
    if (open && editDocument) {
      console.log('📝 Редактирование документа:', {
        id: editDocument.id,
        title: editDocument.document_title,
        is_published: editDocument.is_published,
        status: editDocument.is_published ? 'Опубликовано' : 'Черновик',
        publish_date: editDocument.publish_date
      });
      
      setFormData({
        section_title: editDocument.section_title,
        document_title: editDocument.document_title,
        file_url: editDocument.file_url,
        file_name: editDocument.file_name || '',
        is_published: editDocument.is_published,
        use_external_link: editDocument.use_external_link,
        external_link: editDocument.external_link || '',
        files: editDocument.files ? editDocument.files.map(f => f.id) : [],
        publish_date: editDocument.publish_date || Math.floor(Date.now() / 1000)
      });
      setPdfFile(null);
    } else if (open && !editDocument) {
      console.log('➕ Создание нового документа, статус по умолчанию: Опубликовано');
      setFormData({
        section_title: DOCUMENT_SECTIONS[0],
        document_title: '',
        file_url: '',
        file_name: '',
        is_published: true,
        use_external_link: false,
        external_link: '',
        files: [],
        publish_date: Math.floor(Date.now() / 1000)
      });
      setPdfFile(null);
    }
  }, [editDocument, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.section_title.trim() || !formData.document_title.trim()) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, заполните название раздела и документа', 
        variant: 'destructive' 
      });
      return;
    }

    if (!formData.use_external_link && !pdfFile && !editDocument) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, загрузите PDF файл или используйте внешнюю ссылку', 
        variant: 'destructive' 
      });
      return;
    }

    if (formData.use_external_link && !formData.external_link?.trim()) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, укажите внешнюю ссылку', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      // Создаем полный payload с обязательным полем publish_date
      const payload: DocumentPayload = {
  section_title: formData.section_title,
  document_title: formData.document_title,
  is_published: formData.is_published,
  use_external_link: formData.use_external_link,
  external_link: formData.external_link || '',
  file_name: formData.file_name || '',
  file_url: formData.file_url || '',
  files: formData.files || [],
  publish_date: formData.publish_date // Убедитесь, что это поле есть
};

      console.log('🚀 Отправка в API - полный payload:', {
        ...payload,
        status: payload.is_published ? 'ОПУБЛИКОВАНО' : 'ЧЕРНОВИК',
        publish_date_human: new Date(payload.publish_date * 1000).toLocaleString('ru-RU')
      });

      let result;
      if (editDocument) {
        console.log(`🔄 Обновление документа ID: ${editDocument.id}`);
        result = await documentsApi.update(editDocument.id, payload, pdfFile || undefined);
        console.log('✅ Результат обновления:', result);
      } else {
        console.log('🆕 Создание нового документа');
        result = await documentsApi.create(payload, pdfFile || undefined);
        console.log('✅ Результат создания:', result);
      }

      // Проверяем результат
      if (result && typeof result === 'object') {
        console.log('📋 Ответ от сервера:', {
          id: result.id,
          is_published: result.is_published,
          status: result.is_published ? 'Опубликовано' : 'Черновик',
          publish_date: result.publish_date
        });
      }

      toast({ 
        title: 'Успешно', 
        description: `Документ ${formData.is_published ? 'опубликован' : 'сохранен как черновик'}`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('❌ Ошибка сохранения документа:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось сохранить документ', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      section_title: DOCUMENT_SECTIONS[0],
      document_title: '',
      file_url: '',
      file_name: '',
      is_published: true,
      use_external_link: false,
      external_link: '',
      files: [],
      publish_date: Math.floor(Date.now() / 1000)
    });
    setPdfFile(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setFormData(prev => ({ 
          ...prev, 
          file_name: file.name,
          use_external_link: false 
        }));
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
    setPdfFile(null);
    setFormData(prev => ({ ...prev, file_name: '', files: [] }));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editDocument ? 'Редактировать документ' : 'Добавить документ'}</DialogTitle>
          <DialogDescription>
            Заполните форму для {editDocument ? 'редактирования' : 'создания'} документа
            {editDocument && ` (ID: ${editDocument.id})`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Selection */}
          <div className="space-y-2">
            <Label htmlFor="section">Раздел документа *</Label>
            <Select 
              value={formData.section_title} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, section_title: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите раздел" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_SECTIONS.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Название документа *</Label>
            <Textarea 
              id="title" 
              value={formData.document_title} 
              onChange={(e) => setFormData(prev => ({ ...prev, document_title: e.target.value }))} 
              placeholder="Введите полное название документа..."
              className="min-h-[80px] resize-none"
              required 
            />
          </div>

          {/* File Upload / External Link */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="use_external_link"
                checked={formData.use_external_link}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  use_external_link: !!checked,
                  external_link: checked ? prev.external_link : '',
                  files: checked ? [] : prev.files
                }))}
              />
              <Label htmlFor="use_external_link" className="text-sm font-normal">
                Использовать внешнюю ссылку вместо загрузки файла
              </Label>
            </div>

            {formData.use_external_link ? (
              <div className="space-y-2">
                <Label htmlFor="external_link">Внешняя ссылка *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="external_link"
                    type="url"
                    value={formData.external_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, external_link: e.target.value }))}
                    placeholder="https://example.com/document.pdf"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <LinkIcon size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>PDF файл {!editDocument && '*'}</Label>
                {pdfFile || (editDocument && editDocument.files && editDocument.files.length > 0) ? (
                  <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {pdfFile ? pdfFile.name : (editDocument?.files?.[0]?.name || 'PDF файл')}
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
          </div>

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
                  Опубликовать документ
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

            {/* Статус документа */}
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
                  {formData.is_published ? '📢 Документ будет опубликован' : '📝 Документ будет сохранен как черновик'}
                </span>
              </div>
              <p className="text-sm mt-1">
                {formData.is_published 
                  ? 'Пользователи смогут видеть этот документ на сайте' 
                  : 'Документ будет скрыт от пользователей до публикации'
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
              ) : editDocument ? (
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