import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BASE_URL } from "@/api/config.ts";

interface MultipleFileUploadProps {
  value?: (File | string)[];
  onChange: (files: File[]) => void;
  onDelete: (file: string) => void; 
  label?: string;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
}

export default function MultipleFileUpload({
  value = [],
  onChange,
  onDelete, 
  label = 'Изображения',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 20,
}: MultipleFileUploadProps) {
  
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const existingFileIds = value.filter(v => typeof v === 'string') as string[];
    const newFilePreviews = previews.filter(p => p.startsWith("data:"));
    setPreviews([...existingFileIds, ...newFilePreviews]);
    
    const newFilesFromProps = value.filter(v => v instanceof File) as File[];
    setFiles(newFilesFromProps);

  }, [value]);

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const currentTotal = previews.length + selectedFiles.length;
    if (currentTotal > maxFiles) {
      toast({
        title: 'Ошибка',
        description: `Максимум ${maxFiles} изображений.`,
        variant: 'destructive',
      });
      return;
    }

    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (file.size > maxSize) {
        toast({
          title: 'Ошибка',
          description: `Файл ${file.name} слишком большой (макс. ${maxSize / 1024 / 1024}MB)`,
          variant: 'destructive',
        });
        continue;
      }

      validFiles.push(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviews(prev => [
            ...prev,
            reader.result as string
        ]);
      };
      reader.readAsDataURL(file);
    }
    
    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onChange(updatedFiles); 
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const previewToRemove = previews[indexToRemove];

    if (!previewToRemove.startsWith("data:")) {
      onDelete(previewToRemove);
    }

    let fileIndexToRemove = -1;
    if (previewToRemove.startsWith("data:")) {
      let dataUrlCount = 0;
      for (let i = 0; i < indexToRemove; i++) {
        if (previews[i].startsWith("data:")) {
          dataUrlCount++;
        }
      }
      fileIndexToRemove = dataUrlCount;
    }

    const newPreviews = previews.filter((_, i) => i !== indexToRemove);
    setPreviews(newPreviews);
    let newFiles = [...files];
    if (fileIndexToRemove > -1 && files[fileIndexToRemove]) {
      newFiles = files.filter((_, i) => i !== fileIndexToRemove);
    }
    setFiles(newFiles);
    onChange(newFiles); 
  };


  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label} ({previews.length}/{maxFiles})</Label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={
                preview.startsWith("data:")
                  ? preview
                  : `${BASE_URL}/files/${preview}` 
              }
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

        {previews.length < maxFiles && (
          <div
            className="file-add-button border-2 border-dashed border-border rounded-md h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
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