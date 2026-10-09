// ==========================================
// ExploreBharat Shared TypeScript Interfaces & DTOs
// ==========================================

export enum UserRole {
  USER = 'USER',
  VENDOR = 'VENDOR',
  GUIDE = 'GUIDE',
  ATTRACTION_MANAGER = 'ATTRACTION_MANAGER',
  HOTEL_MANAGER = 'HOTEL_MANAGER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  preferredLanguage?: string;
  travelStyle?: string;
  budgetPreference?: string;
  interests?: string[];
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

// ----------------- GEOGRAPHY -----------------
export interface StateDto {
  id: string;
  name: string;
  code: string;
  isUnionTerritory: boolean;
  capital: string;
  description: string;
  imageUrl?: string;
  citiesCount?: number;
  attractionsCount?: number;
}

export interface CityDto {
  id: string;
  name: string;
  stateId: string;
  stateName?: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  bestTimeToVisit: string;
  weatherOverview?: string;
  isPopular: boolean;
}

// ----------------- ATTRACTIONS & TICKETS -----------------
export enum EntryType {
  FREE = 'FREE',
  PAID = 'PAID',
  CONDITIONAL = 'CONDITIONAL',
  PERMIT_REQUIRED = 'PERMIT_REQUIRED',
  UNKNOWN = 'UNKNOWN'
}

export enum FeeVerificationStatus {
  VERIFIED = 'VERIFIED',
  PARTIALLY_VERIFIED = 'PARTIALLY_VERIFIED',
  UNVERIFIED = 'UNVERIFIED'
}

export enum VerificationStatus {
  VERIFIED_OFFICIAL = 'VERIFIED_OFFICIAL',
  VERIFIED_ASI = 'VERIFIED_ASI',
  VERIFIED_TOURISM_DEPT = 'VERIFIED_TOURISM_DEPT',
  COMMUNITY_SUBMITTED = 'COMMUNITY_SUBMITTED',
  PENDING = 'PENDING'
}

export interface AttractionCategoryDto {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description?: string;
}

export interface TicketTypeDto {
  id: string;
  attractionId: string;
  name: string;
  description: string;
  priceInr: number;
  foreignerPriceInr: number;
  childPriceInr: number;
  seniorPriceInr: number;
  includesGuide: boolean;
  validityHours: number;
}

export enum DiscoveryType {
  POPULAR = 'POPULAR',
  LESSER_KNOWN = 'LESSER_KNOWN',
  HIDDEN_GEM = 'HIDDEN_GEM',
  LOCAL_SECRET = 'LOCAL_SECRET',
  SEASONAL = 'SEASONAL',
  EMERGING = 'EMERGING'
}

export interface AttractionDetailDto {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  cityName: string;
  stateName: string;
  stateCode?: string;
  country?: string;
  unionTerritory?: boolean;
  district?: string | null;
  taluka?: string | null;
  tehsil?: string | null;
  town?: string | null;
  village?: string | null;
  categoryId: string;
  categoryName: string;
  subcategory?: string | null;
  discoveryType?: DiscoveryType | string;
  description: string;
  history?: string;
  heroImageUrl: string;
  galleryImages: string[];
  latitude: number;
  longitude: number;
  bestTimeToVisit: string;
  openingTime: string;
  closingTime: string;
  weeklyHolidays: string[];
  expectedDurationHours: number;
  accessibilityFeatures: string[];
  hasParking: boolean;
  hasWashrooms: boolean;
  hasFoodCourt: boolean;
  safetyTips: string[];
  travelTips: string[];
  howToReach: {
    byAir?: string;
    byRail?: string;
    byRoad?: string;
  };
  contactInformation?: string | null;
  officialWebsite?: string | null;
  officialSource?: string | null;
  sourceType: string;
  sourceName: string;
  sourceUrl?: string;
  verificationStatus: VerificationStatus;
  rating: number;
  reviewsCount: number;
  qualityScore?: number;
  images?: AttractionImageDto[];
  ticketTypes: TicketTypeDto[];
  isFeatured: boolean;
  isHiddenGem: boolean;

