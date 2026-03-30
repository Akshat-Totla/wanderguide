import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/bookings', data);
    return res.data.booking;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Booking failed');
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/bookings/my');
    return res.data.bookings;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
  }
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/bookings/${id}/cancel`);
    return res.data.booking;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Cancellation failed');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentBooking: (state) => { state.currentBooking = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex(b => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
      });
  },
});

export const { clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;