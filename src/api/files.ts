// src/api/files.ts

// import { BASE_URL } from './config'; // УДАЛЯЕМ неиспользуемый импорт
import { getAuthHeaders } from "@/api/auth.ts";

export const filesApi = {
    // URL для файлов - просто /files, чтобы проксирование сработало
    upload: async (file: File): Promise<string | undefined> => {
        // Используем абсолютный путь, который перехватит прокси Vite
        const url = `/files?filename=${encodeURIComponent(file.name)}`; 

        try {
            // Используем getAuthHeaders(true) для исключения Content-Type: application/json
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(true), 
                body: file, // Отправляем файл
            });

            if (!response.ok) {
                // Улучшенное логирование ошибки
                const status = response.status;
                const errorData = await response.json().catch(() => ({ detail: `Не удалось загрузить файл. Статус: ${status}` }));
                console.error(`Ошибка при загрузке файла ${file.name}:`, status, errorData);
                return undefined;
            }

            const result = await response.json();
            if (!result.id) {
                console.error(`Ответ сервера при загрузке файла ${file.name} не содержит ID:`, result);
                return undefined;
            }
            console.log(`Файл ${file.name} успешно загружен, ID: ${result.id}`);
            return result.id; 

        } catch (error) {
            console.error(`Сетевая ошибка (${(error as Error).message}) при загрузке файла ${file.name}:`, error);
            return undefined;
        }
    },
};