  // Entry & Ticketing architecture
  entryType: EntryType;
  entryFee?: number | null;
  adultIndianFee?: number | null;
  childIndianFee?: number | null;
  seniorCitizenFee?: number | null;
  foreignVisitorFee?: number | null;
  studentFee?: number | null;
  currency: string;
  ticketRequired: boolean;
  bookingRequired: boolean;
  onlineBookingAvailable: boolean;
  walkInAvailable: boolean;
  ticketProvider?: string | null;
  officialBookingUrl?: string | null;
  entryDescription?: string | null;
  permitInformation?: string | null;
  permitAuthority?: string | null;
  permitUrl?: string | null;
  requiredDocuments?: string[];
  restrictions?: string[];
  lastFeeVerifiedAt?: string | null;
  feeSource?: string | null;
  feeVerificationStatus?: FeeVerificationStatus;
}

export type ImageSourceType =
  | 'OFFICIAL_GOVERNMENT'
  | 'OFFICIAL_ATTRACTION'
  | 'LICENSED_PROVIDER'
  | 'COMMUNITY'
  | 'GOOGLE_PLACES'
  | 'WIKIMEDIA_COMMONS'
  | 'EXPLOREBHARAT_UPLOAD'
  | 'OTHER_AUTHORIZED_SOURCE';

export interface AttractionImageDto {
  id: string;
  attractionId: string;
  sourceType: ImageSourceType | string;
  sourceName: string;
  sourceUrl?: string | null;
  imageUrl: string;
  thumbnailUrl?: string | null;
  mediumUrl?: string | null;
  largeUrl?: string | null;
  caption?: string | null;
  altText?: string | null;
  license: string;
  attribution: string;
  photographer?: string | null;
  isPrimary: boolean;
  displayOrder: number;
  width?: number | null;
  height?: number | null;
  fileSize?: number | null;
  mimeType?: string | null;
  contentHash?: string | null;
  perceptualHash?: string | null;
  verificationStatus: 'VERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED' | 'FLAG_NEEDS_REVIEW' | string;
  createdAt: string;
  verifiedAt?: string | null;
}

export interface PlaceSuggestionDto {
  id: string;
  userId?: string | null;
  name: string;
  state: string;
  district?: string | null;
  city?: string | null;
  category: string;
  description: string;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  entryType: string;
  entryFee?: number | null;
  bestTimeToVisit?: string | null;
  howToReach?: string | null;
  whyWorthVisiting?: string | null;
  submittedByEmail?: string | null;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

// ----------------- HOTELS -----------------
export enum HotelTier {
  BUDGET = 'BUDGET',
  STANDARD = 'STANDARD',
  HERITAGE = 'HERITAGE',
  LUXURY = 'LUXURY',
  RESORT = 'RESORT',
  HOMESTAY = 'HOMESTAY'
}

export interface HotelImageDto {
  id: string;
  hotelId: string;
  imageUrl: string;
  thumbnailUrl?: string | null;
  sourceType: string;
  sourceName: string;
  sourceUrl?: string | null;
  license: string;
  attribution: string;
  photographer?: string | null;
  isPrimary: boolean;
  displayOrder: number;
  contentHash?: string | null;
  verificationStatus: string;
  createdAt: string;
}

export interface HotelRoomDto {
  id: string;
  hotelId: string;
  title: string;
  roomType: string;
  basePriceInr: number;
  maxGuests: number;
  bedType: string;
  includesBreakfast: boolean;
  amenities: string[];
  images: string[];
  availableCount: number;
}

export interface HotelDetailDto {
  id: string;
  name: string;
  officialName?: string | null;
  cityId: string;
  cityName: string;
  stateName: string;
  district?: string | null;
  address: string;
  latitude: number;
  longitude: number;
  tier: HotelTier;
  rating: number;
  reviewsCount: number;
  startingPriceInr: number;
  priceType?: 'STARTING_FROM' | 'ESTIMATED' | 'LIVE' | 'PRICE_ON_REQUEST' | string;
  priceSource?: string;
  priceRetrievedAt?: string | null;
  availabilityStatus?: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'UNKNOWN' | string;
  phone?: string | null;
  website?: string | null;
  qualityScore?: number;
  heroImageUrl: string;
  galleryImages: string[];
  description: string;
  amenities: string[];
  cancellationPolicy: string;
  checkInTime: string;
  checkOutTime: string;
  distanceFromAttractionKm?: number;
  images?: HotelImageDto[];
  rooms: HotelRoomDto[];
}

// ----------------- ACTIVITIES & RESTAURANTS -----------------
export interface ActivityDto {
  id: string;
  title: string;
  cityId: string;
  cityName: string;
  category: string;
  durationHours: number;
  pricePerPersonInr: number;
  difficulty?: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  included: string[];
  slots: string[];
}

export interface RestaurantDto {
  id: string;
  name: string;
  cityId: string;
  cuisine: string[];
  priceRange: string;
  rating: number;
  address: string;
  mustTryDishes: string[];
  imageUrl: string;
}

// ----------------- CIRCUITS -----------------
export interface TourismCircuitDto {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  coverImageUrl: string;
  recommendedDays: number;
  estimatedCostInr: number;
  destinations: string[];
  highlights: string[];
}

// ----------------- BOOKING & PAYMENTS -----------------
export enum BookingType {
  ATTRACTION_TICKET = 'ATTRACTION_TICKET',
  HOTEL = 'HOTEL',
  ACTIVITY = 'ACTIVITY'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface BookingReceiptDto {
  id: string;
  bookingReference: string;
  userId: string;
  bookingType: BookingType;
  status: BookingStatus;
  title: string;
  location: string;
  checkInDate: string;
  checkOutDate?: string;
  slotTime?: string;
  guestCount: number;
  totalAmountInr: number;
  taxAmountInr: number;
  convenienceFeeInr: number;
  qrCodeData: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
  details: Record<string, any>;
}

// ----------------- TRIPS & BUDGET -----------------
export interface ItineraryItemDto {
  id: string;
  tripDayId: string;
  timeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  title: string;
  type: 'ATTRACTION' | 'HOTEL' | 'RESTAURANT' | 'ACTIVITY' | 'TRANSIT';
  targetId?: string;
  placeName: string;
  durationMinutes: number;
  estimatedCostInr: number;
  travelTimeMinutes?: number;
  notes?: string;
}

export interface TripDayDto {
  id: string;
  dayNumber: number;
  date?: string;
  title?: string;
  items: ItineraryItemDto[];
}

export interface BudgetBreakdownDto {
  transportInr: number;
  hotelsInr: number;
  ticketsInr: number;
  activitiesInr: number;
  foodInr: number;
  miscellaneousInr: number;
  taxesInr: number;
  totalInr: number;
}

export interface TripDto {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  companions: string;
  allocatedBudgetInr: number;
  transportPreference: string;
  days: TripDayDto[];
  budgetBreakdown: BudgetBreakdownDto;
}

// ----------------- AI PLANNING -----------------
export interface AiTripPlanRequest {
  startingCity: string;
  destinationStateOrCity: string;
  daysCount: number;
  budgetInr: number;
  travelCompanions: 'SOLO' | 'COUPLE' | 'FAMILY' | 'FRIENDS';
  interests: string[];
}

export interface AiTripPlanResponse {
  summary: string;
  suggestedDestinations: string[];
  days: {
    dayNumber: number;
    theme: string;
    morning: { activity: string; place: string; costInr: number; duration: string };
    afternoon: { activity: string; place: string; costInr: number; duration: string };
    evening: { activity: string; place: string; costInr: number; duration: string };
  }[];
  budgetBreakdown: BudgetBreakdownDto;
  optimizationTips: string[];
}

// ----------------- API ENVELOPE & SEARCH -----------------
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface SearchResultsDto {
  query: string;
  attractions: AttractionDetailDto[];
  destinations: CityDto[];
  hotels: HotelDetailDto[];
  circuits: TourismCircuitDto[];
  activities: ActivityDto[];
}

// ----------------- MULTIMODAL TRAVEL PLANNER -----------------
export enum TransportMode {
  WALK = 'WALK',
  BICYCLE = 'BICYCLE',
  AUTO = 'AUTO',
  TAXI = 'TAXI',
  CAB = 'CAB',
  CAR = 'CAR',
  BUS = 'BUS',
  METRO = 'METRO',
  LOCAL_TRAIN = 'LOCAL_TRAIN',
  INTERCITY_TRAIN = 'INTERCITY_TRAIN',
  FLIGHT = 'FLIGHT',
  FERRY = 'FERRY',
  OTHER_PUBLIC = 'OTHER_PUBLIC'
}

export enum FareType {
  LIVE = 'LIVE',
  ESTIMATED = 'ESTIMATED',
  SCHEDULED = 'SCHEDULED',
  STARTING_FROM = 'STARTING_FROM',
  UNKNOWN = 'UNKNOWN'
}

export enum ConfidenceStatus {
  LIVE = 'LIVE',
  VERIFIED = 'VERIFIED',
  SCHEDULED = 'SCHEDULED',
  ESTIMATED = 'ESTIMATED',
  UNKNOWN = 'UNKNOWN'
}

export interface TransferDto {
  id: string;
  journeyLegId: string;
  transferLocation: string;
  durationMinutes: number;
  walkDistanceMeters: number;
  isTight: boolean;
  instructions?: string;
}

export interface JourneyLegDto {
  id: string;
  tripId: string;
  tripDayId?: string | null;
  sequence: number;
  origin: string;
  destination: string;
  originLatitude?: number | null;
  originLongitude?: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  transportMode: TransportMode | string;
  provider?: string | null;
  serviceName?: string | null;
  serviceNumber?: string | null;
  departureDateTime: string;
  arrivalDateTime: string;
  scheduledDepartureDateTime?: string | null;
  scheduledArrivalDateTime?: string | null;
  estimatedDepartureDateTime?: string | null;
  estimatedArrivalDateTime?: string | null;
  durationMinutes: number;
  distanceKm: number;
  fare?: number | null;
  currency: string;
  fareType: FareType | string;
  fareDetails?: string | null;
  bookingRequired: boolean;
  bookingUrl?: string | null;
  availabilityStatus: string;
  source: string;
  sourceUrl?: string | null;
  sourceType: string;
  retrievedAt: string;
  lastUpdatedAt: string;
  confidenceStatus: ConfidenceStatus | string;
  isTightConnection: boolean;
  connectionWarning?: string | null;
  bufferMinutes: number;
  liveStatus: 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'STATUS_UNAVAILABLE' | string;
  delayMinutes: number;
  notes?: string | null;
  transfers?: TransferDto[];
}

export interface TransportOptionDto {
  id: string;
  tripId: string;
  optionType: 'FASTEST' | 'CHEAPEST' | 'BALANCED' | 'MOST_CONVENIENT' | 'LEAST_TRANSFERS' | string;
  title: string;
  description: string;
  totalDurationMinutes: number;
  totalCostInr: number;
  totalTransfers: number;
  modesSummary: string[];
  isRecommended: boolean;
  legs: JourneyLegDto[];
}

export interface TripCostDto {
  id?: string;
  tripId: string;
  intercityTransportInr: number;
  localTransportInr: number;
  hotelInr: number;
  attractionsInr: number;
  activitiesInr: number;
  foodEstimateInr: number;
  otherKnownCostsInr: number;
  totalEstimatedInr: number;
  knownCostInr: number;
  estimatedCostInr: number;
  unknownCostCount: number;
  currency: string;
  breakdownNotes?: string | null;
  lastCalculatedAt: string;
}

export interface TravelAlertDto {
  id: string;
  tripId: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  alertType: 'DELAY' | 'TIGHT_CONNECTION' | 'CANCELLATION' | 'CLOSURE' | 'WEATHER';
  title: string;
  message: string;
  affectedLeg?: string | null;
  actionUrl?: string | null;
  isDismissed: boolean;
  createdAt: string;
}

export interface SmartJourneyPlanRequestDto {
  origin: string;
  originLatitude?: number;
  originLongitude?: number;
  destination: string;
  startDate: string;
  endDate?: string;
  travellersCount?: number;
  travellerType?: 'SOLO' | 'COUPLE' | 'FAMILY' | 'SENIOR_CITIZENS' | 'CHILDREN' | string;
  budgetInr?: number;
  transportPreference?: 'CHEAPEST' | 'FASTEST' | 'BALANCED' | 'TRAIN_PREFERRED' | 'BUS_PREFERRED' | 'FLIGHT_PREFERRED' | 'PRIVATE_VEHICLE' | 'PUBLIC_TRANSPORT' | string;
  walkingPreference?: 'MINIMAL' | 'MODERATE' | 'EXTENSIVE' | string;
  maxTransfers?: number;
  preferredDepartureTime?: string;
  preferredArrivalTime?: string;
  hotelTier?: 'BUDGET' | 'STANDARD' | 'HERITAGE' | 'LUXURY' | string;
  attractionPreferences?: string[];
}

export interface SmartJourneyPlanResponseDto {
  tripId: string;
  summary: {
    origin: string;
    destination: string;
    startDate: string;
    endDate: string;
    travellersCount: number;
    recommendedOption: string;
    totalDurationFormatted: string;
    totalCostFormatted: string;
  };
  options: TransportOptionDto[];
  activeItinerary: {
    days: Array<{
      dayNumber: number;
      date: string;
      title: string;
      timeline: Array<{
        type: 'TRANSIT' | 'HOTEL_CHECKIN' | 'ATTRACTION' | 'ACTIVITY' | 'MEAL' | 'HOTEL_CHECKOUT';
        time: string;
        title: string;
        subtitle?: string;
        location: string;
        durationMinutes: number;
        costInr?: number;
        costLabel?: string;
        statusBadge?: string;
        transportMode?: string;
        bookingUrl?: string;
        notes?: string;
        isTightConnection?: boolean;
        source?: string;
        confidence?: string;
        coordinates?: { lat: number; lng: number };
      }>;
    }>;
  };
  costBreakdown: TripCostDto;
  alerts: TravelAlertDto[];
  isDemoMode: boolean;
  sourceAttribution: string;
}

// ----------------- PHASE 2: TRAVEL SUPER-APP TYPES -----------------
export interface DigitalPassDto {
  id: string;
  bookingReference: string;
  bookingType: string;
  title: string;
  location: string;
  checkInDate: string;
  checkOutDate?: string;
  slotTime?: string;
  guestCount: number;
  totalAmountInr: number;
  qrCodeData: string;
  status: string;
  paymentStatus: string;
  details?: Record<string, any>;
}

export interface TravelPassportDto {
  passportNumber: string;
  holderName: string;
  holderEmail: string;
  stats: {
    statesCount: number;
    citiesCount: number;
    attractionsExploredCount: number;
    badgesUnlockedCount: number;
    totalTravelPoints: number;
  };
  statesVisited: string[];
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    badgeIcon: string;
    progress: string;
  }>;
}

export interface ProviderHealthDto {
  providerId: string;
  name: string;
  type: string;
  status: 'CONNECTED' | 'DEGRADED' | 'NOT_CONFIGURED' | 'ERROR';
  responseTimeMs: number;
  notes: string;
}

