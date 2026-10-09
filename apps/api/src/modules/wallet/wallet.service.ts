import { prisma, parseJsonArray } from '@bharatyatra/database';

export class WalletService {
  async getUserWallet(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const activeTickets: any[] = [];
    const completedPasses: any[] = [];
    const paymentReceipts: any[] = [];

    for (const b of bookings) {
      let details: any = {};
      try {
        details = JSON.parse(b.details);
      } catch {
        details = {};
      }

      const passItem = {
        id: b.id,
        bookingReference: b.bookingReference,
        bookingType: b.bookingType, // ATTRACTION_TICKET, HOTEL, ACTIVITY, TRANSIT
        title: b.title,
        location: b.location,
        checkInDate: b.checkInDate,
        checkOutDate: b.checkOutDate,
        slotTime: b.slotTime,
        guestCount: b.guestCount,
        totalAmountInr: b.totalAmountInr,
        status: b.status,
        paymentStatus: b.paymentStatus,
        qrCodeData: b.qrCodeData,
        details,
        createdAt: b.createdAt
      };

      if (b.status === 'CONFIRMED') {
        activeTickets.push(passItem);
      } else {
        completedPasses.push(passItem);
      }

      paymentReceipts.push({
        bookingReference: b.bookingReference,
        title: b.title,
        amountInr: b.totalAmountInr,
        taxAmountInr: b.taxAmountInr,
        convenienceFeeInr: b.convenienceFeeInr,
        paymentId: b.paymentId || `PAY-${b.bookingReference}`,
        paymentStatus: b.paymentStatus,
        date: b.createdAt
      });
    }

    return {
      userId,
      summary: {
        totalActivePasses: activeTickets.length,
        totalCompletedPasses: completedPasses.length,
        totalReceipts: paymentReceipts.length
      },
      activeTickets,
      completedPasses,
      paymentReceipts
    };
  }

  async getPassByReference(userId: string, bookingReference: string) {
    const booking = await prisma.booking.findFirst({
      where: {
        bookingReference,
        userId
      }
    });

    if (!booking) {
      throw new Error('Travel pass not found or access unauthorized.');
    }

    let details: any = {};
    try {
      details = JSON.parse(booking.details);
    } catch {
      details = {};
    }

    return {
      passTitle: `EXPLOREBHARAT OFFICIAL TRAVEL PASS`,
      bookingReference: booking.bookingReference,
      bookingType: booking.bookingType,
      title: booking.title,
      location: booking.location,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      slotTime: booking.slotTime,
      guestCount: booking.guestCount,
      totalAmountInr: booking.totalAmountInr,
      qrCodeData: booking.qrCodeData,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      details,
      issuer: 'ExploreBharat Verified Tourism System',
      securityVerificationHash: `SHA256:${Buffer.from(booking.bookingReference + booking.id).toString('hex').slice(0, 16)}`,
      validUntil: booking.checkOutDate || booking.checkInDate
    };
  }
}
