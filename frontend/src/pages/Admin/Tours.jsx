import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminTours, createAdminTour,
  updateAdminTour, deleteAdminTour,
} from '../../store/adminSlice';
import toast from 'react-hot-toast';

const emptyDay = {
  day: 1,
  title: '',
  description: '',
  activities: '',
  accommodation: '',
  meals: { breakfast: false, lunch: false, dinner: false },
};

const emptyForm = {
  title: '', description: '', price: '', duration: '',
  maxGroupSize: '', difficulty: 'easy', location: '',
  country: '', coverImage: '', featured: false,
  itinerary: [],
};

export default function AdminTours() {
  const dispatch = useDispatch();
  const { tours } = useSelector((s) => s.admin);
  const [showForm, setShowForm] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => { dispatch(fetchAdminTours()); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditTour(null);
    setActiveTab('basic');
    setShowForm(true);
  };

  const openEdit = (tour) => {
    setForm({
      ...tour,
      price: tour.price,
      duration: tour.duration,
      maxGroupSize: tour.maxGroupSize,
      itinerary: (tour.itinerary || []).map(d => ({
        ...d,
        activities: Array.isArray(d.activities) ? d.activities.join(', ') : d.activities || '',
      })),
    });
    setEditTour(tour);
    setActiveTab('basic');
    setShowForm(true);
  };

  const addDay = () => {
    const nextDay = form.itinerary.length + 1;
    setForm({
      ...form,
      itinerary: [...form.itinerary, { ...emptyDay, day: nextDay }],
    });
  };

  const removeDay = (index) => {
    const updated = form.itinerary
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, day: i + 1 }));
    setForm({ ...form, itinerary: updated });
  };

  const updateDay = (index, field, value) => {
    const updated = form.itinerary.map((d, i) =>
      i === index ? { ...d, [field]: value } : d
    );
    setForm({ ...form, itinerary: updated });
  };

  const updateMeal = (index, meal, value) => {
    const updated = form.itinerary.map((d, i) =>
      i === index ? { ...d, meals: { ...d.meals, [meal]: value } } : d
    );
    setForm({ ...form, itinerary: updated });
  };

  // ✅ Single clean handleSubmit — no duplicate
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      price: Number(form.price),
      duration: Number(form.duration),
      maxGroupSize: Number(form.maxGroupSize),
      itinerary: form.itinerary.map((d) => ({
        day: d.day,
        title: d.title,
        description: d.description,
        accommodation: d.accommodation || '',
        meals: d.meals || { breakfast: false, lunch: false, dinner: false },
        activities: typeof d.activities === 'string'
          ? d.activities.split(',').map(a => a.trim()).filter(Boolean)
          : Array.isArray(d.activities)
          ? d.activities
          : [],
      })),
    };

    if (editTour) {
      const res = await dispatch(updateAdminTour({ id: editTour._id, data }));
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Tour updated');
        setShowForm(false);
      } else toast.error(res.payload);
    } else {
      const res = await dispatch(createAdminTour(data));
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Tour created');
        setShowForm(false);
      } else toast.error(res.payload);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tour?')) return;
    const res = await dispatch(deleteAdminTour(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Tour deleted');
    else toast.error(res.payload);
  };

  const basicFields = [
    { key: 'title', label: 'Title', type: 'text', span: 2 },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'country', label: 'Country', type: 'text' },
    { key: 'price', label: 'Price ($)', type: 'number' },
    { key: 'duration', label: 'Duration (days)', type: 'number' },
    { key: 'maxGroupSize', label: 'Max group size', type: 'number' },
    { key: 'coverImage', label: 'Cover image URL', type: 'text', span: 2 },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Tours</h1>
        <button
          onClick={openCreate}
          className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          + Add tour
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 50, overflowY: 'auto', padding: '2rem 1rem' }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-3xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-display text-xl font-semibold text-slate-900">
                {editTour ? 'Edit tour' : 'Add new tour'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-4 pb-0 border-b border-slate-100">
              {['basic', 'itinerary'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'itinerary' ? `Itinerary (${form.itinerary.length} days)` : 'Basic info'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6">

                {/* Basic info tab */}
                {activeTab === 'basic' && (
                  <div className="grid grid-cols-2 gap-4">
                    {basicFields.map((f) => (
                      <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
                        <label className="block text-xs font-medium text-slate-600 mb-1">{f.label}</label>
                        <input
                          type={f.type}
                          value={form[f.key]}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                          required
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Difficulty</label>
                      <select
                        value={form.difficulty}
                        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="difficult">Difficult</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="w-4 h-4 accent-brand-600"
                      />
                      <label htmlFor="featured" className="text-sm text-slate-700">Featured tour</label>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Itinerary tab */}
                {activeTab === 'itinerary' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-500">
                        Add a day-by-day breakdown. Activities are comma-separated.
                      </p>
                      <button
                        type="button"
                        onClick={addDay}
                        className="bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0"
                      >
                        + Add day
                      </button>
                    </div>

                    {form.itinerary.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm mb-3">No itinerary days yet</p>
                        <button
                          type="button"
                          onClick={addDay}
                          className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          + Add first day
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                        {form.itinerary.map((day, index) => (
                          <div key={index} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-brand-600 text-white rounded-lg flex items-center justify-center text-xs font-semibold">
                                  {day.day}
                                </div>
                                <span className="text-sm font-medium text-slate-700">Day {day.day}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDay(index)}
                                className="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">Day title</label>
                                <input
                                  type="text"
                                  value={day.title}
                                  onChange={(e) => updateDay(index, 'title', e.target.value)}
                                  placeholder="e.g. Arrival in Kathmandu"
                                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                  required
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                                <textarea
                                  rows={2}
                                  value={day.description}
                                  onChange={(e) => updateDay(index, 'description', e.target.value)}
                                  placeholder="What happens on this day..."
                                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                                  required
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Activities <span className="text-slate-400 font-normal">(comma separated)</span>
                                </label>
                                <input
                                  type="text"
                                  value={day.activities}
                                  onChange={(e) => updateDay(index, 'activities', e.target.value)}
                                  placeholder="e.g. Temple visit, Cooking class, Sunset hike"
                                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Accommodation <span className="text-slate-400 font-normal">(optional)</span>
                                </label>
                                <input
                                  type="text"
                                  value={day.accommodation}
                                  onChange={(e) => updateDay(index, 'accommodation', e.target.value)}
                                  placeholder="e.g. Hotel Himalaya, Kathmandu"
                                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-2">Meals included</label>
                                <div className="flex gap-4">
                                  {['breakfast', 'lunch', 'dinner'].map((meal) => (
                                    <label key={meal} className="flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={day.meals?.[meal] || false}
                                        onChange={(e) => updateMeal(index, meal, e.target.checked)}
                                        className="w-3.5 h-3.5 accent-brand-600"
                                      />
                                      <span className="text-xs text-slate-600 capitalize">{meal}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex gap-3 justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                <div className="text-xs text-slate-400">
                  {activeTab === 'basic' ? 'Fill basic info then add itinerary days' : `${form.itinerary.length} days added`}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  {activeTab === 'basic' ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab('itinerary')}
                      className="px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-colors"
                    >
                      Next: Itinerary →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-colors"
                    >
                      {editTour ? 'Save changes' : 'Create tour'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tours table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Tour', 'Location', 'Price', 'Duration', 'Difficulty', 'Days', 'Featured', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tours.map((tour) => (
              <tr key={tour._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      {tour.coverImage && tour.coverImage !== 'default-tour.jpg' ? (
                        <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">🗺</div>
                      )}
                    </div>
                    <span className="font-medium text-slate-900 truncate max-w-[160px]">{tour.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{tour.location}, {tour.country}</td>
                <td className="px-4 py-3 font-medium">${tour.price}</td>
                <td className="px-4 py-3 text-slate-500">{tour.duration}d</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    tour.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    tour.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tour.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {tour.itinerary?.length > 0 ? (
                    <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">
                      {tour.itinerary.length} days
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">None</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    tour.featured ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tour.featured ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(tour)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tour._id)}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tours.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No tours yet — add one above</div>
        )}
      </div>
    </div>
  );
}