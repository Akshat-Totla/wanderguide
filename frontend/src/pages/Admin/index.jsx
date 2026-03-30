import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const navItems = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/tours', label: 'Tours' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-100">
          <div
            onClick={() => navigate('/')}
            className="font-display text-xl font-semibold text-brand-600 cursor-pointer"
          >
            WanderGuide
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Admin panel</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="text-sm font-medium text-slate-700">{user?.name}</div>
          <div className="text-xs text-slate-400">{user?.email}</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}