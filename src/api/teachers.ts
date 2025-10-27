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

export const teachersApi = {
  // Добавляем возможность передавать параметры, такие как limit
  getAll: async (params?: { limit?: number; offset?: number }): Promise<Teacher[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    // Добавляем параметры к URL
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