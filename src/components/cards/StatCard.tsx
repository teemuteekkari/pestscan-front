// src/components/cards/StatCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';

type StatCardVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: StatCardVariant;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  onPress?: () => void;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  trend,
  onPress,
  loading = false,
}) => {
  const getVariantColor = (): string => {
    switch (variant) {
      case 'success':
        return colors.success || '#10B981';
      case 'warning':
        return colors.warning || '#F59E0B';
      case 'error':
        return colors.error || '#DC2626';
      case 'info':
        return colors.info || '#3B82F6';
      default:
        return colors.primary;
    }
  };

  const variantColor = getVariantColor();

  const CardContent = (
    <Card style={[styles.card, shadows.sm]}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {icon && (
            <View 
              style={[
                styles.iconContainer,
                { backgroundColor: `${variantColor}20` }
              ]}
            >
              <Ionicons name={icon} size={20} color={variantColor} />
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBar} />
          </View>
        ) : (
          <>
            <Text style={[styles.value, { color: variantColor }]}>
              {value}
            </Text>

            {(subtitle || trend) && (
              <View style={styles.footer}>
                {subtitle && (
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {subtitle}
                  </Text>
                )}
                {trend && (
                  <View style={styles.trendContainer}>
                    <Ionicons
                      name={trend.isPositive !== false ? 'trending-up' : 'trending-down'}
                      size={14}
                      color={trend.isPositive !== false ? colors.success : colors.error}
                    />
                    <Text
                      style={[
                        styles.trendText,
                        {
                          color: trend.isPositive !== false ? colors.success : colors.error,
                        },
                      ]}
                    >
                      {trend.value > 0 ? '+' : ''}{trend.value}%
                      {trend.label && ` ${trend.label}`}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </Card.Content>
    </Card>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.touchable}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  value: {
    ...typograph.h2,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  subtitle: {
    ...typograph.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trendText: {
    ...typograph.caption,
    fontWeight: '600',
  },
  loadingContainer: {
    height: 48,
    justifyContent: 'center',
  },
  loadingBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    width: '60%',
  },
});

// Grid container component for laying out multiple stat cards
interface StatCardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export const StatCardGrid: React.FC<StatCardGridProps> = ({ 
  children, 
  columns = 2 
}) => {
  return (
    <View style={[gridStyles.container, { gap: spacing.md }]}>
      {React.Children.map(children, (child) => (
        <View style={[gridStyles.item, { width: `${100 / columns - 2}%` }]}>
          {child}
        </View>
      ))}
    </View>
  );
};

const gridStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    minWidth: 0,
  },
});