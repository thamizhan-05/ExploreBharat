import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { WalletService } from './wallet.service';

const router = Router();
const walletService = new WalletService();

router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await walletService.getUserWallet(req.user!.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/passes/:reference', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await walletService.getPassByReference(req.user!.userId, req.params.reference);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export const walletRouter = router;
