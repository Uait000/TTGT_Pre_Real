import { getAuthHeaders } from "@/api/auth"; 
import { BASE_URL } from "@/api/config";
import { PostCategory } from "@/api/posts";

// Новые эндпоинты API
const SCHEDULE_API_URL = `https://ttgt-api-isxb.onrender.com/schedule`;

export interface ScheduleData {
  courses: {
    [course: string]: string[];
  };
  teachers: string[];
}

export interface Document {
  id: number;
  title: string;
  file_url: string;
  file_name: string;
  category: number;
  created_at: string;
  updated_at: string;
}

export const scheduleApi = {
  // Получение всех данных расписания
  getScheduleData: async (): Promise<ScheduleData> => {
    try {
      const response = await fetch(`${SCHEDULE_API_URL}/items`);
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки данных расписания: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📋 Получены данные расписания:', data);
      
      const formattedData: ScheduleData = {
        courses: {},
        teachers: []
      };
      
      if (data.courses && typeof data.courses === 'object') {
        formattedData.courses = data.courses;
      } else {
        formattedData.courses = {
          '1': [],
          '2': [], 
          '3': [],
          '4': []
        };
        
        if (Array.isArray(data.groups)) {
          data.groups.forEach((group: string) => {
            const courseMatch = group.match(/-(\d)-/);
            if (courseMatch && courseMatch[1]) {
              const course = courseMatch[1];
              if (formattedData.courses[course]) {
                formattedData.courses[course].push(group);
              }
            }
          });
        }
      }
      
      if (Array.isArray(data.teachers)) {
        formattedData.teachers = data.teachers;
      } else if (data.teachers && typeof data.teachers === 'object') {
        formattedData.teachers = Object.values(data.teachers).flat();
      }
      
      console.log('📊 Отформатированные данные:', formattedData);
      return formattedData;
      
    } catch (error) {
      console.error('❌ Ошибка получения данных расписания:', error);
      return {
        courses: {
          '1': [],
          '2': [],
          '3': [], 
          '4': []
        },
        teachers: []
      };
    }
  },

  // Получение документов для секций - ИСПРАВЛЕННАЯ ВЕРСИЯ
  getDocuments: async (): Promise<Document[]> => {
    try {
      console.log('📥 Загрузка всех документов...');
      
      // Используем категорию Documents (3) для всех документов расписания
      const response = await fetch(`${BASE_URL}/admin/posts?category=${PostCategory.Documents}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 422) {
          console.log('ℹ️ Категория Documents не существует или нет документов');
          return [];
        }
        console.log(`ℹ️ Ошибка ${response.status} для категории Documents`);
        return [];
      }

      const posts = await response.json();
      console.log(`📄 Получено ${posts.length} документов`);
      
      const documents: Document[] = posts.map((post: any) => ({
        id: post.id,
        title: post.title,
        file_url: post.files && post.files.length > 0 ? post.files[0].url : '',
        file_name: post.files && post.files.length > 0 ? post.files[0].name : '',
        category: PostCategory.Documents,
        created_at: post.created_at,
        updated_at: post.updated_at
      }));

      return documents.filter(doc => doc.file_url);
    } catch (error) {
      console.error('❌ Ошибка загрузки документов:', error);
      return [];
    }
  },

  // Получение публичных документов
  getPublicDocuments: async (): Promise<Document[]> => {
    try {
      console.log('📥 Загрузка публичных документов...');
      
      const response = await fetch(`${BASE_URL}/content/posts?category=${PostCategory.Documents}`);

      if (!response.ok) {
        if (response.status === 422 || response.status === 404) {
          console.log('ℹ️ Публичная категория Documents не существует или нет документов');
          return [];
        }
        console.log(`ℹ️ Ошибка ${response.status} для публичной категории Documents`);
        return [];
      }

      const posts = await response.json();
      console.log(`📄 Получено ${posts.length} публичных документов`);
      
      const documents: Document[] = posts.map((post: any) => ({
        id: post.id,
        title: post.title,
        file_url: post.files && post.files.length > 0 ? post.files[0].url : '',
        file_name: post.files && post.files.length > 0 ? post.files[0].name : '',
        category: PostCategory.Documents,
        created_at: post.created_at,
        updated_at: post.updated_at
      }));

      return documents.filter(doc => doc.file_url);
    } catch (error) {
      console.error('❌ Ошибка загрузки публичных документов:', error);
      return [];
    }
  },

  // Получение URL для конкретного расписания
  getScheduleUrl: (name: string): string => {
    const encodedName = encodeURIComponent(name);
    return `${SCHEDULE_API_URL}/${encodedName}/schedule.html`;
  },

  // Загрузка ZIP архива с расписанием
  upload: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('updatedFile', file);

    console.log('📤 Начинаем загрузку файла расписания:', file.name);
    
    const response = await fetch(`${BASE_URL}/admin/fixedfiles/schedule`, {
      method: 'PATCH',
      headers: getAuthHeaders(true), 
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Ошибка загрузки файла расписания:", response.status, errorData);
      
      let errorMessage = `Ошибка ${response.status}: `;
      
      if (response.status === 401) {
        errorMessage += 'Не авторизован. Проверьте токен авторизации.';
      } else if (response.status === 404) {
        errorMessage += 'Эндпоинт не найден.';
      } else if (response.status === 422) {
        const validationErrors = errorData.detail || [];
        const errorMessages = validationErrors.map((err: any) => 
          `Поле "${err.loc?.join('.')}": ${err.msg}`
        ).join('; ');
        
        errorMessage += `Ошибка валидации: ${errorMessages || 'Неизвестная ошибка валидации'}`;
      } else {
        errorMessage += errorData.detail?.[0]?.msg 
                       || errorData.detail 
                       || 'Неизвестная ошибка сервера';
      }
                     
      throw new Error(errorMessage);
    }
    
    console.log('✅ Файл расписания успешно загружен');
    
    window.dispatchEvent(new CustomEvent('scheduleUpdated'));
    
    return;
  },

  // Проверка доступности API
  checkApiAvailability: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${SCHEDULE_API_URL}/items`);
      return response.ok;
    } catch (error) {
      console.error('API расписания недоступно:', error);
      return false;
    }
  },

  // Метод для принудительного обновления
  forceRefresh: (): void => {
    window.dispatchEvent(new CustomEvent('scheduleUpdated'));
  }
};