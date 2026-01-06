// src/screens/farm/CreateFarmScreen.tsx
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { FarmForm } from '../../components/forms/FarmForm';
import { CreateFarmRequest } from '../../types/api.types';
import { farmService } from '../../services/farm.service';
import { DashboardStackParamList } from '../../navigation/DashboardNavigator';

type Props = NativeStackScreenProps<DashboardStackParamList, 'CreateFarm'>;

export const CreateFarmScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: CreateFarmRequest) => {
    try {
      setLoading(true);
      
      // Call the API to create farm
      const response = await farmService.createFarm(data);
      
      Alert.alert(
        'Success',
        'Farm created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to the newly created farm detail
              navigation.replace('FarmDetail', { farmId: response.id });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Failed to create farm:', error);
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errorCode ||
                          'Failed to create farm. Please try again.';
      
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
      title="Create Farm"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      <FarmForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default CreateFarmScreen;