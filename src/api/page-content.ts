// src/api/page-content.ts
import { BASE_URL } from './config';
import { filesApi } from './files';
import { getAuthHeaders } from './auth';
import { PostCategory } from './posts';

export interface PageContent {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  file_url?: string;
  file_name?: string;
  year?: number;
  color?: string;
  order_index?: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  files?: FileInfo[];
  button_text?: string;
  secondary_button_text?: string;
  secondary_file_url?: string;
  schedule_start?: string;
  schedule_end?: string;
  link?: string;
  secondary_link?: string;
  content_type?: string;
}

export interface FileInfo {
  id: string;
  name: string;
  url: string;
  size: number;
  mime?: string;
}

export interface CreatePageContentPayload {
  title: string;
  description?: string;
  image_url?: string;
  file_url?: string;
  file_name?: string;
  year?: number;
  color?: string;
  order_index?: number;
  is_published: boolean;
  files?: string[];
  button_text?: string;
  secondary_button_text?: string;
  secondary_file_url?: string;
  schedule_start?: string;
  schedule_end?: string;
  link?: string;
  secondary_link?: string;
  content_type?: string;
}

export enum ContentType {
  AdmissionNumbers = 'admission_numbers',
  AdmissionRules = 'admission_rules',
  Memo = 'memo',
  StateExam = 'state_exam',
  StartInScience = 'start_in_science',
  RussiaBelarus = 'russia_belarus',
  RailwayEmployers = 'railway_employers'
}

const CONTENT_TYPE_TO_CATEGORY = {
  [ContentType.AdmissionNumbers]: PostCategory.AdmissionNumbers,
  [ContentType.AdmissionRules]: PostCategory.AdmissionRules,
  [ContentType.Memo]: PostCategory.Memo,
  [ContentType.StateExam]: PostCategory.StateExam,
  [ContentType.StartInScience]: PostCategory.StartInScience,
  [ContentType.RussiaBelarus]: PostCategory.RussiaBelarus,
  [ContentType.RailwayEmployers]: PostCategory.RailwayEmployers
};

const transformPostToContent = (post: any): PageContent => {
  let contentData = {
    description: '',
    image_url: '',
    file_url: '',
    file_name: '',
    year: new Date().getFullYear(),
    color: '#3b82f6',
    order_index: 0,
    content_type: ContentType.AdmissionNumbers,
    button_text: 'Подробнее',
    secondary_button_text: '',
    secondary_file_url: '',
    schedule_start: '',
    schedule_end: '',
    link: '',
    secondary_link: '',
    block_type: 'general'
  };

  try {
    if (post.body) {
      if (typeof post.body === 'string') {
        contentData = { ...contentData, ...JSON.parse(post.body) };
      } else if (typeof post.body === 'object') {
        contentData = { ...contentData, ...post.body };
      }
    }
  } catch (e) {
    console.warn('Не удалось разобрать body поста:', e);
  }

  return {
    id: post.id,
    title: post.title,
    description: contentData.description,
    image_url: contentData.image_url,
    file_url: contentData.file_url,
    file_name: contentData.file_name,
    year: contentData.year,
    color: contentData.color,
    order_index: contentData.order_index,
    is_published: post.status === 1,
    created_at: post.created_at || new Date().toISOString(),
    updated_at: post.updated_at || new Date().toISOString(),
    files: post.files || [],
    button_text: contentData.button_text,
    secondary_button_text: contentData.secondary_button_text,
    secondary_file_url: contentData.secondary_file_url,
    schedule_start: contentData.schedule_start,
    schedule_end: contentData.schedule_end,
    link: contentData.link,
    secondary_link: contentData.secondary_link,
    content_type: contentData.block_type || contentData.content_type
  };
};

// Интерфейс для параметров запроса
interface GetContentParams {
  blockType?: string;
  limit?: number;
}

