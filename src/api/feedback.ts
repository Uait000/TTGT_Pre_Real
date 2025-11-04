// src/api/feedback.ts

import { BASE_URL } from '@/api/config'; 

export interface FeedbackData {
    first_name: string;
    second_name: string; 
    middle_name: string; 
    email: string;
    phone: string;
    topic: string;       
    content: string;     
}

// Новая функция: Отправка файлов
// Мы предполагаем, что бэкенд ждет ID созданного обращения для привязки файлов.
// *ВАЖНО: Поле files должно быть реализовано на бэкенде как multipart/form-data
export async function uploadFeedbackFiles(feedbackId: number, files: File[]): Promise<void> {
    
    // ПРЕДПОЛАГАЕМЫЙ МАРШРУТ для загрузки файлов. 
    // Вам нужно уточнить его у бэкенд-разработчика. 
    const API_ENDPOINT = `${BASE_URL}/feedback/${feedbackId}/upload`; 

    const formData = new FormData();
    files.forEach((file) => {
        // Предполагаем, что поле для файлов называется 'files'
        formData.append('files', file, file.name); 
    });

    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        // Content-Type устанавливается автоматически браузером для FormData
        body: formData, 
    });

    if (!response.ok) {
        let errorMessage = `Ошибка загрузки файлов: ${response.status} ${response.statusText}`;
        // Можно добавить логику обработки ошибок, как в createFeedback, если бэкенд возвращает JSON.
        throw new Error(errorMessage);
    }
}


/**
 * Отправляет текстовые данные формы обратной связи (JSON).
 * Возвращает ID созданного обращения, если оно есть в теле ответа.
 */
export async function createFeedback(data: FeedbackData): Promise<number | void> {
    
    const API_ENDPOINT = `${BASE_URL}/feedback/`; 

    const response = await fetch(API_ENDPOINT, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data), 
    });
    
    if (response.status === 204) {
        return; // Успех без контента
    }
    
    if (response.status === 200) {
        // Если бэкенд возвращает 200 OK и тело с ID, мы его считываем.
        try {
            const result = await response.json();
            // Возвращаем ID для дальнейшей загрузки файлов
            return result.id as number; 
        } catch (e) {
             return; 
        }
    }

    if (!response.ok) {
        // ... (логика обработки ошибок 422 и т.д. без изменений)
        let errorData = {};
        let errorMessage = `Ошибка сервера: ${response.status} ${response.statusText} при отправке на ${API_ENDPOINT}`;

        try {
            errorData = await response.json();
        } catch (e) {
            throw new Error(errorMessage);
        }
        
        if (response.status === 422 && (errorData as any).detail && Array.isArray((errorData as any).detail)) {
            const validationErrors = (errorData as any).detail.map((err: any) => 
                `${err.loc.pop()}: ${err.msg}`
            ).join('; ');
            throw new Error(`Ошибка валидации: ${validationErrors}`);
        }

        throw new Error((errorData as any).message || errorMessage);
    }
}