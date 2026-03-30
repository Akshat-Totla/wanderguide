import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchMe } from './store/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import BookTour from './pages/BookTour';
import BookingConfirmation from './pages/BookingConfirmation';
import Dashboard from './pages/Dashboard';
import AdminLayout from './pages/Admin/index';
import AdminOverview from './pages/Admin/Overview';
import AdminTours from './pages/Admin/Tours';
import AdminBookings from './pages/Admin/Bookings';
import AdminUsers from './pages/Admin/Users';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import MapView from './pages/MapView';

const AdminPanel = () => <div className="p-8 font-display text-2xl">Admin — Phase 5</div>;

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchMe()); }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/map" element={<MapView />} />
        
        {/* Protected: any logged in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book/:id" element={<BookTour />} />
          <Route path="/bookings/:id" element={<BookingConfirmation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        {/* Protected: admin only */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminOverview />} />
    <Route path="tours" element={<AdminTours />} />
    <Route path="bookings" element={<AdminBookings />} />
    <Route path="users" element={<AdminUsers />} />
  </Route>
</Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
  
}