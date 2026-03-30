import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTours } from '../store/tourSlice';
import { Link } from 'react-router-dom';
import TourCard from '../components/TourCard';
import Navbar from '../components/NavBar.jsx';

export default function Tours() {
  const dispatch = useDispatch();
  const { tours, loading, total, pages, page } = useSelector((s) => s.tours);

  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  useEffect(() => {
    dispatch(fetchTours({ ...filters, page: 1 }));
  }, [filters]);

  const handlePageChange = (newPage) => {
    dispatch(fetchTours({ ...filters, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ✅ UPDATED HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-semibold text-slate-900">
            All tours
          </h1>

          <Link
            to="/map"
            className="flex items-center gap-2 text-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Map view
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 grid grid-cols-2 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Search tours..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="col-span-2 md:col-span-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="difficult">Difficult</option>
          </select>

          <input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          {total} tours found
        </p>

        {/* Tour grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 h-80 animate-pulse" />
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No tours found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div key={tour._id} className="group relative">
                <div className="
                  transform transition-all duration-300 ease-in-out
                  group-hover:scale-105
                  group-hover:-translate-y-2
                  group-hover:z-20
                  group-hover:shadow-2xl
                ">
                  <div className="relative">
                    <TourCard tour={tour} />

                    {/* Overlay */}
                    <div className="
                      absolute inset-0 opacity-0 group-hover:opacity-100
                      transition-all duration-300
                      flex items-end p-4 rounded-2xl
                      bg-gradient-to-t from-black/40 via-black/10 to-transparent
                    ">
                      <Link
                        to={`/tours/${tour._id}`}
                        className="bg-white hover:bg-gray-100 text-slate-900 px-4 py-2 rounded-lg font-semibold shadow-md transition"
                      >
                        View Details
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                  page === i + 1
                    ? 'bg-brand-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}