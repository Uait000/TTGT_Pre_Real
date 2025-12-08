
import { BASE_URL, getAuthHeaders, PUBLIC_SETTINGS_ENDPOINT } from './config';

const STORAGE_KEY = 'ticker_settings';


const getDefaultSettings = () => {
  return {
    text: "День открытых дверей",
    date: "15 ноября 2025 (СУББОТА)",
    time: "В 10:00",
    format: "очный" as const,
    is_enabled: false,
    link: "", // Новое поле
    link_text: "", // Новое поле
    last_updated: new Date().toISOString()
  };
};


export const fetchTickerSettings = async () => {
  console.log('🔄 Fetching ticker settings...');
  

  try {
    const url = `${BASE_URL}/admin/settings?names=ticker`;
    console.log('📡 Fetching from:', url);
    
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    console.log('📡 API Response status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Got settings from API:', data);

      if (Array.isArray(data)) {

        const tickerSetting = data.find((item: any) => item.name === 'ticker');
        if (tickerSetting) {
          const settings = {
            ...tickerSetting.value,
            is_enabled: tickerSetting.enabled, 
            source: 'api'
          };
          

          localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
          return settings;
        }
      } else if (data.ticker) {

        const settings = {
          ...data.ticker.value,
          is_enabled: data.ticker.enabled, 
          source: 'api'
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        return settings;
      }
    } else {
      console.log(`❌ API returned ${res.status}, using fallback`);
      
      // Пробуем получить текст ошибки для диагностики
      try {
        const errorData = await res.text();
        console.log('❌ API error response:', errorData);
      } catch (e) {
        console.log('❌ Could not read error response');
      }
      
      // Если 401 или 422 - очищаем невалидный токен
      if (res.status === 401 || res.status === 422) {
        localStorage.removeItem('adminToken');
        console.log('🔐 Removed invalid token due to', res.status);
      }
    }
  } catch (error) {
    console.log('❌ API request failed:', error);
  }
  

  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    try {
      const settings = JSON.parse(localData);
      console.log('📦 Using settings from localStorage');
      
      // Проверяем что данные валидны
      if (settings && typeof settings === 'object' && 'text' in settings) {
        return { ...settings, source: 'local' };
      } else {
        console.log('❌ Invalid data in localStorage, clearing');
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.log('❌ Error parsing localStorage data:', e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  
  console.log('📭 No valid settings found, returning default disabled state');
  return { ...getDefaultSettings(), source: 'default' };
};

export const saveTickerSettings = async (data: any) => {
  console.log('💾 Saving ticker settings...');
  
  // Валидация данных
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format');
  }
  
  if (!data.text || data.text.trim() === '') {
    throw new Error('Текст не может быть пустым');
  }
  
  // Подготавливаем данные для сохранения
  const settingsToSave = {
    text: data.text.trim(),
    date: data.date?.trim() || '',
    time: data.time?.trim() || '',
    format: data.format || 'очный',
    is_enabled: Boolean(data.is_enabled),
    link: data.link?.trim() || '', // Сохраняем ссылку
    link_text: data.link_text?.trim() || '', // Сохраняем текст ссылки
    last_updated: new Date().toISOString()
  };
  
  // Всегда сохраняем в localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
  console.log('✅ Saved to localStorage:', settingsToSave);
  
  // Пробуем сохранить на сервер
  try {
    const url = `${BASE_URL}/admin/settings`;
    console.log('📤 Sending to API:', url);
    
    // ПРАВИЛЬНАЯ структура для API
    const settingsData = [{
      name: "ticker",
      value: settingsToSave,
      enabled: settingsToSave.is_enabled
    }];
    
    console.log('📤 Sending data:', JSON.stringify(settingsData, null, 2));
    
    const res = await fetch(url, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(settingsData),
    });
    
    console.log('📡 Save API Response status:', res.status);
    
    if (res.ok) {
      console.log('✅ Successfully saved to API');
      
      if (res.status === 204) {
        return { 
          success: true, 
          fallback: false, 
          message: 'Сохранено на сервер и доступно всем посетителям',
          status: 204,
          data: settingsToSave
        };
      } else {
        try {
          const result = await res.json();
          return { 
            ...result, 
            fallback: false, 
            message: 'Сохранено на сервер и доступно всем посетителям',
            status: res.status,
            data: settingsToSave
          };
        } catch (jsonError) {
          return { 
            success: true, 
            fallback: false, 
            message: 'Сохранено на сервер и доступно всем посетителям',
            status: res.status,
            data: settingsToSave
          };
        }
      }
    } else {
      console.log(`❌ API save failed with ${res.status}`);
      
      try {
        const errorText = await res.text();
        console.log('❌ API error details:', errorText);
      } catch (e) {
        console.log('❌ Could not read error details');
      }
      
      // Если 401 или 422 - очищаем токен
      if (res.status === 401 || res.status === 422) {
        localStorage.removeItem('adminToken');
        console.log('🔐 Removed invalid token during save');
      }
      
      return { 
        success: true, 
        fallback: true, 
        message: `Сохранено локально (ошибка сервера: ${res.status})`,
        status: res.status,
        data: settingsToSave
      };
    }
  } catch (error) {
    console.log('❌ API save failed:', error);
    return { 
      success: true, 
      fallback: true, 
      message: 'Сохранено локально (ошибка сети)',
      status: 0,
      data: settingsToSave
    };
  }
};

// Функция для публичного доступа (без авторизации)
export const fetchPublicTickerSettings = async () => {
  console.log('🌐 Fetching public ticker settings...');
  
  // Сначала пробуем получить с публичного API
  try {
    // Используем константу PUBLIC_SETTINGS_ENDPOINT для правильного пути
    const url = `${PUBLIC_SETTINGS_ENDPOINT}?names=ticker`;
    console.log('📡 Fetching from public API:', url);
    
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📡 Public API Response status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Got public settings from API:', data);
      
      // Обрабатываем разные структуры ответа API
      let tickerData = null;
      
      // Вариант 1: API возвращает массив настроек
      if (Array.isArray(data)) {
        const tickerSetting = data.find((item: any) => item.name === 'ticker');
        if (tickerSetting) {
          tickerData = {
            ...tickerSetting.value,
            is_enabled: tickerSetting.enabled,
            source: 'api'
          };
        }
      } 
      // Вариант 2: API возвращает объект с ключом ticker
      else if (data.ticker) {
        tickerData = {
          ...data.ticker.value,
          is_enabled: data.ticker.enabled,
          source: 'api'
        };
      }
      
      if (tickerData) {
        console.log('✅ Using ticker settings from public API:', {
          is_enabled: tickerData.is_enabled,
          text: tickerData.text,
          source: tickerData.source
        });
        
        // ВАЖНО: Проверяем is_enabled перед возвратом данных
        if (tickerData.is_enabled && tickerData.text && tickerData.text.trim()) {
          return tickerData;
        } else {
          console.log('🚫 Ticker disabled on server:', {
            is_enabled: tickerData.is_enabled,
            hasText: !!tickerData.text
          });
          return null;
        }
      }
      
      console.log('📭 No ticker found in public API response');
    } else {
      console.log(`❌ Public API returned ${res.status}`);
    }
  } catch (error) {
    console.log('❌ Public API request failed:', error);
  }
  
  // Fallback to localStorage for public access (только для разработки)
  if (import.meta.env.MODE === 'development') {
    console.log('🔧 Development mode: checking localStorage fallback');
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      try {
        const settings = JSON.parse(localData);
        
        if (settings && settings.is_enabled && settings.text && settings.text.trim()) {
          console.log('📦 Using public settings from localStorage (development only):', {
            is_enabled: settings.is_enabled,
            text: settings.text
          });
          return {
            ...settings,
            source: 'local'
          };
        } else {
          console.log('🚫 Ticker disabled in localStorage:', {
            is_enabled: settings?.is_enabled,
            hasText: !!settings?.text
          });
        }
      } catch (e) {
        console.log('❌ Error parsing localStorage data:', e);
      }
    }
  }
  
  console.log('🚫 No active ticker settings found');
  return null;
};

