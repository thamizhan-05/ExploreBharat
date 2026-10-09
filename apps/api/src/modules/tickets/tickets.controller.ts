import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TicketsService } from './tickets.service';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();
const ticketsService = new TicketsService();

const bookTicketSchema = z.object({
  attractionId: z.string().uuid(),
  ticketTypeId: z.string(),
  visitDate: z.string(),
  timeSlot: z.string(),
  quantity: z.number().int().min(1).max(20),
  isForeigner: z.boolean().optional(),
  couponCode: z.string().optional()
});

router.post('/book', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = bookTicketSchema.parse(req.body);
    const result = await ticketsService.bookTicket({
      ...validated,
      userId: req.user!.userId
    });
    res.status(201).json({
      success: true,
      data: result,
      message: 'Attraction ticket booked successfully.'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/slots', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { attractionId, date } = req.query;
    if (!attractionId || !date) {
      return res.status(400).json({ success: false, message: 'attractionId and date are required.' });
    }
    const slots = await ticketsService.getTicketSlots(attractionId as string, date as string);
    res.json({ success: true, data: slots });
  } catch (err) {
    next(err);
  }
});

export const ticketsRouter = router;
