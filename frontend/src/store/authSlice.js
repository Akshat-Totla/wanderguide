import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/signup', data);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data.user;
  } catch {
    return rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(signup.pending, pending)
      .addCase(signup.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(signup.rejected, rejected)

      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected, rejected)

      .addCase(logout.fulfilled, (state) => { state.user = null; })

      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; state.initialized = true; })
      .addCase(fetchMe.rejected, (state) => { state.initialized = true; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;