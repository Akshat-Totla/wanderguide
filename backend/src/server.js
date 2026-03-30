import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routers/auth.js';
import tourRoutes from './routers/tours.js';
import bookingRoutes from './routers/bookings.js';
import adminRoutes from './routers/admin.js';
import userRoutes from './routers/users.js';
import wishlistRoutes from './routers/wishlist.js';

dotenv.config();
connectDB();

const app = express();

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: process.env.CLIENT_URL, // MUST be exact frontend URL (no fallback in production)
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Debug middleware (temporary - REMOVE later)
app.use((req, res, next) => {
  console.log("Incoming Cookies:", req.cookies);
  next();
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/tours', tourRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.json({ message: 'WanderGuide API is running' });
});

// ❌ Optional global error handler (you can enable later)
// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     status: 'error',
//     message: err.message || 'Internal server error',
//   });
// });

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
