// src/utils/storage.ts (Fixed)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Save data to storage
 */
export const saveData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Get data from storage
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

/**
 * Remove data from storage
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Clear all storage
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Get all keys from storage
 */
export const getAllKeys = async (): Promise<readonly string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Save token
 */
export const saveToken = async (token: string): Promise<void> => {
  return saveData(STORAGE_KEYS.TOKEN, token);
};

/**
 * Get token
 */
export const getToken = async (): Promise<string | null> => {
  return getData<string>(STORAGE_KEYS.TOKEN);
};

/**
 * Remove token
 */
export const removeToken = async (): Promise<void> => {
  return removeData(STORAGE_KEYS.TOKEN);
};

/**
 * Save user data
 */
export const saveUser = async (user: any): Promise<void> => {
  return saveData(STORAGE_KEYS.USER, user);
};

/**
 * Get user data
 */
export const getUser = async (): Promise<any | null> => {
  return getData(STORAGE_KEYS.USER);
};

/**
 * Remove user data
 */
export const removeUser = async (): Promise<void> => {
  return removeData(STORAGE_KEYS.USER);
};

/**
 * Save preferences
 */
export const savePreferences = async (preferences: Record<string, any>): Promise<void> => {
  return saveData(STORAGE_KEYS.PREFERENCES, preferences);
};

/**
 * Get preferences
 */
export const getPreferences = async (): Promise<Record<string, any> | null> => {
  return getData(STORAGE_KEYS.PREFERENCES);
};

/**
 * Update single preference
 */
export const updatePreference = async (key: string, value: any): Promise<void> => {
  const preferences = (await getPreferences()) || {};
  preferences[key] = value;
  return savePreferences(preferences);
};

/**
 * Check if storage is available
 */
export const isStorageAvailable = async (): Promise<boolean> => {
  try {
    const testKey = '__storage_test__';
    await AsyncStorage.setItem(testKey, 'test');
    await AsyncStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};