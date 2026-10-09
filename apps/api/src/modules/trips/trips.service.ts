import { prisma } from '@bharatyatra/database';
import { AppError } from '../../middleware/error.middleware';

export interface CreateTripDto {
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  companions?: string;
  allocatedBudgetInr?: number;
  transportPreference?: string;
  daysCount?: number;
}

export interface AddItineraryItemDto {
  tripDayId: string;
  timeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  title: string;
  type: 'ATTRACTION' | 'HOTEL' | 'RESTAURANT' | 'ACTIVITY' | 'TRANSIT';
  targetId?: string;
  placeName: string;
  durationMinutes?: number;
  estimatedCostInr?: number;
  travelTimeMinutes?: number;
  notes?: string;
}

export class TripsService {
  async createTrip(data: CreateTripDto) {
    const d1 = new Date(data.startDate);
    const d2 = new Date(data.endDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const days = data.daysCount || Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const tripDaysCreate = [];
    for (let i = 1; i <= days; i++) {
      const curDate = new Date(d1);
      curDate.setDate(curDate.getDate() + (i - 1));
      tripDaysCreate.push({
        dayNumber: i,
        date: curDate.toISOString().split('T')[0],
        title: `Day ${i}: Exploring ${data.destination}`
      });
    }

    const trip = await prisma.trip.create({
      data: {
        userId: data.userId,
        title: data.title,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        companions: data.companions || 'FAMILY',
        allocatedBudgetInr: data.allocatedBudgetInr || 25000,
        transportPreference: data.transportPreference || 'FLIGHT_AND_CAB',
        days: {
          create: tripDaysCreate
        }
      },
      include: {
        days: {
          include: { items: true },
          orderBy: { dayNumber: 'asc' }
        }
      }
    });

    return this.formatTripWithBudget(trip);
  }

  async getUserTrips(userId: string) {
    const trips = await prisma.trip.findMany({
      where: { userId },
      include: {
        days: {
          include: { items: true },
          orderBy: { dayNumber: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return trips.map((t) => this.formatTripWithBudget(t));
  }

  async getTripById(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        days: {
          include: {
            items: { orderBy: { orderIndex: 'asc' } }
          },
          orderBy: { dayNumber: 'asc' }
        }
      }
    });

    if (!trip) throw new AppError('Trip not found.', 404);
    if (trip.userId !== userId) throw new AppError('Forbidden.', 403);

    return this.formatTripWithBudget(trip);
  }

  async addItemToDay(tripId: string, userId: string, itemDto: AddItineraryItemDto) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== userId) throw new AppError('Trip not found.', 404);

    const day = await prisma.tripDay.findUnique({ where: { id: itemDto.tripDayId } });
    if (!day || day.tripId !== tripId) throw new AppError('Invalid trip day.', 400);

    const itemsCount = await prisma.itineraryItem.count({ where: { tripDayId: day.id } });

    const newItem = await prisma.itineraryItem.create({
      data: {
        tripDayId: itemDto.tripDayId,
        timeSlot: itemDto.timeSlot,
        title: itemDto.title,
        type: itemDto.type,
        targetId: itemDto.targetId,
        placeName: itemDto.placeName,
        durationMinutes: itemDto.durationMinutes || 120,
        estimatedCostInr: itemDto.estimatedCostInr || 0,
        travelTimeMinutes: itemDto.travelTimeMinutes || 30,
        notes: itemDto.notes,
        orderIndex: itemsCount
      }
    });

    return newItem;
  }

  async removeItem(tripId: string, userId: string, itemId: string) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== userId) throw new AppError('Trip not found.', 404);

    const item = await prisma.itineraryItem.findUnique({
      where: { id: itemId },
      include: { tripDay: true }
    });

    if (!item || item.tripDay.tripId !== tripId) {
      throw new AppError('Itinerary item not found in this trip.', 404);
    }

    await prisma.itineraryItem.delete({
      where: { id: itemId }
    });

