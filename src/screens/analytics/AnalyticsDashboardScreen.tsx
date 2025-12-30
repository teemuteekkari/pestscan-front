import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { StatCard, StatCardGrid } from '../../components/cards/StatCard';
import { BarChart } from '../../components/charts/BarChart';
import { PieChart } from '../../components/charts/PieChart';
import { TrendChart } from '../../components/charts/TrendChart';
import { Button } from '../../components/common/Button';
import { Row } from '../../components/layout/Row';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph } from '../../theme/theme';
import { FarmWeeklyAnalyticsDto } from '../../types/api.types';

interface AnalyticsDashboardScreenProps {
  navigation: any;
  route: any;
}

export const AnalyticsDashboardScreen: React.FC<AnalyticsDashboardScreenProps> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<FarmWeeklyAnalyticsDto | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await analyticsService.getWeeklyAnalytics(farmId, week, year);
      // setAnalyticsData(data);
      
      // Mock data for now
      setAnalyticsData({
        farmId: '1',
        farmName: 'Green Valley Farm',
        week: 47,
        year: 2024,
        bayCount: 10,
        benchesPerBay: 4,
        totalSessions: 8,
        completedSessions: 6,
        totalObservations: 245,
        pestObservations: 145,
        diseaseObservations: 75,
        beneficialObservations: 25,
        severityBuckets: {
          ZERO: 120,
          LOW: 80,
          MODERATE: 30,
          HIGH: 10,
          VERY_HIGH: 4,
          EMERGENCY: 1,
        },
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const observationDistribution = [
    { 
      name: 'Pests', 
      value: analyticsData?.pestObservations || 0, 
      color: colors.error || '#DC2626',
    },
    { 
      name: 'Diseases', 
      value: analyticsData?.diseaseObservations || 0, 
      color: colors.warning || '#F59E0B',
    },
    { 
      name: 'Beneficial', 
      value: analyticsData?.beneficialObservations || 0, 
      color: colors.success || '#10B981',
    },
  ];

  const severityData = {
    labels: ['Zero', 'Low', 'Moderate', 'High', 'V.High', 'Emergency'],
    datasets: [{
      data: analyticsData ? [
        analyticsData.severityBuckets.ZERO,
        analyticsData.severityBuckets.LOW,
        analyticsData.severityBuckets.MODERATE,
        analyticsData.severityBuckets.HIGH,
        analyticsData.severityBuckets.VERY_HIGH,
        analyticsData.severityBuckets.EMERGENCY,
      ] : [0, 0, 0, 0, 0, 0],
    }],
  };

  return (
    <Screen
      title="Analytics Dashboard"
      subtitle={analyticsData ? `Week ${analyticsData.week}, ${analyticsData.year}` : undefined}
      scroll
      refreshing={refreshing}
      onRefresh={handleRefresh}
      padding="md"
    >
      {/* Quick Stats */}
      <StatCardGrid columns={2}>
        <StatCard
          title="Total Observations"
          value={analyticsData?.totalObservations || 0}
          icon="eye"
          variant="info"
        />
        <StatCard
          title="Completed Sessions"
          value={`${analyticsData?.completedSessions || 0}/${analyticsData?.totalSessions || 0}`}
          icon="checkmark-circle"
          variant="success"
        />
        <StatCard
          title="Pest Detections"
          value={analyticsData?.pestObservations || 0}
          icon="bug"
          variant="error"
        />
        <StatCard
          title="Disease Cases"
          value={analyticsData?.diseaseObservations || 0}
          icon="warning"
          variant="warning"
        />
      </StatCardGrid>

      <Divider marginVertical="lg" />

      {/* Observation Distribution */}
      <PieChart
        title="Observation Distribution"
        data={observationDistribution}
        size={200}
      />

      {/* Severity Analysis */}
      <BarChart
        title="Severity Distribution"
        data={severityData}
        height={250}
      />

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Detailed Reports</Text>
        <Row gap="md">
          <Button
            title="Weekly Report"
            icon="calendar"
            onPress={() => navigation.navigate('WeeklyReport')}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Monthly Report"
            icon="calendar-outline"
            onPress={() => navigation.navigate('MonthlyReport')}
            variant="outline"
            style={styles.actionButton}
          />
        </Row>
        <Row gap="md" style={styles.secondRow}>
          <Button
            title="Trends"
            icon="trending-up"
            onPress={() => navigation.navigate('Trends')}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Custom Report"
            icon="document-text"
            onPress={() => navigation.navigate('Report')}
            variant="outline"
            style={styles.actionButton}
          />
        </Row>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    marginTop: spacing.lg,
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
export default AnalyticsDashboardScreen
