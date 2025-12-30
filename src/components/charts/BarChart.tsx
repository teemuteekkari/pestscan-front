// src/components/charts/BarChart.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { BarChart as RNBarChart } from 'react-native-chart-kit';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

const screenWidth = Dimensions.get('window').width;

interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      color?: string;
    }>;
  };
  title?: string;
  height?: number;
  showLegend?: boolean;
  yAxisSuffix?: string;
  yAxisLabel?: string;
  style?: ViewStyle;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 220,
  showLegend = false,
  yAxisSuffix = '',
  yAxisLabel = '',
  style,
}) => {
  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.border,
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNBarChart
        data={data}
        width={screenWidth - spacing.lg * 2}
        height={height}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero
        showBarTops={false}
        showValuesOnTopOfBars
        style={styles.chart}
      />
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
});