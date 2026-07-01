# Market Price Tracker

A full-stack web application for tracking market prices over time.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React + Vite + Tailwind CSS         |
| Backend    | ASP.NET Core Web API (.NET 10)      |
| Database   | PostgreSQL (Neon)                   |
| Deployment | Render                              |

## Project Structure

```
Market price/
├── backend/
│   ├── MarketPriceTracker.slnx
│   └── src/
│       ├── MarketPriceTracker.Domain/          # Entities, enums, domain rules
│       ├── MarketPriceTracker.Application/     # DTOs, interfaces, use cases
│       ├── MarketPriceTracker.Infrastructure/  # EF Core, repositories, external APIs
│       └── MarketPriceTracker.Api/             # REST controllers, HTTP pipeline
└── frontend/                                   # React SPA
```

## Clean Architecture

Dependencies flow inward:

```
Api → Infrastructure → Application → Domain
```

- **Domain** — no external dependencies
- **Application** — business logic contracts and services
- **Infrastructure** — data access and third-party integrations
- **Api** — HTTP entry point, CORS, configuration

## Getting Started (Backend)

```bash
cd backend
dotnet build
dotnet run --project src/MarketPriceTracker.Api
```

Health check: `GET http://localhost:5129/api/health`

## Configuration

Backend settings live in `backend/src/MarketPriceTracker.Api/appsettings.json`.
Frontend environment variables will use `frontend/.env`.

## Build Plan

1. ✅ Backend clean architecture solution structure
2. Domain entities and database (EF Core + PostgreSQL)
3. REST API endpoints
4. Frontend setup (Tailwind + responsive UI)
5. Frontend features wired to API
6. Render deployment configuration
