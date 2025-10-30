import { useState, useEffect } from 'react';
// --- УДАЛЕНО ---: teachersApi и Teacher больше не нужны
import { postsApi, type CreatePostPayload, ConflictError, Post, PostCategory } from '@/api/posts';
// --- УДАЛЕНО ---: POST_TAGS больше не нужен
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// --- УДАЛЕНО ---: Select (для автора и типа) больше не нужен
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
// --- УДАЛЕНО ---: Компоненты календаря больше не нужны
import PDFUpload from './PDFUpload';
import { filesApi } from '@/api/files';

interface ContestFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPost?: Post | null;
}

// --- ИЗМЕНЕНО: Значения по умолчанию для автора и типа ---
const DEFAULT_AUTHOR = "Администрация";
const DEFAULT_POST_TYPE = 3; // Индекс "Событие"

export default function ContestForm({ open, onClose, onSuccess, editPost }: ContestFormProps) {
  const [loading, setLoading] = useState(false);
  // --- УДАЛЕНО ---: const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pdfFile1, setPdfFile1] = useState<File | null>(null);
  const [pdfFile2, setPdfFile2] = useState<File | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreatePostPayload>({
    title: '',
    body: '',
    author: DEFAULT_AUTHOR, // ИЗМЕНЕНО: По умолчанию
    type: DEFAULT_POST_TYPE, // ИЗМЕНЕНО: По умолчанию
    files: [],
    publish_date: new Date().getTime(),
    category: PostCategory.Contests,
    status: 0,
  });

  // --- УДАЛЕНО ---: Состояние для `selectedDate` больше не нужно,
  // так как дата всегда будет текущей или из `editPost`
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // --- УДАЛЕНО ---: useEffect для загрузки teachers
  
  useEffect(() => {
    setTitleError(null);

    if (open && editPost) {
      // При редактировании используем существующие данные
      setFormData({
        title: editPost.title,
        body: editPost.body,
        author: editPost.author, // Используем автора из поста
        type: editPost.type,     // Используем тип из поста
        files: editPost.files.map(f => f.id) || [],
        publish_date: editPost.publish_date, // Используем дату из поста
        category: PostCategory.Contests,
        status: 0,
      });
      // --- УДАЛЕНО ---: setSelectedDate(postDate);
      setPdfFile1(null);
      setPdfFile2(null);
    } else if (open && !editPost) {
      // При создании используем значения по умолчанию
      const initialDate = new Date();
      setFormData({
        title: '',
        body: '',
        author: DEFAULT_AUTHOR,     // ИЗМЕНЕНО: По умолчанию
        type: DEFAULT_POST_TYPE,  // ИЗМЕНЕНО: По умолчанию
        files: [],
        publish_date: Math.floor(initialDate.getTime() / 1000), // Текущая дата
        category: PostCategory.Contests,
        status: 0,
      });
      // --- УДАЛЕНО ---: setSelectedDate(initialDate);
      setPdfFile1(null);
      setPdfFile2(null);
    }
    // --- УДАЛЕНО ---: `teachers` из зависимостей
  }, [editPost, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError(null);

    // --- ИЗМЕНЕНО: Убрана проверка !formData.author, так как он всегда есть
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
      
      // ИЗМЕНЕНО: payload теперь использует `formData` напрямую.
      // Если это новый пост, `publish_date` уже установлена на "сейчас".
      // Если это редактирование, `publish_date` взята из `editPost`.
      const payload: CreatePostPayload = {
        ...formData,
        body: 'PDF документы конкурса',
        publish_date: formData.publish_date, // Дата уже в formData
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

  // ИЗМЕНЕНО: Сброс формы
  const handleClose = () => {
    const initialDate = new Date();
    setFormData({
      title: '',
      body: '',
      author: DEFAULT_AUTHOR,     // ИЗМЕНЕНО
      type: DEFAULT_POST_TYPE,  // ИЗМЕНЕНО
      files: [],
      publish_date: Math.floor(initialDate.getTime() / 1000),
      category: PostCategory.Contests,
      status: 0,
    });
    // --- УДАЛЕНО ---: setSelectedDate(initialDate);
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

          {/* --- УДАЛЕНО ---: Блок <div className="grid grid-cols-2 gap-4">...</div> с выбором Автора и Типа поста */}

          {/* --- УДАЛЕНО ---: Блок <div className="space-y-2">...</div> с выбором Даты публикации */}

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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Отмена</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Сохранение...' : editPost ? 'Обновить' : 'Создать'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}