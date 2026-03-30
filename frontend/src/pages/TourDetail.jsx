import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTour, clearCurrentTour } from '../store/tourSlice';
import Navbar from '../components/NavBar';
import WishlistButton from '../components/WishlistButton';
import Itinerary from '../components/Itinerary';

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-amber-100 text-amber-800',
  difficult: 'bg-red-100 text-red-800',
};

export default function TourDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTour: tour, loading } = useSelector((s) => s.tours);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchTour(id));
    return () => dispatch(clearCurrentTour());
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-64 bg-slate-200 rounded-2xl" />
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-full" />
      </div>
    </div>
  );

  if (!tour) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Cover image */}
        <div className="h-72 bg-slate-200 rounded-2xl overflow-hidden mb-8">
          {tour.coverImage && tour.coverImage !== 'default-tour.jpg' ? (
            <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 text-6xl">🗺</div>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left — main info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[tour.difficulty]}`}>
                {tour.difficulty}
              </span>
              {tour.featured && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-600 text-white">
                  Featured
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl font-semibold text-slate-900 mb-3">{tour.title}</h1>
            <p className="text-slate-500 mb-6 leading-relaxed">{tour.description}</p>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Location', value: `${tour.location}, ${tour.country}` },
                { label: 'Duration', value: `${tour.duration} days` },
                { label: 'Group size', value: `Max ${tour.maxGroupSize} people` },
                { label: 'Rating', value: `${tour.rating.toFixed(1)} ★ (${tour.ratingsCount} reviews)` },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl border border-slate-100 p-4">
                  <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                  <div className="text-sm font-medium text-slate-800">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — booking card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 h-fit">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-3xl font-semibold text-slate-900">${tour.price}</div>
                <div className="text-sm text-slate-400">per person</div>
              </div>
              <WishlistButton tourId={tour._id} className="w-10 h-10" />
            </div>

            <div className="mb-6" />

            {user ? (
              <button
                onClick={() => navigate(`/book/${tour._id}`)}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Book this tour
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Sign in to book
              </button>
            )}
          </div>
        </div>

        {/* Itinerary — BELOW the grid, not inside it */}
        {tour.itinerary?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-slate-900 mb-6">
              Day-by-day itinerary
            </h2>
            <Itinerary itinerary={tour.itinerary} />
          </div>
        )}

      </div>
    </div>
  );
}