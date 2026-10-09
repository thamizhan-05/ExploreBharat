import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';

import { generalLimiter, authLimiter, aiAndSearchLimiter } from './middleware/rate-limit.middleware';
import { authRouter } from './modules/auth/auth.controller';
import { destinationsRouter } from './modules/destinations/destinations.controller';
import { attractionsRouter } from './modules/attractions/attractions.controller';
import { hotelsRouter } from './modules/hotels/hotels.controller';
import { ticketsRouter } from './modules/tickets/tickets.controller';
import { bookingsRouter } from './modules/bookings/bookings.controller';
import { tripsRouter } from './modules/trips/trips.controller';
import { aiRouter } from './modules/ai/ai.controller';
import { circuitsRouter } from './modules/circuits/circuits.controller';
import { searchRouter } from './modules/search/search.controller';
import { reviewsRouter } from './modules/reviews/reviews.controller';
import { paymentsRouter } from './modules/payments/payments.controller';
import { adminRouter } from './modules/admin/admin.controller';
import { vendorsRouter } from './modules/vendors/vendors.controller';
import { eventsRouter } from './modules/events/events.controller';
import { journeysRouter } from './modules/journeys/journeys.controller';
import { transportRouter } from './modules/transport/transport.controller';
import { walletRouter } from './modules/wallet/wallet.controller';
import { passportRouter } from './modules/passport/passport.controller';
import { analyticsRouter } from './modules/analytics/analytics.controller';

const app = express();

// Security and utility middlewares
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature']
}));
app.use(express.json({
  limit: '10mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global rate limiter for API endpoints (exempting health check)
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ExploreBharat Core API Gateway',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: env.NODE_ENV
  });
});

// Helper to mount all domain modules onto a router
function registerModularRoutes(router: express.Router) {
  router.use('/auth', authLimiter, authRouter);
  router.use('/destinations', destinationsRouter);
  router.use('/attractions', attractionsRouter);
  router.use('/hotels', hotelsRouter);
  router.use('/tickets', ticketsRouter);
  router.use('/bookings', bookingsRouter);
  router.use('/trips', tripsRouter);
  router.use('/ai', aiAndSearchLimiter, aiRouter);
  router.use('/circuits', circuitsRouter);
  router.use('/search', aiAndSearchLimiter, searchRouter);
  router.use('/reviews', reviewsRouter);
  router.use('/payments', paymentsRouter);
  router.use('/admin', adminRouter);
  router.use('/vendors', vendorsRouter);
  router.use('/events', eventsRouter);
  router.use('/journeys', journeysRouter);
  router.use('/transport', transportRouter);
  router.use('/wallet', walletRouter);
  router.use('/passport', passportRouter);
  router.use('/analytics', analyticsRouter);
}

// Mount versioned v1 API (/api/v1/...)
const v1Router = express.Router();
registerModularRoutes(v1Router);
app.use('/api/v1', generalLimiter, v1Router);

// Mount standard API (/api/...) for backward compatibility
const standardApiRouter = express.Router();
registerModularRoutes(standardApiRouter);
app.use('/api', generalLimiter, standardApiRouter);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: [${req.method}] ${req.originalUrl}`
  });
});

// Centralized Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`🚀 ExploreBharat API Gateway running at http://localhost:${env.PORT}`);
    console.log(`📍 Health Check: http://localhost:${env.PORT}/health`);
  });
}

export default app;
