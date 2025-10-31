import { BASE_URL, VACANCIES_ENDPOINT } from './config';
import { getAuthHeaders } from "@/api/auth.ts";

export interface Vacancy {
    id: number;
    title: string;
    department: string;
    salary: string;
    description?: string;
    // --- ДОБАВЛЕНО: Это поле есть в ответе API ---
    created_at?: number; 
}

export interface CreateVacancyPayload {
    title: string;
    department: string;
    salary: string;
    description?: string;
    // --- ДОБАВЛЕНО: Это поле есть в документации POST API ---
    created_at: number;
}

export const vacanciesApi = {
    getAll: async (): Promise<Vacancy[]> => {
        // ИСПРАВЛЕНИЕ 1: Добавлен слеш в конце, как требует API
        const response = await fetch(`${VACANCIES_ENDPOINT}/`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch vacancies (Status: ${response.status})`);
        }

        return response.json();
    },

    getById: async (id: number): Promise<Vacancy> => {
        // Здесь слеш не нужен, т.к. /${id}
        const response = await fetch(`${VACANCIES_ENDPOINT}/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch vacancy (Status: ${response.status})`);
        }

        return response.json();
    },

    create: async (payload: CreateVacancyPayload): Promise<Vacancy> => {
        // ИСПРАВЛЕНИЕ 1: Добавлен слеш в конце, как требует API
        const response = await fetch(`${VACANCIES_ENDPOINT}/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `Failed to create vacancy (Status: ${response.status})` }));
            // ИСПРАВЛЕНИЕ 2: Выводим детальную ошибку, если она есть
            throw new Error(error.detail || error.message || 'Failed to create vacancy');
        }

        return response.json();
    },

    update: async (id: number, payload: Partial<CreateVacancyPayload>): Promise<Vacancy> => {
        // Здесь слеш не нужен, т.к. /${id}
        // ИСПРАВЛЕНО: Метод PATCH, а не PUT
        const response = await fetch(`${VACANCIES_ENDPOINT}/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `Failed to update vacancy (Status: ${response.status})` }));
            throw new Error(error.detail || error.message || 'Failed to update vacancy');
        }

        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        // Здесь слеш не нужен, т.к. /${id}
        const response = await fetch(`${VACANCIES_ENDPOINT}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `Failed to delete vacancy (Status: ${response.status})` }));
            throw new Error(error.detail || error.message || 'Failed to delete vacancy');
        }
    },
};