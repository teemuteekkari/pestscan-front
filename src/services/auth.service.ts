import { axiosInstance, apiClient } from './api.client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserDto,
} from '../types/api.types';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        email: credentials.email,
        password: credentials.password, // ✅ Make sure this is being sent
      });
      console.log('Login response received:', { 
      hasToken: !!response.data.token,
      hasRefreshToken: !!response.data.refreshToken 
    });
    const { token, refreshToken, user } = response.data;
    await apiClient.setTokens(token, refreshToken);
    
    return response.data;
  }

  async register(data: RegisterRequest): Promise<UserDto> {
    const response = await axiosInstance.post<UserDto>('/auth/register', data);
    return response.data;
  }

  async requestPasswordReset(email: string): Promise<void> {
    await axiosInstance.post('/auth/forgot-password', { email });
  }

  async getCurrentUser(): Promise<UserDto> {
    const response = await axiosInstance.get<UserDto>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.clearTokens();
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>('/auth/refresh', {
      refreshToken,
    });
    
    const { token, refreshToken: newRefreshToken } = response.data;
    await apiClient.setTokens(token, newRefreshToken);
    
    return response.data;
  }

  async checkAuthStatus(): Promise<boolean> {
    const { accessToken } = await apiClient.getStoredTokens();
    return !!accessToken;
  }
}

export const authService = new AuthService();