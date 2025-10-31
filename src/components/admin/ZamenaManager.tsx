import { useState, useEffect } from 'react';
import { zamenaApi } from '@/api/zamena';
import PDFUpload from './PDFUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ZamenaManager() {

  const [currentFile, setCurrentFile] = useState<File | string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  
  const fetchCurrentFile = async () => {
    setIsLoading(true);
    try {
      const data = await zamenaApi.get();
      if (data && data.url) {
        
        setCurrentFile(data.url); 
      } else {
        setCurrentFile(null);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить текущий файл замен.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentFile();
  }, []);

  
  
  const handleFileChange = (file: File | null) => {
    setCurrentFile(file);
  };

  
  const handleUpload = async () => {
    
    if (typeof currentFile !== 'object' || !currentFile) {
      toast({
        title: 'Файл не выбран',
        description: 'Пожалуйста, выберите новый PDF файл для замены.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      await zamenaApi.upload(currentFile);
      toast({
        title: 'Успешно!',
        description: 'Файл замен обновлен.',
      });
      
      
      fetchCurrentFile();
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: error instanceof Error ? error.message : 'Не удалось загрузить файл.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isReplaceDisabled = typeof currentFile !== 'object' || !currentFile || isUploading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление заменами</CardTitle>
        <CardDescription>
          Загрузите PDF-файл с заменами. Новый файл автоматически заменит
          старый.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <PDFUpload
            label="Файл замен (PDF)"
            value={currentFile || undefined} 
            onChange={handleFileChange}
          />
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={isReplaceDisabled}>
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isUploading ? 'Загрузка...' : 'Заменить файл'}
        </Button>
      </CardFooter>
    </Card>
  );
}