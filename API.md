# ExploreBharat REST API Documentation

Base URL: `http://localhost:4000/api`  
Health Endpoint: `http://localhost:4000/health`

All responses follow the unified standard envelope:
```json
{
  "success": true,
  "data": { ... }
}
```
Errors return:
```json
{
  "success": false,
  "error": "Descriptive message"
}
```

---

## 1. Authentication (`/api/auth`)

### POST `/api/auth/register`
Create a new user account.
```json
{
  "name": "Priya Patel",
  "email": "priya@example.com",
  "password": "Password@123",
  "phone": "+91 9876543210"
}
```

### POST `/api/auth/login`
Authenticate credentials and issue JWT access token.
```json
{
  "email": "user@explorebharat.local",
  "password": "User@1234"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c1...",
      "name": "Aarav Sharma",
      "email": "user@explorebharat.local",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. Attractions & Catalog (`/api/attractions`)

### GET `/api/attractions`
List attractions with pagination and filters.
- `stateId`: Filter by state UUID
- `cityId`: Filter by city UUID
- `categoryId`: Filter by category UUID
- `page`: Page index (default 1)
- `limit`: Items per page (default 20)

### GET `/api/attractions/:id`
Fetch complete attraction detail page payload including:
- Category & City
- Available Ticket Types
- Operating Schedules (all 7 days)
- Nearby Hotels (within 20km radius)
- Customer Reviews & Ratings breakdown

---

## 3. Search Engine (`/api/search`)

### GET `/api/search?q=Amber`
Global search across:
- Attractions (name, description, city)
- Destinations (city name, state name)
- Hotels (name, amenities)
- Tourism Circuits (circuit name, theme)

### GET `/api/search/autocomplete?q=Jai`
Fast prefix search providing quick-jump suggestions for destination headers.

---

## 4. Bookings & Tickets (`/api/tickets`, `/api/bookings`)

### POST `/api/tickets/book`
Reserve attraction tickets with slot verification and QR code generation.
**Headers:** `Authorization: Bearer <TOKEN>`
```json
{
  "attractionId": "ae68064d-b770-477f-9a8c-22c237e5f2e2",
  "date": "2026-10-15",
  "timeSlot": "09:00 - 11:00 AM",
  "tickets": [
    {
      "ticketTypeId": "8cf9b33a-4da2-46aa-bd61-e01bbd73c79c",
      "quantity": 2
    }
  ],
  "contactName": "Aarav Sharma",
  "contactEmail": "user@explorebharat.local",
  "contactPhone": "+91 9876543210"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "b78...",
      "bookingReference": "BY-TK-2026-15024",
      "status": "CONFIRMED",
      "totalAmount": 1000,
      "netAmount": 1000,
      "qrCodeData": "{\"ref\":\"BY-TK-2026-15024\",\"attraction\":\"Amber Palace & Fort\"...}"
    }
  }
}
```

### POST `/api/bookings/hotel`
Reserve hotel rooms for check-in / check-out dates.
**Headers:** `Authorization: Bearer <TOKEN>`
```json
{
  "hotelId": "h12...",
  "roomId": "r45...",
  "checkInDate": "2026-10-15",
  "checkOutDate": "2026-10-18",
  "roomCount": 1,
  "guestCount": 2,
  "guestName": "Aarav Sharma",
  "guestEmail": "user@explorebharat.local",
  "guestPhone": "+91 9876543210"
}
```

### POST `/api/bookings/:id/cancel`
Cancel an active booking. Releases inventory and initiates refund.

---

## 5. Trips & Itineraries (`/api/trips`)

### POST `/api/trips`
Create a multi-day trip container.
```json
{
  "name": "Golden Triangle Expedition",
  "startDate": "2026-11-01",
  "endDate": "2026-11-05",
  "totalBudget": 35000,
  "travelerCount": 2,
  "travelCompanions": "FAMILY",
  "interests": ["HERITAGE", "FOOD", "FORTS"]
}
```

### POST `/api/trips/:tripId/items`
Schedule an attraction or activity onto a specific trip day.
```json
{
  "tripDayId": "td1...",
  "attractionId": "ae68064d-b770-477f-9a8c-22c237e5f2e2",
  "timeSlot": "MORNING",
  "orderIndex": 1,
  "estimatedCost": 500,
  "durationMinutes": 150,
  "notes": "Hire an authorized ASI guide at the sun gate."
}
```

---

## 6. AI Trip Planner (`/api/ai/plan-trip`)

### POST `/api/ai/plan-trip`
Natural-language itinerary synthesizer combining real database catalog items with deterministic budget calculations.
```json
{
  "prompt": "I have 4 days, ₹25,000 budget, starting from Delhi, traveling with family, interested in heritage forts and royal palaces."
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Royal Heritage & Forts Expedition",
    "suggestedDestination": "Jaipur & Agra",
    "durationDays": 4,
    "budget": {
      "totalEstimated": 24800,
      "transport": 4500,
      "hotel": 12000,
      "tickets": 2800,
      "food": 4000,
      "miscellaneous": 1500
    },
    "dailyPlan": [
      {
        "day": 1,
        "theme": "Arrival & City Architecture",
        "morning": "Check in and visit City Palace",
        "afternoon": "Explore Jantar Mantar observatory",
        "evening": "Bazaar street food walking tour"
      }
    ],
    "optimizationTips": [
      "Book composite entry passes online to bypass ticket counters.",
      "Early mornings (08:30 AM) offer cooler temperatures and softer lighting for photography."
    ]
  }
}
```

---

## 7. Payments (`/api/payments`)

### POST `/api/payments/create-order`
Create payment gateway order.
```json
{
  "bookingId": "b78...",
  "amount": 1000
}
```

### POST `/api/payments/verify`
Server-side cryptographic payment verification.
```json
{
  "orderId": "order_by_12345",
  "paymentId": "pay_by_67890",
  "signature": "simulated_hmac_signature"
}
```

---

## 8. Admin Oversight (`/api/admin`)
Requires `role: "ADMIN"` or `"SUPER_ADMIN"`.

### GET `/api/admin/metrics`
Platform KPIs: total users, bookings, GMV revenue, catalog count, and recent transactions.

### GET `/api/admin/users`
List user accounts, roles, and status.
