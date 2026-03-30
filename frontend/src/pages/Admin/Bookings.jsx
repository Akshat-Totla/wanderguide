import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBookings } from '../../store/adminSlice';

const statusColors = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchAdminBookings()); }, []);

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-semibold text-slate-900 mb-8">All bookings</h1>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['User', 'Tour', 'Date', 'Guests', 'Total', 'Status', 'Booked on'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{b.user?.name}</div>
                  <div className="text-xs text-slate-400">{b.user?.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-700 max-w-[160px] truncate">{b.tour?.title}</td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(b.bookingDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </td>
                <td className="px-4 py-3 text-slate-500">{b.guests}</td>
                <td className="px-4 py-3 font-medium">${b.totalPrice}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No bookings yet</div>
        )}
      </div>
    </div>
  );
}