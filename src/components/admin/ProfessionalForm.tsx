import { useState, useEffect } from 'react';
import { postsApi, type CreatePostPayload, ConflictError, Post, PostCategory, PostStatus } from '@/api/posts'; 
import { teachersApi } from '@/api/teachers';
import type { Teacher } from '@/api/teachers';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Popover as CalendarPopover, PopoverContent as CalendarPopoverContent, PopoverTrigger as CalendarPopoverTrigger } from '@/components/ui/popover'; 
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import RichTextEditor from './RichTextEditor';
import MultipleFileUpload from './MultipleFileUpload';
import { Checkbox } from '@/components/ui/checkbox';

interface ProfessionalFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPost?: Post | null;
}

export default function ProfessionalForm({ open, onClose, onSuccess, editPost }: ProfessionalFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [isTeacherSearching, setIsTeacherSearching] = useState(false);
  const [isTeacherPopoverOpen, setIsTeacherPopoverOpen] = useState(false);
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [titleError, setTitleError] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreatePostPayload & { isDraft: boolean }>({
    title: '',
    body: '',
    author: '',
    type: 0,
    files: [],
    publish_date: Math.floor(new Date().getTime() / 1000),
    category: PostCategory.Professionals,
    status: PostStatus.Draft,
    isDraft: true,
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // --- ИЗМЕНЕНО: useEffect для поиска авторов ---
  // Теперь он запускается всегда, когда меняется teacherSearch
  // Если teacherSearch пустой - он загрузит список по умолчанию
  useEffect(() => {
    setIsTeacherSearching(true);
    const timerId = setTimeout(() => {
      teachersApi.getAll({ search: teacherSearch, limit: 1000 })
        .then(setTeacherList)
        .catch((err) => {
          console.error("Failed to search teachers:", err);
          toast({ title: 'Ошибка', description: 'Не удалось найти автора', variant: 'destructive' });
        })
        .finally(() => setIsTeacherSearching(false));
    }, 300); // 300ms debounce

    return () => clearTimeout(timerId);
  }, [teacherSearch, toast]); // ---

  // --- useEffect для заполнения формы ---
  useEffect(() => {
    setTitleError(null);
    const postDate = editPost ? new Date(editPost.publish_date * 1000) : new Date();

    if (open && editPost) {
      const fileIds = editPost.files?.map(f => f.id) || [];
      
      setFormData({
        title: editPost.title,
        body: editPost.body,
        author: editPost.author,
        type: editPost.type,
        files: fileIds,
        publish_date: editPost.publish_date,
        category: PostCategory.Professionals,
        status: editPost.status || PostStatus.Draft,
        isDraft: editPost.status === PostStatus.Draft,
      });
      setSelectedDate(postDate);
      setImageFiles([]);
      // Устанавливаем поиск на текущего автора (это вызовет useEffect выше)
      setTeacherSearch(editPost.author);
    } else if (open && !editPost) {
      const initialDate = new Date();
      setFormData({
        title: '',
        body: '',
        author: '',
        type: 0,
        files: [],
        publish_date: Math.floor(initialDate.getTime() / 1000),
        category: PostCategory.Professionals,
        status: PostStatus.Draft,
        isDraft: true,
      });
      setSelectedDate(initialDate);
      setImageFiles([]);
      // Сбрасываем поиск на пустую строку (это вызовет useEffect выше)
      setTeacherSearch('');
    }
  }, [editPost, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError(null);

    if (!(formData.title || '').trim() || !(formData.body || '').trim() || !formData.author) {
      toast({ title: 'Ошибка', description: 'Пожалуйста, заполните все обязательные поля (*)', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const finalPayload: CreatePostPayload = {
        ...formData,
        publish_date: Math.floor(selectedDate.getTime() / 1000), 
        status: formData.isDraft ? PostStatus.Draft : PostStatus.Published,
      };

      if (editPost) {
        await postsApi.update(editPost.id, finalPayload, imageFiles.length > 0 ? imageFiles : undefined);
        toast({ title: 'Успешно', description: 'Профессионал обновлен' });
      } else {
        await postsApi.create(finalPayload, imageFiles.length > 0 ? imageFiles : undefined);
        toast({ title: 'Успешно', description: 'Профессионал создан' });
      }
      onSuccess();
    } catch (error) {
      if (error instanceof ConflictError) {
        setTitleError(error.message);
      } else {
        toast({ title: 'Ошибка', description: error instanceof Error ? error.message : 'Не удалось сохранить профессионала', variant: 'destructive' });
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
      author: '',
      type: 0,
      files: [],
      publish_date: Math.floor(initialDate.getTime() / 1000),
      category: PostCategory.Professionals,
      status: PostStatus.Draft,
      isDraft: true,
    });
    setSelectedDate(initialDate);
    setImageFiles([]);
    setTitleError(null);
    setTeacherSearch('');
    onClose();
  };
  
  const handleBodyChange = (value: string) => setFormData({ ...formData, body: value });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPost ? 'Редактировать профессионала' : 'Добавить профессионалов'}</DialogTitle>
          <DialogDescription>Заполните форму для {editPost ? 'обновления' : 'создания'} профессионала</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок *</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Введите заголовок профессионала" required />
            {titleError && (
              <p className="text-sm font-medium text-destructive">{titleError}</p>
            )}
          </div>

          <RichTextEditor value={formData.body} onChange={handleBodyChange} label="Основной текст *" placeholder="Полный текст о профессионале" required rows={8} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Автор *</Label>
              {/* --- Combobox --- */}
              <Popover open={isTeacherPopoverOpen} onOpenChange={setIsTeacherPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isTeacherPopoverOpen}
                    className="w-full justify-between"
                  >
                    {formData.author
                      ? formData.author
                      : "Выберите автора..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Поиск по фамилии..."
                      value={teacherSearch}
                      onValueChange={setTeacherSearch} // При вводе меняем search
                    />
                    <CommandList>
                      {isTeacherSearching && (
                        <div className="p-2 flex justify-center items-center">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                      {!isTeacherSearching && teacherList.length === 0 && (
                         <CommandEmpty>Авторы не найдены.</CommandEmpty>
                      )}
                      <CommandGroup>
                        {teacherList.map((teacher) => (
                          <CommandItem
                            key={teacher.id}
                            value={teacher.initials}
                            onSelect={() => {
                              const selectedInitials = teacher.initials;
                              setFormData({ ...formData, author: selectedInitials });
                              // Также обновляем search, чтобы инпут показал полное имя
                              setTeacherSearch(selectedInitials);
                              setIsTeacherPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.author === teacher.initials ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {teacher.initials}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {/* --- Конец блока Combobox --- */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Тип поста *</Label>
              {/* --- Select --- */}
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
            <CalendarPopover>
              <CalendarPopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP', { locale: ru }) : 'Выберите дату'}
                </Button>
              </CalendarPopoverTrigger>
              <CalendarPopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus />
              </CalendarPopoverContent>
            </CalendarPopover>
          </div>

          <MultipleFileUpload 
            value={formData.files} 
            onChange={(files) => setImageFiles(files)} 
            label="Изображения" 
            maxFiles={20} 
          />
          
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