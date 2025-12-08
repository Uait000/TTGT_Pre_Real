// src/api/payment-receipts.ts
import { BASE_URL } from './config';
import { getAuthHeaders } from './auth';
import { filesApi } from './files';
import { PostCategory } from './posts';
import type { PaymentReceipt, FileInfo } from '@/types/payment-receipts';

export interface CreatePaymentReceiptPayload {
  title: string;
  icon: string;
  gradient: string;
  is_published: boolean;
  files?: string[];
  publish_date?: number;
  file_url?: string; // Добавляем поддержку внешних ссылок
}

const transformPostToReceipt = (post: any): PaymentReceipt => {
  let receiptData = {
    icon: 'Banknote',
    gradient: 'from-blue-500 to-indigo-600',
    use_external_link: false,
    external_link: ''
  };

  try {
    if (post.body) {
      const bodyData = JSON.parse(post.body);
      receiptData = { ...receiptData, ...bodyData };
    }
  } catch (e) {
    console.warn('Не удалось разобрать body поста для квитанции:', e);
  }

  // Определяем file_url: если есть внешняя ссылка, используем её, иначе файл
  const file_url = receiptData.use_external_link 
    ? receiptData.external_link 
    : (post.files && post.files.length > 0 ? post.files[0].url : '');

  // Определяем file_name
  const file_name = receiptData.use_external_link 
    ? 'Внешняя ссылка'
    : (post.files && post.files.length > 0 ? post.files[0].name : '');

  return {
    id: post.id,
    title: post.title,
    file_url: file_url,
    file_name: file_name,
    icon: receiptData.icon,
    gradient: receiptData.gradient,
    is_published: post.status === 1,
    created_at: post.created_at || new Date().toISOString(),
    updated_at: post.updated_at || new Date().toISOString(),
    files: post.files || [],
    publish_date: post.publish_date
  };
};

