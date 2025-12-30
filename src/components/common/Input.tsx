// src/components/Input.tsx

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  disabled = false,
  required = false,
  secureTextEntry,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = !!error;
  const isSecure = secureTextEntry && !isPasswordVisible;

  const getBorderColor = () => {
    if (hasError) return colors.error || '#DC2626';
    if (isFocused) return colors.primary;
    return colors.border;
  };

  const finalRightIcon = secureTextEntry
    ? (isPasswordVisible ? 'eye-off' : 'eye')
    : rightIcon;

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          isFocused && styles.inputContainerFocused,
          disabled && styles.inputContainerDisabled,
          hasError && styles.inputContainerError,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={hasError ? colors.error : colors.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          {...textInputProps}
          secureTextEntry={isSecure}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            disabled && styles.inputDisabled,
            textInputProps.style,
          ]}
          placeholderTextColor={colors.textSecondary}
        />

        {(finalRightIcon || secureTextEntry) && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            disabled={!secureTextEntry && !onRightIconPress}
            style={styles.rightIconContainer}
            activeOpacity={0.7}
          >
            <Ionicons
              name={finalRightIcon!}
              size={20}
              color={hasError ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {(error || helperText) && (
        <View style={styles.messageContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle"
                size={14}
                color={colors.error}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelContainer: {
    marginBottom: spacing.xs,
  },
  label: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '500',
  },
  required: {
    color: colors.error || '#DC2626',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderWidth: 2,
  },
  inputContainerDisabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  inputContainerError: {
    borderColor: colors.error || '#DC2626',
  },
  input: {
    flex: 1,
    ...typograph.body,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  inputDisabled: {
    color: colors.textSecondary,
  },
  leftIcon: {
    marginLeft: spacing.md,
  },
  rightIconContainer: {
    padding: spacing.sm,
    marginRight: spacing.xs,
  },
  messageContainer: {
    marginTop: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: spacing.xs,
  },
  errorText: {
    ...typograph.caption,
    color: colors.error || '#DC2626',
    flex: 1,
  },
  helperText: {
    ...typograph.caption,
    color: colors.textSecondary,
  },
});