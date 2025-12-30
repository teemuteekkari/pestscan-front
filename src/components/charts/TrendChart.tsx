// src/components/charts/TrendChart.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from './LineChart';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface TrendData {
  labels: string[];
  current: number[];
  previous?: number[];
}

interface TrendChartProps {
  data: TrendData;
  title?: string;
  currentLabel?: string;
  previousLabel?: string;
  height?: number;
  showComparison?: boolean;
  showTrendIndicator?: boolean;
  yAxisSuffix?: string;
  style?: ViewStyle;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  title,
  currentLabel = 'Current Period',
  previousLabel = 'Previous Period',
  height = 220,
  showComparison = true,
  showTrendIndicator = true,
  yAxisSuffix = '',
  style,
}) => {
  // Calculate trend
  const calculateTrend = (): {
    percentage: number;
    isPositive: boolean;
    direction: 'up' | 'down' | 'neutral';
  } => {
    if (!data.previous || data.current.length === 0) {
      return { percentage: 0, isPositive: true, direction: 'neutral' };
    }

    const currentTotal = data.current.reduce((sum, val) => sum + val, 0);
    const previousTotal = data.previous.reduce((sum, val) => sum + val, 0);

    if (previousTotal === 0) {
      return { percentage: 0, isPositive: true, direction: 'neutral' };
    }

    const percentage = ((currentTotal - previousTotal) / previousTotal) * 100;
    const isPositive = percentage >= 0;
    const direction = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral';

    return { percentage: Math.abs(percentage), isPositive, direction };
  };

  const trend = calculateTrend();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.current,
        color: (opacity = 1) => colors.primary,
        strokeWidth: 2,
      },
      ...(data.previous && showComparison
        ? [
            {
              data: data.previous,
              color: (opacity = 1) => `rgba(${colors.textSecondary}, ${opacity})`,
              strokeWidth: 2,
            },
          ]
        : []),
    ],
    legend: showComparison && data.previous ? [currentLabel, previousLabel] : [currentLabel],
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {showTrendIndicator && trend.direction !== 'neutral' && (
            <View style={styles.trendContainer}>
              <Ionicons
                name={trend.direction === 'up' ? 'trending-up' : 'trending-down'}
                size={20}
                color={
                  trend.direction === 'up'
                    ? colors.success || '#10B981'
                    : colors.error || '#DC2626'
                }
              />
              <Text
                style={[
                  styles.trendText,
                  {
                    color:
                      trend.direction === 'up'
                        ? colors.success || '#10B981'
                        : colors.error || '#DC2626',
                  },
                ]}
              >
                {trend.percentage.toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
      </View>

      <LineChart
        data={chartData}
        height={height}
        bezier
        withDots={true}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        yAxisSuffix={yAxisSuffix}
      />

      {showComparison && data.previous && (
        <View style={styles.comparisonContainer}>
          <Text style={styles.comparisonText}>
            {trend.isPositive ? 'Increase' : 'Decrease'} of{' '}
            <Text style={styles.comparisonValue}>
              {trend.percentage.toFixed(1)}%
            </Text>{' '}
            compared to {previousLabel.toLowerCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typograph.h4,
    color: colors.text,
    fontWeight: '600',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  trendText: {
    ...typograph.bodySmall,
    fontWeight: '600',
  },
  comparisonContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  comparisonText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  comparisonValue: {
    fontWeight: '600',
    color: colors.text,
  },
});