// src/screens/profile/SettingsScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    darkMode: false,
    autoSync: true,
    offlineMode: false,
    biometricAuth: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the cache? This will remove all locally stored data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement cache clearing
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              notifications: true,
              emailNotifications: true,
              pushNotifications: true,
              soundEnabled: true,
              vibrationEnabled: true,
              darkMode: false,
              autoSync: true,
              offlineMode: false,
              biometricAuth: false,
            });
            Alert.alert('Success', 'Settings reset to default');
          },
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    label,
    value,
    onToggle,
    description,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: boolean;
    onToggle: () => void;
    description?: string;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.textSecondary} />
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>{label}</Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: `${colors.primary}80` }}
        thumbColor={value ? colors.primary : colors.surface}
      />
    </View>
  );

  return (
    <Screen
      title="Settings"
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
    >
      {/* Notifications */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem
          icon="notifications"
          label="Enable Notifications"
          value={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
          description="Receive alerts about pest activity"
        />
        <Divider marginVertical="sm" />
        <SettingItem
          icon="mail"
          label="Email Notifications"
          value={settings.emailNotifications}
          onToggle={() => toggleSetting('emailNotifications')}
        />
        <Divider marginVertical="sm" />
        <SettingItem
          icon="phone-portrait"
          label="Push Notifications"
          value={settings.pushNotifications}
          onToggle={() => toggleSetting('pushNotifications')}
        />
        <Divider marginVertical="sm" />
        <SettingItem
          icon="volume-high"
          label="Sound"
          value={settings.soundEnabled}
          onToggle={() => toggleSetting('soundEnabled')}
        />
        <Divider marginVertical="sm" />
        <SettingItem
          icon="phone-portrait"
          label="Vibration"
          value={settings.vibrationEnabled}
          onToggle={() => toggleSetting('vibrationEnabled')}
        />
      </Card>

      {/* Appearance */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Appearance</Text>
        <SettingItem
          icon="moon"
          label="Dark Mode"
          value={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
          description="Use dark theme"
        />
      </Card>

      {/* Data & Storage */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        <SettingItem
          icon="sync"
          label="Auto Sync"
          value={settings.autoSync}
          onToggle={() => toggleSetting('autoSync')}
          description="Automatically sync data when online"
        />
        <Divider marginVertical="sm" />
        <SettingItem
          icon="cloud-offline"
          label="Offline Mode"
          value={settings.offlineMode}
          onToggle={() => toggleSetting('offlineMode')}
          description="Enable offline data access"
        />
        <Divider marginVertical="sm" />
        <TouchableOpacity
          style={styles.actionItem}
          onPress={handleClearCache}
          activeOpacity={0.7}
        >
          <View style={styles.actionItemLeft}>
            <Ionicons name="trash" size={24} color={colors.textSecondary} />
            <Text style={styles.actionItemText}>Clear Cache</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Card>

      {/* Security */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Security</Text>
        <SettingItem
          icon="finger-print"
          label="Biometric Authentication"
          value={settings.biometricAuth}
          onToggle={() => toggleSetting('biometricAuth')}
          description="Use fingerprint or face ID"
        />
      </Card>

      {/* About */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <Divider marginVertical="sm" />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Build Number</Text>
          <Text style={styles.infoValue}>100</Text>
        </View>
      </Card>

      {/* Reset Settings */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetSettings}
        activeOpacity={0.7}
      >
        <Ionicons name="refresh" size={24} color={colors.error} />
        <Text style={styles.resetButtonText}>Reset Settings</Text>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    ...typograph.body,
    color: colors.text,
  },
  settingDescription: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  actionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  actionItemText: {
    ...typograph.body,
    color: colors.text,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...typograph.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '500',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.error}10`,
  },
  resetButtonText: {
    ...typograph.body,
    color: colors.error,
    fontWeight: '600',
  },
});
export default SettingsScreen;