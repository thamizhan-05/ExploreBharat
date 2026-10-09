import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { PassportService } from './passport.service';

const router = Router();
const passportService = new PassportService();

router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await passportService.getUserPassport(req.user!.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export const passportRouter = router;
