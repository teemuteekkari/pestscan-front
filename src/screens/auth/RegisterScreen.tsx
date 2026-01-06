// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors, spacing, typograph } from '../../theme/theme';
import { Role } from '../../types/api.types';
import { authService } from '../../services/auth.service';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      
      // Call register API
      await authService.register({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        role: Role.SCOUT, // Default role for new registrations
      });

      // Show success message
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please log in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errorCode ||
                          'Registration failed. Please try again.';
      
      // Check for specific errors
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: 'Email already registered' });
      } else {
        Alert.alert('Registration Failed', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join PestScout today</Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <View style={styles.nameRow}>
            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(value) => updateField('firstName', value)}
              placeholder="John"
              error={errors.firstName}
              containerStyle={styles.nameInput}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => updateField('lastName', value)}
              placeholder="Doe"
              error={errors.lastName}
              containerStyle={styles.nameInput}
              required
            />
          </View>

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon="mail"
            required
          />

          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => updateField('phoneNumber', value)}
            placeholder="+1 234 567 8900"
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            leftIcon="call"
            required
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            placeholder="Minimum 8 characters"
            secureTextEntry
            error={errors.password}
            leftIcon="lock-closed"
            helperText="Must contain uppercase, lowercase, and number"
            required
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            placeholder="Re-enter your password"
            secureTextEntry
            error={errors.confirmPassword}
            leftIcon="lock-closed"
            required
          />

          {/* Terms and Conditions */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {
              setAgreedToTerms(!agreedToTerms);
              if (errors.terms) setErrors({ ...errors, terms: '' });
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={agreedToTerms ? 'checkbox' : 'square-outline'}
              size={24}
              color={agreedToTerms ? colors.primary : colors.textSecondary}
            />
            <Text style={styles.checkboxText}>
              I agree to the{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && (
            <Text style={styles.errorText}>{errors.terms}</Text>
          )}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            icon="person-add"
            fullWidth
            style={styles.registerButton}
          />

          {/* Login Link */}
          <View style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
              <Text style={styles.loginLinkButton}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typograph.h2,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typograph.body,
    color: colors.textSecondary,
  },
  formSection: {
    marginTop: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  nameInput: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  checkboxText: {
    ...typograph.bodySmall,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    ...typograph.caption,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  registerButton: {
    marginTop: spacing.lg,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginLinkText: {
    ...typograph.body,
    color: colors.textSecondary,
  },
  loginLinkButton: {
    ...typograph.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;