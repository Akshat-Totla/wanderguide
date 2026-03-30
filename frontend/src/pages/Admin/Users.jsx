import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers, updateAdminUserRole, deleteAdminUser } from '../../store/adminSlice';
import toast from 'react-hot-toast';

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  guide: 'bg-blue-100 text-blue-800',
  user: 'bg-slate-100 text-slate-600',
};

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users } = useSelector((s) => s.admin);
  const { user: currentUser } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchAdminUsers()); }, []);

  const handleRoleChange = async (id, role) => {
    const res = await dispatch(updateAdminUserRole({ id, role }));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Role updated');
    else toast.error(res.payload);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const res = await dispatch(deleteAdminUser(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('User deleted');
    else toast.error(res.payload);
  };

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl font-semibold text-slate-900 mb-8">Users</h1>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={u._id === currentUser?._id}
                    className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 ${roleColors[u.role]}`}
                  >
                    <option value="user">user</option>
                    <option value="guide">guide</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {u._id !== currentUser?._id && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No users found</div>
        )}
      </div>
    </div>
  );
}