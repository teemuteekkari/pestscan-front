// src/components/Header.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typograph, shadows } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderAction {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label?: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  actions?: HeaderAction[];
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  actions,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={transparent ? 'transparent' : colors.primary}
        translucent={transparent}
      />
      <View
        style={[
          styles.header,
          transparent ? styles.transparent : styles.solid,
          { paddingTop: insets.top + spacing.sm },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.left}>
            {showBack && (
              <TouchableOpacity
                onPress={onBackPress}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={colors.surface} />
              </TouchableOpacity>
            )}
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
          </View>

          {actions && actions.length > 0 && (
            <View style={styles.actions}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                  accessibilityLabel={action.label}
                >
                  <Ionicons
                    name={action.icon}
                    size={24}
                    color={colors.surface}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  solid: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typograph.h3,
    color: colors.surface,
    fontWeight: '600',
  },
  subtitle: {
    ...typograph.bodySmall,
    color: colors.surface,
    opacity: 0.8,
    marginTop: spacing.xs / 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.xs,
  },
});