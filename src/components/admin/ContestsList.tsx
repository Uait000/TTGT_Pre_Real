import { useState, useEffect } from 'react';
import { postsApi, Post, PostCategory } from '@/api/posts'; // ИСПРАВЛЕНИЕ: Импортируем Post и PostCategory
import { POST_TAGS } from '@/api/posts'; // ИСПРАВЛЕНИЕ: POST_TAGS из posts.ts
import { BASE_URL } from '@/api/config'; // ИСПРАВЛЕНИЕ: BASE_URL из config.ts
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ContestForm from './ContestForm';
import { Badge } from '@/components/ui/badge';

export default function ContestsList() {
  const [posts, setPosts] = useState<Post[]>([]); // ИСПРАВЛЕНИЕ: NewsPost заменен на Post
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null); // ИСПРАВЛЕНИЕ: NewsPost заменен на Post
  const { toast } = useToast();

  const loadPosts = async () => {
    try {
      setLoading(true);
      // ИСПРАВЛЕНИЕ: Используем postsApi.getAll с параметром category (Пункт 8)
      const data = await postsApi.getAll({ 
        category: PostCategory.Contests, 
        limit: 100, 
        offset: 0 
      });

      if (Array.isArray(data)) {
        // Убираем старую логику fetch и нормализацию, так как postsApi должен возвращать Post[]
        setPosts(data); 
      } else {
        setPosts([]);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить конкурсы',
        variant: 'destructive',
      });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await postsApi.delete(deleteId);
      toast({
        title: 'Успешно',
        description: 'Конкурс удален',
      });
      loadPosts();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (post: Post) => { // ИСПРАВЛЕНИЕ: NewsPost заменен на Post
    setEditPost(post);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditPost(null);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditPost(null);
    loadPosts();
  };

  const formatDate = (dateInSeconds: number) => {
    if (!dateInSeconds) return '';
    const date = new Date(dateInSeconds * 1000);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };
  
  // Убираем /api из BASE_URL для формирования корректных ссылок на файлы
  const cleanBaseUrl = BASE_URL.replace('/api', '');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление конкурсами</h2>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить конкурс
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Загрузка...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Дата публикации</TableHead>
                <TableHead>Тип поста</TableHead>
                <TableHead>PDF документы</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Нет конкурсов для отображения
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-md truncate">{post.title}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{formatDate(post.publish_date)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {POST_TAGS[post.type] || 'Неизвестно'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {/* ИСПРАВЛЕНИЕ: Используем post.files (BackendFile[]), берем id для ссылки */}
                        {post.files && post.files.length > 0 ? (
                          post.files.map((file, index) => (
                            <a
                              key={file.id} // Используем id файла как ключ
                              // ИСПРАВЛЕНИЕ: Ссылка на файл теперь использует file.id
                              href={`${cleanBaseUrl}/files/${file.id}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline text-sm"
                            >
                              <FileText className="h-4 w-4" />
                              {/* ИСПРАВЛЕНИЕ: Если нет имени файла, используем метки */}
                              {file.name || (index === 0 ? 'Положение' : 'Регламент')}
                            </a>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">Нет документов</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* При передаче поста в форму, убедитесь, что клонируете объект, чтобы избежать мутаций */}
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(JSON.parse(JSON.stringify(post)))} className="gap-1">
                          <Pencil className="h-4 w-4" /> Редактировать
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(post.id)} className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" /> Удалить
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ContestForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditPost(null);
        }}
        onSuccess={handleFormSuccess}
        editPost={editPost}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить конкурс?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Конкурс будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}