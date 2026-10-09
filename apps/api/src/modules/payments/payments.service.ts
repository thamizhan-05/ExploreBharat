import crypto from 'crypto';
import { prisma, parseJsonObject } from '@bharatyatra/database';
import { env } from '../../config/env';
import { AppError } from '../../middleware/error.middleware';

export interface CreateOrderParams {
  amountInr: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface IPaymentProvider {
  createOrder(params: CreateOrderParams): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    provider: string;
  }>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}

export class DemoPaymentProvider implements IPaymentProvider {
  async createOrder(params: CreateOrderParams) {
    const orderId = `order_demo_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      orderId,
      amount: Math.round(params.amountInr * 100), // in paise
      currency: 'INR',
      keyId: env.RAZORPAY_KEY_ID,
      provider: 'DEMO_RAZORPAY'
    };
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    // Cryptographically verify signature using test secret
    const expected = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return expected === signature;
  }
}

export class RazorpayPaymentProvider implements IPaymentProvider {
  async createOrder(params: CreateOrderParams) {
    const orderId = `order_rzp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      orderId,
      amount: Math.round(params.amountInr * 100),
      currency: 'INR',
      keyId: env.RAZORPAY_KEY_ID,
      provider: 'RAZORPAY'
    };
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const expected = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return expected === signature;
  }
}

export class PaymentsService {
  private provider: IPaymentProvider;

  constructor() {
    this.provider = env.PAYMENT_PROVIDER_MODE === 'live'
      ? new RazorpayPaymentProvider()
      : new DemoPaymentProvider();
  }

  async createPaymentOrder(amountInr: number, bookingRef: string, userId: string) {
    // Verify booking exists and belongs to the authenticated user
    const booking = await prisma.booking.findUnique({
      where: { bookingReference: bookingRef }
    });

    if (!booking) {
      throw new AppError('Associated booking reference not found.', 404);
    }
    if (booking.userId !== userId) {
      throw new AppError('Forbidden. You do not own this booking.', 403);
    }
    if (booking.totalAmountInr !== amountInr) {
      throw new AppError('Payment amount mismatch with booking total.', 400);
    }

    const order = await this.provider.createOrder({
      amountInr,
      currency: 'INR',
      receipt: bookingRef,
      notes: { bookingRef, userId }
    });

    // Link payment order ID to booking
    await prisma.booking.update({
      where: { bookingReference: bookingRef },
      data: {
        paymentId: order.orderId,
        paymentStatus: 'INITIATED'
      }
    });

    return order;
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string, bookingRef?: string) {
    const isValid = this.provider.verifySignature(orderId, paymentId, signature);
    if (!isValid) {
      throw new AppError('Cryptographic payment signature verification failed.', 400);
    }

    if (bookingRef) {
      const booking = await prisma.booking.findUnique({
        where: { bookingReference: bookingRef }
      });
      if (booking) {
        await prisma.booking.update({
          where: { bookingReference: bookingRef },
          data: {
            paymentStatus: 'SUCCESS',
            paymentId: paymentId
          }
        });
      }
    }

    return true;
  }

  verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
    const expected = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
    } catch {
      return false;
    }
  }

  async handleWebhookEvent(eventPayload: any, rawBody: string | Buffer, signature: string) {
    // 1. Verify cryptographic HMAC signature
    const isValid = this.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new AppError('Invalid webhook HMAC signature.', 400);
    }

    // 2. Extract event metadata & check Idempotency
    const eventId = eventPayload.id || eventPayload.event_id || `evt_${crypto.createHash('md5').update(typeof rawBody === 'string' ? rawBody : rawBody.toString()).digest('hex')}`;
    const eventType = eventPayload.event || 'unknown';

    const existingEvent = await prisma.paymentWebhookEvent.findUnique({
      where: { eventId }
    });

    if (existingEvent) {
      return {
        success: true,
        message: 'Webhook event already processed (idempotent duplicate)',
        eventId,
        duplicate: true
      };
    }

    // 3. Process Event Types
    let paymentId: string | undefined;
    let orderId: string | undefined;
    let amountInr: number | undefined;

    const paymentEntity = eventPayload?.payload?.payment?.entity;
    if (paymentEntity) {
      paymentId = paymentEntity.id;
      orderId = paymentEntity.order_id;
      amountInr = paymentEntity.amount ? paymentEntity.amount / 100 : undefined;
    }

    const bookingRef = paymentEntity?.notes?.bookingRef;

    if (eventType === 'payment.captured') {
      let booking = bookingRef
        ? await prisma.booking.findUnique({ where: { bookingReference: bookingRef } })
        : null;

      if (!booking && paymentId) {
        booking = await prisma.booking.findFirst({ where: { paymentId } });
      }

      if (booking) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            paymentStatus: 'SUCCESS',
            status: 'CONFIRMED',
            paymentId: paymentId || booking.paymentId
          }
        });

        await prisma.auditLog.create({
          data: {
            action: 'PAYMENT_CAPTURED',
            entityType: 'BOOKING',
            entityId: booking.id,
            details: `Razorpay Webhook: payment captured for booking ${booking.bookingReference}`,
            changes: JSON.stringify({ eventId, paymentId, amountInr })
          }
        });
      }
    } else if (eventType === 'payment.failed') {
      let booking = bookingRef
        ? await prisma.booking.findUnique({ where: { bookingReference: bookingRef } })
        : null;

      if (!booking && paymentId) {
        booking = await prisma.booking.findFirst({ where: { paymentId } });
      }

      if (booking) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            paymentStatus: 'FAILED'
          }
        });

        await prisma.auditLog.create({
          data: {
            action: 'PAYMENT_FAILED',
            entityType: 'BOOKING',
            entityId: booking.id,
            details: `Razorpay Webhook: payment failed for booking ${booking.bookingReference}`,
            changes: JSON.stringify({ eventId, paymentId })
          }
        });
      }
    } else if (eventType === 'refund.processed') {
      const refundEntity = eventPayload?.payload?.refund?.entity;
      const refundPaymentId = refundEntity?.payment_id || paymentId;

      let booking = refundPaymentId
        ? await prisma.booking.findFirst({ where: { paymentId: refundPaymentId } })
        : null;

      if (booking) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            paymentStatus: 'REFUNDED',
            status: 'CANCELLED'
          }
        });

        await prisma.auditLog.create({
          data: {
            action: 'REFUND_PROCESSED',
            entityType: 'BOOKING',
            entityId: booking.id,
            details: `Razorpay Webhook: refund processed for booking ${booking.bookingReference}`,
            changes: JSON.stringify({ eventId, refundPaymentId })
          }
        });
      }
    }

    // 4. Record PaymentWebhookEvent for idempotency
    await prisma.paymentWebhookEvent.create({
      data: {
        eventId,
        eventType,
        paymentId: paymentId || null,
        orderId: orderId || null,
        amount: amountInr || null,
        status: 'PROCESSED',
        payload: JSON.stringify(eventPayload)
      }
    });

    return {
      success: true,
      message: `Webhook event "${eventType}" processed successfully`,
      eventId,
      duplicate: false
    };
  }
}

