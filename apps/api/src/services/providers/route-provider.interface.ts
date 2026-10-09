export interface GeoPoint {
  name: string;
  latitude: number;
  longitude: number;
  city?: string;
  terminalType?: 'AIRPORT' | 'RAILWAY_STATION' | 'BUS_TERMINAL' | 'METRO_STATION' | 'HOTEL' | 'ATTRACTION' | 'HOME' | 'CUSTOM';
  stationCode?: string;
}

export interface RouteOptions {
  departureDateTime?: string;
  preferredMode?: string;
  travellerType?: string;
  maxTransfers?: number;
  avoidTolls?: boolean;
}

export interface RouteLegResult {
  origin: GeoPoint;
  destination: GeoPoint;
  transportMode: string;
  provider: string;
  serviceName?: string;
  serviceNumber?: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  distanceKm: number;
  fare?: number;
  currency: string;
  fareType: 'LIVE' | 'SCHEDULED' | 'ESTIMATED' | 'STARTING_FROM' | 'UNKNOWN';
  fareDetails?: string;
  bookingRequired: boolean;
  bookingUrl?: string;
  availabilityStatus: string;
  source: string;
  sourceType: string;
  sourceUrl?: string;
  confidenceStatus: 'LIVE' | 'VERIFIED' | 'SCHEDULED' | 'ESTIMATED' | 'UNKNOWN';
  isTightConnection: boolean;
  connectionWarning?: string;
  bufferMinutes: number;
  liveStatus: 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'STATUS_UNAVAILABLE';
  delayMinutes: number;
  transfersCount: number;
  notes?: string;
  polyline?: string;
}

export interface RouteProvider {
  readonly providerName: string;
  readonly supportedModes: string[];
  computeLeg(origin: GeoPoint, destination: GeoPoint, options?: RouteOptions): Promise<RouteLegResult | null>;
}
