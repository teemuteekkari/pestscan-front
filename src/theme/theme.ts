// src/theme/theme.ts (Updated)

import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors, getSeverityColor, getCategoryColor, getStatusColor } from './colors';
import { spacing, borderRadius, sizes } from './spacing';
import { typograph } from './typograph';
import { shadows, shadowStyles } from './shadows';

export { colors, spacing, borderRadius, sizes, typograph, shadows, shadowStyles };
export { getSeverityColor, getCategoryColor, getStatusColor };

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
  },
  roundness: borderRadius.md,
};

export type Theme = typeof theme;