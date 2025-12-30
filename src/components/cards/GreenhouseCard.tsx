import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { GreenhouseDto } from '../../types/api.types';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';

interface GreenhouseCardProps {
  greenhouse: GreenhouseDto;
  onPress?: () => void;
}

export const GreenhouseCard: React.FC<GreenhouseCardProps> = ({ greenhouse, onPress }) => {
  const totalBenches = (greenhouse.bayCount || 0) * (greenhouse.benchesPerBay || 0);
  const totalSpotChecks = totalBenches * (greenhouse.spotChecksPerBench || 0);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, shadows.md]}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons
                name="business"
                size={24}
                color={colors.primary}
                style={styles.icon}
              />
              <View style={styles.titleText}>
                <Text style={styles.title} numberOfLines={1}>
                  {greenhouse.name}
                </Text>
                {greenhouse.id && (
                  <Text style={styles.greenhouseId}>ID: {greenhouse.id.slice(0, 8)}</Text>
                )}
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: greenhouse.active ? colors.success : colors.textSecondary },
              ]}
            >
              <Text style={styles.statusText}>
                {greenhouse.active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>

          {greenhouse.description && (
            <Text style={styles.description} numberOfLines={2}>
              {greenhouse.description}
            </Text>
          )}

          <View style={styles.statsGrid}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{greenhouse.bayCount || 0}</Text>
              <Text style={styles.statLabel}>Bays</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{greenhouse.benchesPerBay || 0}</Text>
              <Text style={styles.statLabel}>Benches/Bay</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalBenches}</Text>
              <Text style={styles.statLabel}>Total Benches</Text>
            </View>
          </View>

          <View style={styles.spotCheckRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            <Text style={styles.spotCheckText}>
              {greenhouse.spotChecksPerBench || 0} spot checks per bench • {totalSpotChecks} total
            </Text>
          </View>

          {(greenhouse.bayTags?.length > 0 || greenhouse.benchTags?.length > 0) && (
            <View style={styles.tagsContainer}>
              {greenhouse.bayTags?.length > 0 && (
                <View style={styles.tagRow}>
                  <Text style={styles.tagLabel}>Bay Tags:</Text>
                  <View style={styles.tags}>
                    {greenhouse.bayTags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                    {greenhouse.bayTags.length > 3 && (
                      <Text style={styles.moreText}>+{greenhouse.bayTags.length - 3}</Text>
                    )}
                  </View>
                </View>
              )}
              {greenhouse.benchTags?.length > 0 && (
                <View style={styles.tagRow}>
                  <Text style={styles.tagLabel}>Bench Tags:</Text>
                  <View style={styles.tags}>
                    {greenhouse.benchTags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                    {greenhouse.benchTags.length > 3 && (
                      <Text style={styles.moreText}>+{greenhouse.benchTags.length - 3}</Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: spacing.sm,
  },
  titleText: {
    flex: 1,
  },
  title: {
    ...typograph.h4,
    color: colors.text,
  },
  greenhouseId: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typograph.caption,
    color: colors.surface,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  statValue: {
    ...typograph.h4,
    color: colors.primary,
  },
  statLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  spotCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  spotCheckText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  tagsContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tagRow: {
    marginBottom: spacing.xs,
  },
  tagLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.primaryLight || `${colors.primary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    ...typograph.caption,
    color: colors.primary,
  },
  moreText: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
});