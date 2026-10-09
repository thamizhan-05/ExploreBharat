import { prisma, parseJsonArray } from '@bharatyatra/database';

export interface AiPlanQuery {
  prompt?: string;
  startingCity?: string;
  destinationQuery?: string;
  daysCount?: number;
  budgetInr?: number;
  travelCompanions?: string; // 'SOLO' | 'COUPLE' | 'FAMILY' | 'FRIENDS'
  interests?: string[];
}

export class AiService {
  async generateTripPlan(input: AiPlanQuery) {
    // 1. Natural language parameter extraction if free text prompt provided
    let days = input.daysCount || 3;
    let budget = input.budgetInr || 20000;
    let destinationTerm = input.destinationQuery || 'Jaipur';
    let interests = input.interests || ['HERITAGE', 'NATURE'];

    if (input.prompt) {
      const p = input.prompt.toLowerCase();
      // Extract days
      const daysMatch = p.match(/(\d+)\s*(day|days)/);
      if (daysMatch) days = Math.min(10, Math.max(1, parseInt(daysMatch[1], 10)));

      // Extract budget
      const budgetMatch = 
        p.match(/(?:under|below|budget of|within|budget|₹|rs\.?|inr)\s*(\d[\d,.]*)/i) ||
        p.match(/(\d[\d,.]*)\s*(?:budget|inr|rupees|k)/i);
      if (budgetMatch) {
        let val = parseFloat(budgetMatch[1].replace(/,/g, ''));
        if (p.includes(`${budgetMatch[1]}k`)) val *= 1000;
        if (val > 100) budget = val;
      }

      // Check destinations
      if (p.includes('mumbai') || p.includes('bombay')) destinationTerm = 'Mumbai';
      else if (p.includes('rajasthan') || p.includes('jaipur')) destinationTerm = 'Jaipur';
      else if (p.includes('kerala') || p.includes('kochi') || p.includes('munnar')) destinationTerm = 'Kochi';
      else if (p.includes('goa')) destinationTerm = 'Panaji';
      else if (p.includes('varanasi') || p.includes('kashi')) destinationTerm = 'Varanasi';
      else if (p.includes('delhi')) destinationTerm = 'New Delhi';
      else if (p.includes('agra') || p.includes('taj')) destinationTerm = 'Agra';
      else if (p.includes('ladakh') || p.includes('leh')) destinationTerm = 'Leh';
      else if (p.includes('kolkata')) destinationTerm = 'Kolkata';
      else if (p.includes('pune')) destinationTerm = 'Pune';

      // Check interests
      if (p.includes('fort') || p.includes('heritage') || p.includes('palace')) interests.push('HERITAGE');
      if (p.includes('nature') || p.includes('mountain') || p.includes('waterfall')) interests.push('NATURE');
      if (p.includes('wildlife') || p.includes('tiger') || p.includes('safari')) interests.push('WILDLIFE');
      if (p.includes('temple') || p.includes('spiritual')) interests.push('SPIRITUAL');
      if (p.includes('adventure') || p.includes('rafting')) interests.push('ADVENTURE');
      if (p.includes('free') || p.includes('budget')) interests.push('FREE');
    }

    // 2. Query target city and real database attractions & hotels
    let city = await prisma.city.findFirst({
      where: {
        OR: [
          { name: { contains: destinationTerm } },
          { state: { name: { contains: destinationTerm } } }
        ]
      },
      include: {
        state: true,
        attractions: {
          include: { ticketTypes: true, category: true },
          take: 16
        },
        hotels: {
          include: { rooms: true },
          take: 4
        },
        activities: { take: 4 },
        restaurants: { take: 4 }
      }
    });

    if (!city) {
      city = (await prisma.city.findFirst({
        where: { name: 'Jaipur' },
        include: {
          state: true,
          attractions: { include: { ticketTypes: true, category: true }, take: 16 },
          hotels: { include: { rooms: true }, take: 4 },
          activities: { take: 4 },
          restaurants: { take: 4 }
        }
      }))!;
    }

    // 3. Build structured daily itinerary using REAL attractions
    // If budget is constrained or free query, prioritize FREE attractions
    const isUltraBudget = budget <= 2000;
    const isBudgetConstrained = budget <= 3500 || (budget / days) < 1500;
    let attractions = [...city.attractions];
    if (isBudgetConstrained || input.prompt?.toLowerCase().includes('free')) {
      attractions.sort((a, b) => {
        const aFree = a.entryType === 'FREE' ? 1 : 0;
        const bFree = b.entryType === 'FREE' ? 1 : 0;
        return bFree - aFree;
      });
    }

    // Select real hotel sorted by budget if budget constrained, otherwise first featured
    const sortedHotels = [...city.hotels].sort((a, b) => {
      if (isBudgetConstrained) return a.startingPriceInr - b.startingPriceInr;
      return b.rating - a.rating;
    });
    const selectedHotel = sortedHotels[0] || null;
    const baseHotelNight = isUltraBudget
      ? 450
      : (isBudgetConstrained
          ? Math.min(850, selectedHotel ? selectedHotel.startingPriceInr : 850)
          : (selectedHotel ? selectedHotel.startingPriceInr : 2500));
    const totalHotelCost = baseHotelNight * Math.max(0, days - 1);

    const generatedDays: any[] = [];
    let cumulativeTicketCost = 0;
    let attractionIndex = 0;

    for (let dayNum = 1; dayNum <= days; dayNum++) {
      const morningAttraction = attractions[attractionIndex % attractions.length];
      attractionIndex++;
      const afternoonAttraction = attractions[attractionIndex % attractions.length];
      attractionIndex++;

      const getTicketPrice = (a: any) => {
        if (!a) return 0;
        if (a.entryType === 'FREE' || !a.ticketRequired) return 0;
        return a.entryFee || a.adultIndianFee || a.ticketTypes?.[0]?.priceInr || 0;
      };

      const morningTicket = getTicketPrice(morningAttraction);
      const afternoonTicket = getTicketPrice(afternoonAttraction);
      cumulativeTicketCost += morningTicket + afternoonTicket;

      const formatEntryLabel = (a: any) => {
        if (!a) return 'Entry info verified';
        if (a.entryType === 'FREE') return '🟢 Free Entry — No ticket required';
        if (a.entryType === 'CONDITIONAL') return '🟢 General Entry Free (Optional exhibits extra)';
        if (a.entryType === 'PERMIT_REQUIRED') return '⚠️ Permit Required (Check local administration guidelines)';
        return `🎟️ Ticket: ₹${getTicketPrice(a)}`;
      };

      // Real evening activity or attraction if available
      const eveningActivity = !isUltraBudget ? city.activities[dayNum % (city.activities.length || 1)] : null;
      const eveningAttraction = attractions[attractionIndex % attractions.length];
      const hasFreeEveningAttraction = eveningAttraction && eveningAttraction.entryType === 'FREE';

      generatedDays.push({
        dayNumber: dayNum,
        theme: dayNum === 1 ? `Arrival & Iconic Landmarks of ${city.name}` : `Scenic Culture & Local Life in ${city.name}`,
        morning: {
          id: morningAttraction?.id,
          place: morningAttraction ? morningAttraction.name : `${city.name} Heritage Quarter`,
          activity: `Exploration of ${morningAttraction?.name || 'heritage quarter'}. ${formatEntryLabel(morningAttraction)}.`,
          costInr: morningTicket,
          duration: '3 hours',
          entryType: morningAttraction?.entryType || 'FREE'
        },
        afternoon: {
          id: afternoonAttraction?.id,
          place: afternoonAttraction ? afternoonAttraction.name : `Local Traditional Promenade`,
          activity: `Visit ${afternoonAttraction?.name || 'waterfront/promenade'} followed by local regional cuisine. ${formatEntryLabel(afternoonAttraction)}.`,
          costInr: afternoonTicket,
          duration: '2.5 hours',
          entryType: afternoonAttraction?.entryType || 'FREE'
        },
        evening: {
          id: eveningActivity?.id || (hasFreeEveningAttraction ? eveningAttraction.id : undefined),
          place: eveningActivity 
            ? eveningActivity.title 
            : (hasFreeEveningAttraction ? eveningAttraction.name : `${city.name} Public Promenade & Vista`),
          activity: eveningActivity
            ? `${eveningActivity.description || 'Local cultural experience'}. ₹${eveningActivity.pricePerPersonInr || 0}`
            : (hasFreeEveningAttraction ? `Evening visit to ${eveningAttraction.name}. Free entry.` : `Open-air sunset walk in central ${city.name}. Free public access.`),
          costInr: eveningActivity ? (eveningActivity.pricePerPersonInr || 0) : 0,
          duration: '2 hours',
          entryType: eveningActivity ? 'PAID' : 'FREE'
        }
      });
    }

    // 4. Deterministic budget calculations
    const estimatedFoodCost = days * (isUltraBudget ? 250 : (isBudgetConstrained ? 350 : 1000));
    const estimatedTransportCost = days * (isUltraBudget ? 100 : (isBudgetConstrained ? 150 : 700));
    const subtotal = totalHotelCost + cumulativeTicketCost + estimatedFoodCost + estimatedTransportCost;
    const taxesInr = Math.round(subtotal * 0.05);
    const miscellaneousInr = Math.round(subtotal * 0.03);
    const totalEstimatedBudget = subtotal + taxesInr + miscellaneousInr;

    return {
      destination: `${city.name}, ${city.state.name}`,
      bestTimeToVisit: city.bestTimeToVisit,
      summary: `AI Curated ${days}-Day Itinerary tailored for ${input.travelCompanions || 'traveler'} in ${city.name}, prioritizing verified attractions and deterministic expenses within ₹${budget.toLocaleString('en-IN')}.`,
      days: generatedDays,
      recommendedHotel: selectedHotel
        ? {
            id: selectedHotel.id,
            name: selectedHotel.name,
            tier: selectedHotel.tier,
            pricePerNight: selectedHotel.startingPriceInr,
            rating: selectedHotel.rating,
            heroImage: selectedHotel.heroImageUrl
          }
        : null,
      budgetBreakdown: {
        transportInr: estimatedTransportCost,
        hotelsInr: totalHotelCost,
        ticketsInr: cumulativeTicketCost,
        activitiesInr: isBudgetConstrained ? 0 : 300,
        foodInr: estimatedFoodCost,
        miscellaneousInr,
        taxesInr,
        totalInr: totalEstimatedBudget,
        allocatedBudgetInr: budget,
        remainingBudgetInr: Math.max(0, budget - totalEstimatedBudget)
      },
      optimizationTips: [
        `ExploreBharat itinerary engine optimized your schedule based on verified attraction hours and rates.`,
        `Features iconic free places like ${attractions.find(a => a.entryType === 'FREE')?.name || 'public promenades'} requiring ₹0 admission fee.`,
        `Travel using public transit and local metro for an authentic, budget-friendly experience.`,
        `Mornings before 9:00 AM offer the most pleasant weather and fewer crowds.`
      ]
    };
  }

  async getRecommendations(params?: {
    userId?: string;
    interests?: string[];
    currentCityId?: string;
  }) {
    const popularDestinations = await prisma.city.findMany({
      where: { isPopular: true },
      take: 6,
      include: { state: true }
    });

    const topAttractions = await prisma.attraction.findMany({
      where: { isFeatured: true },
      take: 6,
      include: { city: true, category: true }
    });

    const hiddenGems = await prisma.attraction.findMany({
      where: { isHiddenGem: true },
      take: 4,
      include: { city: true, category: true }
    });

    const circuits = await prisma.tourismCircuit.findMany({
      take: 4
    });

    return {
      recommendedDestinations: popularDestinations,
      topAttractions,
      hiddenGems,
      recommendedCircuits: circuits.map((c) => ({
        ...c,
        destinations: parseJsonArray<string>(c.destinations),
        highlights: parseJsonArray<string>(c.highlights)
      }))
    };
  }
}
