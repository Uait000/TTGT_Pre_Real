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

export async function uploadFeedbackFiles(feedbackId: number, files: File[]): Promise<void> {
    const API_ENDPOINT = `${BASE_URL}/feedback/${feedbackId}/upload`; 

    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file, file.name); 
    });

    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData, 
    });

    if (!response.ok) {
        let errorMessage = `Ошибка загрузки файлов: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }
}

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
        return; 
    }
    
    if (response.status === 200) {
        try {
            const result = await response.json();
            return result.id as number; 
        } catch (e) {
             return; 
        }
    }

    if (!response.ok) {
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