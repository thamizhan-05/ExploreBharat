import { prisma, parseJsonObject } from '@bharatyatra/database';
import qrcode from 'qrcode';
import { AppError } from '../../middleware/error.middleware';

export class BookingsService {
  async bookHotel(data: {
    userId: string;
    hotelId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    specialRequests?: string;
  }) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: data.hotelId },
      include: {
        rooms: true,
        city: { include: { state: true } }
      }
    });
    if (!hotel) throw new AppError('Hotel not found.', 404);

    const room = hotel.rooms.find((r) => r.id === data.roomId);
    if (!room) throw new AppError('Room not found in this hotel.', 404);

    // Calculate nights
    const d1 = new Date(data.checkInDate);
    const d2 = new Date(data.checkOutDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const baseAmount = room.basePriceInr * nights;
    const taxAmount = Math.round(baseAmount * 0.12); // 12% GST on hotel stays
    const convenienceFee = 150;
    const totalAmount = baseAmount + taxAmount + convenienceFee;

    const ref = `BY-HTL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const qrPayload = JSON.stringify({
      ref,
      hotel: hotel.name,
      room: room.title,
      checkIn: data.checkInDate,
      checkOut: data.checkOutDate,
      guests: data.guestCount,
      nights,
      address: hotel.address
    });

    const booking = await prisma.booking.create({
      data: {
        bookingReference: ref,
        userId: data.userId,
        hotelId: hotel.id,
        vendorId: hotel.vendorId || null,
        bookingType: 'HOTEL',
        status: 'CONFIRMED',
        title: `${hotel.name} - ${room.title}`,
        location: `${hotel.address}, ${hotel.city.name}`,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        guestCount: data.guestCount,
        totalAmountInr: totalAmount,
        taxAmountInr: taxAmount,
        convenienceFeeInr: convenienceFee,
        qrCodeData: qrPayload,
        paymentStatus: 'SUCCESS',
        paymentId: `pay_htl_${Date.now()}`,
        details: JSON.stringify({
          hotelId: hotel.id,
          roomId: room.id,
          roomType: room.roomType,
          nights,
          ratePerNight: room.basePriceInr,
          specialRequests: data.specialRequests
        })
      }
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: data.userId,
        title: `Hotel Confirmed: ${hotel.name}`,
        message: `Your ExploreBharat reservation at ${hotel.name} for ${nights} night(s) is confirmed. Reference: ${ref}. Thank you for using ExploreBharat.`,
        type: 'BOOKING',
        link: `/bookings/${booking.id}`
      }
    });

    return {
      ...booking,
      details: parseJsonObject(booking.details)
    };
  }

  async getUserBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return bookings.map((b) => ({
      ...b,
      details: parseJsonObject(b.details)
    }));
  }

  async getBookingById(bookingId: string, userId: string, isAdmin = false) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) throw new AppError('Booking not found.', 404);
    if (!isAdmin && booking.userId !== userId) {
      throw new AppError('Forbidden. You do not have access to this booking.', 403);
    }

    // Generate Base64 QR code image data URI
    let qrImageDataUri = '';
    try {
      qrImageDataUri = await qrcode.toDataURL(booking.qrCodeData, { width: 300, margin: 2 });
    } catch {
      qrImageDataUri = '';
    }

    return {
      ...booking,
      qrImageDataUri,
      details: parseJsonObject(booking.details)
    };
  }

  async cancelBooking(bookingId: string, userId: string, reason?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) throw new AppError('Booking not found.', 404);
    if (booking.userId !== userId) throw new AppError('Forbidden.', 403);
    if (booking.status === 'CANCELLED') throw new AppError('Booking is already cancelled.', 400);

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
        details: JSON.stringify({
          ...parseJsonObject(booking.details),
          cancelledAt: new Date().toISOString(),
          cancelReason: reason || 'Cancelled by user'
        })
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: `Booking Cancelled: ${booking.title}`,
        message: `Your ExploreBharat booking ${booking.bookingReference} has been cancelled and full refund of ₹${booking.totalAmountInr} has been initiated to your source account.`,
        type: 'BOOKING'
      }
    });

    return {
      ...updated,
      details: parseJsonObject(updated.details)
    };
  }
}
