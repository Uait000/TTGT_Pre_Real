import { getAuthHeaders } from "@/api/auth.ts";
import { BASE_URL } from "@/api/config.ts"; 

export const filesApi = {

    upload: async (file: File): Promise<string | undefined> => {
        const url = `${BASE_URL}/files?filename=${encodeURIComponent(file.name)}`; 

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(true), 
                body: file, 
            });

            if (!response.ok) {
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