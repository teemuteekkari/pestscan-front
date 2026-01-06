// src/services/api.client.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ErrorResponse } from '../types/api.types';

// ✅ Configure for local development
const API_BASE_URL = __DEV__
  ? Platform.select({
      // Android emulator needs special IP
      android: 'http://10.0.2.2:8080/api',
      // iOS simulator can use localhost
      ios: 'http://localhost:8080/api',
      // Web development
      web: 'http://localhost:8080/api',
      default: 'http://localhost:8080/api',
    })
  : process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    console.log('API Client initialized with base URL:', API_BASE_URL);
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (!this.accessToken) {
          this.accessToken = await AsyncStorage.getItem('accessToken');
        }

        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshAccessToken();

            if (newAccessToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await this.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      this.refreshToken = await AsyncStorage.getItem('refreshToken');
    }

    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: this.refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      await this.setTokens(accessToken, newRefreshToken);

      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.clearTokens();
      return null;
    }
  }

  async setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  }

  async clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  }

  async getStoredTokens() {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    }

    return { accessToken, refreshToken };
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export const axiosInstance = apiClient.getClient();