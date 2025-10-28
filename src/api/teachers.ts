import { BASE_URL } from './config';
import { getAuthHeaders } from "@/api/auth.ts";

export interface Teacher {
    id: number;
    initials: string;
}

export interface CreateTeacherPayload {
  name: string;
  position?: string;
  department?: string;
}

// 1. Создаем интерфейс для всех параметров
export interface GetAllTeachersParams {
  limit?: number;
  offset?: number;
  // Параметр для сортировки (А-Я или Я-А)
  sortBy?: 'initials_asc' | 'initials_desc';
  // Параметр для быстрого поиска по фамилии (initials)
  search?: string;
}

export const teachersApi = {
  // 2. Используем новый интерфейс параметров
  getAll: async (params?: GetAllTeachersParams): Promise<Teacher[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    // 3. Добавляем параметр сортировки в URL, если он передан
    if (params?.sortBy) queryParams.append('sort_by', params.sortBy);

    // 4. Добавляем параметр поиска в URL, если он передан
    if (params?.search) queryParams.append('search', params.search);

    // Убедимся, что BASE_URL используется
    const url = `${BASE_URL}/admin/teachers?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }

    return response.json();
  },

  create: async (payload: CreateTeacherPayload): Promise<Teacher> => {
    const response = await fetch(`${BASE_URL}/admin/teachers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create teacher' }));
      throw new Error(error.message || 'Failed to create teacher');
    }

    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/admin/teachers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete teacher' }));
      throw new Error(error.message || 'Failed to delete teacher');
    }
  },
};