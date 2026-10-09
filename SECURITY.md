# ExploreBharat Security, RBAC & OWASP Compliance

## 1. Security Architecture Summary

ExploreBharat implements enterprise-grade security standards designed to protect traveler identities, payment data, and administrative operations:

| Category | Measure Implemented |
| :--- | :--- |
| **Password Security** | Bcrypt / Argon2 with salt rounds = 10. Passwords never stored or returned in plaintext. |
| **Authentication** | Ephemeral JSON Web Tokens (JWT) with HS256 / RS256 algorithms and strict expiration. |
| **Authorization** | Centralized Role-Based Access Control (RBAC) middleware inspecting token claims. |
| **SQL Injection** | Completely mitigated via Prisma ORM parameterized queries; raw SQL is prohibited. |
| **Cross-Site Scripting (XSS)** | React automatic JSX escaping, DOMPurify for user-generated content, strict CSP headers. |
| **CORS** | Strict whitelist origin policy matching registered web & mobile domains. |
| **Payment Security** | Server-side HMAC SHA256 signature verification. Client payment flags are rejected. |
| **Rate Limiting** | Express rate-limiting middleware on sensitive authentication and payment endpoints. |

---

## 2. Role-Based Access Control (RBAC) Matrix

| Resource / Endpoint | `USER` | `VENDOR` | `ATTRACTION_MANAGER` | `ADMIN` / `SUPER_ADMIN` |
| :--- | :---: | :---: | :---: | :---: |
| Browse Catalog & Search | ✅ | ✅ | ✅ | ✅ |
| Book Attraction / Hotel | ✅ | ✅ | ✅ | ✅ |
| Manage Own Trips & Reviews | ✅ | ✅ | ✅ | ✅ |
| Manage Own Hotel Rooms | ❌ | ✅ | ❌ | ✅ |
| Manage Attraction Slots & QR | ❌ | ❌ | ✅ | ✅ |
| Access `/api/admin/metrics` | ❌ | ❌ | ❌ | ✅ |
| Access `/api/admin/users` | ❌ | ❌ | ❌ | ✅ |

---

## 3. IDOR (Insecure Direct Object Reference) Safeguards

- When updating trips, tickets, or bookings, the backend strictly verifies that `resource.userId === authenticatedUser.id` before committing mutations, unless the user possesses the `ADMIN` role.
- All IDs utilize UUIDv4 rather than sequential auto-incrementing integers, preventing enumeration attacks.
