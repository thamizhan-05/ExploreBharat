import { prisma, parseJsonObject } from '@bharatyatra/database';
import { AppError } from '../../middleware/error.middleware';

export interface TicketBookingRequest {
  userId: string;
  attractionId: string;
  ticketTypeId: string;
  visitDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 - 12:00"
  quantity: number;
  isForeigner?: boolean;
  couponCode?: string;
}

export interface TicketBookingResult {
  bookingReference: string;
  title: string;
  totalAmountInr: number;
  taxAmountInr: number;
  convenienceFeeInr: number;
  qrCodePayload: string;
  providerType: string;
  providerBookingId: string;
}

export interface IBookingProvider {
  name: string;
  supports(attractionSourceType: string): boolean;
  checkAvailability(attractionId: string, date: string, timeSlot: string, quantity: number): Promise<boolean>;
  reserveTicket(request: TicketBookingRequest, ticketType: any, attraction: any): Promise<TicketBookingResult>;
}

export class InternalBookingProvider implements IBookingProvider {
  name = 'InternalBookingProvider';

  supports(sourceType: string): boolean {
    return sourceType === 'INTERNAL' || sourceType === 'COMMUNITY' || !sourceType;
  }

  async checkAvailability(attractionId: string, date: string, timeSlot: string, quantity: number): Promise<boolean> {
    const slot = await prisma.ticketSlot.findUnique({
      where: {
        attractionId_date_timeSlot: {
          attractionId,
          date,
          timeSlot
        }
      }
    });

    if (!slot) return true; // Default capacity available if not constrained
    return slot.bookedCount + quantity <= slot.capacity;
  }

