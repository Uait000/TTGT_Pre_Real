import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MultipleFileUploadProps {
  value?: (File | string)[];
  onChange: (files: File[]) => void;
  label?: string;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
}

export default function MultipleFileUpload({
  value = [],
  onChange,
  label = 'Изображения',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  maxFiles = 20,
}: MultipleFileUploadProps) {
  const [previews, setPreviews] = useState<string[]>(
    value.filter(v => typeof v === 'string') as string[]
  );
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: 'Ошибка',
        description: `Максимум ${maxFiles} изображений`,
        variant: 'destructive',
      });
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of selectedFiles) {
      if (file.size > maxSize) {
        toast({
          title: 'Ошибка',
          description: `Файл ${file.name} слишком большой`,
          variant: 'destructive',
        });
        continue;
      }

      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviews([...previews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const handleRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);

    setPreviews(newPreviews);
    setFiles(newFiles);
    onChange(newFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label} ({files.length}/{maxFiles})</Label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-md border-2 border-border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {files.length < maxFiles && (
          <div
            className="border-2 border-dashed border-border rounded-md h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={handleClick}
          >
            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground text-center px-2">
              Добавить изображение
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
