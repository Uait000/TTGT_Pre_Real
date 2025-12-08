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
import { FileText, Upload, Image as ImageIcon, X, Loader2, Link } from 'lucide-react';
import { pageContentApi, type PageContent, type CreatePageContentPayload, ContentType } from '@/api/page-content';

interface PageContentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editContent?: PageContent | null;
  contentType: ContentType;
}

const CONTENT_TYPE_CONFIG = {
  [ContentType.AdmissionNumbers]: {
    title: 'Контрольные цифры приема',
    fields: ['image', 'file'],
    hasYear: false,
    hasColor: false,
    hasTwoFiles: false,
    hasSchedule: false,
    hasBlockType: false
  },
  [ContentType.AdmissionRules]: {
    title: 'Правила приема',
    fields: ['file'],
    hasYear: false,
    hasColor: false,
    hasTwoFiles: false,
    hasSchedule: false,
    hasBlockType: false
  },
  [ContentType.Memo]: {
    title: 'Памятка участникам ЕГЭ',
    fields: ['file'],
    hasYear: false,
    hasColor: false,
    hasTwoFiles: false,
    hasSchedule: false,
    hasBlockType: false
  },
  [ContentType.StateExam]: {
    title: 'ГИА',
    fields: ['file'],
    hasYear: false,
    hasColor: false,
    hasTwoFiles: false,
    hasSchedule: true,
    hasBlockType: true
  },
  [ContentType.StartInScience]: {
    title: 'Старт в науку',
    fields: ['file'],
    hasYear: true,
    hasColor: false,
    hasTwoFiles: false,
    hasSchedule: false,
    hasBlockType: false
  },
  [ContentType.RussiaBelarus]: {
    title: 'Россия и Беларусь',
    fields: ['file'],
    hasYear: true,
    hasColor: true,
    hasTwoFiles: false,
    hasSchedule: false,
    hasBlockType: false
  },
  [ContentType.RailwayEmployers]: {
    title: 'Работодатели',
    fields: ['file'],
    hasYear: false,
    hasColor: false,
    hasTwoFiles: true,
    hasSchedule: false,
    hasBlockType: false
  }
};

const COLOR_OPTIONS = [
  { value: '#3b82f6', label: 'Синий' },
  { value: '#ef4444', label: 'Красный' },
  { value: '#10b981', label: 'Зеленый' },
  { value: '#f59e0b', label: 'Желтый' },
  { value: '#8b5cf6', label: 'Фиолетовый' },
  { value: '#ec4899', label: 'Розовый' },
  { value: '#06b6d4', label: 'Голубой' },
  { value: '#84cc16', label: 'Лаймовый' }
];

