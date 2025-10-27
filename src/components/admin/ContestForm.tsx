import { useState, useEffect } from 'react';
import { postsApi, type CreatePostPayload, ConflictError, Post, PostCategory } from '@/api/posts'; // Добавил Post и PostCategory
import { teachersApi } from '@/api/teachers';
import type { Teacher } from '@/api/teachers'; // Teacher, так как NewsPost удален
import { POST_TAGS } from '@/api/posts';
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
import PDFUpload from './PDFUpload';
import { filesApi } from '@/api/files';

interface ContestFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPost?: Post | null; // ИСПРАВЛЕНИЕ: NewsPost заменен на Post
}

export default function ContestForm({ open, onClose, onSuccess, editPost }: ContestFormProps) {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pdfFile1, setPdfFile1] = useState<File | null>(null);
  const [pdfFile2, setPdfFile2] = useState<File | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const { toast } = useToast();

  // ИСПРАВЛЕНИЕ: Обновлена структура formData согласно CreatePostPayload
  const [formData, setFormData] = useState<CreatePostPayload>({
    title: '',
    body: '', // ИСПРАВЛЕНИЕ: content заменен на body (Пункт 10)
    author: '',
    type: 0,
    files: [], // ИСПРАВЛЕНИЕ: image_urls заменен на files (Пункт 9)
    publish_date: new Date().getTime(), // ИСПРАВЛЕНИЕ: date заменен на publish_date (Пункт 7: date как number)
    category: PostCategory.Contests, // ИСПРАВЛЕНИЕ: 3 заменен на PostCategory.Contests
    status: 0, // Добавлен status, необходимый для CreatePostPayload
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

    if (open && editPost) {
      // ИСПРАВЛЕНИЕ: publish_date - это число секунд, умножаем на 1000 для Date
      const postDate = new Date(editPost.publish_date * 1000); 

      setFormData({
        title: editPost.title,
        body: editPost.body, // ИСПРАВЛЕНИЕ: content заменен на body
        author: editPost.author,
        type: editPost.type,
        // ИСПРАВЛЕНИЕ: files теперь массив BackendFile, для Payload нам нужны только ID (строки)
        files: editPost.files.map(f => f.id) || [], 
        publish_date: editPost.publish_date, // ИСПРАВЛЕНИЕ: date заменен на publish_date
        category: PostCategory.Contests, // Категория остается конкурсом
        status: 0, // Добавлен status
      });
      setSelectedDate(postDate);
      setPdfFile1(null);
      setPdfFile2(null);
    } else if (open && !editPost) {
      const initialDate = new Date();
      setFormData({
        title: '',
        body: '', // ИСПРАВЛЕНИЕ: content заменен на body
        author: teachers.length > 0 ? teachers[0].initials : '',
        type: 0,
        files: [], // ИСПРАВЛЕНИЕ: image_urls заменен на files
        publish_date: Math.floor(initialDate.getTime() / 1000), // Дата в секундах
        category: PostCategory.Contests, // Категория остается конкурсом
        status: 0, // Добавлен status
      });
      setSelectedDate(initialDate);
      setPdfFile1(null);
      setPdfFile2(null);
    }
  }, [editPost, open, teachers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError(null);

    if (!(formData.title || '').trim() || !formData.author) {
      toast({ title: 'Ошибка', description: 'Пожалуйста, заполните все обязательные поля (*)', variant: 'destructive' });
      return;
    }

    // Проверка наличия первого PDF только при создании
    if (!editPost && !pdfFile1) {
      toast({ title: 'Ошибка', description: 'Пожалуйста, загрузите документ "Положение"', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // ИСПРАВЛЕНИЕ: Собираем текущие ID файлов. Для Post это files, который содержит BackendFile. 
      // При редактировании нам нужно взять ID-шки
      let pdfIds: string[] = editPost?.files.map(f => f.id) || []; 
      
      // Логика загрузки PDF для Contest
      if (pdfFile1) {
        const uploadResult1 = await filesApi.upload(pdfFile1);
        if (typeof uploadResult1 === 'string' && uploadResult1) {
          pdfIds[0] = uploadResult1; // Заменяем первый файл или добавляем
        }
      }

      if (pdfFile2) {
        const uploadResult2 = await filesApi.upload(pdfFile2);
        if (typeof uploadResult2 === 'string' && uploadResult2) {
          pdfIds[1] = uploadResult2; // Заменяем второй файл или добавляем
        }
      }
      
      // Очищаем массив от undefined, если второй файл не был загружен при создании, но editPost его не имел
      pdfIds = pdfIds.filter(id => id); 
      
      // ИСПРАВЛЕНИЕ: Обновляем Payload
      const payload: CreatePostPayload = {
        ...formData,
        body: 'PDF документы конкурса', // ИСПРАВЛЕНИЕ: content заменен на body
        publish_date: Math.floor(selectedDate.getTime() / 1000), // ИСПРАВЛЕНИЕ: date заменен на publish_date (в секундах)
        files: pdfIds, // ИСПРАВЛЕНИЕ: image_urls заменен на files
      };

      if (editPost) {
        // При обновлении postsApi.update принимает Partial<CreatePostPayload>
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
      body: '', // ИСПРАВЛЕНИЕ: content заменен на body
      author: teachers.length > 0 ? teachers[0].initials : '',
      type: 0,
      files: [], // ИСПРАВЛЕНИЕ: image_urls заменен на files
      publish_date: Math.floor(initialDate.getTime() / 1000), // Дата в секундах
      category: PostCategory.Contests, // Категория остается конкурсом
      status: 0, // Добавлен status
    });
    setSelectedDate(initialDate);
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

          <PDFUpload
            // ИСПРАВЛЕНИЕ: editPost?.files теперь содержит BackendFile[], берем только ID (строку)
            value={pdfFile1 || (editPost?.files?.[0]?.id || '')} 
            onChange={setPdfFile1}
            label="Положение *"
          />

          <PDFUpload
            // ИСПРАВЛЕНИЕ: editPost?.files теперь содержит BackendFile[], берем только ID (строку)
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