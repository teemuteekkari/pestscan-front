// src/components/forms/ObservationForm.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { 
  UpsertObservationRequest, 
  SpeciesCode, 
  ObservationCategory,
  ScoutingObservationDto 
} from '../../types/api.types';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { Picker } from '@react-native-picker/picker';

interface ObservationFormProps {
  sessionId: string;
  sessionTargetId: string;
  initialData?: Partial<ScoutingObservationDto>;
  onSubmit: (data: UpsertObservationRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ObservationForm: React.FC<ObservationFormProps> = ({
  sessionId,
  sessionTargetId,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    speciesCode: initialData?.speciesCode || SpeciesCode.THRIPS,
    bayIndex: initialData?.bayIndex?.toString() || '0',
    bayTag: initialData?.bayTag || '',
    benchIndex: initialData?.benchIndex?.toString() || '0',
    benchTag: initialData?.benchTag || '',
    spotIndex: initialData?.spotIndex?.toString() || '0',
    count: initialData?.count?.toString() || '0',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const speciesByCategory: Record<ObservationCategory, SpeciesCode[]> = {
    [ObservationCategory.PEST]: [
      SpeciesCode.THRIPS,
      SpeciesCode.RED_SPIDER_MITE,
      SpeciesCode.WHITEFLIES,
      SpeciesCode.MEALYBUGS,
      SpeciesCode.CATERPILLARS,
      SpeciesCode.FALSE_CODLING_MOTH,
      SpeciesCode.PEST_OTHER,
    ],
    [ObservationCategory.DISEASE]: [
      SpeciesCode.DOWNY_MILDEW,
      SpeciesCode.POWDERY_MILDEW,
      SpeciesCode.BOTRYTIS,
      SpeciesCode.VERTICILLIUM,
      SpeciesCode.BACTERIAL_WILT,
      SpeciesCode.DISEASE_OTHER,
    ],
    [ObservationCategory.BENEFICIAL]: [
      SpeciesCode.BENEFICIAL_PP,
    ],
  };

  const getCategory = (species: SpeciesCode): ObservationCategory => {
    for (const [category, codes] of Object.entries(speciesByCategory)) {
      if (codes.includes(species)) {
        return category as ObservationCategory;
      }
    }
    return ObservationCategory.PEST;
  };

  const formatSpeciesLabel = (code: SpeciesCode): string => {
    return code.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const updateField = (field: string, value: string | SpeciesCode) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (isNaN(Number(formData.bayIndex)) || Number(formData.bayIndex) < 0) {
      newErrors.bayIndex = 'Invalid bay index';
    }

    if (isNaN(Number(formData.benchIndex)) || Number(formData.benchIndex) < 0) {
      newErrors.benchIndex = 'Invalid bench index';
    }

    if (isNaN(Number(formData.spotIndex)) || Number(formData.spotIndex) < 0) {
      newErrors.spotIndex = 'Invalid spot index';
    }

    if (isNaN(Number(formData.count)) || Number(formData.count) < 0) {
      newErrors.count = 'Count must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData: UpsertObservationRequest = {
      sessionId,
      sessionTargetId,
      speciesCode: formData.speciesCode,
      bayIndex: Number(formData.bayIndex),
      bayTag: formData.bayTag.trim() || undefined,
      benchIndex: Number(formData.benchIndex),
      benchTag: formData.benchTag.trim() || undefined,
      spotIndex: Number(formData.spotIndex),
      count: Number(formData.count),
      notes: formData.notes.trim() || undefined,
      version: initialData?.version,
    };

    onSubmit(submitData);
  };

  const currentCategory = getCategory(formData.speciesCode);
  const categoryColor = currentCategory === ObservationCategory.PEST 
    ? colors.error 
    : currentCategory === ObservationCategory.DISEASE 
    ? colors.warning 
    : colors.success;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.label}>Species / Organism *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.speciesCode}
            onValueChange={(value) => updateField('speciesCode', value)}
            style={styles.picker}
          >
            {Object.entries(speciesByCategory).map(([category, codes]) => (
              <Picker.Item
                key={category}
                label={`--- ${category} ---`}
                value=""
                enabled={false}
              />
            )).concat(
              Object.entries(speciesByCategory).flatMap(([_, codes]) =>
                codes.map(code => (
                  <Picker.Item
                    key={code}
                    label={formatSpeciesLabel(code)}
                    value={code}
                  />
                ))
              )
            )}
          </Picker>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {currentCategory}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Input
            label="Bay Index"
            value={formData.bayIndex}
            onChangeText={(value) => updateField('bayIndex', value)}
            placeholder="0"
            keyboardType="number-pad"
            error={errors.bayIndex}
            containerStyle={styles.halfWidth}
            required
          />

          <Input
            label="Bay Tag"
            value={formData.bayTag}
            onChangeText={(value) => updateField('bayTag', value)}
            placeholder="Optional"
            containerStyle={styles.halfWidth}
          />
        </View>

        <View style={styles.row}>
          <Input
            label="Bench Index"
            value={formData.benchIndex}
            onChangeText={(value) => updateField('benchIndex', value)}
            placeholder="0"
            keyboardType="number-pad"
            error={errors.benchIndex}
            containerStyle={styles.halfWidth}
            required
          />

          <Input
            label="Bench Tag"
            value={formData.benchTag}
            onChangeText={(value) => updateField('benchTag', value)}
            placeholder="Optional"
            containerStyle={styles.halfWidth}
          />
        </View>

        <View style={styles.row}>
          <Input
            label="Spot Index"
            value={formData.spotIndex}
            onChangeText={(value) => updateField('spotIndex', value)}
            placeholder="0"
            keyboardType="number-pad"
            error={errors.spotIndex}
            containerStyle={styles.halfWidth}
            required
          />

          <Input
            label="Count"
            value={formData.count}
            onChangeText={(value) => updateField('count', value)}
            placeholder="0"
            keyboardType="number-pad"
            error={errors.count}
            containerStyle={styles.halfWidth}
            required
          />
        </View>
      </View>

      <View style={styles.section}>
        <Input
          label="Notes"
          value={formData.notes}
          onChangeText={(value) => updateField('notes', value)}
          placeholder="Add any additional notes..."
          multiline
          numberOfLines={4}
          leftIcon="document-text"
        />
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
          title={initialData ? 'Update Observation' : 'Add Observation'}
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
  label: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  categoryText: {
    ...typograph.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
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