import { BASE_URL, ZAMENA_ENDPOINT } from './config';
import { getAuthHeaders } from './auth';

// (Тип ответа от API. Укажите правильный, если знаете)
interface ZamenaResponse {
  url: string;
  filename: string;
  // ... другие поля
}

export const zamenaApi = {
  /**
   * Получает информацию о текущем файле замен
   */
  async get(): Promise<ZamenaResponse | null> {
    try {
      const response = await fetch(`${BASE_URL}${ZAMENA_ENDPOINT}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Файл еще не загружен
        }
        throw new Error(`Ошибка получения файла: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Ошибка при получении файла замен:', error);
      throw error;
    }
  },

  /**
   * Загружает (заменяет) файл замен
   */
  async upload(file: File): Promise<ZamenaResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}${ZAMENA_ENDPOINT}`, {
        method: 'POST', // Или 'PUT', в зависимости от вашего API
        headers: getAuthHeaders(true), // true для file upload
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