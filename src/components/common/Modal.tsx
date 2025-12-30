// src/components/Modal.tsx

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ModalSize = 'sm' | 'md' | 'lg' | 'full';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  scrollable?: boolean;
  closableByBackdrop?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
  scrollable = true,
  closableByBackdrop = true,
}) => {
  const insets = useSafeAreaInsets();

  const getMaxWidth = () => {
    switch (size) {
      case 'sm':
        return 400;
      case 'lg':
        return 800;
      case 'full':
        return '100%';
      default:
        return 600;
    }
  };

  const getMaxHeight = () => {
    if (size === 'full') return '100%';
    return '90%';
  };

  const handleBackdropPress = () => {
    if (closableByBackdrop) {
      onClose();
    }
  };

  const Content = (
    <View style={styles.content}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {showCloseButton && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.body}>
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>

      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modal,
                  shadows.lg,
                  {
                    maxWidth: getMaxWidth(),
                    maxHeight: getMaxHeight(),
                    marginTop: size === 'full' ? 0 : insets.top,
                    marginBottom: size === 'full' ? 0 : insets.bottom,
                  },
                  size === 'full' && styles.fullModal,
                ]}
              >
                {Content}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    width: '100%',
    overflow: 'hidden',
  },
  fullModal: {
    borderRadius: 0,
    margin: 0,
    maxWidth: '100%',
    maxHeight: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typograph.h3,
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});