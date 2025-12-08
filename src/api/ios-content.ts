// src/api/ios-content.ts
import { BASE_URL } from './config';
import { getAuthHeaders } from './auth';
import { PostCategory } from './posts';

export interface IOSContent {
  id: number;
  title: string;
  type: 'main' | 'specialty' | 'external' | 'internal' | 'federal';
  file_url?: string;
  external_url?: string;
  file_name?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  files?: any[];
  publish_date?: number;
}

export interface CreateIOSContentPayload {
  title: string;
  type: 'main' | 'specialty' | 'external' | 'internal' | 'federal';
  file_url?: string;
  external_url?: string;
  file_name?: string;
  order_index?: number;
  is_published: boolean;
  publish_date?: number;
}

const IOS_CATEGORY = PostCategory.IOS;

const transformPostToIOSContent = (post: any): IOSContent => {
  let contentData = {
    type: 'main' as const,
    external_url: '',
    order_index: 0
  };

  try {
    if (post.body) {
      const bodyData = JSON.parse(post.body);
      contentData = { ...contentData, ...bodyData };
    }
  } catch (e) {
    console.warn('Не удалось разобрать body поста:', e);
  }

  return {
    id: post.id,
    title: post.title,
    type: contentData.type,
    file_url: post.files && post.files.length > 0 ? post.files[0].url : '',
    external_url: contentData.external_url,
    file_name: post.files && post.files.length > 0 ? post.files[0].name : '',
    order_index: contentData.order_index || 0,
    is_published: post.status === 1,
    created_at: post.created_at || new Date().toISOString(),
    updated_at: post.updated_at || new Date().toISOString(),
    files: post.files || [],
    publish_date: post.publish_date
  };
};

export const iosContentApi = {
  async getAll(): Promise<IOSContent[]> {
    try {
      // Убираем лимит - загружаем все посты
      const response = await fetch(`${BASE_URL}/admin/posts?category=${IOS_CATEGORY}&limit=1000`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Не удалось загрузить контент IOS. Статус: ${response.status}`);
      }
      
      const posts = await response.json();
      console.log('📥 Загружено IOS контента:', posts.length, 'элементов');
      return posts.map((post: any) => transformPostToIOSContent(post));
    } catch (error) {
      console.error('Ошибка загрузки контента IOS:', error);
      return [];
    }
  },

  async create(payload: CreateIOSContentPayload, file?: File): Promise<IOSContent> {
    let uploadedFileIds: string[] = [];
    
    if (file && (payload.type === 'main' || payload.type === 'specialty')) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await fetch(`${BASE_URL}/files/?filename=${encodeURIComponent(file.name)}&deattached=true`, {
          method: 'POST',
          headers: getAuthHeaders(true),
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Не удалось загрузить файл: ${uploadResponse.status} ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        if (typeof uploadResult === 'string') {
          uploadedFileIds = [uploadResult];
        } else if (uploadResult.id) {
          uploadedFileIds = [uploadResult.id];
        }
        console.log('✅ Файл загружен, ID:', uploadedFileIds[0]);
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        throw new Error('Не удалось загрузить файл');
      }
    }

    const postPayload = {
      title: payload.title,
      body: JSON.stringify({
        type: payload.type,
        external_url: payload.external_url || '',
        order_index: payload.order_index || 0
      }),
      author: "Администрация",
      type: 0,
      category: IOS_CATEGORY,
      status: payload.is_published ? 1 : 0,
      publish_date: payload.publish_date || Math.floor(Date.now() / 1000),
      files: uploadedFileIds
    };

    console.log('📤 Создание IOS контента - отправляемые данные:', JSON.stringify(postPayload, null, 2));

    const response = await fetch(`${BASE_URL}/admin/posts`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (e) {
        errorDetails = { detail: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error('❌ Ошибка создания IOS контента:', errorDetails);
      
      if (response.status === 422) {
        const validationErrors = errorDetails.detail || errorDetails;
        const errorMessage = Array.isArray(validationErrors) 
          ? validationErrors.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ')
          : JSON.stringify(validationErrors);
        throw new Error(`Ошибка валидации: ${errorMessage}`);
      }
      
      throw new Error(errorDetails.detail || `Не удалось создать контент (${response.status})`);
    }
    
    const post = await response.json();
    console.log('✅ IOS контент создан:', post.id);
    return transformPostToIOSContent(post);
  },

  async update(id: number, payload: Partial<CreateIOSContentPayload>, file?: File): Promise<IOSContent> {
    // Сначала получим текущий пост, чтобы сохранить существующие данные
    let currentPost;
    try {
      const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        currentPost = await response.json();
        console.log('📋 Текущий пост:', currentPost);
      }
    } catch (error) {
      console.warn('Не удалось получить текущий пост:', error);
    }

    let uploadedFileIds: string[] = [];
    
    if (file && (payload.type === 'main' || payload.type === 'specialty')) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await fetch(`${BASE_URL}/files/?filename=${encodeURIComponent(file.name)}&deattached=true`, {
          method: 'POST',
          headers: getAuthHeaders(true),
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Не удалось загрузить файл: ${uploadResponse.status} ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        if (typeof uploadResult === 'string') {
          uploadedFileIds = [uploadResult];
        } else if (uploadResult.id) {
          uploadedFileIds = [uploadResult.id];
        }
        console.log('✅ Файл загружен, ID:', uploadedFileIds[0]);
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        throw new Error('Не удалось загрузить файл');
      }
    }

    // Подготавливаем данные для обновления
    const currentBody = currentPost?.body ? JSON.parse(currentPost.body) : {};
    const updatedBody = {
      ...currentBody,
      type: payload.type !== undefined ? payload.type : currentBody.type,
      external_url: payload.external_url !== undefined ? payload.external_url : currentBody.external_url,
      order_index: payload.order_index !== undefined ? payload.order_index : currentBody.order_index
    };

    const postPayload: any = {
      title: payload.title !== undefined ? payload.title : currentPost?.title,
      body: JSON.stringify(updatedBody),
      status: payload.is_published !== undefined ? (payload.is_published ? 1 : 0) : currentPost?.status,
      type: 0, // Обязательное поле
      category: IOS_CATEGORY, // Обязательное поле
      author: "Администрация", // Обязательное поле
      publish_date: currentPost?.publish_date || Math.floor(Date.now() / 1000) // Обязательное поле publish_date
    };

    // Добавляем files только если есть новые загруженные файлы
    if (uploadedFileIds.length > 0) {
      postPayload.files = uploadedFileIds;
    } else if (currentPost?.files) {
      // Сохраняем существующие файлы
      postPayload.files = currentPost.files.map((f: any) => f.id);
    }

    console.log('🔄 Обновление IOS контента ID:', id);
    console.log('📤 Отправляемые данные:', JSON.stringify(postPayload, null, 2));

    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (e) {
        errorDetails = { detail: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error('❌ Ошибка обновления IOS контента:', errorDetails);
      
      if (response.status === 422) {
        const validationErrors = errorDetails.detail || errorDetails;
        const errorMessage = Array.isArray(validationErrors) 
          ? validationErrors.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ')
          : JSON.stringify(validationErrors);
        throw new Error(`Ошибка валидации: ${errorMessage}`);
      }
      
      throw new Error(errorDetails.detail || `Не удалось обновить контент (${response.status})`);
    }
    
    const post = await response.json();
    console.log('✅ IOS контент обновлен:', post.id);
    return transformPostToIOSContent(post);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Не удалось удалить контент' }));
      throw new Error(error.message || 'Не удалось удалить контент');
    }
    console.log('🗑️ IOS контент удален:', id);
  }
};

export default iosContentApi;