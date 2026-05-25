# Flexo Spaces 🏢

**A SaaS-Level Co-Working Space Discovery & Booking Platform**

[![Status](https://img.shields.io/badge/Status-Active%20Development-blue?style=for-the-badge)]()
[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Next.js-green?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)]()

> *Find your space. Book it instantly. Work without friction.*

Flexo Spaces is a production-grade, full-stack booking platform that enables freelancers, startups, and enterprises to discover, compare, and book co-working spaces — with real-time availability, smart filtering, and a clean approval workflow.

Built on lessons from [SwapStyle](https://github.com/vigreenhussainmoiyedi23-lab/SwapStyle) — a deployed peer-to-peer marketplace — Flexo Spaces brings the same architectural discipline to workspace management.

---

## 📌 Problem Statement

The co-working space market is fragmented. Users bounce between Google Maps, WhatsApp groups, and outdated websites trying to answer three simple questions:

- Is there a space that fits my team size and budget?
- Is it actually available right now?
- How do I book it without 5 back-and-forth messages?

Flexo Spaces answers all three in one platform.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT authentication with secure `httpOnly` cookie sessions
- Google OAuth 2.0 one-click login
- OTP email verification for new registrations
- Redis-backed token blacklisting on logout
- Role-based access control: **User / Space Owner / Admin**

### 🏢 Workspace Listings
- Create and manage co-working space listings
- Multi-image upload with cloud CDN optimization
- Define pricing: hourly, daily, monthly
- Set capacity, area size, and workspace type (private cabin, shared desk, meeting room)
- Amenities tagging: Wi-Fi, parking, cafeteria, meeting rooms, power backup, security

### 🔎 Smart Search & Matching
- Multi-filter search: team size, budget, location, amenities, workspace type
- Location-based discovery with city/area filtering
- Weighted matching score based on user requirements
- Sorting by price, rating, popularity, and distance

### 📅 Booking Engine
- Real-time availability checks using overlap detection (not `isBooked` booleans)
- Booking request → approval/rejection workflow
- Booking status lifecycle: `Pending → Approved → Rejected → Cancelled → Completed`
- Cancellation support with history tracking
- Pricing snapshot at time of booking (prevents price disputes)

### 💬 Real-Time Communication
- Socket.IO-powered chat for booking-related conversations
- Inquiry system for pre-booking questions
- Typing indicators, read receipts, image sharing
- Real-time in-app notifications

### 📊 Dashboards
- **User** — Booking history, saved spaces, notifications
- **Space Owner** — Listing management, booking approvals, occupancy analytics
- **Admin** — User management, workspace moderation, platform analytics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Client (Next.js 14)             │
│   Feature-based modules, React Query    │
└──────────────┬──────────────────────────┘
               │ HTTP / WebSocket
┌──────────────▼──────────────────────────┐
│         Express.js Routes               │
│  /api/auth  /api/spaces  /api/bookings  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           Controllers                   │
│     Handle HTTP request/response        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│            Services                     │
│   Business logic, availability engine   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Mongoose Models                  │
│  User, Space, Booking, Amenity, Chat... │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│     MongoDB Atlas + Redis Cache         │
└─────────────────────────────────────────┘
```

### Key Design Decisions

**Why overlap detection instead of `isBooked`?**
A boolean flag can't handle partial availability — what if a space has 10 desks and 6 are booked? Availability is calculated dynamically by querying confirmed bookings within the requested time window and subtracting from total capacity.

**Why Redis?**
Token blacklisting on logout (same pattern as SwapStyle), and caching frequent search queries to reduce DB load on popular spaces.

**Why Next.js over plain React?**
SSR for workspace listing pages improves SEO — space owners need their listings to be discoverable on Google.

**Why pricing snapshots?**
Booking stores the price at time of request, not the current listing price. Prevents disputes if an owner changes pricing while a booking is pending.

---

## 🧱 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 | SSR, routing, SEO |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Page transitions and animations |
| React Query | Server state management |
| Socket.IO Client | Real-time communication |
| React Hook Form + Zod | Form handling and validation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Primary database and ODM |
| Socket.IO | Real-time bidirectional communication |
| JWT + Bcrypt.js | Authentication and password hashing |
| Passport.js | Google OAuth 2.0 strategy |
| Redis | Token blacklisting and query caching |
| Nodemailer | OTP and transactional emails |
| Multer | File upload handling |
| Helmet.js + Rate Limit | Security headers and API protection |

---

## 📁 Folder Structure

```
Flexo-Spaces/
├── backend/
│   └── src/
│       ├── config/           # DB, Redis configuration
│       ├── constants/        # Enums, booking statuses
│       ├── controllers/      # Route handlers
│       ├── middlewares/      # Auth guards, validation, rate limiting
│       ├── models/
│       │   ├── user/         # User, notification
│       │   ├── space/        # Space, amenity, availability
│       │   └── booking/      # Booking, inquiry
│       ├── routes/           # API route definitions
│       ├── services/
│       │   ├── auth/
│       │   ├── space/
│       │   ├── booking/      # Overlap detection, availability engine
│       │   └── user/
│       ├── sockets/          # Socket.IO event handlers
│       └── utils/            # Shared helpers
│
├── frontend/
│   └── src/
│       ├── app/              # Next.js app router
│       ├── features/         # Feature-based modules
│       │   ├── auth/
│       │   ├── spaces/       # Browse, Create, Detail
│       │   ├── bookings/     # Request, manage, history
│       │   ├── dashboard/    # User, Owner, Admin views
│       │   ├── chat/
│       │   └── notifications/
│       ├── components/       # Shared UI components
│       ├── hooks/            # Custom React hooks
│       └── services/         # API layer
│
└── README.md
```

---

## 🔌 API Reference

### Authentication — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register with email + OTP |
| POST | `/verify-otp` | Verify OTP |
| POST | `/login` | Email/password login |
| POST | `/google` | Google OAuth login |
| POST | `/logout` | Logout + Redis token blacklist |
| POST | `/forgot-password` | Trigger password reset |

### Spaces — `/api/spaces`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Paginated spaces with filters |
| POST | `/` | Create space listing |
| GET | `/:id` | Get single space |
| PATCH | `/:id` | Update listing |
| DELETE | `/:id` | Delete listing |
| GET | `/:id/availability` | Check real-time availability |

### Bookings — `/api/bookings`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create booking request |
| GET | `/my` | Get user's bookings |
| PATCH | `/:id/approve` | Owner approves booking |
| PATCH | `/:id/reject` | Owner rejects booking |
| PATCH | `/:id/cancel` | Cancel booking |

### Admin — `/api/admin`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics` | Platform-wide analytics |
| GET | `/users` | List all users |
| POST | `/users/:id/ban` | Ban or unban a user |
| POST | `/spaces/:id/remove` | Remove a listing |

---

## 🚀 Development Roadmap

### ✅ Phase 1 — MVP Foundation (Current)
- [x] Repo setup and architecture planning
- [ ] Role-based authentication (JWT + Google OAuth + OTP)
- [ ] Space CRUD with image uploads
- [ ] Booking request → approve/reject flow
- [ ] Basic availability display
- [ ] Owner and user dashboards

### 🔜 Phase 2 — Core Booking Engine
- [ ] Overlap detection logic
- [ ] Remaining seat tracking
- [ ] Capacity calculations
- [ ] Booking status lifecycle
- [ ] Availability service layer

### 🔮 Phase 3 — Real-Time UX
- [ ] Socket.IO live seat updates
- [ ] Booking notifications
- [ ] Owner alerts
- [ ] Availability badges

### 🔮 Phase 4 and Beyond
- Payment gateway integration
- Recurring bookings
- AI-based recommendations
- Redis query caching
- Analytics dashboard
- Mobile application

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Redis instance (local or [Upstash](https://upstash.com/))
- Google Cloud Console account

### 1. Clone the Repository
```bash
git clone https://github.com/vigreenhussainmoiyedi23-lab/Flexo-Spaces
cd Flexo-Spaces
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env   # Fill in your credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Security
- JWT authentication with `httpOnly` cookies
- Role-based access control on all protected routes
- Password hashing with bcrypt
- Rate limiting on auth and booking endpoints
- Helmet.js security headers
- Input validation and sanitization

---

## 👨‍💻 Developer

**Hussain Moiyedi**
- GitHub: [vigreenhussainmoiyedi23-lab](https://github.com/vigreenhussainmoiyedi23-lab)
- Email: vigreenhussainmoiyedi23@gmail.com
- Also built: [SwapStyle](https://github.com/vigreenhussainmoiyedi23-lab/SwapStyle) — a deployed peer-to-peer fashion marketplace

---

## 📄 License

This project is licensed under the MIT License.

---

*Built with focus. Shipped with purpose.*
