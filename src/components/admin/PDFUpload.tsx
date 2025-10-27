import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFUploadProps {
  value?: File | string;
  onChange: (file: File | null) => void;
  label: string;
  maxSize?: number;
}

export default function PDFUpload({
  value,
  onChange,
  label,
  maxSize = 10 * 1024 * 1024,
}: PDFUploadProps) {
  const [fileName, setFileName] = useState<string | null>(
    typeof value === 'string' ? value.split('/').pop() || null : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      toast({
        title: 'Ошибка',
        description: `Размер файла не должен превышать ${maxSize / 1024 / 1024}MB`,
        variant: 'destructive',
      });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Ошибка',
        description: 'Можно загружать только PDF файлы',
        variant: 'destructive',
      });
      return;
    }

    setFileName(file.name);
    onChange(file);
  };

  const handleRemove = () => {
    setFileName(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-4">
        {fileName ? (
          <div className="flex items-center justify-between bg-accent/50 rounded-md p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium truncate max-w-xs">{fileName}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
            onClick={handleClick}
          >
            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Нажмите для загрузки PDF документа
            </p>
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Выбрать файл
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
