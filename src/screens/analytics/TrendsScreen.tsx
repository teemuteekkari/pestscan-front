// src/screens/analytics/TrendsScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { TrendChart } from '../../components/charts/TrendChart';
import { LineChart } from '../../components/charts/LineChart';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Row } from '../../components/layout/Row';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface TrendsScreenProps {
  navigation: any;
  route: any;
}

type TimeRange = '7d' | '30d' | '90d' | '1y';

export const TrendsScreen: React.FC<TrendsScreenProps> = ({ navigation }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('30d');

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  const pestTrendData = {
    labels: ['W43', 'W44', 'W45', 'W46', 'W47'],
    current: [45, 52, 58, 62, 67],
    previous: [38, 42, 48, 55, 58],
  };

  const diseaseTrendData = {
    labels: ['W43', 'W44', 'W45', 'W46', 'W47'],
    current: [28, 32, 29, 35, 38],
    previous: [25, 28, 30, 32, 35],
  };

  const beneficialTrendData = {
    labels: ['W43', 'W44', 'W45', 'W46', 'W47'],
    current: [15, 18, 22, 25, 28],
    previous: [12, 15, 18, 20, 23],
  };

  const speciesBreakdown = {
    labels: ['Thrips', 'Mites', 'Whiteflies', 'Others'],
    datasets: [
      {
        data: [35, 18, 22, 12],
        color: (opacity = 1) => colors.error || '#DC2626',
      },
    ],
  };

  return (
    <Screen
      title="Trends Analysis"
      subtitle="Historical Data & Patterns"
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
    >
      {/* Time Range Selector */}
      <Card padding="md" style={styles.rangeCard}>
        <Text style={styles.cardTitle}>Time Range</Text>
        <Row gap="sm">
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.rangeButton,
                selectedRange === range.value && styles.rangeButtonActive,
              ]}
              onPress={() => setSelectedRange(range.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  selectedRange === range.value && styles.rangeButtonTextActive,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Row>
      </Card>

      {/* Pest Trends */}
      <TrendChart
        title="Pest Population Trend"
        data={pestTrendData}
        currentLabel="This Period"
        previousLabel="Previous Period"
        showComparison
        showTrendIndicator
      />

      {/* Disease Trends */}
      <TrendChart
        title="Disease Occurrence Trend"
        data={diseaseTrendData}
        currentLabel="Current"
        previousLabel="Previous"
        showComparison
        showTrendIndicator
      />

      {/* Beneficial Trends */}
      <TrendChart
        title="Beneficial Organisms Trend"
        data={beneficialTrendData}
        currentLabel="Current"
        previousLabel="Previous"
        showComparison
        showTrendIndicator
      />

      {/* Pest Species Breakdown */}
      <LineChart
        title="Pest Species Over Time"
        data={speciesBreakdown}
        bezier
        height={220}
      />

      {/* Trend Insights */}
      <Card padding="md">
        <Text style={styles.cardTitle}>Trend Insights</Text>
        
        <View style={styles.insightItem}>
          <Badge label="Concerning" variant="error" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Rising Pest Population</Text>
            <Text style={styles.insightText}>
              Overall pest count has increased 48% over the past 5 weeks
            </Text>
          </View>
        </View>

        <View style={styles.insightItem}>
          <Badge label="Warning" variant="warning" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Disease Spike</Text>
            <Text style={styles.insightText}>
              Disease cases up 31% - requires immediate attention
            </Text>
          </View>
        </View>

        <View style={styles.insightItem}>
          <Badge label="Positive" variant="success" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Biological Control Working</Text>
            <Text style={styles.insightText}>
              Beneficial organism population growing steadily (+87%)
            </Text>
          </View>
        </View>

        <View style={styles.insightItem}>
          <Badge label="Info" variant="info" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Seasonal Pattern Detected</Text>
            <Text style={styles.insightText}>
              Thrips population follows typical seasonal cycle
            </Text>
          </View>
        </View>
      </Card>

      {/* Predictive Analysis */}
      <Card padding="md" style={styles.predictionCard}>
        <Text style={styles.cardTitle}>Predictive Forecast</Text>
        <View style={styles.predictionItem}>
          <Text style={styles.predictionLabel}>Next Week Estimate:</Text>
          <Text style={styles.predictionValue}>72-78 observations</Text>
        </View>
        <View style={styles.predictionItem}>
          <Text style={styles.predictionLabel}>Confidence Level:</Text>
          <Text style={styles.predictionValue}>High (85%)</Text>
        </View>
        <Text style={styles.predictionNote}>
          Based on 12 weeks of historical data and current trends
        </Text>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  rangeCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typograph.subtitle,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  rangeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rangeButtonText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  rangeButtonTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  insightText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
  },
  predictionCard: {
    backgroundColor: `${colors.info}15`,
    marginBottom: spacing.xl,
  },
  predictionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  predictionLabel: {
    ...typograph.body,
    color: colors.text,
  },
  predictionValue: {
    ...typograph.body,
    color: colors.primary,
    fontWeight: '600',
  },
  predictionNote: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
export default TrendsScreen