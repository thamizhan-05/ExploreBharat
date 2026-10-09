process.env.NODE_ENV = 'test';
import app from './server';
import http from 'http';
import crypto from 'crypto';

async function runTests() {
  console.log('🧪 Starting ExploreBharat API Automated Test Suite...\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(4001, () => resolve()));
  const baseUrl = 'http://127.0.0.1:4001';

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      process.stdout.write(`  ⏳ ${name}... `);
      await fn();
      console.log('✅ PASS');
      passed++;
    } catch (err: any) {
      console.log(`❌ FAIL\n     Error: ${err.message}`);
      failed++;
    }
  }

  let userToken = '';
  let adminToken = '';
  let vendorToken = '';
  let vendorHotelId = '';
  let testAttractionId = '';
  let testTicketTypeId = '';
  let testHotelId = '';
  let testRoomId = '';
  let createdTripId = '';
  let createdTicketBookingId = '';
  let createdTicketBookingRef = '';
  let createdTicketAmount = 0;
  let createdHotelBookingId = '';
  let createdItemId = '';

  try {
    // 1. Health check
    await test('Health check endpoint', async () => {
      const res = await fetch(`${baseUrl}/health`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.status !== 'ONLINE') throw new Error('Status not ONLINE');
    });

    // 2. User Login
    await test('User login with demo account (user@explorebharat.local)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@explorebharat.local', password: 'User@1234' })
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.data.accessToken) throw new Error('Missing accessToken');
      userToken = data.data.accessToken;
    });

    // 3. Admin Login & Authorization
    await test('Admin login with demo account (admin@explorebharat.local)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@explorebharat.local', password: 'Admin@1234' })
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      adminToken = data.data.accessToken;
      if (data.data.user.role !== 'ADMIN') throw new Error('Role is not ADMIN');
    });

    // 4. Admin RBAC Protection
    await test('Admin route RBAC check: User cannot access /api/admin/metrics', async () => {
      const res = await fetch(`${baseUrl}/api/admin/metrics`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    });

    // 5. Admin can access /api/admin/metrics
    await test('Admin can access /api/admin/metrics', async () => {
      const res = await fetch(`${baseUrl}/api/admin/metrics`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.data.metrics || data.data.metrics.totalAttractions < 40) {
        throw new Error('Total attractions less than 40');
      }
    });

    // 6. Global Search
    await test('Global search across catalog for "Amber"', async () => {
      const res = await fetch(`${baseUrl}/api/search?q=Amber`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.data.attractions || data.data.attractions.length === 0) {
        throw new Error('Search returned 0 attractions for Amber');
      }
      testAttractionId = data.data.attractions[0].id;
      testTicketTypeId = data.data.attractions[0].ticketTypes[0].id;
    });

    // 7. Autocomplete Search
    await test('Search autocomplete suggestions for "Jai"', async () => {
      const res = await fetch(`${baseUrl}/api/search/autocomplete?q=Jai`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('Autocomplete suggestions empty');
      }
    });

    // 8. Attraction Details & Proximity
    await test('Fetch Attraction detail page for Amber Fort', async () => {
      const res = await fetch(`${baseUrl}/api/attractions/${testAttractionId}`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.data.nearbyHotels || !data.data.howToReach) {
        throw new Error('Missing nearby hotels or reach information');
      }
    });

    // 9. Hotel Discovery & Rooms
    await test('Discover hotels in Jaipur with room inventory', async () => {
      const res = await fetch(`${baseUrl}/api/hotels?search=Jaipur`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.data.length === 0) throw new Error('No hotels found in Jaipur');
      testHotelId = data.data[0].id;
      testRoomId = data.data[0].rooms[0].id;
    });

    // 10. Ticket Booking Flow
    await test('Book Attraction Ticket with QR code generation', async () => {
      const res = await fetch(`${baseUrl}/api/tickets/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          attractionId: testAttractionId,
          ticketTypeId: testTicketTypeId,
          visitDate: '2026-10-20',
          timeSlot: '09:00 - 12:00',
          quantity: 2
        })
      });
      if (res.status !== 201) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }
      const data = await res.json();
      if (!data.data.qrCodeData || !data.data.bookingReference) {
        throw new Error('Missing booking reference or QR code');
      }
      createdTicketBookingId = data.data.bookingId;
      createdTicketBookingRef = data.data.bookingReference;
      createdTicketAmount = data.data.totalAmountInr;
    });

    // 11. Hotel Booking Flow
    await test('Book Hotel Room with real booking reference and QR', async () => {
      const res = await fetch(`${baseUrl}/api/bookings/hotel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          hotelId: testHotelId,
          roomId: testRoomId,
          checkInDate: '2026-10-22',
          checkOutDate: '2026-10-25',
          guestCount: 2,
          specialRequests: 'High floor quiet room'
        })
      });
      if (res.status !== 201) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.data.bookingReference) throw new Error('Missing hotel booking reference');
      createdHotelBookingId = data.data.id;
    });

    // 12. Create Multi-Day Trip with Budget Computation
    await test('Create Trip "Royal Rajasthan 4 Days" with budget calculation', async () => {
      const res = await fetch(`${baseUrl}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          title: 'Royal Rajasthan 4 Days',
          destination: 'Jaipur',
          startDate: '2026-11-01',
          endDate: '2026-11-04',
          companions: 'FAMILY',
          allocatedBudgetInr: 30000
        })
      });
      if (res.status !== 201) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.data.budgetBreakdown || !data.data.days) throw new Error('Missing budget breakdown or days');
      createdTripId = data.data.id;
    });

    // 13. Add Itinerary Item to Trip
    await test('Add attraction item to Day 1 of Trip', async () => {
      // First get trip to know day 1 id
      const tripRes = await fetch(`${baseUrl}/api/trips/${createdTripId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      const tripData = await tripRes.json();
      const day1Id = tripData.data.days[0].id;

      const res = await fetch(`${baseUrl}/api/trips/${createdTripId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          tripDayId: day1Id,
          timeSlot: 'MORNING',
          title: 'Morning Fort Exploration',
          type: 'ATTRACTION',
          placeName: 'Amber Fort',
          durationMinutes: 180,
          estimatedCostInr: 200
        })
      });
      if (res.status !== 201) throw new Error(`Status ${res.status}`);
      const itemData = await res.json();
      createdItemId = itemData.data.id;
    });

    // 14. AI Trip Planner Engine
    await test('AI Trip Planner with natural language prompt', async () => {
      const res = await fetch(`${baseUrl}/api/ai/plan-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'I have 4 days, 25000 budget, starting from Mumbai, traveling with family, interested in forts and nature in Jaipur',
          daysCount: 4,
          budgetInr: 25000
        })
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.data.days || data.data.days.length !== 4) throw new Error('AI did not return 4 days');
      if (!data.data.budgetBreakdown.totalInr) throw new Error('Missing deterministic budget calculation');
    });

    // 15. Payment Order Creation & Verification
    await test('Harden Payments: Mismatched amount rejection', async () => {
      const orderRes = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          amountInr: createdTicketAmount + 9999, // Mismatched amount
          bookingRef: createdTicketBookingRef
        })
      });
      if (orderRes.status !== 400) throw new Error(`Expected 400 for amount mismatch, got ${orderRes.status}`);
    });

    await test('Create and verify payment order with cryptographic signature', async () => {
      const orderRes = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          amountInr: createdTicketAmount,
          bookingRef: createdTicketBookingRef
        })
      });
      if (orderRes.status !== 200) {
        const text = await orderRes.text();
        throw new Error(`Order status ${orderRes.status}: ${text}`);
      }
      const orderData = await orderRes.json();

      // Test cryptographic HMAC signature verification
      const crypto = await import('crypto');
      const testSecret = 'rzp_test_ExploreBharatSecretKey456';
      const paymentId = 'pay_test_verif_123';
      const validSig = crypto
        .createHmac('sha256', testSecret)
        .update(`${orderData.data.orderId}|${paymentId}`)
        .digest('hex');

      // 1. Invalid/Forged signature rejection
      const invalidRes = await fetch(`${baseUrl}/api/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          orderId: orderData.data.orderId,
          paymentId: paymentId,
          signature: 'forged_invalid_signature_hex_code',
          bookingRef: createdTicketBookingRef
        })
      });
      if (invalidRes.status !== 400) throw new Error(`Expected 400 on forged signature, got ${invalidRes.status}`);

      // 2. Legitimate cryptographic signature verification
      const verifyRes = await fetch(`${baseUrl}/api/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          orderId: orderData.data.orderId,
          paymentId: paymentId,
          signature: validSig,
          bookingRef: createdTicketBookingRef
        })
      });
      if (verifyRes.status !== 200) throw new Error(`Verify status ${verifyRes.status}`);
    });

    // 15b. Security: Trip Item Removal Authorization
    await test('Security: Cross-trip item deletion protection', async () => {
      // Attempting to delete createdItemId with a fake/other tripId should fail with 404
      const res = await fetch(`${baseUrl}/api/trips/00000000-0000-0000-0000-000000000000/items/${createdItemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (res.status !== 404) throw new Error(`Expected 404 on mismatched trip, got ${res.status}`);
    });

    // 15c. Security: Disallow Self-Registration as ADMIN
    await test('Security: Public registration with ADMIN role is rejected', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'escalation_test@explorebharat.local',
          password: 'Password@123',
          name: 'Hacker User',
          role: 'ADMIN'
        })
      });
      if (res.status !== 400) throw new Error(`Expected 400 for forbidden ADMIN role in register, got ${res.status}`);
    });

    // 16. Cancellation and Refund Flow
    await test('Cancel booking and verify refund status', async () => {
      const res = await fetch(`${baseUrl}/api/bookings/${createdTicketBookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({ reason: 'Trip rescheduled' })
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.data.status !== 'CANCELLED' || data.data.paymentStatus !== 'REFUNDED') {
        throw new Error('Booking status is not CANCELLED and REFUNDED');
      }
    });

    // 17. Submit Verified Review
    await test('Submit user review for attraction', async () => {
      const res = await fetch(`${baseUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          targetType: 'ATTRACTION',
          targetId: testAttractionId,
          rating: 5,
          title: 'Unbelievable palace architecture and mirror work',
          comment: 'Visited early morning at 8:30 AM as recommended. The Sheesh Mahal was totally magical!'
        })
      });
      if (res.status !== 201) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.data.isVerifiedBooking) throw new Error('Expected isVerifiedBooking to be true');
    });

    // 18. Query Free Attractions
    await test('Query attractions with entryType=FREE filter', async () => {
      const res = await fetch(`${baseUrl}/api/attractions?entryType=FREE&limit=10`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data.data) || data.data.length === 0) throw new Error('Expected free attractions array');
      const allFree = data.data.every((a: any) => a.entryType === 'FREE' && a.ticketRequired === false);
      if (!allFree) throw new Error('Expected all returned items to have entryType FREE and ticketRequired false');
    });

    // 19. Search "free places in Mumbai"
    await test('Search query "free places in Mumbai" returns free attractions', async () => {
      const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent('free places in Mumbai')}`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const attractions = data.data.attractions;
      if (!Array.isArray(attractions) || attractions.length === 0) throw new Error('Expected free attractions in Mumbai');
      const foundGateway = attractions.some((a: any) => a.name.includes('Gateway of India') && a.entryType === 'FREE');
      if (!foundGateway) throw new Error('Expected Gateway of India with entryType FREE in Mumbai free places search');
    });

    // 20. Booking Attempt on Free Attraction
    await test('Booking tickets for a FREE attraction returns 400 rejection', async () => {
      // Find a free attraction id
      const freeRes = await fetch(`${baseUrl}/api/attractions?entryType=FREE&limit=1`);
      const freeData = await freeRes.json();
      const freeAttraction = freeData.data[0];

      const res = await fetch(`${baseUrl}/api/tickets/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          attractionId: freeAttraction.id,
          ticketTypeId: 'any-dummy-id',
          visitDate: '2026-10-15',
          timeSlot: '09:00 - 12:00',
          quantity: 2
        })
      });
      if (res.status !== 400) throw new Error(`Expected 400 Bad Request, got ${res.status}`);
      const data = await res.json();
      if (!data.message?.includes('free entry')) throw new Error('Expected error message mentioning free entry');
    });

    // 21. Admin Create Free Attraction
    await test('Admin creates a FREE attraction with dynamic entry fields', async () => {
      // Get city id for Mumbai
      const cityRes = await fetch(`${baseUrl}/api/destinations/cities?search=Mumbai`);
      const cityData = await cityRes.json();
      const mumbaiCity = cityData.data[0];

      // Get category id for heritage-forts
      const catRes = await fetch(`${baseUrl}/api/attractions/categories`);
      const catData = await catRes.json();
      const cat = catData.data[0];

      const res = await fetch(`${baseUrl}/api/admin/attractions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: 'Bandra Bandstand Public Promenade & Amphitheatre',
          cityId: mumbaiCity.id,
          categoryId: cat.id,
          description: 'A popular seaside promenade and open-air public amphitheater facing the Arabian Sea.',
          latitude: 19.0435,
          longitude: 72.8193,
          entryType: 'FREE',
          entryDescription: 'Public waterfront area open 24/7 with zero admission fees.',
          feeSource: 'Municipal Corporation of Greater Mumbai (MCGM)',
          verificationStatus: 'VERIFIED'
        })
      });
      if (res.status !== 201) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.data.entryType !== 'FREE' || data.data.ticketRequired !== false) {
        throw new Error('Created attraction does not have entryType FREE or ticketRequired false');
      }
    });

    // 22. AI Trip Planner with Budget Constraint
    await test('AI Trip Planner with "2 days in Mumbai under 2000" prioritizes free attractions', async () => {
      const res = await fetch(`${baseUrl}/api/ai/plan-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          prompt: 'I want a 2 days Mumbai trip under 2000 budget with family interested in free places and nature.'
        })
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const plan = data.data;
      if (plan.budgetBreakdown.ticketsInr !== 0) {
        throw new Error(`Expected tickets cost to be 0 for free attraction trip, got ${plan.budgetBreakdown.ticketsInr}`);
      }
      if (plan.budgetBreakdown.totalInr > 2000) {
        throw new Error(`Total estimated cost ${plan.budgetBreakdown.totalInr} exceeded budget limit 2000`);
      }
    });

    // 23. Query Cultural Events & Festivals
    await test('Query cultural events and festivals (/api/events)', async () => {
      const res = await fetch(`${baseUrl}/api/events`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('Expected non-empty array of events');
      }
    });

    // 24. Query Destination Food Discovery
    await test('Query city food & dining (/api/destinations/cities/:id/food)', async () => {
      // Find Jaipur city id
      const cityRes = await fetch(`${baseUrl}/api/destinations/cities?search=Jaipur`);
      const cityData = await cityRes.json();
      const jaipurId = cityData.data[0].id;

      const res = await fetch(`${baseUrl}/api/destinations/cities/${jaipurId}/food`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.data.restaurants || !Array.isArray(data.data.restaurants)) {
        throw new Error('Expected restaurants array in food response');
      }
    });

    // 25. Query Destination Emergency Contacts
    await test('Query destination safety & emergency helplines (/api/destinations/cities/:id/emergency)', async () => {
      const cityRes = await fetch(`${baseUrl}/api/destinations/cities?search=Mumbai`);
      const cityData = await cityRes.json();
      const mumbaiId = cityData.data[0].id;

      const res = await fetch(`${baseUrl}/api/destinations/cities/${mumbaiId}/emergency`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (data.data.nationalHelpline !== '112' || data.data.touristHelpline !== '1363') {
        throw new Error('Emergency helplines missing or incorrect');
      }
    });

    // 26. Query Attractions with Accessibility Filter
    await test('Query attractions with wheelchair accessible filter (/api/attractions?wheelchair=true)', async () => {
      const res = await fetch(`${baseUrl}/api/attractions?wheelchair=true`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data.data)) {
        throw new Error('Expected data to be an array of attractions');
      }
    });

    // 27. Multimodal Door-to-Door Journey Planning (Delhi to Jaipur)
    await test('Multimodal Door-to-Door Journey Planning (Delhi to Jaipur)', async () => {
      const res = await fetch(`${baseUrl}/api/journeys/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: 'Connaught Place, New Delhi',
          originLatitude: 28.6304,
          originLongitude: 77.2177,
          destination: 'Jaipur',
          startDate: '2026-11-15',
          endDate: '2026-11-18',
          travellersCount: 2,
          travellerType: 'COUPLE',
          budgetInr: 30000,
          transportPreference: 'BALANCED'
        })
      });

      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !json.data) throw new Error('Expected success true with data');

      const plan = json.data;
      if (!plan.summary || plan.summary.destination !== 'Jaipur') {
        throw new Error(`Expected destination Jaipur, got ${plan.summary?.destination}`);
      }

      // Verify Door-to-Door structure: at least 3 alternatives (Balanced, Fastest, Cheapest)
      if (!Array.isArray(plan.options) || plan.options.length < 3) {
        throw new Error(`Expected at least 3 transport alternatives, got ${plan.options?.length}`);
      }

      // Verify active day timeline has transit, check-in, and attractions
      if (!plan.activeItinerary?.days || plan.activeItinerary.days.length !== 4) {
        throw new Error(`Expected 4 day itinerary for 15-18 Nov, got ${plan.activeItinerary?.days?.length}`);
      }

      const day1 = plan.activeItinerary.days[0];
      const hasTransit = day1.timeline.some((t: any) => t.type === 'TRANSIT');
      const hasHotel = day1.timeline.some((t: any) => t.type === 'HOTEL_CHECKIN');
      const hasAttraction = day1.timeline.some((t: any) => t.type === 'ATTRACTION');

      if (!hasTransit || !hasHotel || !hasAttraction) {
        throw new Error('Day 1 missing complete door-to-door timeline components');
      }

      // Verify cost breakdown has intercity, local, hotel, and known/estimated separation
      if (!plan.costBreakdown || plan.costBreakdown.totalEstimatedInr <= 0) {
        throw new Error('Expected non-zero total estimated trip cost');
      }
      if (plan.costBreakdown.knownCostInr <= 0 || plan.costBreakdown.estimatedCostInr <= 0) {
        throw new Error('Expected both known and estimated cost portions');
      }
    });

    // 28. Transport Alternatives: Fastest vs Cheapest vs Balanced
    await test('Transport Alternatives Comparison (Fastest, Cheapest, Balanced)', async () => {
      const res = await fetch(`${baseUrl}/api/journeys/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: 'New Delhi',
          destination: 'Jaipur',
          startDate: '2026-11-20',
          travellersCount: 1
        })
      });

      const json = await res.json();
      const options = json.data.options;

      const fastest = options.find((o: any) => o.optionType === 'FASTEST');
      const cheapest = options.find((o: any) => o.optionType === 'CHEAPEST');
      const balanced = options.find((o: any) => o.optionType === 'BALANCED');

      if (!fastest || !cheapest || !balanced) {
        throw new Error('Missing one or more required alternatives: FASTEST, CHEAPEST, BALANCED');
      }

      if (fastest.totalDurationMinutes >= cheapest.totalDurationMinutes) {
        throw new Error('FASTEST route duration should be lower than CHEAPEST route');
      }
    });

    // 29. Authentic Train Schedules Registry Endpoint
    await test('Query authentic train schedules (/api/journeys/trains)', async () => {
      const res = await fetch(`${baseUrl}/api/journeys/trains?origin=Delhi&destination=Jaipur`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();

      if (!Array.isArray(json.data) || json.data.length === 0) {
        throw new Error('Expected non-empty list of authentic trains for Delhi to Jaipur');
      }

      const vandeBharat = json.data.find((t: any) => t.trainNumber === '20977');
      if (!vandeBharat || !vandeBharat.bookingUrl.includes('irctc')) {
        throw new Error('Vande Bharat train with official IRCTC booking URL not found');
      }
    });

    // 30. Regional Metered Fare Estimate Engine
    await test('Regional Metered Fare Estimate Engine (/api/journeys/fare-estimate)', async () => {
      const res = await fetch(`${baseUrl}/api/journeys/fare-estimate?originLat=28.6304&originLng=77.2177&destLat=28.6139&destLng=77.2090&mode=AUTO`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();

      const leg = json.data;
      if (leg.transportMode !== 'AUTO' || leg.fareType !== 'ESTIMATED') {
        throw new Error('Auto fare should be clearly labeled as ESTIMATED');
      }
      if (!leg.fare || leg.fare < 25) {
        throw new Error('Expected realistic non-zero metered fare');
      }
    });

    // 31. Multimodal Planner input validation rejects missing fields
    await test('Multimodal Planner input validation rejects missing fields', async () => {
      const res = await fetch(`${baseUrl}/api/journeys/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: 'Delhi'
          // Missing destination and startDate
        })
      });

      if (res.status !== 400) {
        throw new Error(`Expected 400 rejection for missing destination, got ${res.status}`);
      }
    });

    // 32. Dedicated Flight Corridors Search (/api/transport/flights)
    await test('Query domestic flight corridors (/api/transport/flights)', async () => {
      const res = await fetch(`${baseUrl}/api/transport/flights?origin=Delhi&destination=Jaipur&travellers=2`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data.results) || json.data.results.length === 0) {
        throw new Error('Expected authentic flight results');
      }
      const flight = json.data.results[0];
      if (!flight.airline || !flight.flightNumber || !flight.totalFare) {
        throw new Error('Flight missing essential attributes');
      }
      if (flight.fareType !== 'STARTING_FROM') {
        throw new Error('Flight fare should be labeled as STARTING_FROM');
      }
    });

    // 33. Dedicated Trains Search & Registry (/api/transport/trains)
    await test('Query authentic train schedules (/api/transport/trains)', async () => {
      const res = await fetch(`${baseUrl}/api/transport/trains?origin=Delhi&destination=Jaipur`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data.trains) || json.data.trains.length === 0) {
        throw new Error('Expected authentic train registry schedules');
      }
      const train = json.data.trains[0];
      if (!train.trainNumber || !train.trainName || !train.bookingUrl) {
        throw new Error('Train missing essential attributes');
      }
    });

    // 34. Train PNR Status Lookup (/api/transport/pnr/:pnr)
    await test('Validate Indian Railways 10-digit PNR lookup (/api/transport/pnr/:pnr)', async () => {
      const res = await fetch(`${baseUrl}/api/transport/pnr/2485910243`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || json.data.pnr !== '2485910243' || !json.data.passengers) {
        throw new Error('Expected verified PNR status structure');
      }
    });

    // 35. Live Train Running Status (/api/transport/live-status/:trainNumber)
    await test('Query live train running status (/api/transport/live-status/:trainNumber)', async () => {
      const res = await fetch(`${baseUrl}/api/transport/live-status/20977`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || json.data.trainNumber !== '20977' || !json.data.statusBadge) {
        throw new Error('Expected live train status');
      }
    });

    // 36. Interstate Buses Search (/api/transport/buses)
    await test('Query State RTC bus corridors (/api/transport/buses)', async () => {
      const res = await fetch(`${baseUrl}/api/transport/buses?origin=Delhi&destination=Jaipur`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data.results) || json.data.results.length === 0) {
        throw new Error('Expected RTC bus results');
      }
      const bus = json.data.results[0];
      if (!bus.operator || !bus.fareInr || !bus.boardingPoint) {
        throw new Error('Bus missing essential details');
      }
    });

    // 37. Airport Transfer & Local Cab Quote Calculator (/api/transport/cabs)
    await test('Calculate regional airport transfer & cab quote (/api/transport/cabs)', async () => {
      const res = await fetch(`${baseUrl}/api/transport/cabs?serviceType=AIRPORT_TRANSFER&distanceKm=20`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !json.data.cabQuote || !json.data.autoQuote) {
        throw new Error('Expected cab and auto quotes');
      }
      if (json.data.cabQuote.fareType !== 'ESTIMATED') {
        throw new Error('Cab fare must be labeled as ESTIMATED');
      }
    });

    // 38. Natural-Language Smart Query Search (/api/search/smart-query)
    await test('Natural-Language Smart Query Search intent parser (/api/search/smart-query)', async () => {
      const res = await fetch(`${baseUrl}/api/search/smart-query?q=Plan%20a%203%20day%20trip%20to%20Jaipur%20under%2015000`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || json.data.intent !== 'PLAN_TRIP') {
        throw new Error(`Expected PLAN_TRIP intent, got ${json.data?.intent}`);
      }
      if (json.data.parsed.destination !== 'Jaipur' || json.data.parsed.days !== 3 || json.data.parsed.budgetInr !== 15000) {
        throw new Error('Natural language parser failed to extract trip constraints');
      }
    });

    // 39. Digital Travel Wallet passes (/api/wallet)
    await test('Access Digital Travel Wallet passes (/api/wallet)', async () => {
      const res = await fetch(`${baseUrl}/api/wallet`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !json.data.summary) {
        throw new Error('Expected travel wallet data');
      }
    });

    // 40. ExploreBharat Travel Passport (/api/passport)
    await test('Access ExploreBharat Travel Passport achievements (/api/passport)', async () => {
      const res = await fetch(`${baseUrl}/api/passport`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !json.data.passportNumber || !Array.isArray(json.data.achievements)) {
        throw new Error('Expected travel passport achievements and stats');
      }
    });

    // 41. Admin External Provider Health Monitor (/api/admin/providers/health)
    await test('Admin External Provider Health Monitor (/api/admin/providers/health)', async () => {
      const res = await fetch(`${baseUrl}/api/admin/providers/health`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data.providers) || json.data.totalProviders < 5) {
        throw new Error('Expected multi-provider health monitoring metrics');
      }
    });

    // 42. Attraction How-To-Reach engine & nearby hotel distance metrics (/api/attractions/:id)
    await test('Attraction detail includes How-To-Reach engine & hotel distance (/api/attractions/:id)', async () => {
      const res = await fetch(`${baseUrl}/api/attractions/amber-fort-jaipur`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !json.data.howToReachEngine || !json.data.howToReachEngine.fromRailwayStation) {
        throw new Error('Attraction detail missing How-To-Reach engine');
      }
      const hotel = json.data.nearbyHotels?.[0];
      if (!hotel || hotel.distanceFromAttractionKm === undefined || hotel.estimatedCabFareInr === undefined) {
        throw new Error('Nearby hotel missing distance and estimated transit fare to attraction');
      }
    });

    // 43. Smart Itinerary Schedule Optimizer (/api/trips/:id/optimize-schedule)
    await test('Smart Itinerary Schedule Optimizer (/api/trips/:id/optimize-schedule)', async () => {
      const res = await fetch(`${baseUrl}/api/trips/${createdTripId}/optimize-schedule`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data.optimizedDays)) {
        throw new Error('Expected optimized itinerary schedule');
      }
    });

    // 44. Smart Budget Optimizer (/api/trips/:id/optimize-budget)
    await test('Smart Budget Optimizer actionable alternatives (/api/trips/:id/optimize-budget)', async () => {
      const res = await fetch(`${baseUrl}/api/trips/${createdTripId}/optimize-budget`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || json.data.allocatedBudgetInr === undefined) {
        throw new Error('Expected budget optimization analysis');
      }
    });

    // 45. Pilot Destination Search for Mahabaleshwar (/api/search?q=Mahabaleshwar)
    await test('Pilot Destination Search for Mahabaleshwar (/api/search?q=Mahabaleshwar)', async () => {
      const res = await fetch(`${baseUrl}/api/search?q=Mahabaleshwar`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error('Search failed');
      const hasDest = json.data.destinations.some((d: any) => d.name === 'Mahabaleshwar');
      const hasAttr = json.data.attractions.some((a: any) => a.slug.includes('mahabaleshwar'));
      if (!hasDest && !hasAttr) {
        throw new Error('Mahabaleshwar not returned in search results');
      }
    });

    // 46. Mahabaleshwar Verified Attraction Detail & Entry (/api/attractions/arthurs-seat-mahabaleshwar)
    await test('Mahabaleshwar Arthur Seat detail with verified photo & free entry (/api/attractions/arthurs-seat-mahabaleshwar)', async () => {
      const res = await fetch(`${baseUrl}/api/attractions/arthurs-seat-mahabaleshwar`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !json.data) throw new Error('Failed to load attraction');
      if (json.data.entryType !== 'FREE') throw new Error(`Expected FREE entryType, got ${json.data.entryType}`);
      if (!json.data.heroImageUrl || !json.data.heroImageUrl.includes('Arthur%27s_Seat')) {
        throw new Error('Expected authentic Arthur Seat photograph');
      }
      if (!json.data.howToReach || !json.data.howToReach.byAir) {
        throw new Error('Expected How to Reach transit connectivity details');
      }
    });

    // 47. Startup Analytics Event Ingestion (/api/analytics/track)
    await test('Startup Analytics Event Tracking (/api/analytics/track)', async () => {
      const res = await fetch(`${baseUrl}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Search',
          entityType: 'DESTINATION',
          properties: { query: 'Mahabaleshwar', origin: 'Mumbai', tripDurationDays: 2 }
        })
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !json.result.success) {
        throw new Error('Failed to ingest analytics event');
      }
    });

    // 48. Startup Analytics Dashboard & 8-Stage Funnel (/api/analytics/dashboard & /api/analytics/funnel)
    await test('Startup Analytics Dashboard & 8-Stage Funnel (/api/analytics/dashboard & /api/analytics/funnel)', async () => {
      const dashRes = await fetch(`${baseUrl}/api/analytics/dashboard`);
      if (dashRes.status !== 200) throw new Error(`Dashboard status ${dashRes.status}`);
      const dashJson = await dashRes.json();
      if (!dashJson.success || !dashJson.data.overview.dau || dashJson.data.financials.currency !== 'INR') {
        throw new Error('Invalid dashboard analytics structure');
      }

      const funRes = await fetch(`${baseUrl}/api/analytics/funnel`);
      if (funRes.status !== 200) throw new Error(`Funnel status ${funRes.status}`);
      const funJson = await funRes.json();
      if (!funJson.success || !Array.isArray(funJson.data.stages) || funJson.data.stages.length !== 8) {
        throw new Error('Expected 8 conversion funnel stages');
      }
    });

    // 49. Versioned API Gateway (/api/v1/destinations/cities)
    await test('Versioned API Gateway (/api/v1/destinations/cities)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/destinations/cities`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
        throw new Error('Expected valid response from /api/v1/destinations/cities');
      }
    });

    // 50. Versioned API Search (/api/v1/search?q=Mahabaleshwar)
    await test('Versioned API Search (/api/v1/search?q=Mahabaleshwar)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/search?q=Mahabaleshwar`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !json.data.attractions || json.data.attractions.length === 0) {
        throw new Error('Expected attractions from /api/v1/search');
      }
    });

    // 51. Admin Operations Audit Trail (/api/admin/audit-logs)
    await test('Admin Operations Audit Trail (/api/admin/audit-logs)', async () => {
      const res = await fetch(`${baseUrl}/api/admin/audit-logs`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
        throw new Error('Expected system audit log records');
      }
      const hasSystemSeed = json.data.some((l: any) => l.action === 'SYSTEM_SEED');
      if (!hasSystemSeed) {
        throw new Error('Expected SYSTEM_SEED action in audit logs');
      }
    });

    // 52. Vendor Login & Profile
    await test('Vendor Extranet Authentication (vendor@explorebharat.local)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'vendor@explorebharat.local', password: 'Vendor@1234' })
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.data.accessToken || json.data.user.role !== 'VENDOR') {
        throw new Error('Expected vendor role and access token');
      }
      vendorToken = json.data.accessToken;

      const profileRes = await fetch(`${baseUrl}/api/v1/vendors/profile`, {
        headers: { Authorization: `Bearer ${vendorToken}` }
      });
      if (profileRes.status !== 200) throw new Error(`Profile status ${profileRes.status}`);
      const profile = await profileRes.json();
      if (profile.data.status !== 'VERIFIED') throw new Error('Expected VERIFIED vendor status');
    });

    // 53. Vendor Inventory Management
    await test('Vendor Property Inventory (/api/v1/vendors/inventory)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/vendors/inventory`, {
        headers: { Authorization: `Bearer ${vendorToken}` }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!Array.isArray(json.data) || json.data.length === 0) {
        throw new Error('Expected vendor hotels in inventory');
      }
      vendorHotelId = json.data[0].id;
      if (!json.data[0].rooms || json.data[0].rooms.length === 0) {
        throw new Error('Expected hotel rooms under vendor property');
      }
    });

    // 54. Vendor Tariff & Availability Update
    await test('Vendor Real-Time Tariff & Availability Update (PATCH /api/v1/vendors/hotels/:id)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/vendors/hotels/${vendorHotelId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${vendorToken}`
        },
        body: JSON.stringify({
          startingPriceInr: 6999,
          availabilityStatus: 'LIMITED'
        })
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (json.data.startingPriceInr !== 6999 || json.data.availabilityStatus !== 'LIMITED') {
        throw new Error('Tariff update did not persist correctly');
      }
    });

    // 55. Vendor Bookings Ledger & Check-Ins
    await test('Vendor Reservations Ledger (/api/v1/vendors/bookings)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/vendors/bookings`, {
        headers: { Authorization: `Bearer ${vendorToken}` }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!Array.isArray(json.data) || json.data.length === 0) {
        throw new Error('Expected vendor guest reservations');
      }
      if (!json.data[0].bookingReference.includes('HTL')) {
        throw new Error(`Unexpected booking ref: ${json.data[0].bookingReference}`);
      }
    });

    // 56. Vendor Financials & 8% Commission Formula
    await test('Vendor Payout Ledger & 8% Platform Commission (/api/v1/vendors/financials)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/vendors/financials`, {
        headers: { Authorization: `Bearer ${vendorToken}` }
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      const summary = json.data.summary;
      if (!summary || summary.grossBookingValueInr <= 0) {
        throw new Error('Expected valid gross booking value');
      }
      if (summary.platformCommissionRate !== '8%' || summary.vendorPayoutRate !== '92%') {
        throw new Error('Platform commission rate mismatch');
      }
      const expectedCommission = Math.round(summary.grossBookingValueInr * 0.08);
      if (summary.platformFeeTotalInr !== expectedCommission) {
        throw new Error(`Commission mismatch: expected ${expectedCommission}, got ${summary.platformFeeTotalInr}`);
      }
      if (summary.netVendorPayoutInr !== summary.grossBookingValueInr - expectedCommission) {
        throw new Error('Net payout formula mismatch');
      }
    });

    // 57. Production Payment Webhook & Idempotency Engine
    await test('Payment Webhook HMAC Verification & Idempotency Engine (/api/v1/payments/webhook)', async () => {
      const webhookSecret = 'rzp_webhook_secret_explorebharat_2026';
      const eventId = `evt_test_${Date.now()}`;
      const payload = {
        id: eventId,
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: `pay_hook_${Date.now()}`,
              order_id: `order_hook_${Date.now()}`,
              amount: 500000,
              notes: {
                bookingRef: 'EB-HTL-VNDR-2026-001'
              }
            }
          }
        }
      };

      const rawBody = JSON.stringify(payload);
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      // First webhook call -> should process successfully
      const res1 = await fetch(`${baseUrl}/api/v1/payments/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': signature
        },
        body: rawBody
      });
      if (res1.status !== 200) throw new Error(`Status ${res1.status}`);
      const json1 = await res1.json();
      if (!json1.success || json1.duplicate === true) {
        throw new Error('Expected initial webhook to be processed (not duplicate)');
      }

      // Second identical webhook call -> must be detected as idempotent duplicate
      const res2 = await fetch(`${baseUrl}/api/v1/payments/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': signature
        },
        body: rawBody
      });
      if (res2.status !== 200) throw new Error(`Status ${res2.status}`);
      const json2 = await res2.json();
      if (!json2.success || json2.duplicate !== true) {
        throw new Error('Expected idempotency engine to detect duplicate event');
      }
    });

    // 58. Regional Catalog Expansion (Goa & Udaipur)
    await test('Regional Catalog Expansion: Goa & Udaipur Authenticity Query', async () => {
      const goaRes = await fetch(`${baseUrl}/api/v1/search?q=Goa`);
      if (goaRes.status !== 200) throw new Error(`Goa search status ${goaRes.status}`);
      const goaData = await goaRes.json();
      const dudhsagar = goaData.data.attractions?.find((a: any) => a.name.includes('Dudhsagar'));
      if (!dudhsagar) throw new Error('Expected Dudhsagar Falls in Goa search');

      const udaipurRes = await fetch(`${baseUrl}/api/v1/search?q=Udaipur`);
      if (udaipurRes.status !== 200) throw new Error(`Udaipur search status ${udaipurRes.status}`);
      const udaipurData = await udaipurRes.json();
      const cityPalace = udaipurData.data.attractions?.find((a: any) => a.name.includes('City Palace'));
      if (!cityPalace) throw new Error('Expected City Palace Udaipur in search');
    });

    // 59. Open-Meteo Live Weather Integration (100% Free, Zero Key)
    await test('Open-Meteo Live Weather: Fetch real-time weather & 3-day forecast', async () => {
      const citiesRes = await fetch(`${baseUrl}/api/v1/destinations/cities`);
      if (citiesRes.status !== 200) throw new Error(`Cities status ${citiesRes.status}`);
      const citiesData = await citiesRes.json();
      const jaipur = citiesData.data.find((c: any) => c.name === 'Jaipur') || citiesData.data[0];
      if (!jaipur) throw new Error('No city found for weather test');

      const weatherRes = await fetch(`${baseUrl}/api/v1/destinations/cities/${jaipur.id}/weather`);
      if (weatherRes.status !== 200) throw new Error(`Weather status ${weatherRes.status}`);
      const weatherData = await weatherRes.json();
      if (!weatherData.success || !weatherData.data) throw new Error('Invalid weather response');
      if (typeof weatherData.data.temperature !== 'number') throw new Error('Missing temperature number');
      if (!weatherData.data.condition) throw new Error('Missing weather condition string');
      if (!Array.isArray(weatherData.data.forecast)) throw new Error('Missing forecast array');
    });

    // 60. Wikimedia Commons Free Open-Source Photo Provider
    await test('Wikimedia Commons API: Search authentic CC-licensed monument photography', async () => {
      const wikiRes = await fetch(`${baseUrl}/api/v1/search/wikimedia-photos?query=Hawa+Mahal`);
      if (wikiRes.status !== 200) throw new Error(`Wikimedia search status ${wikiRes.status}`);
      const wikiData = await wikiRes.json();
      if (!wikiData.success || !Array.isArray(wikiData.data)) {
        throw new Error('Invalid Wikimedia photo search response format');
      }
      if (wikiData.data.length > 0) {
        const firstPhoto = wikiData.data[0];
        if (!firstPhoto.url || !firstPhoto.attribution) {
          throw new Error('Missing URL or attribution in Wikimedia photo object');
        }
      }
    });

    // 61. Open Indian Railways Timetables & Smart Multimodal Route Engine
    await test('Indian Railways GTFS/Timetables: Multimodal journey routing from Delhi to Jaipur', async () => {
      const journeyRes = await fetch(`${baseUrl}/api/v1/journeys/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: 'Connaught Place, New Delhi',
          originLatitude: 28.6315,
          originLongitude: 77.2167,
          destination: 'Jaipur',
          startDate: '2026-11-15',
          endDate: '2026-11-17',
          travelDate: '2026-11-15',
          returnDate: '2026-11-17',
          travellers: 2,
          budget: 25000,
          travelPreference: 'balanced'
        })
      });
      if (journeyRes.status !== 200) throw new Error(`Journey plan status ${journeyRes.status}`);
      const journeyData = await journeyRes.json();
      if (!journeyData.success || !journeyData.data?.options) {
        throw new Error('Invalid journey plan response structure');
      }
      const options = journeyData.data.options;
      if (options.length === 0) throw new Error('Expected at least one route option');
      const balanced = options.find((o: any) => o.optionType === 'BALANCED' || o.optionKey === 'BALANCED') || options[0];
      const fare = balanced.totalCostInr ?? balanced.totalFare;
      if (typeof fare !== 'number' || fare <= 0) throw new Error(`Invalid fare in route option: ${fare}`);
    });

    // 62. Dedicated Hidden Gems Discovery Endpoint
    await test('Query hidden gems discovery endpoint (/api/v1/attractions/hidden-gems)', async () => {
      const hgRes = await fetch(`${baseUrl}/api/v1/attractions/hidden-gems?limit=5`);
      if (hgRes.status !== 200) throw new Error(`Status ${hgRes.status}`);
      const hgData = await hgRes.json();
      if (!hgData.success || !Array.isArray(hgData.data)) {
        throw new Error('Invalid hidden-gems response format');
      }
      if (hgData.data.length === 0) {
        throw new Error('Expected at least one hidden gem attraction');
      }
      const first = hgData.data[0];
      if (!first.name || !first.heroImageUrl) {
        throw new Error('Missing name or image in hidden gem record');
      }
    });

    // 63. Filter Attractions by discoveryType and verificationStatus
    await test('Filter attractions by discoveryType and verificationStatus (/api/v1/attractions?discoveryType=HIDDEN_GEM)', async () => {
      const filterRes = await fetch(`${baseUrl}/api/v1/attractions?discoveryType=HIDDEN_GEM`);
      if (filterRes.status !== 200) throw new Error(`Status ${filterRes.status}`);
      const filterData = await filterRes.json();
      if (!filterData.success || !Array.isArray(filterData.data)) {
        throw new Error('Invalid filtered attractions response');
      }
      const verifiedRes = await fetch(`${baseUrl}/api/v1/attractions?verificationStatus=VERIFIED_ASI`);
      if (verifiedRes.status !== 200) throw new Error(`Status ${verifiedRes.status}`);
      const verifiedData = await verifiedRes.json();
      if (!verifiedData.success || verifiedData.data.length === 0) {
        throw new Error('Expected verified ASI attractions in response');
      }
    });

  } finally {
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
