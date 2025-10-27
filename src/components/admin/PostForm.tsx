import { useState, useEffect } from 'react';
// ИСПРАВЛЕНИЕ 1: Импорты типов и констант
import { postsApi, type CreatePostPayload, ConflictError, Post, PostCategory, PostStatus } from '@/api/posts'; 
import { teachersApi } from '@/api/teachers';
import type { Teacher } from '@/api/teachers'; // ИСПРАВЛЕНИЕ 2: Teacher из teachers.ts
import { POST_TAGS } from '@/api/posts'; // ИСПРАВЛЕНИЕ 3: POST_TAGS из posts.ts
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import RichTextEditor from './RichTextEditor';
import MultipleFileUpload from './MultipleFileUpload';
import { Checkbox } from '@/components/ui/checkbox'; // Добавлен импорт для чекбокса

interface PostFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPost?: Post | null; // ИСПРАВЛЕНИЕ 4: NewsPost заменен на Post
}

export default function PostForm({ open, onClose, onSuccess, editPost }: PostFormProps) {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [titleError, setTitleError] = useState<string | null>(null);
  const { toast } = useToast();

  // ИСПРАВЛЕНИЕ 5: Обновленная структура CreatePostPayload
  const [formData, setFormData] = useState<CreatePostPayload & { isDraft: boolean }>({
    title: '',
    body: '', // ИСПРАВЛЕНИЕ: content -> body
    author: '',
    type: 0,
    files: [], // ИСПРАВЛЕНИЕ: image_urls -> files
    publish_date: Math.floor(new Date().getTime() / 1000), // ИСПРАВЛЕНИЕ: date -> publish_date (number)
    category: PostCategory.News, // По умолчанию News (0)
    status: PostStatus.Draft, // Добавляем статус
    isDraft: true, // Локальное состояние для чекбокса
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const teachersList = await teachersApi.getAll({ limit: 1000 });
        setTeachers(teachersList);
      } catch (error) {
        console.error('Failed to load teachers:', error);
        toast({ title: 'Ошибка', description: 'Не удалось загрузить список авторов', variant: 'destructive' });
      }
    };
    loadTeachers();
  }, [toast]);

  useEffect(() => {
    setTitleError(null);
    const postDate = editPost ? new Date(editPost.publish_date * 1000) : new Date();

    if (open && editPost) {
      // ИСПРАВЛЕНИЕ: Проверяем наличие 'body', files - это BackendFile[]
      const fileIds = editPost.files?.map(f => f.id) || [];
      
      setFormData({
        title: editPost.title,
        body: editPost.body, // ИСПРАВЛЕНИЕ: content -> body
        author: editPost.author,
        type: editPost.type,
        files: fileIds, // ИСПРАВЛЕНИЕ: image_urls -> files (массив ID)
        publish_date: editPost.publish_date, // number
        category: editPost.category || PostCategory.News, // Используем текущую категорию поста
        status: editPost.status || PostStatus.Draft, // Используем текущий статус
        isDraft: editPost.status === PostStatus.Draft, // Устанавливаем локальный чекбокс
      });
      setSelectedDate(postDate);
      setImageFiles([]);
    } else if (open && !editPost) {
      const initialDate = new Date();
      setFormData({
        title: '',
        body: '', // ИСПРАВЛЕНИЕ: content -> body
        author: teachers.length > 0 ? teachers[0].initials : '',
        type: 0,
        files: [], // ИСПРАВЛЕНИЕ: image_urls -> files
        publish_date: Math.floor(initialDate.getTime() / 1000), // number
        category: PostCategory.News,
        status: PostStatus.Draft,
        isDraft: true,
      });
      setSelectedDate(initialDate);
      setImageFiles([]);
    }
  }, [editPost, open, teachers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError(null);

    // ИСПРАВЛЕНИЕ: Проверка на body
    if (!(formData.title || '').trim() || !(formData.body || '').trim() || !formData.author) {
      toast({ title: 'Ошибка', description: 'Пожалуйста, заполните все обязательные поля (*)', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // ИСПРАВЛЕНИЕ: Формируем финальный payload для отправки
      const finalPayload: CreatePostPayload = {
        title: formData.title,
        body: formData.body, // Используем body
        author: formData.author,
        type: formData.type,
        // Если загружены новые файлы, они будут отправлены вместе с payload. 
        // Если нет, postsApi.update использует существующие ID в payload.files
        files: formData.files, 
        // ИСПРАВЛЕНИЕ: Дата всегда отправляется как number (секунды)
        publish_date: Math.floor(selectedDate.getTime() / 1000), 
        category: formData.category,
        status: formData.isDraft ? PostStatus.Draft : PostStatus.Published, // Определяем статус по чекбоксу
      };

      if (editPost) {
        // При обновлении postsApi.update принимает Partial<CreatePostPayload>
        await postsApi.update(editPost.id, finalPayload, imageFiles.length > 0 ? imageFiles : undefined);
        toast({ title: 'Успешно', description: 'Пост обновлен' });
      } else {
        await postsApi.create(finalPayload, imageFiles.length > 0 ? imageFiles : undefined);
        toast({ title: 'Успешно', description: 'Пост создан' });
      }
      onSuccess();
    } catch (error) {
      if (error instanceof ConflictError) {
        setTitleError(error.message);
      } else {
        toast({ title: 'Ошибка', description: error instanceof Error ? error.message : 'Не удалось сохранить пост', variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const initialDate = new Date();
    setFormData({
      title: '',
      body: '', // ИСПРАВЛЕНИЕ: content -> body
      author: teachers.length > 0 ? teachers[0].initials : '',
      type: 0,
      files: [], // ИСПРАВЛЕНИЕ: image_urls -> files
      publish_date: Math.floor(initialDate.getTime() / 1000),
      category: PostCategory.News,
      status: PostStatus.Draft,
      isDraft: true,
    });
    setSelectedDate(initialDate);
    setImageFiles([]);
    setTitleError(null);
    onClose();
  };
  
  // ИСПРАВЛЕНИЕ: Для RichTextEditor используем formData.body
  const handleBodyChange = (value: string) => setFormData({ ...formData, body: value });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPost ? 'Редактировать пост' : 'Создать новый пост'}</DialogTitle>
          <DialogDescription>Заполните форму для {editPost ? 'обновления' : 'создания'} поста</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок *</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Введите заголовок поста" required />
            {titleError && (
              <p className="text-sm font-medium text-destructive">{titleError}</p>
            )}
          </div>

          {/* ИСПРАВЛЕНИЕ: Используем formData.body и handleBodyChange */}
          <RichTextEditor value={formData.body} onChange={handleBodyChange} label="Основной текст *" placeholder="Полный текст поста" required rows={8} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Автор *</Label>
              <Select value={formData.author} onValueChange={(value) => setFormData({ ...formData, author: value })}>
                <SelectTrigger><SelectValue placeholder="Выберите автора" /></SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.initials}>
                      {teacher.initials}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Тип поста *</Label>
              <Select value={formData.type.toString()} onValueChange={(value) => setFormData({ ...formData, type: parseInt(value) })}>
                <SelectTrigger><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                <SelectContent>
                  {POST_TAGS.map((tag, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Дата публикации *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP', { locale: ru }) : 'Выберите дату'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* ИСПРАВЛЕНИЕ: MultipleFileUpload использует formData.files (массив ID) для отображения */}
          <MultipleFileUpload 
            value={formData.files} 
            onChange={(files) => setImageFiles(files)} 
            label="Изображения" 
            maxFiles={20} 
          />
          
          {/* Добавляем чекбокс для драфта (Пункт 6: Добавлен PostStatus) */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isDraft"
              checked={formData.isDraft}
              onCheckedChange={(checked) => setFormData({ ...formData, isDraft: !!checked })}
            />
            <Label htmlFor="isDraft">Сохранить как черновик</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>Отмена</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Сохранение...' : editPost ? 'Обновить' : 'Создать'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}