export const pageContentApi = {
  // ИСПРАВЛЕНО: теперь принимаем объект params с limit
  async getAll(contentType: ContentType, params: GetContentParams = {}): Promise<PageContent[]> {
    try {
      const category = CONTENT_TYPE_TO_CATEGORY[contentType];
      
      // Добавляем limit по умолчанию, если не передан
      const limit = params.limit || 1000; 
      
      let url = `${BASE_URL}/admin/posts?category=${category}&limit=${limit}`;
      
      if (params.blockType) {
        url += `&type=${params.blockType}`;
      }
      
      const response = await fetch(url, { headers: getAuthHeaders() });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Не удалось загрузить контент. Статус: ${response.status}`);
      }
      
      const posts = await response.json();
      const contents = posts.map((post: any) => transformPostToContent(post));
      
      if (params.blockType) {
        return contents.filter(content => content.content_type === params.blockType);
      }
      
      return contents;
    } catch (error) {
      console.error(`Ошибка загрузки контента для ${contentType}:`, error);
      return [];
    }
  },

  async getById(id: number): Promise<PageContent> {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить контент');
    }
    
    const post = await response.json();
    return transformPostToContent(post);
  },

  async create(contentType: ContentType, payload: CreatePageContentPayload, files: File[] = []): Promise<PageContent> {
    let uploadedFileIds: string[] = [];

    if (files.length > 0) {
      try {
        const uploadPromises = files.map(async (file) => {
          const fileId = await filesApi.upload(file);
          return typeof fileId === 'string' ? fileId : null;
        });
        
        const uploadResults = await Promise.all(uploadPromises);
        uploadedFileIds = uploadResults.filter((id): id is string => id !== null);
      } catch (error) {
        console.error('Ошибка загрузки файлов:', error);
        throw new Error('Не удалось загрузить файлы');
      }
    }

    const category = CONTENT_TYPE_TO_CATEGORY[contentType];
    
    const bodyData: any = {
      description: payload.description || '',
      image_url: payload.image_url || '',
      file_url: payload.file_url || '',
      file_name: payload.file_name || '',
      year: payload.year || new Date().getFullYear(),
      color: payload.color || '#3b82f6',
      order_index: payload.order_index || 0,
      content_type: contentType,
      button_text: payload.button_text || 'Подробнее',
      secondary_button_text: payload.secondary_button_text || '',
      secondary_file_url: payload.secondary_file_url || '',
      schedule_start: payload.schedule_start || '',
      schedule_end: payload.schedule_end || '',
      link: payload.link || '',
      secondary_link: payload.secondary_link || '',
      block_type: payload.content_type || 'general'
    };

    // Удаляем пустые поля
    Object.keys(bodyData).forEach(key => {
      if (bodyData[key] === '' || bodyData[key] === undefined) {
        delete bodyData[key];
      }
    });

    const postPayload = {
      title: payload.title,
      body: JSON.stringify(bodyData),
      author: "Администрация",
      type: payload.content_type ? 1 : 0,
      category: category,
      status: payload.is_published ? 1 : 0,
      publish_date: Math.floor(Date.now() / 1000),
      files: uploadedFileIds
    };

    console.log('📤 Создание контента:', { contentType, category, payload: postPayload });

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
        throw new Error('Контент с таким названием уже существует.');
      }
      
      if (response.status === 422) {
        const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
        throw new Error(`Ошибка валидации: ${errorMsg}`);
      }
      
      const errorMessage = typeof errorDetails.detail === 'string' ? errorDetails.detail : 'Ошибка создания контента.';
      throw new Error(errorMessage);
    }
    
    const post = await response.json();
    return transformPostToContent(post);
  },

  async update(id: number, payload: Partial<CreatePageContentPayload>, files: File[] = []): Promise<PageContent> {
    let currentContent: PageContent | null = null;
    try {
      currentContent = await this.getById(id);
    } catch (error) {
      console.error('Не удалось получить текущий контент:', error);
      throw new Error('Не удалось загрузить текущий контент для обновления');
    }

    if (!currentContent) {
      throw new Error('Контент для обновления не найден');
    }

    let existingFileIds: string[] = payload.files || (currentContent.files ? currentContent.files.map(f => f.id) : []);
    let newUploadedFileIds: string[] = [];

    if (files.length > 0) {
      try {
        const uploadPromises = files.map(async (file) => {
          const fileId = await filesApi.upload(file);
          return typeof fileId === 'string' ? fileId : null;
        });
        
        const uploadResults = await Promise.all(uploadPromises);
        newUploadedFileIds = uploadResults.filter((id): id is string => id !== null);
      } catch (error) {
        console.error('Ошибка загрузки файлов:', error);
        throw new Error('Не удалось загрузить файлы');
      }
    }

    const allFileIds = [...existingFileIds, ...newUploadedFileIds];
    
    // Получаем текущие данные из body
    let currentBodyData: any = {};
    try {
      if (currentContent.body) {
        currentBodyData = typeof currentContent.body === 'string' 
          ? JSON.parse(currentContent.body) 
          : currentContent.body;
      }
    } catch (e) {
      console.warn('Не удалось разобрать текущий body:', e);
    }
    
    const bodyData: any = {
      description: payload.description !== undefined ? payload.description : (currentContent.description || ''),
      image_url: payload.image_url !== undefined ? payload.image_url : (currentContent.image_url || ''),
      file_url: payload.file_url !== undefined ? payload.file_url : (currentContent.file_url || ''),
      file_name: payload.file_name !== undefined ? payload.file_name : (currentContent.file_name || ''),
      year: payload.year !== undefined ? payload.year : (currentContent.year || new Date().getFullYear()),
      color: payload.color !== undefined ? payload.color : (currentContent.color || '#3b82f6'),
      order_index: payload.order_index !== undefined ? payload.order_index : (currentContent.order_index || 0),
      content_type: currentBodyData.content_type || ContentType.AdmissionNumbers,
      button_text: payload.button_text !== undefined ? payload.button_text : (currentContent.button_text || 'Подробнее'),
      secondary_button_text: payload.secondary_button_text !== undefined ? payload.secondary_button_text : (currentContent.secondary_button_text || ''),
      secondary_file_url: payload.secondary_file_url !== undefined ? payload.secondary_file_url : (currentContent.secondary_file_url || ''),
      schedule_start: payload.schedule_start !== undefined ? payload.schedule_start : (currentContent.schedule_start || ''),
      schedule_end: payload.schedule_end !== undefined ? payload.schedule_end : (currentContent.schedule_end || ''),
      link: payload.link !== undefined ? payload.link : (currentContent.link || ''),
      secondary_link: payload.secondary_link !== undefined ? payload.secondary_link : (currentContent.secondary_link || ''),
      block_type: payload.content_type !== undefined ? payload.content_type : (currentContent.content_type || 'general')
    };

    // Удаляем пустые поля
    Object.keys(bodyData).forEach(key => {
      if (bodyData[key] === '' || bodyData[key] === undefined) {
        delete bodyData[key];
      }
    });

    const postPayload: Record<string, any> = {
      title: payload.title !== undefined ? payload.title : currentContent.title,
      body: JSON.stringify(bodyData),
      type: payload.content_type ? 1 : 0,
      category: currentContent.category || PostCategory.AdmissionNumbers,
      status: payload.is_published !== undefined ? (payload.is_published ? 1 : 0) : (currentContent.is_published ? 1 : 0),
      publish_date: Math.floor(Date.now() / 1000),
      author: "Администрация"
    };

    if (allFileIds.length > 0) {
      postPayload.files = allFileIds;
    }

    console.log('🔄 Обновление контента:', { id, payload: postPayload });

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
      } catch (e) {
        errorDetails = { detail: `Не удалось разобрать ответ ошибки. Статус: ${status}` };
      }

      if (status === 422) {
        const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
        throw new Error(`Ошибка валидации: ${errorMsg}`);
      }
      
      if (status === 409) {
        throw new Error('Контент с таким названием уже существует.');
      }

      throw new Error(typeof errorDetails.detail === 'string' ? errorDetails.detail : `Ошибка обновления контента (${status}).`);
    }
    
    const post = await response.json();
    return transformPostToContent(post);
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
  },

  // ИСПРАВЛЕНО: Добавлен params с limit
  async getPublicAll(contentType: ContentType, params: GetContentParams = {}): Promise<PageContent[]> {
    try {
      const category = CONTENT_TYPE_TO_CATEGORY[contentType];
      const limit = params.limit || 1000;
      
      let url = `${BASE_URL}/content/posts?category=${category}&limit=${limit}`;
      
      if (params.blockType) {
        url += `&type=${params.blockType}`;
      }

      const response = await fetch(url);

      if (response.ok) {
        const posts = await response.json();
        const contents = posts.map((post: any) => transformPostToContent(post));
        
        if (params.blockType) {
          return contents.filter(content => content.content_type === params.blockType);
        }
        
        return contents;
      }

      // Fallback на админку если публичный не работает
      let adminUrl = `${BASE_URL}/admin/posts?category=${category}&limit=${limit}`;
      if (params.blockType) {
        adminUrl += `&type=${params.blockType}`;
      }
      
      const adminResponse = await fetch(adminUrl, { headers: getAuthHeaders() });

      if (!adminResponse.ok) {
        return [];
      }
      
      const adminPosts = await adminResponse.json();
      const publishedPosts = adminPosts.filter((post: any) => post.status === 1);
      const contents = publishedPosts.map((post: any) => transformPostToContent(post));
      
      if (params.blockType) {
        return contents.filter(content => content.content_type === params.blockType);
      }
      
      return contents;
      
    } catch (error) {
      console.error(`Ошибка загрузки публичного контента для ${contentType}:`, error);
      return [];
    }
  }
};