Flexo Spaces

A Smart Co-Working Space Discovery & Booking Platform

Flexo Spaces is a full-stack MERN application designed to help freelancers, startups, remote teams, and enterprises discover, compare, and book co-working spaces in real time. The platform provides smart filtering, live availability tracking, booking workflows, and workspace management tools for space owners and administrators.

Overview

Finding the right workspace is often difficult due to scattered information, unclear pricing, outdated availability, and lack of transparency regarding amenities and workspace capacity.

Flexo Spaces solves this problem by creating a centralized platform where users can:

Discover co-working spaces based on team size and requirements
Compare pricing, amenities, and workspace types
View real-time availability
Send booking requests and inquiries
Communicate with workspace owners
Manage bookings digitally

Target Audience: Freelancers, remote workers, startups, enterprises, co-working operators, and space managers.

Key Value Proposition: Simplify workspace discovery and improve occupancy rates through smart matching and real-time workspace management.

Features
Authentication & User Management
JWT-based authentication with secure cookie sessions
Google OAuth 2.0 login integration
Role-based access control:
User
Space Owner
Admin
Email verification with OTP
Password reset functionality
User profile management
Protected routes and middleware authorization
Workspace Listings Management

Space owners can create and manage detailed co-working space listings.

Workspace Information Includes:
Workspace name
Workspace type
Shared desk
Private cabin
Meeting room
Conference hall
Area size (sq ft)
Seating capacity
Pricing (hourly/daily/monthly)
Amenities
Workspace images
Description
Rules & policies
Availability status
Location with coordinates
Listing Features
Create workspace listings
Update listing information
Delete listings
Upload multiple images
Mark spaces as available/unavailable
Add pricing plans
Real-time availability updates
Smart Search & Matching

Advanced search system allowing users to discover spaces based on:

Number of persons
Workspace area
Budget range
Workspace type
Amenities
City/location
Availability
Work environment preferences
Search Features
Multi-filter search
Real-time filtering
Location-based discovery
Smart recommendation system
Search suggestions
Sorting:
Lowest price
Highest rating
Nearest location
Most popular
Amenities Management

Each workspace can include customizable amenities such as:

High-speed Wi-Fi
Meeting rooms
Parking
Power backup
Air conditioning
Cafeteria
Security
Printing facilities
Locker storage
Event spaces
Features
Amenity tagging
Amenity filtering
Amenity icons and descriptions
Shared vs private amenities
Booking & Inquiry System

Complete booking workflow for workspace reservations.

Booking Features
Real-time availability check
Booking requests
Booking approval/rejection
Booking cancellation
Booking history
Booking status tracking
Booking Status Flow
Pending
Approved
Rejected
Cancelled
Completed
Inquiry System

Users can:

Send inquiries to workspace owners
Ask questions before booking
Negotiate requirements
Discuss workspace expectations
Real-Time Availability Monitoring

One of the core features of Flexo Spaces.

Real-Time Features
Live workspace occupancy updates
Availability schedules
Booking conflict prevention
Instant booking status updates
Real-time dashboard refresh
Implementation
Socket.IO for live updates
Availability synchronization
Dynamic booking calendar
Real-Time Chat & Communication

Integrated communication system between users and space owners.

Features
Instant messaging using Socket.IO
Booking-related chat rooms
Inquiry conversations
Image sharing
Read receipts
Typing indicators
Real-time notifications
Notifications System

Users receive updates regarding bookings and inquiries.

Notification Types
Booking confirmations
Booking cancellations
Inquiry responses
Workspace approval updates
New messages
Availability alerts
Channels
In-app notifications
Email notifications
SMS integration (future-ready)
Dashboards
User Dashboard

Users can:

View booking history
Manage profile
Track inquiries
Save favorite workspaces
Manage notifications
Space Owner Dashboard

Space owners can:

Manage workspace listings
Monitor bookings
Update pricing
Manage availability schedules
Respond to inquiries
Track occupancy
Analytics Includes
Booking statistics
Revenue insights
Occupancy rates
Most viewed spaces
Conversion rates
Admin Dashboard

Admins can monitor the entire platform.

Admin Features
User management
Workspace moderation
Booking monitoring
Platform analytics
Reports & insights
Remove fraudulent listings
Manage disputes
Tech Stack
Frontend
React.js - Frontend library
Next.js - SSR & routing
Tailwind CSS - Utility-first styling
Framer Motion - Animations
React Query - Data fetching and caching
Socket.IO Client - Real-time communication
React Hook Form - Form handling
Zod - Validation
Lucide React - Icons
Backend
Node.js - JavaScript runtime
Express.js - Backend framework
MongoDB - NoSQL database
Mongoose - ODM
Socket.IO - Real-time communication
JWT - Authentication
Bcrypt.js - Password hashing
Passport.js - Google OAuth
Redis - Session caching & token blacklist
Nodemailer - Email services
Multer - File upload handling
Cloudinary/ImageKit - Media storage
DevOps & Deployment
Git & GitHub
Vercel (Frontend)
Render/Railway (Backend)
MongoDB Atlas
Redis Cloud
dotenv
Architecture

