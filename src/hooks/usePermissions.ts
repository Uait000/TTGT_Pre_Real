import { useAuth } from '@/context/AuthContext';

export interface AdminPermissions {
    can_manage_posts: boolean;
    can_manage_vacancies: boolean;
    can_manage_teachers: boolean;
    can_manage_settings: boolean;
    can_manage_files: boolean;
    can_manage_schedule: boolean;
    can_access_admin_panel: boolean;
    can_access_courses_panel: boolean;
}

export const usePermissions = () => {
    const { permissions, isLoading, isScheduleUser } = useAuth();

    // Для пользователей "Расписание" ограничиваем права только расписанием
    const hasPermission = (permission: keyof AdminPermissions): boolean => {
        if (isLoading || !permissions) return false;
        
        // Пользователи "Расписание" имеют доступ только к управлению расписанием
        if (isScheduleUser) {
            return permission === 'can_manage_schedule';
        }
        
        return permissions[permission] === true;
    };

    const canManagePosts = hasPermission('can_manage_posts');
    const canManageVacancies = hasPermission('can_manage_vacancies');
    const canManageTeachers = hasPermission('can_manage_teachers');
    const canManageSettings = hasPermission('can_manage_settings');
    const canManageFiles = hasPermission('can_manage_files');
    const canManageSchedule = hasPermission('can_manage_schedule');
    const canAccessAdminPanel = hasPermission('can_access_admin_panel');
    const canAccessCoursesPanel = hasPermission('can_access_courses_panel');

    return {
        permissions,
        isLoading,
        hasPermission,
        canManagePosts,
        canManageVacancies,
        canManageTeachers,
        canManageSettings,
        canManageFiles,
        canManageSchedule,
        canAccessAdminPanel,
        canAccessCoursesPanel,
        isScheduleUser,
    };
};