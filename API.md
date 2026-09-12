# ClientPulse CRM — REST API Specification

Base URL: `/api/v1`

---

## Standard Error Envelope

All error responses return a standardized format:

```json
{
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer with ID 7f4a8b21-4c3e-4d89-9a02-b2f518e3d09a was not found.",
    "details": null
  }
}
```

---

## 1. System Health

### `GET /health`
Returns service health status and database connectivity.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "app_env": "development",
  "database": "connected"
}
```

---

## 2. Authentication

### `POST /auth/login`
Authenticates a user and returns a signed JWT access token.

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

**Response `200 OK`**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "c71e8a4d-9a99-4d2b-9e4a-1e42f9dfbb31",
    "email": "admin@example.com",
    "is_active": true
  }
}
```

**Response `401 Unauthorized`**:
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password.",
    "details": null
  }
}
```

### `GET /auth/me`
Returns details of the currently authenticated user. Requires `Authorization: Bearer <token>`.

**Response `200 OK`**:
```json
{
  "id": "c71e8a4d-9a99-4d2b-9e4a-1e42f9dfbb31",
  "email": "admin@example.com",
  "is_active": true,
  "created_at": "2026-09-11T12:00:00Z"
}
```

---

## 3. Customers

### `GET /customers`
Retrieves a paginated list of customers with optional search, status filtering, and sorting.

**Query Parameters**:
- `page` (int, default: 1)
- `page_size` (int, default: 10, max: 100)
- `search` (string, optional) - filters by name, email, or company (case-insensitive)
- `status` (enum: `active`, `inactive`, `lead`, optional)
- `sort_by` (enum: `created_at`, `name`, `email`, `company`, `status`, default: `created_at`)
- `sort_order` (enum: `asc`, `desc`, default: `desc`)

**Response `200 OK`**:
```json
{
  "items": [
    {
      "id": "7f4a8b21-4c3e-4d89-9a02-b2f518e3d09a",
      "name": "Elena Rostova",
      "email": "elena.rostova@hyperion.ai",
      "phone": "+1 (555) 891-2345",
      "company": "Hyperion Dynamics",
      "status": "active",
      "created_at": "2026-09-11T10:00:00Z",
      "updated_at": "2026-09-11T10:00:00Z"
    }
  ],
  "page": 1,
  "page_size": 10,
  "total": 1428,
  "total_pages": 143,
  "metrics": {
    "total_customers": 1428,
    "active_count": 1092,
    "lead_count": 248,
    "inactive_count": 88
  }
}
```

### `GET /customers/{id}`
Returns full customer profile by UUID.

**Response `200 OK`**:
```json
{
  "id": "7f4a8b21-4c3e-4d89-9a02-b2f518e3d09a",
  "name": "Elena Rostova",
  "email": "elena.rostova@hyperion.ai",
  "phone": "+1 (555) 891-2345",
  "company": "Hyperion Dynamics",
  "status": "active",
  "created_at": "2026-09-11T10:00:00Z",
  "updated_at": "2026-09-11T10:00:00Z"
}
```

### `POST /customers`
Creates a new customer.

**Request Body**:
```json
{
  "name": "Marcus Vance",
  "email": "marcus@vanguard.io",
  "phone": "+1 (555) 891-2345",
  "company": "Vanguard Logistics",
  "status": "active"
}
```

**Response `201 Created`**:
```json
{
  "id": "e931b238-17b5-4cb2-8321-72da9a797efb",
  "name": "Marcus Vance",
  "email": "marcus@vanguard.io",
  "phone": "+1 (555) 891-2345",
  "company": "Vanguard Logistics",
  "status": "active",
  "created_at": "2026-09-11T14:30:00Z",
  "updated_at": "2026-09-11T14:30:00Z"
}
```

### `PATCH /customers/{id}`
Updates existing customer fields partially.

**Request Body**:
```json
{
  "status": "inactive"
}
```

**Response `200 OK`**: (Updated customer object)

### `DELETE /customers/{id}`
Deletes customer by UUID.

**Response `204 No Content`**