Flexo Spaces follows a Layered Architecture with feature-based frontend organization.

Backend Architecture
┌─────────────────────────────────────────┐
│            Client (Next.js)             │
└──────────────┬──────────────────────────┘
               │ HTTP / WebSocket
┌──────────────▼──────────────────────────┐
│            Express Routes               │
│ /api/auth /api/spaces /api/bookings     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│             Controllers                 │
│      Handle requests & responses        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│              Services                   │
│ Business logic & integrations           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Models (Mongoose)              │
│ User, Space, Booking, Inquiry           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│            MongoDB Database             │
└─────────────────────────────────────────┘
Frontend Architecture

Flexo Spaces uses:

Feature-based folder structure
Context API for global state
Service layer for API communication
Custom hooks for reusable logic
Reusable UI component system
Communication Flow
REST APIs for CRUD operations
WebSockets for real-time updates
JWT Authentication with cookies
Redis caching for sessions and performance
Folder Structure
Flexo-Spaces/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── space.controller.js
│   │   │   ├── booking.controller.js
│   │   │   ├── inquiry.controller.js
│   │   │   └── admin.controller.js
│   │   │
│   │   ├── middlewares/
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── space.model.js
│   │   │   ├── booking.model.js
│   │   │   ├── inquiry.model.js
│   │   │   └── notification.model.js
│   │   │
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── spaces/
│   │   │   ├── bookings/
│   │   │   ├── inquiries/
│   │   │   ├── notifications/
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   │
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   │
│   └── public/
│
└── README.md
Core Database Models
User Model
{
  name,
  email,
  password,
  role,
  avatar,
  createdAt
}
Space Model
{
  title,
  description,
  location,
  workspaceType,
  seatingCapacity,
  areaSize,
  pricing,
  amenities,
  images,
  availability,
  ownerId
}
Booking Model
{
  userId,
  spaceId,
  bookingDate,
  startTime,
  endTime,
  status,
  totalPrice
}
Inquiry Model
{
  userId,
  ownerId,
  spaceId,
  message,
  status
}
API Overview
Authentication Routes (/api/auth)
POST /register
POST /login
POST /google
POST /logout
POST /forgot-password
Space Routes (/api/spaces)
POST /
GET /
GET /:id
PATCH /:id
DELETE /:id
POST /search
Booking Routes (/api/bookings)
POST /
GET /my-bookings
PATCH /:id/approve
PATCH /:id/reject
PATCH /:id/cancel
Inquiry Routes (/api/inquiries)
POST /
GET /my-inquiries
POST /:id/respond
Admin Routes (/api/admin)
GET /analytics
GET /users
GET /spaces
GET /bookings
PATCH /users/:id/block
Key Features Deep Dive
Smart Matching System

The smart matching system recommends workspaces based on:

Team size
Workspace type
Budget
Preferred amenities
Location preferences
Availability
Matching Logic

The backend calculates compatibility scores using filters and weighted priorities.

Real-Time Monitoring

Real-time monitoring ensures workspace availability is always accurate.

Implementation Flow
User sends booking request
Booking updates database instantly
Socket.IO emits availability updates
Frontend refreshes occupancy status in real time
Booking Lifecycle
User discovers workspace
User sends booking request
Space owner reviews request
Booking approved/rejected
User receives notification
Workspace reserved successfully
Security Features
JWT authentication
Protected routes
Role-based authorization
Rate limiting
Password hashing
Secure cookies
Helmet.js security headers
Input validation & sanitization
Environment Variables
Backend (.env)
PORT=5000

MONGO_URI=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

EMAIL_USER=
EMAIL_PASS=

NODE_ENV=development
Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
Installation & Setup
Backend Setup
cd backend
npm install
npm run dev
Frontend Setup
cd frontend
npm install
npm run dev
Future Enhancements
High Priority
Payment gateway integration
Calendar booking system
Workspace reviews & ratings
Push notifications
Advanced analytics
Medium Priority
AI workspace recommendations
Dynamic pricing
Workspace heatmaps
Video meeting integration
Nice to Have
Mobile application
QR-based check-in system
Smart IoT occupancy sensors
AI chatbot support
Expected Impact

Flexo Spaces aims to:

Improve workspace discovery efficiency
Increase booking conversion rates
Improve occupancy management
Reduce manual communication
Provide better decision-making insights
Deployment Recommendations
Recommended Hosting
Frontend
Vercel
Backend
Railway
Render
Database
MongoDB Atlas
Redis
Redis Cloud
Screenshots

Add screenshots inside /screenshots

Landing Page

Hero section with workspace discovery CTA

Workspace Listing

Grid-based listings with filters

Workspace Details

Workspace images, pricing, amenities, and booking options

Dashboard

Analytics, bookings, and management tools

License

MIT License

Contact

Developer: Hussain Moiyedi
Project: Flexo Spaces
Tech Stack: MERN + Next.js Frontend
Email: vigreenhussainmoiyedi23@gmail.com

Built for smarter workspace discovery and real-time co-working management.