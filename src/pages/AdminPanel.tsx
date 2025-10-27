import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import AdminLogin from '@/components/AdminLogin';
import PostsList from '@/components/admin/PostsList';
import PostForm from '@/components/admin/PostForm';
import DeletePostDialog from '@/components/admin/DeletePostDialog';
import VacanciesList from '@/components/admin/VacanciesList';
import VacancyForm from '@/components/admin/VacancyForm';
import FileManager from '@/components/admin/FileManager';
import SiteContentEditor from '@/components/admin/SiteContentEditor';
import ContestsList from '@/components/admin/ContestsList';
import ProfessionalsList from '@/components/admin/ProfessionalsList';
import CodeEditor from '@/components/admin/CodeEditor';
import { authApi } from '@/api/auth';
import { postsApi } from '@/api/posts';
import { vacanciesApi } from '@/api/vacancies';
import type { NewsPost, Vacancy } from '@/api/config';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(authApi.isAuthenticated());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<NewsPost | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isVacancyFormOpen, setIsVacancyFormOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [deletingVacancy, setDeletingVacancy] = useState<Vacancy | null>(null);
  const [isVacancyDeleteOpen, setIsVacancyDeleteOpen] = useState(false);
  const [vacancyRefreshTrigger, setVacancyRefreshTrigger] = useState(0);

  const { toast } = useToast();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authApi.removeToken();
    setIsLoggedIn(false);
  };

  // --- ЛОГИКА ДЛЯ ПОСТОВ ---

  const handleCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: NewsPost) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };
  
  // ✅ ИСПРАВЛЕНИЕ: Единая функция для закрытия формы постов
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPost(null); // Сбрасываем пост при любом закрытии
  };
  
  // Эта функция теперь более лаконичная
  const handleFormSuccess = () => {
    handleFormClose(); // Закрываем форму и сбрасываем состояние
    setRefreshTrigger((prev) => prev + 1); // Обновляем список
  };

  const handleDeleteClick = (post: NewsPost) => {
    setDeletingPost(post);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPost) return;

    try {
      await postsApi.delete(deletingPost.id);
      toast({
        title: 'Успешно',
        description: 'Пост удален',
      });
      setRefreshTrigger((prev) => prev + 1);
      setIsDeleteOpen(false);
      setDeletingPost(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось удалить пост',
        variant: 'destructive',
      });
    }
  };


  // --- ЛОГИКА ДЛЯ ВАКАНСИЙ ---

  const handleVacancyCreate = () => {
    setEditingVacancy(null);
    setIsVacancyFormOpen(true);
  };

  const handleVacancyEdit = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setIsVacancyFormOpen(true);
  };
  
  // ✅ ИСПРАВЛЕНИЕ: Единая функция для закрытия формы вакансий
  const handleVacancyFormClose = () => {
    setIsVacancyFormOpen(false);
    setEditingVacancy(null);
  };
  
  const handleVacancyFormSuccess = () => {
    handleVacancyFormClose();
    setVacancyRefreshTrigger((prev) => prev + 1);
  };

  const handleVacancyDeleteClick = (vacancy: Vacancy) => {
    setDeletingVacancy(vacancy);
    setIsVacancyDeleteOpen(true);
  };

  const handleVacancyDeleteConfirm = async () => {
    if (!deletingVacancy) return;

    try {
      await vacanciesApi.delete(deletingVacancy.id);
      toast({
        title: 'Успешно',
        description: 'Вакансия удалена',
      });
      setVacancyRefreshTrigger((prev) => prev + 1);
      setIsVacancyDeleteOpen(false);
      setDeletingVacancy(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось удалить вакансию',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex relative">
        <Sidebar />

        <main className="flex-1 min-h-screen central-content-area">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">Админ-панель</h1>
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Выйти
                </button>
              )}
            </div>

            {!isLoggedIn ? (
              <AdminLogin onSuccess={handleLoginSuccess} />
            ) : (
              <>
                <Tabs defaultValue="posts" className="w-full">
                  <TabsList className="grid w-full grid-cols-7 gap-1">
                    <TabsTrigger value="posts">Новости</TabsTrigger>
                    <TabsTrigger value="professionals">Профессионалы</TabsTrigger>
                    <TabsTrigger value="contests">Конкурсы</TabsTrigger>
                    <TabsTrigger value="vacancies">Вакансии</TabsTrigger>
                    <TabsTrigger value="content">Контент</TabsTrigger>
                    <TabsTrigger value="files">Файлы</TabsTrigger>
                    <TabsTrigger value="code">Редактор кода</TabsTrigger>
                  </TabsList>

                  <TabsContent value="posts" className="mt-6">
                    <PostsList
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onCreate={handleCreate}
                      refreshTrigger={refreshTrigger}
                    />
                  </TabsContent>

                  <TabsContent value="content" className="mt-6">
                    <SiteContentEditor />
                  </TabsContent>

                  <TabsContent value="vacancies" className="mt-6">
                    <VacanciesList
                      onEdit={handleVacancyEdit}
                      onDelete={handleVacancyDeleteClick}
                      onCreate={handleVacancyCreate}
                      refreshTrigger={vacancyRefreshTrigger}
                    />
                  </TabsContent>

                  <TabsContent value="professionals" className="mt-6">
                    <ProfessionalsList />
                  </TabsContent>

                  <TabsContent value="contests" className="mt-6">
                    <ContestsList />
                  </TabsContent>

                  <TabsContent value="files" className="mt-6">
                    <FileManager />
                  </TabsContent>

                  <TabsContent value="code" className="mt-6">
                    <CodeEditor />
                  </TabsContent>
                </Tabs>

                <PostForm
                  open={isFormOpen}
                  onClose={handleFormClose} // <-- Используем новую функцию
                  onSuccess={handleFormSuccess}
                  editPost={editingPost}
                />

                <DeletePostDialog
                  open={isDeleteOpen}
                  onClose={() => setIsDeleteOpen(false)}
                  onConfirm={handleDeleteConfirm}
                  postTitle={deletingPost?.title || ''}
                />

                <VacancyForm
                  open={isVacancyFormOpen}
                  onClose={handleVacancyFormClose} // <-- Используем новую функцию
                  onSuccess={handleVacancyFormSuccess}
                  editVacancy={editingVacancy}
                />
                
                <DeletePostDialog
                  open={isVacancyDeleteOpen}
                  onClose={() => setIsVacancyDeleteOpen(false)}
                  onConfirm={handleVacancyDeleteConfirm}
                  postTitle={deletingVacancy?.title || ''}
                />
              </>
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

export default AdminPanel;