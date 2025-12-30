// src/screens/analytics/WeeklyReportScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

interface WeeklyReportScreenProps {
  navigation: any;
  route: any;
}

export const WeeklyReportScreen: React.FC<WeeklyReportScreenProps> = ({
  navigation,
}) => {
  const [selectedWeek, setSelectedWeek] = useState('47');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(false);

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [12, 19, 15, 25, 22, 18, 20],
    }],
  };

  const comparisonData = {
    labels: ['W43', 'W44', 'W45', 'W46', 'W47'],
    current: [45, 52, 48, 60, 67],
    previous: [38, 45, 42, 55, 58],
  };

  const handleGenerateReport = () => {
    setLoading(true);
    // TODO: Implement report generation
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export report');
  };

  return (
    <Screen
      title="Weekly Report"
      subtitle={`Week ${selectedWeek}, ${selectedYear}`}
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
          onPress={handleGenerateReport}
          loading={loading}
          style={styles.generateButton}
        />
      </Card>

      {/* Summary */}
      <Card padding="md">
        <Text style={styles.cardTitle}>Weekly Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>67</Text>
            <Text style={styles.summaryLabel}>Total Observations</Text>
            <Badge label="+12% vs last week" variant="success" size="sm" />
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>5</Text>
            <Text style={styles.summaryLabel}>Active Sessions</Text>
            <Badge label="100% Complete" variant="success" size="sm" />
          </View>
        </View>
      </Card>

      {/* Daily Breakdown */}
      <BarChart
        title="Daily Observations"
        data={weeklyData}
        height={220}
      />

      {/* 5-Week Comparison */}
      <LineChart
        title="5-Week Trend"
        data={{
          labels: comparisonData.labels,
          datasets: [
            {
              data: comparisonData.current,
              color: (opacity) => colors.primary,
            },
            {
              data: comparisonData.previous,
              color: (opacity) => `rgba(156, 163, 175, ${opacity})`,
            },
          ],
          legend: ['Current Period', 'Previous Period'],
        }}
        bezier
        height={220}
      />

      {/* Key Findings */}
      <Card padding="md">
        <Text style={styles.cardTitle}>Key Findings</Text>
        <View style={styles.findingItem}>
          <Badge label="High Priority" variant="error" />
          <Text style={styles.findingText}>
            Thrips population increased by 25% in Bay 3
          </Text>
        </View>
        <Divider marginVertical="sm" />
        <View style={styles.findingItem}>
          <Badge label="Warning" variant="warning" />
          <Text style={styles.findingText}>
            Powdery mildew detected in 3 benches
          </Text>
        </View>
        <Divider marginVertical="sm" />
        <View style={styles.findingItem}>
          <Badge label="Positive" variant="success" />
          <Text style={styles.findingText}>
            Beneficial organisms stable across all areas
          </Text>
        </View>
      </Card>

      {/* Export Button */}
      <Button
        title="Export PDF Report"
        icon="download"
        onPress={handleExport}
        variant="primary"
        style={styles.exportButton}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
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
  exportButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
export default WeeklyReportScreen