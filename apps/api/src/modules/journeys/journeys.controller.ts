import { Router, Request, Response, NextFunction } from 'express';
import { MultimodalPlannerService } from '../../services/multimodal-planner.service';
import { RailProvider } from '../../services/providers/rail.provider';
import { TaxiFareProvider } from '../../services/providers/taxi-fare.provider';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();
const plannerService = new MultimodalPlannerService();
const railProvider = new RailProvider();
const taxiFareProvider = new TaxiFareProvider();

/**
 * POST /api/journeys/plan
 * Generates an end-to-end multimodal door-to-door itinerary
 */
router.post('/plan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const origin = req.body.origin;
    const originLatitude = req.body.originLatitude;
    const originLongitude = req.body.originLongitude;
    const destination = req.body.destination;
    const startDate = req.body.startDate || req.body.travelDate;
    const endDate = req.body.endDate || req.body.returnDate;
    const travellersCount = req.body.travellersCount || req.body.travellers || 1;
    const travellerType = req.body.travellerType || 'solo';
    const budgetInr = req.body.budgetInr || req.body.budget || 20000;
    const transportPreference = req.body.transportPreference || req.body.travelPreference || 'balanced';
    const walkingPreference = req.body.walkingPreference || 'moderate';
    const maxTransfers = req.body.maxTransfers !== undefined ? req.body.maxTransfers : 2;
    const hotelTier = req.body.hotelTier || req.body.hotelPreference || 'heritage';
    const attractionPreferences = req.body.attractionPreferences || [];
    const userId = req.body.userId || (req as any).user?.id;

    if (!origin || !destination || !startDate) {
      res.status(400).json({
        success: false,
        message: 'Origin, destination, and travel startDate are required.'
      });
      return;
    }

    const journeyPlan = await plannerService.generateSmartJourney({
      origin,
      originLatitude: originLatitude ? parseFloat(originLatitude) : undefined,
      originLongitude: originLongitude ? parseFloat(originLongitude) : undefined,
      destination,
      startDate,
      endDate,
      travellersCount: travellersCount ? parseInt(travellersCount, 10) : 1,
      travellerType,
      budgetInr: budgetInr ? parseFloat(budgetInr) : undefined,
      transportPreference,
      walkingPreference,
      maxTransfers: maxTransfers ? parseInt(maxTransfers, 10) : 3,
      hotelTier,
      attractionPreferences,
      userId
    });

    res.json({
      success: true,
      data: journeyPlan,
      message: 'Door-to-door multimodal journey calculated successfully.'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/journeys/trains
 * Returns authentic verified trains between two cities
 */
router.get('/trains', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      res.status(400).json({
        success: false,
        message: 'Both origin and destination city query parameters are required.'
      });
      return;
    }

    const trains = railProvider.getAvailableTrains(origin as string, destination as string);
    res.json({
      success: true,
      data: trains,
      meta: {
        source: 'Indian Railways Official Timetable Registry',
        count: trains.length
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/journeys/fare-estimate
 * Returns local metered auto or cab fare estimate with formula breakdown
 */
router.get('/fare-estimate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { originLat, originLng, destLat, destLng, mode } = req.query;
    if (!originLat || !originLng || !destLat || !destLng) {
      res.status(400).json({
        success: false,
        message: 'originLat, originLng, destLat, destLng are required.'
      });
      return;
    }

    const leg = await taxiFareProvider.computeLeg(
      { name: 'Origin Point', latitude: parseFloat(originLat as string), longitude: parseFloat(originLng as string) },
      { name: 'Destination Point', latitude: parseFloat(destLat as string), longitude: parseFloat(destLng as string) },
      { preferredMode: mode as string }
    );

    res.json({
      success: true,
      data: leg
    });
  } catch (err) {
    next(err);
  }
});

export const journeysRouter = router;
