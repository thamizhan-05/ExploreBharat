import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PaymentsService } from './payments.service';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';
import { paymentLimiter } from '../../middleware/rate-limit.middleware';

const router = Router();
const paymentsService = new PaymentsService();

const createOrderSchema = z.object({
  amountInr: z.number().positive(),
  bookingRef: z.string()
});

const verifySchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
  bookingRef: z.string().optional()
});

router.post('/create-order', paymentLimiter, authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = createOrderSchema.parse(req.body);
    const order = await paymentsService.createPaymentOrder(validated.amountInr, validated.bookingRef, req.user!.userId);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

router.post('/verify', paymentLimiter, authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = verifySchema.parse(req.body);
    const isValid = await paymentsService.verifyPayment(
      validated.orderId,
      validated.paymentId,
      validated.signature,
      validated.bookingRef
    );
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }
    res.json({ success: true, message: 'Payment verified successfully.' });
  } catch (err) {
    next(err);
  }
});

router.post('/webhook', async (req: any, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature header.' });
    }

    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const result = await paymentsService.handleWebhookEvent(req.body, rawBody, signature);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export const paymentsRouter = router;
