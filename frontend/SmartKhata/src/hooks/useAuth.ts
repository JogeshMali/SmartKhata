import { useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import {
  logoutState,
  setCredentials,
  setError,
  setLoading,
  setRestoring,
} from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { LoginRequest, RegisterRequest } from '../types/auth';
import { registerUnauthorizedHandler } from '../api/axiosInstance';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  /**
   * Restore token from AsyncStorage on app launch
   */
  const restoreAuth = useCallback(async () => {
    dispatch(setRestoring(true));
    try {
      const token = await authService.getStoredToken();
      const userEmail = await authService.getStoredUserEmail();

      if (token) {
        dispatch(setCredentials({ token, userEmail: userEmail || undefined }));
      } else {
        dispatch(logoutState());
      }
    } catch (err) {
      dispatch(logoutState());
    } finally {
      dispatch(setRestoring(false));
    }
  }, [dispatch]);

  /**
   * Register shop owner + shop
   */
  const registerUser = async (data: RegisterRequest): Promise<string> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const message = await authService.register(data);
      dispatch(setLoading(false));
      return message;
    } catch (err: any) {
      const message = err.message || 'Registration failed';
      dispatch(setError(message));
      throw new Error(message);
    }
  };

  /**
   * Login user & save JWT token
   */
  const loginUser = async (credentials: LoginRequest): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await authService.login(credentials);
      if (response && response.token) {
        await authService.saveToken(response.token);
        await authService.saveUserEmail(credentials.email);
        dispatch(
          setCredentials({
            token: response.token,
            userEmail: credentials.email,
          })
        );
      } else {
        throw new Error('No JWT token received from backend server.');
      }
    } catch (err: any) {
      const message = err.message || 'Login failed';
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Logout user & clear token
   */
  const logoutUser = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore storage errors on logout
    } finally {
      dispatch(logoutState());
    }
  }, [dispatch]);

  // Hook 401 callback to trigger automatic logout
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      dispatch(logoutState());
    });
  }, [dispatch]);

  return {
    ...authState,
    restoreAuth,
    registerUser,
    loginUser,
    logoutUser,
  };
};
