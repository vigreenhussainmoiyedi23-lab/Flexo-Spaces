# 📄 SwapStyle - Product Requirements Document (PRD)

## 🧵 Product Name: SwapStyle  
**Tagline:** A location-based clothing exchange marketplace powered by smart matching and AI valuation.

---

## 1. 📌 Product Overview

SwapStyle is a peer-to-peer clothing exchange platform that allows users to list unused or lightly used clothing items and swap them instead of buying new items.

It promotes:
- Sustainable fashion
- Clothing reuse
- Community-driven swapping

Unlike traditional marketplaces, SwapStyle focuses on:
- Swap-based transactions instead of buying/selling
- Location-based matching
- AI-assisted value estimation
- Real-time negotiation via chat

---

## 2. 🎯 Problem Statement

Fast fashion causes:
- Excess textile waste
- Overconsumption
- Low clothing reuse

Existing platforms:
- Focus on selling, not swapping
- Lack real-time negotiation
- Poor local discovery systems

---

## 3. 💡 Solution

SwapStyle solves this by enabling:
- Direct clothing swaps between users
- Smart listing discovery based on filters + location
- AI-based estimated value for fair swaps
- Real-time chat negotiation system
- Structured swap lifecycle management

---

## 4. 👥 Target Users

### Primary Users
- Students (15–30 years)
- Budget-conscious users
- Sustainable fashion advocates
- Thrift / resale community users

### Secondary Users
- Casual users wanting wardrobe refresh
- Users shifting toward sustainable consumption

---

## 5. ⚙️ Core Features

### 5.1 Authentication System
- Email/password login
- Google OAuth login
- JWT-based authentication
- Redis token blacklisting (secure logout)
- Rate limiting on auth endpoints

---

### 5.2 Listings System
Users can create clothing listings with:
- Title, description
- Brand, size, condition
- Category & clothing type
- Images (ImageKit upload)
- Location (city, state, country, lat/lng)

Features:
- Filter listings by category, size, brand, condition
- Pagination for scalability

---

### 5.3 Swap System (Core Feature)

Swap lifecycle:
pending → accepted → shipped / local_swap → in_transit → completed  
↘ rejected / cancelled

Features:
- Send swap requests
- Accept / reject swaps
- Local or shipping-based swaps
- Status tracking
- Rating after completion
- Basic dispute handling

---

### 5.4 Real-Time Chat System
- Socket.IO based messaging
- One-to-one chat per swap
- Real-time messaging
- Image sharing
- Emoji support
- Edit/delete messages
- Persistent chat history

---

### 5.5 AI Value Estimation System
- Powered by Google Gemini AI
- Inputs: brand, size, condition, clothing type
- Output: estimated value score
- Fallback system if AI fails

---

### 5.6 Location-Based Matching
- Country → State → City validation (CSC API)
- Geocoding via OpenCage API
- Nearby listing discovery
- "Use my location" feature

---

### 5.7 Admin / Moderation (Partial)
- Basic user moderation
- Listing control
- Swap oversight (limited)

---

## 6. 🏗️ System Architecture

MERN Stack + Service Layer + Socket Layer

Frontend (React)
→ API Layer (Express Controllers)
→ Service Layer (Business Logic)
→ Database (MongoDB)

Real-time:
Frontend (Socket.IO)
↔ Socket Server (Node.js + Socket.IO)

External Services:
- Google OAuth
- Gemini AI
- ImageKit
- Redis
- OpenCage API
- CSC API

---

## 7. 📂 Folder Structure

backend/
  src/
    controllers/
    models/
    routes/
    services/
    sockets/
    utils/
    config/

frontend/
  src/
    features/
    components/
    hooks/
    context/
    services/
    pages/

---

## 8. 🔐 Authentication Flow

1. User logs in/registers
2. JWT token generated
3. Stored in cookies
4. Redis stores blacklisted tokens on logout
5. Middleware validates token

---

## 9. 🔁 Swap Flow

1. User creates listing
2. Another user sends swap request
3. Owner accepts/rejects
4. Chat opens
5. Swap type selected (local/shipping)
6. Status updates through lifecycle
7. Completion + rating

---

## 10. 📡 API Overview

Auth APIs:
- Register
- Login
- Google OAuth
- Logout

Listing APIs:
- Create listing
- Get listings
- Update listing
- Delete listing

Swap APIs:
- Create swap
- Update swap status
- Get swaps

Chat APIs:
- Fetch chats
- Send messages
- Upload images

---

## 11. 🚀 Deployment

- Frontend: Vercel
- Backend: Railway / Render
- Database: MongoDB Atlas
- Images: ImageKit

---

## 12. ⚙️ Environment Variables

MONGO_URI
JWT_SECRET
REDIS_URL
GEMINI_API_KEY
OPENCAGE_API_KEY
CSC_API_KEY
IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY
CLIENT_URL

---

## 13. 📊 Non-Functional Requirements

- Real-time chat < 200ms latency
- Secure authentication
- Scalable listing queries
- AI fallback support
- API rate limiting

---

## 14. ⚠️ Edge Cases

- Duplicate swap requests
- Swap locking after initiation
- AI failure fallback
- Invalid location data
- Socket reconnect issues
- Deleted message handling

---

## 15. 🔮 Future Improvements

- AI recommendation engine
- Push notifications
- Advanced disputes system
- Courier integration
- Mobile app
- Trust score system

---

## 16. 📈 Success Metrics

- Swap completion rate
- Active users
- Listings per user
- Chat engagement
- Listing → swap conversion rate

---

## 17. 👨‍💻 Contributing

- Fork repo
- Create branch
- Commit changes
- Open PR

---

## 📌 Summary

SwapStyle is a full-stack real-time clothing swap marketplace combining:
- Marketplace logic
- Real-time chat
- AI valuation
- Location intelligence
- Scalable MERN architecture