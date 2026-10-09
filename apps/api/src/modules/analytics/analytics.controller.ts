import { Router, Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';
import { authenticate, requireRoles } from '../../middleware/auth.middleware';

export const analyticsRouter = Router();

// POST /api/analytics/track
analyticsRouter.post('/track', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventName, entityType, entityId, properties, sessionId } = req.body;
    if (!eventName) {
      return res.status(400).json({ success: false, message: 'eventName is required' });
    }

    const userId = (req as any).user?.id || req.body.userId;
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await analyticsService.trackEvent({
      eventName,
      userId,
      sessionId,
      entityType,
      entityId,
      properties,
      ipAddress,
      userAgent
    });

    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/dashboard (ADMIN only)
analyticsRouter.get('/dashboard', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getDashboardAnalytics();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/funnel (ADMIN only)
analyticsRouter.get('/funnel', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getFunnelMetrics();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/top-trends (ADMIN only)
analyticsRouter.get('/top-trends', authenticate, requireRoles('ADMIN', 'SUPER_ADMIN'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getTopTrends();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});
