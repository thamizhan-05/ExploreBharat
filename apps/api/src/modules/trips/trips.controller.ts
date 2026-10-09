import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TripsService } from './trips.service';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();
const tripsService = new TripsService();

const createTripSchema = z.object({
  title: z.string().min(3),
  destination: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
  companions: z.string().optional(),
  allocatedBudgetInr: z.number().positive().optional(),
  transportPreference: z.string().optional(),
  daysCount: z.number().int().min(1).max(30).optional()
});

const addItemSchema = z.object({
  tripDayId: z.string().uuid(),
  timeSlot: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
  title: z.string(),
  type: z.enum(['ATTRACTION', 'HOTEL', 'RESTAURANT', 'ACTIVITY', 'TRANSIT']),
  targetId: z.string().optional(),
  placeName: z.string(),
  durationMinutes: z.number().int().optional(),
  estimatedCostInr: z.number().optional(),
  travelTimeMinutes: z.number().int().optional(),
  notes: z.string().optional()
});

router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = createTripSchema.parse(req.body);
    const trip = await tripsService.createTrip({
      ...validated,
      userId: req.user!.userId
    });
    res.status(201).json({ success: true, data: trip, message: 'Trip itinerary created successfully.' });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const trips = await tripsService.getUserTrips(req.user!.userId);
    res.json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const trip = await tripsService.getTripById(req.params.id, req.user!.userId);
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/items', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = addItemSchema.parse(req.body);
    const item = await tripsService.addItemToDay(req.params.id, req.user!.userId, validated);
    res.status(201).json({ success: true, data: item, message: 'Item added to trip itinerary.' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/items/:itemId', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await tripsService.removeItem(req.params.id, req.user!.userId, req.params.itemId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/optimize-schedule', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await tripsService.optimizeTripSchedule(req.params.id, req.user!.userId);
    res.json({ success: true, data: result, message: 'Trip schedule optimized without backtracking.' });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/optimize-budget', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await tripsService.optimizeTripBudget(req.params.id, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export const tripsRouter = router;
