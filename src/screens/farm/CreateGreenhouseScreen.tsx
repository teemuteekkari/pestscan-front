// src/screens/farm/CreateGreenhouseScreen.tsx
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { GreenhouseForm } from '../../components/forms/GreenhouseForm';
import { CreateGreenhouseRequest } from '../../types/api.types';
import { farmService } from '../../services/farm.service';
import { DashboardStackParamList } from '../../navigation/DashboardNavigator';

type Props = NativeStackScreenProps<DashboardStackParamList, 'CreateGreenhouse'>;

export const CreateGreenhouseScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { farmId } = route.params;
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: CreateGreenhouseRequest) => {
    try {
      setLoading(true);
      
      // Call the API to create greenhouse
      const response = await farmService.createGreenhouse(farmId, data);
      
      Alert.alert(
        'Success',
        'Greenhouse created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Failed to create greenhouse:', error);
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errorCode ||
                          'Failed to create greenhouse. Please try again.';
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? All unsaved changes will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <Screen
      title="Create Greenhouse"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      <GreenhouseForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default CreateGreenhouseScreen;