# Fullstack Provider Management System

Enterprise provider management application built with **NestJS**,
**React** and **PostgreSQL**.

## Features

-   JWT Authentication
-   Role-Based Authorization (ADMIN / EXECUTIVE)
-   Provider CRUD
-   CQRS Pattern
-   Strategy Pattern
-   Swagger Documentation
-   Dockerized PostgreSQL

------------------------------------------------------------------------

## Tech Stack

### Backend

-   NestJS
-   TypeORM
-   PostgreSQL
-   Docker
-   Passport JWT
-   Swagger

### Frontend

-   React
-   TypeScript
-   React Router
-   Axios
-   React Hook Form

------------------------------------------------------------------------

## Getting Started

### Requirements

-   Node.js 22+
-   Docker Desktop
-   npm

### Start Database

``` bash
docker compose up -d
```

### Backend

``` bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

------------------------------------------------------------------------

## Demo Users

### Administrator

``` text
Email: admin@example.com
Password: Admin123!
```

### Executive

``` text
Email: executive@example.com
Password: Executive123!
```

------------------------------------------------------------------------

## API Documentation

Swagger:

``` text
http://localhost:3001/api/docs
```

------------------------------------------------------------------------

## Project Structure

``` text
backend/
frontend/
docker-compose.yml
```

------------------------------------------------------------------------

## Architecture

``` text
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

------------------------------------------------------------------------

## Design Patterns

-   CQRS
-   Strategy Pattern
-   Repository Pattern
-   Dependency Injection
-   DTO Pattern

------------------------------------------------------------------------

## Future Improvements

-   Unit Tests
-   Refresh Tokens
-   Pagination
-   Soft Delete
-   Audit Logs
-   CI/CD
