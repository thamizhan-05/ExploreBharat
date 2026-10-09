/**
 * ExploreBharat Domain & Platform Constants
 * Eliminates magic numbers and strings across backend services
 */

export const PLATFORM_CONSTANTS = {
  // Pagination Defaults
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Financial & Commercial Constants
  DEFAULT_CURRENCY: 'INR',
  PLATFORM_COMMISSION_RATE: 0.08, // 8% standard B2B platform commission
  GST_RATE_STANDARD: 0.05,       // 5% standard travel services GST

  // Geospatial & Haversine Constants
  EARTH_RADIUS_KM: 6371,
  DEFAULT_NEARBY_RADIUS_KM: 50,
  MAX_SEARCH_RADIUS_KM: 300,

  // Cache & Expiry Durations (Seconds)
  WEATHER_CACHE_TTL_SEC: 1800, // 30 minutes
  SCHEDULE_CACHE_TTL_SEC: 86400, // 24 hours

  // Quality Thresholds
  MIN_VERIFIED_QUALITY_SCORE: 70,
  MAX_IMAGE_DHASH_HAMMING_DISTANCE: 10 // Maximum distance to consider images duplicates
} as const;

export const DISCOVERY_TYPES = {
  POPULAR: 'POPULAR',
  LESSER_KNOWN: 'LESSER_KNOWN',
  HIDDEN_GEM: 'HIDDEN_GEM',
  LOCAL_SECRET: 'LOCAL_SECRET',
  SEASONAL: 'SEASONAL',
  EMERGING: 'EMERGING'
} as const;

export const ENTRY_TYPES = {
  FREE: 'FREE',
  PAID: 'PAID',
  CONDITIONAL: 'CONDITIONAL',
  PERMIT_REQUIRED: 'PERMIT_REQUIRED',
  UNKNOWN: 'UNKNOWN'
} as const;

export const VERIFICATION_STATUSES = {
  VERIFIED_ASI: 'VERIFIED_ASI',
  VERIFIED_OFFICIAL: 'VERIFIED_OFFICIAL',
  COMMUNITY_SUBMITTED: 'COMMUNITY_SUBMITTED',
  UNVERIFIED: 'UNVERIFIED',
  PENDING_REVIEW: 'PENDING_REVIEW'
} as const;
