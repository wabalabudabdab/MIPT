# Больничная система управления визитами пациентов

## Технологии

### Backend (NestJS)
- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- Swagger API

### Frontend (React)
- React 19 + TypeScript
- Vite 
- Zustand 
- shadcn/ui компоненты
- Tailwind CSS 
- React Router 

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
# В корне проекта MIPT
docker compose up -d
```

```bash
docker compose down && docker compose up -d
```

Сервисы будут доступны:
- Frontend: http://localhost:5173 
- Backend API: http://localhost:3000
- Swagger http://localhost:3000/api/docs

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

### Загрузка тестовых данных

```bash
cd server
pnpm run prisma:seed
```

Это создаст:
- **4000 пациентов** 
- **~22000 визитов** (каждый пациент имеет от 0 до 11 визитов)
- Медицинские диагнозы и лечения
- Разные статусы визитов (запланированные, завершённые, отменённые)


## API Endpoints

### Patients
- `GET /api/patients` - Get all patients with pagination
- `GET /api/patients/:id` - Get patient by ID with visits
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search?q=query` - Search patients
- `GET /api/patients/:id/visits` - Get patient's visits

### Visits
- `GET /api/visits` - Get all visits with filtering
- `GET /api/visits/:id` - Get visit by ID
- `POST /api/visits` - Create new visit
- `PUT /api/visits/:id` - Update visit
- `DELETE /api/visits/:id` - Delete visit
- `GET /api/visits/by-status/:status` - Filter by status
- `GET /api/visits/by-date-range?startDate=&endDate=` - Filter by date

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Visit status (SCHEDULED, COMPLETED, CANCELLED)
- `startDate` - Filter visits from this date
- `endDate` - Filter visits to this date


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
cd server
pnpm exec prisma studio
 ```
