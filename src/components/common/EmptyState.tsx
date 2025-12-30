// src/components/common/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typograph } from '../../theme/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-outline',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={emptyStyles.container}>
      <Ionicons name={icon} size={80} color={colors.border} />
      <Text style={emptyStyles.title}>{title}</Text>
      <Text style={emptyStyles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} style={emptyStyles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typograph.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
  },
});