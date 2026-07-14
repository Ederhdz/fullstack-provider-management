# Fullstack Provider Management System

Enterprise provider management application built with **NestJS**, **React**, **TypeScript** and **PostgreSQL**.

## Features

- JWT authentication
- Role-based authorization (`ADMIN` / `EXECUTIVE`)
- Provider CRUD
- CQRS pattern
- Strategy pattern
- Swagger documentation
- Dockerized PostgreSQL
- Protected frontend routes
- Search, filters and dark mode

## Tech Stack

### Backend

- NestJS
- TypeORM
- PostgreSQL
- Passport JWT
- Swagger
- Docker

### Frontend

- React
- TypeScript
- React Router
- Axios
- React Hook Form

## Getting Started

### Requirements

- Node.js 22+
- npm
- Docker Desktop

### 1. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Verify the database container is running:

```bash
docker compose ps
```

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Create the local environment file.

#### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

#### Windows CMD

```cmd
copy .env.example .env
```

#### Linux or macOS

```bash
cp .env.example .env
```

If the seed command reports that `ts-node` or `tsconfig-paths` is missing, install them:

```bash
npm install -D ts-node tsconfig-paths
```

Create the demo users and sample data:

```bash
npm run seed
```

The seed can be executed multiple times without duplicating records.

Start the backend:

```bash
npm run start:dev
```

Backend:

```text
http://localhost:3001
```

Swagger documentation:

```text
http://localhost:3001/api/docs
```

### 3. Start the frontend

Open another terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Demo Users

### Administrator

```text
Email: admin@example.com
Password: Admin123!
```

### Executive

```text
Email: executive@example.com
Password: Executive123!
```

## Roles

### Administrator

- Create providers
- Edit providers
- Delete providers
- Change provider status
- View providers

### Executive

- View providers only

## Architecture

```text
React
  │
Axios
  │
NestJS
  │
CQRS
  │
TypeORM
  │
PostgreSQL
```

## Design Patterns

- CQRS
- Strategy Pattern
- Repository Pattern
- Dependency Injection
- DTO Pattern

## Project Structure

```text
backend/
frontend/
compose.yaml
README.md
```

## Future Improvements

- Unit and integration tests
- Refresh tokens
- Pagination
- Soft delete
- Audit logs
- CI/CD
