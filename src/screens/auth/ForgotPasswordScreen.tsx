// src/screens/auth/ForgotPasswordScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      // TODO: Implement API call
      // await authService.forgotPassword(email.toLowerCase());
      
      // Mock API call
      setTimeout(() => {
        setLoading(false);
        setEmailSent(true);
      }, 1500);
    } catch (error) {
      setLoading(false);
      setError('Failed to send reset email. Please try again.');
      console.error('Forgot password failed:', error);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    handleResetPassword();
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={handleBackToLogin}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.successContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail" size={64} color={colors.primary} />
            </View>
            
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We've sent password reset instructions to:
            </Text>
            <Text style={styles.emailText}>{email}</Text>
            
            <Text style={styles.instructionText}>
              Please check your inbox and follow the link to reset your password.
            </Text>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color={colors.info} />
              <Text style={styles.infoText}>
                The link will expire in 24 hours. If you don't see the email, check your spam folder.
              </Text>
            </View>

            <Button
              title="Back to Login"
              onPress={handleBackToLogin}
              icon="log-in"
              fullWidth
              style={styles.actionButton}
            />

            <TouchableOpacity
              onPress={handleResendEmail}
              style={styles.resendButton}
              activeOpacity={0.7}
            >
              <Text style={styles.resendText}>Didn't receive the email? </Text>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={handleBackToLogin}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={48} color={colors.primary} />
          </View>

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries! Enter your email address and we'll send you instructions to reset your password.
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
            leftIcon="mail"
            required
          />

          <Button
            title="Send Reset Link"
            onPress={handleResetPassword}
            loading={loading}
            disabled={loading}
            icon="send"
            fullWidth
            style={styles.submitButton}
          />

          <TouchableOpacity
            onPress={handleBackToLogin}
            style={styles.backToLoginButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={16} color={colors.primary} />
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            Need help? Contact support at{' '}
            <Text style={styles.helpLink}>support@pestscan.com</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typograph.h2,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  backToLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  backToLoginText: {
    ...typograph.body,
    color: colors.primary,
    fontWeight: '600',
  },
  helpSection: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  helpText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  helpLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    ...typograph.h2,
    color: colors.text,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  successMessage: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emailText: {
    ...typograph.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  instructionText: {
    ...typograph.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${colors.info}15`,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  infoText: {
    ...typograph.bodySmall,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  actionButton: {
    marginBottom: spacing.lg,
  },
  resendButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
  },
  resendLink: {
    ...typograph.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
});
export default ForgotPasswordScreen;