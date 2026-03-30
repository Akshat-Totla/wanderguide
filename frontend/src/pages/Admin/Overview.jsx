import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../../store/adminSlice';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminOverview() {
  const dispatch = useDispatch();
  const { stats } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchStats()); }, []);

  if (!stats) return (
    <div className="p-8 text-slate-400">Loading stats...</div>
  );

  const maxRevenue = Math.max(...(stats.monthlyBookings?.map(m => m.revenue) || [1]));

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-semibold text-slate-900 mb-8">Overview</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total revenue', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'text-brand-600' },
          { label: 'Total bookings', value: stats.totalBookings, color: 'text-green-600' },
          { label: 'Total tours', value: stats.totalTours, color: 'text-amber-600' },
          { label: 'Total users', value: stats.totalUsers, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className={`font-display text-3xl font-semibold mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-slate-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-display text-xl font-semibold text-slate-900 mb-6">Monthly revenue</h2>
        {stats.monthlyBookings?.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">No booking data yet</div>
        ) : (
          <div className="flex items-end gap-3 h-40">
            {stats.monthlyBookings?.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-slate-500 font-medium">${(m.revenue / 1000).toFixed(1)}k</div>
                <div
                  className="w-full bg-brand-600 rounded-t-lg transition-all"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                />
                <div className="text-xs text-slate-400">{months[m._id.month - 1]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}