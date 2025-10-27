import {BASE_URL} from './config';
import {filesApi} from './files';
import {getAuthHeaders} from "@/api/auth.ts";

export const POST_TAGS = [
    "Новости",
    "Достижения",
    "Образование",
    "Событие"
];

export interface IncompletePost {
    id: number;
    title: string;
    body: string;
    publish_date: number;
    type: number;
    files: BackendFile[];
    category: PostCategory;
    status: PostStatus;
}

export interface Post extends IncompletePost {
    views?: number; // Исправлено на опциональное
    author: string;
}

export enum PostCategory {
    News = 0,
    Professionals = 1,
    Contests = 2,
}

export enum PostStatus {
    Draft = 0,
    Published = 1,
}

export class ConflictError extends Error {
  constructor(message = 'Ресурс уже существует.') {
    super(message);
    this.name = 'ConflictError';
  }
}

export interface BackendFile {
    id: string;
    name: string;
    mime: string;
}

export interface CreatePostPayload {
    title: string;
    body: string;
    publish_date: number;
    author: string;
    type: number;
    status: PostStatus;
    files: string[];
    category: PostCategory;
}

export const postsApi = {
  getAll: async (
      params?: {
          limit?: number;
          offset?: number;
          category?: PostCategory;
      }
  ): Promise<Post[]> => {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.category !== undefined) queryParams.append('category', params.category.toString()); 
    
    // ИСПРАВЛЕНИЕ 1: Добавлен BASE_URL (как в teachers.ts)
    const url = `${BASE_URL}/admin/posts/?${queryParams.toString()}`; 

    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts, Status: ${response.status}`);
    }

    return await response.json();
  },

  getById: async (id: string): Promise<Post> => {
    // ИСПРАВЛЕНИЕ 1: Добавлен BASE_URL
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, { 
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
      return await response.json();
  },

  create: async (
      payload: CreatePostPayload,
      files: File[] = []
  ): Promise<Post> => {
    let filesPayload: BackendFile[]; 
    const uploadPromises: Promise<BackendFile>[] = files.map(async (file): Promise<BackendFile> => {
      try {
        const fileId = await filesApi.upload(file);
        if (typeof fileId === 'string' && fileId) {
          return {
            id: fileId,
            name: file.name,
            mime: file.type || 'application/octet-stream',
          };
        }
      } catch (error) {
        console.error(`Failed to upload file ${file.name}:`, error);
      }
      return null; 
    });

    const uploadResults = await Promise.all(uploadPromises);
    filesPayload = uploadResults.filter((result): result is BackendFile => result !== null);

    const category = Number(payload.category);
    const type = Number(payload.type);

    if (isNaN(category) || isNaN(type)) {
      throw new Error('Поля "Категория" и "Тип поста" должны быть выбраны.');
    }
    const finalPayload = {
      title: payload.title,
      body: payload.body,
      publish_date: Math.floor(new Date(payload.publish_date).getTime() / 1000),
      author: payload.author,
      category: String(payload.category), 
      type,
      status: String(payload.status),   
      
      // ИСПРАВЛЕНИЕ 2: Отправляем массив ID (string[]), а не массив объектов (BackendFile[])
      // Это соответствует логике в `update` и интерфейсу `CreatePostPayload`
      files: filesPayload.map(file => file.id), 
    };

    console.log('Отправляемый Payload (Create):', JSON.stringify(finalPayload, null, 2));

    // ИСПРАВЛЕНИЕ 1: Добавлен BASE_URL
    const response = await fetch(`${BASE_URL}/admin/posts/`, { 
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(finalPayload),
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({ detail: 'Не удалось прочитать ошибку сервера' }));
      if (response.status === 409) {
        console.error('Ошибка 409 (Конфликт). Ответ сервера:', errorDetails);
        throw new ConflictError('Пост с таким заголовком, вероятно, уже существует. Пожалуйста, измените заголовок.');
      }
      const errorMessage = errorDetails.detail || 'Ошибка данных запроса.';
      throw new Error(errorMessage);
    }
    return response.json();
  },
  update: async (id: number, payload: Partial<CreatePostPayload>, files?: File[]) => {
    // `payload.files` - это массив ID (string[]) существующих файлов
    let combinedFiles: string[] = payload.files || []; 
    
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
         try {
           const fileId = await filesApi.upload(file);
           if (typeof fileId === 'string' && fileId) {
             // Возвращаем ID, а не объект
             return fileId;
           }
         } catch (error) {
           console.error(`Failed to upload file ${file.name}:`, error);
         }
         return null;
      });
      
      const newUploadResults = await Promise.all(uploadPromises);
      const successfullyUploadedFiles = newUploadResults
           .filter((id): id is string => id !== null);
      
      // ИСПРАВЛЕНИЕ 3: Добавляем новые ID к существующим, а не заменяем
      combinedFiles = [...combinedFiles, ...successfullyUploadedFiles];
    }

    // Теперь payload.files содержит полный список ID (старые + новые)
    payload.files = combinedFiles;
    
    // Этот код для сборки finalPayload выглядит сложным, но он просто
    // копирует все обновленные поля из payload. Оставляем как есть.
    const finalPayload: Record<string, any> = {};
    for (const key in payload) {
      if (payload[key as keyof Partial<CreatePostPayload>] !== undefined) {
        const value = payload[key as keyof Partial<CreatePostPayload>];
        
        if (key === 'category' || key === 'status') {
          finalPayload[key] = String(value);
        } else {
          finalPayload[key] = value;
        }
      }
    }

    console.log('Отправляемый Payload (Update):', finalPayload);


    // ИСПРАВЛЕНИЕ 1: Добавлен BASE_URL
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, { 
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(finalPayload),
    });

    if (!response.ok) {
       const status = response.status;
       let errorDetails;
       try {
           errorDetails = await response.json();
       } catch (e) {
           errorDetails = { detail: `Failed to parse error response. Status: ${status}` };
       }

       if (status === 422) {
           const missingFields = errorDetails.detail?.map((err) => err.loc.join('.')) || ['unknown fields'];
           throw new Error(`Ошибка валидации (422): Не заполнены или некорректны поля: ${missingFields.join(', ')}`);
       }

       throw new Error(errorDetails.detail || `Ошибка данных запроса (${status}).`);
    }
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    // ИСПРАВЛЕНИЕ 1: Добавлен BASE_URL
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete post' }));
      throw new Error(error.message || 'Failed to delete post');
    }
  },
};