export default function PageContentForm({ open, onClose, onSuccess, editContent, contentType }: PageContentFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [secondaryPdfFile, setSecondaryPdfFile] = useState<File | null>(null);
  const [selectedBlockType, setSelectedBlockType] = useState<'schedule' | 'programs' | 'recommendations'>('schedule');
  const [useLink, setUseLink] = useState(false);
  const [useSecondaryLink, setUseSecondaryLink] = useState(false);
  const { toast } = useToast();

  const config = CONTENT_TYPE_CONFIG[contentType];

  const [formData, setFormData] = useState<CreatePageContentPayload>({
    title: '',
    description: '',
    image_url: '',
    file_url: '',
    file_name: '',
    year: new Date().getFullYear(),
    color: '#3b82f6',
    order_index: 0,
    is_published: true,
    files: [],
    button_text: 'Подробнее',
    secondary_button_text: '',
    secondary_file_url: '',
    schedule_start: '',
    schedule_end: '',
    link: '',
    secondary_link: ''
  });

  useEffect(() => {
    if (open && editContent) {
      const hasLink = !!editContent.link;
      const hasSecondaryLink = !!editContent.secondary_link;
      
      setFormData({
        title: editContent.title,
        description: editContent.description || '',
        image_url: editContent.image_url || '',
        file_url: editContent.file_url || '',
        file_name: editContent.file_name || '',
        year: editContent.year || new Date().getFullYear(),
        color: editContent.color || '#3b82f6',
        order_index: editContent.order_index || 0,
        is_published: editContent.is_published,
        files: editContent.files ? editContent.files.map(f => f.id) : [],
        button_text: editContent.button_text || 'Подробнее',
        secondary_button_text: editContent.secondary_button_text || '',
        secondary_file_url: editContent.secondary_file_url || '',
        schedule_start: editContent.schedule_start || '',
        schedule_end: editContent.schedule_end || '',
        link: editContent.link || '',
        secondary_link: editContent.secondary_link || ''
      });
      
      setImageFile(null);
      setPdfFile(null);
      setSecondaryPdfFile(null);
      setUseLink(hasLink);
      setUseSecondaryLink(hasSecondaryLink);
      
      // Восстанавливаем выбранный тип блока для редактирования
      if (config.hasBlockType && editContent.content_type) {
        setSelectedBlockType(editContent.content_type as 'schedule' | 'programs' | 'recommendations');
      }
    } else if (open && !editContent) {
      setFormData({
        title: '',
        description: '',
        image_url: '',
        file_url: '',
        file_name: '',
        year: new Date().getFullYear(),
        color: '#3b82f6',
        order_index: 0,
        is_published: true,
        files: [],
        button_text: 'Подробнее',
        secondary_button_text: '',
        secondary_file_url: '',
        schedule_start: '',
        schedule_end: '',
        link: '',
        secondary_link: ''
      });
      setImageFile(null);
      setPdfFile(null);
      setSecondaryPdfFile(null);
      setSelectedBlockType('schedule');
      setUseLink(false);
      setUseSecondaryLink(false);
    }
  }, [editContent, open, config.hasBlockType]);

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

    if (config.fields.includes('image') && !imageFile && !editContent?.image_url) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, загрузите изображение', 
        variant: 'destructive' 
      });
      return;
    }

    // Проверка для основного файла/ссылки
    if (config.fields.includes('file') && !useLink && !pdfFile && !editContent?.file_url) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, загрузите основной файл или используйте ссылку', 
        variant: 'destructive' 
      });
      return;
    }

    if (config.fields.includes('file') && useLink && !formData.link) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, укажите ссылку', 
        variant: 'destructive' 
      });
      return;
    }

    // Проверка для второго файла/ссылки
    if (config.hasTwoFiles && formData.secondary_button_text) {
      if (!useSecondaryLink && !secondaryPdfFile && !editContent?.secondary_file_url) {
        toast({ 
          title: 'Ошибка', 
          description: 'Пожалуйста, загрузите второй файл, используйте ссылку или удалите текст второй кнопки', 
          variant: 'destructive' 
        });
        return;
      }

      if (useSecondaryLink && !formData.secondary_link) {
        toast({ 
          title: 'Ошибка', 
          description: 'Пожалуйста, укажите вторую ссылку', 
          variant: 'destructive' 
        });
        return;
      }
    }

    setLoading(true);
    try {
      const filesToUpload: File[] = [];
      if (imageFile) filesToUpload.push(imageFile);
      if (pdfFile && !useLink) filesToUpload.push(pdfFile);
      if (secondaryPdfFile && !useSecondaryLink) filesToUpload.push(secondaryPdfFile);

      // Создаем финальный payload с учетом типа блока
      const finalPayload = {
        ...formData,
        content_type: config.hasBlockType ? selectedBlockType : undefined,
        // Очищаем ссылки если не используются
        link: useLink ? formData.link : '',
        secondary_link: useSecondaryLink ? formData.secondary_link : '',
        // Очищаем файлы если используются ссылки
        file_url: useLink ? '' : formData.file_url,
        secondary_file_url: useSecondaryLink ? '' : formData.secondary_file_url
      };

      let result;
      if (editContent) {
        result = await pageContentApi.update(editContent.id, finalPayload, filesToUpload);
      } else {
        result = await pageContentApi.create(contentType, finalPayload, filesToUpload);
      }

      toast({ 
        title: 'Успешно', 
        description: `Контент ${formData.is_published ? 'опубликован' : 'сохранен как черновик'}`,
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('❌ Ошибка сохранения контента:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось сохранить контент', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      file_url: '',
      file_name: '',
      year: new Date().getFullYear(),
      color: '#3b82f6',
      order_index: 0,
      is_published: true,
      files: [],
      button_text: 'Подробнее',
      secondary_button_text: '',
      secondary_file_url: '',
      schedule_start: '',
      schedule_end: '',
      link: '',
      secondary_link: ''
    });
    setImageFile(null);
    setPdfFile(null);
    setSecondaryPdfFile(null);
    setSelectedBlockType('schedule');
    setUseLink(false);
    setUseSecondaryLink(false);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setFormData(prev => ({ ...prev, image_url: file.name }));
      } else {
        toast({ 
          title: 'Ошибка', 
          description: 'Пожалуйста, загрузите изображение', 
          variant: 'destructive' 
        });
      }
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'secondary' = 'main') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        if (type === 'main') {
          setPdfFile(file);
          setFormData(prev => ({ ...prev, file_url: file.name, file_name: file.name }));
        } else {
          setSecondaryPdfFile(file);
          setFormData(prev => ({ ...prev, secondary_file_url: file.name }));
        }
      } else {
        toast({ 
          title: 'Ошибка', 
          description: 'Пожалуйста, загрузите PDF файл', 
          variant: 'destructive' 
        });
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const removePdf = (type: 'main' | 'secondary' = 'main') => {
    if (type === 'main') {
      setPdfFile(null);
      setFormData(prev => ({ ...prev, file_url: '', file_name: '' }));
    } else {
      setSecondaryPdfFile(null);
      setFormData(prev => ({ ...prev, secondary_file_url: '' }));
    }
  };

  const FileUploadSection = ({ 
    label, 
    type = 'main',
    required = true 
  }: { 
    label: string; 
    type?: 'main' | 'secondary';
    required?: boolean;
  }) => {
    const isLinkMode = type === 'main' ? useLink : useSecondaryLink;
    const hasFile = type === 'main' 
      ? (pdfFile || (editContent && editContent.files && editContent.files.length > 0))
      : (secondaryPdfFile || editContent?.secondary_file_url);
    
    const fileName = type === 'main'
      ? (pdfFile ? pdfFile.name : (editContent?.files?.[0]?.name || 'PDF файл'))
      : (secondaryPdfFile ? secondaryPdfFile.name : (editContent?.secondary_file_url || 'PDF файл'));

    const linkValue = type === 'main' ? formData.link : formData.secondary_link;
    const setLinkValue = (value: string) => {
      if (type === 'main') {
        setFormData(prev => ({ ...prev, link: value }));
      } else {
        setFormData(prev => ({ ...prev, secondary_link: value }));
      }
    };

    const toggleLinkMode = () => {
      if (type === 'main') {
        setUseLink(!useLink);
        if (!useLink) {
          // При переключении на ссылку очищаем файл
          setPdfFile(null);
          setFormData(prev => ({ ...prev, file_url: '', file_name: '' }));
        } else {
          // При переключении на файл очищаем ссылку
          setFormData(prev => ({ ...prev, link: '' }));
        }
      } else {
        setUseSecondaryLink(!useSecondaryLink);
        if (!useSecondaryLink) {
          setSecondaryPdfFile(null);
          setFormData(prev => ({ ...prev, secondary_file_url: '' }));
        } else {
          setFormData(prev => ({ ...prev, secondary_link: '' }));
        }
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>
            {label} {required && !editContent && '*'}
          </Label>
          <div className="flex items-center space-x-2">
            <Label htmlFor={`link-mode-${type}`} className="text-sm text-gray-600 cursor-pointer">
              Использовать ссылку
            </Label>
            <Switch
              id={`link-mode-${type}`}
              checked={isLinkMode}
              onCheckedChange={toggleLinkMode}
            />
          </div>
        </div>

        {isLinkMode ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-gray-500" />
              <Input
                type="url"
                placeholder="https://example.com/document.pdf"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Укажите прямую ссылку на PDF файл или веб-страницу
            </p>
          </div>
        ) : hasFile ? (
          <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {fileName}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removePdf(type)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              id={`pdf-upload-${type}`}
              accept=".pdf"
              onChange={(e) => handlePdfChange(e, type)}
              className="hidden"
            />
            <label htmlFor={`pdf-upload-${type}`} className="cursor-pointer">
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
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editContent ? 'Редактировать' : 'Добавить'} {config.title}
          </DialogTitle>
          <DialogDescription>
            Заполните форму для {editContent ? 'редактирования' : 'создания'} контента
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
              placeholder="Введите название..."
              required 
            />
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
              placeholder="Введите описание..."
              rows={3}
            />
          </div>

          {/* Выбор раздела для ГИА */}
          {config.hasBlockType && (
            <div className="space-y-2">
              <Label htmlFor="block_type">Раздел ГИА *</Label>
              <Select 
                value={selectedBlockType} 
                onValueChange={(value: 'schedule' | 'programs' | 'recommendations') => setSelectedBlockType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите раздел" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule">График ГИА</SelectItem>
                  <SelectItem value="programs">Программы</SelectItem>
                  <SelectItem value="recommendations">Рекомендации</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* График для ГИА - показываем только для раздела "schedule" */}
          {config.hasSchedule && selectedBlockType === 'schedule' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule_start">Дата начала *</Label>
                <Input
                  id="schedule_start"
                  value={formData.schedule_start}
                  onChange={(e) => setFormData(prev => ({ ...prev, schedule_start: e.target.value }))}
                  placeholder="15.06.2025"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule_end">Дата окончания *</Label>
                <Input
                  id="schedule_end"
                  value={formData.schedule_end}
                  onChange={(e) => setFormData(prev => ({ ...prev, schedule_end: e.target.value }))}
                  placeholder="28.06.2025"
                  required
                />
              </div>
            </div>
          )}

          {/* Год (для StartInScience и RussiaBelarus) - ТЕПЕРЬ ВВОД ВРУЧНУЮ */}
          {config.hasYear && (
            <div className="space-y-2">
              <Label htmlFor="year">Год *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
                placeholder="Введите год (например, 2025)"
                required
              />
            </div>
          )}

          {/* Цвет (для RussiaBelarus) */}
          {config.hasColor && (
            <div className="space-y-2">
              <Label htmlFor="color">Цвет блока</Label>
              <Select 
                value={formData.color} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
              >
                <SelectTrigger>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border" 
                      style={{ backgroundColor: formData.color }}
                    />
                    <SelectValue placeholder="Выберите цвет" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded border" 
                          style={{ backgroundColor: color.value }}
                        />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Загрузка изображения (для AdmissionNumbers) */}
          {config.fields.includes('image') && (
            <div className="space-y-2">
              <Label>Изображение {!editContent && '*'}</Label>
              {imageFile || (editContent && editContent.image_url) ? (
                <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {imageFile ? imageFile.name : 'Изображение'}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">Нажмите для загрузки</span> или перетащите изображение
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Поддерживаются форматы: JPG, PNG, WebP
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Основной файл */}
          {config.fields.includes('file') && (
            <FileUploadSection 
              label="Основной PDF файл или ссылка" 
              type="main" 
              required={true}
            />
          )}

          {/* Второй файл для работодателей */}
          {config.hasTwoFiles && (
            <>
              <div className="space-y-2">
                <Label htmlFor="secondary_button_text">Текст второй кнопки</Label>
                <Input
                  id="secondary_button_text"
                  value={formData.secondary_button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondary_button_text: e.target.value }))}
                  placeholder="Например: Скачать вакансии"
                />
                <p className="text-xs text-gray-500">
                  Оставьте пустым, если вторая кнопка не нужна
                </p>
              </div>

              {formData.secondary_button_text && (
                <FileUploadSection 
                  label="Второй PDF файл или ссылка" 
                  type="secondary" 
                  required={false}
                />
              )}
            </>
          )}

          {/* Текст кнопки для основного файла */}
          <div className="space-y-2">
            <Label htmlFor="button_text">Текст кнопки для основного файла</Label>
            <Input
              id="button_text"
              value={formData.button_text}
              onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
              placeholder="Подробнее"
            />
          </div>

          {/* Порядок отображения */}
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
              Меньшее число означает более высокую позицию в списке
            </p>
          </div>

          {/* Статус публикации */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(isChecked) => {
                    setFormData(prev => ({
                      ...prev,
                      is_published: isChecked,
                    }));
                  }}
                />
                <Label htmlFor="is_published" className="text-base font-normal cursor-pointer">
                  Опубликовать
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