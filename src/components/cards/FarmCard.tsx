// src/components/cards/FarmCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { FarmResponse } from '../../types/api.types';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';
import { getStatusLabel } from '../../utils/helpers';
import { getStatusColor } from '../../theme/colors'

interface FarmCardProps {
  farm: FarmResponse;
  onPress?: () => void;
}

export const FarmCard: React.FC<FarmCardProps> = ({ farm, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, shadows.md]}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons
                name="leaf"
                size={24}
                color={colors.primary}
                style={styles.icon}
              />
              <View style={styles.titleText}>
                <Text style={styles.title} numberOfLines={1}>
                  {farm.name}
                </Text>
                {farm.farmTag && (
                  <Text style={styles.farmTag}>{farm.farmTag}</Text>
                )}
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(farm.subscriptionStatus) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusLabel(farm.subscriptionStatus)}
              </Text>
            </View>
          </View>

          {farm.description && (
            <Text style={styles.description} numberOfLines={2}>
              {farm.description}
            </Text>
          )}

          <View style={styles.infoRow}>
            {farm.city && (
              <View style={styles.infoItem}>
                <Ionicons name="location" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>
                  {farm.city}, {farm.province || farm.country}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{farm.licensedAreaHectares}</Text>
              <Text style={styles.statLabel}>Hectares</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{farm.structureType}</Text>
              <Text style={styles.statLabel}>Type</Text>
            </View>
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
  farmTag: {
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
  infoRow: {
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  statsRow: {
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
    marginHorizontal: spacing.md,
  },
  statValue: {
    ...typograph.h4,
    color: colors.primary,
  },
  statLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});