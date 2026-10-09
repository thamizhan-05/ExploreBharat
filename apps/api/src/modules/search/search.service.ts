import { prisma, parseJsonArray } from '@bharatyatra/database';

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  return Math.round(R * c * 10) / 10;
}

export class SearchService {
  async globalSearch(query: string, limit = 8) {
    if (!query || query.trim().length === 0) {
      return {
        query: '',
        attractions: [],
        destinations: [],
        hotels: [],
        circuits: [],
        activities: []
      };
    }

    const q = query.trim();
    const lowerQ = q.toLowerCase();

    // Check for geospatial proximity queries e.g. "hotels near Taj Mahal" or "places near Pune"
    const hotelsNearMatch = lowerQ.match(/hotels?\s+near\s+(.+)/i);
    const placesNearMatch = lowerQ.match(/(?:places?|attractions?)\s+near\s+(.+)/i);

    if (hotelsNearMatch) {
      const targetQuery = hotelsNearMatch[1].trim();
      const targetPlace = await prisma.attraction.findFirst({
        where: {
          OR: [
            { name: { contains: targetQuery } },
            { city: { name: { contains: targetQuery } } }
          ]
        },
        include: { city: true }
      });

      if (targetPlace) {
        const allHotels = await prisma.hotel.findMany({
          include: { city: true }
        });

        const hotelsWithDistance = allHotels
          .map((h) => {
            const dist = haversineDistanceKm(
              targetPlace.latitude,
              targetPlace.longitude,
              h.latitude,
              h.longitude
            );
            return {
              ...h,
              distanceFromAttractionKm: dist,
              amenities: parseJsonArray<string>(h.amenities),
              galleryImages: parseJsonArray<string>(h.galleryImages)
            };
          })
          .sort((a, b) => a.distanceFromAttractionKm - b.distanceFromAttractionKm)
          .slice(0, limit);

        return {
          query: q,
          targetLandmark: targetPlace.name,
          attractions: [targetPlace],
          destinations: targetPlace.city ? [targetPlace.city] : [],
          hotels: hotelsWithDistance,
          circuits: [],
          activities: []
        };
      }
    }

    if (placesNearMatch) {
      const targetQuery = placesNearMatch[1].trim();
      const targetCity = await prisma.city.findFirst({
        where: { name: { contains: targetQuery } }
      });
      const targetAttraction = !targetCity
        ? await prisma.attraction.findFirst({
            where: { name: { contains: targetQuery } }
          })
        : null;

      const originLat = targetCity?.latitude || targetAttraction?.latitude;
      const originLng = targetCity?.longitude || targetAttraction?.longitude;

      if (originLat !== undefined && originLng !== undefined) {
        const allAttractions = await prisma.attraction.findMany({
          include: { city: { include: { state: true } }, category: true, ticketTypes: true }
        });

        const sortedAttractions = allAttractions
          .map((a) => ({
            ...a,
            distanceFromOriginKm: haversineDistanceKm(originLat, originLng, a.latitude, a.longitude),
            galleryImages: parseJsonArray<string>(a.galleryImages),
            weeklyHolidays: parseJsonArray<string>(a.weeklyHolidays)
          }))
          .sort((a, b) => a.distanceFromOriginKm - b.distanceFromOriginKm)
          .slice(0, limit);

        return {
          query: q,
          attractions: sortedAttractions,
          destinations: targetCity ? [targetCity] : [],
          hotels: [],
          circuits: [],
          activities: []
        };
      }
    }

    // Check if query is looking for free places/attractions
    const isFreeQuery =
      lowerQ.includes('free') ||
      lowerQ.includes('no entry fee') ||
      lowerQ.includes('without entry fee') ||
      lowerQ.includes('zero fee');

    let attractionWhere: any;

    if (isFreeQuery) {
      // Clean query by removing free-search keywords
      const cleaned = lowerQ
        .replace(/free/g, '')
        .replace(/places/g, '')
        .replace(/tourist/g, '')
        .replace(/attractions/g, '')
        .replace(/spots/g, '')
        .replace(/things to do/g, '')
        .replace(/without entry fee/g, '')
        .replace(/no entry fee/g, '')
        .replace(/near me/g, '')
        .replace(/\bin\b/g, '')
        .replace(/\bnear\b/g, '')
        .trim();

      if (cleaned.length > 0) {
        attractionWhere = {
          entryType: 'FREE',
          OR: [
            { city: { name: { contains: cleaned } } },
            { city: { state: { name: { contains: cleaned } } } },
            { category: { name: { contains: cleaned } } },
            { name: { contains: cleaned } },
            { description: { contains: cleaned } }
          ]
        };
      } else {
        attractionWhere = {
          entryType: 'FREE'
        };
      }
    } else {
      attractionWhere = {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { city: { name: { contains: q } } },
          { city: { state: { name: { contains: q } } } }
        ]
      };
    }

