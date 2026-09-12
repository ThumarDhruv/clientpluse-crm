# ClientPulse — Customer Management CRM Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing_65%2F65-success)](backend/tests)

ClientPulse is a full-stack Customer Relationship Management (CRM) platform built for enterprise customer lifecycle operations. It features a modern **Next.js 15 App Router** interface with URL state synchronization, responsive layouts, and granular Role-Based Access Control (RBAC), backed by a high-performance **FastAPI** REST API, PostgreSQL persistence with Alembic migrations, JWT authentication, and Docker orchestration.

---

## 🌐 Live Production Deployments

| Component | Platform | URL |
|---|---|---|
| **Live Web App (Frontend)** | **Vercel** | [https://clientpluse-crm-tau.vercel.app](https://clientpluse-crm-tau.vercel.app) |
| **Live REST API (Backend)** | **Render** | [https://clientpulse-api-6asd.onrender.com/api/v1](https://clientpulse-api-6asd.onrender.com/api/v1) |
| **Interactive Swagger UI** | **Render / OpenAPI** | [https://clientpulse-api-6asd.onrender.com/docs](https://clientpulse-api-6asd.onrender.com/docs) |
| **Health Check Endpoint** | **Render** | [https://clientpulse-api-6asd.onrender.com/api/v1/health](https://clientpulse-api-6asd.onrender.com/api/v1/health) |

---

## 📑 Table of Contents

- [Live Production Deployments](#-live-production-deployments)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Demo Credentials](#-demo-credentials)
- [Quick Start with Docker](#-quick-start-with-docker-compose)
- [Local Development Setup](#-local-development-setup)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Production Deployment](#-production-deployment)
- [Assumptions](#-assumptions)
- [Limitations](#-limitations)
- [Future Improvements](#-future-improvements)

---

## 💻 Tech Stack

### Frontend

- **Framework**: [Next.js 15.1+](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/) (Strict mode, zero `any`)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with responsive mobile drawer navigation
- **State & Server Cache**: [TanStack Query v5](https://tanstack.com/query) with optimistic invalidation
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) schemas
- **Icons & Visuals**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

### Backend

- **Framework**: [FastAPI 0.110+](https://fastapi.tiangolo.com/) (Asynchronous Starlette engine)
- **Data Validation & Serialization**: [Pydantic v2](https://docs.pydantic.dev/)
- **ORM & Database Engine**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) with [Psycopg 3](https://www.psycopg.org/)
- **Schema Migrations**: [Alembic](https://alembic.sqlalchemy.org/)
- **Authentication**: JWT Bearer Tokens (`python-jose` with `HS256`), passwords hashed with `bcrypt` via `passlib`
- **Testing**: [Pytest](https://docs.pytest.org/) + `pytest-asyncio` (21/21 passing tests)

### Infrastructure & DevOps

- **Primary Database**: PostgreSQL 16 (UUID primary keys, B-tree indexes)
- **Caching**: Optional Redis cache with automatic in-memory fallback
- **Containerization**: Docker multi-stage builds & Docker Compose
- **CI/CD**: GitHub Actions automated lint, type-check, and test runner

---

## ✨ Key Features

- **🔐 Secure Authentication**:
  - JWT bearer token authentication with server-side signature and expiration verification.
  - **Role-Based Access Control (RBAC)**: Three user roles (`admin`, `manager`, `viewer`) with granular endpoint permissions.
  - Constant-time password verification using `bcrypt`.
  - Protected client routes with automatic redirection to `/login`.
  - 1-Click "Demo Autofill" action for evaluator convenience.

- **📊 High-Density Customer Directory**:
  - Full CRUD lifecycle (Create, View Details, Partial Update / Edit, and Delete).
  - Multi-status filtering (`Active`, `Lead`, `Inactive`) with multi-select support.
  - Server-side search across name, email, and company (debounced 300ms, wildcard-escaped).
  - Database-level pagination (`OFFSET`/`LIMIT`) with safe maximum limits (`page_size <= 100`).
  - Automatic page boundary decrement when deleting the sole customer on page $N > 1$.

- **🔗 Deep URL State Synchronization**:
  - Search queries, status filter arrays, sort fields, and active page numbers synchronize with URL search parameters, enabling bookmarking and persistent page refreshes.

- **🛡️ Multi-Layered Validation & Security**:
  - Client-side validation via Zod schemas with instant field-level feedback.
  - Server-side payload validation via Pydantic v2 schemas.
  - Database-level uniqueness constraint (`uq_customers_email`) preventing concurrent duplicates.
  - Dynamic sort column allowlisting preventing SQL injection.
  - Sanitized CORS origins and secure JWT startup validation.

- **📱 Fully Responsive Precision UI**:
  - Desktop: Collapsible sidebar navigation, high-density data tables, overview KPI metric cards.
  - Mobile: Slide-over drawer navigation, touch-friendly mobile bottom bar, stacked card list.
  - Accessible modal dialogs with keyboard Escape and focus trap support.

---

## 🐳 Quick Start with Docker Compose

Run the entire full-stack application (PostgreSQL + FastAPI + Next.js) with a single command:

```bash
docker compose up --build -d
```

### Service Access Points:

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **System Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

To shut down:

```bash
docker compose down -v
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites

- **Node.js**: v18.17+ or v20+
- **Python**: 3.10+ or 3.11+
- **PostgreSQL**: 15+ or 16 (or use local Docker container)

---

### 2. Backend Setup

```bash
cd backend

# Create & activate Python virtual environment
python -m venv .venv

# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Run Alembic database migrations
alembic upgrade head

# Seed initial admin user and sample customer records
python -m app.utils.seed

# Start the development server
uvicorn app.main:app --reload --port 8000
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Start the Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role                       | Email                 | Password      |
| :------------------------- | :-------------------- | :------------ |
| **Admin** (Full Access)    | `admin@example.com`   | `Admin@123`   |
| **Manager** (Read + Write) | `manager@example.com` | `Manager@123` |
| **Viewer** (Read Only)     | `viewer@example.com`  | `Viewer@1234` |

> 💡 **Tip**: On the login screen, click the **"Fill Demo Credentials (1-Click)"** button to instantly populate admin test credentials.

> **RBAC Roles**:
>
> - **Admin**: Full CRUD access (create, read, update, delete customers)
> - **Manager**: Can create, read, and update customers (no delete)
> - **Viewer**: Read-only access to customer records

---

## 📖 API Documentation

The REST API follows RFC-compliant HTTP status codes and uniform JSON response structures. Detailed endpoint documentation is maintained in [API.md](API.md).

### Core Endpoints Summary

| Method   | Endpoint                 | Description                                         | Auth Required |
| :------- | :----------------------- | :-------------------------------------------------- | :------------ |
| `POST`   | `/api/v1/auth/login`     | Authenticate user & issue signed JWT access token   | No            |
| `GET`    | `/api/v1/auth/me`        | Fetch authenticated user profile details            | Yes (Bearer)  |
| `GET`    | `/api/v1/customers`      | Search, filter, sort, and paginate customer records | Yes (Bearer)  |
| `POST`   | `/api/v1/customers`      | Create a new customer record                        | Yes (Bearer)  |
| `GET`    | `/api/v1/customers/{id}` | Retrieve specific customer record by UUID           | Yes (Bearer)  |
| `PATCH`  | `/api/v1/customers/{id}` | Partially update customer attributes                | Yes (Bearer)  |
| `DELETE` | `/api/v1/customers/{id}` | Permanently delete customer record (HTTP 204)       | Yes (Bearer)  |
| `GET`    | `/api/v1/health`         | Health & infrastructure connectivity check          | No            |

---

## 🧪 Testing

### Backend Tests (Pytest)

Comprehensive tests covering authentication, RBAC role enforcement, route authorization, customer CRUD, status validation, duplicate email handling, and search:

```bash
cd backend
.venv\Scripts\pytest -v
```

**Results**: `32 passed` (100% passing, including all RBAC role and endpoint authorization tests)

### Frontend Tests (Vitest & TypeScript)

Unit tests verifying Zod schema validation, component rendering, auth utilities, date formatting, loading states, and error handling:

```bash
cd frontend
npm run type-check   # Verifies strict TypeScript compliance (0 errors)
npm run test         # Runs Vitest unit test suite (33 passed)
```

---

## 🚀 Production Deployment Architecture

The full-stack application is deployed across three cloud tiers:

1. **Frontend (Vercel)**: Next.js 15 App Router deployed on the edge network at [https://clientpluse-crm-tau.vercel.app](https://clientpluse-crm-tau.vercel.app).
2. **Backend API (Render)**: FastAPI Python 3.12 service hosted on Render at [https://clientpulse-api-6asd.onrender.com](https://clientpulse-api-6asd.onrender.com).
3. **Database (Supabase)**: Managed PostgreSQL 16 instance with automated Alembic migrations and connection pooling via Psycopg 3.

---

## 📌 Assumptions

1. **Single-Tenant Application Model**: All authenticated users belong to a single CRM workspace and share read/write access to customer records.
2. **Global Email Uniqueness**: Customer emails are unique across the entire database, enforced both at the service layer and via database constraint (`uq_customers_email`).
3. **Stateless JWT Authorization**: Clients authenticate via JWT bearer tokens sent in the `Authorization: Bearer <token>` header, facilitating decoupled frontend and backend hosting.
4. **PostgreSQL as Primary Engine**: PostgreSQL is standard for production. SQLite in-memory engine is utilized for high-speed, isolated pytest execution.
5. **Caching Layer Resilience**: Redis caching is optional; if Redis is unavailable, the application gracefully degrades to in-memory fallback without interrupting CRUD operations.

---

## ⚠️ Limitations

1. **Client-Side Token Storage**: Access tokens are stored in browser `localStorage` for technical assessment simplicity. In high-security production deployments, migration to HTTP-only, SameSite cookies with CSRF protection is recommended.
2. **Session Lifespan & Token Renewal**: Session renewal requires re-authentication when the access token expires (`ACCESS_TOKEN_EXPIRE_MINUTES=1440`). Refresh token rotation is documented as a future enhancement.
3. **Deletion Policy**: Customers are permanently removed via hard delete (`DELETE`). Soft-deletion with an `is_deleted` or `deleted_at` audit timestamp is recommended for enterprise compliance.
4. **Large-Scale Search**: Customer search utilizes parameterized SQL `ILIKE`. For datasets exceeding 100,000 records, PostgreSQL `pg_trgm` GIN indexing or an external search engine (e.g. Meilisearch/Elasticsearch) should be enabled.

---

## 🔮 Future Improvements

1. **Refresh Token Rotation**: Implement short-lived access tokens (15 minutes) paired with secure HTTP-only refresh tokens stored in database sessions.
2. **Audit Trail & Activity History**: Create an `audit_logs` table tracking user actions (timestamp, user_id, action, customer_id, previous_state, new_state).
3. **Rate Limiting & Abuse Protection**: Integrate Redis-backed sliding window rate limiters (`slowapi`) on login and search endpoints.
4. **Bulk Operations & CSV Import**: Provide multi-select bulk customer status transitions and CSV data import/export wizards.
5. **Customer Notes & Activity Timeline**: Support rich text notes and interaction logs associated with each customer record.
6. **Automated CI/CD Deployment**: GitHub Actions workflow deploying frontend to Vercel and backend container to Render on pull-request merge.

---

## 📄 License

This project is developed as a technical assessment submission under the MIT License.
