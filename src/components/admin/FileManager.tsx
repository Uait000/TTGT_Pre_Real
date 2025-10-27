import { useState, useEffect } from 'react';
import { filesApi } from '@/api/files';
import type { FileInfo } from '@/api/files';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Eye, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function FileManager() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileInfo | null>(null);
  const { toast } = useToast();

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await filesApi.getAll();
      setFiles(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить файлы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await filesApi.upload(file);
      toast({
        title: 'Успешно',
        description: 'Файл загружен',
      });
      loadFiles();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось загрузить файл',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (file: FileInfo) => {
    if (!confirm(`Удалить файл ${file.name}?`)) return;

    try {
      await filesApi.delete(file.path);
      toast({
        title: 'Успешно',
        description: 'Файл удален',
      });
      loadFiles();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось удалить файл',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление файлами</h2>
        <Button asChild disabled={uploading}>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Загрузка...' : 'Загрузить файл'}
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </Button>
      </div>

      {files.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Нет загруженных файлов</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file.path}>
              <CardHeader>
                <CardTitle className="text-base truncate">{file.name}</CardTitle>
                <CardDescription>{formatFileSize(file.size)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewFile(file)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Просмотр
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
            <DialogDescription>
              {previewFile && formatFileSize(previewFile.size)}
            </DialogDescription>
          </DialogHeader>
          {previewFile && previewFile.type.startsWith('image/') && (
            <div className="w-full">
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewFile(null)}>
              Закрыть
            </Button>
            <Button asChild>
              <a href={previewFile?.url} target="_blank" rel="noopener noreferrer">
                Открыть в новой вкладке
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
