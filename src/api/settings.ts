import { BASE_URL, getAuthHeaders } from './config';

export interface Setting {
  name: string;
  value: any;
  enabled: boolean;
}

export interface OpenDaySettings {
  title: string;
  remote_dates: { date: string; time: string }[];
  in_person_dates: { date: string; time: string }[];
}

export interface ScheduleSettings {
  session_period: string;
}

export const settingsApi = {
  // Приватный метод для админки (требует авторизации)
  async getSettings(names: string[]): Promise<Setting[]> {
    try {
      if (!names || names.length === 0) {
        console.warn('⚠️ getSettings вызван без списка имен');
        return [];
      }

      // Объединяем все имена через плюс
      const namesParam = names.join('+');
      const url = `${BASE_URL}/admin/settings/?names=${namesParam}`;
      
      console.log('📥 Запрос настроек админки:', url);
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      if (response.status === 422) {
          console.error('API Error 422: Backend требует список настроек (names).');
          return [];
      }

      if (!response.ok) {
          console.error(`API Error: ${response.status} - ${response.statusText}`);
          const errorText = await response.text();
          console.error('Детали ошибки:', errorText);
          return [];
      }
      
      const data = await response.json();
      console.log('📦 Ответ сервера на /admin/settings:', data);
      
      if (Array.isArray(data) && data.length === 0) {
        console.log('⚠️ Сервер вернул пустой массив. Настройки не найдены в БД.');
        return [];
      }
      
      let items: Setting[] = [];
      
      if (Array.isArray(data)) {
        items = data;
        console.log(`✅ Сервер вернул массив из ${data.length} настроек`);
      } 
      else if (data && typeof data === 'object') {
        if (data.name !== undefined && data.value !== undefined) {
          items = [data as Setting];
          console.log('✅ Сервер вернул один объект настройки');
        } else if (data.items && Array.isArray(data.items)) {
          items = data.items;
          console.log(`✅ Настройки найдены в поле "items": ${data.items.length} элементов`);
        } else {
          Object.entries(data).forEach(([key, value]) => {
            if (value && typeof value === 'object' && 'name' in value && 'value' in value) {
              items.push(value as Setting);
            }
          });
          if (items.length > 0) {
            console.log(`✅ Найдено ${items.length} настроек в объекте`);
          }
        }
      } else {
        console.log('⚠️ Сервер вернул неожиданный формат данных:', typeof data);
      }
      
      console.log('📋 Преобразованные настройки:', items.length, 'элементов');
      return items;
    } catch (error) {
      console.error('❌ Ошибка загрузки настроек (приватный):', error);
      return [];
    }
  },

  // Публичный метод для страниц (не требует авторизации)
  async getPublicSettings(names?: string[]): Promise<Setting[]> {
    try {
      if (!names || names.length === 0) {
        return [];
      }

      const namesParam = names.join('+');
      const url = `${BASE_URL}/settings/?names=${namesParam}`;
      
      console.log('📥 Публичный запрос настроек:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('❌ Ошибка публичного API:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      console.log('📦 Ответ сервера на /settings:', data);
      
      let items: Setting[] = [];
      
      if (Array.isArray(data)) {
        items = data;
      } 
      else if (data && typeof data === 'object') {
        if (data.name !== undefined && data.value !== undefined) {
          items = [data as Setting];
        } 
        else if (data.items && Array.isArray(data.items)) {
          items = data.items;
        }
        else {
          Object.entries(data).forEach(([key, value]) => {
            if (value && typeof value === 'object' && 'name' in value && 'value' in value) {
              items.push(value as Setting);
            }
          });
        }
      }

      return items;
    } catch (error) {
      console.error('❌ Ошибка загрузки публичных настроек:', error);
      return [];
    }
  },

  async updateSettings(settings: Setting[]): Promise<void> {
    try {
      const payload = Array.isArray(settings) ? settings : [settings];
      
      console.log('📤 Отправка настроек на сервер:', payload.length, 'настроек');
      
      const url = `${BASE_URL}/admin/settings/`;
      console.log('📤 URL:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        console.error('❌ Ошибка сохранения настроек:', response.status, errorText);
        throw new Error(`Не удалось сохранить настройки: ${response.status} ${errorText}`);
      }
      
      console.log('✅ Настройки успешно сохранены');
    } catch (error) {
      console.error('❌ Ошибка при обновлении настроек:', error);
      throw error;
    }
  },

  async getOpenDaySettings(): Promise<OpenDaySettings | null> {
     const settings = await this.getSettings(['open_day']);
     const item = settings.find(s => s.name === 'open_day');
     return item ? item.value : null;
  },

  async getPublicOpenDaySettings(): Promise<OpenDaySettings | null> {
     const settings = await this.getPublicSettings(['open_day']);
     const item = settings.find(s => s.name === 'open_day');
     return item ? item.value : null;
  },

  async updateOpenDaySettings(value: OpenDaySettings) {
      await this.updateSettings([{ name: 'open_day', value, enabled: true }]);
  },

  async getScheduleSettings(): Promise<ScheduleSettings | null> {
     const settings = await this.getSettings(['schedule']);
     const item = settings.find(s => s.name === 'schedule');
     return item ? item.value : null;
  },

  async getPublicScheduleSettings(): Promise<ScheduleSettings | null> {
     const settings = await this.getPublicSettings(['schedule']);
     const item = settings.find(s => s.name === 'schedule');
     return item ? item.value : null;
  },

  async updateScheduleSettings(value: ScheduleSettings) {
      await this.updateSettings([{ name: 'schedule', value, enabled: true }]);
  },

  // Приватный метод для админки
  async getPageSettings(pageName: string): Promise<any | null> {
    const settings = await this.getSettings([pageName]);
    console.log(`🔍 Поиск настройки "${pageName}" в:`, settings);
    const item = settings.find(s => s.name === pageName);
    return item ? item.value : null;
  },

  // Публичный метод для страниц
  async getPublicPageSettings(pageName: string): Promise<any | null> {
    const settings = await this.getPublicSettings([pageName]);
    console.log(`🔍 Публичный поиск настройки "${pageName}" в:`, settings);
    const item = settings.find(s => s.name === pageName);
    return item ? item.value : null;
  },

  async savePageSettings(pageName: string, value: any): Promise<void> {
    console.log(`💾 Сохранение настройки "${pageName}":`, value);
    await this.updateSettings([{ name: pageName, value, enabled: true }]);
  },

  // УНИВЕРСАЛЬНЫЙ МЕТОД ДЛЯ СТРАНИЦ - использует публичный API
  async getPageData(pageName: string): Promise<any | null> {
    try {
      const settings = await this.getPublicSettings([pageName]);
      const item = settings.find(s => s.name === pageName);
      return item ? item.value : null;
    } catch (error) {
      console.error(`❌ Ошибка загрузки данных для страницы ${pageName}:`, error);
      return null;
    }
  },

  // Тестовый метод для проверки API
  async testApi(): Promise<any> {
    try {
      console.log('🧪 Тестовый запрос к API...');
      const url = `${BASE_URL}/admin/settings/?names=test`;
      console.log('🧪 URL:', url);
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
      console.log('🧪 Тестовый ответ:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🧪 Тестовые данные:', data);
        return data;
      } else {
        console.error('🧪 Тестовый запрос не удался:', response.status);
        return null;
      }
    } catch (error) {
      console.error('🧪 Ошибка тестового запроса:', error);
      return null;
    }
  }
};