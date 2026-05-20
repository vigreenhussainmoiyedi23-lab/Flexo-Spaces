🚀 Flexo Spaces

> Smart Co-Working Space Discovery & Booking Platform

A real-time full-stack MERN + Next.js application that enables freelancers, startups, and enterprises to discover, compare, and book co-working spaces with live availability, smart filtering, and seamless communication.

---

## 🌍 Overview

Flexo Spaces solves the problem of fragmented and outdated workspace discovery systems by providing a centralized, intelligent booking platform.

It allows users to:
- Discover co-working spaces based on requirements
- Compare pricing, amenities, and locations
- View real-time availability
- Book spaces instantly
- Communicate with space owners
- Manage bookings digitally

---

## 🎯 Problem

Finding the right workspace is difficult due to:
- Scattered listings across platforms
- Outdated availability information
- Lack of transparency in pricing
- No real-time communication
- Inefficient booking workflows

---

## 💡 Solution

Flexo Spaces centralizes the entire workflow:
- Unified workspace discovery system
- Real-time availability tracking
- Smart filtering & recommendations
- Direct communication between users and owners
- End-to-end booking lifecycle management

---

## 👥 Target Users

- Freelancers
- Remote workers
- Startups
- Enterprises
- Co-working operators
- Space managers

---

## ✨ Features

### 🔐 Authentication
- JWT authentication with secure cookies
- Google OAuth 2.0 login
- OTP email verification
- Password reset system
- Role-based access control (User / Owner / Admin)

---

### 🏢 Workspace Management
- Create and manage workspace listings
- Upload multiple images
- Define pricing (hourly/daily/monthly)
- Set seating capacity & area size
- Manage availability status
- Add rules and policies

---

### 🔎 Smart Search System
- Multi-filter search
- Location-based discovery
- Budget filtering
- Workspace type filtering
- Amenity-based search
- Sorting (price, rating, popularity, distance)

---

### 🧩 Amenities System
- Wi-Fi, AC, Parking, Cafeteria
- Meeting rooms & conference halls
- Security & power backup
- Printing facilities
- Custom amenity tagging
- Filter-based selection

---

### 📅 Booking System
- Real-time availability checks
- Booking request workflow
- Approval / rejection system
- Booking cancellation
- Booking history tracking

**Booking Status Flow**
- Pending
- Approved
- Rejected
- Cancelled
- Completed

---

### 💬 Real-Time Communication
- Socket.IO based chat system
- Booking-related conversations
- Inquiry messaging system
- Typing indicators
- Image sharing
- Read receipts

---

### 🔔 Notifications
- Booking confirmations
- Status updates
- Inquiry responses
- New message alerts
- Real-time in-app notifications

---

### 📊 Dashboards

#### User Dashboard
- Booking history
- Saved spaces
- Profile management
- Notifications

#### Space Owner Dashboard
- Listing management
- Booking approvals
- Revenue tracking
- Occupancy analytics

#### Admin Dashboard
- User management
- Workspace moderation
- Platform analytics
- Fraud detection

---

## 🧠 Smart Matching System

Workspace recommendations are generated using weighted scoring based on:
- Team size
- Budget range
- Location preference
- Amenities
- Availability

---

## ⚡ Real-Time System

Built using Socket.IO:

- Live availability updates
- Instant booking status sync
- Real-time occupancy tracking
- Conflict prevention system

---

## 🏗️ Architecture

### Backend Flow
Client → Routes → Controllers → Services → Models → MongoDB

---

### Frontend Architecture
- Feature-based folder structure
- Custom hooks for logic reuse
- React Query for data fetching
- Context API for global state
- Service layer for API calls

---

## 🧱 Tech Stack

### Frontend
- Next.js
- React.js
- Tailwind CSS
- Framer Motion
- React Query
- Socket.IO Client
- React Hook Form
- Zod

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- Bcrypt.js
- Passport.js (Google OAuth)
- Redis (Caching)
- Nodemailer
- Multer

### DevOps
- Vercel (Frontend)
- Render / Railway (Backend)
- MongoDB Atlas
- Redis Cloud

---

## 📁 Project Structure


Flexo-Spaces/
│
├── backend/
│ └── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── sockets/
│ └── middlewares/
│
├── frontend/
│ └── src/
│ ├── app/
│ ├── features/
│ ├── components/
│ ├── hooks/
│ ├── services/
│ └── context/


---

## 🔌 API Routes

### Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/logout


### Spaces

GET /api/spaces
POST /api/spaces
PATCH /api/spaces/:id
DELETE /api/spaces/:id


### Bookings

POST /api/bookings
PATCH /api/bookings/:id/approve
PATCH /api/bookings/:id/reject


### Inquiries

POST /api/inquiries
GET /api/inquiries/my


### Admin

GET /api/admin/analytics
GET /api/admin/users
GET /api/admin/spaces


---

## 🔒 Security

- JWT authentication (HTTP-only cookies)
- Role-based access control
- Password hashing with bcrypt
- Rate limiting
- Helmet security headers
- Input validation & sanitization

---

## 🚀 Future Enhancements

### High Priority
- Payment gateway integration
- Calendar booking system
- Workspace reviews & ratings
- Push notifications

### Medium Priority
- AI workspace recommendations
- Dynamic pricing engine
- Occupancy heatmaps

### Long Term
- Mobile application
- IoT occupancy sensors
- QR-based check-ins
- AI chatbot support

---

## 📈 Impact

- Improve workspace discovery efficiency
- Increase booking conversion rates
- Improve occupancy rates
- Reduce manual communication
- Enable data-driven decisions

---

## ⚙️ Setup

### Backend

cd backend
npm install
npm run dev


### Frontend

cd frontend
npm install
npm run dev


---

## 👨‍💻 Developer

**Hussain Moiyedi**

- GitHub: https://github.com/
- Email: vigreenhussainmoiyedi23@gmail.com

---

## 📜 License

MIT