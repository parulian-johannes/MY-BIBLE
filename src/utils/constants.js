// src/utils/constants.js

export const APP_CONFIG = {
    APP_NAME: 'Alkitab Digital',
    VERSION: '1.0.0',
    BASE_URL: 'api.scripture.api.bible',
  };
  
  export const STORAGE_KEYS = {
    SETTINGS: '@settings',
    BOOKMARKS: '@bookmarks',
    HIGHLIGHTS: '@highlights',
    NOTES: '@notes',
    RECENT_READS: '@recent_reads',
    READING_PLAN: '@reading_plan',
  };
  
  export const FONTS = {
    SIZES: {
      small: 14,
      medium: 16,
      large: 18,
      xlarge: 20,
      title: 24,
    },
    FAMILIES: {
      regular: 'System',
      medium: 'System-Medium',
      bold: 'System-Bold',
    },
  };
  
  export const COLORS = {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    info: '#5AC8FA',
    light: '#F2F2F7',
    dark: '#1C1C1E',
    gray: {
      100: '#F2F2F7',
      200: '#E5E5EA',
      300: '#D1D1D6',
      400: '#C7C7CC',
      500: '#AEAEB2',
      600: '#8E8E93',
      700: '#636366',
      800: '#48484A',
      900: '#3A3A3C',
    },
  };
  
  export const THEMES = {
    light: {
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#666666',
      border: '#E5E5EA',
    },
    dark: {
      background: '#000000',
      surface: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#AEAEB2',
      border: '#38383A',
    },
  };