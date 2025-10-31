import { BASE_URL, VACANCIES_ENDPOINT } from './config';
import { getAuthHeaders } from "@/api/auth.ts";

export interface Vacancy {
    id: number;
    title: string;
    department: string;
    salary: string;
    description?: string;
    created_at?: number; 
    is_active: boolean; 
}

export interface CreateVacancyPayload {
    title: string;
    department: string;
    salary: string;
    description?: string;
    created_at: number;
    is_active: boolean; 
}

export const vacanciesApi = {
    getPublicAll: async (): Promise<Vacancy[]> => {
        
        const response = await fetch(`${BASE_URL}/content/vacancies/`, {
            
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch public vacancies (Status: ${response.status})`);
        }

        return response.json();
    },

    getAll: async (): Promise<Vacancy[]> => {
        
        const response = await fetch(`${BASE_URL}${VACANCIES_ENDPOINT}/`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch vacancies (Status: ${response.status})`);
        }

        return response.json();
    },

    getById: async (id: number): Promise<Vacancy> => {
        
        const response = await fetch(`${BASE_URL}${VACANCIES_ENDPOINT}/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch vacancy (Status: ${response.status})`);
        }

        return response.json();
    },

    create: async (payload: CreateVacancyPayload): Promise<Vacancy> => {
        
        const response = await fetch(`${BASE_URL}${VACANCIES_ENDPOINT}/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `Failed to create vacancy (Status: ${response.status})` }));
            
            throw new Error(error.detail || `Failed to create vacancy (Status: ${response.status})`);
        }

        return response.json();
    },

    update: async (id: number, payload: Partial<CreateVacancyPayload>): Promise<Vacancy> => {
        
        const response = await fetch(`${BASE_URL}${VACANCIES_ENDPOINT}/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `Failed to update vacancy (Status: ${response.status})` }));
            throw new Error(error.detail || `Failed to update vacancy (Status: ${response.status})`);
        }

        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        
        const response = await fetch(`${BASE_URL}${VACANCIES_ENDPOINT}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `Failed to delete vacancy (Status: ${response.status})` }));
            throw new Error(error.detail || `Failed to delete vacancy (Status: ${response.status})`);
        }
    },
};