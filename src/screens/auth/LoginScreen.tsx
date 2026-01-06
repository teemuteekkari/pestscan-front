// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors, spacing, typograph } from '../../theme/theme';
import { useAuth } from '../../store/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await login({ 
        email: email.toLowerCase().trim(), 
        password: password
      });
      
      // Navigation is handled by AppNavigator based on auth state
      // No need to navigate manually
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errorCode ||
                          'Invalid email or password';
      
      setErrors({ password: errorMessage });
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Coming Soon', 'Password reset functionality will be available soon');
    // TODO: Implement when backend has forgot password endpoint
    // navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    Alert.alert('Coming Soon', 'Registration will be available soon');
    // TODO: Uncomment when Register screen is ready
    // navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>🌱</Text>
            </View>
            <Text style={styles.appName}>PestScout</Text>
            <Text style={styles.tagline}>Agricultural Pest Management</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon="mail"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
              leftIcon="lock-closed"
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordButton}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              icon="log-in"
              fullWidth
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Create Account"
              onPress={handleRegister}
              variant="outline"
              icon="person-add"
              fullWidth
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    ...typograph.h2,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typograph.body,
    color: colors.textSecondary,
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  title: {
    ...typograph.h3,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typograph.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    ...typograph.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...typograph.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default LoginScreen;