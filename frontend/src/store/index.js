import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tourReducer from './tourSlice';
import bookingReducer from './bookingSlice';
import adminReducer from './adminSlice';
import wishlistReducer from './wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tours: tourReducer,
    bookings: bookingReducer,
    admin: adminReducer,
    wishlist: wishlistReducer,
  },
});