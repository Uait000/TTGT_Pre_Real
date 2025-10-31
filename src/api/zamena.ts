import { BASE_URL, ZAMENA_ENDPOINT } from './config';
import { getAuthHeaders } from './auth';


interface ZamenaResponse {
  url: string;
  filename: string;
  
}

export const zamenaApi = {
  async get(): Promise<ZamenaResponse | null> {
    try {
      const response = await fetch(`${BASE_URL}${ZAMENA_ENDPOINT}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; 
        }
        throw new Error(`Ошибка получения файла: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Ошибка при получении файла замен:', error);
      throw error;
    }
  },
  async upload(file: File): Promise<ZamenaResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}${ZAMENA_ENDPOINT}`, {
        method: 'POST', 
        headers: getAuthHeaders(true), 
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Не удалось загрузить файл: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Ошибка при загрузке файла замен:', error);
      throw error;
    }
  },
};