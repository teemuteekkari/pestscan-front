// src/components/navigation/NavigationHeader.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typograph, shadows } from '../../theme/theme';

interface NavigationHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  rightActions?: Array<{
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    badge?: number;
  }>;
  transparent?: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  onMenuPress,
  rightActions,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        transparent ? styles.transparent : styles.solid,
        { paddingTop: insets.top + spacing.sm },
      ]}
    >
      <View style={styles.content}>
        {/* Left Action */}
        <View style={styles.leftAction}>
          {onBackPress && (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          {onMenuPress && (
            <TouchableOpacity
              onPress={onMenuPress}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          {rightActions?.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons name={action.icon} size={24} color={colors.text} />
              {action.badge !== undefined && action.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {action.badge > 9 ? '9+' : action.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  solid: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftAction: {
    width: 40,
  },
  actionButton: {
    padding: spacing.xs,
    position: 'relative',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...typograph.h4,
    color: colors.text,
    fontWeight: '600',
  },
  subtitle: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  rightActions: {
    flexDirection: 'row',
    width: 40,
    justifyContent: 'flex-end',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: '700',
  },
});