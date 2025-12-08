// src/api/accessible-environment.ts
import { BASE_URL } from './config';
import { filesApi } from './files';
import { getAuthHeaders } from './auth';
import { PostCategory } from './posts';

export interface AccessibleEnvironmentDocument {
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
  publish_date: number;
}

export interface FileInfo {
  id: string;
  name: string;
  url: string;
  size: number;
  mime?: string;
}

export interface CreateAccessibleDocumentPayload {
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

// Разделы для доступной среды
export const ACCESSIBLE_ENV_SECTIONS = [
  'Условия для обучения инвалидов и лиц с ограниченными возможностями здоровья',
  'Адаптированные образовательные программы для инвалидов и лиц с ограниченными возможностями здоровья',
  'Виды и формы сопровождения обучения',
  'Наличие специальных технических и программных средств обучения'
];

// Вспомогательная функция для преобразования поста в документ доступной среды
const transformPostToAccessibleDocument = (post: any): AccessibleEnvironmentDocument => {
  let documentData = {
    section_title: ACCESSIBLE_ENV_SECTIONS[0],
    use_external_link: false,
    external_link: '',
    document_type: 'accessible_environment'
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

const accessibleEnvironmentApi = {
  async getAll(): Promise<AccessibleEnvironmentDocument[]> {
    try {
      console.log('🔄 Загрузка документов доступной среды...');
      const response = await fetch(`${BASE_URL}/admin/posts?category=${PostCategory.AccessibleEnvironment}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        console.error(`❌ Ошибка загрузки: ${response.status}`);
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Не удалось загрузить документы доступной среды. Статус: ${response.status}`);
      }
      
      const posts = await response.json();
      console.log(`✅ Загружено ${posts.length} документов доступной среды`);
      return posts.map((post: any) => transformPostToAccessibleDocument(post));
    } catch (error) {
      console.error('❌ Ошибка загрузки документов доступной среды:', error);
      return [];
    }
  },

  async getById(id: number): Promise<AccessibleEnvironmentDocument> {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить документ доступной среды');
    }
    
    const post = await response.json();
    return transformPostToAccessibleDocument(post);
  },

  async create(payload: CreateAccessibleDocumentPayload, file?: File): Promise<AccessibleEnvironmentDocument> {
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
        document_type: 'accessible_environment'
      }),
      author: "Администрация",
      type: 0,
      category: PostCategory.AccessibleEnvironment, // ВАЖНО: используем новую категорию
      status: payload.is_published ? 1 : 0,
      publish_date: payload.publish_date || Math.floor(Date.now() / 1000),
      files: uploadedFileIds
    };

    console.log('📤 Создание документа доступной среды:', {
      ...postPayload,
      category: `AccessibleEnvironment (${PostCategory.AccessibleEnvironment})`
    });

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
        throw new Error('Документ с таким названием уже существует. Пожалуйста, измените название.');
      }
      
      if (response.status === 422) {
        console.error('❌ Ошибка валидации:', errorDetails);
        const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
        const errorLoc = errorDetails.detail?.[0]?.loc?.join('.') || 'неизвестное поле';
        throw new Error(`Ошибка валидации: ${errorMsg} в поле "${errorLoc}"`);
      }
      
      const errorMessage = typeof errorDetails.detail === 'string' ? errorDetails.detail : 'Ошибка создания документа.';
      throw new Error(errorMessage);
    }
    
    const post = await response.json();
    console.log('✅ Документ доступной среды создан:', post);
    return transformPostToAccessibleDocument(post);
  },

  async update(id: number, payload: Partial<CreateAccessibleDocumentPayload>, file?: File): Promise<AccessibleEnvironmentDocument> {
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
    
    const postPayload: Record<string, any> = {
      title: payload.document_title || currentDocument?.document_title,
      body: JSON.stringify({
        section_title: payload.section_title !== undefined ? payload.section_title : currentDocument?.section_title,
        use_external_link: payload.use_external_link !== undefined ? payload.use_external_link : currentDocument?.use_external_link,
        external_link: payload.external_link !== undefined ? payload.external_link : currentDocument?.external_link,
        document_type: 'accessible_environment'
      }),
      type: 0,
      category: PostCategory.AccessibleEnvironment, // ВАЖНО: обновляем категорию
      status: payload.is_published !== undefined ? (payload.is_published ? 1 : 0) : (currentDocument?.is_published ? 1 : 0),
      publish_date: payload.publish_date !== undefined ? payload.publish_date : currentDocument?.publish_date,
      author: "Администрация"
    };

    if (allFileIds.length > 0) {
      postPayload.files = allFileIds;
    }

    console.log('🔄 Обновление документа доступной среды ID:', id);
    console.log('📤 Отправляемые данные:', {
      ...postPayload,
      category: `AccessibleEnvironment (${PostCategory.AccessibleEnvironment})`
    });

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
        console.error('❌ Ошибка от сервера:', errorDetails);
      } catch (e) {
        errorDetails = { detail: `Не удалось разобрать ответ ошибки. Статус: ${status}` };
      }

      if (status === 422) {
        const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
        const errorLoc = errorDetails.detail?.[0]?.loc?.join('.') || 'неизвестное поле';
        throw new Error(`Ошибка валидации: ${errorMsg} в поле "${errorLoc}"`);
      }
      
      if (status === 409) {
        throw new Error('Документ с таким названием уже существует.');
      }

      throw new Error(typeof errorDetails.detail === 'string' ? errorDetails.detail : `Ошибка обновления документа (${status}).`);
    }
    
    const post = await response.json();
    console.log('✅ Документ доступной среды успешно обновлен:', post);
    return transformPostToAccessibleDocument(post);
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

  async getPublicAll(): Promise<AccessibleEnvironmentDocument[]> {
    try {
      console.log('🔄 Загрузка публичных документов доступной среды...');
      
      // Пытаемся получить через публичный маршрут с новой категорией
      const response = await fetch(`${BASE_URL}/content/posts?category=${PostCategory.AccessibleEnvironment}`);

      if (response.ok) {
        const posts = await response.json();
        console.log(`✅ Загружено ${posts.length} публичных документов доступной среды`);
        return posts.map((post: any) => transformPostToAccessibleDocument(post));
      }

      console.log('⚠️ Публичный маршрут не доступен, используем админский...');

      // Если публичный маршрут не работает, используем админский
      const adminResponse = await fetch(`${BASE_URL}/admin/posts?category=${PostCategory.AccessibleEnvironment}`, {
        headers: getAuthHeaders()
      });

      if (!adminResponse.ok) {
        console.error('❌ Ошибка загрузки через админский маршрут');
        return [];
      }
      
      const adminPosts = await adminResponse.json();
      // Фильтруем только опубликованные документы
      const publishedPosts = adminPosts.filter((post: any) => post.status === 1);
      console.log(`✅ Загружено ${publishedPosts.length} опубликованных документов доступной среды`);
      return publishedPosts.map((post: any) => transformPostToAccessibleDocument(post));
      
    } catch (error) {
      console.error('❌ Ошибка загрузки публичных документов доступной среды:', error);
      return [];
    }
  },

  transformPostToAccessibleDocument
};

export default accessibleEnvironmentApi;