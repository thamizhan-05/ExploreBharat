export type BookingProviderType = 
  | 'FLIGHT'
  | 'TRAIN'
  | 'BUS'
  | 'HOTEL'
  | 'ATTRACTION'
  | 'CAB'
  | 'ACTIVITY';

export type BookingActionType = 
  | 'BOOK_NOW'
  | 'CHECK_AVAILABILITY'
  | 'BOOK_WITH_PROVIDER'
  | 'UNAVAILABLE';

export interface BookingAvailabilityResult {
  providerId: string;
  providerName: string;
  providerType: BookingProviderType;
  actionType: BookingActionType;
  available: boolean;
  inventoryCount?: number;
  fareAmount?: number;
  currency: string;
  fareType: 'LIVE' | 'ESTIMATED' | 'SCHEDULED' | 'STARTING_FROM' | 'UNKNOWN';
  bookingUrl?: string;
  disclaimer?: string;
}

export interface BookingProvider {
  readonly id: string;
  readonly name: string;
  readonly type: BookingProviderType;
  
  checkAvailability(params: {
    itemId: string;
    date: string;
    passengersOrGuests?: number;
    options?: Record<string, any>;
  }): Promise<BookingAvailabilityResult>;

  getBookingUrl(params: {
    itemId: string;
    date: string;
    sourceCode?: string;
    destCode?: string;
  }): string;
}
