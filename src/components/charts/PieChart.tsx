// src/components/charts/PieChart.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface PieChartData {
  name: string;
  value: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  size?: number;
  hasLegend?: boolean;
  accessor?: string;
  backgroundColor?: string;
  paddingLeft?: string;
  center?: [number, number];
  absolute?: boolean;
  style?: ViewStyle;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  size = 180,
  hasLegend = true,
  accessor = 'value',
  backgroundColor = 'transparent',
  paddingLeft = '15',
  absolute = false,
  style,
}) => {
  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
  };

  // Format data for the chart
  const chartData = data.map((item) => ({
    ...item,
    legendFontColor: item.legendFontColor || colors.textSecondary,
    legendFontSize: item.legendFontSize || 12,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <RNPieChart
        data={chartData}
        width={size + 100}
        height={size}
        chartConfig={chartConfig}
        accessor={accessor}
        backgroundColor={backgroundColor}
        paddingLeft={paddingLeft}
        hasLegend={hasLegend}
        absolute={absolute}
        center={[0, 0]}
      />
      {total > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{total}</Text>
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
    alignItems: 'center',
  },
  title: {
    ...typograph.h4,
    color: colors.text,
    marginBottom: spacing.md,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  totalContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  totalLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  totalValue: {
    ...typograph.h2,
    color: colors.primary,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
});