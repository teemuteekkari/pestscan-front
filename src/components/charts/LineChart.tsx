// src/components/charts/LineChart.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

const screenWidth = Dimensions.get('window').width;

interface LineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }>;
    legend?: string[];
  };
  title?: string;
  height?: number;
  bezier?: boolean;
  withDots?: boolean;
  withInnerLines?: boolean;
  withOuterLines?: boolean;
  withVerticalLines?: boolean;
  withHorizontalLines?: boolean;
  yAxisSuffix?: string;
  yAxisLabel?: string;
  style?: ViewStyle;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 220,
  bezier = false,
  withDots = true,
  withInnerLines = true,
  withOuterLines = true,
  withVerticalLines = false,
  withHorizontalLines = true,
  yAxisSuffix = '',
  yAxisLabel = '',
  style,
}) => {
  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.border,
      strokeWidth: 1,
    },
  };

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNLineChart
        data={data}
        width={screenWidth - spacing.lg * 2}
        height={height}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        chartConfig={chartConfig}
        bezier={bezier}
        withDots={withDots}
        withInnerLines={withInnerLines}
        withOuterLines={withOuterLines}
        withVerticalLines={withVerticalLines}
        withHorizontalLines={withHorizontalLines}
        style={styles.chart}
        fromZero
      />
      {data.legend && data.legend.length > 0 && (
        <View style={styles.legend}>
          {data.legend.map((label, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor:
                      data.datasets[index]?.color?.(1) || colors.primary,
                  },
                ]}
              />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
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
  title: {
    ...typograph.h4,
    color: colors.text,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  chart: {
    borderRadius: borderRadius.md,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...typograph.caption,
    color: colors.textSecondary,
  },
});