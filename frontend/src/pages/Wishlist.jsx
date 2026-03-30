import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWishlist } from '../store/wishlistSlice';
import TourCard from '../components/TourCard';
import Navbar from '../components/NavBar';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { tours } = useSelector((s) => s.wishlist);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) dispatch(fetchWishlist());
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900">My wishlist</h1>
            <p className="text-slate-500 text-sm mt-1">{tours.length} saved {tours.length === 1 ? 'tour' : 'tours'}</p>
          </div>
          <Link
            to="/tours"
            className="text-sm bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            Browse tours
          </Link>
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="text-5xl mb-4">🤍</div>
            <p className="text-slate-400 text-lg mb-2">No saved tours yet</p>
            <p className="text-slate-400 text-sm mb-6">
              Click the heart icon on any tour to save it here
            </p>
            <Link
              to="/tours"
              className="text-sm bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              Explore tours
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}