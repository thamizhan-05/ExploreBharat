# EXPLOREBharat — CODEBASE AUDIT & BASELINE QUALITY REPORT

**Date:** October 9, 2026  
**Auditor:** Principal Software Architect & Code Quality Specialist  
**Repository:** `ExploreBharat` (Monorepo)  
**Architecture:** Modular Monolith with TypeScript, Next.js 14 App Router, Express, Prisma ORM, and React Native / Expo  

---

## 1. Executive Summary & Quality Baseline

This audit establishes the empirical baseline of the **ExploreBharat** codebase prior to the clean architecture and code simplification refactoring.

### Measured Quality Baseline (Executed Verification Checks)

| Check Category | Command Executed | Result | Details |
| :--- | :--- | :--- | :--- |
| **API Test Suite** | `npm test --workspace=@bharatyatra/api` | **66 / 66 PASSED (100%)** | Full coverage of auth, RBAC, search, booking, payment signatures, trip planning, multimodal transit, free-entry safeguards, vendor ledger, weather, and provenance. |
| **Database Package Build** | `npm run build --workspace=@bharatyatra/database` | **PASSED (Exit code 0)** | Prisma Client generation and TypeScript compilation succeeded. |
| **Types Package Build** | `npm run build --workspace=@bharatyatra/types` | **PASSED (Exit code 0)** | Shared DTOs and type definitions compiled cleanly. |
| **API Package Build** | `npm run build --workspace=@bharatyatra/api` | **PASSED (Exit code 0)** | `tsc` produced valid `dist/server.js` and `dist/test.js`. |
| **Web Production Build** | `npm run build --workspace=@bharatyatra/web` | **PASSED (Exit code 0)** | Next.js 14.2.3 built all 21 static/dynamic routes with zero errors. First Load JS: 87 kB shared. |
| **Database Migrations** | `npx prisma db push --skip-generate` | **IN SYNC** | SQLite database schema in sync with `packages/database/prisma/schema.prisma` (34 models). |
| **Mobile Compilation** | `apps/mobile/package.json` | **READY** | Expo ~51.0.0 app with Expo Router 3.5.14. Native simulator tests require Android Studio/Xcode runtime; code analysis conducted statically. |

---

## 2. Monorepo Structure & Dependency Map

The codebase is structured as a pnpm/npm workspace monorepo:

```
ExploreBharat/
├── apps/
│   ├── api/          # Express 4 + TypeScript modular REST API (Port 4000)
│   ├── web/          # Next.js 14 (App Router) + TailwindCSS web frontend (Port 3000)
│   └── mobile/       # React Native + Expo Router cross-platform mobile client
├── packages/
│   ├── database/     # Prisma ORM schema, migrations, seed data, client wrapper
│   └── types/        # Shared domain types, enums, and API request/response DTOs
└── docs/             # Technical specifications & architecture diagrams
```

---

## 3. Findings: Code Smells, Oversized Files & Technical Debt

### A. Oversized Monolithic UI Files (Highest Risk to Maintainability)
Several frontend page components have accumulated excessive state, UI sub-views, and business logic into giant single files:

1. **`apps/web/src/app/admin/page.tsx` (1,791 lines / 92 KB):**
   - **Issue:** Combines Overview statistics, Data Quality Center, Image Integrity Auditing (SHA-256 + dHash), Google Places Ingestion, Community Place Suggestions Queue, External Provider Health Monitor, Analytics Funnel & Search Trends, and a complex Add Attraction Modal into a single file with 30+ intertwined state variables.
   - **Risk:** High cognitive load for developers, frequent merge conflicts, and difficult unit testing.
   - **Remedy:** Refactor into modular tab components inside `apps/web/src/app/admin/components/`.

2. **`apps/web/src/app/smart-journey/page.tsx` (1,267 lines / 55 KB):**
   - **Issue:** Contains search form, multimodal route options, timeline visualization, and regional fare calculators.
   - **Remedy:** Extract `JourneySearchForm`, `JourneyRouteOptions`, and `JourneyTimelineView`.

3. **`apps/web/src/app/vendor/page.tsx` (1,031 lines / 44 KB):**
   - **Issue:** Contains vendor profile, room inventory table, tariff updater modal, reservations ledger, and payout calculation.
   - **Remedy:** Extract clean tab components inside `apps/web/src/app/vendor/components/`.

4. **`apps/web/src/app/trips/page.tsx` (713 lines / 33 KB):**
   - **Issue:** Combines itinerary view, Day-by-Day timeline, trip creation modal, budget estimator calculator, and item adder modal.
   - **Remedy:** Extract modal components into dedicated files.

### B. Backend Architecture & Controller-Service Boundaries
The backend has clean domain separation (`modules/` with 20 distinct domains: `auth`, `destinations`, `attractions`, `hotels`, `tickets`, `bookings`, `trips`, `ai`, `circuits`, `search`, `reviews`, `payments`, `admin`, `vendors`, `events`, `journeys`, `transport`, `wallet`, `passport`, `analytics`).

