import { Router, Request, Response, NextFunction } from 'express';
import { TransportService } from './transport.service';

const router = Router();
const transportService = new TransportService();

// 1. Flights Search
router.get('/flights', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { origin, destination, date, returnDate, travellers, travelClass } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination are required for flight search.'
      });
    }

    const data = await transportService.searchFlights({
      origin: origin as string,
      destination: destination as string,
      date: (date as string) || new Date().toISOString().split('T')[0],
      returnDate: returnDate as string,
      travellers: travellers ? parseInt(travellers as string, 10) : 1,
      travelClass: travelClass as string
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// 2. Trains Search
router.get('/trains', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { origin, destination, date } = req.query;
    const data = await transportService.searchTrains({
      origin: origin as string,
      destination: destination as string,
      date: date as string
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// 2.1 PNR Status Lookup
router.get('/pnr/:pnr', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transportService.lookupPnr(req.params.pnr);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 2.2 Live Train Running Status
router.get('/live-status/:trainNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transportService.getLiveTrainStatus(req.params.trainNumber);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// 3. Buses Search
router.get('/buses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { origin, destination, date } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination are required for bus search.'
      });
    }
    const data = await transportService.searchBuses({
      origin: origin as string,
      destination: destination as string,
      date: (date as string) || new Date().toISOString().split('T')[0]
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// 4. Cab / Auto Metered Quote Calculator
router.get('/cabs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceType, distanceKm, hours, origin, destination } = req.query;
    const dist = distanceKm ? parseFloat(distanceKm as string) : 10;
    
    const data = await transportService.calculateCabQuote({
      serviceType: (serviceType as any) || 'POINT_TO_POINT',
      distanceKm: dist,
      hours: hours ? parseInt(hours as string, 10) : 4,
      origin: origin as string,
      destination: destination as string
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export const transportRouter = router;
