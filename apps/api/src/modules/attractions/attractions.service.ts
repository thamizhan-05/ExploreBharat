import { prisma, parseJsonArray } from '@bharatyatra/database';
import { AppError } from '../../middleware/error.middleware';
import { PLATFORM_CONSTANTS } from '../../config/constants';

export class AttractionsService {
  async getCategories() {
    return prisma.attractionCategory.findMany({
      include: {
        _count: { select: { attractions: true } }
      },
      orderBy: { name: 'asc' }
    });
  }

  async getAttractions(params?: {
    categoryId?: string;
    cityId?: string;
    cityName?: string;
    stateCode?: string;
    stateName?: string;
    search?: string;
    featuredOnly?: boolean;
    hiddenGemsOnly?: boolean;
    minRating?: number;
    maxPrice?: number;
    entryType?: string;
    priceRange?: string;
    ticketRequired?: boolean;
    bookingRequired?: boolean;
    wheelchairAccessible?: boolean;
    seniorFriendly?: boolean;
    childFriendly?: boolean;
    discoveryType?: string;
    verificationStatus?: string;
    district?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || PLATFORM_CONSTANTS.DEFAULT_PAGE;
    const limit = Math.min(params?.limit || PLATFORM_CONSTANTS.DEFAULT_PAGE_SIZE, PLATFORM_CONSTANTS.MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.categoryId) where.categoryId = params.categoryId;
    if (params?.cityId) where.cityId = params.cityId;
    if (params?.featuredOnly) where.isFeatured = true;
    if (params?.hiddenGemsOnly) {
      where.OR = [
        { isHiddenGem: true },
        { discoveryType: 'HIDDEN_GEM' },
        { discoveryType: 'LESSER_KNOWN' }
      ];
    }
    if (params?.discoveryType) where.discoveryType = params.discoveryType.toUpperCase();
    if (params?.verificationStatus) where.verificationStatus = params.verificationStatus.toUpperCase();
    if (params?.district) where.district = { contains: params.district };
    if (params?.minRating) where.rating = { gte: params.minRating };
    if (params?.ticketRequired !== undefined) where.ticketRequired = params.ticketRequired;
    if (params?.bookingRequired !== undefined) where.bookingRequired = params.bookingRequired;
    if (params?.wheelchairAccessible !== undefined) where.wheelchairAccessible = params.wheelchairAccessible;
    if (params?.seniorFriendly !== undefined) where.seniorFriendly = params.seniorFriendly;
    if (params?.childFriendly !== undefined) where.childFriendly = params.childFriendly;

    // Entry Type filter
    if (params?.entryType) {
      where.entryType = params.entryType.toUpperCase();
    }

    // Price Range filter
    if (params?.priceRange) {
      const pr = params.priceRange.toLowerCase();
      if (pr === 'free') {
        where.OR = [
          { entryType: 'FREE' },
          { entryFee: 0 },
          { adultIndianFee: 0 }
        ];
      } else if (pr === 'under_100') {
        where.entryFee = { gt: 0, lte: 100 };
      } else if (pr === '100_500') {
        where.entryFee = { gt: 100, lte: 500 };
      } else if (pr === 'above_500') {
        where.entryFee = { gt: 500 };
      }
    }

    // Search query
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search } },
        { description: { contains: params.search } }
      ];
    }

    // State filter (by code or name)
    if (params?.stateCode || params?.stateName) {
      const stateTerm = params.stateCode || params.stateName;
      where.city = {
        state: {
          OR: [
            { code: stateTerm?.toUpperCase() },
            { name: { contains: stateTerm } }
          ]
        }
      };
    }

    // City filter (by name)
    if (params?.cityName) {
      where.city = {
        ...where.city,
        name: { contains: params.cityName }
      };
    }

    const [total, items] = await Promise.all([
      prisma.attraction.count({ where }),
      prisma.attraction.findMany({
        where,
        skip,
        take: limit,
        include: {
          city: { include: { state: true } },
          category: true,
          ticketTypes: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
          }
        },
        orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }]
      })
    ]);

    return {
      items: items.map(this.formatAttraction),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getAttractionByIdOrSlug(idOrSlug: string) {
    const attraction = await prisma.attraction.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }]
      },
      include: {
        city: {
          include: {
            state: true,
            hotels: { take: 4, include: { rooms: true } },
            restaurants: { take: 4 },
            activities: { take: 4 }
          }
        },
        category: true,
        ticketTypes: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
        },
        ticketSlots: {
          take: 10
        }
      }
    });

    if (!attraction) {
      throw new AppError('Attraction not found.', 404);
    }

    // Find nearby attractions within the same city or closest coordinates
    const nearbyAttractions = await prisma.attraction.findMany({
      where: {
        cityId: attraction.cityId,
        id: { not: attraction.id }
      },
      take: 4,
      include: {
        category: true,
        ticketTypes: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
        }
      }
    });

    // Enrich hotels with physical distance to this attraction and estimated fares
    const enrichedHotels = attraction.city.hotels.map((h) => {
      const distanceKm = Math.round(this.calculateDistanceKm(attraction.latitude, attraction.longitude, h.latitude, h.longitude) * 10) / 10;
      const cabFare = Math.round(70 + distanceKm * 18);
      const autoFare = Math.round(30 + distanceKm * 14);
      const cabTimeMin = Math.max(8, Math.round(distanceKm * 2.5 + 4));

      return {
        ...h,
        distanceFromAttractionKm: distanceKm,
        travelTimeByCabMinutes: cabTimeMin,
        estimatedCabFareInr: cabFare,
        estimatedAutoFareInr: autoFare,
        fareType: 'ESTIMATED',
        amenities: parseJsonArray<string>(h.amenities),
        galleryImages: parseJsonArray<string>(h.galleryImages)
      };
    });

    // Structured "How to Reach" Engine (Fastest, Cheapest, Easiest) from major city transport hubs
    const cityName = attraction.city.name;
    const howToReachEngine = {
      fromRailwayStation: {
        hubName: `${cityName} Junction Railway Station`,
        approxDistanceKm: 7.5,
        fastest: {
          mode: 'CAB',
          durationMinutes: 22,
          estimatedFareInr: 205,
          fareType: 'ESTIMATED',
          instructions: `Direct app cab or prepaid taxi from station exit.`
        },
        cheapest: {
          mode: 'BUS',
          durationMinutes: 38,
          estimatedFareInr: 25,
          fareType: 'SCHEDULED',
          instructions: `City bus route from station bus stand directly to attraction gate.`
        },
        easiest: {
          mode: 'AUTO',
          durationMinutes: 25,
          estimatedFareInr: 135,
          fareType: 'ESTIMATED',
          instructions: `Metered auto-rickshaw from prepaid auto booth.`
        }
      },
      fromAirport: {
        hubName: `${cityName} Airport`,
        approxDistanceKm: 18.2,
        fastest: {
          mode: 'CAB',
          durationMinutes: 35,
          estimatedFareInr: 395,
          fareType: 'ESTIMATED',
          instructions: `Airport terminal taxi or rideshare.`
        },
        cheapest: {
          mode: 'BUS',
          durationMinutes: 55,
          estimatedFareInr: 60,
          fareType: 'SCHEDULED',
          instructions: `Airport Express feeder service to city junction, then local auto.`
        },
        easiest: {
          mode: 'CAB',
          durationMinutes: 35,
          estimatedFareInr: 395,
          fareType: 'ESTIMATED',
          instructions: `Prepaid airport taxi counter at Arrivals.`
        }
      },
      fromCityCenter: {
        hubName: `${cityName} Central Square / Promenade`,
        approxDistanceKm: 3.4,
        fastest: {
          mode: 'AUTO',
          durationMinutes: 12,
          estimatedFareInr: 78,
          fareType: 'ESTIMATED',
          instructions: `Quick auto ride through central boulevard.`
        },
        cheapest: {
          mode: 'BUS',
          durationMinutes: 20,
          estimatedFareInr: 15,
          fareType: 'SCHEDULED',
          instructions: `Frequent municipal low-floor city transit.`
        },
        walk: {
          feasible: 3.4 <= 1.5,
          durationMinutes: Math.round(3.4 * 14),
          instructions: 3.4 <= 1.5 ? `Pedestrian friendly walk.` : `Walking not recommended due to road traffic distance.`
        }
      }
    };

    return {
      ...this.formatAttraction(attraction),
      city: attraction.city,
      howToReachEngine,
      nearbyAttractions: nearbyAttractions.map(this.formatAttraction),
      nearbyHotels: enrichedHotels,
      nearbyRestaurants: attraction.city.restaurants.map((r) => ({
        ...r,
        cuisine: parseJsonArray<string>(r.cuisine),
        mustTryDishes: parseJsonArray<string>(r.mustTryDishes)
      })),
      nearbyActivities: attraction.city.activities.map((act) => ({
        ...act,
        included: parseJsonArray<string>(act.included),
        slots: parseJsonArray<string>(act.slots)
      }))
    };
  }

  async getNearbyAttractions(latitude: number, longitude: number, maxDistanceKm = 100, entryType?: string) {
    const where: any = {};
    if (entryType) {
      where.entryType = entryType.toUpperCase();
    }

    const all = await prisma.attraction.findMany({
      where,
      include: {
        city: { include: { state: true } },
        category: true,
        ticketTypes: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
        }
      }
    });

    const withDistance = all
      .map((item) => {
        const dist = this.calculateDistanceKm(latitude, longitude, item.latitude, item.longitude);
        return {
          ...this.formatAttraction(item),
          distanceKm: Math.round(dist * 10) / 10
        };
      })
      .filter((item) => item.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return withDistance;
  }

  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
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

  async createPlaceSuggestion(data: {
    userId?: string;
    name: string;
    state: string;
    district?: string;
    city?: string;
    category: string;
    description: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
    entryType?: string;
    entryFee?: number;
    bestTimeToVisit?: string;
    howToReach?: string;
    whyWorthVisiting?: string;
    submittedByEmail?: string;
  }) {
    if (!data.name || !data.state || !data.category || !data.description) {
      throw new AppError('Name, state, category, and description are required.', 400);
    }

    return prisma.placeSuggestion.create({
      data: {
        userId: data.userId || null,
        name: data.name.trim(),
        state: data.state.trim(),
        district: data.district?.trim() || null,
        city: data.city?.trim() || null,
        category: data.category.trim(),
        description: data.description.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        entryType: data.entryType || 'UNKNOWN',
        entryFee: data.entryFee !== undefined ? data.entryFee : null,
        bestTimeToVisit: data.bestTimeToVisit || null,
        howToReach: data.howToReach || null,
        whyWorthVisiting: data.whyWorthVisiting || null,
        submittedByEmail: data.submittedByEmail || null,
        status: 'PENDING_REVIEW'
      }
    });
  }

  private formatAttraction(a: any) {
    return {
      ...a,
      galleryImages: parseJsonArray<string>(a.galleryImages),
      weeklyHolidays: parseJsonArray<string>(a.weeklyHolidays),
      accessibilityFeatures: parseJsonArray<string>(a.accessibilityFeatures),
      safetyTips: parseJsonArray<string>(a.safetyTips),
      travelTips: parseJsonArray<string>(a.travelTips),
      requiredDocuments: parseJsonArray<string>(a.requiredDocuments || '[]'),
      restrictions: parseJsonArray<string>(a.restrictions || '[]'),
      howToReach: {
        byAir: a.howToReachAir,
        byRail: a.howToReachRail,
        byRoad: a.howToReachRoad
      }
    };
  }
}
