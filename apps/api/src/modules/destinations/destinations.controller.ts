import { Router, Request, Response, NextFunction } from 'express';
import { DestinationsService } from './destinations.service';

const router = Router();
const destinationsService = new DestinationsService();

router.get('/states', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const states = await destinationsService.getAllStates();
    res.json({ success: true, data: states });
  } catch (err) {
    next(err);
  }
});

router.get('/states/:idOrCode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const state = await destinationsService.getState(req.params.idOrCode);
    res.json({ success: true, data: state });
  } catch (err) {
    next(err);
  }
});

router.get('/cities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stateId, popular, search } = req.query;
    const cities = await destinationsService.getCities({
      stateId: stateId as string,
      popularOnly: popular === 'true',
      search: search as string
    });
    res.json({ success: true, data: cities });
  } catch (err) {
    next(err);
  }
});

router.get('/cities/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = await destinationsService.getCityById(req.params.id);
    res.json({ success: true, data: city });
  } catch (err) {
    next(err);
  }
});

router.get('/cities/:id/weather', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const weather = await destinationsService.getDestinationWeather(req.params.id);
    res.json({ success: true, data: weather });
  } catch (err) {
    next(err);
  }
});

router.get('/cities/:id/free-attractions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attractions = await destinationsService.getCityFreeAttractions(req.params.id);
    res.json({ success: true, data: attractions });
  } catch (err) {
    next(err);
  }
});

router.get('/cities/:id/food', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const food = await destinationsService.getCityFood(req.params.id);
    res.json({ success: true, data: food });
  } catch (err) {
    next(err);
  }
});

router.get('/cities/:id/events', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await destinationsService.getCityEvents(req.params.id);
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
});

router.get('/cities/:id/emergency', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emergency = await destinationsService.getCityEmergency(req.params.id);
    res.json({ success: true, data: emergency });
  } catch (err) {
    next(err);
  }
});

export const destinationsRouter = router;