export const paymentReceiptsApi = {
  async getAll(): Promise<PaymentReceipt[]> {
    try {
      const response = await fetch(`${BASE_URL}/admin/posts?category=${PostCategory.PaymentReceipts}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Не удалось загрузить квитанции. Статус: ${response.status}`);
      }
      
      const posts = await response.json();
      return posts.map((post: any) => transformPostToReceipt(post));
    } catch (error) {
      console.error('Ошибка загрузки квитанций:', error);
      return [];
    }
  },

  async getById(id: number): Promise<PaymentReceipt> {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить квитанцию');
    }
    
    const post = await response.json();
    return transformPostToReceipt(post);
  },

  async create(payload: CreatePaymentReceiptPayload, file?: File): Promise<PaymentReceipt> {
    let uploadedFileIds: string[] = [];

    // Определяем, используем ли мы внешнюю ссылку
    const useExternalLink = !!payload.file_url && !file;

    if (file && !useExternalLink) {
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
        icon: payload.icon,
        gradient: payload.gradient,
        receipt_type: 'payment_receipt',
        use_external_link: useExternalLink,
        external_link: useExternalLink ? payload.file_url : ''
      }),
      author: "Администрация",
      type: 0,
      category: PostCategory.PaymentReceipts,
      status: payload.is_published ? 1 : 0,
      publish_date: payload.publish_date || Math.floor(Date.now() / 1000),
      files: useExternalLink ? [] : uploadedFileIds // Если внешняя ссылка - не передаем files
    };

    console.log('📤 Создание квитанции - отправляемые данные:', JSON.stringify(postPayload, null, 2));

    const response = await fetch(`${BASE_URL}/admin/posts`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({ detail: 'Не удалось создать квитанцию' }));
      
      if (response.status === 409) {
        throw new Error('Квитанция с таким названием уже существует. Пожалуйста, измените название.');
      }
      
      if (response.status === 422) {
        console.error('❌ Ошибка валидации при создании:', errorDetails);
        const errorMsg = errorDetails.detail?.[0]?.msg || 'Ошибка валидации данных';
        const errorLoc = errorDetails.detail?.[0]?.loc?.join('.') || 'неизвестное поле';
        throw new Error(`Ошибка валидации: ${errorMsg} в поле "${errorLoc}"`);
      }
      
      const errorMessage = typeof errorDetails.detail === 'string' ? errorDetails.detail : 'Ошибка создания квитанции.';
      throw new Error(errorMessage);
    }
    
    const post = await response.json();
    return transformPostToReceipt(post);
  },

  async update(id: number, payload: Partial<CreatePaymentReceiptPayload>, file?: File): Promise<PaymentReceipt> {
    let currentReceipt;
    try {
      const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const post = await response.json();
        currentReceipt = transformPostToReceipt(post);
      }
    } catch (error) {
      console.error('Не удалось получить текущую квитанцию:', error);
    }

    let existingFileIds: string[] = payload.files || [];
    let newUploadedFileIds: string[] = [];

    // Определяем, используем ли мы внешнюю ссылку
    const useExternalLink = !!payload.file_url && !file;

    if (file && !useExternalLink) {
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

    const allFileIds = useExternalLink ? [] : [...existingFileIds, ...newUploadedFileIds];

    const postPayload: Record<string, any> = {
      title: payload.title !== undefined ? payload.title : currentReceipt?.title,
      body: JSON.stringify({
        icon: payload.icon !== undefined ? payload.icon : currentReceipt?.icon,
        gradient: payload.gradient !== undefined ? payload.gradient : currentReceipt?.gradient,
        receipt_type: 'payment_receipt',
        use_external_link: useExternalLink,
        external_link: useExternalLink ? payload.file_url : (currentReceipt?.external_link || '')
      }),
      type: 0,
      category: PostCategory.PaymentReceipts,
      status: payload.is_published !== undefined ? (payload.is_published ? 1 : 0) : (currentReceipt?.is_published ? 1 : 0),
      publish_date: payload.publish_date !== undefined ? payload.publish_date : currentReceipt?.publish_date,
      author: "Администрация"
    };

    // Добавляем files только если не используем внешнюю ссылку и есть файлы
    if (!useExternalLink && allFileIds.length > 0) {
      postPayload.files = allFileIds;
    }

    console.log('🔄 Обновление квитанции ID:', id);
    console.log('📤 Отправляемые данные:', JSON.stringify(postPayload, null, 2));
    console.log('🔧 use_external_link:', useExternalLink);
    console.log('🔗 external_link:', useExternalLink ? payload.file_url : 'не используется');

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
        throw new Error('Квитанция с таким названием уже существует.');
      }

      throw new Error(typeof errorDetails.detail === 'string' ? errorDetails.detail : `Ошибка обновления квитанции (${status}).`);
    }
    
    const post = await response.json();
    console.log('✅ Квитанция успешно обновлена:', post);
    return transformPostToReceipt(post);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Не удалось удалить квитанцию' }));
      throw new Error(error.message || 'Не удалось удалить квитанцию');
    }
  },

  // Метод для получения только опубликованных квитанций (для публичной страницы)
  async getPublicAll(): Promise<PaymentReceipt[]> {
    try {
      // Сначала пробуем получить через публичный маршрут
      const response = await fetch(`${BASE_URL}/content/posts?category=${PostCategory.PaymentReceipts}`);

      if (response.ok) {
        const posts = await response.json();
        const receipts = posts.map((post: any) => transformPostToReceipt(post));
        // Фильтруем только опубликованные
        return receipts.filter(receipt => receipt.is_published);
      }

      // Если публичный маршрут не работает, используем админский (только для опубликованных)
      const adminResponse = await fetch(`${BASE_URL}/admin/posts?category=${PostCategory.PaymentReceipts}`, {
        headers: getAuthHeaders()
      });

      if (!adminResponse.ok) {
        return [];
      }
      
      const adminPosts = await adminResponse.json();
      // Фильтруем только опубликованные квитанции
      const publishedPosts = adminPosts.filter((post: any) => post.status === 1);
      return publishedPosts.map((post: any) => transformPostToReceipt(post));
      
    } catch (error) {
      console.error('Ошибка загрузки публичных квитанций:', error);
      return [];
    }
  },

  // Вспомогательный метод для проверки существования квитанции
  async exists(title: string): Promise<boolean> {
    try {
      const receipts = await this.getAll();
      return receipts.some(receipt => receipt.title.toLowerCase() === title.toLowerCase());
    } catch (error) {
      console.error('Ошибка проверки существования квитанции:', error);
      return false;
    }
  },

  // Вспомогательный метод для получения квитанции по названию
  async getByTitle(title: string): Promise<PaymentReceipt | null> {
    try {
      const receipts = await this.getAll();
      return receipts.find(receipt => receipt.title.toLowerCase() === title.toLowerCase()) || null;
    } catch (error) {
      console.error('Ошибка поиска квитанции по названию:', error);
      return null;
    }
  },

  transformPostToReceipt
};