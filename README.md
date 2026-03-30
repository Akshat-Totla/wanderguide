# WanderGuide 🌍

A full-stack Tour & Travel booking web application built with the MERN stack (MongoDB, Express, React, Node.js).

## Live Demo
> https://wanderguide-teal.vercel.app/

---

## Features

### User Features
- 🔐 JWT authentication (signup, login, logout) with secure httpOnly cookies
- 🔄 Auto token refresh — seamless session management
- 👤 User profile with photo upload (Cloudinary)
- 🗺️ Browse and search tours with filters (difficulty, price, country)
- 📍 Interactive world map view with tour locations (Leaflet.js)
- ❤️ Wishlist — save and manage favourite tours
- 📅 Book tours with date picker and guest count
- 📋 Day-by-day tour itinerary breakdown
- 🧾 Booking history and cancellation
- ⚙️ Change password and delete account

### Admin Features
- 📊 Dashboard with revenue stats and monthly charts
- ✈️ Create, edit, delete tours with full itinerary management
- 👥 Manage users and roles (user / guide / admin)
- 📦 View and manage all bookings

### UI/UX
- 🌙 Dark mode toggle
- 📱 Fully responsive with mobile hamburger menu
- ⚡ Loading skeletons and smooth transitions
- 🔔 Toast notifications

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | Image storage |
| Multer | File upload handling |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool |
| Redux Toolkit | State management |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| Leaflet.js | Interactive maps |
| React Hot Toast | Notifications |

---

## Project Structure
```
wanderguide/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Cloudinary, Passport config
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routes
│   │   └── utils/           # JWT helpers, email utils
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   └── store/           # Redux slices
│   └── index.html
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/wanderguide.git
cd wanderguide
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:
```bash
npm run dev
```

### 3. Seed the database
```bash
npm run seed
```
This populates 9 tours with full itineraries, images, and coordinates.

### 4. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

### 5. Open the app
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Tours
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/tours` | Get all tours (with filters) | Public |
| GET | `/api/tours/featured` | Get featured tours | Public |
| GET | `/api/tours/:id` | Get single tour | Public |
| POST | `/api/tours` | Create tour | Admin/Guide |
| PATCH | `/api/tours/:id` | Update tour | Admin/Guide |
| DELETE | `/api/tours/:id` | Delete tour | Admin |
| POST | `/api/tours/:id/itinerary` | Add itinerary day | Admin/Guide |

### Bookings
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/bookings` | Create booking | Private |
| GET | `/api/bookings/my` | Get my bookings | Private |
| GET | `/api/bookings/:id` | Get single booking | Private |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking | Private |

### Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/users/profile` | Get profile | Private |
| PATCH | `/api/users/profile` | Update profile | Private |
| PATCH | `/api/users/change-password` | Change password | Private |
| PATCH | `/api/users/upload-photo` | Upload avatar | Private |
| DELETE | `/api/users/delete-account` | Delete account | Private |

### Wishlist
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/wishlist` | Get wishlist | Private |
| POST | `/api/wishlist/:tourId` | Add to wishlist | Private |
| DELETE | `/api/wishlist/:tourId` | Remove from wishlist | Private |

### Admin
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/stats` | Get dashboard stats | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PATCH | `/api/admin/users/:id/role` | Update user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/bookings` | Get all bookings | Admin |

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES` | Access token expiry (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES` | Refresh token expiry (e.g. `7d`) |
| `NODE_ENV` | Environment (`development` / `production`) |
| `CLIENT_URL` | Frontend URL for CORS |
| `PORT` | Backend port (default `5000`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Roadmap

- [ ] Stripe payment integration
- [ ] Email booking confirmations (Nodemailer)
- [ ] Tour reviews and star ratings
- [ ] Google OAuth login
- [ ] Deploy to Vercel + Render
- [ ] PDF booking receipt download
- [ ] Real-time notifications (Socket.io)
- [ ] PWA support

---

## What I Learned

Building WanderGuide taught me:

- **JWT auth flow** — access + refresh token pattern with httpOnly cookies
- **Redux Toolkit** — managing complex state with slices and async thunks
- **MongoDB aggregation** — revenue stats and monthly booking charts
- **Role-based access control** — protecting routes by user role
- **File uploads** — Multer + Cloudinary pipeline
- **React patterns** — protected routes, custom hooks, reusable components
- **REST API design** — filtering, sorting, pagination with query strings
- **Map integration** — Leaflet.js with custom popups

---

## Contributing

Pull requests are welcome. For major changes please open an issue first.

---

## License

MIT

---

## Author

Built by **[Your Name]** as a MERN stack learning project.

> ⭐ Star this repo if you found it helpful!# wanderguide
