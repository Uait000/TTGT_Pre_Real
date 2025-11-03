import { getAuthHeaders } from "@/api/auth"; 
import { BASE_URL, ADMIN_API_PREFIX } from "@/api/config";

const PUBLIC_ZAMENA_URL = `${BASE_URL}/files/fixed/zamena`;
const ADMIN_UPLOAD_URL = `${BASE_URL}${ADMIN_API_PREFIX}/fixedfiles/zamena`;

export const zamenaApi = {

    get: async (): Promise<{ url: string | null }> => {
        try {
            const response = await fetch(PUBLIC_ZAMENA_URL, {
                method: 'GET', 
                cache: 'no-store', 
            });

            if (response.ok) {
                return { url: PUBLIC_ZAMENA_URL };
            } else {
                return { url: null };
            }
        } catch (error) {
            console.error("Ошибка при проверке статуса файла замен:", error);
            return { url: null };
        }
    },

    upload: async (file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(ADMIN_UPLOAD_URL, {
            method: 'PATCH',
            headers: getAuthHeaders(true), 
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Ошибка загрузки файла замен:", response.status, errorData);
            
            const detail = errorData.detail?.[0]?.msg 
                           || errorData.detail 
                           || 'Неизвестная ошибка сервера';
                           
            throw new Error(`Ошибка ${response.status}: ${detail}`);
        }
        
        return;
    }
};