import { GooglePlacesProvider } from '../google-places.provider';

export type EntryType = 'FREE' | 'PAID' | 'CONDITIONAL' | 'PERMIT_REQUIRED' | 'UNKNOWN';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING_REVIEW' | 'PARTIALLY_VERIFIED' | 'VERIFIED' | 'REJECTED';

export interface NormalizedTourismPlace {
  id?: string;
  name: string;
  normalizedName: string;
  category: string;
  subcategory?: string;
  city: string;
  district?: string;
  state: string;
  stateCode?: string;
  latitude: number;
  longitude: number;
  description: string;
  entryType: EntryType;
  entryFee?: number;
  ticketRequired: boolean;
  bookingRequired: boolean;
  onlineBookingAvailable: boolean;
  walkInAvailable: boolean;
  primaryImageUrl?: string;
  imageAttribution?: string;
  license?: string;
  sourceType: 'OFFICIAL_GOVERNMENT' | 'COMMUNITY' | 'THIRD_PARTY_API' | 'LICENSED_PARTNER';
  sourceName: string;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
  qualityScore: number;
}

export interface TourismDataProvider {
  readonly providerName: string;
  readonly sourceType: 'OFFICIAL_GOVERNMENT' | 'COMMUNITY' | 'THIRD_PARTY_API' | 'LICENSED_PARTNER';

  fetchPlace(identifier: string, context?: Record<string, any>): Promise<NormalizedTourismPlace | null>;
  searchPlaces(query: string, city?: string): Promise<NormalizedTourismPlace[]>;
  validateSource(url: string): Promise<boolean>;
}

/**
 * 1. Official Tourism Department & ASI Provider
 */
export class OfficialTourismProvider implements TourismDataProvider {
  readonly providerName = 'Archaeological Survey of India & State Tourism';
  readonly sourceType = 'OFFICIAL_GOVERNMENT' as const;

  async fetchPlace(identifier: string): Promise<NormalizedTourismPlace | null> {
    // Official lookup mock/registry implementation
    return null;
  }

  async searchPlaces(query: string, city?: string): Promise<NormalizedTourismPlace[]> {
    return [];
  }

  async validateSource(url: string): Promise<boolean> {
    try {
      const parsed = new URL(url);
      const isGov = parsed.hostname.endsWith('.gov.in') || parsed.hostname.endsWith('.nic.in');
      return isGov;
    } catch {
      return false;
    }
  }
}

/**
 * 2. Licensed Image & Content Provider (Wikimedia Commons / Open Licenses)
 */
export class LicensedImageProvider implements TourismDataProvider {
  readonly providerName = 'Wikimedia Commons & Open Cultural Repositories';
  readonly sourceType = 'LICENSED_PARTNER' as const;

  async fetchPlace(identifier: string): Promise<NormalizedTourismPlace | null> {
    return null;
  }

  async searchPlaces(query: string, city?: string): Promise<NormalizedTourismPlace[]> {
    return [];
  }

  async validateSource(url: string): Promise<boolean> {
    return url.includes('commons.wikimedia.org') || url.includes('upload.wikimedia.org');
  }
}

/**
 * 3. Google Places API Provider (Field-masked, quota-aware, attribution-preserving)
 */
export class GooglePlacesTourismProvider implements TourismDataProvider {
  readonly providerName = 'Google Places API (New)';
  readonly sourceType = 'THIRD_PARTY_API' as const;
  private delegate: GooglePlacesProvider;

  constructor() {
    this.delegate = new GooglePlacesProvider();
  }

  async fetchPlace(placeId: string): Promise<NormalizedTourismPlace | null> {
    const res = await this.delegate.getPlaceDetails(placeId);
    if (!res) return null;

    const photo = res.photos && res.photos.length > 0 ? res.photos[0] : null;
    const authorAttr = photo?.authorAttributions && photo.authorAttributions[0];
    const attribution = authorAttr ? `Photo by ${authorAttr.displayName} via Google Maps Platform` : 'Google Maps Platform';

    return {
      name: res.displayName?.text || '',
      normalizedName: (res.displayName?.text || '').toLowerCase().trim(),
      category: res.types?.[0] || 'point_of_interest',
      city: '',
      state: '',
      latitude: res.location?.latitude || 0,
      longitude: res.location?.longitude || 0,
      description: `Discovered via Google Places Platform at ${res.formattedAddress}`,
      entryType: 'UNKNOWN',
      ticketRequired: false,
      bookingRequired: false,
      onlineBookingAvailable: false,
      walkInAvailable: true,
      primaryImageUrl: photo?.photoUrl,
      imageAttribution: attribution,
      license: 'GOOGLE_MAPS_AUTHORIZED_TERMS',
      sourceType: 'THIRD_PARTY_API',
      sourceName: 'Google Places API (New)',
      sourceUrl: res.websiteUri,
      verificationStatus: 'PARTIALLY_VERIFIED',
      qualityScore: 70
    };
  }

  async searchPlaces(query: string, city?: string): Promise<NormalizedTourismPlace[]> {
    const fullQuery = city ? `${query} in ${city}, India` : `${query}, India`;
    const results = await this.delegate.searchPlace(fullQuery);

    return results.map((r) => {
      const photo = r.photos && r.photos.length > 0 ? r.photos[0] : undefined;
      const authorAttr = photo?.authorAttributions && photo.authorAttributions[0];
      const attribution = authorAttr ? `Photo by ${authorAttr.displayName} via Google Maps Platform` : 'Google Maps Platform';

      return {
        name: r.displayName?.text || '',
        normalizedName: (r.displayName?.text || '').toLowerCase().trim(),
        category: r.types?.[0] || 'point_of_interest',
        city: city || '',
        state: '',
        latitude: r.location?.latitude || 0,
        longitude: r.location?.longitude || 0,
        description: `Discovered via Google Places Platform at ${r.formattedAddress}`,
        entryType: 'UNKNOWN',
        ticketRequired: false,
        bookingRequired: false,
        onlineBookingAvailable: false,
        walkInAvailable: true,
        primaryImageUrl: photo?.photoUrl,
        imageAttribution: attribution,
        license: 'GOOGLE_MAPS_AUTHORIZED_TERMS',
        sourceType: 'THIRD_PARTY_API',
        sourceName: 'Google Places API (New)',
        sourceUrl: r.websiteUri,
        verificationStatus: 'PARTIALLY_VERIFIED',
        qualityScore: 65
      };
    });
  }

  async validateSource(url: string): Promise<boolean> {
    return url.includes('google.com') || url.includes('maps.googleapis.com');
  }
}

/**
 * 4. Authorized Community Contribution Provider
 */
export class CommunityTourismProvider implements TourismDataProvider {
  readonly providerName = 'ExploreBharat Verified Community Contributor';
  readonly sourceType = 'COMMUNITY' as const;

  async fetchPlace(identifier: string): Promise<NormalizedTourismPlace | null> {
    return null;
  }

  async searchPlaces(query: string, city?: string): Promise<NormalizedTourismPlace[]> {
    return [];
  }

  async validateSource(url: string): Promise<boolean> {
    return true;
  }
}
