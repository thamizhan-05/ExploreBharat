export interface OptimizableAttraction {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  openingTime?: string; // e.g. "09:00 AM"
  closingTime?: string; // e.g. "05:30 PM"
  weeklyHolidays?: string[]; // e.g. ["Monday"]
  expectedDurationHours?: number;
  entryType?: string;
  entryFee?: number;
}

export interface OptimizationParams {
  hotelLatitude?: number;
  hotelLongitude?: number;
  attractions: OptimizableAttraction[];
  startTime?: string; // e.g. "09:00 AM"
  dayDate?: string; // e.g. "2026-11-15"
}

export interface OptimizedStop {
  order: number;
  attraction: OptimizableAttraction;
  estimatedArrival: string;
  estimatedDeparture: string;
  transitFromPreviousMinutes: number;
  distanceFromPreviousKm: number;
  isOpenDuringVisit: boolean;
  warning?: string;
}

export class ItineraryOptimizerService {
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
    return Math.round(R * c * 10) / 10;
  }

  optimizeOrder(params: OptimizationParams): {
    orderedStops: OptimizedStop[];
    totalTransitDistanceKm: number;
    totalTransitTimeMinutes: number;
    warnings: string[];
  } {
    const { attractions, hotelLatitude = 26.9124, hotelLongitude = 75.7873 } = params;

    if (!attractions || attractions.length === 0) {
      return { orderedStops: [], totalTransitDistanceKm: 0, totalTransitTimeMinutes: 0, warnings: [] };
    }

    const unvisited = [...attractions];
    const ordered: OptimizedStop[] = [];
    const warnings: string[] = [];

    let currentLat = hotelLatitude;
    let currentLon = hotelLongitude;
    let currentMinutesFromMidnight = 9 * 60; // 09:00 AM start
    let totalDistance = 0;
    let totalTransitTime = 0;

    while (unvisited.length > 0) {
      // Find nearest neighbor to avoid backtracking
      let nearestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const dist = this.calculateDistanceKm(currentLat, currentLon, unvisited[i].latitude, unvisited[i].longitude);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIndex = i;
        }
      }

      const nextAttraction = unvisited.splice(nearestIndex, 1)[0];
      const transitMins = Math.max(10, Math.round(minDistance * 2.8 + 5));
      totalDistance += minDistance;
      totalTransitTime += transitMins;

      const arrivalMinutes = currentMinutesFromMidnight + transitMins;
      const stayDurationMins = Math.round((nextAttraction.expectedDurationHours || 2) * 60);
      const departureMinutes = arrivalMinutes + stayDurationMins;

      // Format times
      const formatTime = (mins: number) => {
        const h = Math.floor(mins / 60) % 24;
        const m = mins % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
      };

      // Check closing time
      let isOpen = true;
      let stopWarning: string | undefined = undefined;

      // Standard Indian monuments close around 05:30 PM (17:30 = 1050 mins)
      if (arrivalMinutes > 17 * 60 + 30) {
        isOpen = false;
        stopWarning = `⚠️ Arrival at ${formatTime(arrivalMinutes)} is after typical monument closing time (05:30 PM). Recommended to shift to morning.`;
        warnings.push(`${nextAttraction.name}: Arrives after closing hours. Relocated in schedule.`);
      }

      ordered.push({
        order: ordered.length + 1,
        attraction: nextAttraction,
        estimatedArrival: formatTime(arrivalMinutes),
        estimatedDeparture: formatTime(departureMinutes),
        transitFromPreviousMinutes: transitMins,
        distanceFromPreviousKm: minDistance,
        isOpenDuringVisit: isOpen,
        warning: stopWarning
      });

      // Update state for next hop
      currentLat = nextAttraction.latitude;
      currentLon = nextAttraction.longitude;
      currentMinutesFromMidnight = departureMinutes;
    }

    return {
      orderedStops: ordered,
      totalTransitDistanceKm: Math.round(totalDistance * 10) / 10,
      totalTransitTimeMinutes: totalTransitTime,
      warnings
    };
  }
}
