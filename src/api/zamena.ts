// src/api/zamena.ts
import { getAuthHeaders } from "@/api/auth"; 
import { BASE_URL, ADMIN_API_PREFIX } from "@/api/config";

const PUBLIC_ZAMENA_URL = `${BASE_URL}/files/fixed/zamena`;
const ADMIN_UPLOAD_URL = `${BASE_URL}${ADMIN_API_PREFIX}/fixedfiles/zamena`;

// Добавляем версию для кэширования
let zamenaVersion = Date.now();

export const zamenaApi = {
    get: async (): Promise<{ url: string | null; version: number }> => {
        try {
            // Добавляем параметр версии для избежания кэширования
            const url = `${PUBLIC_ZAMENA_URL}?v=${zamenaVersion}`;
            const response = await fetch(url, {
                method: 'GET', 
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (response.ok) {
                return { url, version: zamenaVersion };
            } else {
                return { url: null, version: zamenaVersion };
            }
        } catch (error) {
            console.error("Ошибка при проверке статуса файла замен:", error);
            return { url: null, version: zamenaVersion };
        }
    },

    upload: async (file: File): Promise<void> => {
        const formData = new FormData();
        // ИСПРАВЛЕНИЕ: правильное название поля
        formData.append('updatedFile', file);

        console.log('📤 Начинаем загрузку файла замен:', file.name);
        console.log('📝 Поле формы: updatedFile');
        
        const response = await fetch(ADMIN_UPLOAD_URL, {
            method: 'PATCH',
            headers: getAuthHeaders(true), 
            body: formData,
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = {};
            }
            
            console.error("❌ Ошибка загрузки файла замен:", response.status, errorData);
            
            // Более детальный анализ ошибки
            let errorMessage = 'Неизвестная ошибка сервера';
            
            if (response.status === 422) {
                errorMessage = 'Ошибка валидации данных';
                if (errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        errorMessage = errorData.detail.map((d: any) => d.msg).join(', ');
                    } else {
                        errorMessage = errorData.detail;
                    }
                }
            } else if (response.status === 401) {
                errorMessage = 'Недостаточно прав для загрузки файла';
            } else if (response.status === 500) {
                errorMessage = 'Внутренняя ошибка сервера';
            }
            
            throw new Error(`Ошибка ${response.status}: ${errorMessage}`);
        }
        
        // Обновляем версию после успешной загрузки
        zamenaVersion = Date.now();
        console.log('✅ Файл замен успешно загружен, новая версия:', zamenaVersion);
        
        // Отправляем событие об обновлении
        window.dispatchEvent(new CustomEvent('zamenaUpdated', { 
            detail: { version: zamenaVersion } 
        }));
        
        return;
    },

    // Метод для принудительного обновления версии
    forceRefresh: (): void => {
        zamenaVersion = Date.now();
        window.dispatchEvent(new CustomEvent('zamenaUpdated', { 
            detail: { version: zamenaVersion } 
        }));
    },

    // Получить текущую версию
    getCurrentVersion: (): number => {
        return zamenaVersion;
    }
};