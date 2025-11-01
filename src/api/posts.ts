import { BASE_URL } from './config';
import { filesApi } from './files';
import { getAuthHeaders } from "@/api/auth.ts";

export const POST_TAGS = [
  "Новости",
  "Достижения",
  "Образование",
  "Событие"
];


export interface BackendFile {
  id: string;
  name: string;
  mime: string;
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
  views?: number; 
  author: string;
}

export class ConflictError extends Error {
  constructor(message = 'Ресурс уже существует.') {
    super(message);
    this.name = 'ConflictError';
  }
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
      status?: PostStatus; 
    }
  ): Promise<Post[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.category !== undefined) queryParams.append('category', params.category.toString()); 
    if (params?.status !== undefined) queryParams.append('status', params.status.toString()); 
    
    const url = `${BASE_URL}/admin/posts/?${queryParams.toString()}`; 
    const response = await fetch(url, { headers: getAuthHeaders() });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts, Status: ${response.status}`);
    }
    return await response.json();
  },

	
	getPublicAll: async (
		params: {
			limit?: number;
			offset?: number;
			category: PostCategory; 
		}
	): Promise<Post[]> => {
		const queryParams = new URLSearchParams();
		queryParams.append('category', params.category.toString());
		queryParams.append('offset', params.offset?.toString() || '0');
		queryParams.append('limit', params.limit?.toString() || '10');

		
		const url = `${BASE_URL}/content/posts/?${queryParams.toString()}`;
		
		
		const response = await fetch(url); 

		if (!response.ok) {
			const errorDetails = await response.json().catch(() => ({ detail: response.statusText }));
			console.error('API Error (getPublicAll):', errorDetails);
			throw new Error(`Failed to fetch public posts: ${errorDetails.detail || response.statusText}`);
		}
		return await response.json();
	},

	getPublicById: async (id: number): Promise<Post> => {
		
		const url = `${BASE_URL}/content/posts/${id}`;
		
		
		const response = await fetch(url); 

		if (!response.ok) {
			throw new Error('Failed to fetch public post');
		}
		return await response.json();
	},
	

  getById: async (id: number): Promise<Post> => { 
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, { headers: getAuthHeaders() });
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    return await response.json();
  },

  create: async ( 
    payload: CreatePostPayload,
    filesToUpload: File[] = [] 
  ): Promise<Post> => {
    let uploadedFileIds: string[] = [];
    if (filesToUpload.length > 0) {
        const uploadPromises = filesToUpload.map(async (file) => {
            try {
                const fileId = await filesApi.upload(file);
                if (typeof fileId === 'string' && fileId) {
                    return fileId;
                }
            } catch (error) {
                console.error(`Failed to upload file ${file.name}:`, error);
            }
            return null;
        });
        const uploadResults = await Promise.all(uploadPromises);
        uploadedFileIds = uploadResults.filter((id): id is string => id !== null);
    }

    
    const finalPayload = {
      ...payload,
      publish_date: Math.floor(payload.publish_date), 
      category: Number(payload.category), 
      type: Number(payload.type),         
      status: Number(payload.status),     
      files: uploadedFileIds, 
    };

    console.log('Отправляемый Payload (Create):', finalPayload);

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
      if (response.status === 422) {
          console.error('Ошибка 422 (Validation Error). Ответ сервера:', errorDetails);
          const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
          const errorLoc = errorDetails.detail?.[0]?.loc?.join('.') || 'неизвестное поле';
          throw new Error(`Ошибка валидации (422): ${errorMsg} в поле "${errorLoc}"`);
      }
      const errorMessage = typeof errorDetails.detail === 'string' ? errorDetails.detail : 'Ошибка данных запроса.';
      throw new Error(errorMessage);
    }
    return response.json();
  },

  update: async (id: number, payload: Partial<CreatePostPayload>, filesToUpload?: File[]) => { 
    let existingFileIds: string[] = payload.files || []; 
    let newUploadedFileIds: string[] = [];
    
    if (filesToUpload && filesToUpload.length > 0) {
      const uploadPromises = filesToUpload.map(async (file) => {
          try {
            const fileId = await filesApi.upload(file);
            return typeof fileId === 'string' ? fileId : null;
          } catch (error) {
            console.error(`Failed to upload file ${file.name}:`, error);
          }
          return null;
      });
      const newUploadResults = await Promise.all(uploadPromises);
      newUploadedFileIds = newUploadResults.filter((id): id is string => id !== null);
    }

    const allFileIds = [...existingFileIds, ...newUploadedFileIds];
    const finalPayload: Record<string, any> = {};
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
          if (key === 'files') continue;

        const value = payload[key as keyof Partial<CreatePostPayload>];
        
        if (key === 'category' || key === 'status' || key === 'type') {
            if (value !== undefined && value !== null) {
                finalPayload[key] = Number(value);
            }
        } else if (key === 'publish_date') {
              if (value !== undefined && value !== null) {
                finalPayload[key] = Math.floor(Number(value)); 
            }
        } else if (value !== undefined) { 
          finalPayload[key] = value;
        }
      }
    }
    finalPayload['files'] = allFileIds;


    console.log('Отправляемый Payload (Update):', finalPayload);

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
          console.error(`Ошибка ${status} (Update). Ответ сервера:`, errorDetails); 
        } catch (e) {
            errorDetails = { detail: `Failed to parse error response. Status: ${status}` };
        }

        if (status === 422) {
          const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
          const errorLoc = errorDetails.detail?.[0]?.loc?.join('.') || 'неизвестное поле';
          throw new Error(`Ошибка валидации (422): ${errorMsg} в поле "${errorLoc}"`);
        }
        if (status === 409) {
          throw new ConflictError('Пост с таким заголовком, вероятно, уже существует.');
        }

        throw new Error(typeof errorDetails.detail === 'string' ? errorDetails.detail : `Ошибка данных запроса (${status}).`);
    }
    return response.json();
  },

  delete: async (id: number): Promise<void> => { 
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