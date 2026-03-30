import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-amber-100 text-amber-800',
  difficult: 'bg-red-100 text-red-800',
};

export default function TourCard({ tour }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-slate-100 relative">
        {tour.coverImage && tour.coverImage !== 'default-tour.jpg' ? (
          <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">
            🗺
          </div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[tour.difficulty]}`}>
          {tour.difficulty}
        </span>
        {tour.featured && (
          <span className="absolute top-3 right-10 text-xs font-medium px-2.5 py-1 rounded-full bg-brand-600 text-white">
            Featured
          </span>
        )}
        {/* Wishlist heart button */}
        <div className="absolute top-2 right-2">
          <WishlistButton tourId={tour._id} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-lg font-semibold text-slate-900 leading-tight">{tour.title}</h3>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <span className="text-amber-400 text-sm">★</span>
            <span className="text-sm font-medium text-slate-700">{tour.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{tour.description}</p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span>📍 {tour.location}, {tour.country}</span>
          <span>•</span>
          <span>⏱ {tour.duration} days</span>
          <span>•</span>
          <span>👥 Max {tour.maxGroupSize}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold text-slate-900">${tour.price}</span>
            <span className="text-xs text-slate-400 ml-1">/ person</span>
          </div>
          <Link
            to={`/tours/${tour._id}`}
            className="text-sm bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            View Tour
          </Link>
        </div>
      </div>
    </div>
  );
}