# Интеграция API

Документация по интеграции внешнего API с адресом `http://185.13.47.146:50123`

## Структура проекта

```
src/
├── api/
│   ├── config.ts       # Константы и типы данных для API
│   └── auth.ts         # Функции для авторизации
├── hooks/
│   └── useFetchNews.ts # Хук для загрузки новостей с пагинацией
├── components/
│   ├── NewsCard.tsx    # Компонент карточки новости
│   ├── NewsList.tsx    # Компонент списка новостей с пагинацией
│   └── AdminLogin.tsx  # Компонент для входа администратора
└── pages/
    └── AdminPanel.tsx  # Страница админ-панели
```

## Конфигурация API

### Файл: `/src/api/config.ts`

Содержит:
- `BASE_URL` - базовый адрес API
- `POSTS_ENDPOINT` - эндпоинт для получения новостей
- `POST_DETAIL_ENDPOINT` - функция для получения детальной информации о новости
- `POST_TAGS` - массив меток категорий новостей
- Интерфейсы `NewsPost` и `NewsDetailPost`

### Типы данных

```typescript
interface NewsPost {
  id: number;
  slug: string;
  title: string;
  snippet: string;
  date: string;
  views: number;
  author: string;
  type: number;  // Индекс в массиве POST_TAGS (0-3)
  image_url: string;
}
```

## Загрузка новостей

### Хук: `useFetchNews`

Файл: `/src/hooks/useFetchNews.ts`

Предоставляет:
- `posts` - массив загруженных новостей
- `loading` - состояние загрузки
- `offset` - текущее смещение для пагинации
- `hasMore` - есть ли еще новости для загрузки
- `loadMore(limit, offset)` - функция для загрузки следующей порции
- `error` - ошибка при загрузке (если есть)

Пример использования:

```typescript
const { posts, loading, offset, hasMore, loadMore, error } = useFetchNews();

// Загрузить еще новости
const handleLoadMore = () => {
  loadMore(9, offset);
};
```

## Компоненты

### NewsCard

Файл: `/src/components/NewsCard.tsx`

Отображает одну карточку новости со следующими элементами:
- Изображение
- Бейдж категории (автоматически определяется по `post.type`)
- Заголовок
- Краткое описание (snippet)
- Дата и автор
- Количество просмотров
- Кнопка "Читать →"

Props:
```typescript
interface NewsCardProps {
  post: NewsPost;
  onReadMore: (post: NewsPost) => void;
}
```

### NewsList

Файл: `/src/components/NewsList.tsx`

Компонент для отображения списка новостей:
- Использует хук `useFetchNews` для загрузки данных
- Отображает сетку карточек новостей (3 колонки на больших экранах)
- Предоставляет кнопку "Показать еще" для пагинации
- Открывает модальное окно с детальной информацией при клике на новость
- Обрабатывает ошибки загрузки

## Авторизация администратора

### API: `authApi`

Файл: `/src/api/auth.ts`

Функции:
- `login(credentials)` - вход с фамилией и паролем
- `testSecretEndpoint()` - проверка доступа к защищенному эндпоинту
- `getToken()` - получить токен из localStorage
- `setToken(token)` - сохранить токен
- `removeToken()` - удалить токен
- `isAuthenticated()` - проверить, авторизован ли пользователь

### Компонент: AdminLogin

Файл: `/src/components/AdminLogin.tsx`

Функциональность:
- Форма входа с полями "Фамилия" и "Пароль"
- Сохранение токена в localStorage
- Кнопка проверки доступа к секретному эндпоинту
- Кнопка выхода
- Обработка ошибок

### Страница: AdminPanel

Файл: `/src/pages/AdminPanel.tsx`

Доступна по адресу: `/admin`

## Интеграция в приложение

Компонент `NewsList` интегрирован на главную страницу (`/src/pages/Index.tsx`) и заменяет старый компонент `NewsSection`.

## Примеры запросов

### Получение списка новостей

```typescript
const url = `${BASE_URL}${POSTS_ENDPOINT}?limit=10&offset=0`;
const response = await fetch(url);
const posts: NewsPost[] = await response.json();
```

### Получение детальной информации о новости

```typescript
const url = `${BASE_URL}${POST_DETAIL_ENDPOINT(slug)}`;
const response = await fetch(url);
const detailData: NewsDetailPost = await response.json();
```

### Авторизация

```typescript
const response = await fetch(`${BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    surname: 'Иванов',
    password: 'password123',
  }),
});
const data = await response.json();
localStorage.setItem('adminToken', data.token);
```

### Защищенный запрос

```typescript
const token = localStorage.getItem('adminToken');
const response = await fetch(`${BASE_URL}/auth/super-secret`, {
  headers: {
    'X-Authorization': token,
  },
});
const secretData = await response.json();
```

## Особенности

1. **Пагинация**: Реализована через параметры `limit` и `offset` в URL
2. **Категории**: Тип новости (`type`) - числовой индекс в массиве `POST_TAGS`
3. **Токен авторизации**: Передается через заголовок `X-Authorization`
4. **Хранение токена**: Используется `localStorage` браузера
5. **Обработка ошибок**: Все запросы оборачиваются в try-catch блоки

## Маршруты

- `/` - Главная страница с новостями (использует `NewsList`)
- `/admin` - Страница авторизации администратора

## Следующие шаги

После успешной авторизации можно добавить:
- CRUD операции для новостей
- Управление пользователями
- Модерацию комментариев
- Статистику просмотров

Все защищенные запросы должны включать заголовок `X-Authorization` с токеном.
