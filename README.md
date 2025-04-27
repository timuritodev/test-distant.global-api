#test-distant.global-api

Веб-приложение для создания и управления новостными статьями с поддержкой Markdown, загрузкой изображений и файлов, а также системой уведомлений в реальном времени.

## Функциональность

- Аутентификация и авторизация пользователей
- Создание и редактирование статей с поддержкой Markdown
- Загрузка изображений и файлов
- Отложенная публикация статей
- Система уведомлений в реальном времени

## Технологии

### Frontend

- React + TypeScript
- React Router для навигации
- Socket.IO для WebSocket соединений
- SCSS для стилей
- React Markdown для рендеринга Markdown

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT для аутентификации
- Socket.IO для WebSocket сервера
- Multer для загрузки файлов

## Установка и запуск

### Предварительные требования

- Node.js (v14 или выше)
- MongoDB
- npm или yarn

### Backend

1. Перейдите в директорию backend:

```bash
cd backend
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл .env в корне backend директории:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/posts
JWT_SECRET=your-secret-key
```

4. Запустите сервер:

```bash
npm start
```

### Frontend

1. Перейдите в директорию frontend:

```bash
cd frontend
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите приложение:

```bash
npm run dev
```

## Структура проекта

### Frontend

```
src/
├── api/           # API клиент
├── components/    # React компоненты
├── context/       # React контексты
├── pages/         # Страницы приложения
├── styles/        # Стили
└── types/         # TypeScript типы
```

### Backend

```
backend/
├── config/        # Конфигурация
├── controllers/   # Контроллеры
├── middleware/    # Middleware
├── models/        # Mongoose модели
├── routes/        # API маршруты
├── services/      # Сервисы
└── uploads/       # Загруженные файлы
```

## API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход

### Новости

- `GET /api/posts` - Получение списка новостей
- `GET /api/posts/:id` - Получение новости по ID
- `POST /api/posts` - Создание новости
- `PUT /api/posts/:id` - Редактирование новости
- `DELETE /api/posts/:id` - Удаление новости
