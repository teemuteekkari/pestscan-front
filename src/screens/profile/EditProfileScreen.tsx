// src/screens/profile/EditProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Input, Button, Avatar, Card } from '../../components/common';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { UserDto } from '../../types/api.types';

interface EditProfileScreenProps {
  navigation: any;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // TODO: Implement API call
      // const data = await userService.getCurrentUser();
      
      // Mock data
      setTimeout(() => {
        setFormData({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+1 503 555 0100',
        });
      }, 500);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      // TODO: Implement API call
      // await userService.updateProfile(formData);

      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Success',
          'Profile updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Failed to update profile:', error);
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => console.log('Take photo') },
        { text: 'Choose from Library', onPress: () => console.log('Choose photo') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <Screen
      title="Edit Profile"
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
    >
      {/* Avatar Section */}
      <Card padding="lg" style={styles.avatarCard}>
        <Avatar
          name={`${formData.firstName} ${formData.lastName}`}
          size="xl"
        />
        <TouchableOpacity
          style={styles.changePhotoButton}
          onPress={handleChangePhoto}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" size={20} color={colors.primary} />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </Card>

      {/* Personal Information */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Personal Information</Text>

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
      </Card>

      {/* Security */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Security</Text>
        <TouchableOpacity
          style={styles.securityItem}
          onPress={handleChangePassword}
          activeOpacity={0.7}
        >
          <View style={styles.securityItemLeft}>
            <Ionicons name="lock-closed" size={24} color={colors.textSecondary} />
            <Text style={styles.securityItemText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Card>

      {/* Save Button */}
      <Button
        title="Save Changes"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        icon="checkmark"
        fullWidth
        style={styles.saveButton}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  avatarCard: {
    alignItems: 'center',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}15`,
  },
  changePhotoText: {
    ...typograph.body,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  nameInput: {
    flex: 1,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  securityItemText: {
    ...typograph.body,
    color: colors.text,
  },
  saveButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});