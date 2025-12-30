// src/components/common/ErrorMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typograph } from '../../theme/theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View style={errorStyles.container}>
      <Ionicons name="alert-circle" size={48} color={colors.error} />
      <Text style={errorStyles.message}>{message}</Text>
      {onRetry && (
        <Button mode="contained" onPress={onRetry} style={errorStyles.button}>
          Try Again
        </Button>
      )}
    </View>
  );
};

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  message: {
    ...typograph.body,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.md,
  },
});