    const [attractions, destinations, hotels, circuits, activities] = await Promise.all([
      prisma.attraction.findMany({
        where: attractionWhere,
        take: Math.max(limit, 20),
        include: {
          city: { include: { state: true } },
          category: true,
          ticketTypes: true,
          images: { where: { isPrimary: true }, take: 1 }
        }
      }),
      prisma.city.findMany({
        where: {
          OR: [{ name: { contains: q } }, { state: { name: { contains: q } } }]
        },
        take: limit,
        include: { state: true }
      }),
      prisma.hotel.findMany({
        where: {
          OR: [{ name: { contains: q } }, { address: { contains: q } }, { city: { name: { contains: q } } }]
        },
        take: limit,
        include: { city: true }
      }),
      prisma.tourismCircuit.findMany({
        where: {
          OR: [{ title: { contains: q } }, { description: { contains: q } }]
        },
        take: 3
      }),
      prisma.activity.findMany({
        where: {
          OR: [{ title: { contains: q } }, { description: { contains: q } }]
        },
        take: 4,
        include: { city: true }
      })
    ]);

    return {
      query: q,
      attractions: attractions
        .sort((a, b) => {
          const aNameMatch = a.name.toLowerCase().includes(lowerQ) ? 1 : 0;
          const bNameMatch = b.name.toLowerCase().includes(lowerQ) ? 1 : 0;
          return bNameMatch - aNameMatch;
        })
        .map((a) => ({
          ...a,
          galleryImages: parseJsonArray<string>(a.galleryImages),
          weeklyHolidays: parseJsonArray<string>(a.weeklyHolidays)
        })),
      destinations,
      hotels: hotels.map((h) => ({
        ...h,
        amenities: parseJsonArray<string>(h.amenities),
        galleryImages: parseJsonArray<string>(h.galleryImages)
      })),
      circuits: circuits.map((c) => ({
        ...c,
        destinations: parseJsonArray<string>(c.destinations),
        highlights: parseJsonArray<string>(c.highlights)
      })),
      activities: activities.map((act) => ({
        ...act,
        included: parseJsonArray<string>(act.included),
        slots: parseJsonArray<string>(act.slots)
      }))
    };
  }

  async autocomplete(term: string) {
    if (!term || term.trim().length === 0) return [];
    const t = term.trim();

    const [attractions, cities] = await Promise.all([
      prisma.attraction.findMany({
        where: { name: { contains: t } },
        take: 5,
        select: { id: true, name: true, slug: true, city: { select: { name: true } } }
      }),
      prisma.city.findMany({
        where: { name: { contains: t } },
        take: 3,
        select: { id: true, name: true, state: { select: { name: true } } }
      })
    ]);

    return [
      ...attractions.map((a) => ({
        type: 'attraction',
        title: a.name,
        subtitle: a.city?.name,
        url: `/attractions/${a.slug || a.id}`
      })),
      ...cities.map((c) => ({
        type: 'destination',
        title: c.name,
        subtitle: c.state?.name,
        url: `/destinations/${c.id}`
      }))
    ];
  }

  async smartQuerySearch(text: string) {
    const raw = text.trim();
    const lower = raw.toLowerCase();

    let intent: 'PLAN_TRIP' | 'FREE_PLACES' | 'HOTEL_DISCOVERY' | 'HOW_TO_REACH' | 'EXPLORE' = 'EXPLORE';
    let days = 3;
    let budget = 20000;
    let origin: string | undefined = undefined;
    let destination: string = 'Jaipur';
    const interests: string[] = [];

    // Detect Free Places
    if (lower.includes('free place') || lower.includes('free attraction') || lower.includes('visit for free') || lower.includes('zero ticket')) {
      intent = 'FREE_PLACES';
      interests.push('FREE');
    } else if (lower.includes('plan') || lower.includes('trip') || lower.includes('itinerary') || lower.includes('weekend')) {
      intent = 'PLAN_TRIP';
    } else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort')) {
      intent = 'HOTEL_DISCOVERY';
    } else if (lower.includes('how to reach') || lower.includes('how do i reach') || lower.includes('how can i go')) {
      intent = 'HOW_TO_REACH';
    }

    // Extract days
    const daysMatch = lower.match(/(\d+)\s*(?:day|days|night|nights)/);
    if (daysMatch) {
      days = parseInt(daysMatch[1], 10);
    } else if (lower.includes('weekend')) {
      days = 2;
    }

    // Extract budget
    const budgetMatch = lower.match(/(?:under|below|budget|within|₹|rs\.?)\s*(\d[\d,.]*)/i);
    if (budgetMatch) {
      let val = parseFloat(budgetMatch[1].replace(/,/g, ''));
      if (lower.includes(`${budgetMatch[1]}k`)) val *= 1000;
      if (val > 100) budget = val;
    }

    // Extract origin & destination
    if (lower.includes('from mumbai')) origin = 'Mumbai';
    else if (lower.includes('from delhi')) origin = 'New Delhi';
    else if (lower.includes('from bangalore') || lower.includes('from bengaluru')) origin = 'Bengaluru';
    else if (lower.includes('from chennai')) origin = 'Chennai';
    else if (lower.includes('from pune')) origin = 'Pune';

    const cityKeywords = [
      'jaipur', 'mumbai', 'delhi', 'agra', 'varanasi', 'kochi', 'kerala', 'pune',
      'madurai', 'kolkata', 'udaipur', 'amritsar', 'panaji', 'goa', 'shimla'
    ];
    for (const ck of cityKeywords) {
      if (lower.includes(ck) && (!origin || !origin.toLowerCase().includes(ck))) {
        destination = ck.charAt(0).toUpperCase() + ck.slice(1);
        break;
      }
    }

    // Action recommendations based on intent
    let actionUrl = `/smart-journey?destination=${encodeURIComponent(destination)}&days=${days}&budget=${budget}`;
    if (origin) {
      actionUrl += `&origin=${encodeURIComponent(origin)}`;
    }
    if (intent === 'FREE_PLACES') {
      actionUrl = `/attractions?entryType=FREE&city=${encodeURIComponent(destination)}`;
    } else if (intent === 'HOTEL_DISCOVERY') {
      actionUrl = `/hotels?city=${encodeURIComponent(destination)}`;
    }

    // Query matched preview items from database
    const [matchedCity, matchedAttractions] = await Promise.all([
      prisma.city.findFirst({
        where: { name: { contains: destination } },
        include: { state: true }
      }),
      prisma.attraction.findMany({
        where: {
          city: { name: { contains: destination } },
          ...(intent === 'FREE_PLACES' ? { entryType: 'FREE' } : {})
        },
        take: 4,
        include: { category: true }
      })
    ]);

    return {
      query: raw,
      intent,
      parsed: {
        destination: matchedCity?.name || destination,
        state: matchedCity?.state.name,
        origin: origin || 'Current Location / Selected Origin',
        days,
        budgetInr: budget,
        interests
      },
      actionUrl,
      preview: {
        cityName: matchedCity?.name || destination,
        attractionsCount: matchedAttractions.length,
        attractions: matchedAttractions.map(a => ({
          id: a.id,
          name: a.name,
          category: a.category.name,
          entryType: a.entryType,
          entryFee: a.entryFee || a.adultIndianFee || 0,
          heroImageUrl: a.heroImageUrl
        }))
      }
    };
  }

  async searchWikimediaPhotos(query: string, limit = 6) {
    const { WikimediaCommonsProvider } = await import('../../services/providers/wikimedia-commons.provider');
    const provider = new WikimediaCommonsProvider();
    return provider.searchPhotos(query, limit);
  }
}
