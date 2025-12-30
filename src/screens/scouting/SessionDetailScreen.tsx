import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card, Button, Badge } from '../../components/common';
import { StatCard, StatCardGrid } from '../../components/cards/StatCard';
import { ObservationCard } from '../../components/cards/ObservationCard';
import { Row } from '../../components/layout/Row';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { ScoutingSessionDetailDto, SessionStatus } from '../../types/api.types';
import { ScoutingStackParamList } from '../../navigation/ScoutingNavigator';

type Props = NativeStackScreenProps<ScoutingStackParamList, 'SessionDetail'>;

export const SessionDetailScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { sessionId } = route.params;
  const [session, setSession] = useState<ScoutingSessionDetailDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessionData();
  }, [sessionId]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await scoutingService.getSession(sessionId);
      // setSession(data);

      // Mock data
      setTimeout(() => {
        setSession({
          id: sessionId,
          farmId: 'farm-1',
          sessionDate: '2024-11-23',
          weekNumber: 47,
          status: SessionStatus.IN_PROGRESS,
          crop: 'Tomatoes',
          variety: 'Roma',
          temperatureCelsius: 22,
          relativeHumidityPercent: 65,
          observationTime: '09:00',
          weatherNotes: 'Partly cloudy, mild breeze',
          notes: 'Regular monitoring session',
          confirmationAcknowledged: false,
          sections: [
            {
              targetId: 'greenhouse-1',
              greenhouseId: 'greenhouse-1',
              includeAllBays: true,
              includeAllBenches: true,
              bayTags: [],
              benchTags: [],
              observations: [
                {
                  id: 'obs-1',
                  sessionId,
                  sessionTargetId: 'greenhouse-1',
                  greenhouseId: 'greenhouse-1',
                  speciesCode: 'THRIPS' as any,
                  category: 'PEST' as any,
                  bayIndex: 0,
                  benchIndex: 0,
                  spotIndex: 0,
                  count: 15,
                  notes: 'Concentrated in upper leaves',
                },
              ],
            },
          ],
          recommendations: [
            {
              type: 'BIOLOGICAL_CONTROL' as any,
              text: 'Release beneficial predatory mites',
            },
          ],
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to load session data');
    }
  };

  // ✅ Fixed: Placeholder for Edit (screen doesn't exist yet)
  const handleEdit = () => {
    Alert.alert('Coming Soon', 'Edit session feature will be available soon');
    // TODO: Uncomment when EditSession screen is created
    // navigation.navigate('EditSession', { sessionId });
  };

  // ✅ Fixed: Placeholder for Add Observation (screen doesn't exist yet)
  const handleAddObservation = () => {
    Alert.alert('Coming Soon', 'Record observation feature will be available soon');
    // TODO: Uncomment when RecordObservation screen is created
    // navigation.navigate('RecordObservation', { sessionId });
  };

  // ✅ Fixed: Added required targetId parameter
  const handleViewGrid = () => {
    const targetId = session?.sections[0]?.targetId || 'greenhouse-1';
    navigation.navigate('ObservationGrid', { sessionId, targetId });
  };

  const handleCompleteSession = () => {
    Alert.alert(
      'Complete Session',
      'Are you sure you want to complete this session? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            // TODO: Implement complete session
            console.log('Complete session');
          },
        },
      ]
    );
  };

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.COMPLETED:
        return 'success';
      case SessionStatus.IN_PROGRESS:
        return 'info';
      case SessionStatus.DRAFT:
        return 'warning';
      default:
        return 'neutral';
    }
  };

  if (loading || !session) {
    return (
      <Screen
        title="Session Details"
        showBack
        onBackPress={() => navigation.goBack()}
      >
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </Screen>
    );
  }

  const totalObservations = session.sections.reduce(
    (sum, section) => sum + section.observations.length,
    0
  );

  const pestCount = session.sections.reduce(
    (sum, section) =>
      sum + section.observations.filter((o) => o.category === 'PEST').length,
    0
  );

  const diseaseCount = session.sections.reduce(
    (sum, section) =>
      sum + section.observations.filter((o) => o.category === 'DISEASE').length,
    0
  );

  return (
    <Screen
      title="Session Details"
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
      ]}
    >
      {/* Status Card */}
      <Card padding="md">
        <Row justify="space-between" align="center">
          <View>
            <Text style={styles.sessionDate}>
              {new Date(session.sessionDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            {session.weekNumber && (
              <Text style={styles.weekNumber}>Week {session.weekNumber}</Text>
            )}
          </View>
          <Badge
            label={session.status}
            variant={getStatusColor(session.status) as any}
          />
        </Row>
      </Card>

      {/* Stats */}
      <StatCardGrid columns={3}>
        <StatCard
          title="Observations"
          value={totalObservations}
          icon="eye"
          variant="info"
        />
        <StatCard
          title="Pests"
          value={pestCount}
          icon="bug"
          variant="error"
        />
        <StatCard
          title="Diseases"
          value={diseaseCount}
          icon="warning"
          variant="warning"
        />
      </StatCardGrid>

      {/* Crop Information */}
      {(session.crop || session.variety) && (
        <Card padding="md">
          <Text style={styles.sectionTitle}>Crop Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="leaf" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Crop</Text>
              <Text style={styles.infoValue}>{session.crop}</Text>
            </View>
          </View>
          {session.variety && (
            <>
              <Divider marginVertical="sm" />
              <View style={styles.infoRow}>
                <Ionicons name="git-branch" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Variety</Text>
                  <Text style={styles.infoValue}>{session.variety}</Text>
                </View>
              </View>
            </>
          )}
        </Card>
      )}

      {/* Environmental Conditions */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Environmental Conditions</Text>
        {session.temperatureCelsius && (
          <View style={styles.infoRow}>
            <Ionicons name="thermometer" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Temperature</Text>
              <Text style={styles.infoValue}>{session.temperatureCelsius}°C</Text>
            </View>
          </View>
        )}
        {session.relativeHumidityPercent && (
          <>
            <Divider marginVertical="sm" />
            <View style={styles.infoRow}>
              <Ionicons name="water" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Humidity</Text>
                <Text style={styles.infoValue}>{session.relativeHumidityPercent}%</Text>
              </View>
            </View>
          </>
        )}
        {session.observationTime && (
          <>
            <Divider marginVertical="sm" />
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{session.observationTime}</Text>
              </View>
            </View>
          </>
        )}
        {session.weatherNotes && (
          <>
            <Divider marginVertical="sm" />
            <View style={styles.infoRow}>
              <Ionicons name="cloud" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Weather</Text>
                <Text style={styles.infoValue}>{session.weatherNotes}</Text>
              </View>
            </View>
          </>
        )}
      </Card>

      {/* Recent Observations */}
      {totalObservations > 0 && (
        <View style={styles.observationsSection}>
          <View style={styles.observationsHeader}>
            <Text style={styles.sectionTitle}>Recent Observations</Text>
            <Button
              title="View All"
              onPress={handleViewGrid}
              variant="ghost"
              size="sm"
            />
          </View>
          {session.sections[0]?.observations.slice(0, 3).map((observation) => (
            <ObservationCard
              key={observation.id}
              observation={observation}
              onPress={() => {
                // ✅ Fixed: Added placeholder for ObservationDetail
                Alert.alert('Coming Soon', 'Observation detail view will be available soon');
                // TODO: Uncomment when ObservationDetail screen is created
                // navigation.navigate('ObservationDetail', {
                //   observationId: observation.id,
                // })
              }}
            />
          ))}
        </View>
      )}

      {/* Recommendations */}
      {session.recommendations.length > 0 && (
        <Card padding="md">
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {session.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="bulb" size={20} color={colors.warning} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationType}>{rec.type}</Text>
                <Text style={styles.recommendationText}>{rec.text}</Text>
              </View>
            </View>
          ))}
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          title="Add Observation"
          icon="add"
          onPress={handleAddObservation}
          variant="outline"
          fullWidth
        />
        {session.status !== SessionStatus.COMPLETED && (
          <Button
            title="Complete Session"
            icon="checkmark-circle"
            onPress={handleCompleteSession}
            variant="primary"
            fullWidth
          />
        )}
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
  sessionDate: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
  },
  weekNumber: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  sectionTitle: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    ...typograph.body,
    color: colors.text,
  },
  observationsSection: {
    marginTop: spacing.md,
  },
  observationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recommendationItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationType: {
    ...typograph.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs / 2,
  },
  recommendationText: {
    ...typograph.body,
    color: colors.text,
  },
  actionsContainer: {
    marginTop: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default SessionDetailScreen;