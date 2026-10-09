# ExploreBharat Environment Configuration Guide

This document describes all environment variables used by the ExploreBharat monorepo services.

## Core Variables

| Variable | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | No | `development` | Runtime environment (`development`, `production`, `test`) |
| `PORT` | No | `4000` | HTTP port for the Backend API Gateway |
| `DATABASE_URL` | Yes | `file:./dev.db` (Local) / `postgresql://...` (Prod) | Connection string for Prisma ORM |
| `JWT_SECRET` | Yes | `bharat_yatra_jwt_secret_dev_key_2026` | Cryptographic secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Yes | `bharat_yatra_jwt_refresh_dev_key_2026` | Secret for refreshing expired JWT tokens |
| `FRONTEND_URL` | No | `http://localhost:3000` | Whitelisted Web Client origin for CORS |
| `DEMO_MODE` | No | `true` | When true, enables built-in demo payment/booking providers |

## External Integrations

| Variable | Provider | Purpose |
| :--- | :--- | :--- |
| `RAZORPAY_KEY_ID` | Razorpay | Live/Test API key identifier |
| `RAZORPAY_KEY_SECRET` | Razorpay | Merchant secret for HMAC verification |
| `MAPS_API_KEY` | Mapbox / Google | Interactive vector map tiles and routing |
| `WEATHER_API_KEY` | OpenWeather / IMD | Live destination forecasts and alerts |
| `AI_API_KEY` | Gemini / OpenAI | Advanced LLM itinerary generation |
| `STORAGE_BUCKET_URL` | Cloudinary / S3 / R2 | Media gallery uploads and document storage |
