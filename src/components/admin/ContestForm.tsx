import { useState, useEffect } from 'react';

import { postsApi, type CreatePostPayload, ConflictError, Post, PostCategory, PostStatus } from '@/api/posts';
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
import PDFUpload from './PDFUpload';
import { filesApi } from '@/api/files';

interface ContestFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPost?: Post | null;
}

const DEFAULT_AUTHOR = "Администрация";
const DEFAULT_POST_TYPE = 3; 

export default function ContestForm({ open, onClose, onSuccess, editPost }: ContestFormProps) {
  const [loading, setLoading] = useState(false);
  const [pdfFile1, setPdfFile1] = useState<File | null>(null);
  const [pdfFile2, setPdfFile2] = useState<File | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreatePostPayload>({
    title: '',
    body: '',
    author: DEFAULT_AUTHOR,
    type: DEFAULT_POST_TYPE,
    files: [],
    publish_date: new Date().getTime(),
    category: PostCategory.Contests,
    status: PostStatus.Draft, 
  });

  
  
  useEffect(() => {
    setTitleError(null);

    if (open && editPost) {
      
      setFormData({
        title: editPost.title,
        body: editPost.body,
        author: editPost.author,
        type: editPost.type,
        files: editPost.files.map(f => f.id) || [],
        publish_date: editPost.publish_date,
        category: PostCategory.Contests,
        
        status: editPost.status, 
      });
      setPdfFile1(null);
      setPdfFile2(null);
    } else if (open && !editPost) {
      
      const initialDate = new Date();
      setFormData({
        title: '',
        body: '',
        author: DEFAULT_AUTHOR,
        type: DEFAULT_POST_TYPE,
        files: [],
        publish_date: Math.floor(initialDate.getTime() / 1000), 
        category: PostCategory.Contests,
        status: PostStatus.Draft, 
      });
      setPdfFile1(null);
      setPdfFile2(null);
    }
  }, [editPost, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError(null);

    if (!(formData.title || '').trim()) {
      toast({ title: 'Ошибка', description: 'Пожалуйста, заполните Название конкурса (*)', variant: 'destructive' });
      return;
    }

    if (!editPost && !pdfFile1) {
      toast({ title: 'Ошибка', description: 'Пожалуйста, загрузите документ "Положение"', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      let pdfIds: string[] = editPost?.files.map(f => f.id) || [];
      
      if (pdfFile1) {
        const uploadResult1 = await filesApi.upload(pdfFile1);
        if (typeof uploadResult1 === 'string' && uploadResult1) {
          pdfIds[0] = uploadResult1;
        }
      }

      if (pdfFile2) {
        const uploadResult2 = await filesApi.upload(pdfFile2);
        if (typeof uploadResult2 === 'string' && uploadResult2) {
          pdfIds[1] = uploadResult2;
        }
      }
      
      pdfIds = pdfIds.filter(id => id);
      
      const payload: CreatePostPayload = {
        ...formData,
        body: 'PDF документы конкурса',
        publish_date: formData.publish_date,
        files: pdfIds,
        
      };

      if (editPost) {
        await postsApi.update(editPost.id, payload);
        toast({ title: 'Успешно', description: 'Конкурс обновлен' });
      } else {
        await postsApi.create(payload);
        toast({ title: 'Успешно', description: 'Конкурс создан' });
      }
      onSuccess();
    } catch (error) {
      if (error instanceof ConflictError) {
        setTitleError(error.message);
      } else {
        toast({ title: 'Ошибка', description: error instanceof Error ? error.message : 'Не удалось сохранить конкурс', variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const initialDate = new Date();
    setFormData({
      title: '',
      body: '',
      author: DEFAULT_AUTHOR,
      type: DEFAULT_POST_TYPE,
      files: [],
      publish_date: Math.floor(initialDate.getTime() / 1000),
      category: PostCategory.Contests,
      status: PostStatus.Draft, 
    });
    setPdfFile1(null);
    setPdfFile2(null);
    setTitleError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPost ? 'Редактировать конкурс' : 'Создать конкурс'}</DialogTitle>
          <DialogDescription>Заполните форму для {editPost ? 'обновления' : 'создания'} конкурса</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название конкурса *</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Введите название конкурса" required />
            {titleError && (
              <p className="text-sm font-medium text-destructive">{titleError}</p>
            )}
          </div>

          <PDFUpload
            value={pdfFile1 || (editPost?.files?.[0]?.id || '')}
            onChange={setPdfFile1}
            label="Положение *"
          />

          <PDFUpload
            value={pdfFile2 || (editPost?.files?.[1]?.id || '')}
            onChange={setPdfFile2}
            label="Регламент (если есть)"
          />

          {/* 👇✅ ИЗМЕНЕНИЕ ЗДЕСЬ: Добавлен переключатель статуса */}
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="status"
              checked={formData.status === PostStatus.Published}
              onCheckedChange={(isChecked) =>
                setFormData({
                  ...formData,
                  status: isChecked ? PostStatus.Published : PostStatus.Draft,
                })
              }
            />
            <Label htmlFor="status">Опубликовать конкурс</Label>
          </div>
          {/* 👆✅ КОНЕЦ ИЗМЕНЕНИЯ */}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Отмена</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Сохранение...' : editPost ? 'Обновить' : 'Создать'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}