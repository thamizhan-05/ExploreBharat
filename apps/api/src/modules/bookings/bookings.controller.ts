import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BookingsService } from './bookings.service';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();
const bookingsService = new BookingsService();

const bookHotelSchema = z.object({
  hotelId: z.string().uuid(),
  roomId: z.string().uuid(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  guestCount: z.number().int().min(1).max(10),
  specialRequests: z.string().optional()
});

router.post('/hotel', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = bookHotelSchema.parse(req.body);
    const result = await bookingsService.bookHotel({
      ...validated,
      userId: req.user!.userId
    });
    res.status(201).json({
      success: true,
      data: result,
      message: 'Hotel reservation confirmed.'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const bookings = await bookingsService.getUserBookings(req.user!.userId);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user!.role === 'ADMIN' || req.user!.role === 'SUPER_ADMIN';
    const booking = await bookingsService.getBookingById(req.params.id, req.user!.userId, isAdmin);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/cancel', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await bookingsService.cancelBooking(req.params.id, req.user!.userId, req.body.reason);
    res.json({
      success: true,
      data: result,
      message: 'Booking cancelled successfully. Refund initiated.'
    });
  } catch (err) {
    next(err);
  }
});

export const bookingsRouter = router;
