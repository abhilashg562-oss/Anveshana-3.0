Project Overview
Local-Link is a hyperlocal gig marketplace that connects users with nearby service providers within a 5km radius. The platform enables plumbers, electricians, technicians, and other skilled workers to receive bookings directly from customers with minimal commission (5-10%), ensuring fair income distribution and strengthening decentralized local economies.

Live Demo : http://localhost:8000


It eliminates middlemen, reduces platform exploitation, and empowers small-scale workers through technology — built as a Progressive Web App (PWA), requiring no app installation.

Features
•	Real-time location-based service discovery within 5km radius
•	Direct booking system with slot selection and provider confirmation
•	Low-commission model (5-10%) vs traditional platforms (20-30%)
•	Vernacular language support — Kannada toggle via i18next
•	Secure Phone OTP authentication with JWT
•	Demo payment integration via Razorpay sandbox
•	Leaflet.js map view showing providers in radius
•	Star rating and review system for providers
•	Responsive, mobile-first PWA design

Tech Stack
Layer	Technology
Frontend	React.js + Tailwind CSS (PWA)
Backend	Node.js + Express.js
Database	MongoDB + Mongoose (GeoJSON 2dsphere index)
Authentication	Firebase Phone OTP + JWT
Maps	Leaflet.js (Free, no billing)
Payments	Razorpay Sandbox (UPI simulation)
Deployment	Netlify (Frontend) + MongoDB Atlas (DB)

Application Working Flow
User Flow
1.	User logs in via Phone OTP
2.	Grants location access
3.	Searches services by category and auto-detected location
4.	System fetches providers within 5km radius using MongoDB $nearSphere
5.	User views provider profile with ratings and availability
6.	Selects booking slot
7.	Confirms booking
8.	Makes demo payment via Razorpay sandbox
9.	Leaves rating and review after completion

Provider Flow
10.	Registers with name, phone, skills, category, hourly rate, languages, and geo-location
11.	Profile stored with GeoJSON indexing for proximity search
12.	Appears in nearby searches when available
13.	Accepts or rejects incoming bookings
14.	Receives ratings and reviews after job completion

Key Feature Implementations
Location-Based Search (5km)
•	MongoDB $nearSphere query with GeoJSON 2dsphere index
•	Default radius: 5000 meters, configurable
•	Category filter supported alongside location filter
•	Results displayed on interactive Leaflet map

Booking System
•	Create booking with slot selection
•	Provider confirmation / rejection flow
•	Status updates: Pending → Confirmed → Completed
•	Full booking history for users and providers

Rating & Review System
•	1-5 star rating per booking
•	Automatic rating average calculation
•	Total review count maintained per provider

Demo Payment Integration
•	Razorpay sandbox mode — no real money required
•	UPI simulation for realistic demo

Key API Endpoints
POST  /api/auth/register          - Register user or provider
POST  /api/auth/login             - Get JWT token

GET   /api/providers/nearby       - Search by lat/lng/radius
GET   /api/providers/:id          - Provider details
POST  /api/providers/register     - Register as provider

POST  /api/bookings               - Create booking
PATCH /api/bookings/:id/confirm   - Provider confirms
GET   /api/bookings/my            - My bookings

Project Structure
local-link/
  client/                    # React Frontend (PWA)
    src/
      components/
        SearchBar.jsx        - Location + category input
        ProviderCard.jsx     - Provider listing card
        MapView.jsx          - Leaflet map (FREE)
        BookingModal.jsx     - Slot selection
      pages/
        Home.jsx             - Search results
        ProviderProfile.jsx
        Booking.jsx
      context/
        AuthContext.js       - Global auth state
      utils/
        api.js               - Axios base config
        geo.js               - Get user location

  server/                    # Node.js Backend
    models/
      Provider.js            - GeoJSON location index
      User.js                - Customer model
      Booking.js             - Booking with status
      Review.js              - Rating system
    routes/
      auth.js                - Phone OTP / JWT
      providers.js           - Search + Register
      bookings.js            - Book + Confirm
    middleware/
      auth.js                - JWT verification
    server.js                - Entry point
    .env                     - Secrets (never commit!)

How To Run Locally
Backend
cd server
npm install
node server.js

Create a .env file with:
MONGO_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_secret

Frontend
cd client
npm install
npm start

Free MongoDB Setup
15.	Go to https://www.mongodb.com/cloud/atlas
16.	Create a free cluster and get the connection string
17.	Paste into .env as MONGO_URI

Team Collaboration
•	Backend & Infrastructure: Provider schema design, GeoJSON indexing, MongoDB queries, Firebase OTP integration, JWT middleware, API routes
•	Frontend & UX: Dashboard design, map integration, auto-refresh logic, booking flow, Kannada i18n toggle, PWA configuration, Netlify deployment

Why Local-Link is Different
Traditional Platforms	Local-Link
20-30% commission	5-10% commission
Centralized control	Decentralized model
Limited vernacular support	Kannada supported
High listing fees	Free onboarding
Requires app install	Works as PWA instantly
No income transparency	Provider income stats in admin panel

Evaluation Criteria Mapping
Criteria	What We Demonstrate
Innovation	5% commission vs 25% on competing platforms
Affordability	Free PWA — no app installation needed
Approach	Live 5km radius search with map visualization
Feasibility	Working prototype with real bookings and payments
Social Impact	Provider income stats in admin panel

Social Impact
•	Empowers local skilled workers with fair, transparent income
•	Increases earning transparency and reduces exploitation
•	Promotes hyperlocal economy and community self-reliance
•	Supports digital inclusion for vernacular-language users
•	Removes intermediaries — workers keep 90-95% of earnings

Future Enhancements
•	Live job tracking with real-time location updates
•	In-app chat between users and providers
•	Subscription plans for providers
•	AI-based service recommendations
•	Admin analytics dashboard with provider income stats

Contributors
Abhilash G
Parivarthan 2026 Participant

License
This project is developed for academic and innovation presentation purposes under Parivarthan 2026.
