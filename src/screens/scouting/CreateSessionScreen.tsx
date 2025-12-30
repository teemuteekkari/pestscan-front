// src/screens/scouting/CreateSessionScreen.tsx
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { SessionForm } from '../../components/forms/SessionForm';
import { CreateScoutingSessionRequest } from '../../types/api.types';
import { ScoutingStackParamList } from '../../navigation/ScoutingNavigator';

type Props = NativeStackScreenProps<ScoutingStackParamList, 'CreateSession'>;

export const CreateSessionScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { farmId } = route.params;
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: CreateScoutingSessionRequest) => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const response = await scoutingService.createSession(data);
      
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Success',
          'Scouting session created successfully!',
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
      Alert.alert('Error', 'Failed to create session. Please try again.');
      console.error('Failed to create session:', error);
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
      title="New Scouting Session"
      showBack
      onBackPress={handleCancel}
      scroll
      padding="md"
    >
      <SessionForm
        farmId={farmId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default CreateSessionScreen;