export const BASE_URL = 'http://185.13.47.146:50123';
export const ADMIN_API_PREFIX = '/admin';
export const POSTS_ENDPOINT = `${ADMIN_API_PREFIX}/content/posts/`; 
export const VACANCIES_ENDPOINT = `${ADMIN_API_PREFIX}/vacancies`;
export const ZAMENA_ENDPOINT = `${ADMIN_API_PREFIX}/zamena`;
export interface NewsPost {
  id: number;
  title: string;
}
export interface Vacancy {
  id: number;
  title: string;
}