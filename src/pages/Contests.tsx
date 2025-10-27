import { useState, useEffect } from 'react';
// ИСПРАВЛЕНИЕ 1: contestsApi заменен на postsApi. Добавлен Post и PostCategory.
import { postsApi, Post, PostCategory } from '@/api/posts'; 
// ИСПРАВЛЕНИЕ 2: Contest (из config) заменен на Post (из posts)
import type { Post as Contest } from '@/api/posts'; 
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import ContestCard from '@/components/admin/ContestCard';

const Contests = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      setLoading(true);
      // ИСПРАВЛЕНИЕ 3: Используем postsApi.getAll с фильтром по категории "Конкурсы"
      const data = await postsApi.getAll({ 
        category: PostCategory.Contests,
        limit: 100, // Добавим лимит, если он не указан явно, для безопасности
      });
      
      // Поскольку мы импортировали Post как Contest (type { Post as Contest }), 
      // TypeScript не будет ругаться, а данные будут корректными.
      setContests(data as Contest[]); 
    } catch (error) {
      console.error('Failed to load contests:', error);
      setContests([]); // Очищаем список при ошибке
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex relative">
        <Sidebar />

        <main className="flex-1 min-h-screen central-content-area">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-foreground mb-8">Конкурсы</h1>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Загрузка...</p>
              </div>
            ) : contests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Нет активных конкурсов</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map((contest) => (
                  <ContestCard key={contest.id} contest={contest} />
                ))}
              </div>
            )}
          </div>
        </main>

        <aside className="fixed-right-panel">
          <div className="p-6">
            <SidebarCards />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Contests;