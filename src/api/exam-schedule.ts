import { BASE_URL } from './config';
import { filesApi } from './files';
import { getAuthHeaders } from './auth';

export interface ExamSchedule {
  id: number;
  title: string;
  course: string;
  date_range: string;
  groups: ExamGroup[];
  file_url?: string;
  file_name?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  files?: FileInfo[];
  publish_date: number;
  group_files?: GroupFile[];
}

export interface FileInfo {
  id: string;
  name: string;
  url: string;
  size: number;
  mime?: string;
}

export interface GroupFile {
  groupName: string;
  fileId: string;
  fileName: string;
}

export interface ExamGroup {
  date: string;
  list: string[];
}

export interface CreateExamSchedulePayload {
  title: string;
  course: string;
  date_range: string;
  groups: ExamGroup[];
  file_url?: string;
  file_name?: string;
  is_published: boolean;
  files?: string[];
  publish_date?: number;
  group_files?: GroupFile[];
}

// Вспомогательная функция для преобразования поста в расписание экзаменов
const transformPostToExamSchedule = (post: any): ExamSchedule => {
  let scheduleData = {
    course: '1 курс',
    date_range: '',
    groups: [],
    group_files: [],
    document_type: 'exam_schedule'
  };

  try {
    if (post.body) {
      const bodyData = JSON.parse(post.body);
      scheduleData = { ...scheduleData, ...bodyData };
    }
  } catch (e) {
    console.warn('Не удалось разобрать body поста:', e);
  }

  return {
    id: post.id,
    title: post.title,
    course: scheduleData.course,
    date_range: scheduleData.date_range,
    groups: scheduleData.groups || [],
    file_url: post.files && post.files.length > 0 ? post.files[0].url : '',
    file_name: post.files && post.files.length > 0 ? post.files[0].name : '',
    is_published: post.status === 1,
    publish_date: post.publish_date,
    created_at: post.created_at || new Date().toISOString(),
    updated_at: post.updated_at || new Date().toISOString(),
    files: post.files || [],
    group_files: scheduleData.group_files || []
  };
};

const examScheduleApi = {
  async getAll(): Promise<ExamSchedule[]> {
    try {
      const response = await fetch(`${BASE_URL}/admin/posts?category=25`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Не удалось загрузить расписание экзаменов. Статус: ${response.status}`);
      }
      
      const posts = await response.json();
      return posts.map((post: any) => transformPostToExamSchedule(post));
    } catch (error) {
      console.error('Ошибка загрузки расписания экзаменов:', error);
      return [];
    }
  },

  async getById(id: number): Promise<ExamSchedule> {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить расписание экзаменов');
    }
    
    const post = await response.json();
    return transformPostToExamSchedule(post);
  },

  async create(payload: CreateExamSchedulePayload, file?: File): Promise<ExamSchedule> {
    let uploadedFileIds: string[] = [];

    if (file) {
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
      title: payload.title,
      body: JSON.stringify({
        course: payload.course,
        date_range: payload.date_range,
        groups: payload.groups,
        group_files: payload.group_files || [],
        document_type: 'exam_schedule'
      }),
      author: "Администрация",
      type: 0,
      category: 25,
      status: payload.is_published ? 1 : 0,
      publish_date: payload.publish_date || Math.floor(Date.now() / 1000),
      files: uploadedFileIds
    };

    console.log('📤 Создание расписания экзаменов - отправляемые данные:', JSON.stringify(postPayload, null, 2));

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
        throw new Error('Расписание с таким названием уже существует. Пожалуйста, измените название.');
      }
      
      if (response.status === 422) {
        console.error('❌ Ошибка валидации при создании:', errorDetails);
        const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
        const errorLoc = errorDetails.detail?.[0]?.loc?.join('.') || 'неизвестное поле';
        throw new Error(`Ошибка валидации: ${errorMsg} в поле "${errorLoc}"`);
      }
      
      const errorMessage = typeof errorDetails.detail === 'string' ? errorDetails.detail : 'Ошибка создания расписания экзаменов.';
      throw new Error(errorMessage);
    }
    
    const post = await response.json();
    return transformPostToExamSchedule(post);
  },

  async update(id: number, payload: Partial<CreateExamSchedulePayload>, file?: File): Promise<ExamSchedule> {
    let currentSchedule;
    try {
      currentSchedule = await this.getById(id);
      console.log('📋 Текущее расписание:', currentSchedule);
    } catch (error) {
      console.error('Не удалось получить текущее расписание:', error);
    }

    let existingFileIds: string[] = payload.files || [];
    let newUploadedFileIds: string[] = [];

    if (file) {
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
      title: payload.title !== undefined ? payload.title : currentSchedule?.title,
      body: JSON.stringify({
        course: payload.course !== undefined ? payload.course : currentSchedule?.course,
        date_range: payload.date_range !== undefined ? payload.date_range : currentSchedule?.date_range,
        groups: payload.groups !== undefined ? payload.groups : currentSchedule?.groups || [],
        group_files: payload.group_files !== undefined ? payload.group_files : currentSchedule?.group_files || [],
        document_type: 'exam_schedule'
      }),
      type: 0,
      category: 25,
      status: payload.is_published !== undefined ? (payload.is_published ? 1 : 0) : (currentSchedule?.is_published ? 1 : 0),
      publish_date: payload.publish_date !== undefined ? payload.publish_date : currentSchedule?.publish_date,
      author: "Администрация",
      files: allFileIds
    };

    console.log('🔄 Обновление расписания ID:', id);
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
        throw new Error('Расписание с таким названием уже существует.');
      }

      throw new Error(typeof errorDetails.detail === 'string' ? errorDetails.detail : `Ошибка обновления расписания (${status}).`);
    }
    
    const post = await response.json();
    console.log('✅ Расписание успешно обновлено:', post);
    return transformPostToExamSchedule(post);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Не удалось удалить расписание' }));
      throw new Error(error.message || 'Не удалось удалить расписание');
    }
  },

  // --- ИСПРАВЛЕННЫЙ МЕТОД ---
  async getPublicAll(): Promise<ExamSchedule[]> {
    try {
      // 1. Пробуем получить через публичный API
      const response = await fetch(`${BASE_URL}/content/posts?category=25`);
      let posts = [];

      if (response.ok) {
        posts = await response.json();
      }

      // 2. Если публичный API вернул пустоту (или ошибку), но мы можем быть админом,
      // пробуем загрузить через админский API, чтобы показать свежие данные.
      // Это решает проблему кэширования.
      if (!posts || posts.length === 0) {
        try {
            const adminResponse = await fetch(`${BASE_URL}/admin/posts?category=25`, {
                headers: getAuthHeaders()
            });

            if (adminResponse.ok) {
                const adminPosts = await adminResponse.json();
                // Фильтруем, показываем только опубликованные (status === 1)
                posts = adminPosts.filter((post: any) => post.status === 1);
            }
        } catch (e) {
            console.warn('Не удалось загрузить резервное расписание через админ-API', e);
        }
      }
      
      return posts.map((post: any) => transformPostToExamSchedule(post));
      
    } catch (error) {
      console.error('Ошибка загрузки публичного расписания экзаменов:', error);
      return [];
    }
  },

  transformPostToExamSchedule
};

export default examScheduleApi;