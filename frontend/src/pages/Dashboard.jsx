import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyBookings, cancelBooking } from '../store/bookingSlice';
import Navbar from '../components/NavBar';
import toast from 'react-hot-toast';

const statusColors = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((s) => s.bookings);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchMyBookings()); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    const res = await dispatch(cancelBooking(id));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Booking cancelled');
    } else {
      toast.error(res.payload);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900">My dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}</p>
          </div>
          <Link
            to="/tours"
            className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            Book new tour
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total bookings', value: bookings.length },
            { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
            { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
              <div className="font-display text-3xl font-semibold text-brand-600 mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bookings list */}
        <h2 className="font-display text-xl font-semibold text-slate-900 mb-4">My bookings</h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 h-28 animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-400 text-lg mb-2">No bookings yet</p>
            <Link to="/tours" className="text-brand-600 text-sm font-medium hover:underline">
              Browse tours to get started →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {booking.tour?.coverImage && booking.tour.coverImage !== 'default-tour.jpg' ? (
                    <img src={booking.tour.coverImage} alt={booking.tour.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🗺</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 truncate">{booking.tour?.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    📍 {booking.tour?.location} &nbsp;·&nbsp;
                    📅 {new Date(booking.bookingDate).toLocaleDateString('en-US', { dateStyle: 'medium' })} &nbsp;·&nbsp;
                    👥 {booking.guests} guests
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-semibold text-slate-900 mb-2">${booking.totalPrice}</div>
                  <div className="flex gap-2">
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View
                    </Link>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}