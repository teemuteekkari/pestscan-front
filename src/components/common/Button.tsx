// src/components/Button.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    const isDisabled = disabled || loading;

    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.secondary || colors.textSecondary,
            ...shadows.sm,
          },
          text: { color: colors.surface },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: isDisabled ? colors.border : colors.primary,
          },
          text: { color: isDisabled ? colors.textSecondary : colors.primary },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: { color: isDisabled ? colors.textSecondary : colors.primary },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.error || '#DC2626',
            ...shadows.sm,
          },
          text: { color: colors.surface },
        };
      default: // primary
        return {
          container: {
            backgroundColor: isDisabled ? colors.border : colors.primary,
            ...shadows.sm,
          },
          text: { color: colors.surface },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            minHeight: 36,
          },
          text: { ...typograph.bodySmall },
          iconSize: 16,
        };
      case 'lg':
        return {
          container: {
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            minHeight: 52,
          },
          text: { ...typograph.subtitle },
          iconSize: 24,
        };
      default: // md
        return {
          container: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            minHeight: 44,
          },
          text: { ...typograph.body },
          iconSize: 20,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.text.color}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              sizeStyles.text,
              variantStyles.text,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.text.color}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});