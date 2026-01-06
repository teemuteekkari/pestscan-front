// src/screens/analytics/MonthlyReportScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { BarChart } from '../../components/charts/BarChart';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatCard, StatCardGrid } from '../../components/cards/StatCard';
import { Row } from '../../components/layout/Row';
import { colors, spacing, typograph } from '../../theme/theme';
import { analyticsService } from '../../services/analytics.service';
import { FarmMonthlyReportDto } from '../../types/api.types';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsNavigator';

type Props = NativeStackScreenProps<AnalyticsStackParamList, 'MonthlyReport'>;

export const MonthlyReportScreen: React.FC<Props> = ({ navigation, route }) => {
  const farmId = route.params?.farmId;
  const initialYear = route.params?.year || new Date().getFullYear();
  const initialMonth = route.params?.month || new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState(initialMonth.toString());
  const [selectedYear, setSelectedYear] = useState(initialYear.toString());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<FarmMonthlyReportDto | null>(null);

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

    const year = parseInt(selectedYear, 10);
    const month = parseInt(selectedMonth, 10);

    if (isNaN(year) || year < 2000 || year > 2100) {
      Alert.alert('Invalid Year', 'Please enter a valid year');
      return;
    }

    if (isNaN(month) || month < 1 || month > 12) {
      Alert.alert('Invalid Month', 'Please enter a month between 1 and 12');
      return;
    }

    try {
      setLoading(true);
      const data = await analyticsService.getMonthlyReport(farmId, year, month);
      setReportData(data);
    } catch (error) {
      console.error('Failed to load monthly report:', error);
      Alert.alert('Error', 'Failed to load monthly report');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || '';
  };

  // Prepare weekly breakdown data from heatmaps
  const weeklyData = reportData?.weeklyHeatmaps.length
    ? {
        labels: reportData.weeklyHeatmaps.map((w) => `W${w.weekNumber}`),
        datasets: [{
          data: reportData.weeklyHeatmaps.map((w) => 
            w.sections.reduce((sum, s) => 
              sum + s.cells.reduce((cellSum, c) => cellSum + c.totalCount, 0), 0
            )
          ),
        }],
      }
    : null;

  // Prepare severity trend data
  const severityTrendData = reportData?.severityTrend.length
    ? {
        labels: reportData.severityTrend.map((t) => 
          new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [{
          data: reportData.severityTrend.map((t) => t.severity),
        }],
      }
    : null;

  if (!farmId) {
    return (
      <Screen title="Monthly Report">
        <View style={styles.emptyContainer}>
          <Text>No farm selected</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      title="Monthly Report"
      subtitle={reportData ? `${getMonthName(reportData.month)} ${reportData.year}` : undefined}
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
      headerActions={[
        {
          icon: 'share',
          onPress: () => navigation.navigate('Report', { farmId }),
          label: 'Export',
        },
      ]}
    >
      {/* Month Selection */}
      <Card padding="md" style={styles.selectionCard}>
        <Text style={styles.cardTitle}>Select Period</Text>
        <Row gap="md">
          <Input
            label="Month"
            value={selectedMonth}
            onChangeText={setSelectedMonth}
            keyboardType="number-pad"
            placeholder="1-12"
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
          {/* Monthly Stats */}
          <StatCardGrid columns={2}>
            <StatCard
              title="Total Observations"
              value={reportData.totalObservations}
              icon="eye"
              variant="info"
            />
            <StatCard
              title="Sessions"
              value={reportData.totalSessions}
              icon="calendar"
              variant="success"
            />
            <StatCard
              title="Active Scouts"
              value={reportData.activeScouts}
              icon="people"
              variant="default"
            />
            <StatCard
              title="Pests Detected"
              value={reportData.distinctPestsDetected}
              icon="bug"
              variant="error"
            />
          </StatCardGrid>

          {/* Severity Stats */}
          <Card padding="md">
            <Text style={styles.cardTitle}>Severity Analysis</Text>
            <Row gap="lg" justify="space-around">
              <View style={styles.severityStat}>
                <Text style={styles.severityLabel}>Average</Text>
                <Text style={[styles.severityValue, { color: colors.primary }]}>
                  {reportData.averageSeverity.toFixed(2)}
                </Text>
              </View>
              <View style={styles.severityDivider} />
              <View style={styles.severityStat}>
                <Text style={styles.severityLabel}>Worst</Text>
                <Text style={[styles.severityValue, { color: colors.error }]}>
                  {reportData.worstSeverity.toFixed(2)}
                </Text>
              </View>
            </Row>
          </Card>

          {/* Weekly Breakdown */}
          {weeklyData && (
            <BarChart
              title="Weekly Observations"
              data={weeklyData}
              height={220}
            />
          )}

          {/* Severity Trend */}
          {severityTrendData && (
            <BarChart
              title="Severity Trend"
              data={severityTrendData}
              height={220}
            />
          )}

          {/* Top Pest Trends */}
          {reportData.topPestTrends.length > 0 && (
            <Card padding="md">
              <Text style={styles.cardTitle}>Top Pest Trends</Text>
              {reportData.topPestTrends.slice(0, 5).map((pest, index) => (
                <View key={index} style={styles.pestItem}>
                  <View style={styles.pestLeft}>
                    <Text style={styles.pestRank}>{index + 1}</Text>
                    <Text style={styles.pestName}>{pest.speciesCode}</Text>
                  </View>
                  <Text style={styles.pestCount}>
                    {pest.points.length} data points
                  </Text>
                </View>
              ))}
            </Card>
          )}

          {/* Period Info */}
          <Card padding="md">
            <Text style={styles.cardTitle}>Report Period</Text>
            <Text style={styles.infoText}>
              📅 From: {new Date(reportData.periodStart).toLocaleDateString()}
            </Text>
            <Text style={styles.infoText}>
              📅 To: {new Date(reportData.periodEnd).toLocaleDateString()}
            </Text>
          </Card>

          <Button
            title="Export PDF Report"
            icon="download"
            onPress={() => navigation.navigate('Report', { farmId })}
            variant="primary"
            style={styles.exportButton}
          />
        </>
      ) : (
        <Card padding="md">
          <Text style={styles.emptyText}>
            Select a month and year, then tap "Generate Report"
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
  severityStat: {
    alignItems: 'center',
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
  pestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pestLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pestRank: {
    ...typograph.body,
    color: colors.surface,
    fontWeight: '700',
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  pestName: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
  },
  pestCount: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
  },
  infoText: {
    ...typograph.body,
    color: colors.text,
    marginBottom: spacing.sm,
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

export default MonthlyReportScreen;