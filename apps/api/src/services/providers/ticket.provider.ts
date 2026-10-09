import { prisma } from '@bharatyatra/database';

export interface TicketTypeResult {
  id: string;
  name: string;
  description: string;
  priceInr: number;
  foreignerPriceInr: number;
  childPriceInr: number;
  seniorPriceInr: number;
  includesGuide: boolean;
  validityHours: number;
}

export interface TicketAvailabilityResult {
  attractionId: string;
  date: string;
  timeSlot?: string;
  available: boolean;
  remainingCapacity: number;
  bookingRequired: boolean;
  entryType: 'FREE' | 'PAID' | 'CONDITIONAL' | 'PERMIT_REQUIRED' | 'UNKNOWN';
  providerName: string;
  isLive: boolean;
}

export interface TicketProvider {
  readonly providerName: string;
  readonly isLive: boolean;
  getTicketTypes(attractionId: string): Promise<TicketTypeResult[]>;
  checkAvailability(attractionId: string, date: string, timeSlot?: string): Promise<TicketAvailabilityResult>;
  calculatePrice(ticketTypeId: string, counts: {
    adultIndian?: number;
    foreigner?: number;
    child?: number;
    senior?: number;
  }): Promise<{ totalInr: number; breakdown: Record<string, number> }>;
}

/**
 * Internal / ASI Verified Ticket Provider
 */
export class InternalAsiTicketProvider implements TicketProvider {
  readonly providerName = 'Archaeological Survey of India & State Monuments Desk';
  readonly isLive = true;

  async getTicketTypes(attractionId: string): Promise<TicketTypeResult[]> {
    const types = await prisma.ticketType.findMany({
      where: { attractionId }
    });

    return types.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      priceInr: t.priceInr,
      foreignerPriceInr: t.foreignerPriceInr,
      childPriceInr: t.childPriceInr,
      seniorPriceInr: t.seniorPriceInr,
      includesGuide: t.includesGuide,
      validityHours: t.validityHours
    }));
  }

  async checkAvailability(attractionId: string, date: string, timeSlot?: string): Promise<TicketAvailabilityResult> {
    const attraction = await prisma.attraction.findUnique({
      where: { id: attractionId },
      select: { entryType: true, bookingRequired: true, ticketRequired: true }
    });

    if (!attraction) {
      return {
        attractionId,
        date,
        timeSlot,
        available: false,
        remainingCapacity: 0,
        bookingRequired: false,
        entryType: 'UNKNOWN',
        providerName: this.providerName,
        isLive: this.isLive
      };
    }

    if (attraction.entryType === 'FREE') {
      return {
        attractionId,
        date,
        timeSlot,
        available: true,
        remainingCapacity: 9999,
        bookingRequired: false,
        entryType: 'FREE',
        providerName: this.providerName,
        isLive: this.isLive
      };
    }

    // Check slot if specified
    if (timeSlot) {
      const slot = await prisma.ticketSlot.findFirst({
        where: { attractionId, date, timeSlot }
      });
      if (slot) {
        const remaining = Math.max(0, slot.capacity - slot.bookedCount);
        return {
          attractionId,
          date,
          timeSlot,
          available: remaining > 0,
          remainingCapacity: remaining,
          bookingRequired: attraction.bookingRequired,
          entryType: (attraction.entryType as any) || 'PAID',
          providerName: this.providerName,
          isLive: this.isLive
        };
      }
    }

    return {
      attractionId,
      date,
      timeSlot,
      available: true,
      remainingCapacity: 450,
      bookingRequired: attraction.bookingRequired,
      entryType: (attraction.entryType as any) || 'PAID',
      providerName: this.providerName,
      isLive: this.isLive
    };
  }

  async calculatePrice(ticketTypeId: string, counts: {
    adultIndian?: number;
    foreigner?: number;
    child?: number;
    senior?: number;
  }): Promise<{ totalInr: number; breakdown: Record<string, number> }> {
    const type = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId }
    });

    if (!type) {
      return { totalInr: 0, breakdown: {} };
    }

    const adultCount = counts.adultIndian || 0;
    const foreignerCount = counts.foreigner || 0;
    const childCount = counts.child || 0;
    const seniorCount = counts.senior || 0;

    const adultTotal = adultCount * type.priceInr;
    const foreignerTotal = foreignerCount * type.foreignerPriceInr;
    const childTotal = childCount * type.childPriceInr;
    const seniorTotal = seniorCount * type.seniorPriceInr;

    const totalInr = adultTotal + foreignerTotal + childTotal + seniorTotal;

    const breakdown: Record<string, number> = {
      adultIndian: adultTotal,
      foreigner: foreignerTotal,
      child: childTotal,
      senior: seniorTotal
    };

    return {
      totalInr,
      breakdown
    };
  }
}

/**
 * Future External / GDS Ticket Supplier Provider Abstraction
 */
export class ExternalTicketProvider implements TicketProvider {
  readonly providerName = 'External State Tourism Ticketing Gateway';
  readonly isLive = false;

  async getTicketTypes(_attractionId: string): Promise<TicketTypeResult[]> {
    return [];
  }

  async checkAvailability(attractionId: string, date: string, timeSlot?: string): Promise<TicketAvailabilityResult> {
    return {
      attractionId,
      date,
      timeSlot,
      available: false,
      remainingCapacity: 0,
      bookingRequired: false,
      entryType: 'UNKNOWN',
      providerName: this.providerName,
      isLive: false
    };
  }

  async calculatePrice(_ticketTypeId: string, _counts: any) {
    return { totalInr: 0, breakdown: {} };
  }
}

export const defaultTicketProvider: TicketProvider = new InternalAsiTicketProvider();
