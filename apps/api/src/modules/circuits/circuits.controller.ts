import { Router, Request, Response, NextFunction } from 'express';
import { CircuitsService } from './circuits.service';

const router = Router();
const circuitsService = new CircuitsService();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const circuits = await circuitsService.getAllCircuits();
    res.json({ success: true, data: circuits });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const circuit = await circuitsService.getCircuitBySlug(req.params.slug);
    res.json({ success: true, data: circuit });
  } catch (err) {
    next(err);
  }
});

export const circuitsRouter = router;
