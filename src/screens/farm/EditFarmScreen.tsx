// src/screens/farm/EditFarmScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { FarmForm } from '../../components/forms/FarmForm';
import { UpdateFarmRequest, FarmResponse } from '../../types/api.types';
import { farmService } from '../../services/farm.service';
import { DashboardStackParamList } from '../../navigation/DashboardNavigator';
import { colors, spacing } from '../../theme/theme';

type Props = NativeStackScreenProps<DashboardStackParamList, 'EditFarm'>;

export const EditFarmScreen: React.FC<Props> = ({ navigation, route }) => {
  const { farmId } = route.params;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [farmData, setFarmData] = useState<FarmResponse | null>(null);

  useEffect(() => {
    loadFarmData();
  }, [farmId]);

  const loadFarmData = async () => {
    try {
      setInitialLoading(true);
      const data = await farmService.getFarm(farmId);
      setFarmData(data);
    } catch (error) {
      console.error('Failed to load farm data:', error);
      Alert.alert('Error', 'Failed to load farm data', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateFarmRequest) => {
    try {
      setLoading(true);
      
      // Call the API to update farm
      const response = await farmService.updateFarm(farmId, data);
      
      Alert.alert(
        'Success',
        'Farm updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to farm detail with updated data
              navigation.navigate('FarmDetail', { farmId: response.id });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Failed to update farm:', error);
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errorCode ||
                          'Failed to update farm. Please try again.';
      
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

  if (initialLoading) {
    return (
      <Screen title="Edit Farm" showBack onBackPress={() => navigation.goBack()}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!farmData) {
    return (
      <Screen title="Edit Farm" showBack onBackPress={() => navigation.goBack()}>
        <View style={styles.loadingContainer}>
          <Text>Farm not found</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      title="Edit Farm"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      <FarmForm
        initialData={farmData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});

export default EditFarmScreen;