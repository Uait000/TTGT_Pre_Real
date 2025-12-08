// src/api/documents.ts
import { BASE_URL } from './config';
import { filesApi } from './files';
import { getAuthHeaders } from './auth';
import { PostCategory } from './posts';

export interface Document {
  publish_date: any;
  id: number;
  section_title: string;
  document_title: string;
  file_url: string;
  file_name?: string;
  is_published: boolean;
  use_external_link: boolean;
  external_link?: string;
  created_at: string;
  updated_at: string;
  files?: FileInfo[];
}

export interface FileInfo {
  id: string;
  name: string;
  url: string;
  size: number;
  mime?: string;
}

export interface CreateDocumentPayload {
  section_title: string;
  document_title: string;
  file_url?: string;
  file_name?: string;
  is_published: boolean;
  use_external_link: boolean;
  external_link?: string;
  files?: string[];
  publish_date?: number;
}

export class ConflictError extends Error {
  constructor(message = 'Ресурс уже существует.') {
    super(message);
    this.name = 'ConflictError';
  }
}

// Вспомогательная функция для преобразования поста в документ
const transformPostToDocument = (post: any): Document => {
  let documentData = {
    section_title: 'Общие документы',
    use_external_link: false,
    external_link: '',
    document_type: 'document'
  };

  try {
    if (post.body) {
      const bodyData = JSON.parse(post.body);
      documentData = { ...documentData, ...bodyData };
    }
  } catch (e) {
    console.warn('Не удалось разобрать body поста:', e);
  }

  return {
    id: post.id,
    section_title: documentData.section_title,
    document_title: post.title,
    file_url: post.files && post.files.length > 0 ? post.files[0].url : '',
    file_name: post.files && post.files.length > 0 ? post.files[0].name : '',
    is_published: post.status === 1,
    use_external_link: documentData.use_external_link,
    external_link: documentData.external_link || '',
    publish_date: post.publish_date,
    created_at: post.created_at || new Date().toISOString(),
    updated_at: post.updated_at || new Date().toISOString(),
    files: post.files || []
  };
};

