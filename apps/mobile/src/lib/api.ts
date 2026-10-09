// Mobile API Client communicating with the unified ExploreBharat Backend API
import { Platform } from 'react-native';

const API_BASE = Platform.select({
  android: 'http://10.0.2.2:4000/api',
  default: 'http://localhost:4000/api'
});

export async function mobileRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
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
  getAttractions: (query = '') => mobileRequest<any>(`/attractions${query}`),
  getCities: (query = '') => mobileRequest<any>(`/destinations/cities${query}`),
  getNearby: (lat: number, lng: number) => mobileRequest<any>(`/attractions/nearby?lat=${lat}&lng=${lng}`),
  getHotels: (query = '') => mobileRequest<any>(`/hotels${query}`),
  getMyBookings: () => mobileRequest<any>('/bookings'),
  getMyTrips: () => mobileRequest<any>('/trips'),
  generateAiPlan: (body: any) => mobileRequest<any>('/ai/plan-trip', { method: 'POST', body: JSON.stringify(body) }),
  search: (q: string) => mobileRequest<any>(`/search?q=${encodeURIComponent(q)}`),
  getEvents: (query = '') => mobileRequest<any>(`/events${query}`),
  getCityFood: (cityId: string) => mobileRequest<any>(`/destinations/cities/${cityId}/food`),
  getCityEmergency: (cityId: string) => mobileRequest<any>(`/destinations/cities/${cityId}/emergency`)
};

