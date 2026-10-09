const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('explorebharat_token') || localStorage.getItem('bharatyatra_token');
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('explorebharat_token', token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('explorebharat_token');
    localStorage.removeItem('explorebharat_user');
    localStorage.removeItem('bharatyatra_token');
    localStorage.removeItem('bharatyatra_user');
  }
}

export function getCurrentUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('explorebharat_user') || localStorage.getItem('bharatyatra_user');
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('explorebharat_user', JSON.stringify(user));
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.errors?.[0] || 'Request failed');
  }

  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body: any) =>
    request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<any>('/auth/me'),

  // Catalog
  getStates: () => request<any>('/destinations/states'),
  getState: (code: string) => request<any>(`/destinations/states/${code}`),
  getCities: (params = '') => request<any>(`/destinations/cities${params}`),
  getCity: (id: string) => request<any>(`/destinations/cities/${id}`),
  getCityWeather: (id: string) => request<any>(`/destinations/cities/${id}/weather`),
  getCategories: () => request<any>('/attractions/categories'),
  getAttractions: (params = '') => request<any>(`/attractions${params}`),
  getHiddenGems: (params = '') => request<any>(`/attractions/hidden-gems${params}`),
  getAttraction: (idOrSlug: string) => request<any>(`/attractions/${idOrSlug}`),
  getNearbyAttractions: (lat: number, lng: number, radius = 50) =>
    request<any>(`/attractions/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),

  // Hotels
  getHotels: (params = '') => request<any>(`/hotels${params}`),
  getHotel: (id: string) => request<any>(`/hotels/${id}`),
  getHotelsNearAttraction: (attractionId: string) =>
    request<any>(`/hotels/near-attraction/${attractionId}`),

  // Tickets & Bookings
  getTicketSlots: (attractionId: string, date: string) =>
    request<any>(`/tickets/slots?attractionId=${attractionId}&date=${date}`),
  bookTicket: (body: any) =>
    request<any>('/tickets/book', { method: 'POST', body: JSON.stringify(body) }),
  bookHotel: (body: any) =>
    request<any>('/bookings/hotel', { method: 'POST', body: JSON.stringify(body) }),
  getMyBookings: () => request<any>('/bookings'),
  getBooking: (id: string) => request<any>(`/bookings/${id}`),
  cancelBooking: (id: string, reason?: string) =>
    request<any>(`/bookings/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Circuits
  getCircuits: () => request<any>('/circuits'),
  getCircuit: (slug: string) => request<any>(`/circuits/${slug}`),

  // Trips & Budget
  getMyTrips: () => request<any>('/trips'),
  getTrip: (id: string) => request<any>(`/trips/${id}`),
  createTrip: (body: any) => request<any>('/trips', { method: 'POST', body: JSON.stringify(body) }),
  addTripItem: (tripId: string, body: any) =>
    request<any>(`/trips/${tripId}/items`, { method: 'POST', body: JSON.stringify(body) }),
  removeTripItem: (tripId: string, itemId: string) =>
    request<any>(`/trips/${tripId}/items/${itemId}`, { method: 'DELETE' }),

  // AI Planner
  generateAiPlan: (body: any) =>
    request<any>('/ai/plan-trip', { method: 'POST', body: JSON.stringify(body) }),
  getRecommendations: () => request<any>('/ai/recommendations'),

  // Search
  search: (q: string) => request<any>(`/search?q=${encodeURIComponent(q)}`),
  autocomplete: (q: string) => request<any>(`/search/autocomplete?q=${encodeURIComponent(q)}`),

  // Reviews
  getReviews: (type: string, id: string) => request<any>(`/reviews/${type}/${id}`),
  submitReview: (body: any) => request<any>('/reviews', { method: 'POST', body: JSON.stringify(body) }),

  // Events & Festivals
  getEvents: (params = '') => request<any>(`/events${params}`),
  getEvent: (id: string) => request<any>(`/events/${id}`),
  getCityFood: (cityId: string) => request<any>(`/destinations/cities/${cityId}/food`),
  getCityEvents: (cityId: string) => request<any>(`/destinations/cities/${cityId}/events`),
  getCityEmergency: (cityId: string) => request<any>(`/destinations/cities/${cityId}/emergency`),

  // Admin
  getAdminMetrics: () => request<any>('/admin/metrics'),
  getAdminUsers: () => request<any>('/admin/users'),
  getAdminBookings: () => request<any>('/admin/bookings'),
  createAdminAttraction: (body: any) =>
    request<any>('/admin/attractions', { method: 'POST', body: JSON.stringify(body) }),
  getAdminDataCenter: () => request<any>('/admin/data-center'),
  getAdminImageIntegrity: () => request<any>('/admin/image-integrity'),
  postAdminImageAction: (body: any) =>
    request<any>('/admin/image-action', { method: 'POST', body: JSON.stringify(body) }),
  postAdminHealthCheck: () =>
    request<any>('/admin/health-check', { method: 'POST' }),
  searchGooglePlaces: (q: string) =>
    request<any>(`/admin/google-places/search?q=${encodeURIComponent(q)}`),
  post: (endpoint: string, body: any) =>
    request<any>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  getAdminSuggestions: (status = '') =>
    request<any>(`/admin/suggestions${status ? `?status=${status}` : ''}`),
  approveAdminSuggestion: (id: string, notes?: string) =>
    request<any>(`/admin/suggestions/${id}/approve`, { method: 'POST', body: JSON.stringify({ notes }) }),
  rejectAdminSuggestion: (id: string, reason?: string) =>
    request<any>(`/admin/suggestions/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  checkPlaceDuplicates: (params: string) =>
    request<any>(`/admin/duplicates/places${params}`),
  getAdminAuditLogs: () =>
    request<any>('/admin/audit-logs'),

  // Smart Multimodal Journey Planner
  planJourney: (body: any) =>
    request<any>('/journeys/plan', { method: 'POST', body: JSON.stringify(body) }),
  getTrains: (from?: string, to?: string) =>
    request<any>(`/journeys/trains?from=${encodeURIComponent(from || '')}&to=${encodeURIComponent(to || '')}`),
  getFareEstimate: (params: string) =>
    request<any>(`/journeys/fare-estimate?${params}`),

  // Phase 2: Transport Platform Providers
  searchFlights: (params: string) =>
    request<any>(`/transport/flights?${params}`),
  searchTrainsPlatform: (params: string) =>
    request<any>(`/transport/trains?${params}`),
  checkTrainPnr: (pnr: string) =>
    request<any>(`/transport/pnr/${pnr}`),
  getTrainLiveStatus: (trainNumber: string) =>
    request<any>(`/transport/live-status/${trainNumber}`),
  searchBuses: (params: string) =>
    request<any>(`/transport/buses?${params}`),
  getTaxiQuotes: (params: string) =>
    request<any>(`/transport/cabs?${params}`),

  // Phase 2: Digital Travel Wallet
  getWalletPasses: () =>
    request<any>('/wallet'),
  getWalletPassByRef: (ref: string) =>
    request<any>(`/wallet/passes/${ref}`),

  // Phase 2: Travel Passport
  getTravelPassport: () =>
    request<any>('/passport'),

  // Phase 2: External Provider Health Monitor
  getProviderHealth: () =>
    request<any>('/admin/providers/health'),

  // Phase 2: Smart Natural Language Trip Query
  smartQuerySearch: (q: string) =>
    request<any>(`/search/smart-query?q=${encodeURIComponent(q)}`),

  // Phase 2: Trip Schedule & Budget Optimizers
  optimizeTripSchedule: (tripId: string) =>
    request<any>(`/trips/${tripId}/optimize-schedule`, { method: 'POST' }),
  optimizeTripBudget: (tripId: string) =>
    request<any>(`/trips/${tripId}/optimize-budget`, { method: 'POST' }),

  // Startup Analytics & Funnel
  trackAnalyticsEvent: (body: any) =>
    request<any>('/analytics/track', { method: 'POST', body: JSON.stringify(body) }),
  getAnalyticsDashboard: () =>
    request<any>('/analytics/dashboard'),
  getAnalyticsFunnel: () =>
    request<any>('/analytics/funnel'),
  getAnalyticsTrends: () =>
    request<any>('/analytics/top-trends'),

  // B2B Vendor Extranet
  getVendorProfile: () =>
    request<any>('/vendors/profile'),
  getVendorInventory: () =>
    request<any>('/vendors/inventory'),
  updateVendorHotel: (hotelId: string, body: any) =>
    request<any>(`/vendors/hotels/${hotelId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateVendorHotelTariff: (hotelId: string, body: any) =>
    request<any>(`/vendors/hotels/${hotelId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateVendorRoom: (hotelId: string, roomId: string, body: any) =>
    request<any>(`/vendors/hotels/${hotelId}/rooms/${roomId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getVendorBookings: () =>
    request<any>('/vendors/bookings'),
  getVendorFinancials: () =>
    request<any>('/vendors/financials')
};

