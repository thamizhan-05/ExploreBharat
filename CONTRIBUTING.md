# Contributing to ExploreBharat

Welcome to the **ExploreBharat** open-source contributor guide!  
This document is designed to make contributing intuitive for developers of all experience levels, including students and first-time open-source contributors.

---

## 1. Guiding Principles

- **Simplicity Over Cleverness:** Write clear, self-explanatory code. Avoid obscure one-liners or unnecessary design patterns.
- **Predictable Behavior:** Every endpoint, service, and component should have a single clear responsibility.
- **No Hallucinated Data:** Never add fake prices, synthetic booking confirmations, or hallucinated transit timetables.
- **Preserve Backwards Compatibility:** The `/api` and `/api/v1` routes and all 66 automated tests must remain passing at all times.

---

## 2. Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0+ (LTS or Node v20/v22 recommended)
- **npm**: v9.0.0+
- **Git**

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/explorebharat/explorebharat.git
   cd explorebharat
   ```

2. **Install all workspace dependencies:**
   ```bash
   npm install
   ```

3. **Compile shared types and database client:**
   ```bash
   npm run build --workspace=@bharatyatra/types
   npm run build --workspace=@bharatyatra/database
   ```

4. **Initialize and seed the local database:**
   ```bash
   cd packages/database
   npx prisma generate
   npx prisma db push
   npm run seed
   cd ../..
   ```

5. **Run the integration test suite to verify baseline:**
   ```bash
   npm test --workspace=@bharatyatra/api
   # Should pass 66/66 test suites cleanly
   ```

6. **Start local development servers:**
   - **Backend API Gateway (Port 4000):**
     ```bash
     npm run dev --workspace=@bharatyatra/api
     ```
   - **Web Application (Port 3000):**
     ```bash
     npm run dev --workspace=@bharatyatra/web
     ```

---

## 3. Coding & Naming Conventions

### File & Directory Naming
- **Backend Modules:** `apps/api/src/modules/<domain>/`
  - Controller: `<domain>.controller.ts` (e.g. `attractions.controller.ts`)
  - Service: `<domain>.service.ts` (e.g. `attractions.service.ts`)
  - Routes: `<domain>.routes.ts` (e.g. `attractions.routes.ts`)
- **Frontend Pages:** `apps/web/src/app/<route>/page.tsx`
- **Frontend Modular Components:** `apps/web/src/app/<route>/components/<ComponentName>.tsx` (PascalCase)
- **Shared Components:** `apps/web/src/components/<ComponentName>.tsx`
- **Shared Types:** `packages/types/src/<domain>.ts`

### Code Formatting & Style
- Use TypeScript strictly. Avoid `any` where a typed interface exists in `@bharatyatra/types`.
- Use `PLATFORM_CONSTANTS` from `apps/api/src/config/constants.ts` instead of raw magic numbers (e.g., use `PLATFORM_CONSTANTS.PLATFORM_COMMISSION_RATE` instead of `0.08`).
- Keep files concise: Aim for files under 400 lines. If a page or controller grows large, extract dedicated sub-components or services.

---

## 4. How to Add a New Feature

### A. Adding a New Backend API Endpoint

1. **Define the DTO / Interface:**  
   Add request and response types to `packages/types/src/`.
2. **Implement Business Logic in the Service:**  
   Add a method to `<domain>.service.ts` inside `apps/api/src/modules/<domain>/`. Enforce validation, user authorization, and ownership checks.
3. **Add Controller Request Handler:**  
   Add a method in `<domain>.controller.ts`. Extract `req.body`, `req.query`, and `req.user`, call the service, and respond using `res.json({ success: true, data })`.
4. **Register Route:**  
   Add the HTTP method and path in `<domain>.routes.ts`. Apply authentication middleware (`authenticateToken`, `requireRole`) as needed.
5. **Add Automated Test:**  
   Add an integration test case in `apps/api/src/test.ts` verifying both success and error responses.

### B. Adding a New Frontend Screen or Feature

1. **Create the Route Folder:**  
   Add `apps/web/src/app/<feature>/page.tsx`.
2. **Break Down into Components:**  
   Place view tabs, modals, and complex sections in `apps/web/src/app/<feature>/components/`.
3. **Use the Central API Client:**  
   Call backend endpoints using `api.<methodName>()` from `apps/web/src/lib/api.ts`.
4. **Handle UI States:**  
   Always handle loading, empty data, and error states gracefully with accessible UI feedback.

---

## 5. Pull Request & Review Checklist

Before opening a pull request, run and confirm all four quality gates:

- [ ] **1. Shared Types Build:** `npm run build --workspace=@bharatyatra/types` exits with 0.
- [ ] **2. Database Client Build:** `npm run build --workspace=@bharatyatra/database` exits with 0.
- [ ] **3. API Test Suite:** `npm test --workspace=@bharatyatra/api` passes all 66 tests.
- [ ] **4. Web Production Build:** `npm run build --workspace=@bharatyatra/web` compiles all 21 routes with zero type/lint errors.
- [ ] **5. No Secrets:** No API keys, passwords, or credentials are hardcoded or committed in git history.
- [ ] **6. Meaningful Commits:** Commits follow Conventional Commits (e.g., `refactor: extract admin tabs`, `feat: add wildlife sanctuary entry rule`).
