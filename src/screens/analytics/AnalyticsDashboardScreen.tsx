// src/screens/analytics/AnalyticsDashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { StatCard, StatCardGrid } from '../../components/cards/StatCard';
import { BarChart } from '../../components/charts/BarChart';
import { PieChart } from '../../components/charts/PieChart';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Row } from '../../components/layout/Row';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph } from '../../theme/theme';
import { DashboardDto } from '../../types/api.types';
import { analyticsService } from '../../services/analytics.service';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsNavigator';

type Props = NativeStackScreenProps<AnalyticsStackParamList, 'Dashboard'>;

export const AnalyticsDashboardScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const farmId = route.params?.farmId;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardDto | null>(null);

  useEffect(() => {
    if (farmId) {
      loadDashboard();
    }
  }, [farmId]);

  const loadDashboard = async () => {
    if (!farmId) {
      Alert.alert('Error', 'No farm selected');
      return;
    }

    try {
      setLoading(true);
      const data = await analyticsService.getFullDashboard(farmId);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  if (loading && !dashboardData) {
    return (
      <Screen title="Analytics Dashboard">
        <View style={styles.loadingContainer}>
          <Text>Loading dashboard...</Text>
        </View>
      </Screen>
    );
  }

  if (!dashboardData) {
    return (
      <Screen title="Analytics Dashboard">
        <View style={styles.emptyContainer}>
          <Text>No dashboard data available</Text>
        </View>
      </Screen>
    );
  }

  // ✅ Fixed: Destructure from dashboardData
  const { summary, pestDistribution, diseaseDistribution, alerts, recommendations } = dashboardData;

  // Prepare pie chart data for pest distribution
  const pestPieData = pestDistribution.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: getPestColor(index),
  }));

  // Prepare pie chart data for disease distribution
  const diseasePieData = diseaseDistribution.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: getDiseaseColor(index),
  }));

  // Prepare severity trend bar chart data
  const severityTrendData = {
    labels: dashboardData.severityTrend.map(item => item.week),
    datasets: [{
      data: [
        ...dashboardData.severityTrend.map(item => item.zero),
        ...dashboardData.severityTrend.map(item => item.low),
        ...dashboardData.severityTrend.map(item => item.medium),
        ...dashboardData.severityTrend.map(item => item.high),
        ...dashboardData.severityTrend.map(item => item.critical),
      ],
    }],
  };

  return (
    <Screen
      title="Analytics Dashboard"
      subtitle={`Farm Analytics Overview`}
      scroll
      refreshing={refreshing}
      onRefresh={handleRefresh}
      padding="md"
    >
      {/* Summary Stats */}
      <StatCardGrid columns={2}>
        <StatCard
          title="Total Sessions"
          value={summary.totalSessions}
          icon="calendar"
          variant="info"
        />
        <StatCard
          title="Active Scouts"
          value={summary.activeScouts}
          icon="people"
          variant="success"
        />
        <StatCard
          title="Pests This Week"
          value={summary.pestsDetectedThisWeek}
          icon="bug"
          variant="error"
        />
        <StatCard
          title="Treatments Applied"
          value={summary.treatmentsApplied}
          icon="medical"
          variant="warning"
        />
      </StatCardGrid>

      {/* Severity Comparison */}
      <Card padding="md" style={styles.severityCard}>
        <Text style={styles.cardTitle}>Average Severity</Text>
        <Row justify="space-around">
          <View style={styles.severityItem}>
            <Text style={styles.severityLabel}>This Week</Text>
            <Text style={[styles.severityValue, { color: colors.primary }]}>
              {summary.averageSeverityThisWeek.toFixed(2)}
            </Text>
          </View>
          <View style={styles.severityDivider} />
          <View style={styles.severityItem}>
            <Text style={styles.severityLabel}>Last Week</Text>
            <Text style={[styles.severityValue, { color: colors.textSecondary }]}>
              {summary.averageSeverityLastWeek.toFixed(2)}
            </Text>
          </View>
        </Row>
        {summary.averageSeverityThisWeek > summary.averageSeverityLastWeek && (
          <Text style={styles.trendWarning}>
            ⚠️ Severity increasing - review alerts below
          </Text>
        )}
      </Card>

      <Divider marginVertical="lg" />

      {/* Pest Distribution */}
      {pestDistribution.length > 0 && (
        <PieChart
          title="Pest Distribution"
          data={pestPieData}
          size={200}
        />
      )}

      {/* Disease Distribution */}
      {diseaseDistribution.length > 0 && (
        <PieChart
          title="Disease Distribution"
          data={diseasePieData}
          size={200}
        />
      )}

      {/* Severity Trend */}
      {dashboardData.severityTrend.length > 0 && (
        <BarChart
          title="Severity Trend (Weekly)"
          data={severityTrendData}
          height={250}
        />
      )}

      <Divider marginVertical="lg" />

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card padding="md" style={styles.alertsCard}>
          <Text style={styles.cardTitle}>Recent Alerts ({alerts.length})</Text>
          {alerts.slice(0, 5).map((alert, index) => (
            <View key={index} style={styles.alertItem}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertPest}>{alert.pest}</Text>
                <Text style={[styles.alertSeverity, { color: getSeverityColor(alert.severity) }]}>
                  {alert.severity}
                </Text>
              </View>
              <Text style={styles.alertLocation}>{alert.location}</Text>
              <Text style={styles.alertDetails}>Count: {alert.count} • {alert.time}</Text>
            </View>
          ))}
          {alerts.length > 5 && (
            <Button
              title={`View All ${alerts.length} Alerts`}
              variant="ghost"
              size="sm"
              onPress={() => navigation.navigate('Alerts', { farmId })}
            />
          )}
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card padding="md" style={styles.recommendationsCard}>
          <Text style={styles.cardTitle}>Recommendations ({recommendations.length})</Text>
          {recommendations.slice(0, 3).map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationPriority}>{rec.priority}</Text>
                <Text style={styles.recommendationStatus}>{rec.status}</Text>
              </View>
              <Text style={styles.recommendationText}>{rec.text}</Text>
              <Text style={styles.recommendationMeta}>
                {rec.scout} • {rec.location} • {rec.date}
              </Text>
            </View>
          ))}
          {recommendations.length > 3 && (
            <Button
              title={`View All ${recommendations.length} Recommendations`}
              variant="ghost"
              size="sm"
              onPress={() => navigation.navigate('Recommendations', { farmId })}
            />
          )}
        </Card>
      )}

      {/* Scout Performance */}
      {dashboardData.scoutPerformance.length > 0 && (
        <Card padding="md">
          <Text style={styles.cardTitle}>Scout Performance</Text>
          {dashboardData.scoutPerformance.map((scout, index) => (
            <View key={index} style={styles.scoutItem}>
              <Text style={styles.scoutName}>{scout.scout}</Text>
              <View style={styles.scoutStats}>
                <Text style={styles.scoutStat}>Observations: {scout.observations}</Text>
                <Text style={styles.scoutStat}>Accuracy: {scout.accuracy}%</Text>
                <Text style={styles.scoutStat}>Avg Time: {scout.avgTime}</Text>
              </View>
            </View>
          ))}
        </Card>
      )}

      <Divider marginVertical="lg" />

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Detailed Reports</Text>
        <Row gap="md">
          <Button
            title="View Heatmap"
            icon="grid"
            onPress={() => navigation.navigate('Heatmap', { farmId })}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Weekly Trends"
            icon="trending-up"
            onPress={() => navigation.navigate('Trends', { farmId })}
            variant="outline"
            style={styles.actionButton}
          />
        </Row>
        <Row gap="md" style={styles.secondRow}>
          <Button
            title="Farm Comparison"
            icon="stats-chart"
            onPress={() => navigation.navigate('FarmComparison')}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Export Report"
            icon="download"
            onPress={() => Alert.alert('Coming Soon', 'Export feature coming soon')}
            variant="outline"
            style={styles.actionButton}
          />
        </Row>
      </View>
    </Screen>
  );
};

