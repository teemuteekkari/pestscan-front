// src/utils/helpers.ts (Remove getStatusColor and getStatusLabel)

import { format, parseISO, getWeek, getYear } from 'date-fns';
import { SpeciesCode, ObservationCategory } from '../types/api.types';

// Date formatting utilities
export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  } catch (error) {
    return time;
  }
};

export const getCurrentWeek = (): number => {
  return getWeek(new Date(), { weekStartsOn: 1 });
};

export const getCurrentYear = (): number => {
  return getYear(new Date());
};

// Species utilities
export const getSpeciesDisplayName = (code: SpeciesCode): string => {
  const displayNames: Record<SpeciesCode, string> = {
    [SpeciesCode.THRIPS]: 'Thrips',
    [SpeciesCode.RED_SPIDER_MITE]: 'Red Spider Mite',
    [SpeciesCode.WHITEFLIES]: 'Whiteflies',
    [SpeciesCode.MEALYBUGS]: 'Mealybugs',
    [SpeciesCode.CATERPILLARS]: 'Caterpillars',
    [SpeciesCode.FALSE_CODLING_MOTH]: 'False Codling Moth',
    [SpeciesCode.PEST_OTHER]: 'Other Pest',
    [SpeciesCode.DOWNY_MILDEW]: 'Downy Mildew',
    [SpeciesCode.POWDERY_MILDEW]: 'Powdery Mildew',
    [SpeciesCode.BOTRYTIS]: 'Botrytis',
    [SpeciesCode.VERTICILLIUM]: 'Verticillium',
    [SpeciesCode.BACTERIAL_WILT]: 'Bacterial Wilt',
    [SpeciesCode.DISEASE_OTHER]: 'Other Disease',
    [SpeciesCode.BENEFICIAL_PP]: 'PP (Beneficial)',
  };
  
  return displayNames[code] || code;
};

export const getSpeciesByCategory = (category: ObservationCategory): SpeciesCode[] => {
  const speciesList = Object.values(SpeciesCode);
  
  return speciesList.filter((species) => {
    const code = species as SpeciesCode;
    
    if (category === ObservationCategory.PEST) {
      return code.includes('PEST') || [
        SpeciesCode.THRIPS,
        SpeciesCode.RED_SPIDER_MITE,
        SpeciesCode.WHITEFLIES,
        SpeciesCode.MEALYBUGS,
        SpeciesCode.CATERPILLARS,
        SpeciesCode.FALSE_CODLING_MOTH,
      ].includes(code);
    }
    
    if (category === ObservationCategory.DISEASE) {
      return code.includes('DISEASE') || code.includes('MILDEW') || code.includes('WILT') || code === SpeciesCode.BOTRYTIS || code === SpeciesCode.VERTICILLIUM;
    }
    
    if (category === ObservationCategory.BENEFICIAL) {
      return code.includes('BENEFICIAL');
    }
    
    return false;
  });
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

// Number formatting
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toFixed(decimals);
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

// Status label utility (keep this, but remove getStatusColor)
export const getStatusLabel = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

// Array utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    
    result[groupKey].push(item);
    
    return result;
  }, {} as Record<string, T[]>);
};

// Error handling
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};