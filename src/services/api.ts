const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
});

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'education' | 'achievements' | 'news' | 'events';
  author: string;
  images: string[];
  views: number;
  likes: number;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  news_id: string;
  author_name: string;
  author_email?: string;
  content: string;
  approved: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location?: string;
  start_date: string;
  end_date?: string;
  image_url?: string;
  registration_link?: string;
  created_at: string;
}

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements?: string;
  salary_range?: string;
  contact_info?: string;
  active: boolean;
  created_at: string;
}

export interface CitizenAppeal {
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const newsApi = {
  async getAll(params?: { category?: string; limit?: number; offset?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(
      `${API_BASE_URL}/news-api?${queryParams}`,
      { headers: getHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  },

  async getBySlug(slug: string) {
    const response = await fetch(
      `${API_BASE_URL}/news-api/${slug}`,
      { headers: getHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  },

  async like(newsId: string) {
    const response = await fetch(
      `${API_BASE_URL}/news-api/${newsId}/like`,
      {
        method: 'POST',
        headers: getHeaders(),
      }
    );

    if (!response.ok) throw new Error('Failed to like news');
    return response.json();
  },
};

export const appealsApi = {
  async create(appeal: CitizenAppeal) {
    const response = await fetch(
      `${API_BASE_URL}/appeals-api`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(appeal),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit appeal');
    }
    return response.json();
  },
};

export const contentApi = {
  async getVacancies() {
    const response = await fetch(
      `${API_BASE_URL}/content-api?resource=vacancies`,
      { headers: getHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch vacancies');
    return response.json();
  },

  async getEvents() {
    const response = await fetch(
      `${API_BASE_URL}/content-api?resource=events`,
      { headers: getHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  async getComments(newsId: string) {
    const response = await fetch(
      `${API_BASE_URL}/content-api?resource=comments&news_id=${newsId}`,
      { headers: getHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  async createComment(comment: {
    news_id: string;
    author_name: string;
    author_email?: string;
    content: string;
  }) {
    const response = await fetch(
      `${API_BASE_URL}/content-api?resource=comments`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(comment),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit comment');
    }
    return response.json();
  },
};
