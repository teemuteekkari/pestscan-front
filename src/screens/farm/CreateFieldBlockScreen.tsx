// src/screens/farm/CreateFieldBlockScreen.tsx
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { FieldBlockForm } from '../../components/forms/FieldBlockForm';
import { CreateFieldBlockRequest } from '../../types/api.types';
import { farmService } from '../../services/farm.service';
import { DashboardStackParamList } from '../../navigation/DashboardNavigator';

type Props = NativeStackScreenProps<DashboardStackParamList, 'CreateFieldBlock'>;

export const CreateFieldBlockScreen: React.FC<Props> = ({
  navigation,
  route,
  
}) => {
  const { farmId } = route.params;
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: CreateFieldBlockRequest) => {
    try {
      setLoading(true);
      
      // Call the API to create field block
      const response = await farmService.createFieldBlock(farmId, data);
      
      Alert.alert(
        'Success',
        'Field block created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Failed to create field block:', error);
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errorCode ||
                          'Failed to create field block. Please try again.';
      
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
      title="Create Field Block"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      <FieldBlockForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default CreateFieldBlockScreen;