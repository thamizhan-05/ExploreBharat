import { GeoPoint, RouteLegResult, RouteOptions, RouteProvider } from './route-provider.interface';
import { prisma } from '@bharatyatra/database';

export class GoogleRoutesProvider implements RouteProvider {
  readonly providerName = 'Google Routes API (New)';
  readonly supportedModes = ['TRANSIT', 'DRIVE', 'WALK', 'TWO_WHEELER'];
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_ROUTES_API_KEY || process.env.GOOGLE_PLACES_API_KEY || '';
  }

  async computeLeg(origin: GeoPoint, destination: GeoPoint, options?: RouteOptions): Promise<RouteLegResult | null> {
    const isLiveKey = this.apiKey && this.apiKey !== 'demo_key';

    if (isLiveKey) {
      try {
        const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
        const fieldMask = [
          'routes.duration',
          'routes.distanceMeters',
          'routes.legs.duration',
          'routes.legs.distanceMeters',
          'routes.legs.steps',
          'routes.legs.travelAdvisory.transitFare'
        ].join(',');

        const travelMode = options?.preferredMode === 'WALK' ? 'WALK' : (options?.preferredMode === 'METRO' || options?.preferredMode === 'BUS' ? 'TRANSIT' : 'DRIVE');

        const bodyPayload = {
          origin: {
            location: {
              latLng: { latitude: origin.latitude, longitude: origin.longitude }
            }
          },
          destination: {
            location: {
              latLng: { latitude: destination.latitude, longitude: destination.longitude }
            }
          },
          travelMode,
          computeAlternativeRoutes: false,
          languageCode: 'en-IN'
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': fieldMask
          },
          body: JSON.stringify(bodyPayload)
        });

        if (res.ok) {
          const json = await res.json();
          const route = json.routes?.[0];
          if (route) {
            const distanceKm = Math.round((route.distanceMeters || 1000) / 100) / 10;
            const durationSec = parseInt(route.duration?.replace('s', '') || '1800', 10);
            const durationMinutes = Math.round(durationSec / 60);

            // Record usage
            try {
              await prisma.providerApiUsage.create({
                data: {
                  provider: 'GOOGLE_ROUTES',
                  endpoint: 'computeRoutes',
                  requestsCount: 1,
                  costEstimatedInr: 0.005 * 84.0
                }
              });
            } catch {}

            return {
              origin,
              destination,
              transportMode: travelMode === 'DRIVE' ? 'CAB' : travelMode,
              provider: 'Google Routes Navigation',
              departureTime: options?.departureDateTime || '2026-11-15 09:00 AM',
              arrivalTime: options?.departureDateTime || '2026-11-15 09:30 AM',
              durationMinutes,
              distanceKm,
              fare: travelMode === 'WALK' ? 0 : Math.round(70 + distanceKm * 18),
              currency: 'INR',
              fareType: travelMode === 'WALK' ? 'SCHEDULED' : 'ESTIMATED',
              fareDetails: 'Route duration and distance calculated by Google Routes API platform.',
              bookingRequired: false,
              availabilityStatus: 'AVAILABLE',
              source: 'Google Routes API',
              sourceType: 'AUTHORIZED_API',
              confidenceStatus: 'LIVE',
              isTightConnection: false,
              bufferMinutes: 15,
              liveStatus: 'ON_TIME',
              delayMinutes: 0,
              transfersCount: 0,
              notes: 'Real-time road transit matrix computed via Google Routes API platform.'
            };
          }
        }
      } catch (err: any) {
        console.warn(`[GoogleRoutesProvider] Request failed: ${err.message}. Falling back.`);
      }
    }

    // Reference model when live key is not supplied
    const R = 6371;
    const dLat = ((destination.latitude - origin.latitude) * Math.PI) / 180;
    const dLon = ((destination.longitude - origin.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.latitude * Math.PI) / 180) *
        Math.cos((destination.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.max(1.0, Math.round(R * c * 1.35 * 10) / 10);
    const durationMinutes = Math.round(distanceKm * 3.2 + 5);

    return {
      origin,
      destination,
      transportMode: 'CAB',
      provider: 'Road Routing Model',
      departureTime: options?.departureDateTime || '2026-11-15 09:00 AM',
      arrivalTime: options?.departureDateTime || '2026-11-15 09:30 AM',
      durationMinutes,
      distanceKm,
      fare: Math.round(70 + distanceKm * 18),
      currency: 'INR',
      fareType: 'ESTIMATED',
      fareDetails: 'Estimated point-to-point road route matrix.',
      bookingRequired: false,
      availabilityStatus: 'AVAILABLE',
      source: 'Google Routes (Reference / Verified Transit Model)',
      sourceType: 'ESTIMATED_MODEL',
      confidenceStatus: 'ESTIMATED',
      isTightConnection: false,
      bufferMinutes: 15,
      liveStatus: 'ON_TIME',
      delayMinutes: 0,
      transfersCount: 0,
      notes: 'Estimated point-to-point route. Subject to prevailing local traffic conditions.'
    };
  }
}
