import { BASE_URL, VACANCIES_ENDPOINT } from './config';
import { getAuthHeaders } from "@/api/auth.ts";

export interface Vacancy {
    id: number;
    title: string;
    department: string;
    salary: string;
    description?: string;
}

export interface CreateVacancyPayload {
    title: string;
    department: string;
    salary: string;
    description?: string;
}

export const vacanciesApi = {
    getAll: async (): Promise<Vacancy[]> => {
        // ИСПРАВЛЕНИЕ 1: Используем абсолютный путь (без BASE_URL) для работы через прокси.
        // ИСПРАВЛЕНИЕ 2: Добавляем заголовки авторизации, так как в админке этот запрос должен быть авторизован.
        const response = await fetch(`${VACANCIES_ENDPOINT}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch vacancies (Status: ${response.status})`);
        }

        return response.json();
    },

    getById: async (id: number): Promise<Vacancy> => {
        // ИСПРАВЛЕНИЕ: Используем абсолютный путь и заголовки.
        const response = await fetch(`${VACANCIES_ENDPOINT}/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch vacancy (Status: ${response.status})`);
        }

        return response.json();
    },

    create: async (payload: CreateVacancyPayload): Promise<Vacancy> => {
        // ИСПРАВЛЕНИЕ: Используем абсолютный путь.
        const response = await fetch(`${VACANCIES_ENDPOINT}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `Failed to create vacancy (Status: ${response.status})` }));
            throw new Error(error.message || 'Failed to create vacancy');
        }

        return response.json();
    },

    update: async (id: number, payload: Partial<CreateVacancyPayload>): Promise<Vacancy> => {
        // ИСПРАВЛЕНИЕ: Используем абсолютный путь.
        const response = await fetch(`${VACANCIES_ENDPOINT}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `Failed to update vacancy (Status: ${response.status})` }));
            throw new Error(error.message || 'Failed to update vacancy');
        }

        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        // ИСПРАВЛЕНИЕ: Используем абсолютный путь.
        const response = await fetch(`${VACANCIES_ENDPOINT}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `Failed to delete vacancy (Status: ${response.status})` }));
            throw new Error(error.message || 'Failed to delete vacancy');
        }
    },
};