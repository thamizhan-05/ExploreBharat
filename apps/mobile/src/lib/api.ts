// Mobile API Client communicating with the unified ExploreBharat Backend API Gateway
import { Platform } from 'react-native';

const API_BASE = Platform.select({
  android: 'http://10.0.2.2:4000/api',
  default: 'http://localhost:4000/api'
});

let authToken: string | null = null;
let currentMobileUser: any | null = null;

export function setAuthToken(token: string, user?: any): void {
  authToken = token;
  if (user) currentMobileUser = user;
}

export function getAuthToken(): string | null {
  return authToken;
}

export function clearAuthToken(): void {
  authToken = null;
  currentMobileUser = null;
}

export function getCurrentMobileUser(): any | null {
  return currentMobileUser;
}

export async function mobileRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers as Record<string, string>)
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const mobileApi = {
  // Authentication
  login: async (email = 'user@explorebharat.local', password = 'User@1234') => {
    const res = await mobileRequest<{ success: boolean; data: { accessToken: string; user: any } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.data?.accessToken) {
      setAuthToken(res.data.accessToken, res.data.user);
    }
    return res;
  },
  
  ensureAuthenticated: async () => {
    if (!authToken) {
      await mobileApi.login();
    }
    return authToken;
  },

  // Discover & Explore
  getAttractions: (query = '') => mobileRequest<any>(`/attractions${query}`),
  getCities: (query = '') => mobileRequest<any>(`/destinations/cities${query}`),
  getNearby: (lat: number, lng: number) => mobileRequest<any>(`/attractions/nearby?lat=${lat}&lng=${lng}`),
  getHotels: (query = '') => mobileRequest<any>(`/hotels${query}`),
  getHiddenGems: () => mobileRequest<any>('/v1/attractions/hidden-gems'),
  getEvents: (query = '') => mobileRequest<any>(`/events${query}`),
  getCityFood: (cityId: string) => mobileRequest<any>(`/destinations/cities/${cityId}/food`),
  getCityEmergency: (cityId: string) => mobileRequest<any>(`/destinations/cities/${cityId}/emergency`),
  search: (q: string) => mobileRequest<any>(`/search?q=${encodeURIComponent(q)}`),

  // Trips & AI Itinerary
  getMyTrips: async () => {
    await mobileApi.ensureAuthenticated();
    return mobileRequest<any>('/trips');
  },
  generateAiPlan: (body: any) => mobileRequest<any>('/ai/plan-trip', { method: 'POST', body: JSON.stringify(body) }),

  // Bookings & Wallet
  getMyBookings: async () => {
    await mobileApi.ensureAuthenticated();
    return mobileRequest<any>('/bookings');
  },
  getWalletPasses: async () => {
    await mobileApi.ensureAuthenticated();
    return mobileRequest<any>('/wallet');
  },
  getPassByReference: async (reference: string) => {
    await mobileApi.ensureAuthenticated();
    return mobileRequest<any>(`/wallet/passes/${encodeURIComponent(reference)}`);
  },
  getPassport: async () => {
    await mobileApi.ensureAuthenticated();
    return mobileRequest<any>('/passport');
  },

  // Multimodal Transport & Live Railway Status
  planMultimodalJourney: (body: {
    origin: string;
    destination: string;
    date: string;
    preference?: 'FASTEST' | 'CHEAPEST' | 'BALANCED' | 'COMFORT';
  }) => mobileRequest<any>('/journeys/plan', { method: 'POST', body: JSON.stringify(body) }),

  lookupPnr: (pnr: string) => mobileRequest<any>(`/transport/pnr/${encodeURIComponent(pnr)}`),
  getLiveTrainStatus: (trainNumber: string) => mobileRequest<any>(`/transport/live-status/${encodeURIComponent(trainNumber)}`),
  getTrains: (params: { origin: string; destination: string; date: string }) =>
    mobileRequest<any>(`/transport/trains?origin=${encodeURIComponent(params.origin)}&destination=${encodeURIComponent(params.destination)}&date=${encodeURIComponent(params.date)}`),
  getFlights: (params: { origin: string; destination: string; date: string }) =>
    mobileRequest<any>(`/transport/flights?origin=${encodeURIComponent(params.origin)}&destination=${encodeURIComponent(params.destination)}&date=${encodeURIComponent(params.date)}`),
  getBuses: (params: { origin: string; destination: string; date: string }) =>
    mobileRequest<any>(`/transport/buses?origin=${encodeURIComponent(params.origin)}&destination=${encodeURIComponent(params.destination)}&date=${encodeURIComponent(params.date)}`)
};
