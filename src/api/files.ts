import { getAuthHeaders } from "@/api/auth.ts";
import { BASE_URL } from "@/api/config.ts"; 

export const filesApi = {

    upload: async (file: File): Promise<string> => {
        const params = new URLSearchParams();
        params.append('filename', file.name);
        
        
        params.append('deattached', "true"); 

        const url = `${BASE_URL}/files/?${params.toString()}`;

        const formData = new FormData();
        formData.append('file', file, file.name); 

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(true), 
                body: formData,
            });

            if (!response.ok) {
                const status = response.status;
                const errorData = await response.json().catch(() => ({ detail: `Не удалось загрузить файл. Статус: ${status}` }));
                console.error(`Ошибка при загрузке файла ${file.name}:`, status, errorData);
                
                let errorMessage = `Ошибка загрузки файла: ${status}`;
                
                
                if (status === 422 && errorData.detail?.[0]?.loc?.includes('deattached')) { 
                    errorMessage = "Ошибка API: отсутствует обязательный параметр 'deattached'.";
                } else if (status === 422) {
                    errorMessage = `Ошибка валидации (422): ${JSON.stringify(errorData.detail)}`;
                }
                
                throw new Error(errorMessage);
            }

            const result = await response.json();
            
            if (typeof result === 'string') {
                console.log(`Файл ${file.name} успешно загружен, ID: ${result}`);
                return result; 
            }

            if (result.id && typeof result.id === 'string') {
                console.log(`Файл ${file.name} успешно загружен, ID: ${result.id}`);
                return result.id;
            }
            
            console.error(`Ответ сервера при загрузке файла ${file.name} не содержит ID:`, result);
            throw new Error('Ответ сервера не содержит ID файла');

        } catch (error) {
            console.error(`Сетевая ошибка (${(error as Error).message}) при загрузке файла ${file.name}:`, error);
            throw error;
        }
    },
};