  async reserveTicket(request: TicketBookingRequest, ticketType: any, attraction: any): Promise<TicketBookingResult> {
    const basePrice = request.isForeigner ? ticketType.foreignerPriceInr : ticketType.priceInr;
    const subtotal = basePrice * request.quantity;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const convenienceFee = request.quantity > 0 ? 20 : 0;
    const total = subtotal + tax + convenienceFee;

    const ref = `BY-TKT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const qrPayload = JSON.stringify({
      ref,
      attraction: attraction.name,
      date: request.visitDate,
      slot: request.timeSlot,
      quantity: request.quantity,
      ticketType: ticketType.name,
      provider: 'ExploreBharat-Internal',
      signature: `SIG_${Buffer.from(ref + request.visitDate).toString('base64').substring(0, 16)}`
    });

    // Update slot booked count if slot exists
    try {
      await prisma.ticketSlot.updateMany({
        where: {
          attractionId: attraction.id,
          date: request.visitDate,
          timeSlot: request.timeSlot
        },
        data: {
          bookedCount: { increment: request.quantity }
        }
      });
    } catch {
      // Slot tracking is optional
    }

    return {
      bookingReference: ref,
      title: `${attraction.name} - ${ticketType.name} (x${request.quantity})`,
      totalAmountInr: total,
      taxAmountInr: tax,
      convenienceFeeInr: convenienceFee,
      qrCodePayload: qrPayload,
      providerType: 'INTERNAL',
      providerBookingId: `INT-${ref}`
    };
  }
}

export class GovernmentAsiProvider implements IBookingProvider {
  name = 'GovernmentAsiProvider';

  supports(sourceType: string): boolean {
    return sourceType === 'ASI' || sourceType === 'GOVT_TOURISM';
  }

  async checkAvailability(_attractionId: string, _date: string, _timeSlot: string, quantity: number): Promise<boolean> {
    // Simulated live ASI API query
    return quantity <= 10;
  }

  async reserveTicket(request: TicketBookingRequest, ticketType: any, attraction: any): Promise<TicketBookingResult> {
    const basePrice = request.isForeigner ? ticketType.foreignerPriceInr : ticketType.priceInr;
    const subtotal = basePrice * request.quantity;
    const tax = Math.round(subtotal * 0.05);
    const convenienceFee = 25; // Government gateway fee
    const total = subtotal + tax + convenienceFee;

    const asiRef = `ASI-GOV-${Date.now().toString(36).toUpperCase()}`;

    const qrPayload = JSON.stringify({
      ref: asiRef,
      monument: attraction.name,
      date: request.visitDate,
      timeSlot: request.timeSlot,
      passengers: request.quantity,
      verificationAuthority: 'ASI-Ministry-of-Culture',
      signature: `ASI_GOV_VERIFIED_${Date.now()}`
    });

    return {
      bookingReference: asiRef,
      title: `ASI Official Pass: ${attraction.name} (${ticketType.name})`,
      totalAmountInr: total,
      taxAmountInr: tax,
      convenienceFeeInr: convenienceFee,
      qrCodePayload: qrPayload,
      providerType: 'GOVERNMENT_ASI',
      providerBookingId: `GOV-${asiRef}`
    };
  }
}

export class BookingProviderRegistry {
  private providers: IBookingProvider[] = [
    new GovernmentAsiProvider(),
    new InternalBookingProvider()
  ];

  getProvider(sourceType: string): IBookingProvider {
    const matched = this.providers.find((p) => p.supports(sourceType));
    return matched || this.providers[this.providers.length - 1];
  }
}

export class TicketsService {
  private registry = new BookingProviderRegistry();

  async bookTicket(req: TicketBookingRequest) {
    const attraction = await prisma.attraction.findUnique({
      where: { id: req.attractionId },
      include: { ticketTypes: true }
    });
    if (!attraction) throw new AppError('Attraction not found.', 404);

    if (!attraction.ticketRequired || attraction.entryType === 'FREE') {
      throw new AppError('This tourist attraction has free entry. No ticket or advance booking is required.', 400);
    }

    const ticketType = attraction.ticketTypes.find((t) => t.id === req.ticketTypeId);
    if (!ticketType) throw new AppError('Invalid ticket type selected.', 400);

    const provider = this.registry.getProvider(attraction.sourceType);
    const isAvailable = await provider.checkAvailability(attraction.id, req.visitDate, req.timeSlot, req.quantity);
    if (!isAvailable) {
      throw new AppError('Requested time slot has exceeded capacity. Please choose another slot.', 409);
    }

    const reservation = await provider.reserveTicket(req, ticketType, attraction);

    // Create unified booking record
    const booking = await prisma.booking.create({
      data: {
        bookingReference: reservation.bookingReference,
        userId: req.userId,
        bookingType: 'ATTRACTION_TICKET',
        status: 'CONFIRMED',
        title: reservation.title,
        location: `${attraction.name}, India`,
        checkInDate: req.visitDate,
        slotTime: req.timeSlot,
        guestCount: req.quantity,
        totalAmountInr: reservation.totalAmountInr,
        taxAmountInr: reservation.taxAmountInr,
        convenienceFeeInr: reservation.convenienceFeeInr,
        qrCodeData: reservation.qrCodePayload,
        paymentStatus: 'SUCCESS',
        paymentId: `pay_auto_${Date.now()}`,
        details: JSON.stringify({
          attractionId: attraction.id,
          attractionSlug: attraction.slug,
          ticketTypeId: ticketType.id,
          ticketTypeName: ticketType.name,
          providerType: reservation.providerType,
          providerBookingId: reservation.providerBookingId
        })
      }
    });

    // Send in-app notification
    await prisma.notification.create({
      data: {
        userId: req.userId,
        title: `Ticket Confirmed: ${attraction.name}`,
        message: `Your ExploreBharat booking ${booking.bookingReference} for ${req.quantity} guest(s) on ${req.visitDate} (${req.timeSlot}) is confirmed. Thank you for using ExploreBharat.`,
        type: 'BOOKING',
        link: `/bookings/${booking.id}`
      }
    });

    return {
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      status: booking.status,
      title: booking.title,
      date: booking.checkInDate,
      slotTime: booking.slotTime,
      guestCount: booking.guestCount,
      totalAmountInr: booking.totalAmountInr,
      qrCodeData: booking.qrCodeData,
      details: parseJsonObject(booking.details)
    };
  }

  async getTicketSlots(attractionId: string, date: string) {
    const slots = await prisma.ticketSlot.findMany({
      where: {
        attractionId,
        date
      }
    });

    if (slots.length === 0) {
      // Default daily slots
      return [
        { timeSlot: '09:00 - 12:00', available: 450, capacity: 500 },
        { timeSlot: '12:00 - 15:00', available: 410, capacity: 500 },
        { timeSlot: '15:00 - 18:00', available: 380, capacity: 500 }
      ];
    }

    return slots.map((s) => ({
      timeSlot: s.timeSlot,
      available: Math.max(0, s.capacity - s.bookedCount),
      capacity: s.capacity
    }));
  }
}
