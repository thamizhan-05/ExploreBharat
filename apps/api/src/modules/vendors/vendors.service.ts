import { prisma, parseJsonObject } from '@bharatyatra/database';
import { AppError } from '../../middleware/error.middleware';
import { PLATFORM_CONSTANTS } from '../../config/constants';

export class VendorsService {
  async registerVendor(userId: string, data: {
    businessName: string;
    contactPhone: string;
    address: string;
    gstNumber?: string;
    panNumber?: string;
  }) {
    const existing = await prisma.vendor.findUnique({ where: { userId } });
    if (existing) throw new AppError('Vendor profile already exists for this account.', 400);

    const vendor = await prisma.vendor.create({
      data: {
        userId,
        businessName: data.businessName,
        contactPhone: data.contactPhone,
        address: data.address,
        gstNumber: data.gstNumber,
        panNumber: data.panNumber,
        status: 'PENDING'
      }
    });

    // Update user role to VENDOR
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'VENDOR' }
    });

    return vendor;
  }

  async getVendorProfile(userId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, role: true }
        }
      }
    });
    if (!vendor) throw new AppError('Vendor profile not found.', 404);
    return vendor;
  }

  async getVendorInventory(userId: string) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new AppError('Vendor profile not found.', 404);

    const hotels = await prisma.hotel.findMany({
      where: { vendorId: vendor.id },
      include: {
        city: { select: { id: true, name: true, state: { select: { name: true, code: true } } } },
        rooms: true,
        images: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return hotels.map((h) => ({
      ...h,
      amenities: parseJsonObject(h.amenities),
      galleryImages: parseJsonObject(h.galleryImages),
      policies: parseJsonObject(h.policies)
    }));
  }

  async updateHotelTariff(
    userId: string,
    hotelId: string,
    data: {
      startingPriceInr?: number;
      availabilityStatus?: string;
      cancellationPolicy?: string;
      checkInTime?: string;
      checkOutTime?: string;
    },
    userRole?: string
  ) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) throw new AppError('Hotel not found.', 404);

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      if (!vendor || hotel.vendorId !== vendor.id) {
        throw new AppError('Forbidden. You do not own this hotel property.', 403);
      }
    }

    const previousState = {
      startingPriceInr: hotel.startingPriceInr,
      availabilityStatus: hotel.availabilityStatus,
      cancellationPolicy: hotel.cancellationPolicy
    };

    const updated = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        ...(data.startingPriceInr !== undefined ? { startingPriceInr: data.startingPriceInr } : {}),
        ...(data.availabilityStatus ? { availabilityStatus: data.availabilityStatus } : {}),
        ...(data.cancellationPolicy ? { cancellationPolicy: data.cancellationPolicy } : {}),
        ...(data.checkInTime ? { checkInTime: data.checkInTime } : {}),
        ...(data.checkOutTime ? { checkOutTime: data.checkOutTime } : {}),
        lastVerifiedAt: new Date()
      },
      include: { rooms: true }
    });

    // Track editorial audit log
    await prisma.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'EDIT',
        entityType: 'HOTEL',
        entityId: hotelId,
        details: `Vendor updated hotel tariff & availability for "${hotel.name}"`,
        changes: JSON.stringify({ before: previousState, after: data })
      }
    });

    return updated;
  }

  async updateRoom(
    userId: string,
    hotelId: string,
    roomId: string,
    data: {
      basePriceInr?: number;
      availableCount?: number;
      title?: string;
      includesBreakfast?: boolean;
    },
    userRole?: string
  ) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) throw new AppError('Hotel not found.', 404);

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      if (!vendor || hotel.vendorId !== vendor.id) {
        throw new AppError('Forbidden. You do not own this hotel property.', 403);
      }
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room || room.hotelId !== hotelId) throw new AppError('Room not found in this hotel.', 404);

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        ...(data.basePriceInr !== undefined ? { basePriceInr: data.basePriceInr } : {}),
        ...(data.availableCount !== undefined ? { availableCount: data.availableCount } : {}),
        ...(data.title ? { title: data.title } : {}),
        ...(data.includesBreakfast !== undefined ? { includesBreakfast: data.includesBreakfast } : {})
      }
    });

    // Keep hotel startingPriceInr synchronized if room price is lower
    const allRooms = await prisma.room.findMany({ where: { hotelId } });
    const minPrice = Math.min(...allRooms.map((r) => r.basePriceInr));
    if (minPrice && minPrice > 0) {
      await prisma.hotel.update({
        where: { id: hotelId },
        data: { startingPriceInr: minPrice }
      });
    }

    await prisma.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'EDIT',
        entityType: 'HOTEL_ROOM',
        entityId: roomId,
        details: `Vendor updated room "${room.title}" in "${hotel.name}"`,
        changes: JSON.stringify(data)
      }
    });

    return updatedRoom;
  }

  async getVendorBookings(userId: string) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new AppError('Vendor profile not found.', 404);

    const bookings = await prisma.booking.findMany({
      where: { vendorId: vendor.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        hotel: { select: { id: true, name: true, address: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return bookings.map((b) => ({
      ...b,
      details: parseJsonObject(b.details)
    }));
  }

  async getVendorFinancials(userId: string) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new AppError('Vendor profile not found.', 404);

    const bookings = await prisma.booking.findMany({
      where: { vendorId: vendor.id },
      include: {
        hotel: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const confirmedBookings = bookings.filter((b) => b.paymentStatus === 'SUCCESS' && b.status !== 'CANCELLED');

    // ExploreBharat Platform Model: 8% platform fee, 92% vendor net payout
    const PLATFORM_FEE_RATE = PLATFORM_CONSTANTS.PLATFORM_COMMISSION_RATE;
    const grossBookingValueInr = confirmedBookings.reduce((sum, b) => sum + b.totalAmountInr, 0);
    const platformFeeTotalInr = Math.round(grossBookingValueInr * PLATFORM_FEE_RATE);
    const netVendorPayoutInr = grossBookingValueInr - platformFeeTotalInr;

    const transactions = confirmedBookings.map((b) => {
      const platformFee = Math.round(b.totalAmountInr * PLATFORM_FEE_RATE);
      const netPayout = b.totalAmountInr - platformFee;
      return {
        bookingId: b.id,
        bookingReference: b.bookingReference,
        hotelName: b.hotel?.name || b.title,
        guestCheckIn: b.checkInDate,
        guestCheckOut: b.checkOutDate,
        guestCount: b.guestCount,
        grossAmountInr: b.totalAmountInr,
        platformFeeInr: platformFee,
        platformFeePercent: 8,
        netPayoutInr: netPayout,
        payoutStatus: new Date(b.checkInDate) < new Date() ? 'SETTLED' : 'ESCROW_PENDING_CHECKIN',
        createdAt: b.createdAt
      };
    });

    return {
      summary: {
        grossBookingValueInr,
        platformCommissionRate: '8%',
        platformFeeTotalInr,
        netVendorPayoutInr,
        vendorPayoutRate: '92%',
        totalReservations: confirmedBookings.length,
        pendingCheckIns: confirmedBookings.filter((b) => new Date(b.checkInDate) >= new Date()).length
      },
      transactions
    };
  }
}
