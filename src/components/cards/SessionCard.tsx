// src/components/cards/SessionCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { ScoutingSessionDetailDto, SessionStatus } from '../../types/api.types';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';

interface SessionCardProps {
  session: ScoutingSessionDetailDto;
  onPress?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onPress }) => {
  const observationCount = session.sections.reduce(
    (sum, section) => sum + section.observations.length,
    0
  );

  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.DRAFT:
        return 'document-outline';
      case SessionStatus.IN_PROGRESS:
        return 'timer-outline';
      case SessionStatus.COMPLETED:
        return 'checkmark-circle';
      case SessionStatus.CANCELLED:
        return 'close-circle';
      default:
        return 'document';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, shadows.sm]}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons
                name={getStatusIcon(session.status)}
                size={24}
                color={getStatusColor(session.status)}
                style={styles.icon}
              />
              <View style={styles.titleText}>
                <Text style={styles.title}>
                  {formatDate(session.sessionDate, 'MMM dd, yyyy')}
                </Text>
                <Text style={styles.subtitle}>Week {session.weekNumber}</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(session.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusLabel(session.status)}
              </Text>
            </View>
          </View>

          {(session.crop || session.variety) && (
            <View style={styles.cropInfo}>
              <Ionicons name="leaf-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.cropText}>
                {session.crop}
                {session.variety && ` (${session.variety})`}
              </Text>
            </View>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="grid-outline" size={18} color={colors.primary} />
              <Text style={styles.statText}>{session.sections.length} sections</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={18} color={colors.secondary} />
              <Text style={styles.statText}>{observationCount} observations</Text>
            </View>
          </View>

          {session.notes && (
            <Text style={styles.notes} numberOfLines={2}>
              {session.notes}
            </Text>
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
  subtitle: {
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
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cropText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...typograph.bodySmall,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  notes: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});