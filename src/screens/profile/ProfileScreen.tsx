// src/screens/profile/ProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card, Avatar, Badge } from '../../components/common';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { UserDto, Role } from '../../types/api.types';
import { ROLE_LABELS } from '../../constants/roles';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await userService.getCurrentUser();
      // setUser(data);

      // Mock data
      setTimeout(() => {
        setUser({
          id: 'user-1',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+1 503 555 0100',
          role: Role.FARM_ADMIN,
          isEnabled: true,
          farmId: 'farm-1',
          lastLogin: '2024-11-23T10:30:00Z',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-11-20T14:30:00Z',
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Failed to load user profile:', error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement logout
            // await authService.logout();
            // navigation.replace('Login');
            console.log('Logout');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person' as const,
      label: 'Edit Profile',
      onPress: handleEditProfile,
      showChevron: true,
    },
    {
      icon: 'notifications' as const,
      label: 'Notifications',
      onPress: handleNotifications,
      showChevron: true,
      badge: 3,
    },
    {
      icon: 'settings' as const,
      label: 'Settings',
      onPress: handleSettings,
      showChevron: true,
    },
    {
      icon: 'help-circle' as const,
      label: 'Help & Support',
      onPress: () => console.log('Help'),
      showChevron: true,
    },
    {
      icon: 'document-text' as const,
      label: 'Terms & Privacy',
      onPress: () => console.log('Terms'),
      showChevron: true,
    },
    {
      icon: 'information-circle' as const,
      label: 'About',
      onPress: () => console.log('About'),
      showChevron: true,
    },
  ];

  if (loading || !user) {
    return (
      <Screen title="Profile">
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Profile" scroll padding="md">
      {/* Profile Header */}
      <Card padding="lg" style={styles.headerCard}>
        <View style={styles.profileHeader}>
          <Avatar
            name={`${user.firstName} ${user.lastName}`}
            size="xl"
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Badge
              label={ROLE_LABELS[user.role]}
              variant="info"
              icon="shield-checkmark"
              style={styles.roleBadge}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Ionicons name="create" size={20} color={colors.primary} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </Card>

      {/* Account Information */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="mail" size={20} color={colors.textSecondary} />
            <Text style={styles.infoLabelText}>Email</Text>
          </View>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>

        <Divider marginVertical="sm" />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="call" size={20} color={colors.textSecondary} />
            <Text style={styles.infoLabelText}>Phone</Text>
          </View>
          <Text style={styles.infoValue}>{user.phoneNumber}</Text>
        </View>

        <Divider marginVertical="sm" />

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="shield-checkmark" size={20} color={colors.textSecondary} />
            <Text style={styles.infoLabelText}>Role</Text>
          </View>
          <Text style={styles.infoValue}>{ROLE_LABELS[user.role]}</Text>
        </View>

        {user.lastLogin && (
          <>
            <Divider marginVertical="sm" />
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="time" size={20} color={colors.textSecondary} />
                <Text style={styles.infoLabelText}>Last Login</Text>
              </View>
              <Text style={styles.infoValue}>
                {new Date(user.lastLogin).toLocaleDateString()}
              </Text>
            </View>
          </>
        )}
      </Card>

      {/* Menu Items */}
      <Card padding="md">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={colors.textSecondary} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
                {item.showChevron && (
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                )}
              </View>
            </TouchableOpacity>
            {index < menuItems.length - 1 && (
              <Divider style={styles.menuDivider} />
            )}
          </React.Fragment>
        ))}
      </Card>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out" size={24} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>PestScan v1.0.0</Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  headerCard: {
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  userName: {
    ...typograph.h3,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typograph.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    marginTop: spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}15`,
  },
  editButtonText: {
    ...typograph.body,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoLabelText: {
    ...typograph.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  menuItemText: {
    ...typograph.body,
    color: colors.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuBadge: {
    backgroundColor: colors.error,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  menuBadgeText: {
    ...typograph.caption,
    color: colors.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  menuDivider: {
    marginLeft: spacing.md + 24 + spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.error}10`,
  },
  logoutText: {
    ...typograph.body,
    color: colors.error,
    fontWeight: '600',
  },
  versionText: {
    ...typograph.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
export default ProfileScreen;