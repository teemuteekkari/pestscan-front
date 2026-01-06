// src/screens/analytics/WeeklyReportScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Row } from '../../components/layout/Row';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { analyticsService } from '../../services/analytics.service';
import { FarmWeeklyAnalyticsDto, ReportExportRequest } from '../../types/api.types';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsNavigator';

type Props = NativeStackScreenProps<AnalyticsStackParamList, 'WeeklyReport'>;

// Helper to get current week number
const getCurrentWeek = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
};

export const WeeklyReportScreen: React.FC<Props> = ({ navigation, route }) => {
  const farmId = route.params?.farmId;
  const initialWeek = route.params?.week || getCurrentWeek();
  const initialYear = route.params?.year || new Date().getFullYear();

  const [selectedWeek, setSelectedWeek] = useState(initialWeek.toString());
  const [selectedYear, setSelectedYear] = useState(initialYear.toString());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<FarmWeeklyAnalyticsDto | null>(null);
  const [previousWeekData, setPreviousWeekData] = useState<FarmWeeklyAnalyticsDto | null>(null);

  useEffect(() => {
    if (farmId) {
      loadReport();
    }
  }, [farmId]);

  const loadReport = async () => {
    if (!farmId) {
      Alert.alert('Error', 'No farm selected');
      return;
    }

    const week = parseInt(selectedWeek, 10);
    const year = parseInt(selectedYear, 10);

    if (isNaN(week) || week < 1 || week > 53) {
      Alert.alert('Invalid Week', 'Please enter a week number between 1 and 53');
      return;
    }

    if (isNaN(year) || year < 2000 || year > 2100) {
      Alert.alert('Invalid Year', 'Please enter a valid year');
      return;
    }

    try {
      setLoading(true);

      // Load current week data
      const data = await analyticsService.getWeeklyAnalytics(farmId, week, year);
      setReportData(data);

      // Load previous week for comparison
      const prevWeek = week > 1 ? week - 1 : 52;
      const prevYear = week > 1 ? year : year - 1;
      
      try {
        const prevData = await analyticsService.getWeeklyAnalytics(farmId, prevWeek, prevYear);
        setPreviousWeekData(prevData);
      } catch (error) {
        console.log('Previous week data not available');
        setPreviousWeekData(null);
      }

    } catch (error) {
      console.error('Failed to load weekly report:', error);
      Alert.alert('Error', 'Failed to load weekly report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!farmId || !reportData) {
      Alert.alert('Error', 'No report data to export');
      return;
    }

    try {
      setLoading(true);

      // Calculate start and end dates for the week
      const year = reportData.year;
      const weekNum = reportData.week;
      
      // ISO week date calculation
      const jan4 = new Date(year, 0, 4);
      const startOfYear = new Date(jan4.getTime() - (jan4.getDay() - 1) * 86400000);
      const weekStart = new Date(startOfYear.getTime() + (weekNum - 1) * 7 * 86400000);
      const weekEnd = new Date(weekStart.getTime() + 6 * 86400000);

      const exportRequest: ReportExportRequest = {
        farmId,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        format: 'PDF',
        sections: {
          summary: true,
          observations: true,
          charts: true,
          heatmaps: true,
          recommendations: true,
          photos: false,
        },
      };

      const response = await analyticsService.exportReport(exportRequest);

      const { Linking } = await import('react-native');
      
      Alert.alert(
        'Export Ready',
        `Your PDF report is ready for download.\n\nFile: ${response.fileName}`,
        [
          {
            text: 'Download',
            onPress: async () => {
              try {
                await Linking.openURL(response.downloadUrl);
              } catch (error) {
                Alert.alert('Error', 'Failed to open download URL');
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Error', 'Failed to export report');
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentage change
  const calculateChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  // Prepare severity breakdown chart
  const severityData = reportData
    ? {
        labels: ['Zero', 'Low', 'Mod', 'High', 'V.High', 'Emerg'],
        datasets: [{
          data: [
            reportData.severityBuckets.ZERO || 0,
            reportData.severityBuckets.LOW || 0,
            reportData.severityBuckets.MODERATE || 0,
            reportData.severityBuckets.HIGH || 0,
            reportData.severityBuckets.VERY_HIGH || 0,
            reportData.severityBuckets.EMERGENCY || 0,
          ],
        }],
      }
    : null;

  // Calculate completion rate
  const completionRate = reportData
    ? reportData.totalSessions > 0
      ? Math.round((reportData.completedSessions / reportData.totalSessions) * 100)
      : 0
    : 0;

  // Calculate change metrics
  const obsChange = previousWeekData
    ? calculateChange(reportData?.totalObservations || 0, previousWeekData.totalObservations)
    : null;

  if (!farmId) {
    return (
      <Screen title="Weekly Report">
        <View style={styles.emptyContainer}>
          <Text>No farm selected</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      title="Weekly Report"
      subtitle={reportData ? `${reportData.farmName} - Week ${reportData.week}, ${reportData.year}` : undefined}
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
      headerActions={[
        {
          icon: 'share',
          onPress: handleExport,
          label: 'Export',
        },
      ]}
    >
      {/* Week Selection */}
      <Card padding="md" style={styles.selectionCard}>
        <Text style={styles.cardTitle}>Select Period</Text>
        <Row gap="md">
          <Input
            label="Week"
            value={selectedWeek}
            onChangeText={setSelectedWeek}
            keyboardType="number-pad"
            placeholder="1-53"
            containerStyle={styles.input}
          />
          <Input
            label="Year"
            value={selectedYear}
            onChangeText={setSelectedYear}
            keyboardType="number-pad"
            placeholder="2024"
            containerStyle={styles.input}
          />
        </Row>
        <Button
          title="Generate Report"
          icon="refresh"
          onPress={loadReport}
          loading={loading}
          style={styles.generateButton}
        />
      </Card>

      {reportData ? (
        <>
          {/* Summary */}
          <Card padding="md">
            <Text style={styles.cardTitle}>Weekly Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{reportData.totalObservations}</Text>
                <Text style={styles.summaryLabel}>Total Observations</Text>
                {obsChange && (
                  <Badge
                    label={`${obsChange.isPositive ? '+' : '-'}${obsChange.value.toFixed(1)}% vs last week`}
                    variant={obsChange.isPositive ? 'success' : 'error'}
                    size="sm"
                  />
                )}
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{reportData.completedSessions}</Text>
                <Text style={styles.summaryLabel}>Completed Sessions</Text>
                <Badge
                  label={`${completionRate}% Complete`}
                  variant={completionRate === 100 ? 'success' : 'warning'}
                  size="sm"
                />
              </View>
            </View>
          </Card>

          {/* Category Breakdown */}
          <Card padding="md">
            <Text style={styles.cardTitle}>Observation Categories</Text>
            <View style={styles.categoryGrid}>
              <View style={styles.categoryItem}>
                <Text style={[styles.categoryValue, { color: colors.error }]}>
                  {reportData.pestObservations}
                </Text>
                <Text style={styles.categoryLabel}>Pests</Text>
              </View>
              <View style={styles.categoryItem}>
                <Text style={[styles.categoryValue, { color: colors.warning }]}>
                  {reportData.diseaseObservations}
                </Text>
                <Text style={styles.categoryLabel}>Diseases</Text>
              </View>
              <View style={styles.categoryItem}>
                <Text style={[styles.categoryValue, { color: colors.success }]}>
                  {reportData.beneficialObservations}
                </Text>
                <Text style={styles.categoryLabel}>Beneficial</Text>
              </View>
            </View>
          </Card>

          {/* Severity Distribution */}
          {severityData && (
            <BarChart
              title="Severity Distribution"
              data={severityData}
              height={220}
            />
          )}

          {/* Key Findings */}
          <Card padding="md">
            <Text style={styles.cardTitle}>Key Findings</Text>
            
            {reportData.severityBuckets.EMERGENCY > 0 && (
              <>
                <View style={styles.findingItem}>
                  <Badge label="Emergency" variant="error" />
                  <Text style={styles.findingText}>
                    {reportData.severityBuckets.EMERGENCY} emergency-level observations detected
                  </Text>
                </View>
                <Divider marginVertical="sm" />
              </>
            )}

            {reportData.severityBuckets.VERY_HIGH > 0 && (
              <>
                <View style={styles.findingItem}>
                  <Badge label="High Priority" variant="error" />
                  <Text style={styles.findingText}>
                    {reportData.severityBuckets.VERY_HIGH} very high severity observations
                  </Text>
                </View>
                <Divider marginVertical="sm" />
              </>
            )}

            {reportData.pestObservations > reportData.diseaseObservations && (
              <>
                <View style={styles.findingItem}>
                  <Badge label="Warning" variant="warning" />
                  <Text style={styles.findingText}>
                    Pest activity higher than disease activity this week
                  </Text>
                </View>
                <Divider marginVertical="sm" />
              </>
            )}

            {reportData.beneficialObservations > 0 && (
              <View style={styles.findingItem}>
                <Badge label="Positive" variant="success" />
                <Text style={styles.findingText}>
                  {reportData.beneficialObservations} beneficial organisms observed
                </Text>
              </View>
            )}
          </Card>

          {/* Export Button */}
          <Button
            title="Export PDF Report"
            icon="download"
            onPress={handleExport}
            variant="primary"
            style={styles.exportButton}
          />
        </>
      ) : (
        <Card padding="md">
          <Text style={styles.emptyText}>
            Select a week and year, then tap "Generate Report"
          </Text>
        </Card>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  selectionCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typograph.subtitle,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
  },
  generateButton: {
    marginTop: spacing.sm,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
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
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  categoryValue: {
    ...typograph.h3,
    fontWeight: '700',
  },
  categoryLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  findingText: {
    ...typograph.body,
    color: colors.text,
    flex: 1,
  },
  emptyText: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
  exportButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

export default WeeklyReportScreen;