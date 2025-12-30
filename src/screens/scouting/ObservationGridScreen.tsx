import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card, Badge } from '../../components/common';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { ScoutingObservationDto } from '../../types/api.types';
import { getSpeciesLabel, getCategoryColor } from '../../constants/species';
import { ScoutingStackParamList } from '../../navigation/ScoutingNavigator';

type Props = NativeStackScreenProps<ScoutingStackParamList, 'ObservationGrid'>;

type ViewMode = 'list' | 'grid';
type GroupBy = 'location' | 'species' | 'category';

export const ObservationGridScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { sessionId, targetId } = route.params;
  const [observations, setObservations] = useState<ScoutingObservationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [groupBy, setGroupBy] = useState<GroupBy>('location');

  useEffect(() => {
    loadObservations();
  }, [sessionId]);

  const loadObservations = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await scoutingService.getSessionObservations(sessionId, targetId);
      // setObservations(data);

      // Mock data
      setTimeout(() => {
        const mockData: ScoutingObservationDto[] = [
          {
            id: '1',
            sessionId,
            sessionTargetId: targetId,
            greenhouseId: 'greenhouse-1',
            speciesCode: 'THRIPS' as any,
            category: 'PEST' as any,
            bayIndex: 0,
            bayTag: 'North',
            benchIndex: 0,
            benchTag: 'Row-A',
            spotIndex: 0,
            count: 15,
          },
          {
            id: '2',
            sessionId,
            sessionTargetId: targetId,
            greenhouseId: 'greenhouse-1',
            speciesCode: 'RED_SPIDER_MITE' as any,
            category: 'PEST' as any,
            bayIndex: 0,
            benchIndex: 1,
            spotIndex: 0,
            count: 8,
          },
          {
            id: '3',
            sessionId,
            sessionTargetId: targetId,
            greenhouseId: 'greenhouse-1',
            speciesCode: 'POWDERY_MILDEW' as any,
            category: 'DISEASE' as any,
            bayIndex: 1,
            benchIndex: 0,
            spotIndex: 0,
            count: 3,
          },
        ];
        setObservations(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Failed to load observations:', error);
    }
  };

  const handleObservationPress = (observation: ScoutingObservationDto) => {
    // ✅ Fixed: Added placeholder for ObservationDetail
    Alert.alert('Coming Soon', 'Observation detail view will be available soon');
    // TODO: Uncomment when ObservationDetail screen is created
    // navigation.navigate('ObservationDetail', { observationId: observation.id });
  };

  const groupObservations = () => {
    const grouped: Record<string, ScoutingObservationDto[]> = {};

    observations.forEach((obs) => {
      let key: string;
      switch (groupBy) {
        case 'location':
          key = `Bay ${obs.bayIndex + 1}, Bench ${obs.benchIndex + 1}`;
          break;
        case 'species':
          key = getSpeciesLabel(obs.speciesCode);
          break;
        case 'category':
          key = obs.category;
          break;
        default:
          key = 'Other';
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(obs);
    });

    return grouped;
  };

  const renderObservationCard = (observation: ScoutingObservationDto) => {
    const categoryColor = getCategoryColor(observation.category);

    return (
      <TouchableOpacity
        key={observation.id}
        onPress={() => handleObservationPress(observation)}
        activeOpacity={0.7}
      >
        <Card padding="sm" style={styles.observationCard}>
          <View style={styles.observationHeader}>
            <View
              style={[
                styles.observationIcon,
                { backgroundColor: `${categoryColor}20` },
              ]}
            >
              <Ionicons
                name={observation.category === 'PEST' ? 'bug' : 'warning'}
                size={20}
                color={categoryColor}
              />
            </View>
            <View style={styles.observationInfo}>
              <Text style={styles.observationSpecies} numberOfLines={1}>
                {getSpeciesLabel(observation.speciesCode)}
              </Text>
              <Text style={styles.observationLocation}>
                Bay {observation.bayIndex + 1}, Bench {observation.benchIndex + 1}
                , Spot {observation.spotIndex + 1}
              </Text>
            </View>
            <View style={[styles.countBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.countBadgeText}>{observation.count}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderGroupedObservations = () => {
    const grouped = groupObservations();

    return Object.entries(grouped).map(([groupName, groupObservations]) => (
      <View key={groupName} style={styles.group}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupTitle}>{groupName}</Text>
          <Badge label={`${groupObservations.length}`} variant="info" size="sm" />
        </View>
        {groupObservations.map(renderObservationCard)}
      </View>
    ));
  };

  const totalCount = observations.reduce((sum, obs) => sum + obs.count, 0);

  return (
    <Screen
      title="Observations"
      showBack
      onBackPress={() => navigation.goBack()}
      headerActions={[
        {
          icon: viewMode === 'list' ? 'grid' : 'list',
          onPress: () => setViewMode(viewMode === 'list' ? 'grid' : 'list'),
          label: 'Toggle view',
        },
      ]}
    >
      <View style={styles.container}>
        {/* Summary */}
        <Card padding="md" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{observations.length}</Text>
              <Text style={styles.summaryLabel}>Observations</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalCount}</Text>
              <Text style={styles.summaryLabel}>Total Count</Text>
            </View>
          </View>
        </Card>

        {/* Group By Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Group by:</Text>
          <View style={styles.filters}>
            {(['location', 'species', 'category'] as GroupBy[]).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterChip,
                  groupBy === option && styles.filterChipActive,
                ]}
                onPress={() => setGroupBy(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    groupBy === option && styles.filterTextActive,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Observations List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {observations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="eye-off-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Observations</Text>
              <Text style={styles.emptyText}>
                Start recording observations for this session
              </Text>
            </View>
          ) : (
            renderGroupedObservations()
          )}
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    ...typograph.h2,
    color: colors.primary,
    fontWeight: '700',
  },
  summaryLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  filterLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round || 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typograph.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  group: {
    marginBottom: spacing.lg,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  groupTitle: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
  },
  observationCard: {
    marginBottom: spacing.sm,
  },
  observationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  observationIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  observationInfo: {
    flex: 1,
  },
  observationSpecies: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
  },
  observationLocation: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  countBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  countBadgeText: {
    ...typograph.body,
    color: colors.surface,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl * 2,
  },
  emptyTitle: {
    ...typograph.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ObservationGridScreen;