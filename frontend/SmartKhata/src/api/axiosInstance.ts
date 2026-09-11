import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../config/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token automatically
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let unauthorizedHandler: (() => void) | null = null;

export const registerUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};

// Response Interceptor: Handle errors & 401 token invalidation
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } catch (e) {
        // ignore
      }
      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
    }

    const errorMessage = extractErrorMessage(error);
    return Promise.reject(new Error(errorMessage));
  }
);

export function extractErrorMessage(error: AxiosError | any): string {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (typeof data === 'string' && data.trim().length > 0) {
      return data;
    }
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
    if (status === 400) return 'Invalid request. Please check input fields.';
    if (status === 401) return 'Invalid credentials or session expired.';
    if (status === 403) return 'Access denied.';
    if (status === 404) return 'Requested resource not found.';
    if (status === 409) return 'Account with this email or shop phone already exists.';
    if (status >= 500) return 'Server error. Please try again later.';
  } else if (error.request) {
    return 'Network error. Cannot reach backend server at ' + API_BASE_URL;
  }
  return error.message || 'An unknown error occurred.';
}
