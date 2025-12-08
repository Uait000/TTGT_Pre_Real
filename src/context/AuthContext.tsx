import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, Admin, AdminPermissions } from '@/api/auth';

interface AuthContextType {
    admin: Admin | null;
    permissions: AdminPermissions | null;
    isLoading: boolean;
    refreshAuth: () => Promise<void>;
    logout: () => void;
    isScheduleUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [permissions, setPermissions] = useState<AdminPermissions | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Проверяем, является ли пользователь пользователем с ролью "Расписание"
    const isScheduleUser = admin?.type === 1;

    const refreshAuth = async () => {
        console.log('🔄 Refreshing auth...');
        
        if (!authApi.isAuthenticated()) {
            console.log('🔐 No token found, clearing auth');
            setAdmin(null);
            setPermissions(null);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            console.log('🔐 Fetching admin and permissions...');
            
            const [adminData, permissionsData] = await Promise.all([
                authApi.getCurrentAdmin(),
                authApi.getCurrentPermissions()
            ]);

            console.log('🔐 Auth refresh results:', { 
                admin: !!adminData, 
                permissions: !!permissionsData,
                userType: adminData?.type,
                isScheduleUser: adminData?.type === 1
            });

            setAdmin(adminData);
            setPermissions(permissionsData);
            
        } catch (error) {
            console.error('❌ Error refreshing auth:', error);
            // Если ошибка авторизации, разлогиниваем
            if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
                logout();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        console.log('🔐 Logging out...');
        authApi.removeToken();
        setAdmin(null);
        setPermissions(null);
    };

    // Проверяем авторизацию при загрузке
    useEffect(() => {
        refreshAuth();
    }, []);

    const value = {
        admin,
        permissions,
        isLoading,
        refreshAuth,
        logout,
        isScheduleUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};