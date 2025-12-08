import { useEffect, useState } from 'react';
import { postsApi, Post, PostCategory } from '@/api/posts'; 
import { POST_TAGS } from '@/api/posts'; 
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostsListProps {
  onEdit: (post: Post) => void; 
  onDelete: (post: Post) => void; 
  onCreate: () => void;
  refreshTrigger?: number;
  category?: PostCategory; // Добавляем проп категории
}

export default function PostsList({ onEdit, onDelete, onCreate, refreshTrigger, category = PostCategory.News }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]); 
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postsApi.getAll({ 
          limit: 500,
          offset: 0,
          category: category, // Используем проп
      });

      if (Array.isArray(data)) {
        const normalizedPosts = data.map(post => ({
          ...post,
          author: post.author || 'Неизвестный автор', 
          body: post.body || '', 
        })) as Post[];
        
        setPosts(normalizedPosts);
      } else {
        console.error("API did not return an array for posts:", data);
        setPosts([]);
      }

    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось загрузить записи',
        variant: 'destructive',
      });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [refreshTrigger, category]);

  const formatDate = (dateInSeconds: number) => {
    if (!dateInSeconds) return '';
    const date = new Date(dateInSeconds * 1000); 
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Список записей</h2>
        <Button onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить запись
        </Button>
      </div>
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заголовок / Имя</TableHead>
              {category !== PostCategory.Pride && <TableHead>Автор</TableHead>}
              <TableHead>Дата</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={category !== PostCategory.Pride ? 5 : 4} className="text-center py-8 text-muted-foreground">
                  Нет записей для отображения
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-md truncate" title={post.title}>
                    {post.title}
                  </TableCell>
                  {category !== PostCategory.Pride && <TableCell>{post.author}</TableCell>}
                  <TableCell>{formatDate(post.publish_date)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status === 1 ? 'Опубликован' : 'Черновик'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(post)} className="gap-1">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(post)} className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
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
    </div>
  );
}