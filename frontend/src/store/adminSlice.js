import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

export const fetchStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/stats');
    return res.data.stats;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAdminTours = createAsyncThunk('admin/fetchTours', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/tours');
    return res.data.tours;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/users');
    return res.data.users;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchAdminBookings = createAsyncThunk('admin/fetchBookings', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/bookings');
    return res.data.bookings;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createAdminTour = createAsyncThunk('admin/createTour', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/admin/tours', data);
    return res.data.tour;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateAdminTour = createAsyncThunk('admin/updateTour', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/admin/tours/${id}`, data);
    return res.data.tour;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteAdminTour = createAsyncThunk('admin/deleteTour', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/tours/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateAdminUserRole = createAsyncThunk('admin/updateRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/admin/users/${id}/role`, { role });
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteAdminUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/users/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    tours: [],
    users: [],
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.fulfilled, (state, action) => { state.stats = action.payload; })
      .addCase(fetchAdminTours.fulfilled, (state, action) => { state.tours = action.payload; })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => { state.users = action.payload; })
      .addCase(fetchAdminBookings.fulfilled, (state, action) => { state.bookings = action.payload; })

      .addCase(createAdminTour.fulfilled, (state, action) => {
        state.tours.unshift(action.payload);
      })
      .addCase(updateAdminTour.fulfilled, (state, action) => {
        const idx = state.tours.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.tours[idx] = action.payload;
      })
      .addCase(deleteAdminTour.fulfilled, (state, action) => {
        state.tours = state.tours.filter(t => t._id !== action.payload);
      })
      .addCase(updateAdminUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;