import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { api } from './services/api';

function getSavedAuth() {
  try {
    return JSON.parse(localStorage.getItem('sweetyAuth')) || {};
  } catch {
    return {};
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer
  },
  preloadedState: { auth: getSavedAuth() },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
});
