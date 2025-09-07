// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  role: null,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const user = action.payload?.user || action.payload; // accept both shapes
      state.isAuthenticated = true;
      state.role = user?.role || null;
      state.user = user || null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.user = null;
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
