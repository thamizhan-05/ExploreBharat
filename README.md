# 🇮🇳 ExploreBharat
### Discover India. Plan Your Journey.

> **ExploreBharat — India Tourism Discovery, Intelligence & Journey Planning Platform**  
> Covering all 28 States, 8 Union Territories, UNESCO World Heritage Sites, ASI Tourist Attractions, Free-Entry Destinations, Verified Heritage Hotels, Multi-day Itineraries, Door-to-Door Multimodal Journey Routing, Digital QR Passes, and Razorpay payment flows.

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald.svg)](https://explorebharat.in)
[![Integration Tests](https://img.shields.io/badge/Tests-66%2F66%20Passed-blue.svg)](https://explorebharat.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-orange)](https://explorebharat.in)

---

## 🏛️ Executive Summary & Product Architecture

India's tourism ecosystem is traditionally fragmented across separate portals: state tourism boards, ticket websites, hotel aggregators, regional bus corporations, and local cab unions.

**ExploreBharat** unifies the entire traveler journey into a clean, modular platform backed by:
- **Web Client:** Next.js 14 App Router with Tailwind CSS, Lucide Icons, and accessible UI components.
- **Mobile Client:** React Native Expo with Expo Router cross-platform runtime for iOS and Android.
- **Backend API Gateway:** Express TypeScript modular REST API structured cleanly across 20 domain modules.
- **Database:** Prisma ORM with SQLite (development) and PostgreSQL (production).
- **Shared Types:** Unified `@bharatyatra/types` package guaranteeing compile-time type consistency.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Web** | Next.js 14.2 (App Router), React 18, Tailwind CSS, Lucide React, Radix UI primitives |
| **Mobile App** | React Native, Expo 51, Expo Router v3, React Native Reanimated |
| **Backend API** | Node.js 20+, Express 4, TypeScript 5, JSON Web Tokens (JWT), Argon2 / Bcrypt |
| **Database & ORM** | Prisma ORM 5.14, SQLite (local development), PostgreSQL 16 (production), PostGIS |
| **External Providers** | Open-Meteo (Weather), Wikimedia Commons (Images), Data.gov.in (Train Timetables), Google Places (New) |
| **DevOps & Containers** | Docker, Docker Compose, npm workspaces, GitHub Actions CI |

---

## 🚀 Quick Start & Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested with Node v20/v22)
- **npm**: v9.0.0 or higher
- **Git**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/explorebharat/explorebharat.git
cd explorebharat
npm install
```

### 2. Build Shared Types & Seed Database
```bash
# 1. Compile shared TypeScript packages
npm run build --workspace=@bharatyatra/types
npm run build --workspace=@bharatyatra/database

# 2. Push database schema and populate verified national inventory
cd packages/database
npx prisma generate
npx prisma db push
npm run seed
cd ../..
```

### 3. Run Automated Integration Test Suite
```bash
npm test --workspace=@bharatyatra/api
# ✅ 66/66 Integration Test Suites Pass Cleanly (100% Pass Rate)
```

### 4. Build All Applications
```bash
# Builds all workspaces (packages, API, and Next.js web application)
npm run build
```

### 5. Start Development Servers
Run the API gateway and Web application:

```bash
# Terminal 1: Backend API Gateway (Port 4000)
npm run dev --workspace=@bharatyatra/api

# Terminal 2: Next.js Web Client (Port 3000)
npm run dev --workspace=@bharatyatra/web

# Terminal 3: Mobile Client (Optional - Expo Metro Bundler)
npm run dev --workspace=@bharatyatra/mobile
```

- Web Application: [http://localhost:3000](http://localhost:3000)
- API Gateway: [http://localhost:4000](http://localhost:4000)
- Health Probe: [http://localhost:4000/health](http://localhost:4000/health)

---

## 🔐 Demo Credentials

The database seed provisions 3 pre-configured testing roles:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Traveler (User)** | `user@explorebharat.local` | `User@1234` | Search, Book Attractions & Hotels, Multi-day Trips, Reviews, Wallet |
| **Vendor / Partner** | `vendor@explorebharat.local` | `Vendor@1234` | Hospitality Extranet, Tariffs, Room Inventory, Reservation Ledger, Payouts |
| **Platform Admin** | `admin@explorebharat.local` | `Admin@1234` | Data Center, SHA-256 Image Integrity, Places Ingestion, Provider Health, Analytics |

---

## 🚢 Production Deployment Instructions

### Docker Production Build

ExploreBharat includes a production-ready `Dockerfile` and `docker-compose.yml`:

```bash
# Start PostgreSQL, Redis, and API Gateway containers
docker-compose up -d

# Verify containers are healthy
docker-compose ps
```

### Environment Configuration

Key environment variables in `.env`:

```ini
PORT=4000
NODE_ENV=production
DATABASE_URL=file:./dev.db # or postgresql://user:password@host:5432/explorebharat
JWT_SECRET=your-production-jwt-secret-min-32-chars
PAYMENT_PROVIDER_MODE=demo # or 'live' with RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
GOOGLE_PLACES_API_KEY= # optional live key for Google Places ingestion
```

---

## 📚 Project Documentation

- [System Architecture & Design (ARCHITECTURE.md)](ARCHITECTURE.md)
- [Contributor & Student Guide (CONTRIBUTING.md)](CONTRIBUTING.md)
- [Codebase Audit & Baseline Report (CODEBASE_AUDIT.md)](CODEBASE_AUDIT.md)
- [REST API Specifications (docs/API.md)](docs/API.md)
- [Booking State Machine & QR Engine (docs/BOOKING_ARCHITECTURE.md)](docs/BOOKING_ARCHITECTURE.md)
- [Security & OWASP Compliance (docs/SECURITY.md)](docs/SECURITY.md)

---

## 🇮🇳 Dedication
Built with pride for Indian Tourism, the Archaeological Survey of India (ASI), State Tourism Boards, and travellers worldwide.
