# Hospital Management API

A NestJS backend API with Prisma and PostgreSQL for managing patients and visits.

## Features

- ✅ Complete CRUD operations for Patients and Visits
- ✅ Class-validator validation for all DTOs
- ✅ Prisma ORM with PostgreSQL
- ✅ Docker Compose setup with database
- ✅ Patient search functionality
- ✅ Visit filtering by date range and status
- ✅ Pagination support for all endpoints
- ✅ Proper error handling and validation

## Quick Start

1. **Start the application with Docker:**
   ```bash
   docker-compose up --build
   ```

2. **The API will be available at:**
   - Backend: http://localhost:3000/api
   - Database Admin (Adminer): http://localhost:8080

3. **Database connection info for Adminer:**
   - System: PostgreSQL
   - Server: postgres
   - Username: hospital_user
   - Password: hospital_password
   - Database: hospital_db

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

## Data Models

### Patient
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  visits?: Visit[];
}
```

### Visit
```typescript
{
  id: string;
  patientId: string;
  visitDate: Date;
  diagnosis: string;
  treatment: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  patient?: Patient;
}
```

## Development

### Local Development (without Docker)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start PostgreSQL database:
   ```bash
   docker-compose up postgres
   ```

3. Run Prisma migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

### Database Operations

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Reset database (⚠️ destroys all data)
npm run prisma:reset

# Deploy migrations to production
npm run prisma:deploy
```

## Testing

Test the API endpoints using curl or any API client:

```bash
# Create a patient
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+1234567890",
    "email": "john.doe@example.com"
  }'

# Create a visit
curl -X POST http://localhost:3000/api/visits \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-id-here",
    "visitDate": "2024-01-15T10:00:00Z",
    "diagnosis": "Regular checkup",
    "treatment": "Routine examination",
    "status": "SCHEDULED"
  }'
```

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```env
DATABASE_URL="postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"
NODE_ENV="development"
PORT=3000
CORS_ORIGIN="*"
```
