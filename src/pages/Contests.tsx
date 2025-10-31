import { useQuery } from '@tanstack/react-query';
import { postsApi, Post, PostCategory, BackendFile } from '@/api/posts'; 
import { BASE_URL } from '@/api/config';
import type { Post as Contest } from '@/api/posts'; 
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// ИЗМЕНЕНО: Убрана иконка Download
import { Loader2, FileText } from 'lucide-react'; 

/**
 * Генерирует ПРАВИЛЬНЫЙ публичный URL для GET-запроса, используя ID.
 */
const getPdfUrl = (file: BackendFile | undefined): string | null => {
  if (!file || !file.name) return null; // <-- Правильно, file.name
  const cleanBaseUrl = BASE_URL.endsWith('/api') ? BASE_URL.slice(0, -4) : BASE_URL;
  return `${cleanBaseUrl}/files/${encodeURIComponent(file.name)}`;
};

/**
 * Форматирует дату
 */
const formatDate = (dateInSeconds: number) => {
  if (!dateInSeconds) return '';
  const date = new Date(dateInSeconds * 1000);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Функция загрузки данных для useQuery
const fetchContests = async () => {
  return await postsApi.getAll({ 
    category: PostCategory.Contests,
    limit: 100,
  });
};

const Contests = () => {
  // Используем useQuery (как в NewsSection)
  const { data: contests = [], isLoading } = useQuery<Contest[]>({
    queryKey: ['posts', PostCategory.Contests],
    queryFn: fetchContests,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex relative">
        <Sidebar />

        <main className="flex-1 min-h-screen central-content-area">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-foreground mb-8">Конкурсы</h1>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              </div>
            ) : contests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Нет активных конкурсов</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {contests.map((contest) => {
                  const polozhenieUrl = getPdfUrl(contest.files?.[0]);
                  const reglamentUrl = getPdfUrl(contest.files?.[1]);

                  return (
                    <Card key={contest.id} className="shadow-md">
                      <CardHeader>
                        <CardTitle className="text-xl">{contest.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col sm:flex-row gap-4">
                        {polozhenieUrl ? (
                          <Button asChild className="w-full sm:w-auto justify-start gap-2">
                            {/* `target="_blank"` открывает PDF в новой вкладке */}
                            <a href={polozhenieUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 flex-shrink-0" />
                              <span>Положение о конкурсе</span>
                            </a>
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground">Положение не найдено.</p>
                        )}

                        {reglamentUrl && (
                          <Button asChild variant="secondary" className="w-full sm:w-auto justify-start gap-2">
                            <a href={reglamentUrl} target="_blank" rel="noopener noreferrer">
                              {/* --- ИЗМЕНЕНО: Иконка Download заменена на FileText --- */}
                              <FileText className="h-4 w-4 flex-shrink-0" />
                              <span>Регламент</span>
                            </a>
                          </Button>
                        )}
                      </CardContent>
                      <CardFooter className="text-sm text-muted-foreground justify-between pt-4 border-t">
                        <span>{formatDate(contest.publish_date)}</span>
                        <span>{contest.author}</span>
                      </CardFooter>
                    </Card>
                  );
                })}
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