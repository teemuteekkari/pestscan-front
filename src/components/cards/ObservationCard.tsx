// src/components/cards/ObservationCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { ScoutingObservationDto, ObservationCategory, SpeciesCode } from '../../types/api.types';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';

interface ObservationCardProps {
  observation: ScoutingObservationDto;
  onPress?: () => void;
  showLocation?: boolean;
}

export const ObservationCard: React.FC<ObservationCardProps> = ({ 
  observation, 
  onPress,
  showLocation = true 
}) => {
  const getCategoryColor = (category: ObservationCategory): string => {
    switch (category) {
      case ObservationCategory.PEST:
        return colors.error || '#DC2626';
      case ObservationCategory.DISEASE:
        return colors.warning || '#F59E0B';
      case ObservationCategory.BENEFICIAL:
        return colors.success || '#10B981';
      default:
        return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: ObservationCategory): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case ObservationCategory.PEST:
        return 'bug';
      case ObservationCategory.DISEASE:
        return 'warning';
      case ObservationCategory.BENEFICIAL:
        return 'shield-checkmark';
      default:
        return 'alert-circle';
    }
  };

  const formatSpeciesCode = (code: SpeciesCode): string => {
    return code
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const categoryColor = getCategoryColor(observation.category);

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <Card style={[styles.card, shadows.sm]}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.categoryContainer}>
              <View 
                style={[
                  styles.categoryIconContainer, 
                  { backgroundColor: `${categoryColor}20` }
                ]}
              >
                <Ionicons
                  name={getCategoryIcon(observation.category)}
                  size={20}
                  color={categoryColor}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.speciesName}>
                  {formatSpeciesCode(observation.speciesCode)}
                </Text>
                <View style={styles.categoryBadge}>
                  <Text 
                    style={[
                      styles.categoryText,
                      { color: categoryColor }
                    ]}
                  >
                    {observation.category}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.countBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.countText}>{observation.count}</Text>
            </View>
          </View>

          {showLocation && (
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <Ionicons 
                  name="location" 
                  size={14} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.locationText}>
                  Bay {observation.bayIndex + 1}
                  {observation.bayTag && ` (${observation.bayTag})`}
                  {' • '}
                  Bench {observation.benchIndex + 1}
                  {observation.benchTag && ` (${observation.benchTag})`}
                  {' • '}
                  Spot {observation.spotIndex + 1}
                </Text>
              </View>
            </View>
          )}

          {observation.notes && (
            <View style={styles.notesContainer}>
              <Ionicons 
                name="document-text" 
                size={14} 
                color={colors.textSecondary}
                style={styles.notesIcon}
              />
              <Text style={styles.notesText} numberOfLines={2}>
                {observation.notes}
              </Text>
            </View>
          )}

          <View style={styles.metadataRow}>
            {observation.greenhouseId && (
              <View style={styles.metadataItem}>
                <Ionicons name="business" size={12} color={colors.textSecondary} />
                <Text style={styles.metadataText}>Greenhouse</Text>
              </View>
            )}
            {observation.fieldBlockId && (
              <View style={styles.metadataItem}>
                <Ionicons name="leaf" size={12} color={colors.textSecondary} />
                <Text style={styles.metadataText}>Field Block</Text>
              </View>
            )}
            {observation.version !== undefined && (
              <View style={styles.metadataItem}>
                <Ionicons name="git-branch" size={12} color={colors.textSecondary} />
                <Text style={styles.metadataText}>v{observation.version}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  speciesName: {
    ...typograph.subtitle,
    color: colors.text,
    fontWeight: '600',
  },
  categoryBadge: {
    marginTop: spacing.xs,
  },
  categoryText: {
    ...typograph.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  countBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: borderRadius.round || 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  countText: {
    ...typograph.h4,
    color: colors.surface,
    fontWeight: '700',
  },
  locationContainer: {
    marginBottom: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  notesContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    backgroundColor: `${colors.textSecondary}10`,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  notesIcon: {
    marginRight: spacing.xs,
    marginTop: 2,
  },
  notesText: {
    ...typograph.bodySmall,
    color: colors.text,
    flex: 1,
    fontStyle: 'italic',
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metadataText: {
    ...typograph.caption,
    color: colors.textSecondary,
  },
});