import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '../api/axiosInstance';
import { STORAGE_KEYS } from '../config/api';
import { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth';

export const authService = {
  /**
   * Register shop owner + shop
   * POST /auth/register
   */
  register: async (data: RegisterRequest): Promise<string> => {
    const response = await axiosInstance.post<string>('/auth/register', data);
    return response.data;
  },

  /**
   * Login shop owner
   * POST /auth/login
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Save JWT token to AsyncStorage
   */
  saveToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  /**
   * Save user email to AsyncStorage for UI display
   */
  saveUserEmail: async (email: string): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, email);
  },

  /**
   * Get stored JWT token
   */
  getStoredToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Get stored user email
   */
  getStoredUserEmail: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
  },

  /**
   * Remove JWT token & user data from AsyncStorage
   */
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};
