import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import proposalsReducer from './slices/proposalsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    proposals: proposalsReducer,
  },
});