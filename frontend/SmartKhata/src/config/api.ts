/**
 * SmartKhata API Configuration
 * Configurable base URL for local development (Android emulator / physical device / production)
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.0.105:8080';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@smartkhata_auth_token',
  USER_DATA: '@smartkhata_user_data',
} as const;
