// src/components/forms/GreenhouseForm.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CreateGreenhouseRequest, GreenhouseDto } from '../../types/api.types';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface GreenhouseFormProps {
  initialData?: Partial<GreenhouseDto>;
  onSubmit: (data: CreateGreenhouseRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const GreenhouseForm: React.FC<GreenhouseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    bayCount: initialData?.bayCount?.toString() || '',
    benchesPerBay: initialData?.benchesPerBay?.toString() || '',
    spotChecksPerBench: initialData?.spotChecksPerBench?.toString() || '',
  });

  const [bayTags, setBayTags] = useState<string[]>(initialData?.bayTags || []);
  const [benchTags, setBenchTags] = useState<string[]>(initialData?.benchTags || []);
  const [newBayTag, setNewBayTag] = useState('');
  const [newBenchTag, setNewBenchTag] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addBayTag = () => {
    const tag = newBayTag.trim();
    if (tag && !bayTags.includes(tag)) {
      setBayTags([...bayTags, tag]);
      setNewBayTag('');
    }
  };

  const removeBayTag = (tag: string) => {
    setBayTags(bayTags.filter(t => t !== tag));
  };

  const addBenchTag = () => {
    const tag = newBenchTag.trim();
    if (tag && !benchTags.includes(tag)) {
      setBenchTags([...benchTags, tag]);
      setNewBenchTag('');
    }
  };

  const removeBenchTag = (tag: string) => {
    setBenchTags(benchTags.filter(t => t !== tag));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Greenhouse name is required';
    }

    if (!formData.bayCount) {
      newErrors.bayCount = 'Bay count is required';
    } else if (isNaN(Number(formData.bayCount)) || Number(formData.bayCount) <= 0) {
      newErrors.bayCount = 'Must be a positive number';
    }

    if (!formData.benchesPerBay) {
      newErrors.benchesPerBay = 'Benches per bay is required';
    } else if (isNaN(Number(formData.benchesPerBay)) || Number(formData.benchesPerBay) <= 0) {
      newErrors.benchesPerBay = 'Must be a positive number';
    }

    if (!formData.spotChecksPerBench) {
      newErrors.spotChecksPerBench = 'Spot checks per bench is required';
    } else if (isNaN(Number(formData.spotChecksPerBench)) || Number(formData.spotChecksPerBench) <= 0) {
      newErrors.spotChecksPerBench = 'Must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData: CreateGreenhouseRequest = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      bayCount: Number(formData.bayCount),
      benchesPerBay: Number(formData.benchesPerBay),
      spotChecksPerBench: Number(formData.spotChecksPerBench),
      bayTags: bayTags.length > 0 ? bayTags : undefined,
      benchTags: benchTags.length > 0 ? benchTags : undefined,
    };

    onSubmit(submitData);
  };

  const totalBenches = (Number(formData.bayCount) || 0) * (Number(formData.benchesPerBay) || 0);
  const totalSpotChecks = totalBenches * (Number(formData.spotChecksPerBench) || 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Input
          label="Greenhouse Name"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Enter greenhouse name"
          error={errors.name}
          leftIcon="business"
          required
        />

        <Input
          label="Description"
          value={formData.description}
          onChangeText={(value) => updateField('description', value)}
          placeholder="Enter greenhouse description"
          multiline
          numberOfLines={3}
          leftIcon="document-text"
        />
      </View>

      <View style={styles.section}>
        <Input
          label="Bay Count"
          value={formData.bayCount}
          onChangeText={(value) => updateField('bayCount', value)}
          placeholder="0"
          keyboardType="number-pad"
          error={errors.bayCount}
          leftIcon="grid"
          required
        />

        <Input
          label="Benches per Bay"
          value={formData.benchesPerBay}
          onChangeText={(value) => updateField('benchesPerBay', value)}
          placeholder="0"
          keyboardType="number-pad"
          error={errors.benchesPerBay}
          leftIcon="albums"
          required
        />

        <Input
          label="Spot Checks per Bench"
          value={formData.spotChecksPerBench}
          onChangeText={(value) => updateField('spotChecksPerBench', value)}
          placeholder="0"
          keyboardType="number-pad"
          error={errors.spotChecksPerBench}
          leftIcon="checkmark-circle"
          required
        />

        {(formData.bayCount || formData.benchesPerBay || formData.spotChecksPerBench) && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Calculated Totals</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Benches:</Text>
              <Text style={styles.summaryValue}>{totalBenches}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Spot Checks:</Text>
              <Text style={styles.summaryValue}>{totalSpotChecks}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bay Tags</Text>
        <View style={styles.tagInputContainer}>
          <Input
            value={newBayTag}
            onChangeText={setNewBayTag}
            placeholder="Enter bay tag"
            containerStyle={styles.tagInput}
            onSubmitEditing={addBayTag}
          />
          <Button
            title="Add"
            onPress={addBayTag}
            size="sm"
            icon="add"
            disabled={!newBayTag.trim()}
            style={styles.addButton}
          />
        </View>
        {bayTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {bayTags.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Badge label={tag} variant="info" />
                <TouchableOpacity
                  onPress={() => removeBayTag(tag)}
                  style={styles.removeTag}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bench Tags</Text>
        <View style={styles.tagInputContainer}>
          <Input
            value={newBenchTag}
            onChangeText={setNewBenchTag}
            placeholder="Enter bench tag"
            containerStyle={styles.tagInput}
            onSubmitEditing={addBenchTag}
          />
          <Button
            title="Add"
            onPress={addBenchTag}
            size="sm"
            icon="add"
            disabled={!newBenchTag.trim()}
            style={styles.addButton}
          />
        </View>
        {benchTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {benchTags.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Badge label={tag} variant="success" />
                <TouchableOpacity
                  onPress={() => removeBenchTag(tag)}
                  style={styles.removeTag}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
          title={initialData ? 'Update Greenhouse' : 'Create Greenhouse'}
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
  summary: {
    backgroundColor: `${colors.primary}10`,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  summaryTitle: {
    ...typograph.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  summaryLabel: {
    ...typograph.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typograph.body,
    color: colors.primary,
    fontWeight: '600',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  tagInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    marginTop: 0,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  removeTag: {
    marginLeft: -spacing.xs,
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