// src/utils/errorHandler.ts

import { AxiosError } from 'axios';
import Toast from 'react-native-toast-message';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  status?: number;
  code?: string;
  details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: any): string => {
  // Axios error
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.data) {
      const data = axiosError.response.data as any;
      return data.message || data.error || 'An error occurred';
    }
    return axiosError.message || 'Network error';
  }

  // AppError
  if (error instanceof AppError) {
    return error.message;
  }

  // Standard Error
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

/**
 * Parse API error response
 */
export const parseApiError = (error: any): ApiError => {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data as any;

    return {
      message: data?.message || axiosError.message || 'Network error',
      status,
      code: data?.code || axiosError.code,
      details: data?.details,
    };
  }

  return {
    message: getErrorMessage(error),
  };
};

/**
 * Handle error and show toast
 */
export const handleError = (error: any, title?: string): void => {
  const errorMessage = getErrorMessage(error);
  
  Toast.show({
    type: 'error',
    text1: title || 'Error',
    text2: errorMessage,
    visibilityTime: 4000,
  });

  // Log error in development
  if (__DEV__) {
    console.error('Error:', error);
  }
};

/**
 * Handle network errors
 */
export const handleNetworkError = (error: any): void => {
  const message = error.isAxiosError
    ? 'Network error. Please check your connection.'
    : getErrorMessage(error);

  Toast.show({
    type: 'error',
    text1: 'Connection Error',
    text2: message,
    visibilityTime: 4000,
  });
};

/**
 * Handle validation errors
 */
export const handleValidationError = (errors: Record<string, string>): void => {
  const firstError = Object.values(errors)[0];
  
  Toast.show({
    type: 'error',
    text1: 'Validation Error',
    text2: firstError,
    visibilityTime: 3000,
  });
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: any): boolean => {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 401;
  }
  return false;
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: any): boolean => {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;
    return !axiosError.response && axiosError.message === 'Network Error';
  }
  return false;
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (maxRetries <= 0) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, maxRetries - 1, delay * 2);
  }
};