// src/components/forms/SessionForm.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { 
  CreateScoutingSessionRequest, 
  SessionTargetRequest,
  ScoutingSessionDetailDto 
} from '../../types/api.types';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface SessionFormProps {
  farmId: string;
  initialData?: Partial<ScoutingSessionDetailDto>;
  onSubmit: (data: CreateScoutingSessionRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const SessionForm: React.FC<SessionFormProps> = ({
  farmId,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    sessionDate: initialData?.sessionDate || new Date().toISOString().split('T')[0],
    weekNumber: initialData?.weekNumber?.toString() || '',
    crop: initialData?.crop || '',
    variety: initialData?.variety || '',
    temperatureCelsius: initialData?.temperatureCelsius?.toString() || '',
    relativeHumidityPercent: initialData?.relativeHumidityPercent?.toString() || '',
    observationTime: initialData?.observationTime || '',
    weatherNotes: initialData?.weatherNotes || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.sessionDate) {
      newErrors.sessionDate = 'Session date is required';
    }

    if (formData.weekNumber && (isNaN(Number(formData.weekNumber)) || Number(formData.weekNumber) < 1 || Number(formData.weekNumber) > 53)) {
      newErrors.weekNumber = 'Week number must be between 1 and 53';
    }

    if (formData.temperatureCelsius && isNaN(Number(formData.temperatureCelsius))) {
      newErrors.temperatureCelsius = 'Must be a valid number';
    }

    if (formData.relativeHumidityPercent) {
      const humidity = Number(formData.relativeHumidityPercent);
      if (isNaN(humidity) || humidity < 0 || humidity > 100) {
        newErrors.relativeHumidityPercent = 'Must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Note: targets should be selected/added separately in the actual implementation
    // This is a simplified version
    const submitData: CreateScoutingSessionRequest = {
      farmId,
      targets: [], // This should be populated with selected greenhouses/field blocks
      sessionDate: formData.sessionDate,
      weekNumber: formData.weekNumber ? Number(formData.weekNumber) : undefined,
      crop: formData.crop.trim() || undefined,
      variety: formData.variety.trim() || undefined,
      temperatureCelsius: formData.temperatureCelsius ? Number(formData.temperatureCelsius) : undefined,
      relativeHumidityPercent: formData.relativeHumidityPercent ? Number(formData.relativeHumidityPercent) : undefined,
      observationTime: formData.observationTime.trim() || undefined,
      weatherNotes: formData.weatherNotes.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    onSubmit(submitData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Input
          label="Session Date"
          value={formData.sessionDate}
          onChangeText={(value) => updateField('sessionDate', value)}
          placeholder="YYYY-MM-DD"
          error={errors.sessionDate}
          leftIcon="calendar"
          required
        />

        <Input
          label="Week Number"
          value={formData.weekNumber}
          onChangeText={(value) => updateField('weekNumber', value)}
          placeholder="1-53"
          keyboardType="number-pad"
          error={errors.weekNumber}
          leftIcon="today"
          helperText="Optional: Week number of the year"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Input
            label="Crop"
            value={formData.crop}
            onChangeText={(value) => updateField('crop', value)}
            placeholder="e.g., Tomatoes"
            leftIcon="leaf"
            containerStyle={styles.halfWidth}
          />

          <Input
            label="Variety"
            value={formData.variety}
            onChangeText={(value) => updateField('variety', value)}
            placeholder="e.g., Roma"
            containerStyle={styles.halfWidth}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environmental Conditions</Text>
        
        <View style={styles.row}>
          <Input
            label="Temperature (°C)"
            value={formData.temperatureCelsius}
            onChangeText={(value) => updateField('temperatureCelsius', value)}
            placeholder="0.0"
            keyboardType="decimal-pad"
            error={errors.temperatureCelsius}
            leftIcon="thermometer"
            containerStyle={styles.halfWidth}
          />

          <Input
            label="Humidity (%)"
            value={formData.relativeHumidityPercent}
            onChangeText={(value) => updateField('relativeHumidityPercent', value)}
            placeholder="0-100"
            keyboardType="decimal-pad"
            error={errors.relativeHumidityPercent}
            leftIcon="water"
            containerStyle={styles.halfWidth}
          />
        </View>

        <Input
          label="Observation Time"
          value={formData.observationTime}
          onChangeText={(value) => updateField('observationTime', value)}
          placeholder="e.g., 09:00 AM"
          leftIcon="time"
        />

        <Input
          label="Weather Notes"
          value={formData.weatherNotes}
          onChangeText={(value) => updateField('weatherNotes', value)}
          placeholder="Describe weather conditions..."
          multiline
          numberOfLines={3}
          leftIcon="cloud"
        />
      </View>

      <View style={styles.section}>
        <Input
          label="Session Notes"
          value={formData.notes}
          onChangeText={(value) => updateField('notes', value)}
          placeholder="Add any additional session notes..."
          multiline
          numberOfLines={4}
          leftIcon="document-text"
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={colors.info} />
        <Text style={styles.infoText}>
          After creating the session, you'll be able to select target greenhouses/field blocks and add observations.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          disabled={loading}
          style={styles.button}
        />
        <Button
          title={initialData ? 'Update Session' : 'Create Session'}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typograph.subtitle,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${colors.info}15`,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoText: {
    ...typograph.bodySmall,
    color: colors.text,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  button: {
    flex: 1,
  },
});