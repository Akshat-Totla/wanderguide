import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTour } from '../store/tourSlice';
import { createBooking, clearCurrentBooking } from '../store/bookingSlice';
import Navbar from '../components/NavBar';
import toast from 'react-hot-toast';

export default function BookTour() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTour: tour } = useSelector((s) => s.tours);
  const { loading, error, currentBooking } = useSelector((s) => s.bookings);

  const [form, setForm] = useState({
    bookingDate: '',
    guests: 1,
    specialRequests: '',
  });

  useEffect(() => {
    dispatch(fetchTour(id));
    return () => dispatch(clearCurrentBooking());
  }, [id]);

  useEffect(() => {
    if (currentBooking) {
      toast.success('Booking confirmed!');
      navigate(`/bookings/${currentBooking._id}`);
    }
  }, [currentBooking]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createBooking({ tourId: id, ...form, guests: Number(form.guests) }));
  };

  // Minimum date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (!tour) return null;

  const totalPrice = tour.price * form.guests;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(`/tours/${id}`)}
          className="text-sm text-slate-500 hover:text-brand-600 mb-6 flex items-center gap-1"
        >
          ← Back to tour
        </button>

        <h1 className="font-display text-3xl font-semibold text-slate-900 mb-8">Book your tour</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select date</label>
                <input
                  type="date"
                  min={minDate}
                  value={form.bookingDate}
                  onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Number of guests (max {tour.maxGroupSize})
                </label>
                <input
                  type="number"
                  min={1}
                  max={tour.maxGroupSize}
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Special requests <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  placeholder="Any dietary requirements, accessibility needs, etc."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
              >
                {loading ? 'Confirming booking...' : `Confirm booking — $${totalPrice}`}
              </button>
            </form>
          </div>

          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 h-fit">
            <div className="h-32 rounded-xl overflow-hidden mb-4 bg-slate-100">
              {tour.coverImage && tour.coverImage !== 'default-tour.jpg' ? (
                <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🗺</div>
              )}
            </div>

            <h3 className="font-display text-lg font-semibold text-slate-900 mb-1">{tour.title}</h3>
            <p className="text-sm text-slate-500 mb-4">📍 {tour.location}, {tour.country}</p>

            <div className="space-y-2 text-sm border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium">{tour.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Price per person</span>
                <span className="font-medium">${tour.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guests</span>
                <span className="font-medium">{form.guests}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                <span className="font-medium text-slate-900">Total</span>
                <span className="font-semibold text-brand-600 text-base">${totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}