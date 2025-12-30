// src/components/Badge.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: keyof typeof Ionicons.glyphMap;
  outlined?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  icon,
  outlined = false,
  style,
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'success':
        return {
          background: colors.success || '#10B981',
          text: colors.surface,
        };
      case 'warning':
        return {
          background: colors.warning || '#F59E0B',
          text: colors.surface,
        };
      case 'error':
        return {
          background: colors.error || '#DC2626',
          text: colors.surface,
        };
      case 'info':
        return {
          background: colors.info || '#3B82F6',
          text: colors.surface,
        };
      case 'neutral':
        return {
          background: colors.textSecondary,
          text: colors.surface,
        };
      default:
        return {
          background: colors.primary,
          text: colors.surface,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: spacing.xs,
          paddingVertical: spacing.xs / 2,
          fontSize: 10,
          iconSize: 10,
        };
      case 'lg':
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          fontSize: 14,
          iconSize: 16,
        };
      default:
        return {
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          fontSize: 12,
          iconSize: 12,
        };
    }
  };

  const variantColors = getVariantColors();
  const sizeStyles = getSizeStyles();

  const badgeStyle: ViewStyle = outlined
    ? {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: variantColors.background,
      }
    : {
        backgroundColor: variantColors.background,
      };

  const textColor = outlined ? variantColors.background : variantColors.text;

  return (
    <View
      style={[
        styles.badge,
        badgeStyle,
        {
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={sizeStyles.iconSize}
          color={textColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            fontSize: sizeStyles.fontSize,
            color: textColor,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs / 2,
  },
  label: {
    ...typograph.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});