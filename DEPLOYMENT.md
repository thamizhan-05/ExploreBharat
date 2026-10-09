# ExploreBharat — Production Cloud Deployment Guide

This guide details the verified deployment pathways for **ExploreBharat** across local container orchestration (Docker Compose) and cloud hosting platforms (**Render**, **Railway**, **Vercel**, **Neon / Supabase**, and **AWS ECS**).

---

## 1. Cloud Architecture Overview

```mermaid
graph TD
    User([Global Travelers & Commuters]) --> CDN[Cloudflare / Global Edge Network]
    
    subgraph Frontend Tier
        CDN --> Web[ExploreBharat Web: Next.js 14 PWA<br/>Vercel / Render / Docker Container]
    end

    subgraph API Gateway Tier
        CDN --> API[ExploreBharat API: Express Gateway<br/>Render / Railway / AWS ECS / Docker]
    end

    subgraph Data & Storage Tier
        API --> DB[(PostgreSQL 16 Database<br/>Neon / Supabase / AWS RDS / Docker)]
        API --> Redis[(Redis 7 Cache<br/>Upstash / Redis Cloud / Docker)]
    end

    subgraph External Verified Providers
        API --> Razorpay[Razorpay Payment Gateway]
        API --> Weather[Open-Meteo Weather API]
        API --> Wiki[Wikimedia Commons API]
    end
```

---

## 2. Option A: Full-Stack Docker Compose (Self-Hosted / VPS)

The monorepo contains a pre-configured multi-container stack with PostgreSQL 16, Redis 7, the Express API Gateway, and the Next.js 14 PWA frontend.

### Prerequisites
- Docker Engine &ge; 24.0
- Docker Compose &ge; 2.20

### Steps
1. **Clone and Navigate:**
   ```bash
   git clone https://github.com/thamizhan-05/ExploreBharat.git
   cd ExploreBharat
   ```

2. **Launch All Services:**
   ```bash
   docker compose up --build -d
   ```

3. **Verify Container Health:**
   ```bash
   docker compose ps
   ```
   - `explorebharat-postgres`: Port `5432` (healthy)
   - `explorebharat-redis`: Port `6379` (healthy)
   - `explorebharat-api`: Port `4000` (healthy, auto-migrated & seeded)
   - `explorebharat-web`: Port `3000` (healthy, Next.js PWA)

4. **Verify Application:**
   - Web Frontend: `http://localhost:3000`
   - API Gateway: `http://localhost:4000`
   - Healthcheck: `http://localhost:4000/health`

---

## 3. Option B: Render 1-Click Blueprint (Recommended for Cloud)

The repository provides [`render.yaml`](file:///c:/Users/selva/Desktop/Projects/ExploreBharat/render.yaml) for automated Infrastructure-as-Code provisioning.

### Provisioned Resources:
1. **Managed PostgreSQL:** `explorebharat-db` (PostgreSQL 16)
2. **API Gateway Web Service:** `explorebharat-api` (Node 20 runtime, automated entrypoint)
3. **Web Frontend Web Service:** `explorebharat-web` (Next.js 14 App Router)

### Deployment Steps:
1. Push your code to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New** &rarr; **Blueprint**.
4. Select the `thamizhan-05/ExploreBharat` repository.
5. Render detects `render.yaml` and provisions the database, API, and web frontend automatically.
6. The API container runs [`docker-entrypoint.sh`](file:///c:/Users/selva/Desktop/Projects/ExploreBharat/apps/api/docker-entrypoint.sh) to sync the PostgreSQL schema and seed authentic initial records.

---

## 4. Option C: Hybrid Setup — Vercel (Frontend) + Neon/Render (Backend)

For optimal global edge performance, host the Next.js frontend on Vercel and the API + PostgreSQL on Render or Neon.

### A. Database (Neon or Supabase)
1. Create a PostgreSQL 16 database at [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the pooled connection string:
   ```bash
   DATABASE_URL="postgresql://user:password@ep-host.ap-southeast-1.neon.tech/explorebharat?sslmode=require"
   ```

### B. Backend API (Render / Railway)
1. Create a new Web Service from the repository.
2. Set Build Command:
   ```bash
   npm ci && npm run build --workspace=@bharatyatra/types && cd packages/database && npx prisma generate --schema=prisma/schema.postgresql.prisma && cd ../.. && npm run build --workspace=@bharatyatra/api
   ```
3. Set Start Command:
   ```bash
   sh apps/api/docker-entrypoint.sh
   ```
4. Configure Environment Variables:
   - `DATABASE_URL`: Your Neon/Supabase PostgreSQL connection string
   - `JWT_SECRET`: Random 64-char string (`openssl rand -hex 32`)
   - `JWT_REFRESH_SECRET`: Random 64-char string (`openssl rand -hex 32`)
   - `JWT_EXPIRES_IN`: `1h`
   - `JWT_REFRESH_EXPIRES_IN`: `7d`
   - `SEED_ON_STARTUP`: `true` (runs initial catalog seed on first boot)

### C. Frontend (Vercel)
1. Import repository in [Vercel](https://vercel.com).
2. Framework Preset: **Next.js**.
3. Root Directory: `apps/web`.
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed API (e.g. `https://explorebharat-api.onrender.com/api`)
5. Click **Deploy**.

---

## 5. Automated Database Migrations & Seeding

The container entrypoint [`apps/api/docker-entrypoint.sh`](file:///c:/Users/selva/Desktop/Projects/ExploreBharat/apps/api/docker-entrypoint.sh) automatically adapts to your database engine:
- If `DATABASE_URL` contains `postgres`, it selects [`schema.postgresql.prisma`](file:///c:/Users/selva/Desktop/Projects/ExploreBharat/packages/database/prisma/schema.postgresql.prisma).
- If using local development SQLite, it defaults to [`schema.prisma`](file:///c:/Users/selva/Desktop/Projects/ExploreBharat/packages/database/prisma/schema.prisma).
- Executes `npx prisma db push --skip-generate` to apply schema diffs without manual downtime.
- If `SEED_ON_STARTUP="true"`, seeds verified demo accounts, destinations, ASI monuments, and hotel inventories.

---

## 6. Environment Variables Reference

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Application environment | `production` |
| `PORT` | API server listen port | `4000` |
| `DATABASE_URL` | PostgreSQL or SQLite connection string | `postgresql://user:pass@host:5432/db?schema=public` |
| `REDIS_URL` | Optional Redis cache URI | `redis://redis:6379` |
| `JWT_SECRET` | Secret key for signing access tokens | Secure random string &ge; 32 chars |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | Secure random string &ge; 32 chars |
| `JWT_EXPIRES_IN` | Access token lifespan | `1h` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifespan | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `https://explorebharat.com` |
| `NEXT_PUBLIC_API_URL` | Web frontend API endpoint | `https://api.explorebharat.com/api` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret | Secret string |
| `SEED_ON_STARTUP` | Seed demo data on initial boot | `"true"` or `"false"` |
