import { Router, Request, Response, NextFunction } from 'express';
import { SearchService } from './search.service';

const router = Router();
const searchService = new SearchService();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
    const results = await searchService.globalSearch(q, limit);
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
});

router.get('/autocomplete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const term = (req.query.q as string) || '';
    const suggestions = await searchService.autocomplete(term);
    res.json({ success: true, data: suggestions });
  } catch (err) {
    next(err);
  }
});

router.get('/smart-query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    const result = await searchService.smartQuerySearch(q);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

router.get('/wikimedia-photos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = (req.query.query as string) || (req.query.q as string) || '';
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
    const photos = await searchService.searchWikimediaPhotos(query, limit);
    res.json({
      success: true,
      data: photos,
      source: 'Wikimedia Commons API (100% Free & CC Licensed)',
      query
    });
  } catch (err) {
    next(err);
  }
});

export const searchRouter = router;
