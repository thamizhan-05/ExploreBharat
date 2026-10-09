import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { VendorsService } from './vendors.service';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();
const vendorsService = new VendorsService();

const registerVendorSchema = z.object({
  businessName: z.string().min(3),
  contactPhone: z.string().min(10),
  address: z.string().min(5),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional()
});

const updateHotelSchema = z.object({
  startingPriceInr: z.number().positive().optional(),
  availabilityStatus: z.enum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE']).optional(),
  cancellationPolicy: z.string().min(5).optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional()
});

const updateRoomSchema = z.object({
  basePriceInr: z.number().positive().optional(),
  availableCount: z.number().int().min(0).optional(),
  title: z.string().min(2).optional(),
  includesBreakfast: z.boolean().optional()
});

router.post('/register', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = registerVendorSchema.parse(req.body);
    const vendor = await vendorsService.registerVendor(req.user!.userId, validated);
    res.status(201).json({
      success: true,
      data: vendor,
      message: 'Vendor application submitted for verification.'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/profile', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const vendor = await vendorsService.getVendorProfile(req.user!.userId);
    res.json({ success: true, data: vendor });
  } catch (err) {
    next(err);
  }
});

router.get('/inventory', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const inventory = await vendorsService.getVendorInventory(req.user!.userId);
    res.json({ success: true, data: inventory });
  } catch (err) {
    next(err);
  }
});

router.patch('/hotels/:hotelId', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = updateHotelSchema.parse(req.body);
    const updated = await vendorsService.updateHotelTariff(
      req.user!.userId,
      req.params.hotelId,
      validated,
      req.user!.role
    );
    res.json({
      success: true,
      data: updated,
      message: 'Hotel tariffs and availability updated successfully.'
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/hotels/:hotelId/rooms/:roomId', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = updateRoomSchema.parse(req.body);
    const updated = await vendorsService.updateRoom(
      req.user!.userId,
      req.params.hotelId,
      req.params.roomId,
      validated,
      req.user!.role
    );
    res.json({
      success: true,
      data: updated,
      message: 'Room details updated successfully.'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/bookings', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const bookings = await vendorsService.getVendorBookings(req.user!.userId);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
});

router.get('/financials', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const financials = await vendorsService.getVendorFinancials(req.user!.userId);
    res.json({ success: true, data: financials });
  } catch (err) {
    next(err);
  }
});

export const vendorsRouter = router;
