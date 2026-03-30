import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import api from '../api/axiosInstance';
import Navbar from '../components/NavBar';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const fileRef = useRef();

  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [infoForm, setInfoForm] = useState({ name: '', email: '' });
  const [passForm, setPassForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data.user);
        setInfoForm({ name: res.data.user.name, email: res.data.user.email });
      } catch {
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch('/users/profile', infoForm);
      setProfile(res.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    setLoading(true);
    try {
      await api.patch('/users/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    setPhotoLoading(true);
    try {
      const res = await api.patch('/users/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data.user);
      toast.success('Photo updated');
    } catch {
      toast.error('Photo upload failed');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    try {
      await api.delete('/users/delete-account');
      dispatch(logout());
      navigate('/');
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  if (!profile) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-400">Loading profile...</div>
    </div>
  );

  const tabs = ['info', 'password', 'danger'];
  const tabLabels = { info: 'Profile info', password: 'Change password', danger: 'Danger zone' };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-semibold text-slate-900 mb-8">My profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left — avatar card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center text-center h-fit">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100">
                {profile.photo && profile.photo !== 'default.jpg' ? (
                  <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-display font-semibold text-slate-300">
                    {profile.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current.click()}
                disabled={photoLoading}
                className="absolute bottom-0 right-0 w-7 h-7 bg-brand-600 hover:bg-brand-500 text-white rounded-full text-xs flex items-center justify-center transition-colors"
              >
                {photoLoading ? '...' : '+'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <h2 className="font-semibold text-slate-900 text-lg">{profile.name}</h2>
            <p className="text-slate-500 text-sm mb-3">{profile.email}</p>

            <span className={`text-xs px-3 py-1 rounded-full font-medium mb-4 ${
              profile.role === 'admin' ? 'bg-purple-100 text-purple-800' :
              profile.role === 'guide' ? 'bg-blue-100 text-blue-800' :
              'bg-slate-100 text-slate-600'
            }`}>
              {profile.role}
            </span>

            <p className="text-xs text-slate-400">
              Member for {formatDistanceToNow(new Date(profile.createdAt))}
            </p>
          </div>

          {/* Right — tabs */}
          <div className="md:col-span-2">
            {/* Tab nav */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            {/* Profile info tab */}
            {activeTab === 'info' && (
              <form onSubmit={handleInfoSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                  <input
                    type="text"
                    value={infoForm.name}
                    onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                  <input
                    type="email"
                    value={infoForm.email}
                    onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-60"
                >
                  {loading ? 'Saving...' : 'Save changes'}
                </button>
              </form>
            )}

            {/* Change password tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current password</label>
                  <input
                    type="password"
                    value={passForm.currentPassword}
                    onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New password</label>
                  <input
                    type="password"
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm new password</label>
                  <input
                    type="password"
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-60"
                >
                  {loading ? 'Updating...' : 'Update password'}
                </button>
              </form>
            )}

            {/* Danger zone tab */}
            {activeTab === 'danger' && (
              <div className="bg-white rounded-2xl border border-red-100 p-6">
                <h3 className="font-semibold text-red-600 mb-2">Delete account</h3>
                <p className="text-sm text-slate-500 mb-5">
                  Permanently delete your account and all your bookings. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Delete my account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}