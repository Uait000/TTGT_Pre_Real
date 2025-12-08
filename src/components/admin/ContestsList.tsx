import { useState, useEffect } from 'react';
import { postsApi, Post, PostCategory } from '@/api/posts'; 
import { POST_TAGS } from '@/api/posts'; 
import { BASE_URL } from '@/api/config'; 
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus, FileText, Link as LinkIcon, Layers } from 'lucide-react';
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
  const [posts, setPosts] = useState<Post[]>([]); 
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null); 
  const { toast } = useToast();

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      // ИЗМЕНЕНИЕ: Лимит увеличен до 10000
      const data = await postsApi.getAll({ 
        category: PostCategory.Contests, 
        limit: 10000, 
        offset: 0 
      });

      if (Array.isArray(data)) {
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

  const formatDate = (dateInSeconds: number) => {
    if (!dateInSeconds) return '';
    const date = new Date(dateInSeconds * 1000);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };
  
  const cleanBaseUrl = BASE_URL.replace('/api', '');

  // Helper to parse the dynamic body content for display
  const renderContestContent = (post: Post) => {
    try {
      const items = JSON.parse(post.body);
      if (Array.isArray(items)) {
        return (
          <div className="flex flex-col gap-1">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-1 text-sm text-gray-600">
                {item.type === 'link' ? <LinkIcon size={12}/> : <FileText size={12}/>}
                <span className="truncate max-w-[200px]">{item.name}</span>
              </div>
            ))}
          </div>
        );
      }
    } catch (e) {
      // Fallback for old posts
      return (
        <div className="flex flex-col gap-1">
           {post.files && post.files.map((file, idx) => (
             <div key={file.id} className="flex items-center gap-1 text-sm text-gray-600">
               <FileText size={12} />
               <span>{idx === 0 ? 'Положение' : 'Регламент'}</span>
             </div>
           ))}
        </div>
      );
    }
    return <span className="text-muted-foreground">-</span>;
  };

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
                <TableHead>Дата публикации</TableHead>
                <TableHead>Содержимое</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Нет конкурсов для отображения
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-md truncate">
                        {post.title}
                    </TableCell>
                    <TableCell>{formatDate(post.publish_date)}</TableCell>
                    <TableCell>
                      {renderContestContent(post)}
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