// Функция для проверки доступности API
export const checkApiHealth = async (): Promise<{ healthy: boolean; status: number; message: string }> => {
  try {
    const url = `${PUBLIC_SETTINGS_ENDPOINT}?names=ticker`;
    console.log('🏥 Checking API health:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      
      let hasTickerData = false;
      
      if (Array.isArray(data)) {
        hasTickerData = data.some((item: any) => item.name === 'ticker');
      } else if (data.ticker) {
        hasTickerData = true;
      } else if (data.text) {
        hasTickerData = true;
      }
      
      if (hasTickerData) {
        return { healthy: true, status: res.status, message: 'API доступен и возвращает данные' };
      } else {
        return { healthy: true, status: res.status, message: 'API доступен, но данных о тикере нет' };
      }
    } else {
      return { 
        healthy: false, 
        status: res.status, 
        message: `API недоступен: ${res.status}` 
      };
    }
  } catch (error) {
    console.log('🏥 API health check error:', error);
    const message = error instanceof Error 
      ? (error.name === 'AbortError' ? 'Таймаут запроса (5 секунд)' : error.message)
      : 'Ошибка сети';
    
    return { 
      healthy: false, 
      status: 0, 
      message 
    };
  }
};

// Вспомогательная функция для очистки настроек
export const clearTickerSettings = () => {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ Ticker settings cleared from localStorage');
};

// Функция для принудительной синхронизации с сервером
export const forceSyncWithServer = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (!localData) {
      return { success: false, message: 'Нет локальных данных для синхронизации' };
    }

    const settings = JSON.parse(localData);
    const result = await saveTickerSettings(settings);
    
    if (result.fallback) {
      return { success: false, message: 'Не удалось синхронизировать с сервером' };
    } else {
      return { success: true, message: 'Данные успешно синхронизированы с сервером' };
    }
  } catch (error) {
    return { success: false, message: `Ошибка синхронизации: ${error}` };
  }
};