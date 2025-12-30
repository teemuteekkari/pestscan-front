// src/components/common/ConfirmDialog.tsx

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';
import { Button } from './Button';

type DialogVariant = 'default' | 'warning' | 'danger';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  variant?: DialogVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  variant = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  icon,
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'warning':
        return {
          color: colors.warning || '#F59E0B',
          icon: icon || 'warning',
          buttonVariant: 'primary' as const,
        };
      case 'danger':
        return {
          color: colors.error || '#DC2626',
          icon: icon || 'alert-circle',
          buttonVariant: 'danger' as const,
        };
      default:
        return {
          color: colors.primary,
          icon: icon || 'help-circle',
          buttonVariant: 'primary' as const,
        };
    }
  };

  const variantConfig = getVariantConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialog, shadows.lg]}>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: `${variantConfig.color}20` },
                  ]}
                >
                  <Ionicons
                    name={variantConfig.icon}
                    size={32}
                    color={variantConfig.color}
                  />
                </View>
              </View>

              <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>

              <View style={styles.actions}>
                <Button
                  title={cancelText}
                  onPress={onCancel}
                  variant="outline"
                  disabled={loading}
                  style={styles.button}
                />
                <Button
                  title={confirmText}
                  onPress={onConfirm}
                  variant={variantConfig.buttonVariant}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, // ✅ Now imported
    width: '100%',
    maxWidth: 400,
    padding: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typograph.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
  },
});