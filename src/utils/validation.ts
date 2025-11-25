// src/utils/validation.ts

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };
  
  /**
   * Validate phone number
   */
  export const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's a valid length (10 or 11 digits)
    return cleaned.length >= 10 && cleaned.length <= 15;
  };
  
  /**
   * Validate password strength
   */
  export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
  
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
  
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
  
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
  
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  /**
   * Validate URL
   */
  export const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Validate required field
   */
  export const validateRequired = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };
  
  /**
   * Validate min length
   */
  export const validateMinLength = (value: string, minLength: number): boolean => {
    return value.length >= minLength;
  };
  
  /**
   * Validate max length
   */
  export const validateMaxLength = (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
  };
  
  /**
   * Validate number range
   */
  export const validateRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  };
  
  /**
   * Validate positive number
   */
  export const validatePositiveNumber = (value: number): boolean => {
    return value > 0;
  };
  
  /**
   * Validate integer
   */
  export const validateInteger = (value: number): boolean => {
    return Number.isInteger(value);
  };
  
  /**
   * Validate week number (1-53)
   */
  export const validateWeekNumber = (week: number): boolean => {
    return validateInteger(week) && validateRange(week, 1, 53);
  };
  
  /**
   * Validate month number (1-12)
   */
  export const validateMonthNumber = (month: number): boolean => {
    return validateInteger(month) && validateRange(month, 1, 12);
  };
  
  /**
   * Validate year
   */
  export const validateYear = (year: number): boolean => {
    const currentYear = new Date().getFullYear();
    return validateInteger(year) && validateRange(year, 2000, currentYear + 10);
  };
  
  /**
   * Validate percentage (0-100)
   */
  export const validatePercentage = (value: number): boolean => {
    return validateRange(value, 0, 100);
  };
  
  /**
   * Validate file size
   */
  export const validateFileSize = (sizeInBytes: number, maxSizeInMB: number): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return sizeInBytes <= maxSizeInBytes;
  };
  
  /**
   * Validate file type
   */
  export const validateFileType = (fileType: string, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(fileType);
  };
  
  /**
   * Validate date string (YYYY-MM-DD)
   */
  export const validateDateString = (dateString: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
  
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  
  /**
   * Validate time string (HH:mm)
   */
  export const validateTimeString = (timeString: string): boolean => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(timeString);
  };