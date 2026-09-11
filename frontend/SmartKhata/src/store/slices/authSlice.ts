import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../types/auth';

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isRestoring: true,
  error: null,
  userEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; userEmail?: string }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userEmail = action.payload.userEmail || state.userEmail;
      state.error = null;
      state.isRestoring = false;
    },
    logoutState: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userEmail = null;
      state.error = null;
      state.isRestoring = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setRestoring: (state, action: PayloadAction<boolean>) => {
      state.isRestoring = action.payload;
    },
  },
});

export const { setCredentials, logoutState, setLoading, setError, setRestoring } =
  authSlice.actions;

export default authSlice.reducer;