However:
- **`apps/api/src/modules/admin/admin.service.ts` (623 lines):** Performs duplicate detection, health checks, metrics, image integrity audits, and suggestion approvals. Can benefit from clear helper decomposition.
- **Magic Numbers & Hardcoded Constants:** Default pagination limits (`20`), platform commission rate (`0.08`), and earth radius calculations (`6371`) should be extracted into shared domain constants.
- **Error Normalization:** Error handling relies on `AppError` and `errorHandler`, which is good, but validation schemas can be more declarative.

### C. Test Suite Architecture
- **`apps/api/src/test.ts` (1,250 lines / 55 KB):** Runs sequentially through 66 tests against an in-process HTTP server. While it provides excellent end-to-end integration verification, grouping tests into logical domain suites will improve readability and debugging speed for developers.

---

## 4. Prioritized Refactoring Plan

| Phase | Target Area | Objective | Risk Level |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Shared Foundations** | Define domain constants (`PAGINATION`, `FEES`, `STATUSES`), clean shared error types, and validation helpers. | **LOW** |
| **Phase 2** | **Frontend Component Modularization (`admin`)** | Decompose `admin/page.tsx` (1,791 lines) into 8 dedicated tab components (`AdminOverviewTab`, `AdminDataCenterTab`, `AdminImageIntegrityTab`, `AdminGooglePlacesTab`, `AdminSuggestionsTab`, `AdminProvidersTab`, `AdminAnalyticsTab`, `AdminAddAttractionModal`). | **MEDIUM** (Verify Next.js build & UI) |
| **Phase 3** | **Frontend Component Modularization (`trips` & `smart-journey`)** | Extract modals and sub-views into cleanly scoped components. | **LOW** |
| **Phase 4** | **Backend Service Refactoring** | Clean up `admin.service.ts`, standardize pagination limits, and eliminate repeated code. | **LOW** (Verified by 66 tests) |
| **Phase 5** | **Documentation Updates** | Update `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`. | **ZERO** |
| **Phase 6** | **Regression Verification** | Re-run full test suite, Next.js build, and browser verification. | **ZERO** |

---

## 5. Post-Refactor Results & Verification

### A. Measurable File & Complexity Reductions

| Component / File | Original Size | Refactored Size | Reduction | Refactored Architecture |
| :--- | :--- | :--- | :--- | :--- |
| **`apps/web/src/app/admin/page.tsx`** | 1,792 lines (92 KB) | **384 lines (17 KB)** | **-78.5%** | Decomposed into 8 focused components in `apps/web/src/app/admin/components/`: `AdminOverviewTab`, `AdminDataCenterTab`, `AdminImageIntegrityTab`, `AdminGooglePlacesTab`, `AdminSuggestionsTab`, `AdminProvidersTab`, `AdminAnalyticsTab`, and `AdminAddAttractionModal`. |
| **`apps/web/src/app/trips/page.tsx`** | 714 lines (33 KB) | **400 lines (17 KB)** | **-44.0%** | Extracted 3 dedicated modular modals into `apps/web/src/app/trips/components/`: `TripCreateModal`, `TripAddItemModal`, and `TripBudgetModal`. |
| **`apps/web/src/app/smart-journey/page.tsx`** | 1,268 lines (63 KB) | **379 lines (15 KB)** | **-70.1%** | Decomposed into 7 focused components in `apps/web/src/app/smart-journey/components/`: `JourneyParametersForm`, `JourneyAlternativesCards`, `JourneyTimelineTab`, `JourneyCostTab`, `JourneyAlertsTab`, `JourneyRouteMapTab`, and `JourneyAuditModal`. First Load JS reduced to 104 kB. |
| **`apps/web/src/app/vendor/page.tsx`** | 1,032 lines (44 KB) | **506 lines (17 KB)** | **-51.0%** | Decomposed into 5 modular domain components in `apps/web/src/app/vendor/components/`: `VendorInventoryTab`, `VendorBookingsTab`, `VendorFinancialsTab`, `VendorProfileTab`, and `VendorTariffModal`. |
| **Backend Constants** | Ad-hoc magic numbers (`0.08`, `20`, `6371`) | Centralized in `apps/api/src/config/constants.ts` | **100% eliminated** | Replaced magic numbers in `vendors.service.ts`, `analytics.service.ts`, and `attractions.service.ts` with `PLATFORM_CONSTANTS`. |

### B. Verification Gate Checkpoint

All quality gates were empirically re-executed and verified:

1. **Backend Integration Test Suite:**
   - Command: `npm test --workspace=@bharatyatra/api`
   - Result: **66 / 66 PASSED (100% Pass Rate)**
   - Zero regressions across RBAC, payment signatures, image integrity, booking engine, and routing.

2. **Full Monorepo Build:**
   - Command: `npm run build`
   - Result: **All 4 workspaces compiled cleanly (Exit Code 0)**
   - `@bharatyatra/types`: Clean TypeScript build.
   - `@bharatyatra/database`: Clean Prisma client build.
   - `@bharatyatra/api`: Clean TypeScript build.
   - `@bharatyatra/web`: Next.js 14.2 compiled all 21 routes cleanly (87 kB shared First Load JS).

3. **Documentation Updated:**
   - `README.md`: Updated with tech stack, 66 tests, run/build/test commands, and Docker instructions.
   - `ARCHITECTURE.md`: Created clean modular architecture specification with Mermaid diagrams.
   - `CONTRIBUTING.md`: Created student and developer guide with coding rules and step-by-step contribution guides.

