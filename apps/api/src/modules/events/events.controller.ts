import { Router, Request, Response, NextFunction } from 'express';
import { EventsService } from './events.service';

const router = Router();
const eventsService = new EventsService();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cityId, cityName, stateCode, category, search, featured, limit } = req.query;
    const events = await eventsService.getEvents({
      cityId: cityId as string,
      cityName: cityName as string,
      stateCode: stateCode as string,
      category: category as string,
      search: search as string,
      featuredOnly: featured === 'true',
      limit: limit ? parseInt(limit as string, 10) : 20
    });
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventsService.getEventById(req.params.id);
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
});

export const eventsRouter = router;
