import { GeoPoint, RouteLegResult, RouteOptions, RouteProvider } from './route-provider.interface';

export class TaxiFareProvider implements RouteProvider {
  readonly providerName = 'ExploreBharat Regional Fare Rules Engine';
  readonly supportedModes = ['AUTO', 'CAB', 'TAXI', 'WALK', 'METRO'];

  /**
   * Great circle distance in km between two coordinate points
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
    // Road distance is typically ~1.3x Euclidean distance in Indian city grids
    return Math.max(0.8, Math.round(R * c * 1.3 * 10) / 10);
  }

  async computeLeg(origin: GeoPoint, destination: GeoPoint, options?: RouteOptions): Promise<RouteLegResult | null> {
    const mode = options?.preferredMode?.toUpperCase() || 'AUTO';
    const distanceKm = TaxiFareProvider.calculateDistance(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude
    );

    let fare = 0;
    let durationMinutes = 0;
    let fareDetails = '';
    let notes = '';
    let providerName = '';

    if (mode === 'WALK') {
      fare = 0;
      durationMinutes = Math.round(distanceKm * 12.5); // 4.8 km/h
      fareDetails = 'Free pedestrian route.';
      notes = `Pedestrian walking distance of ${distanceKm} km. Wear comfortable walking shoes.`;
      providerName = 'Pedestrian Walkway';
    } else if (mode === 'METRO') {
      // Tiered metro fare
      if (distanceKm <= 2) fare = 10;
      else if (distanceKm <= 5) fare = 20;
      else if (distanceKm <= 12) fare = 30;
      else if (distanceKm <= 21) fare = 40;
      else if (distanceKm <= 32) fare = 50;
      else fare = 60;

      durationMinutes = Math.round(distanceKm * 2.2 + 8); // ~28 km/h + station stops
      fareDetails = `Official Rapid Metro tiered fare card. Token or smart card.`;
      notes = `Urban rapid metro connection. Service headway: every 4–8 minutes.`;
      providerName = 'City Metro Rail Network';
    } else if (mode === 'CAB' || mode === 'TAXI') {
      // Base ₹70 for first 2 km + ₹18/km thereafter
      fare = distanceKm <= 2 ? 70 : Math.round(70 + (distanceKm - 2) * 18);
      durationMinutes = Math.round(distanceKm * 3.0 + 5); // ~20 km/h in city traffic
      fareDetails = `Estimated cab / taxi tariff based on ₹70 base + ₹18/km standard non-surge rates.`;
      notes = `Estimated fare according to regional taxi fare models. Final fare may fluctuate with peak traffic surge or parking charges.`;
      providerName = 'Local Tourist Taxi / App-Cab';
    } else {
      // AUTO RICKSHAW (Default)
      // Base ₹30 for first 1.5 km + ₹14/km thereafter
      fare = distanceKm <= 1.5 ? 30 : Math.round(30 + (distanceKm - 1.5) * 14);
      durationMinutes = Math.round(distanceKm * 3.2 + 4); // ~18 km/h in city traffic
      fareDetails = `Estimated auto-rickshaw fare based on ₹30 base + ₹14/km standard metered tariff.`;
      notes = `Estimated according to municipal metered fare rules. Drivers may operate by digital ride apps or manual meter.`;
      providerName = 'Local Metered Auto-Rickshaw';
    }

    const departureTime = options?.departureDateTime || '2026-11-15 09:00 AM';
    
    return {
      origin,
      destination,
      transportMode: mode,
      provider: providerName,
      serviceName: `${mode === 'AUTO' ? 'Auto-Rickshaw' : (mode === 'CAB' ? 'Point-to-Point Cab' : mode)} Transfer`,
      departureTime,
      arrivalTime: departureTime, // Will be scheduled by planner engine
      durationMinutes: Math.max(8, durationMinutes),
      distanceKm,
      fare,
      currency: 'INR',
      fareType: mode === 'WALK' ? 'SCHEDULED' : 'ESTIMATED',
      fareDetails,
      bookingRequired: false,
      availabilityStatus: 'AVAILABLE',
      source: 'Municipal Transport Fare Model',
      sourceType: 'ESTIMATED_MODEL',
      confidenceStatus: mode === 'WALK' ? 'VERIFIED' : 'ESTIMATED',
      isTightConnection: false,
      bufferMinutes: 10,
      liveStatus: 'ON_TIME',
      delayMinutes: 0,
      transfersCount: 0,
      notes
    };
  }
}
