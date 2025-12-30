// src/components/navigation/DrawerContent.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../common/Avatar';
import { Divider } from '../layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { Role } from '../../types/api.types';

interface DrawerMenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  badge?: number;
  roles?: Role[];
}

interface DrawerContentProps extends DrawerContentComponentProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    avatar?: string;
  };
  onLogout?: () => void;
}

const drawerMenuItems: DrawerMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'home',
    route: 'Dashboard',
  },
  {
    label: 'Farms',
    icon: 'leaf',
    route: 'Farms',
    roles: [Role.FARM_ADMIN, Role.SUPER_ADMIN],
  },
  {
    label: 'Greenhouses',
    icon: 'business',
    route: 'Greenhouses',
  },
  {
    label: 'Field Blocks',
    icon: 'grid',
    route: 'FieldBlocks',
  },
  {
    label: 'Scouting Sessions',
    icon: 'search',
    route: 'Sessions',
  },
  {
    label: 'Observations',
    icon: 'eye',
    route: 'Observations',
  },
  {
    label: 'Analytics',
    icon: 'stats-chart',
    route: 'Analytics',
  },
  {
    label: 'Heatmaps',
    icon: 'color-palette',
    route: 'Heatmaps',
  },
];

const settingsMenuItems: DrawerMenuItem[] = [
  {
    label: 'Profile',
    icon: 'person',
    route: 'Profile',
  },
  {
    label: 'Settings',
    icon: 'settings',
    route: 'Settings',
  },
  {
    label: 'Help & Support',
    icon: 'help-circle',
    route: 'Support',
  },
];

export const DrawerContent: React.FC<DrawerContentProps> = ({
  navigation,
  state,
  user,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();

  const isRouteActive = (routeName: string): boolean => {
    return state.routeNames[state.index] === routeName;
  };

  const canAccessRoute = (item: DrawerMenuItem): boolean => {
    if (!item.roles || !user) return true;
    return item.roles.includes(user.role);
  };

  const handleNavigation = (routeName: string) => {
    navigation.navigate(routeName as never);
  };

  const getRoleLabel = (role: Role): string => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return 'Super Admin';
      case Role.FARM_ADMIN:
        return 'Farm Admin';
      case Role.MANAGER:
        return 'Manager';
      case Role.SCOUT:
        return 'Scout';
      default:
        return role;
    }
  };

  return (
    <DrawerContentScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* User Profile Section */}
      {user && (
        <View style={[styles.userSection, { paddingTop: insets.top }]}>
          <Avatar
            name={`${user.firstName} ${user.lastName}`}
            size="lg"
            source={user.avatar ? { uri: user.avatar } : undefined}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
              <Text style={styles.roleText}>{getRoleLabel(user.role)}</Text>
            </View>
          </View>
        </View>
      )}

      <Divider marginVertical="md" />

      {/* Main Menu */}
      <View style={styles.menuSection}>
        {drawerMenuItems.filter(canAccessRoute).map((item, index) => {
          const isActive = isRouteActive(item.route);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    isActive && styles.menuItemTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              {item.badge !== undefined && item.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Divider marginVertical="md" />

      {/* Settings Menu */}
      <View style={styles.menuSection}>
        {settingsMenuItems.map((item, index) => {
          const isActive = isRouteActive(item.route);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    isActive && styles.menuItemTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout Button */}
      {onLogout && (
        <>
          <Divider marginVertical="md" />
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out" size={24} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}

      {/* App Version */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Text style={styles.versionText}>PestScan v1.0.0</Text>
      </View>
    </DrawerContentScrollVie