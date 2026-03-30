import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-2 text-2xl md:text-3xl font-bold tracking-wider font-[Outfit] transition duration-300 hover:scale-105"
        >
          <span className="text-2xl">🌍</span>
          <span className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-sm">
            WanderGuide
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/tours" className="text-sm text-slate-600 hover:text-brand-600 font-medium transition-colors">
            Explore Tours
          </Link>

          {/* ✅ Map Link */}
          <Link
            to="/map"
            className="text-sm text-slate-600 hover:text-brand-600 font-medium transition-colors"
          >
            Map
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-brand-600 font-medium transition-colors">
                My Bookings
              </Link>

              <Link to="/wishlist" className="text-sm text-slate-600 hover:text-brand-600 font-medium transition-colors">
                Wishlist
              </Link>

              <Link to="/profile" className="text-sm text-slate-600 hover:text-brand-600 font-medium transition-colors">
                Profile
              </Link>

              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg font-medium">
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-1.5 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-slate-600 hover:text-brand-600 font-medium px-3 py-1.5">
                Sign in
              </Link>
              <Link to="/signup" className="text-sm bg-brand-600 hover:bg-brand-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
        >
          <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-3">

          <Link
            to="/tours"
            onClick={close}
            className="text-sm text-slate-600 hover:text-brand-600 font-medium py-2 border-b border-slate-50"
          >
            Explore Tours
          </Link>

          {/* ✅ Map Link */}
          <Link
            to="/map"
            onClick={close}
            className="text-sm text-slate-600 hover:text-brand-600 font-medium py-2 border-b border-slate-50"
          >
            Map
          </Link>

          {user ? (
            <>
              <div className="text-xs text-slate-400 pt-1">
                Signed in as {user.name}
              </div>

              <Link to="/dashboard" onClick={close} className="text-sm py-2 border-b">
                My Bookings
              </Link>

              <Link to="/wishlist" onClick={close} className="text-sm py-2 border-b">
                Wishlist
              </Link>

              <Link to="/profile" onClick={close} className="text-sm py-2 border-b">
                Profile
              </Link>

              {user.role === 'admin' && (
                <Link to="/admin" onClick={close} className="text-sm py-2 border-b text-amber-700">
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-sm text-left text-red-500 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close} className="text-sm py-2 border-b">
                Sign in
              </Link>

              <Link
                to="/signup"
                onClick={close}
                className="text-sm bg-brand-600 text-white px-4 py-2.5 rounded-xl text-center"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}