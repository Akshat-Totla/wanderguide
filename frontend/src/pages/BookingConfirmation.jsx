import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axiosInstance';
import { useState } from 'react';
import Navbar from '../components/NavBar';

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data.booking);
      } catch {
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-slate-400">Loading...</div>
    </div>
  );

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">

        {/* Success banner */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mb-6">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="font-display text-3xl font-semibold text-green-800 mb-2">Booking confirmed!</h1>
          <p className="text-green-600 text-sm">
            Your adventure is booked. Get ready for an amazing experience!
          </p>
        </div>

        {/* Booking details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-display text-xl font-semibold text-slate-900 mb-5">Booking details</h2>

          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              {booking.tour?.coverImage && booking.tour.coverImage !== 'default-tour.jpg' ? (
                <img src={booking.tour.coverImage} alt={booking.tour.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🗺</div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{booking.tour?.title}</h3>
              <p className="text-sm text-slate-500">📍 {booking.tour?.location}, {booking.tour?.country}</p>
              <p className="text-sm text-slate-500">⏱ {booking.tour?.duration} days</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Booking ID', value: `#${booking._id.slice(-8).toUpperCase()}` },
              { label: 'Tour date', value: new Date(booking.bookingDate).toLocaleDateString('en-US', { dateStyle: 'long' }) },
              { label: 'Guests', value: booking.guests },
              { label: 'Total paid', value: `$${booking.totalPrice}` },
              { label: 'Status', value: booking.status },
              { label: 'Payment', value: booking.paymentStatus },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-0.5">{item.label}</div>
                <div className="font-medium text-slate-800 capitalize">{item.value}</div>
              </div>
            ))}
          </div>

          {booking.specialRequests && (
            <div className="mt-4 bg-slate-50 rounded-xl p-3 text-sm">
              <div className="text-xs text-slate-400 mb-0.5">Special requests</div>
              <div className="text-slate-700">{booking.specialRequests}</div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Link
            to="/dashboard"
            className="flex-1 text-center bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-medium transition-colors text-sm"
          >
            View all bookings
          </Link>
          <Link
            to="/tours"
            className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium transition-colors text-sm"
          >
            Browse more tours
          </Link>
        </div>
      </div>
    </div>
  );
}