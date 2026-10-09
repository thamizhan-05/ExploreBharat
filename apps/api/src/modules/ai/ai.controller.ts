import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AiService } from './ai.service';
import { optionalAuth, AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();
const aiService = new AiService();

const planTripSchema = z.object({
  prompt: z.string().optional(),
  startingCity: z.string().optional(),
  destinationQuery: z.string().optional(),
  daysCount: z.number().int().min(1).max(30).optional(),
  budgetInr: z.number().positive().optional(),
  travelCompanions: z.string().optional(),
  interests: z.array(z.string()).optional()
});

router.post('/plan-trip', optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = planTripSchema.parse(req.body);
    const plan = await aiService.generateTripPlan(validated);
    res.json({
      success: true,
      data: plan,
      message: 'AI itinerary synthesized successfully.'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/recommendations', optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const recommendations = await aiService.getRecommendations({
      userId: req.user?.userId
    });
    res.json({ success: true, data: recommendations });
  } catch (err) {
    next(err);
  }
});

export const aiRouter = router;
