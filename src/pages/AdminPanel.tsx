import { useState, useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import PostsList from '@/components/admin/PostsList';
import PostForm from '@/components/admin/PostForm';
import DeletePostDialog from '@/components/admin/DeletePostDialog';
import VacanciesList from '@/components/admin/VacanciesList';
import VacancyForm from '@/components/admin/VacancyForm';
import ZamenaManager from '@/components/admin/ZamenaManager'; 
import ContestsList from '@/components/admin/ContestsList';
import ProfessionalsList from '@/components/admin/ProfessionalsList';
import TickerSettingsForm from '@/components/admin/TickerSettingsForm';
import DocumentsList from '@/components/admin/DocumentsList';
import DocumentForm from '@/components/admin/DocumentForm';
import AccessibleEnvironmentList from '@/components/admin/AccessibleEnvironmentList';
import AccessibleEnvironmentForm from '@/components/admin/AccessibleEnvironmentForm';
import PaymentReceiptsList from '@/components/admin/PaymentReceiptsList';
import PaymentReceiptForm from '@/components/admin/PaymentReceiptForm';
import IOSContentList from '@/components/admin/IOSContentList';
import IOSContentForm from '@/components/admin/IOSContentForm';
import OpenDaySettingsForm from '@/components/admin/OpenDaySettingsForm';
import PageContentList from '@/components/admin/PageContentList';
import PageContentForm from '@/components/admin/PageContentForm';
import ScheduleManager from '@/components/admin/ScheduleManager';
import ScheduleSettingsForm from '@/components/admin/ScheduleSettingsForm';
import SiteContentEditor from '@/components/admin/SiteContentEditor';
import ExamScheduleList from '@/components/admin/ExamScheduleList';
import ExamScheduleForm from '@/components/admin/ExamScheduleForm';
import ExamPeriodsSettingsForm from '@/components/admin/ExamPeriodsSettingsForm';

// ИМПОРТ НОВЫХ КОМПОНЕНТОВ
import RailwayEmployersList from '@/components/admin/RailwayEmployersList';
import RailwayEmployersForm from '@/components/admin/RailwayEmployersForm';

import { authApi } from '@/api/auth';
import { Post, postsApi, PostCategory } from '@/api/posts';
import { vacanciesApi } from '@/api/vacancies';
import type { NewsPost, Vacancy } from '@/api/config';
import { useToast } from '@/hooks/use-toast';
import documentsApi from '@/api/documents';
import type { Document } from '@/api/documents';
import accessibleEnvironmentApi from '@/api/accessible-environment';
import type { AccessibleEnvironmentDocument } from '@/api/accessible-environment';
import { paymentReceiptsApi } from '@/api/payment-receipts';
import type { PaymentReceipt } from '@/types/payment-receipts';
import { iosContentApi } from '@/api/ios-content';
import type { IOSContent } from '@/api/ios-content';
import { pageContentApi, type PageContent, ContentType } from '@/api/page-content';
import examScheduleApi from '@/api/exam-schedule';
import type { ExamSchedule } from '@/api/exam-schedule';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  Newspaper, 
  Users, 
  Trophy, 
  Briefcase, 
  Calendar, 
  Megaphone, 
  FileText, 
  LogOut, 
  Accessibility, 
  CreditCard, 
  Plus, 
  MonitorPlay, 
  Settings, 
  GraduationCap, 
  ClipboardList, 
  Microscope, 
  Train, 
  BookOpen, 
  Clock, 
  Lock,
  Star,
  Award,
  Flag,
  LayoutTemplate,
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type AdminTab = 'zamena' | 'site-content' | 'schedule' | 'exam-schedule' | 'posts' | 'contests' | 'ticker' | 'open-day' | 'vacancies' | 'professionals' | 'documents' | 'accessible-environment' | 'payment-receipts' | 'ios-content' | 'admission-numbers' | 'admission-rules' | 'memo' | 'state-exam' | 'start-in-science' | 'russia-belarus' | 'railway-employers' | 'victory-80' | 'anniversary-95' | 'pride';

interface AdminPermissions {
  can_manage_posts: boolean;
  can_manage_vacancies: boolean;
  can_manage_teachers: boolean;
  can_manage_settings: boolean;
  can_manage_files: boolean;
  can_manage_schedule: boolean;
  can_access_admin_panel: boolean;
  can_access_courses_panel: boolean;
}

const PermissionGuard = ({ 
  permission, 
  children 
}: { 
  permission: keyof AdminPermissions;
  children: React.ReactNode;
}) => {
  const { permissions } = useAuth();
  
  if (!permissions || !permissions[permission]) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <Lock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Доступ запрещен</h3>
        <p className="text-yellow-700">
          У вас недостаточно прав для доступа к этому разделу.
        </p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default function AdminPanel() {
  const { admin, permissions, refreshAuth, logout: authLogout } = useAuth();
  const { isScheduleUser } = usePermissions();
  const [isLoggedIn, setIsLoggedIn] = useState(authApi.isAuthenticated());
  
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    const savedTab = localStorage.getItem('adminActiveTab');
    return (savedTab as AdminTab) || 'zamena';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Стандартные состояния (оставил как есть)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<NewsPost | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPostCategory, setCurrentPostCategory] = useState<PostCategory>(PostCategory.News);

  // Вакансии
  const [isVacancyFormOpen, setIsVacancyFormOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [deletingVacancy, setDeletingVacancy] = useState<Vacancy | null>(null);
  const [isVacancyDeleteOpen, setIsVacancyDeleteOpen] = useState(false);
  const [vacancyRefreshTrigger, setVacancyRefreshTrigger] = useState(0);

  // Документы
  const [isDocumentFormOpen, setIsDocumentFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<Document | null>(null);
  const [isDocumentDeleteOpen, setIsDocumentDeleteOpen] = useState(false);
  const [documentRefreshTrigger, setDocumentRefreshTrigger] = useState(0);

  // Доступная среда
  const [isAccessibleFormOpen, setIsAccessibleFormOpen] = useState(false);
  const [editingAccessibleDoc, setEditingAccessibleDoc] = useState<AccessibleEnvironmentDocument | null>(null);
  const [deletingAccessibleDoc, setDeletingAccessibleDoc] = useState<AccessibleEnvironmentDocument | null>(null);
  const [isAccessibleDeleteOpen, setIsAccessibleDeleteOpen] = useState(false);
  const [accessibleRefreshTrigger, setAccessibleRefreshTrigger] = useState(0);

  // Квитанции
  const [isPaymentReceiptFormOpen, setIsPaymentReceiptFormOpen] = useState(false);
  const [editingPaymentReceipt, setEditingPaymentReceipt] = useState<PaymentReceipt | null>(null);
  const [deletingPaymentReceipt, setDeletingPaymentReceipt] = useState<PaymentReceipt | null>(null);
  const [isPaymentReceiptDeleteOpen, setIsPaymentReceiptDeleteOpen] = useState(false);
  const [paymentReceiptRefreshTrigger, setPaymentReceiptRefreshTrigger] = useState(0);
  const [activeReceiptTab, setActiveReceiptTab] = useState<'list' | 'form'>('list');

  // IOS
  const [isIOSContentFormOpen, setIsIOSContentFormOpen] = useState(false);
  const [editingIOSContent, setEditingIOSContent] = useState<IOSContent | null>(null);
  const [deletingIOSContent, setDeletingIOSContent] = useState<IOSContent | null>(null);
  const [isIOSContentDeleteOpen, setIsIOSContentDeleteOpen] = useState(false);
  const [iosContentRefreshTrigger, setIosContentRefreshTrigger] = useState(0);

  // День открытых дверей
  const [isOpenDayFormOpen, setIsOpenDayFormOpen] = useState(false);
  const [openDayRefreshTrigger, setOpenDayRefreshTrigger] = useState(0);

  // Контент страниц
  const [isPageContentFormOpen, setIsPageContentFormOpen] = useState(false);
  const [editingPageContent, setEditingPageContent] = useState<PageContent | null>(null);
  const [deletingPageContent, setDeletingPageContent] = useState<PageContent | null>(null);
  const [isPageContentDeleteOpen, setIsPageContentDeleteOpen] = useState(false);
  const [pageContentRefreshTrigger, setPageContentRefreshTrigger] = useState(0);

  // Расписание
  const [isScheduleSettingsOpen, setIsScheduleSettingsOpen] = useState(false);

  // Расписание экзаменов
  const [isExamScheduleFormOpen, setIsExamScheduleFormOpen] = useState(false);
  const [editingExamSchedule, setEditingExamSchedule] = useState<ExamSchedule | null>(null);
  const [deletingExamSchedule, setDeletingExamSchedule] = useState<ExamSchedule | null>(null);
  const [isExamScheduleDeleteOpen, setIsExamScheduleDeleteOpen] = useState(false);
  const [examScheduleRefreshTrigger, setExamScheduleRefreshTrigger] = useState(0);

  // Периоды
  const [isExamPeriodsSettingsOpen, setIsExamPeriodsSettingsOpen] = useState(false);

  // === ЖЕЛЕЗНАЯ ДОРОГА (РАБОТОДАТЕЛИ) - НОВЫЕ СОСТОЯНИЯ ===
  const [isRailwayFormOpen, setIsRailwayFormOpen] = useState(false);
  const [editingRailwayPost, setEditingRailwayPost] = useState<Post | null>(null);
  const [deletingRailwayPost, setDeletingRailwayPost] = useState<Post | null>(null);
  const [isRailwayDeleteOpen, setIsRailwayDeleteOpen] = useState(false);
  const [railwayRefreshTrigger, setRailwayRefreshTrigger] = useState(0); 
  // =========================================================

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const handleLoginSuccess = async () => {
    try {
      await refreshAuth();
      setIsLoggedIn(true);
      toast({ title: 'Успешный вход', description: `Добро пожаловать в админ-панель!` });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить данные пользователя', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    authLogout();
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    setActiveTab('zamena');
    localStorage.setItem('adminActiveTab', 'zamena');
  };

  useEffect(() => {
    if (isLoggedIn && admin && !admin.permissions.can_access_admin_panel) {
      toast({ title: 'Доступ запрещен', description: 'У вас нет прав для доступа к админ-панели', variant: 'destructive' });
      handleLogout();
    }
  }, [isLoggedIn, admin, toast]);

  // === ОБРАБОТЧИКИ (Сжатые для экономии места, но функционал полный) ===
  const handlePostCreate = (category: PostCategory) => { setCurrentPostCategory(category); setEditingPost(null); setIsFormOpen(true); };
  const handlePostEdit = (post: Post, category: PostCategory) => { setCurrentPostCategory(category); setEditingPost(post); setIsFormOpen(true); };
  const handlePostFormClose = () => { setIsFormOpen(false); setEditingPost(null); };
  const handlePostFormSuccess = () => { handlePostFormClose(); setRefreshTrigger((prev) => prev + 1); };
  const handlePostDeleteClick = (post: NewsPost) => { setDeletingPost(post); setIsDeleteOpen(true); };
  const handlePostDeleteConfirm = async () => { if (!deletingPost) return; try { await postsApi.delete(deletingPost.id); toast({ title: 'Успешно', description: 'Запись удалена' }); setRefreshTrigger((prev) => prev + 1); setIsDeleteOpen(false); setDeletingPost(null); } catch (error) { toast({ title: 'Ошибка', description: 'Не удалось удалить запись', variant: 'destructive' }); }};

  // Вакансии
  const handleVacancyCreate = () => { setEditingVacancy(null); setIsVacancyFormOpen(true); };
  const handleVacancyEdit = (v: Vacancy) => { setEditingVacancy(v); setIsVacancyFormOpen(true); };
  const handleVacancyFormClose = () => { setIsVacancyFormOpen(false); setEditingVacancy(null); };
  const handleVacancyFormSuccess = () => { handleVacancyFormClose(); setVacancyRefreshTrigger(p => p + 1); };
  const handleVacancyDeleteClick = (v: Vacancy) => { setDeletingVacancy(v); setIsVacancyDeleteOpen(true); };
  const handleVacancyDeleteConfirm = async () => { if(!deletingVacancy) return; await vacanciesApi.delete(deletingVacancy.id); setVacancyRefreshTrigger(p => p + 1); setIsVacancyDeleteOpen(false); };

  // Документы
  const handleDocumentCreate = () => { setEditingDocument(null); setIsDocumentFormOpen(true); };
  const handleDocumentEdit = (d: Document) => { setEditingDocument(d); setIsDocumentFormOpen(true); };
  const handleDocumentFormClose = () => { setIsDocumentFormOpen(false); setEditingDocument(null); };
  const handleDocumentFormSuccess = () => { handleDocumentFormClose(); setDocumentRefreshTrigger(p => p + 1); };
  const handleDocumentDeleteClick = (d: Document) => { setDeletingDocument(d); setIsDocumentDeleteOpen(true); };
  const handleDocumentDeleteConfirm = async () => { if(!deletingDocument) return; await documentsApi.delete(deletingDocument.id); setDocumentRefreshTrigger(p => p + 1); setIsDocumentDeleteOpen(false); };

  // Доступная среда
  const handleAccessibleCreate = () => { setEditingAccessibleDoc(null); setIsAccessibleFormOpen(true); };
  const handleAccessibleEdit = (d: AccessibleEnvironmentDocument) => { setEditingAccessibleDoc(d); setIsAccessibleFormOpen(true); };
  const handleAccessibleFormClose = () => { setIsAccessibleFormOpen(false); setEditingAccessibleDoc(null); };
  const handleAccessibleFormSuccess = () => { handleAccessibleFormClose(); setAccessibleRefreshTrigger(p => p + 1); };
  const handleAccessibleDeleteClick = (d: AccessibleEnvironmentDocument) => { setDeletingAccessibleDoc(d); setIsAccessibleDeleteOpen(true); };
  const handleAccessibleDeleteConfirm = async () => { if(!deletingAccessibleDoc) return; await accessibleEnvironmentApi.delete(deletingAccessibleDoc.id); setAccessibleRefreshTrigger(p => p + 1); setIsAccessibleDeleteOpen(false); };

  // Квитанции
  const handlePaymentReceiptCreate = () => { setEditingPaymentReceipt(null); setActiveReceiptTab('form'); };
  const handlePaymentReceiptEdit = (r: PaymentReceipt) => { setEditingPaymentReceipt(r); setActiveReceiptTab('form'); };
  const handlePaymentReceiptFormClose = () => { setActiveReceiptTab('list'); setEditingPaymentReceipt(null); };
  const handlePaymentReceiptFormSuccess = () => { handlePaymentReceiptFormClose(); setPaymentReceiptRefreshTrigger(p => p + 1); };
  const handlePaymentReceiptDeleteClick = (r: PaymentReceipt) => { setDeletingPaymentReceipt(r); setIsPaymentReceiptDeleteOpen(true); };
  const handlePaymentReceiptDeleteConfirm = async () => { if(!deletingPaymentReceipt) return; await paymentReceiptsApi.delete(deletingPaymentReceipt.id); setPaymentReceiptRefreshTrigger(p => p + 1); setIsPaymentReceiptDeleteOpen(false); };

  // IOS
  const handleIOSContentCreate = () => { setEditingIOSContent(null); setIsIOSContentFormOpen(true); };
  const handleIOSContentEdit = (c: IOSContent) => { setEditingIOSContent(c); setIsIOSContentFormOpen(true); };
  const handleIOSContentFormClose = () => { setIsIOSContentFormOpen(false); setEditingIOSContent(null); };
  const handleIOSContentFormSuccess = () => { handleIOSContentFormClose(); setIosContentRefreshTrigger(p => p + 1); };
  const handleIOSContentDeleteClick = (c: IOSContent) => { setDeletingIOSContent(c); setIsIOSContentDeleteOpen(true); };
  const handleIOSContentDeleteConfirm = async () => { if(!deletingIOSContent) return; await iosContentApi.delete(deletingIOSContent.id); setIosContentRefreshTrigger(p => p + 1); setIsIOSContentDeleteOpen(false); };

  // День открытых дверей
  const handleOpenDayFormSuccess = () => { setIsOpenDayFormOpen(false); setOpenDayRefreshTrigger(p => p + 1); };
  
  // Контент страниц
  const getContentTypeForTab = (tab: AdminTab): ContentType => {
    switch (tab) {
      case 'admission-numbers': return ContentType.AdmissionNumbers;
      case 'admission-rules': return ContentType.AdmissionRules;
      case 'memo': return ContentType.Memo;
      case 'state-exam': return ContentType.StateExam;
      case 'start-in-science': return ContentType.StartInScience;
      case 'russia-belarus': return ContentType.RussiaBelarus;
      default: return ContentType.AdmissionNumbers;
    }
  };

  const handlePageContentCreate = () => { setEditingPageContent(null); setIsPageContentFormOpen(true); };
  const handlePageContentEdit = (c: PageContent) => { setEditingPageContent(c); setIsPageContentFormOpen(true); };
  const handlePageContentFormClose = () => { setIsPageContentFormOpen(false); setEditingPageContent(null); };
  const handlePageContentFormSuccess = () => { handlePageContentFormClose(); setPageContentRefreshTrigger(p => p + 1); };
  const handlePageContentDeleteClick = (c: PageContent) => { setDeletingPageContent(c); setIsPageContentDeleteOpen(true); };
  const handlePageContentDeleteConfirm = async () => { if(!deletingPageContent) return; await pageContentApi.delete(deletingPageContent.id); setPageContentRefreshTrigger(p => p + 1); setIsPageContentDeleteOpen(false); };

  // Расписание
  const handleScheduleSettingsSuccess = () => { setIsScheduleSettingsOpen(false); };

  // Расписание экзаменов
  const handleExamScheduleCreate = () => { setEditingExamSchedule(null); setIsExamScheduleFormOpen(true); };
  const handleExamScheduleEdit = (schedule: ExamSchedule) => { setEditingExamSchedule(schedule); setIsExamScheduleFormOpen(true); };
  const handleExamScheduleFormClose = () => { setIsExamScheduleFormOpen(false); setEditingExamSchedule(null); };
  const handleExamScheduleFormSuccess = () => { handleExamScheduleFormClose(); setExamScheduleRefreshTrigger(p => p + 1); };
  const handleExamScheduleDeleteClick = (schedule: ExamSchedule) => { setDeletingExamSchedule(schedule); setIsExamScheduleDeleteOpen(true); };
  const handleExamScheduleDeleteConfirm = async () => { if(!deletingExamSchedule) return; await examScheduleApi.delete(deletingExamSchedule.id); setExamScheduleRefreshTrigger(p => p + 1); setIsExamScheduleDeleteOpen(false); };

  const handleExamPeriodsSettingsSuccess = () => { setIsExamPeriodsSettingsOpen(false); };

  // === ОБРАБОТЧИКИ ДЛЯ РАБОТОДАТЕЛЕЙ (НОВЫЕ) ===
  const handleRailwayCreate = () => { setEditingRailwayPost(null); setIsRailwayFormOpen(true); };
  const handleRailwayEdit = (post: Post) => { setEditingRailwayPost(post); setIsRailwayFormOpen(true); };
  const handleRailwayFormClose = () => { setIsRailwayFormOpen(false); setEditingRailwayPost(null); };
  const handleRailwayFormSuccess = () => { handleRailwayFormClose(); setRailwayRefreshTrigger(prev => prev + 1); };
  const handleRailwayDeleteClick = (post: Post) => { setDeletingRailwayPost(post); setIsRailwayDeleteOpen(true); };
  const handleRailwayDeleteConfirm = async () => {
    if (!deletingRailwayPost) return;
    try {
        await postsApi.delete(deletingRailwayPost.id);
        toast({ title: 'Успешно', description: 'Удалено' });
        setRailwayRefreshTrigger(prev => prev + 1);
        setIsRailwayDeleteOpen(false);
        setDeletingRailwayPost(null);
    } catch (e) {
        toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };
  // ============================================

  const tabConfig = {
    'zamena': { title: 'Замены', icon: Calendar, component: <PermissionGuard permission="can_manage_schedule"><ZamenaManager /></PermissionGuard>, requiredPermission: 'can_manage_schedule' as const, hasPermission: permissions?.can_manage_schedule ?? false },
    'site-content': { title: 'Контент страниц', icon: LayoutTemplate, component: <PermissionGuard permission="can_manage_settings"><SiteContentEditor /></PermissionGuard>, requiredPermission: 'can_manage_settings' as const, hasPermission: permissions?.can_manage_settings ?? false },
    'schedule': { title: 'Расписание', icon: Calendar, component: <PermissionGuard permission="can_manage_schedule"><div className="space-y-6"><div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Расписание</h2><Button onClick={() => setIsScheduleSettingsOpen(true)} variant="outline"><Clock className="w-4 h-4 mr-2" />Период сессии</Button></div><ScheduleManager /></div></PermissionGuard>, requiredPermission: 'can_manage_schedule' as const, hasPermission: permissions?.can_manage_schedule ?? false },
    'exam-schedule': { title: 'Расписание экзаменов', icon: ClipboardCheck, component: (<PermissionGuard permission="can_manage_schedule"><ExamScheduleList onEdit={handleExamScheduleEdit} onDelete={handleExamScheduleDeleteClick} onCreate={handleExamScheduleCreate} refreshTrigger={examScheduleRefreshTrigger}/></PermissionGuard>), requiredPermission: 'can_manage_schedule' as const, hasPermission: permissions?.can_manage_schedule ?? false },
    'posts': { title: 'Новости', icon: Newspaper, component: <PermissionGuard permission="can_manage_posts"><PostsList onEdit={(post) => handlePostEdit(post, PostCategory.News)} onDelete={handlePostDeleteClick} onCreate={() => handlePostCreate(PostCategory.News)} refreshTrigger={refreshTrigger} category={PostCategory.News}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false},
    'contests': { title: 'Конкурсы', icon: Trophy, component: <PermissionGuard permission="can_manage_posts"><ContestsList /></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    'ticker': { title: 'Бегущая строка', icon: Megaphone, component: <PermissionGuard permission="can_manage_settings"><TickerSettingsForm /></PermissionGuard>, requiredPermission: 'can_manage_settings' as const, hasPermission: permissions?.can_manage_settings ?? false },
    'open-day': { title: 'День открытых дверей', icon: Settings, component: <PermissionGuard permission="can_manage_settings"><div className="space-y-6"><div className="flex items-center justify-between"><h2 className="text-2xl font-bold">День открытых дверей</h2><Button onClick={() => setIsOpenDayFormOpen(true)}><Plus className="w-4 h-4 mr-2" />Настройки</Button></div><OpenDaySettingsForm open={isOpenDayFormOpen} onClose={() => setIsOpenDayFormOpen(false)} onSuccess={handleOpenDayFormSuccess}/></div></PermissionGuard>, requiredPermission: 'can_manage_settings' as const, hasPermission: permissions?.can_manage_settings ?? false },
    'vacancies': { title: 'Вакансии', icon: Briefcase, component: <PermissionGuard permission="can_manage_vacancies"><VacanciesList onEdit={handleVacancyEdit} onDelete={handleVacancyDeleteClick} onCreate={handleVacancyCreate} refreshTrigger={vacancyRefreshTrigger}/></PermissionGuard>, requiredPermission: 'can_manage_vacancies' as const, hasPermission: permissions?.can_manage_vacancies ?? false },
    'professionals': { title: 'Профессионалы', icon: Users, component: <PermissionGuard permission="can_manage_teachers"><ProfessionalsList /></PermissionGuard>, requiredPermission: 'can_manage_teachers' as const, hasPermission: permissions?.can_manage_teachers ?? false },
    'documents': { title: 'Документы', icon: FileText, component: <PermissionGuard permission="can_manage_files"><DocumentsList onEdit={handleDocumentEdit} onDelete={handleDocumentDeleteClick} onCreate={handleDocumentCreate} refreshTrigger={documentRefreshTrigger}/></PermissionGuard>, requiredPermission: 'can_manage_files' as const, hasPermission: permissions?.can_manage_files ?? false },
    'accessible-environment': { title: 'Доступная среда', icon: Accessibility, component: <PermissionGuard permission="can_manage_files"><AccessibleEnvironmentList onEdit={handleAccessibleEdit} onDelete={handleAccessibleDeleteClick} onCreate={handleAccessibleCreate} refreshTrigger={accessibleRefreshTrigger}/></PermissionGuard>, requiredPermission: 'can_manage_files' as const, hasPermission: permissions?.can_manage_files ?? false },
    'payment-receipts': { title: 'Квитанции', icon: CreditCard, component: <PermissionGuard permission="can_manage_files"><div className="space-y-6"><div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Управление квитанциями</h2>{activeReceiptTab === 'list' && <Button onClick={handlePaymentReceiptCreate}><Plus className="w-4 h-4 mr-2" />Добавить</Button>}</div>{activeReceiptTab === 'list' ? <PaymentReceiptsList onEdit={handlePaymentReceiptEdit} onDelete={handlePaymentReceiptDeleteClick} onCreate={handlePaymentReceiptCreate} refreshTrigger={paymentReceiptRefreshTrigger}/> : <PaymentReceiptForm open={activeReceiptTab === 'form'} onClose={handlePaymentReceiptFormClose} onSuccess={handlePaymentReceiptFormSuccess} editReceipt={editingPaymentReceipt}/>}</div></PermissionGuard>, requiredPermission: 'can_manage_files' as const, hasPermission: permissions?.can_manage_files ?? false },
    'ios-content': { title: 'IOS Контент', icon: MonitorPlay, component: <PermissionGuard permission="can_manage_posts"><IOSContentList onEdit={handleIOSContentEdit} onDelete={handleIOSContentDeleteClick} onCreate={handleIOSContentCreate} refreshTrigger={iosContentRefreshTrigger}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    'admission-numbers': { title: 'КЦП', icon: GraduationCap, component: <PermissionGuard permission="can_manage_posts"><PageContentList onEdit={handlePageContentEdit} onDelete={handlePageContentDeleteClick} onCreate={handlePageContentCreate} refreshTrigger={pageContentRefreshTrigger} contentType={ContentType.AdmissionNumbers}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    'admission-rules': { title: 'Правила приема', icon: BookOpen, component: <PermissionGuard permission="can_manage_posts"><PageContentList onEdit={handlePageContentEdit} onDelete={handlePageContentDeleteClick} onCreate={handlePageContentCreate} refreshTrigger={pageContentRefreshTrigger} contentType={ContentType.AdmissionRules}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    'memo': { title: 'Памятка ЕГЭ', icon: ClipboardList, component: <PermissionGuard permission="can_manage_posts"><PageContentList onEdit={handlePageContentEdit} onDelete={handlePageContentDeleteClick} onCreate={handlePageContentCreate} refreshTrigger={pageContentRefreshTrigger} contentType={ContentType.Memo}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    'state-exam': { title: 'ГИА', icon: FileText, component: <PermissionGuard permission="can_manage_posts"><PageContentList onEdit={handlePageContentEdit} onDelete={handlePageContentDeleteClick} onCreate={handlePageContentCreate} refreshTrigger={pageContentRefreshTrigger} contentType={ContentType.StateExam}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    'start-in-science': { title: 'Старт в науку', icon: Microscope, component: <PermissionGuard permission="can_manage_posts"><PageContentList onEdit={handlePageContentEdit} onDelete={handlePageContentDeleteClick} onCreate={handlePageContentCreate} refreshTrigger={pageContentRefreshTrigger} contentType={ContentType.StartInScience}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    'russia-belarus': { title: 'Россия и Беларусь', icon: FileText, component: <PermissionGuard permission="can_manage_posts"><PageContentList onEdit={handlePageContentEdit} onDelete={handlePageContentDeleteClick} onCreate={handlePageContentCreate} refreshTrigger={pageContentRefreshTrigger} contentType={ContentType.RussiaBelarus}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    
    // ПРАВИЛЬНАЯ КОНФИГУРАЦИЯ ДЛЯ РАБОТОДАТЕЛЕЙ
    'railway-employers': { 
      title: 'Работодатели', 
      icon: Train, 
      component: <PermissionGuard permission="can_manage_posts">
        <RailwayEmployersList 
          onEdit={handleRailwayEdit} 
          onDelete={handleRailwayDeleteClick} 
          onCreate={handleRailwayCreate} 
          refreshTrigger={railwayRefreshTrigger} 
        />
      </PermissionGuard>, 
      requiredPermission: 'can_manage_posts' as const, 
      hasPermission: permissions?.can_manage_posts ?? false 
    },

    'victory-80': { title: '80 лет Победы', icon: Star, component: <PermissionGuard permission="can_manage_posts"><PostsList onEdit={(post) => handlePostEdit(post, PostCategory.Victory80)} onDelete={handlePostDeleteClick} onCreate={() => handlePostCreate(PostCategory.Victory80)} refreshTrigger={refreshTrigger} category={PostCategory.Victory80}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    'anniversary-95': { title: '95 лет ТТЖТ', icon: Flag, component: <PermissionGuard permission="can_manage_posts"><PostsList onEdit={(post) => handlePostEdit(post, PostCategory.Anniversary95)} onDelete={handlePostDeleteClick} onCreate={() => handlePostCreate(PostCategory.Anniversary95)} refreshTrigger={refreshTrigger} category={PostCategory.Anniversary95}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
    'pride': { title: 'Наша гордость', icon: Award, component: <PermissionGuard permission="can_manage_posts"><PostsList onEdit={(post) => handlePostEdit(post, PostCategory.Pride)} onDelete={handlePostDeleteClick} onCreate={() => handlePostCreate(PostCategory.Pride)} refreshTrigger={refreshTrigger} category={PostCategory.Pride}/></PermissionGuard>, requiredPermission: 'can_manage_posts' as const, hasPermission: permissions?.can_manage_posts ?? false },
  };

  const filteredTabs = isScheduleUser 
    ? Object.entries(tabConfig).filter(([key]) => key === 'zamena' || key === 'schedule' || key === 'exam-schedule')
    : Object.entries(tabConfig);

  const currentTab = tabConfig[activeTab];

  if (!isLoggedIn) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"><div className="max-w-md w-full"><AdminLogin onSuccess={handleLoginSuccess} /></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex flex-col h-full">
            <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200">
              <h1 className="text-lg font-bold text-gray-900">Админ-панель</h1>
              <button onClick={handleLogout}><LogOut size={14} /></button>
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              {filteredTabs.map(([key, { title, icon: Icon, hasPermission }]) => (
                <button
                  key={key}
                  onClick={() => { if (hasPermission) { setActiveTab(key as AdminTab); setIsMobileMenuOpen(false); } }}
                  className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-left text-sm ${activeTab === key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Icon size={16} /> <span>{title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <main className="flex-1 min-h-screen p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 flex items-center space-x-2">
              <currentTab.icon size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold">{currentTab.title}</h2>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {currentTab.component}
            </div>
          </div>
        </main>
      </div>

      <PostForm open={isFormOpen} onClose={handlePostFormClose} onSuccess={handlePostFormSuccess} editPost={editingPost} isScheduleUser={isScheduleUser} fixedCategory={currentPostCategory} />
      <DeletePostDialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handlePostDeleteConfirm} postTitle={deletingPost?.title || ''} />
      
      <VacancyForm open={isVacancyFormOpen} onClose={handleVacancyFormClose} onSuccess={handleVacancyFormSuccess} editVacancy={editingVacancy} />
      <DeletePostDialog open={isVacancyDeleteOpen} onClose={() => setIsVacancyDeleteOpen(false)} onConfirm={handleVacancyDeleteConfirm} postTitle={deletingVacancy?.title || ''} />
      
      <DocumentForm open={isDocumentFormOpen} onClose={handleDocumentFormClose} onSuccess={handleDocumentFormSuccess} editDocument={editingDocument} />
      <DeletePostDialog open={isDocumentDeleteOpen} onClose={() => setIsDocumentDeleteOpen(false)} onConfirm={handleDocumentDeleteConfirm} postTitle={deletingDocument?.document_title || ''} />
      
      <AccessibleEnvironmentForm open={isAccessibleFormOpen} onClose={handleAccessibleFormClose} onSuccess={handleAccessibleFormSuccess} editDocument={editingAccessibleDoc} />
      <DeletePostDialog open={isAccessibleDeleteOpen} onClose={() => setIsAccessibleDeleteOpen(false)} onConfirm={handleAccessibleDeleteConfirm} postTitle={deletingAccessibleDoc?.document_title || ''} />
      
      <DeletePostDialog open={isPaymentReceiptDeleteOpen} onClose={() => setIsPaymentReceiptDeleteOpen(false)} onConfirm={handlePaymentReceiptDeleteConfirm} postTitle={deletingPaymentReceipt?.title || ''} />
      
      <IOSContentForm open={isIOSContentFormOpen} onClose={handleIOSContentFormClose} onSuccess={handleIOSContentFormSuccess} editContent={editingIOSContent} />
      <DeletePostDialog open={isIOSContentDeleteOpen} onClose={() => setIsIOSContentDeleteOpen(false)} onConfirm={handleIOSContentDeleteConfirm} postTitle={deletingIOSContent?.title || ''} />
      
      <PageContentForm open={isPageContentFormOpen} onClose={handlePageContentFormClose} onSuccess={handlePageContentFormSuccess} editContent={editingPageContent} contentType={getContentTypeForTab(activeTab)} />
      <DeletePostDialog open={isPageContentDeleteOpen} onClose={() => setIsPageContentDeleteOpen(false)} onConfirm={handlePageContentDeleteConfirm} postTitle={deletingPageContent?.title || ''} />
      
      <OpenDaySettingsForm open={isOpenDayFormOpen} onClose={() => setIsOpenDayFormOpen(false)} onSuccess={handleOpenDayFormSuccess} />
      <ScheduleSettingsForm open={isScheduleSettingsOpen} onClose={() => setIsScheduleSettingsOpen(false)} onSuccess={handleScheduleSettingsSuccess} />
      
      <ExamScheduleForm open={isExamScheduleFormOpen} onClose={handleExamScheduleFormClose} onSuccess={handleExamScheduleFormSuccess} editSchedule={editingExamSchedule} />
      <DeletePostDialog open={isExamScheduleDeleteOpen} onClose={() => setIsExamScheduleDeleteOpen(false)} onConfirm={handleExamScheduleDeleteConfirm} postTitle={deletingExamSchedule?.title || ''} />
      
      <ExamPeriodsSettingsForm 
        open={isExamPeriodsSettingsOpen} 
        onClose={() => setIsExamPeriodsSettingsOpen(false)} 
        onSuccess={handleExamPeriodsSettingsSuccess} 
      />

      {/* НОВАЯ ФОРМА ДЛЯ РАБОТОДАТЕЛЕЙ - ТЕПЕРЬ ОНА В РАЗМЕТКЕ! */}
      <RailwayEmployersForm 
        open={isRailwayFormOpen} 
        onClose={handleRailwayFormClose} 
        onSuccess={handleRailwayFormSuccess} 
        editPost={editingRailwayPost} 
      />
      <DeletePostDialog 
        open={isRailwayDeleteOpen} 
        onClose={() => setIsRailwayDeleteOpen(false)} 
        onConfirm={handleRailwayDeleteConfirm} 
        postTitle={deletingRailwayPost?.title || ''} 
      />
    </div>
  );
}