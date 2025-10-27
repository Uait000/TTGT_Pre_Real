import { BASE_URL } from './config';

export interface LoginCredentials {
    second_name: string;
    password: string;
}

export interface Admin {
    id: number;

    first_name: string;
    second_name: string;
    middle_name: string;
}

export interface LoginResponse {
    token: string;
    admin: Admin;
}

export const getAuthHeaders = (is_file_upload = false) => {
    const token = localStorage.getItem('adminToken');
    const headers: { [key: string]: string } = {};
    
    if (!is_file_upload) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
        headers['X-Authorization'] = token;
    }
    
    return headers;
};

export const authApi = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
             if (response.status === 401) {
                throw new Error('Неверная фамилия или пароль');
            }
            
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || `Ошибка входа. Статус: ${response.status}`);
        }

        return response.json();
    },

    getToken(): string | null {
       return localStorage.getItem('adminToken');
    },

    setToken(token: string): void {
        localStorage.setItem('adminToken', token);
    },

    removeToken(): void {
        localStorage.removeItem('adminToken');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};