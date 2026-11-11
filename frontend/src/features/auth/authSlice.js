import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, user: null },
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('sweetyAuth', JSON.stringify(state));
    },
    clearCredentials(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('sweetyAuth');
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
