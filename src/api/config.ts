const getBaseUrl = () => {
  return '';
};

export const BASE_URL = getBaseUrl();
export const ADMIN_API_PREFIX = '/admin';

export const SETTINGS_ENDPOINT = `${ADMIN_API_PREFIX}/settings`; // /admin/settings
export const POSTS_ENDPOINT = `${ADMIN_API_PREFIX}/posts/`;
export const VACANCIES_ENDPOINT = `${ADMIN_API_PREFIX}/vacancies`;
export const ZAMENA_ENDPOINT = `${ADMIN_API_PREFIX}/zamena`;

// 2. Публичные (для посетителей)
export const PUBLIC_POSTS_ENDPOINT = '/content/posts/';
export const PUBLIC_SETTINGS_ENDPOINT = '/admin/settings'; 




export interface NewsPost {
  id: number;
  title: string;
}

export interface Vacancy {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  conditions?: string;
  contact_info?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TickerSettings {
  text: string;
  date: string;
  time: string;
  format: "очный" | "заочный";
  is_enabled: boolean;
  link?: string;
  link_text?: string;
}

export interface SettingsResponse {
  ticker?: {
    value: TickerSettings;
    enabled: boolean;
  };
}

export interface SettingItem {
  name: string;
  value: any;
  enabled: boolean;
}


export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('adminToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    headers['x-authorization'] = cleanToken;
  }
  
  return headers;
};

export const getAuthHeadersWithBearer = (): HeadersInit => {
  const token = localStorage.getItem('adminToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    headers['x-authorization'] = `Bearer ${cleanToken}`;
  }
  return headers;
};

export const validateToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;

  try {
    const response = await fetch(`${BASE_URL}/admin/posts/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch (error) {
    console.error('Token error:', error);
    return false;
  }
};