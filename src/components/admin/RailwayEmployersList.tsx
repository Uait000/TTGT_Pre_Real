import { useState, useEffect } from 'react';
import { postsApi, Post, PostStatus } from '@/api/posts'; 
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus, FileText, Loader2 } from 'lucide-react';
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
import RailwayEmployersForm from './RailwayEmployersForm';
import { Badge } from '@/components/ui/badge';

const EMPLOYERS_CATEGORY_ID = 13;

export default function RailwayEmployersList() {
  const [posts, setPosts] = useState<Post[]>([]); 
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null); 
  const { toast } = useToast();

  const loadPosts = async () => {
    try {
      setLoading(true);
      // Загружаем посты с категорией 13 (Работодатели)
      const data = await postsApi.getAll({ 
        category: EMPLOYERS_CATEGORY_ID, 
        limit: 10000, 
        offset: 0 
      });

      if (Array.isArray(data)) {
        setPosts(data); 
      } else {
        setPosts([]);
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить список', variant: 'destructive' });
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
      toast({ title: 'Успешно', description: 'Удалено' });
      loadPosts();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (post: Post) => { 
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Работодатели (Вакансии)</h2>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить вакансию
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary"/></div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Название</TableHead>
                <TableHead>Файлы</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Нет данных
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                        <div className="truncate max-w-[400px]" title={post.title}>{post.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FileText size={14} />
                        <span>{post.files ? post.files.length : 0} файл(ов)</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={post.status === 1 ? 'default' : 'secondary'}>
                            {post.status === 1 ? 'Опубликован' : 'Черновик'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(JSON.parse(JSON.stringify(post)))} className="gap-1">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(post.id)} className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
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

      <RailwayEmployersForm
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
            <AlertDialogTitle>Удалить вакансию?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить.
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