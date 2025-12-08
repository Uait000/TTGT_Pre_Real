import { BASE_URL } from './config';

export interface LoginCredentials {
    second_name: string;
    password: string;
}

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

export interface Admin {
    id: number;
    first_name: string;
    second_name: string;
    middle_name: string;
    type: number;
    permissions: AdminPermissions;
}

export interface LoginResponse {
    token: string;
    admin: Admin;
}

export const getAuthHeaders = (is_file_upload = false): HeadersInit => {
    const token = localStorage.getItem('adminToken');
    
    console.log('🔐 Getting auth headers, token exists:', !!token);
    
    const headers: HeadersInit = {};
    
    if (!is_file_upload) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
        const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
        headers['x-authorization'] = cleanToken;
        
        console.log('🔐 Headers set:', { 
            'x-authorization': cleanToken.substring(0, 20) + '...'
        });
    } else {
        console.warn('🔐 No adminToken found in localStorage');
    }
    
    return headers;
};

export const authApi = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        console.log('🔐 [FRONTEND] === НАЧАЛО ЗАПРОСА НА ВХОД ===');
        console.log('🔐 [FRONTEND] Данные для входа:', { 
            second_name: credentials.second_name,
            password_length: credentials.password.length,
            password_preview: credentials.password.substring(0, 3) + '...' 
        });

        try {
            const requestBody = JSON.stringify(credentials);
            console.log('🔐 [FRONTEND] Тело запроса:', requestBody);

            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            console.log('🔐 [FRONTEND] Ответ получен:');
            console.log('🔐 [FRONTEND] - Status:', response.status, response.statusText);
            console.log('🔐 [FRONTEND] - OK:', response.ok);
            console.log('🔐 [FRONTEND] - Headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                let errorDetail = `HTTP ${response.status}`;
                
                try {
                    const errorText = await response.text();
                    console.log('🔐 [FRONTEND] Текст ошибки:', errorText);
                    
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorDetail = errorJson.detail || errorJson.message || errorText;
                        console.log('🔐 [FRONTEND] JSON ошибки:', errorJson);
                    } catch {
                        errorDetail = errorText || `Ошибка ${response.status}`;
                    }
                } catch (textError) {
                    console.log('🔐 [FRONTEND] Не удалось прочитать текст ошибки:', textError);
                    errorDetail = `Ошибка ${response.status} (нечитаемый ответ)`;
                }

                console.log('🔐 [FRONTEND] Итоговая ошибка:', errorDetail);

                if (response.status === 401) {
                    throw new Error('Неверная фамилия или пароль');
                }
                
                throw new Error(errorDetail);
            }

            // Успешный ответ
            console.log('🔐 [FRONTEND] Ответ успешный, парсим JSON...');
            
            let result: LoginResponse;
            try {
                const responseText = await response.text();
                console.log('🔐 [FRONTEND] Сырой текст ответа:', responseText);
                
                result = JSON.parse(responseText);
                console.log('🔐 [FRONTEND] Парсинг JSON успешен');
            } catch (parseError) {
                console.error('🔐 [FRONTEND] Ошибка парсинга JSON:', parseError);
                throw new Error('Неверный формат ответа от сервера');
            }

            console.log('🔐 [FRONTEND] Результат входа:', { 
                has_token: !!result.token,
                token_preview: result.token ? result.token.substring(0, 50) + '...' : 'NO_TOKEN',
                has_admin: !!result.admin,
                admin_name: result.admin ? `${result.admin.second_name} ${result.admin.first_name}` : 'NO_ADMIN'
            });

            console.log('🔐 [FRONTEND] === ВХОД УСПЕШЕН ===');
            return result;
            
        } catch (error) {
            console.error('🔐 [FRONTEND] === ОШИБКА ВХОДА ===');
            console.error('🔐 [FRONTEND] Тип ошибки:', error instanceof Error ? error.constructor.name : 'Unknown');
            console.error('🔐 [FRONTEND] Сообщение:', error instanceof Error ? error.message : error);
            console.error('🔐 [FRONTEND] Stack:', error instanceof Error ? error.stack : 'No stack');
            
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.error('🔐 [FRONTEND] Сетевая ошибка - возможно CORS или недоступен сервер');
                throw new Error('Сервер недоступен. Проверьте подключение к интернету.');
            }
            
            throw error;
        }
    },

    async getCurrentAdmin(): Promise<Admin | null> {
        const token = this.getToken();
        if (!token) {
            console.log('🔐 No token for getCurrentAdmin');
            return null;
        }

        try {
            console.log('🔐 Fetching current admin...');
            const response = await fetch(`${BASE_URL}/admin/admin-info/me`, {
                headers: getAuthHeaders(),
            });

            console.log('🔐 Admin response status:', response.status);
            
            if (!response.ok) {
                console.log('🔐 Admin request failed:', response.status);
                if (response.status === 401) {
                    this.removeToken();
                }
                return null;
            }

            const adminData = await response.json();
            console.log('🔐 Admin data received:', adminData);
            return adminData;
        } catch (error) {
            console.error('❌ Error fetching admin info:', error);
            return null;
        }
    },

    async getCurrentPermissions(): Promise<AdminPermissions | null> {
        const token = this.getToken();
        if (!token) {
            console.log('🔐 No token for getCurrentPermissions');
            return null;
        }

        try {
            console.log('🔐 Fetching permissions...');
            const response = await fetch(`${BASE_URL}/admin/admin-info/permissions`, {
                headers: getAuthHeaders(),
            });

            console.log('🔐 Permissions response status:', response.status);
            
            if (!response.ok) {
                console.log('🔐 Permissions request failed:', response.status);
                if (response.status === 401) {
                    this.removeToken();
                }
                return null;
            }

            return response.json();
        } catch (error) {
            console.error('❌ Error fetching permissions:', error);
            return null;
        }
    },

    getToken(): string | null {
        const token = localStorage.getItem('adminToken');
        console.log('🔐 Getting token from localStorage:', !!token);
        return token;
    },

    setToken(token: string): void {
        localStorage.setItem('adminToken', token);
        console.log('🔐 Token saved to localStorage');
    },

    removeToken(): void {
        localStorage.removeItem('adminToken');
        console.log('🔐 Token removed from localStorage');
    },

    isAuthenticated(): boolean {
        const token = this.getToken();
        const isAuth = !!token;
        console.log('🔐 Authentication check:', isAuth);
        return isAuth;
    },
};