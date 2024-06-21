import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

import { baseUrl } from '../../utils/baseUrl';
import { errorMessage, successMessage } from '../../utils/toaster';

export const fetchUser = createAsyncThunk('user/fetchUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseUrl}/user/login`, { email, password });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


const initialState = {
  isAuthenticated: false,
  userData: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthenticated(state, action) {
      state.isAuthenticated = true;
      state.userData = action.payload;
    },
    setIsNotAuthenticated(state) {
      state.isAuthenticated = false;
      state.userData = null;
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userData = action.payload.user;
        localStorage.setItem('accessToken', action.payload.accessToken)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
        successMessage('Login successfully')
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userData = null;
        errorMessage(action.payload.message)
      });
  },
});

export const { setIsAuthenticated, setIsNotAuthenticated, setLoading } = userSlice.actions;
export default userSlice.reducer;
