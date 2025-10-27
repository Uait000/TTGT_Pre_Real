import { useState, useEffect } from 'react';
import { postsApi, Post, PostCategory } from '@/api/posts'; // ИСПРАВЛЕНИЕ 1: Импортируем Post и PostCategory
import { POST_TAGS } from '@/api/posts'; // ИСПРАВЛЕНИЕ 2: POST_TAGS из posts.ts
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
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
import ProfessionalForm from './ProfessionalForm';

export default function ProfessionalsList() {
  const [posts, setPosts] = useState<Post[]>([]); // ИСПРАВЛЕНИЕ 3: NewsPost заменен на Post
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null); // ИСПРАВЛЕНИЕ 4: NewsPost заменен на Post
  const { toast } = useToast();

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      // ИСПРАВЛЕНИЕ 5: Используем postsApi.getAll с параметром category (Пункт 8)
      const data = await postsApi.getAll({ 
        category: PostCategory.Professionals, // Категория "Профессионалы" (1)
        limit: 100, 
        offset: 0 
      });

      if (Array.isArray(data)) {
        // Убираем ручную нормализацию. data уже должно быть Post[]
        setPosts(data); 
      } else {
        setPosts([]);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить профессионалов',
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
        description: 'Профессионал удален',
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

  const handleEdit = (post: Post) => { // ИСПРАВЛЕНИЕ 6: NewsPost заменен на Post
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление профессионалами</h2>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить профессионала
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Загрузка...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заголовок</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Дата публикации</TableHead>
                <TableHead>Тип поста</TableHead>
                <TableHead>Просмотры</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Нет профессионалов для отображения
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
                    <TableCell>{post.views}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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

      <ProfessionalForm
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
            <AlertDialogTitle>Удалить профессионала?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Профессионал будет удален навсегда.
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