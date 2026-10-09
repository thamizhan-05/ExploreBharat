# ExploreBharat Automated Test Strategy & Verification

## 1. Test Overview

ExploreBharat incorporates automated integration tests covering the full traveler and administrator journeys:

```bash
cd apps/api
npm test
```

## 2. Test Execution Matrix

| # | Test Case Description | Verified Behavior |
| :--- | :--- | :--- |
| 1 | Health check endpoint | Confirms HTTP 200 and database connectivity status |
| 2 | User authentication | Validates Bcrypt/Argon2 password verification and JWT issuance |
| 3 | Admin authentication | Validates administrative privileges and claim issuance |
| 4 | RBAC restriction | Asserts standard travelers receive HTTP 403 Forbidden on `/api/admin/*` |
| 5 | Admin authorization | Asserts administrator successfully receives platform metrics |
| 6 | Global catalog search | Queries full-text indices for terms like "Amber" across cities and monuments |
| 7 | Autocomplete suggestions | Confirms fast prefix search returns formatted suggestion chips |
| 8 | Attraction details | Confirms payload includes schedules, verified sources, and nearby hotels |
| 9 | Hotel discovery | Confirms room inventory and star ratings in Jaipur |
| 10 | Attraction ticket booking | Tests transactional inventory deduction and cryptographic QR pass generation |
| 11 | Hotel room booking | Validates multi-night rate calculations and reservation vouchers |
| 12 | Trip creation | Confirms creation of multi-day trip containers with budget limits |
| 13 | Itinerary addition | Adds attraction to Day 1 with morning slot and estimated cost |
| 14 | AI Trip Planner | Confirms natural-language parsing and deterministic cost calculation |
| 15 | Payment order & verification | Generates Razorpay order and validates cryptographic signature |
| 16 | Booking cancellation | Checks cancellation policy, updates status to CANCELLED, records refund |
| 17 | Social review submission | Validates verified traveler star rating and comment publication |
