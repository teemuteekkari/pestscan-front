/** @jsxImportSource react */
import React from 'react';
import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { colors } from '../theme/colors';

export const toastConfig = {
  success: (props: any) => {
    return React.createElement(BaseToast, {
      ...props,
      style: {
        borderLeftColor: colors.success,
        backgroundColor: colors.surface,
      },
      contentContainerStyle: { paddingHorizontal: 15 },
      text1Style: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
      },
      text2Style: {
        fontSize: 14,
        color: colors.textSecondary,
      },
    });
  },
  
  error: (props: any) => {
    return React.createElement(ErrorToast, {
      ...props,
      style: {
        borderLeftColor: colors.error,
        backgroundColor: colors.surface,
      },
      contentContainerStyle: { paddingHorizontal: 15 },
      text1Style: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
      },
      text2Style: {
        fontSize: 14,
        color: colors.textSecondary,
      },
    });
  },
  
  info: (props: any) => {
    return React.createElement(InfoToast, {
      ...props,
      style: {
        borderLeftColor: colors.info,
        backgroundColor: colors.surface,
      },
      contentContainerStyle: { paddingHorizontal: 15 },
      text1Style: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
      },
      text2Style: {
        fontSize: 14,
        color: colors.textSecondary,
      },
    });
  },
  
  warning: (props: any) => {
    return React.createElement(BaseToast, {
      ...props,
      style: {
        borderLeftColor: colors.warning,
        backgroundColor: colors.surface,
      },
      contentContainerStyle: { paddingHorizontal: 15 },
      text1Style: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
      },
      text2Style: {
        fontSize: 14,
        color: colors.textSecondary,
      },
    });
  },
};

export const showSuccessToast = (title: string, message?: string): void => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
  });
};

export const showErrorToast = (title: string, message?: string): void => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
  });
};

export const showInfoToast = (title: string, message?: string): void => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
  });
};

export const showWarningToast = (title: string, message?: string): void => {
  Toast.show({
    type: 'warning',
    text1: title,
    text2: message,
  });
};