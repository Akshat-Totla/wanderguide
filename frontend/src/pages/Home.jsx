import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFeaturedTours } from '../store/tourSlice';
import TourCard from '../components/TourCard';
import Navbar from '../components/NavBar';


export default function Home() {
  const dispatch = useDispatch();
  const { featured } = useSelector((s) => s.tours);
  const { user } = useSelector((s) => s.auth);
  const images = [
  // Paris - Eiffel Tower
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",

  // Switzerland Alps
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80",

  
  // Santorini Greece
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",

  
  // Bali Indonesia
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80"
];

 const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, 4000);

  return () => clearInterval(interval);
}, []);
  useEffect(() => { dispatch(fetchFeaturedTours()); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      {/* Hero */}
<section
  className="relative border-b border-slate-100 transition-all duration-1000 ease-in-out"
  style={{
    backgroundImage: `url(${images[currentIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Dark gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-4 py-28 text-center">
    <h1 className="font-display text-5xl font-semibold text-white mb-4 leading-tight">
      Explore the world with<br />
      <span className="text-sky-300">WanderGuide</span>
    </h1>
    <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
      Discover handpicked tours, expert guides, and unforgettable experiences across the globe.
    </p>
<div className="flex items-center justify-center gap-3">
  <Link
    to="/tours"
    className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3 rounded-xl font-medium transition-colors"
  >
    Browse all tours
  </Link>
  {user ? (
    <Link
      to="/dashboard"
      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-xl font-medium transition-colors"
    >
      My bookings
    </Link>
  ) : (
    <Link
      to="/signup"
      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-xl font-medium transition-colors"
    >
      Create account
    </Link>
  )}
</div>  </div>
</section>

      {/* Featured Tours */}
     <section className="max-w-7xl mx-auto px-6 py-20">
  
  {/* Header */}
  <div className="flex items-center justify-between mb-10">
    <div>
      <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
        Featured Tours
      </h2>
      <p className="text-slate-500 mt-2 text-sm">
        Discover handpicked experiences just for you
      </p>
    </div>

    <Link
      to="/tours"
      className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-lg shadow hover:scale-105 transition"
    >
      View All →
    </Link>
  </div>

  {/* Content */}
  {featured.length === 0 ? (
    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
      <p className="text-xl font-medium text-slate-600 mb-2">
        No featured tours yet 😔
      </p>
      <p className="text-sm text-slate-400">
        Add tours from the admin panel to see them here
      </p>
    </div>
  ) : (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((tour) => (
        <div
          key={tour._id}
          className="transform hover:-translate-y-2 transition duration-300"
        >
          <TourCard tour={tour} />
        </div>
      ))}
    </div>
  )}
</section>

      {/* Stats */}
      <section className="bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '500+', label: 'Tours worldwide' },
            { value: '10k+', label: 'Happy travelers' },
            { value: '50+', label: 'Countries covered' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-4xl font-semibold text-brand-600 mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}