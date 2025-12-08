import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

interface PermissionGuardProps {
    permission: keyof AdminPermissions;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
    permission, 
    children, 
    fallback 
}) => {
    const { permissions, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!permissions || !permissions[permission]) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-yellow-800 text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Доступ ограничен
                    </CardTitle>
                    <CardDescription className="text-yellow-700">
                        У вас недостаточно прав для доступа к этому разделу.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-yellow-600 text-sm mb-4">
                        Для доступа к этой функции требуется право: <strong>{getPermissionDescription(permission)}</strong>
                    </p>
                    <Button variant="outline" className="border-yellow-300 text-yellow-700">
                        Запросить доступ
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return <>{children}</>;
};

const getPermissionDescription = (permission: keyof AdminPermissions): string => {
    const descriptions: Record<keyof AdminPermissions, string> = {
        can_manage_posts: 'Управление постами',
        can_manage_vacancies: 'Управление вакансиями',
        can_manage_teachers: 'Управление преподавателями',
        can_manage_settings: 'Управление настройками',
        can_manage_files: 'Управление файлами',
        can_manage_schedule: 'Управление расписанием',
        can_access_admin_panel: 'Доступ к админ-панели',
        can_access_courses_panel: 'Доступ к панели курсов'
    };
    
    return descriptions[permission] || permission;
};