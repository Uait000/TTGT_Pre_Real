// src/components/admin/PaymentReceiptForm.tsx
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { FileText, Upload, X, Loader2, Banknote, Download, Link as LinkIcon } from 'lucide-react';
import { paymentReceiptsApi, type CreatePaymentReceiptPayload } from '@/api/payment-receipts';
import type { PaymentReceipt } from '@/types/payment-receipts';
import { RECEIPT_GRADIENTS, RECEIPT_ICONS } from '@/types/payment-receipts';
import { iconComponents } from '@/utils/icons';

interface PaymentReceiptFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editReceipt?: PaymentReceipt | null;
}

export default function PaymentReceiptForm({ open, onClose, onSuccess, editReceipt }: PaymentReceiptFormProps) {
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreatePaymentReceiptPayload>({
    title: '',
    icon: 'Banknote',
    gradient: 'from-blue-500 to-indigo-600',
    is_published: true,
    files: [],
    publish_date: Math.floor(Date.now() / 1000)
  });

  const [useExternalLink, setUseExternalLink] = useState(false);
  const [externalLink, setExternalLink] = useState('');

  useEffect(() => {
    if (open && editReceipt) {
      setFormData({
        title: editReceipt.title,
        icon: editReceipt.icon,
        gradient: editReceipt.gradient,
        is_published: editReceipt.is_published,
        files: editReceipt.files ? editReceipt.files.map(f => f.id) : [],
        publish_date: editReceipt.publish_date || Math.floor(Date.now() / 1000)
      });
      
      // Если у редактируемой квитанции есть external_link, используем его
      const hasExternalLink = editReceipt.file_url && !editReceipt.file_url.includes('/files/');
      setUseExternalLink(hasExternalLink);
      setExternalLink(hasExternalLink ? editReceipt.file_url : '');
      setPdfFile(null);
    } else if (open && !editReceipt) {
      setFormData({
        title: '',
        icon: 'Banknote',
        gradient: 'from-blue-500 to-indigo-600',
        is_published: true,
        files: [],
        publish_date: Math.floor(Date.now() / 1000)
      });
      setUseExternalLink(false);
      setExternalLink('');
      setPdfFile(null);
    }
  }, [editReceipt, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, заполните название квитанции', 
        variant: 'destructive' 
      });
      return;
    }

    if (!useExternalLink && !pdfFile && !editReceipt) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, загрузите PDF файл или используйте внешнюю ссылку', 
        variant: 'destructive' 
      });
      return;
    }

    if (useExternalLink && !externalLink.trim()) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, укажите внешнюю ссылку', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      let result;
      
      // Создаем payload с учетом типа загрузки
      const payload = {
        ...formData,
        // Если используем внешнюю ссылку, передаем её в file_url
        ...(useExternalLink && { file_url: externalLink })
      };

      if (editReceipt) {
        result = await paymentReceiptsApi.update(
          editReceipt.id, 
          payload, 
          useExternalLink ? undefined : (pdfFile || undefined)
        );
      } else {
        result = await paymentReceiptsApi.create(
          payload, 
          useExternalLink ? undefined : (pdfFile || undefined)
        );
      }

      toast({ 
        title: 'Успешно', 
        description: `Квитанция ${formData.is_published ? 'опубликована' : 'сохранена как черновик'}`,
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('❌ Ошибка сохранения квитанции:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось сохранить квитанцию', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      icon: 'Banknote',
      gradient: 'from-blue-500 to-indigo-600',
      is_published: true,
      files: [],
      publish_date: Math.floor(Date.now() / 1000)
    });
    setUseExternalLink(false);
    setExternalLink('');
    setPdfFile(null);
    setIsDragOver(false);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setUseExternalLink(false);
    } else {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, загрузите PDF файл', 
        variant: 'destructive' 
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const removeFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const IconPreview = ({ icon, gradient }: { icon: string; gradient: string }) => {
    const IconComponent = iconComponents[icon as keyof typeof iconComponents] || Banknote;
    return (
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
        <IconComponent size={24} />
      </div>
    );
  };

  // Компонент для выбора градиента с сеткой
  const GradientPicker = () => (
    <div className="space-y-3">
      <Select 
        value={formData.gradient} 
        onValueChange={(value) => setFormData(prev => ({ ...prev, gradient: value }))}
      >
        <SelectTrigger>
          <SelectValue>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded bg-gradient-to-br ${formData.gradient}`}></div>
              <span className="truncate max-w-[200px]">{formData.gradient}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {RECEIPT_GRADIENTS.map((gradient) => (
            <SelectItem key={gradient} value={gradient}>
              <div className="flex items-center space-x-2 py-1">
                <div className={`w-6 h-6 rounded bg-gradient-to-br ${gradient}`}></div>
                <span className="text-sm">{gradient}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Quick Gradient Preview Grid */}
      <div className="grid grid-cols-6 gap-2 pt-2">
        {RECEIPT_GRADIENTS.slice(0, 18).map((gradient) => (
          <button
            key={gradient}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, gradient }))}
            className={`w-8 h-8 rounded border-2 transition-all ${
              formData.gradient === gradient 
                ? 'border-blue-500 ring-2 ring-blue-200 scale-110' 
                : 'border-gray-300 hover:border-gray-400 hover:scale-105'
            } bg-gradient-to-br ${gradient}`}
            title={gradient}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editReceipt ? 'Редактировать квитанцию' : 'Добавить квитанцию'}</DialogTitle>
          <DialogDescription>
            Заполните форму для {editReceipt ? 'редактирования' : 'создания'} квитанции оплаты
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Название квитанции *</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
              placeholder="Например: Квитанция на оплату за обучение"
              required 
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label>Иконка</Label>
            <Select 
              value={formData.icon} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <IconPreview icon={formData.icon} gradient={formData.gradient} />
                    <span>{formData.icon}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {RECEIPT_ICONS.map((icon) => {
                  const IconComponent = iconComponents[icon as keyof typeof iconComponents];
                  return (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center space-x-2">
                        <IconComponent size={16} />
                        <span>{icon}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Gradient Selection */}
          <div className="space-y-2">
            <Label>Градиент</Label>
            <GradientPicker />
          </div>

          {/* Preview */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <Label className="text-sm text-gray-600 mb-2 block">Предпросмотр:</Label>
            <div className={`p-4 rounded-xl bg-gradient-to-br ${formData.gradient} text-white`}>
              <div className="flex items-center space-x-3">
                <IconPreview icon={formData.icon} gradient={formData.gradient} />
                <div>
                  <div className="font-semibold">{formData.title || 'Название квитанции'}</div>
                  <div className="text-sm opacity-80 flex items-center space-x-1">
                    <span>Скачать</span>
                    <Download size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload / External Link Toggle */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="use_external_link"
                checked={useExternalLink}
                onCheckedChange={(checked) => {
                  setUseExternalLink(!!checked);
                  if (checked) {
                    setPdfFile(null);
                  }
                }}
              />
              <Label htmlFor="use_external_link" className="text-sm font-normal">
                Использовать внешнюю ссылку вместо загрузки файла
              </Label>
            </div>

            {useExternalLink ? (
              <div className="space-y-2">
                <Label htmlFor="external_link">Внешняя ссылка на PDF *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="external_link"
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://example.com/document.pdf"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <LinkIcon size={16} />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Укажите прямую ссылку на PDF файл
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>PDF файл {!editReceipt && '*'}</Label>
                
                {pdfFile || (editReceipt && !useExternalLink) ? (
                  <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {pdfFile ? pdfFile.name : (editReceipt?.files?.[0]?.name || 'PDF файл')}
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
                  <div
                    className={`
                      border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
                      ${
                        isDragOver
                          ? 'border-blue-400 bg-blue-50 scale-105'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleFileClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file-upload"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <div className="space-y-2">
                      <Upload className={`h-8 w-8 mx-auto mb-2 transition-colors ${
                        isDragOver ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      
                      <div className="text-sm text-gray-600">
                        {isDragOver ? (
                          <span className="font-medium text-blue-600">Отпустите для загрузки</span>
                        ) : (
                          <>
                            <span className="font-medium text-blue-600">Нажмите для загрузки</span> или перетащите PDF файл
                          </>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Поддерживается только PDF формат
                      </div>
                      
                      {isDragOver && (
                        <div className="text-xs text-blue-600 font-medium animate-pulse">
                          Отпустите файл для загрузки...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Publication Status */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(isChecked) => setFormData(prev => ({ ...prev, is_published: isChecked }))}
              />
              <Label htmlFor="is_published" className="text-base font-normal cursor-pointer">
                Опубликовать квитанцию
              </Label>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.is_published 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {formData.is_published ? 'ОПУБЛИКОВАНА' : 'ЧЕРНОВИК'}
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
              ) : editReceipt ? (
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