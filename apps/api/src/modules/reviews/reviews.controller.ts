import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ReviewsService } from './reviews.service';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();
const reviewsService = new ReviewsService();

const createReviewSchema = z.object({
  targetType: z.enum(['ATTRACTION', 'HOTEL', 'ACTIVITY', 'RESTAURANT']),
  targetId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3),
  comment: z.string().min(10),
  photos: z.array(z.string()).optional()
});

router.get('/:targetType/:targetId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewsService.getReviewsForTarget(req.params.targetType, req.params.targetId);
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = createReviewSchema.parse(req.body);
    const review = await reviewsService.submitReview({
      ...validated,
      userId: req.user!.userId
    });
    res.status(201).json({ success: true, data: review, message: 'Review published successfully.' });
  } catch (err) {
    next(err);
  }
});

export const reviewsRouter = router;
