// src/utils/constants.ts

export const APP_NAME = 'PestScan';
export const APP_VERSION = '1.0.0';
export const BUILD_NUMBER = '100';

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: '@pestscan/token',
  USER: '@pestscan/user',
  PREFERENCES: '@pestscan/preferences',
  SYNC_STATUS: '@pestscan/sync',
  PENDING_CHANGES: '@pestscan/pending_changes',
  OFFLINE_DATA: '@pestscan/offline_data',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Session Defaults
export const DEFAULT_SPOT_CHECKS_PER_BENCH = 5;
export const DEFAULT_BENCHES_PER_BAY = 4;
export const DEFAULT_BAY_COUNT = 10;

// Upload Limits
export const MAX_FILE_SIZE_MB = 10;
export const MAX_PHOTO_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Cache Configuration
export const CACHE_TTL = 300000; // 5 minutes
export const MAX_CACHE_SIZE = 100;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_FULL: 'MMMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  TIME_12H: 'hh:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

// Heatmap Configuration
export const HEATMAP = {
  CELL_SIZE: 40,
  MIN_CELL_SIZE: 30,
  MAX_CELL_SIZE: 60,
} as const;

// Search Configuration
export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_CHARACTERS = 2;

// Feature Flags
export const FEATURES = {
  ANALYTICS: true,
  HEATMAPS: true,
  NOTIFICATIONS: true,
  OFFLINE_MODE: true,
  BIOMETRICS: false,
  PHOTO_UPLOAD: true,
  EXPORT: true,
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  PEST_ALERT: 'pest_alert',
  DISEASE_WARNING: 'disease_warning',
  SESSION_COMPLETED: 'session_completed',
  REPORT_READY: 'report_ready',
  SYSTEM_UPDATE: 'system_update',
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 220,
  ANIMATION_DURATION: 300,
  COLORS: [
    '#3498db',
    '#2ecc71',
    '#f39c12',
    '#e74c3c',
    '#9b59b6',
    '#1abc9c',
  ],
} as const;