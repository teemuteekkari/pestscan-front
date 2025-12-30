// src/components/charts/HeatMapChart.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface HeatMapCell {
  row: number;
  col: number;
  value: number;
  color: string;
  label?: string;
}

interface HeatMapChartProps {
  data: HeatMapCell[];
  title?: string;
  rowLabels: string[];
  columnLabels: string[];
  cellSize?: number;
  showValues?: boolean;
  legend?: Array<{
    label: string;
    color: string;
    min: number;
    max: number;
  }>;
  onCellPress?: (cell: HeatMapCell) => void;
  style?: ViewStyle;
}

export const HeatMapChart: React.FC<HeatMapChartProps> = ({
  data,
  title,
  rowLabels,
  columnLabels,
  cellSize = 40,
  showValues = false,
  legend,
  onCellPress,
  style,
}) => {
  const getCell = (row: number, col: number): HeatMapCell | undefined => {
    return data.find((cell) => cell.row === row && cell.col === col);
  };

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={[styles.headerCell, { width: cellSize, height: cellSize }]} />
            {columnLabels.map((label, index) => (
              <View
                key={index}
                style={[styles.headerCell, { width: cellSize, height: cellSize }]}
              >
                <Text style={styles.headerText} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {rowLabels.map((rowLabel, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {/* Row Label */}
              <View
                style={[styles.rowLabelCell, { width: cellSize, height: cellSize }]}
              >
                <Text style={styles.rowLabelText} numberOfLines={1}>
                  {rowLabel}
                </Text>
              </View>

              {/* Data Cells */}
              {columnLabels.map((_, colIndex) => {
                const cell = getCell(rowIndex, colIndex);
                return (
                  <View
                    key={colIndex}
                    style={[
                      styles.cell,
                      {
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: cell?.color || colors.border,
                      },
                    ]}
                    onTouchEnd={() => cell && onCellPress?.(cell)}
                  >
                    {showValues && cell && (
                      <Text style={styles.cellValue}>{cell.value}</Text>
                    )}
                    {cell?.label && (
                      <Text style={styles.cellLabel} numberOfLines={1}>
                        {cell.label}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      {legend && legend.length > 0 && (
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendItems}>
            {legend.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>
                  {item.label} ({item.min}-{item.max})
                </Text>
              </View>
            ))}
          </View>
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
  scrollContent: {
    paddingRight: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  headerText: {
    ...typograph.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  rowLabelCell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  rowLabelText: {
    ...typograph.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cellValue: {
    ...typograph.caption,
    color: colors.text,
    fontWeight: '600',
  },
  cellLabel: {
    ...typograph.caption,
    color: colors.text,
    fontSize: 8,
  },
  legend: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendTitle: {
    ...typograph.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendText: {
    ...typograph.caption,
    color: colors.textSecondary,
  },
});