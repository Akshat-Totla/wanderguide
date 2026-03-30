import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wishlist');
    return res.data.wishlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (tourId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/wishlist/${tourId}`);
    return res.data.wishlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (tourId, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/wishlist/${tourId}`);
    return res.data.wishlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],      // array of tour IDs (for quick lookup)
    tours: [],      // array of populated tour objects
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.tours = action.payload;
        state.items = action.payload.map((t) => t._id);
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.tours = state.tours.filter((t) => action.payload.includes(t._id));
      });
  },
});

export default wishlistSlice.reducer;