const documentsApi = {
  async getAll(): Promise<Document[]> {
    try {
      const response = await fetch(`${BASE_URL}/admin/posts?category=${PostCategory.Documents}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Не удалось загрузить документы. Статус: ${response.status}`);
      }
      
      const posts = await response.json();
      return posts.map((post: any) => transformPostToDocument(post));
    } catch (error) {
      console.error('Ошибка загрузки документов:', error);
      return [];
    }
  },

  async getById(id: number): Promise<Document> {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить документ');
    }
    
    const post = await response.json();
    return transformPostToDocument(post);
  },

  async create(payload: CreateDocumentPayload, file?: File): Promise<Document> {
    let uploadedFileIds: string[] = [];

    if (file && !payload.use_external_link) {
      try {
        const fileId = await filesApi.upload(file);
        if (typeof fileId === 'string' && fileId) {
          uploadedFileIds = [fileId];
        }
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        throw new Error('Не удалось загрузить файл');
      }
    }

    const postPayload = {
      title: payload.document_title,
      body: JSON.stringify({
        section_title: payload.section_title,
        use_external_link: payload.use_external_link,
        external_link: payload.external_link,
        document_type: 'document'
      }),
      author: "Администрация",
      type: 0,
      category: PostCategory.Documents,
      status: payload.is_published ? 1 : 0,
      publish_date: payload.publish_date || Math.floor(Date.now() / 1000),
      files: uploadedFileIds
    };

    console.log('📤 Создание документа - отправляемые данные:', JSON.stringify(postPayload, null, 2));

    const response = await fetch(`${BASE_URL}/admin/posts`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({ detail: 'Не удалось прочитать ошибку сервера' }));
      
      if (response.status === 409) {
        throw new ConflictError('Документ с таким названием уже существует. Пожалуйста, измените название.');
      }
      
      if (response.status === 422) {
        console.error('❌ Ошибка валидации при создании:', errorDetails);
        const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
        const errorLoc = errorDetails.detail?.[0]?.loc?.join('.') || 'неизвестное поле';
        throw new Error(`Ошибка валидации: ${errorMsg} в поле "${errorLoc}"`);
      }
      
      const errorMessage = typeof errorDetails.detail === 'string' ? errorDetails.detail : 'Ошибка создания документа.';
      throw new Error(errorMessage);
    }
    
    const post = await response.json();
    return transformPostToDocument(post);
  },

  async update(id: number, payload: Partial<CreateDocumentPayload>, file?: File): Promise<Document> {
    // Сначала получим текущий документ, чтобы сохранить существующие данные
    let currentDocument;
    try {
      currentDocument = await this.getById(id);
      console.log('📋 Текущий документ:', currentDocument);
    } catch (error) {
      console.error('Не удалось получить текущий документ:', error);
    }

    let existingFileIds: string[] = payload.files || [];
    let newUploadedFileIds: string[] = [];

    if (file && !payload.use_external_link) {
      try {
        const fileId = await filesApi.upload(file);
        if (typeof fileId === 'string' && fileId) {
          newUploadedFileIds = [fileId];
        }
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        throw new Error('Не удалось загрузить файл');
      }
    }

    const allFileIds = [...existingFileIds, ...newUploadedFileIds];
    
    // Создаем полный payload для обновления с ВСЕМИ обязательными полями
    const postPayload: Record<string, any> = {
      title: payload.document_title || currentDocument?.document_title,
      body: JSON.stringify({
        section_title: payload.section_title !== undefined ? payload.section_title : currentDocument?.section_title,
        use_external_link: payload.use_external_link !== undefined ? payload.use_external_link : currentDocument?.use_external_link,
        external_link: payload.external_link !== undefined ? payload.external_link : currentDocument?.external_link,
        document_type: 'document'
      }),
      type: 0, // ✅ Обязательное поле type
      category: PostCategory.Documents, // ✅ Обязательное поле category
      status: payload.is_published !== undefined ? (payload.is_published ? 1 : 0) : (currentDocument?.is_published ? 1 : 0),
      publish_date: payload.publish_date !== undefined ? payload.publish_date : currentDocument?.publish_date,
      author: "Администрация" // ✅ Добавляем author для консистентности
    };

    // Добавляем files только если они есть
    if (allFileIds.length > 0) {
      postPayload.files = allFileIds;
    }

    console.log('🔄 Обновление документа ID:', id);
    console.log('📤 Отправляемые данные:', JSON.stringify(postPayload, null, 2));
    console.log('📅 publish_date:', postPayload.publish_date, new Date(postPayload.publish_date * 1000).toLocaleString());
    console.log('🔧 type:', postPayload.type);
    console.log('📂 category:', postPayload.category);

    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      const status = response.status;
      let errorDetails;
      
      try {
        errorDetails = await response.json();
        console.error('❌ Детали ошибки от сервера:', errorDetails);
      } catch (e) {
        errorDetails = { detail: `Не удалось разобрать ответ ошибки. Статус: ${status}` };
      }

      if (status === 422) {
        const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
        const errorLoc = errorDetails.detail?.[0]?.loc?.join('.') || 'неизвестное поле';
        const fullError = `Ошибка валидации: ${errorMsg} в поле "${errorLoc}"`;
        console.error('❌ Полная ошибка валидации:', fullError);
        throw new Error(fullError);
      }
      
      if (status === 409) {
        throw new ConflictError('Документ с таким названием уже существует.');
      }

      throw new Error(typeof errorDetails.detail === 'string' ? errorDetails.detail : `Ошибка обновления документа (${status}).`);
    }
    
    const post = await response.json();
    console.log('✅ Документ успешно обновлен:', post);
    return transformPostToDocument(post);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Не удалось удалить документ' }));
      throw new Error(error.message || 'Не удалось удалить документ');
    }
  },

  async getPublicAll(): Promise<Document[]> {
    try {
      // Сначала пробуем получить через публичный маршрут
      const response = await fetch(`${BASE_URL}/content/posts?category=${PostCategory.Documents}`);

      if (response.ok) {
        const posts = await response.json();
        return posts.map((post: any) => transformPostToDocument(post));
      }

      // Если публичный маршрут не работает, используем админский (только для опубликованных)
      const adminResponse = await fetch(`${BASE_URL}/admin/posts?category=${PostCategory.Documents}`, {
        headers: getAuthHeaders()
      });

      if (!adminResponse.ok) {
        return [];
      }
      
      const adminPosts = await adminResponse.json();
      // Фильтруем только опубликованные документы
      const publishedPosts = adminPosts.filter((post: any) => post.status === 1);
      return publishedPosts.map((post: any) => transformPostToDocument(post));
      
    } catch (error) {
      console.error('Ошибка загрузки публичных документов:', error);
      return [];
    }
  },

  transformPostToDocument
};

export default documentsApi;