

// src/feature/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Load current logged-in user
export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
  try {
    return await authService.getMe();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Register user and load profile
export const register = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    const res = await authService.register(data);
    await thunkAPI.dispatch(loadUser()); // 👈 waits for it to complete
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Login and load user
export const login = createAsyncThunk('auth/login', async (data, thunkAPI) => {
  try {
    const res = await authService.login(data);
    await thunkAPI.dispatch(loadUser());
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    clearAuthState: (state) => {
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // loadUser
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.user = null;
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearAuthState } = authSlice.actions;

export default authSlice.reducer;
