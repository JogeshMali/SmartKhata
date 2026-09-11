export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  shopName: string;
  shopPhone: string;
  shopAddress: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRestoring: boolean;
  error: string | null;
  userEmail: string | null;
}
