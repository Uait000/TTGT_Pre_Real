import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, Admin, AdminPermissions } from '@/api/auth';

interface SimpleAuthContextType {
    admin: Admin | null;
    permissions: AdminPermissions | null;
    isLoading: boolean;
    login: (admin: Admin, token: string) => void;
    logout: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const useSimpleAuth = () => {
    const context = useContext(SimpleAuthContext);
    if (context === undefined) {
        throw new Error('useSimpleAuth must be used within an SimpleAuthProvider');
    }
    return context;
};

interface SimpleAuthProviderProps {
    children: ReactNode;
}

export const SimpleAuthProvider: React.FC<SimpleAuthProviderProps> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [permissions, setPermissions] = useState<AdminPermissions | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = (adminData: Admin, token: string) => {
        console.log('🔐 Simple login with admin:', adminData);
        authApi.setToken(token);
        setAdmin(adminData);
        setPermissions(adminData.permissions);
    };

    const logout = () => {
        console.log('🔐 Simple logout');
        authApi.removeToken();
        setAdmin(null);
        setPermissions(null);
    };

    const value = {
        admin,
        permissions,
        isLoading,
        login,
        logout,
    };

    return (
        <SimpleAuthContext.Provider value={value}>
            {children}
        </SimpleAuthContext.Provider>
    );
};