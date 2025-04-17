# Тестовое задание test-distant.global-api

Тестовое задание с использованием Node.js, Express и MongoDB.

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` и добавьте необходимые переменные окружения:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/news-api
JWT_SECRET=secret
```

## Запуск

Для разработки:

```bash
npm run dev
```

Для продакшена:

```bash
npm start
```

## API Endpoints

### Аутентификация

- POST /api/auth/register - Регистрация
- POST /api/auth/login - Вход

### Новости

- POST /api/news - Создание новости
- PATCH /api/news/:id - Редактирование новости
- DELETE /api/news/:id - Удаление новости
- POST /api/news/:id/publish - Публикация новости
