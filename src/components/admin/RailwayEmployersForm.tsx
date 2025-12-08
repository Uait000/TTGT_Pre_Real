import { useState, useEffect } from 'react';
import { postsApi, type CreatePostPayload, Post, PostStatus } from '@/api/posts';
import { filesApi } from '@/api/files';
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
import { Loader2, X, FileText, Upload } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface RailwayEmployersFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPost?: Post | null;
}

// ID категории "Работодатели" (как в вашем скрипте)
const EMPLOYERS_CATEGORY_ID = 13;

export default function RailwayEmployersForm({ open, onClose, onSuccess, editPost }: RailwayEmployersFormProps) {
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{id: string, name: string}[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreatePostPayload>({
    title: '',
    body: '',
    author: 'Администрация',
    type: 3, 
    files: [],
    publish_date: Math.floor(Date.now() / 1000),
    category: EMPLOYERS_CATEGORY_ID,
    status: PostStatus.Draft, 
  });

  useEffect(() => {
    if (open) {
      if (editPost) {
        setIsPublished(editPost.status === PostStatus.Published);
        setFormData({
          title: editPost.title,
          body: editPost.body, // Здесь будет HTML, который загрузил скрипт
          author: editPost.author,
          type: editPost.type,
          files: editPost.files.map(f => f.id),
          publish_date: editPost.publish_date,
          category: EMPLOYERS_CATEGORY_ID,
          status: editPost.status, 
        });
        // Инициализируем список файлов для отображения
        setAttachedFiles(editPost.files.map(f => ({ id: f.id, name: f.name || 'Документ' })));
      } else {
        setIsPublished(false);
        setFormData({
          title: '',
          body: '',
          author: 'Администрация',
          type: 3,
          files: [],
          publish_date: Math.floor(Date.now() / 1000),
          category: EMPLOYERS_CATEGORY_ID,
          status: PostStatus.Draft, 
        });
        setAttachedFiles([]);
      }
    }
  }, [editPost, open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        setLoading(true);
        const fileId = await filesApi.upload(file);
        if (typeof fileId === 'string' && fileId) {
            setAttachedFiles(prev => [...prev, { id: fileId, name: file.name }]);
            setFormData(prev => ({
                ...prev,
                files: [...prev.files, fileId]
            }));
            toast({ title: 'Файл загружен' });
        }
    } catch (error) {
        toast({ title: 'Ошибка загрузки', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...attachedFiles];
    newFiles.splice(index, 1);
    setAttachedFiles(newFiles);
    
    const newFileIds = [...formData.files];
    newFileIds.splice(index, 1);
    setFormData(prev => ({ ...prev, files: newFileIds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({ title: 'Ошибка', description: 'Заполните название', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payload: CreatePostPayload = {
        ...formData,
        status: isPublished ? PostStatus.Published : PostStatus.Draft,
      };

      if (editPost) {
        await postsApi.update(editPost.id, payload);
        toast({ title: 'Успешно', description: 'Вакансия обновлена' });
      } else {
        await postsApi.create(payload);
        toast({ title: 'Успешно', description: 'Вакансия создана' });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPost ? 'Редактировать вакансию' : 'Создать вакансию'}</DialogTitle>
          <DialogDescription>
            Редактируйте текст и прикрепляйте файлы.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Описание вакансии (Текст)</Label>
            <RichTextEditor
              value={formData.body}
              onChange={(val) => setFormData({ ...formData, body: val })}
              placeholder="Введите описание..."
            />
          </div>

          <div className="space-y-2">
            <Label>Прикрепленные файлы</Label>
            <div className="flex flex-wrap gap-2 mb-2">
                {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md text-sm border">
                        <FileText size={14} />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={handleFileUpload}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                    <Upload size={14} className="mr-2"/> Загрузить файл
                </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Switch
              id="status"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="status">Опубликовать</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Отмена</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}