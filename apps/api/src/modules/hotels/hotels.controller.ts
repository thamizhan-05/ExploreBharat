import { Router, Request, Response, NextFunction } from 'express';
import { HotelsService } from './hotels.service';

const router = Router();
const hotelsService = new HotelsService();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cityId, tier, minRating, maxPrice, search, page, limit } = req.query;
    const result = await hotelsService.getHotels({
      cityId: cityId as string,
      tier: tier as string,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      search: search as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20
    });
    res.json({ success: true, data: result.items, meta: { total: result.total, page: result.page, totalPages: result.totalPages } });
  } catch (err) {
    next(err);
  }
});

router.get('/near-attraction/:attractionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const hotels = await hotelsService.getHotelsNearAttraction(req.params.attractionId, limit);
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotel = await hotelsService.getHotelById(req.params.id);
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
});

export const hotelsRouter = router;
