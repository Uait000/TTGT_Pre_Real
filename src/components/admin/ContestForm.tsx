import { useState, useEffect } from 'react';
import { postsApi, type CreatePostPayload, ConflictError, Post, PostCategory, PostStatus } from '@/api/posts';
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
import { Trash2, Plus, FileText, Link as LinkIcon, AlignLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RichTextEditor from '@/components/admin/RichTextEditor'; // Убедитесь, что путь верный

interface ContestFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPost?: Post | null;
}

// Расширенный интерфейс элемента
interface ContestItem {
  id: string;
  name: string; // Используется как заголовок файла/ссылки или игнорируется для текста
  type: 'file' | 'link' | 'text';
  file: File | null;
  fileId: string;
  linkUrl: string;
  textContent: string; // Новое поле для HTML текста
}

const DEFAULT_AUTHOR = "Администрация";
const DEFAULT_POST_TYPE = 3;

export default function ContestForm({ open, onClose, onSuccess, editPost }: ContestFormProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ContestItem[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      if (editPost) {
        setIsPublished(editPost.status === PostStatus.Published);
        
        try {
          const parsedBody = JSON.parse(editPost.body);
          if (Array.isArray(parsedBody)) {
            const loadedItems: ContestItem[] = parsedBody.map((item: any, index: number) => ({
              id: `existing-${index}`,
              name: item.name || '',
              type: item.type || 'file',
              file: null,
              fileId: item.fileId || '',
              linkUrl: item.linkUrl || '',
              textContent: item.textContent || ''
            }));
            setItems(loadedItems);
          } else {
            throw new Error("Legacy format");
          }
        } catch (e) {
          // Fallback для старых постов
          const legacyItems: ContestItem[] = [];
          if (editPost.files && editPost.files.length > 0) {
            legacyItems.push({
              id: 'legacy-1',
              name: 'Положение',
              type: 'file',
              file: null,
              fileId: editPost.files[0].id,
              linkUrl: '',
              textContent: ''
            });
          }
          if (legacyItems.length === 0) {
             legacyItems.push(createEmptyItem());
          }
          setItems(legacyItems);
        }
      } else {
        setIsPublished(false);
        setItems([createEmptyItem()]);
      }
    }
  }, [editPost, open]);

  const createEmptyItem = (): ContestItem => ({
    id: `new-${Date.now()}`,
    name: '',
    type: 'file',
    file: null,
    fileId: '',
    linkUrl: '',
    textContent: ''
  });

  const addItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: keyof ContestItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newItems = [...items];
    newItems[index].file = file;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    for (const item of items) {
      if (item.type === 'text') {
        if (!item.textContent || item.textContent === '<p><br></p>') {
           toast({ title: 'Ошибка', description: 'Текстовый блок не может быть пустым', variant: 'destructive' });
           return;
        }
      } else {
        if (!item.name.trim()) {
          toast({ title: 'Ошибка', description: 'Укажите название для файла или ссылки', variant: 'destructive' });
          return;
        }
      }
      
      if (item.type === 'link' && !item.linkUrl.trim()) {
        toast({ title: 'Ошибка', description: `В блоке "${item.name}" не указана ссылка`, variant: 'destructive' });
        return;
      }
      if (item.type === 'file' && !item.file && !item.fileId) {
        toast({ title: 'Ошибка', description: `В блоке "${item.name}" не выбран файл`, variant: 'destructive' });
        return;
      }
    }

    setLoading(true);
    try {
      const finalItems = await Promise.all(items.map(async (item) => {
        let finalFileId = item.fileId;

        if (item.type === 'file' && item.file) {
          const uploadResult = await filesApi.upload(item.file);
          if (typeof uploadResult === 'string' && uploadResult) {
            finalFileId = uploadResult;
          }
        }

        return {
          name: item.name,
          type: item.type,
          fileId: item.type === 'file' ? finalFileId : '',
          linkUrl: item.type === 'link' ? item.linkUrl : '',
          textContent: item.type === 'text' ? item.textContent : ''
        };
      }));

      const bodyJson = JSON.stringify(finalItems);
      
      // Авто-заголовок берем из первого элемента
      let autoTitle = `Конкурс от ${new Date().toLocaleDateString()}`;
      if (finalItems.length > 0) {
          if (finalItems[0].type === 'text') {
              // Если первый блок текст - пробуем вырезать из него текст (без html тегов) для заголовка
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = finalItems[0].textContent;
              const text = tempDiv.textContent || tempDiv.innerText || '';
              autoTitle = text.slice(0, 50) + (text.length > 50 ? '...' : '');
          } else {
              autoTitle = finalItems[0].name;
          }
      }

      const allFileIds = finalItems.filter(i => i.type === 'file' && i.fileId).map(i => i.fileId);

      const payload: CreatePostPayload = {
        title: autoTitle || 'Без названия',
        body: bodyJson,
        author: DEFAULT_AUTHOR,
        type: DEFAULT_POST_TYPE,
        files: allFileIds,
        publish_date: editPost ? editPost.publish_date : Math.floor(Date.now() / 1000),
        category: PostCategory.Contests,
        status: isPublished ? PostStatus.Published : PostStatus.Draft,
      };

      if (editPost) {
        await postsApi.update(editPost.id, payload);
        toast({ title: 'Успешно', description: 'Конкурс обновлен' });
      } else {
        await postsApi.create(payload);
        toast({ title: 'Успешно', description: 'Конкурс создан' });
      }
      onSuccess();
      handleClose();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setItems([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPost ? 'Редактировать конкурс' : 'Создать конкурс'}</DialogTitle>
          <DialogDescription>
            Добавляйте файлы, ссылки или просто пишите текст.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-xl bg-gray-50/50 shadow-sm relative transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Блок #{index + 1}</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1} 
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>

                <Tabs 
                  value={item.type} 
                  onValueChange={(val) => updateItem(index, 'type', val as 'file' | 'link' | 'text')}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="file">📄 Файл</TabsTrigger>
                    <TabsTrigger value="link">🔗 Ссылка</TabsTrigger>
                    <TabsTrigger value="text">📝 Текст</TabsTrigger>
                  </TabsList>
                  
                  {/* ФАЙЛ */}
                  <TabsContent value="file" className="space-y-4">
                    <div>
                      <Label className="mb-1.5 block">Название кнопки (например: "Положение")</Label>
                      <Input 
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        placeholder="Скачать документ..."
                        className="bg-white"
                      />
                    </div>
                    <div>
                        <Label className="mb-1.5 block">Выберите файл</Label>
                        <div className="flex items-center gap-3">
                            <Input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                            className="cursor-pointer bg-white"
                            onChange={(e) => handleFileChange(index, e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                        {item.fileId && !item.file && (
                            <p className="text-xs text-green-600 mt-2 flex items-center bg-green-50 p-2 rounded border border-green-100">
                            <FileText size={14} className="mr-1.5"/> Файл загружен (ID: ...{item.fileId.slice(-6)})
                            </p>
                        )}
                    </div>
                  </TabsContent>
                  
                  {/* ССЫЛКА */}
                  <TabsContent value="link" className="space-y-4">
                    <div>
                      <Label className="mb-1.5 block">Текст ссылки</Label>
                      <Input 
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        placeholder="Перейти на сайт..."
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">URL Адрес</Label>
                      <div className="flex items-center gap-2">
                        <LinkIcon size={16} className="text-gray-400 shrink-0" />
                        <Input 
                          placeholder="https://..." 
                          value={item.linkUrl}
                          onChange={(e) => updateItem(index, 'linkUrl', e.target.value)}
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* ТЕКСТ */}
                  <TabsContent value="text">
                    <div className="pt-1">
                        <Label className="mb-2 block">Содержание (можно вставлять ссылки и форматировать)</Label>
                        <RichTextEditor
                            value={item.textContent}
                            onChange={(val) => updateItem(index, 'textContent', val)}
                            placeholder="Напишите условия конкурса или вставьте важную информацию..."
                        />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addItem} className="w-full border-dashed border-2 py-6 text-gray-500 hover:text-primary hover:border-primary/50">
            <Plus size={20} className="mr-2" /> Добавить еще блок
          </Button>

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Switch
              id="status"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="status">Опубликовать конкурс на сайте</Label>
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