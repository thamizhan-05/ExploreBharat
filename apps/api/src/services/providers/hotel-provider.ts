import { prisma } from '@bharatyatra/database';

export interface NormalizedHotelData {
  id?: string;
  name: string;
  officialName: string;
  city: string;
  district?: string;
  state?: string;
  address: string;
  latitude: number;
  longitude: number;
  tier: string;
  starRating?: number;
  rating?: number;
  startingPriceInr?: number;
  priceType: 'LIVE' | 'STARTING_FROM' | 'ESTIMATED' | 'UNAVAILABLE';
  priceSource: string;
  availabilityStatus: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'UNKNOWN';
  phone?: string;
  website?: string;
  heroImageUrl?: string;
  amenities: string[];
  verificationStatus: string;
}

export interface HotelAvailabilityResult {
  status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'UNKNOWN';
  startingPriceInr?: number;
  priceType: 'LIVE' | 'STARTING_FROM' | 'ESTIMATED' | 'UNAVAILABLE';
  source: string;
  currency: string;
  lastChecked: Date;
}

export interface HotelProvider {
  readonly providerName: string;
  getHotelDetails(hotelIdOrSlug: string): Promise<NormalizedHotelData | null>;
  searchHotels(city: string, filters?: any): Promise<NormalizedHotelData[]>;
  checkAvailability(hotelId: string, checkIn: string, checkOut: string): Promise<HotelAvailabilityResult>;
}

/**
 * Internal verified hotel database provider
 */
export class InternalHotelProvider implements HotelProvider {
  readonly providerName = 'ExploreBharat Internal Verified Hotel Inventory';

  async getHotelDetails(hotelId: string): Promise<NormalizedHotelData | null> {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: { city: true }
    });

    if (!hotel) return null;

    let amenities: string[] = [];
    try {
      amenities = JSON.parse(hotel.amenities);
    } catch {
      amenities = [];
    }

    return {
      id: hotel.id,
      name: hotel.name,
      officialName: hotel.officialName || hotel.name,
      city: hotel.city.name,
      district: hotel.district || undefined,
      state: hotel.state || undefined,
      address: hotel.address,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      tier: hotel.tier,
      starRating: hotel.starRating || undefined,
      rating: hotel.rating,
      startingPriceInr: hotel.startingPriceInr || undefined,
      priceType: (hotel.priceType as any) || 'STARTING_FROM',
      priceSource: hotel.priceSource || 'Direct Property Tariff',
      availabilityStatus: (hotel.availabilityStatus as any) || 'AVAILABLE',
      phone: hotel.phone || undefined,
      website: hotel.website || undefined,
      heroImageUrl: hotel.heroImageUrl || undefined,
      amenities,
      verificationStatus: hotel.verificationStatus
    };
  }

  async searchHotels(city: string, filters?: any): Promise<NormalizedHotelData[]> {
    const hotels = await prisma.hotel.findMany({
      where: {
        city: { name: { contains: city } }
      },
      include: { city: true }
    });

    return hotels.map((h) => {
      let amenities: string[] = [];
      try {
        amenities = JSON.parse(h.amenities);
      } catch {
        amenities = [];
      }
      return {
        id: h.id,
        name: h.name,
        officialName: h.officialName || h.name,
        city: h.city.name,
        district: h.district || undefined,
        state: h.state || undefined,
        address: h.address,
        latitude: h.latitude,
        longitude: h.longitude,
        tier: h.tier,
        starRating: h.starRating || undefined,
        rating: h.rating,
        startingPriceInr: h.startingPriceInr || undefined,
        priceType: (h.priceType as any) || 'STARTING_FROM',
        priceSource: h.priceSource || 'Direct Property Tariff',
        availabilityStatus: (h.availabilityStatus as any) || 'AVAILABLE',
        phone: h.phone || undefined,
        website: h.website || undefined,
        heroImageUrl: h.heroImageUrl || undefined,
        amenities,
        verificationStatus: h.verificationStatus
      };
    });
  }

  async checkAvailability(hotelId: string, _checkIn: string, _checkOut: string): Promise<HotelAvailabilityResult> {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId }
    });

    if (!hotel) {
      return {
        status: 'UNKNOWN',
        priceType: 'UNAVAILABLE',
        source: 'Unknown Property',
        currency: 'INR',
        lastChecked: new Date()
      };
    }

    return {
      status: (hotel.availabilityStatus as any) || 'AVAILABLE',
      startingPriceInr: hotel.startingPriceInr || undefined,
      priceType: (hotel.priceType as any) || 'STARTING_FROM',
      source: hotel.priceSource || 'Direct Hotel Tariff',
      currency: 'INR',
      lastChecked: hotel.priceRetrievedAt || new Date()
    };
  }
}

/**
 * External hotel supplier / channel manager provider abstraction
 */
export class ExternalHotelProvider implements HotelProvider {
  readonly providerName = 'External Hospitality Channel Manager';

  async getHotelDetails(_hotelIdOrSlug: string): Promise<NormalizedHotelData | null> {
    // Stub for authorized future channel manager integration
    return null;
  }

  async searchHotels(_city: string, _filters?: any): Promise<NormalizedHotelData[]> {
    return [];
  }

  async checkAvailability(_hotelId: string, _checkIn: string, _checkOut: string): Promise<HotelAvailabilityResult> {
    return {
      status: 'UNKNOWN',
      priceType: 'UNAVAILABLE',
      source: 'External Channel Pending',
      currency: 'INR',
      lastChecked: new Date()
    };
  }
}