// Helper functions
const getPestColor = (index: number): string => {
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
  return colors[index % colors.length];
};

const getDiseaseColor = (index: number): string => {
  const colors = ['#DC2626', '#EA580C', '#CA8A04', '#65A30D', '#059669'];
  return colors[index % colors.length];
};

const getSeverityColor = (severity: string): string => {
  const severityColors: Record<string, string> = {
    'ZERO': '#10B981',
    'LOW': '#FBBF24',
    'MODERATE': '#F59E0B',
    'HIGH': '#EF4444',
    'VERY_HIGH': '#DC2626',
    'EMERGENCY': '#991B1B',
  };
  return severityColors[severity.toUpperCase()] || colors.textSecondary;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  cardTitle: {
    ...typograph.h4,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  severityCard: {
    marginTop: spacing.md,
  },
  severityItem: {
    alignItems: 'center',
    flex: 1,
  },
  severityLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  severityValue: {
    ...typograph.h2,
    fontWeight: '700',
  },
  severityDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  trendWarning: {
    ...typograph.bodySmall,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  alertsCard: {
    marginBottom: spacing.md,
  },
  alertItem: {
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  alertPest: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
  },
  alertSeverity: {
    ...typograph.bodySmall,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  alertLocation: {
    ...typograph.bodySmall,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  alertDetails: {
    ...typograph.caption,
    color: colors.textSecondary,
  },
  recommendationsCard: {
    marginBottom: spacing.md,
  },
  recommendationItem: {
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  recommendationPriority: {
    ...typograph.caption,
    color: colors.warning,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  recommendationStatus: {
    ...typograph.caption,
    color: colors.success,
    fontWeight: '600',
  },
  recommendationText: {
    ...typograph.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  recommendationMeta: {
    ...typograph.caption,
    color: colors.textSecondary,
  },
  scoutItem: {
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  scoutName: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  scoutStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  scoutStat: {
    ...typograph.caption,
    color: colors.textSecondary,
  },
  actionsContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typograph.h4,
    color: colors.text,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  actionButton: {
    flex: 1,
  },
  secondRow: {
    marginTop: spacing.md,
  },
});

export default AnalyticsDashboardScreen;