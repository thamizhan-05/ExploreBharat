# ExploreBharat Production Deployment Guide

## 1. Cloud Architecture

```mermaid
graph LR
    User([Global Travelers]) --> CDN[Cloudflare / Fastly CDN]
    CDN --> Web[Vercel: Next.js 14 App Router]
    CDN --> API[Render / Railway / AWS ECS: API Gateway]
    MobileApp[iOS / Android Expo EAS] --> CDN
    
    API --> Neon[(Neon / Supabase Serverless PostgreSQL)]
    API --> Redis[(Upstash Serverless Redis)]
    API --> RazorpayAPI[Razorpay India Gateway]
```

---

## 2. Infrastructure Setup

### A. Database (PostgreSQL)
1. Provision a PostgreSQL 16 database instance (e.g. Neon.tech, Supabase, or AWS RDS).
2. Set connection string in environment:
   ```bash
   DATABASE_URL="postgresql://user:password@ep-host.neon.tech/bharatyatra?sslmode=require"
   ```
3. Run Prisma deployment commands:
   ```bash
   npx prisma migrate deploy --schema=prisma/schema.postgresql.prisma
   npm run seed
   ```

### B. Backend API Gateway
1. **Container Deployment:**
   ```bash
   docker build -t bharatyatra-api:latest -f Dockerfile .
   docker run -p 4000:4000 -e DATABASE_URL=$DATABASE_URL bharatyatra-api:latest
   ```
2. Or deploy directly to Render / Railway with Node.js 20 runtime:
   - Build Command: `npm install && npm run build --workspace=@bharatyatra/types && npm run build --workspace=@bharatyatra/api`
   - Start Command: `node apps/api/dist/index.js`

### C. Web Frontend (Vercel)
1. Connect GitHub repository to Vercel.
2. Set Root Directory: `apps/web`.
3. Set Environment Variable: `NEXT_PUBLIC_API_URL=https://api.bharatyatra.in/api`.
4. Deploy!

### D. Mobile Application (Expo EAS)
1. Install EAS CLI: `npm install -g eas-cli`
2. Configure credentials: `eas build:configure`
3. Trigger Android APK / AAB build: `eas build --platform android --profile production`
4. Trigger iOS IPA build: `eas build --platform ios --profile production`
