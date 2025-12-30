// src/components/forms/FieldBlockForm.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CreateFieldBlockRequest, FieldBlockDto } from '../../types/api.types';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface FieldBlockFormProps {
  initialData?: Partial<FieldBlockDto>;
  onSubmit: (data: CreateFieldBlockRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const FieldBlockForm: React.FC<FieldBlockFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bayCount: initialData?.bayCount?.toString() || '',
    spotChecksPerBay: initialData?.spotChecksPerBay?.toString() || '',
    active: initialData?.active ?? true,
  });

  const [bayTags, setBayTags] = useState<string[]>(initialData?.bayTags || []);
  const [newBayTag, setNewBayTag] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (typeof value === 'string' && errors[field]) {
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Field block name is required';
    }

    if (!formData.bayCount) {
      newErrors.bayCount = 'Bay count is required';
    } else if (isNaN(Number(formData.bayCount)) || Number(formData.bayCount) <= 0) {
      newErrors.bayCount = 'Must be a positive number';
    }

    if (!formData.spotChecksPerBay) {
      newErrors.spotChecksPerBay = 'Spot checks per bay is required';
    } else if (isNaN(Number(formData.spotChecksPerBay)) || Number(formData.spotChecksPerBay) <= 0) {
      newErrors.spotChecksPerBay = 'Must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData: CreateFieldBlockRequest = {
      name: formData.name.trim(),
      bayCount: Number(formData.bayCount),
      spotChecksPerBay: Number(formData.spotChecksPerBay),
      bayTags: bayTags.length > 0 ? bayTags : undefined,
      active: formData.active,
    };

    onSubmit(submitData);
  };

  const totalSpotChecks = (Number(formData.bayCount) || 0) * (Number(formData.spotChecksPerBay) || 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Input
          label="Field Block Name"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Enter field block name"
          error={errors.name}
          leftIcon="leaf"
          required
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
          label="Spot Checks per Bay"
          value={formData.spotChecksPerBay}
          onChangeText={(value) => updateField('spotChecksPerBay', value)}
          placeholder="0"
          keyboardType="number-pad"
          error={errors.spotChecksPerBay}
          leftIcon="checkmark-circle"
          required
        />

        {(formData.bayCount || formData.spotChecksPerBay) && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Calculated Total</Text>
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
            containerStyle={styles.tagInp