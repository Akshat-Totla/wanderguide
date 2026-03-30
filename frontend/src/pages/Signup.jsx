import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signup, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => { if (user) navigate('/'); }, [user]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900 mb-1">Start exploring</h1>
        <p className="text-slate-500 mb-8 text-sm">Create your WanderGuide account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {['name', 'email', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{field}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}