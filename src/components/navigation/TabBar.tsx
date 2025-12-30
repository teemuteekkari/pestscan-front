// src/components/navigation/TabBar.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typograph, shadows } from '../../theme/theme';

interface TabBarRoute {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
}

const tabBarRoutes: Record<string, Omit<TabBarRoute, 'name'>> = {
  Dashboard: {
    icon: 'home',
    label: 'Home',
  },
  Sessions: {
    icon: 'search',
    label: 'Sessions',
  },
  Scan: {
    icon: 'add-circle',
    label: 'Scan',
  },
  Analytics: {
    icon: 'stats-chart',
    label: 'Analytics',
  },
  More: {
    icon: 'menu',
    label: 'More',
  },
};

export const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        shadows.lg,
        {
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const tabConfig = tabBarRoutes[route.name] || {
          icon: 'help-circle' as keyof typeof Ionicons.glyphMap,
          label: route.name,
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Check if this is the center "Scan" button
        const isCenterButton = route.name === 'Scan';

        if (isCenterButton) {
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.centerButtonContainer}
              activeOpacity={0.7}
            >
              <View style={styles.centerButton}>
                <Ionicons
                  name={tabConfig.icon}
                  size={32}
                  color={colors.surface}
                />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name={tabConfig.icon}
                size={24}
                color={isFocused ? colors.primary : colors.textSecondary}
              />
              {tabConfig.badge !== undefined && tabConfig.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {tabConfig.badge > 9 ? '9+' : tabConfig.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                isFocused && styles.labelActive,
              ]}
              numberOfLines={1}
            >
              {tabConfig.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  tabContent: {
    position: 'relative',
    marginBottom: spacing.xs / 2,
  },
  label: {
    ...typograph.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs / 2,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 9,
    fontWeight: '700',
  },
  centerButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -spacing.xl,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
    elevation: 8,
  },
});