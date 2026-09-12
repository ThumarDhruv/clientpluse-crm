# ClientPulse CRM — Architecture Documentation

## 1. System Overview

ClientPulse is designed as a modular, decoupled, production-oriented monorepo composed of an independent Next.js 14+ frontend application and a FastAPI backend with PostgreSQL persistence.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser                           │
│  - Modern browser with responsive viewport (Desktop/Mobile) │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (Port 3000)             │
│  - App Router architecture (/login, /dashboard/*)           │
│  - TanStack Query v5 for cached server state                │
│  - React Hook Form + Zod for client-side validation         │
│  - Custom Precision Enterprise Theme (Tailwind CSS)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API Calls (Bearer JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Port 8000)              │
│  - Strict Layering: Routes -> Deps -> Services -> Repos     │
│  - Pydantic v2 data models for input/output serialization   │
│  - Standardized JSON error response envelope                │
│  - Pytest test suite with in-memory test isolation          │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQLAlchemy 2.0 (Psycopg)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL 16 Database                   │
│  - Versioned schema migrations via Alembic                  │
│  - B-Tree indexes on query keys (email, company, status)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Layered Architecture

The FastAPI backend strictly enforces single responsibility across layers:

```text
HTTP Request
     │
     ▼
[ 1. API Route Layer ] (app/api/v1/endpoints/)
     │  - Defines HTTP method, URL path, response schema, and status code.
     │  - Injects dependencies (database session, authenticated current user).
     ▼
[ 2. Dependency & Security Layer ] (app/api/deps.py, app/core/security.py)
     │  - Decodes and validates JWT bearer tokens.
     │  - Provides scoped SQLAlchemy DB session.
     ▼
[ 3. Service Layer ] (app/services/)
     │  - Enforces domain business logic (e.g. unique email checks, normalization).
     │  - Coordinates multiple repositories and transaction boundaries.
     ▼
[ 4. Repository Layer ] (app/repositories/)
     │  - Encapsulates direct database queries, filters, sorting, and pagination.
     │  - Prevents SQL leakage outside the data access layer.
     ▼
[ 5. ORM Models & DB ] (app/models/, PostgreSQL)
        - SQLAlchemy declarative models mapped to database tables with Alembic migrations.
```

---

## 3. Database Schema & Indexing

### Users Table (`users`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Unique user identifier |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL, INDEXED` | Login email address |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed password |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE, NOT NULL` | Active status flag |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Creation timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp (UTC) |

### Customers Table (`customers`)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Unique customer identifier |
| `name` | `VARCHAR(150)` | `NOT NULL` | Customer contact name |
| `email` | `VARCHAR(255)` | `NOT NULL, INDEXED` | Contact email address |
| `phone` | `VARCHAR(30)` | `NOT NULL` | Contact phone number |
| `company` | `VARCHAR(150)` | `NOT NULL, INDEXED` | Company / Account name |
| `status` | `ENUM` | `NOT NULL, INDEXED` | `active`, `inactive`, `lead` |
| `created_at` | `TIMESTAMP` | `NOT NULL, INDEXED` | Timestamp (UTC) |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Last update timestamp (UTC) |

---

## 4. Frontend Architecture

- **State Management**: TanStack Query handles server caching, deduplication, background refetching, and optimistic invalidation.
- **Route Protection**: Client-side auth provider with token persistence and Next.js route protection.
- **Design Tokens**: Structured around `precision_enterprise_interface/DESIGN.md`, utilizing high-contrast surfaces, 4px micro-spacing grid, and typography hierarchy.
