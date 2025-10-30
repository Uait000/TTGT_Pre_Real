import { useState, useEffect } from 'react';
import { zamenaApi } from '@/api/zamena';
import PDFUpload from './PDFUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ZamenaManager() {
  // `currentFile` может быть:
  // - string (URL), когда загружен с сервера
  // - File (объект), когда выбран пользователем
  // - null, если ничего нет
  const [currentFile, setCurrentFile] = useState<File | string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // 1. Получаем текущий файл при загрузке компонента
  const fetchCurrentFile = async () => {
    setIsLoading(true);
    try {
      const data = await zamenaApi.get();
      if (data && data.url) {
        // Мы используем URL как "значение" для PDFUpload
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

  // 2. Обработчик для PDFUpload.
  // Срабатывает, когда пользователь выбирает новый файл или удаляет текущий.
  const handleFileChange = (file: File | null) => {
    setCurrentFile(file);
  };

  // 3. Обработчик загрузки/замены файла
  const handleUpload = async () => {
    // Убедимся, что currentFile - это именно File, а не string (URL)
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
      // После успешной загрузки, снова получаем данные с сервера
      // чтобы `currentFile` стал string (URL)
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

  // Кнопка "Заменить" активна, только если currentFile - это File (новый файл)
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
            value={currentFile || undefined} // Передаем URL или новый File
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