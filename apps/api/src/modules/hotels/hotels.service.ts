import { prisma, parseJsonArray } from '@bharatyatra/database';
import { AppError } from '../../middleware/error.middleware';

export class HotelsService {
  async getHotels(params?: {
    cityId?: string;
    tier?: string;
    minRating?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.cityId) where.cityId = params.cityId;
    if (params?.tier) where.tier = params.tier;
    if (params?.minRating) where.rating = { gte: params.minRating };
    if (params?.maxPrice) where.startingPriceInr = { lte: params.maxPrice };
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { address: { contains: params.search } }
      ];
    }

    const [total, items] = await Promise.all([
      prisma.hotel.count({ where }),
      prisma.hotel.findMany({
        where,
        skip,
        take: limit,
        include: {
          city: { include: { state: true } },
          rooms: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
          }
        },
        orderBy: [{ rating: 'desc' }, { startingPriceInr: 'asc' }]
      })
    ]);

    return {
      items: items.map(this.formatHotel),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getHotelById(id: string) {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        city: {
          include: {
            state: true,
            attractions: { take: 5 }
          }
        },
        rooms: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
        }
      }
    });

    if (!hotel) {
      throw new AppError('Hotel not found.', 404);
    }

    return {
      ...this.formatHotel(hotel),
      nearbyAttractions: hotel.city.attractions.map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        heroImageUrl: a.heroImageUrl,
        rating: a.rating,
        distanceKm: Math.round(this.calculateDistanceKm(hotel.latitude, hotel.longitude, a.latitude, a.longitude) * 10) / 10
      }))
    };
  }

  async getHotelsNearAttraction(attractionId: string, limit = 5) {
    const attraction = await prisma.attraction.findUnique({
      where: { id: attractionId }
    });
    if (!attraction) throw new AppError('Attraction not found.', 404);

    const hotels = await prisma.hotel.findMany({
      where: { cityId: attraction.cityId },
      include: {
        rooms: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
        }
      }
    });

    return hotels
      .map((h) => {
        const dist = this.calculateDistanceKm(attraction.latitude, attraction.longitude, h.latitude, h.longitude);
        return {
          ...this.formatHotel(h),
          distanceFromAttractionKm: Math.round(dist * 10) / 10
        };
      })
      .sort((a, b) => a.distanceFromAttractionKm - b.distanceFromAttractionKm)
      .slice(0, limit);
  }

  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private formatHotel(h: any) {
    return {
      ...h,
      amenities: parseJsonArray<string>(h.amenities),
      galleryImages: parseJsonArray<string>(h.galleryImages),
      rooms: (h.rooms || []).map((r: any) => ({
        ...r,
        amenities: parseJsonArray<string>(r.amenities),
        images: parseJsonArray<string>(r.images)
      }))
    };
  }
}
