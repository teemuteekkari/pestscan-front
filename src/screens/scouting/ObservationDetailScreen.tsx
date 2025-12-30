import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card, Badge, Button } from '../../components/common';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { ScoutingObservationDto, ObservationCategory } from '../../types/api.types';
import { getSpeciesLabel, getCategoryColor } from '../../constants/species';

interface ObservationDetailScreenProps {
  navigation: any;
  route: {
    params: {
      observationId: string;
    };
  };
}

export const ObservationDetailScreen: React.FC<ObservationDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { observationId } = route.params;
  const [observation, setObservation] = useState<ScoutingObservationDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadObservation();
  }, [observationId]);

  const loadObservation = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await scoutingService.getObservation(observationId);
      // setObservation(data);

      // Mock data
      setTimeout(() => {
        setObservation({
          id: observationId,
          sessionId: 'session-1',
          sessionTargetId: 'target-1',
          greenhouseId: 'greenhouse-1',
          speciesCode: 'THRIPS' as any,
          category: 'PEST' as any,
          bayIndex: 2,
          bayTag: 'North',
          benchIndex: 1,
          benchTag: 'Row-A',
          spotIndex: 3,
          count: 15,
          notes: 'Concentrated in upper leaves, mostly adults with some nymphs visible',
          version: 1,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to load observation');
    }
  };

  const handleEdit = () => {
    // TODO: Navigate to edit observation screen
    console.log('Edit observation');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Observation',
      'Are you sure you want to delete this observation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement delete
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (loading || !observation) {
    return (
      <Screen
        title="Observation Details"
        showBack
        onBackPress={() => navigation.goBack()}
      >
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </Screen>
    );
  }

  const categoryColor = getCategoryColor(observation.category);

  return (
    <Screen
      title="Observation Details"
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
      headerActions={[
        {
          icon: 'create',
          onPress: handleEdit,
          label: 'Edit',
        },
        {
          icon: 'trash',
          onPress: handleDelete,
          label: 'Delete',
        },
      ]}
    >
      {/* Species Card */}
      <Card padding="md">
        <View style={styles.speciesHeader}>
          <View
            style={[
              styles.speciesIconContainer,
              { backgroundColor: `${categoryColor}20` },
            ]}
          >
            <Ionicons
              name={observation.category === 'PEST' ? 'bug' : 'warning'}
              size={32}
              color={categoryColor}
            />
          </View>
          <View style={styles.speciesInfo}>
            <Text style={styles.speciesName}>
              {getSpeciesLabel(observation.speciesCode)}
            </Text>
            <Badge
              label={observation.category}
              variant={
                observation.category === ObservationCategory.PEST
                  ? 'error'
                  : observation.category === ObservationCategory.DISEASE
                  ? 'warning'
                  : 'success'
              }
            />
          </View>
        </View>

        <View style={styles.countContainer}>
          <Text style={styles.countLabel}>Count</Text>
          <Text style={[styles.countValue, { color: categoryColor }]}>
            {observation.count}
          </Text>
        </View>
      </Card>

      {/* Location Details */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Location</Text>

        <View style={styles.locationRow}>
          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Bay</Text>
            <View style={styles.locationValue}>
              <Text style={styles.locationIndex}>{observation.bayIndex + 1}</Text>
              {observation.bayTag && (
                <Badge label={observation.bayTag} variant="info" size="sm" />
              )}
            </View>
          </View>

          <View style={styles.locationDivider} />

          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Bench</Text>
            <View style={styles.locationValue}>
              <Text style={styles.locationIndex}>{observation.benchIndex + 1}</Text>
              {observation.benchTag && (
                <Badge label={observation.benchTag} variant="info" size="sm" />
              )}
            </View>
          </View>

          <View style={styles.locationDivider} />

          <View style={styles.locationItem}>
            <Text style={styles.locationLabel}>Spot</Text>
            <Text style={styles.locationIndex}>{observation.spotIndex + 1}</Text>
          </View>
        </View>
      </Card>

      {/* Target Information */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Target Information</Text>

        {observation.greenhouseId && (
          <View style={styles.infoRow}>
            <Ionicons name="business" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>Greenhouse</Text>
          </View>
        )}

        {observation.fieldBlockId && (
          <View style={styles.infoRow}>
            <Ionicons name="grid" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>Field Block</Text>
          </View>
        )}

        <Divider marginVertical="sm" />

        <View style={styles.infoRow}>
          <Ionicons name="git-branch" size={20} color={colors.textSecondary} />
          <Text style={styles.infoText}>Version {observation.version}</Text>
        </View>
      </Card>

      {/* Notes */}
      {observation.notes && (
        <Card padding="md">
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notesText}>{observation.notes}</Text>
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          title="View on Heatmap"
          icon="color-palette"
          onPress={() => console.log('View heatmap')}
          variant="outline"
          fullWidth
        />
      </View>
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
  speciesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  speciesIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speciesInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  speciesName: {
    ...typograph.h3,
    color: colors.text,
    fontWeight: '700',
  },
  countContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  countLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  countValue: {
    ...typograph.h1,
    fontWeight: '700',
  },
  sectionTitle: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  locationItem: {
    flex: 1,
    alignItems: 'center',
  },
  locationLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  locationValue: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationIndex: {
    ...typograph.h3,
    color: colors.text,
    fontWeight: '700',
  },
  locationDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typograph.body,
    color: colors.text,
  },
  notesText: {
    ...typograph.body,
    color: colors.text,
    lineHeight: 24,
  },
  actionsContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
export default ObservationDetailScreen