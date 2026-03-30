import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

export const fetchTours = createAsyncThunk('tours/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/tours', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tours');
  }
});

export const fetchFeaturedTours = createAsyncThunk('tours/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/tours/featured');
    return res.data.tours;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured tours');
  }
});

export const fetchTour = createAsyncThunk('tours/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/tours/${id}`);
    return res.data.tour;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Tour not found');
  }
});

const tourSlice = createSlice({
  name: 'tours',
  initialState: {
    tours: [],
    featured: [],
    currentTour: null,
    loading: false,
    error: null,
    total: 0,
    pages: 1,
    page: 1,
  },
  reducers: {
    clearCurrentTour: (state) => { state.currentTour = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload.tours;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchTours.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchFeaturedTours.fulfilled, (state, action) => { state.featured = action.payload; })

      .addCase(fetchTour.pending, (state) => { state.loading = true; })
      .addCase(fetchTour.fulfilled, (state, action) => { state.loading = false; state.currentTour = action.payload; })
      .addCase(fetchTour.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCurrentTour } = tourSlice.actions;
export default tourSlice.reducer;