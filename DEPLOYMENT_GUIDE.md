# ClientPulse CRM — Production Deployment Guide

This guide provides step-by-step instructions to push the repository to GitHub and deploy the full-stack ClientPulse CRM system to production using **Supabase** (PostgreSQL Database), **Render** (FastAPI Backend), and **Vercel** (Next.js Frontend).

---

## Part 1: Push Code to GitHub

### Step 1.1: Configure Git Identity (if not already done)
Open your terminal in the project root:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### Step 1.2: Stage and Commit the Code
```powershell
git add .
git commit -m "feat: complete ClientPulse CRM with security hardening and Alembic migrations"
git branch -M main
```

### Step 1.3: Create a GitHub Repository
1. Go to [https://github.com/new](https://github.com/new).
2. Name the repository (e.g. `clientpulse-crm` or `customer-management`).
3. Leave it Public or Private (per assessment requirements). Do **not** check "Add README" or ".gitignore" since they already exist in this project.
4. Click **Create repository**.

### Step 1.4: Link Remote and Push
Copy your repository URL from GitHub and run:
```powershell
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

## Part 2: Database Setup (Supabase / Render PostgreSQL)

### Option A: Supabase (Recommended — Free & Reliable)
1. Sign up / Log in to [https://supabase.com](https://supabase.com).
2. Click **New project**, choose a name (e.g., `clientpulse-db`) and a secure database password.
3. Once provisioned, navigate to **Project Settings** → **Database** → **Connection string** → **URI**.
4. Select **Session mode** (port `5432` or pooled `6543`).
5. Copy the connection string. It will look like:
   ```text
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   > 💡 Change the protocol prefix from `postgresql://` to `postgresql+psycopg://` for SQLAlchemy 2.0 with Psycopg 3:
   > ```text
   > postgresql+psycopg://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   > ```

---

## Part 3: Backend Deployment (Render)

1. Sign up / Log in to [https://render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select your `clientpulse-crm` repository.
4. Fill in the service configuration:
   - **Name**: `clientpulse-api`
   - **Region**: Choose closest to your database (e.g., Oregon, Frankfurt)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3` (or choose `Docker`)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**:
     ```bash
     alembic upgrade head && python -m app.utils.seed && uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
     *(This automatically runs database migrations and seeds the initial admin user on every deployment!)*

5. Add **Environment Variables** in Render Dashboard:

   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `APP_ENV` | `production` | Enables production security checks |
   | `DATABASE_URL` | `postgresql+psycopg://...` | Your Supabase connection string from Part 2 |
   | `JWT_SECRET_KEY` | *Generated 64-char hex key* | Generate via: `python -c "import secrets; print(secrets.token_hex(32))"` |
   | `JWT_ALGORITHM` | `HS256` | Standard signing algorithm |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | 24 hours |
   | `CORS_ORIGINS` | `http://localhost:3000,https://YOUR_FRONTEND.vercel.app` | Include local dev + your upcoming Vercel URL |

6. Click **Deploy Web Service**.
7. Once deployed, note down your Render backend URL (e.g. `https://clientpulse-api.onrender.com`).
8. Verify it by visiting:
   ```text
   https://clientpulse-api.onrender.com/api/v1/health
   ```
   It should return `{"status": "healthy", "database": "connected"}`.

---

## Part 4: Frontend Deployment (Vercel)

1. Sign up / Log in to [https://vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub `clientpulse-crm` repository.
4. Configure the project:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select `frontend`
5. Expand **Environment Variables** and add:

   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://clientpulse-api.onrender.com/api/v1` |

   *(Replace with your actual Render URL + `/api/v1`)*

6. Click **Deploy**.
7. Vercel will build and assign you a production domain (e.g. `https://clientpulse-crm.vercel.app`).

---

## Part 5: Final CORS Handshake

Now that you have your live Vercel domain, add it to your Render backend CORS list:
1. Go to **Render Dashboard** → `clientpulse-api` → **Environment**.
2. Update `CORS_ORIGINS` to include your Vercel URL:
   ```text
   http://localhost:3000,https://clientpulse-crm.vercel.app
   ```
3. Save changes (Render will automatically re-deploy in ~30 seconds).

---

## Part 6: Production Verification Checklist

1. **Visit Frontend URL**: Open `https://clientpulse-crm.vercel.app`.
2. **Test Login**:
   - Use the 1-click Demo Autofill button or enter:
     - **Email**: `admin@example.com`
     - **Password**: `Admin@123`
3. **Verify Protected Dashboard**: Confirm redirection to `/dashboard/customers`.
4. **Test Customer Operations**:
   - Create a new customer and verify success toast.
   - Filter by status (`Active`, `Lead`, `Inactive`).
   - Search by name or email (debounced 300ms).
   - Edit an existing customer.
   - Delete a customer (confirm modal triggers and deletes record).
5. **Test Invalid Token / Logout**:
   - Click "Sign out" from the user menu.
   - Try navigating directly to `/dashboard/customers` to verify redirection to `/login`.
