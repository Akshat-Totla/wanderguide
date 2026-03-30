import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTours } from '../store/tourSlice';
import Navbar from '../components/NavBar';
import ToursMap from '../components/ToursMap';
import TourCard from '../components/TourCard';

export default function MapView() {
  const dispatch = useDispatch();
  const { tours, loading } = useSelector((s) => s.tours);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [hoveredTour, setHoveredTour] = useState(null);

  useEffect(() => {
    dispatch(fetchTours({ limit: 50 }));
  }, []);

  const filteredTours = selectedDifficulty
    ? tours.filter(t => t.difficulty === selectedDifficulty)
    : tours;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 py-6 gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900 dark:text-slate-100">
              Tour map
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {filteredTours.filter(t => t.coordinates?.lat).length} tours on the map
            </p>
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-2">
            {['', 'easy', 'medium', 'difficult'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  selectedDifficulty === d
                    ? 'bg-brand-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {d === '' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Map + sidebar layout */}
        <div className="flex gap-5 flex-1" style={{ minHeight: '600px' }}>

          {/* Map */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {loading ? (
              <div className="h-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
            ) : (
              <ToursMap tours={filteredTours} />
            )}
          </div>

          {/* Sidebar — tour list */}
          <div className="w-72 shrink-0 flex flex-col gap-3 overflow-y-auto">
            {filteredTours.map((tour) => (
              <div
                key={tour._id}
                onMouseEnter={() => setHoveredTour(tour._id)}
                onMouseLeave={() => setHoveredTour(null)}
                className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all cursor-pointer ${
                  hoveredTour === tour._id
                    ? 'border-brand-400 shadow-md'
                    : 'border-slate-100 dark:border-slate-700'
                }`}
              >
                <div className="flex gap-3 p-3 items-center">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {tour.coverImage && tour.coverImage !== 'default-tour.jpg' ? (
                      <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🗺</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                      {tour.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      📍 {tour.location}, {tour.country}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-brand-600">${tour.price}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{tour.duration}d</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-amber-500">★ {tour.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTours.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">
                No tours found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}