    return { success: true, message: 'Itinerary item removed.' };
  }

  private formatTripWithBudget(trip: any) {
    let ticketsInr = 0;
    let hotelsInr = 0;
    let activitiesInr = 0;
    let foodInr = 0;
    let transportInr = 0;

    for (const day of trip.days || []) {
      for (const item of day.items || []) {
        const cost = item.estimatedCostInr || 0;
        if (item.type === 'ATTRACTION') ticketsInr += cost;
        else if (item.type === 'HOTEL') hotelsInr += cost;
        else if (item.type === 'ACTIVITY') activitiesInr += cost;
        else if (item.type === 'RESTAURANT') foodInr += cost;
        else if (item.type === 'TRANSIT') transportInr += cost;
      }
    }

    // Default base estimations if items are empty
    if (hotelsInr === 0) hotelsInr = (trip.days?.length || 1) * 3500;
    if (foodInr === 0) foodInr = (trip.days?.length || 1) * 1500;
    if (transportInr === 0) transportInr = (trip.days?.length || 1) * 800;

    const subtotal = transportInr + hotelsInr + ticketsInr + activitiesInr + foodInr;
    const taxesInr = Math.round(subtotal * 0.08);
    const miscellaneousInr = Math.round(subtotal * 0.05);
    const totalInr = subtotal + taxesInr + miscellaneousInr;

    const remainingBudgetInr = Math.max(0, trip.allocatedBudgetInr - totalInr);

    return {
      ...trip,
      budgetBreakdown: {
        transportInr,
        hotelsInr,
        ticketsInr,
        activitiesInr,
        foodInr,
        miscellaneousInr,
        taxesInr,
        totalInr,
        allocatedBudgetInr: trip.allocatedBudgetInr,
        remainingBudgetInr
      }
    };
  }

  async optimizeTripSchedule(tripId: string, userId: string) {
    const trip = await this.getTripById(tripId, userId);
    const { ItineraryOptimizerService } = await import('../../services/itinerary-optimizer.service');
    const optimizer = new ItineraryOptimizerService();

    const optimizedDays = [];
    for (const day of trip.days) {
      const attractionItems = (day.items || []).filter((it: any) => it.type === 'ATTRACTION');
      const attractionIds = attractionItems.map((it: any) => it.targetId).filter(Boolean);

      const dbAttractions = await prisma.attraction.findMany({
        where: { id: { in: attractionIds } }
      });

      const optAttractions = dbAttractions.map(a => ({
        id: a.id,
        name: a.name,
        latitude: a.latitude,
        longitude: a.longitude,
        expectedDurationHours: a.expectedDurationHours,
        entryType: a.entryType,
        entryFee: a.entryFee || a.adultIndianFee || 0
      }));

      const optimization = optimizer.optimizeOrder({
        attractions: optAttractions.length > 0 ? optAttractions : [
          { id: 'att-1', name: 'Amber Fort & Palace', latitude: 26.9855, longitude: 75.8513, expectedDurationHours: 2.5 },
          { id: 'att-2', name: 'City Palace Jaipur', latitude: 26.9258, longitude: 75.8237, expectedDurationHours: 2.0 },
          { id: 'att-3', name: 'Hawa Mahal', latitude: 26.9239, longitude: 75.8267, expectedDurationHours: 1.0 }
        ]
      });

      optimizedDays.push({
        dayNumber: day.dayNumber,
        date: day.date,
        totalTransitDistanceKm: optimization.totalTransitDistanceKm,
        totalTransitTimeMinutes: optimization.totalTransitTimeMinutes,
        warnings: optimization.warnings,
        schedule: optimization.orderedStops
      });
    }

    return {
      tripId,
      destination: trip.destination,
      optimizedDays
    };
  }

  async optimizeTripBudget(tripId: string, userId: string) {
    const trip = await this.getTripById(tripId, userId);
    const { BudgetOptimizerService } = await import('../../services/budget-optimizer.service');
    const budgetOptimizer = new BudgetOptimizerService();

    const breakdown = trip.budgetBreakdown;
    return budgetOptimizer.analyzeBudget({
      allocatedBudgetInr: trip.allocatedBudgetInr,
      currentTotalInr: breakdown.totalInr,
      hotelCostInr: breakdown.hotelsInr,
      transportCostInr: breakdown.transportInr,
      ticketsCostInr: breakdown.ticketsInr,
      foodCostInr: breakdown.foodInr,
      days: trip.days?.length || 3,
      travellers: 2,
      destination: trip.destination
    });
  }
}
