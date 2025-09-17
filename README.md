# Больничная система управления визитами пациентов

## Технологии

### Backend (NestJS)
- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- Swagger API документация

### Frontend (React)
- React 19 + TypeScript
- Vite для сборки
- Zustand для управления состоянием
- shadcn/ui компоненты
- Tailwind CSS для стилизации
- React Router для навигации

## Функциональность

✅ **Управление пациентами:**
- Список пациентов с поиском и пагинацией
- Добавление/редактирование пациентов
- Детальная карточка пациента

✅ **Управление визитами:**
- История визитов пациента
- Создание новых визитов
- Статусы: запланирован/завершён/отменён

✅ **UI/UX:**
- Современный дизайн с shadcn/ui
- Адаптивная вёрстка
- Валидация форм
- Обработка ошибок и loading состояний

## Запуск

### Через Docker (рекомендуется)

```bash
# В корне проекта
docker compose up -d
```

Сервисы будут доступны:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Adminer (DB): http://localhost:8080

### Локальный запуск

#### Backend
```bash
cd server
pnpm install
pnpm run prisma:generate
pnpm run prisma:migrate
pnpm run start:dev
```

#### Frontend
```bash
cd client
pnpm install
pnpm dev
```

## API Endpoints

- `GET /patients` - список пациентов
- `POST /patients` - создать пациента
- `GET /patients/:id` - получить пациента
- `PATCH /patients/:id` - обновить пациента
- `GET /patients/:id/visits` - визиты пациента
- `POST /patients/:id/visits` - создать визит
- `PATCH /patients/:id/visits/:visitId` - обновить визит

## Структура проекта

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── store/         # Zustand stores
│   │   ├── api/           # API клиент
│   │   └── types.ts       # TypeScript типы
│   └── components.json    # Конфигурация shadcn/ui
├── server/                # NestJS backend
│   ├── src/
│   │   ├── patients/      # Модуль пациентов
│   │   ├── visits/        # Модуль визитов
│   │   └── prisma/        # Prisma сервис
│   └── prisma/
│       └── schema.prisma  # Схема базы данных
└── docker-compose.yml     # Docker конфигурация
```

## Разработка

### Добавление новых компонентов shadcn/ui

```bash
cd client
pnpm dlx shadcn@latest add [component-name]
```

### Миграции базы данных

```bash
cd server
pnpm run prisma:migrate dev --name [migration-name]
```

### Генерация Prisma клиента

```bash
cd server
pnpm run prisma:generate
```



 ## Prisma Studio

```bash
cd /Users/a.terekhova/Desktop/MIPT/server

 pnpm exec prisma studio
 ```