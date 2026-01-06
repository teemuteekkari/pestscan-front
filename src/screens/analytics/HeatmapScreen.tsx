// src/screens/analytics/HeatMapScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { HeatMapChart } from '../../components/charts/HeatMapChart';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Row } from '../../components/layout/Row';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { 
  HeatmapResponse, 
  HeatmapCellResponse, 
  SeverityLevel,
} from '../../types/api.types';
import { analyticsService } from '../../services/analytics.service';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsNavigator';

type Props = NativeStackScreenProps<AnalyticsStackParamList, 'Heatmap'>;

type ViewMode = 'total' | 'pest' | 'disease' | 'beneficial' | 'severity';

// Helper to get current week number
const getCurrentWeek = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
};

export const HeatMapScreen: React.FC<Props> = ({ navigation, route }) => {
  const farmId = route.params?.farmId;
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [viewMode, setViewMode] = useState<ViewMode>('total');
  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);

  useEffect(() => {
    if (farmId) {
      loadHeatmap();
    }
  }, [farmId, selectedWeek, selectedYear]);

  const loadHeatmap = async () => {
    if (!farmId) {
      Alert.alert('Error', 'No farm selected');
      return;
    }

    const week = parseInt(selectedWeek, 10);
    const year = parseInt(selectedYear, 10);

    // Validate inputs
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
      const data = await analyticsService.getHeatmap(farmId, week, year);
      setHeatmapData(data);
    } catch (error) {
      console.error('Failed to load heatmap:', error);
      Alert.alert('Error', 'Failed to load heatmap data');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (level: SeverityLevel): string => {
    switch (level) {
      case SeverityLevel.ZERO:
        return '#2ecc71';
      case SeverityLevel.LOW:
        return '#f1c40f';
      case SeverityLevel.MODERATE:
        return '#e67e22';
      case SeverityLevel.HIGH:
        return '#e74c3c';
      case SeverityLevel.VERY_HIGH:
        return '#c0392b';
      case SeverityLevel.EMERGENCY:
        return '#7f0000';
      default:
        return colors.border;
    }
  };

  const getCellColor = (cell: HeatmapCellResponse): string => {
    switch (viewMode) {
      case 'pest':
        return getHeatColor(cell.pestCount);
      case 'disease':
        return getHeatColor(cell.diseaseCount);
      case 'beneficial':
        return getHeatColor(cell.beneficialCount);
      case 'severity':
        return cell.colorHex;
      case 'total':
      default:
        return getHeatColor(cell.totalCount);
    }
  };

  const getHeatColor = (value: number): string => {
    if (value === 0) return '#2ecc71';
    if (value <= 5) return '#f1c40f';
    if (value <= 10) return '#e67e22';
    if (value <= 20) return '#e74c3c';
    if (value <= 30) return '#c0392b';
    return '#7f0000';
  };

  const getCellValue = (cell: HeatmapCellResponse): number => {
    switch (viewMode) {
      case 'pest':
        return cell.pestCount;
      case 'disease':
        return cell.diseaseCount;
      case 'beneficial':
        return cell.beneficialCount;
      case 'total':
      default:
        return cell.totalCount;
    }
  };

  const handleCellPress = (cell: any) => {
    const cellData = heatmapData?.cells.find(
      c => c.bayIndex === cell.row && c.benchIndex === cell.col
    );
    
    if (cellData) {
      Alert.alert(
        `Bay ${cell.row + 1}, Bench ${cell.col + 1}`,
        `Total: ${cellData.totalCount}\n` +
        `Pests: ${cellData.pestCount}\n` +
        `Diseases: ${cellData.diseaseCount}\n` +
        `Beneficial: ${cellData.beneficialCount}\n` +
        `Severity: ${cellData.severityLevel}`,
        [
          { text: 'View Details', onPress: () => console.log('View details') },
          { text: 'OK', style: 'cancel' },
        ]
      );
    }
  };

  const viewModes: { value: ViewMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'total', label: 'Total', icon: 'apps' },
    { value: 'pest', label: 'Pests', icon: 'bug' },
    { value: 'disease', label: 'Disease', icon: 'warning' },
    { value: 'beneficial', label: 'Beneficial', icon: 'shield-checkmark' },
    { value: 'severity', label: 'Severity', icon: 'alert-circle' },
  ];

  const prepareHeatmapData = () => {
    if (!heatmapData) return { data: [], rowLabels: [], columnLabels: [], legend: [] };

    const rowLabels = Array.from(
      { length: heatmapData.bayCount },
      (_, i) => `Bay ${i + 1}`
    );

    const columnLabels = Array.from(
      { length: heatmapData.benchesPerBay },
      (_, i) => `B${i + 1}`
    );

    const data = heatmapData.cells.map(cell => ({
      row: cell.bayIndex,
      col: cell.benchIndex,
      value: getCellValue(cell),
      color: getCellColor(cell),
      label: viewMode === 'severity' ? cell.severityLevel.substring(0, 3) : undefined,
    }));

    const legend = heatmapData.severityLegend.map(item => ({
      label: item.level,
      color: item.colorHex,
      min: item.minInclusive,
      max: item.maxInclusive,
    }));

    return { data, rowLabels, columnLabels, legend };
  };

  const { data, rowLabels, columnLabels, legend } = prepareHeatmapData();

  const getStats = () => {
    if (!heatmapData) return { total: 0, avg: 0, max: 0, hotspots: 0 };

    const total = heatmapData.cells.reduce((sum, cell) => sum + cell.totalCount, 0);
    const avg = Math.round(total / heatmapData.cells.length);
    const max = Math.max(...heatmapData.cells.map(cell => cell.totalCount));
    const hotspots = heatmapData.cells.filter(
      cell => cell.severityLevel === SeverityLevel.VERY_HIGH || 
              cell.severityLevel === SeverityLevel.EMERGENCY
    ).length;

    return { total, avg, max, hotspots };
  };

  const stats = getStats();

  if (!farmId) {
    return (
      <Screen title="Heatmap">
        <View style={styles.emptyContainer}>
          <Text>No farm selected</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      title="Heatmap"
      subtitle={heatmapData ? `${heatmapData.farmName} - Week ${heatmapData.week}, ${heatmapData.year}` : undefined}
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
      headerActions={[
        {
          icon: 'share',
          onPress: () => Alert.alert('Coming Soon', 'Share feature coming soon'),
          label: 'Share',
        },
      ]}
    >
      {/* Period Selection */}
      <Card padding="md">
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
          title="Load Heatmap"
          icon="refresh"
          onPress={loadHeatmap}
          loading={loading}
          style={styles.loadButton}
        />
      </Card>

      {/* View Mode Selector */}
      <Card padding="md">
        <Text style={styles.cardTitle}>View Mode</Text>
        <View style={styles.modeGrid}>
          {viewModes.map((mode) => (
            <TouchableOpacity
              key={mode.value}
              style={[
                styles.modeButton,
                viewMode === mode.value && styles.modeButtonActive,
              ]}
              onPress={() => setViewMode(mode.value)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={mode.icon}
                size={20}
                color={viewMode === mode.value ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  viewMode === mode.value && styles.modeButtonTextActive,
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Stats Overview */}
      {heatmapData && (
        <Card padding="md">
          <Text style={styles.cardTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={20} color={colors.primary} />
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="analytics" size={20} color={colors.primary} />
              <Text style={styles.statValue}>{stats.avg}</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="arrow-up" size={20} color={colors.error} />
              <Text style={styles.statValue}>{stats.max}</Text>
              <Text style={styles.statLabel}>Maximum</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={20} color={colors.error} />
              <Text style={styles.statValue}>{stats.hotspots}</Text>
              <Text style={styles.statLabel}>Hotspots</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Heatmap */}
      {loading ? (
        <Card padding="md">
          <Text style={styles.loadingText}>Loading heatmap...</Text>
        </Card>
      ) : heatmapData ? (
        <HeatMapChart
          title={`${viewModes.find(m => m.value === viewMode)?.label} Heatmap`}
          data={data}
          rowLabels={rowLabels}
          columnLabels={columnLabels}
          cellSize={50}
          showValues={viewMode !== 'severity'}
          legend={viewMode === 'severity' ? legend : undefined}
          onCellPress={handleCellPress}
        />
      ) : (
        <Card padding="md">
          <Text style={styles.emptyText}>
            Select a week and year, then tap "Load Heatmap" to view data
          </Text>
        </Card>
      )}

      {/* Hotspot Analysis */}
      {stats.hotspots > 0 && (
        <Card padding="md" style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Ionicons name="warning" size={24} color={colors.error} />
            <Text style={styles.alertTitle}>
              {stats.hotspots} Critical {stats.hotspots === 1 ? 'Area' : 'Areas'} Detected
            </Text>
          </View>
          <Text style={styles.alertText}>
            High pest/disease concentrations require immediate attention
          </Text>
          <Button
            title="View Hotspot Details"
            icon="list"
            onPress={() => Alert.alert('Coming Soon', 'Hotspot details coming soon')}
            variant="danger"
            size="sm"
            style={styles.alertButton}
          />
        </Card>
      )}

      {/* Legend Info */}
      {heatmapData && (
        <Card padding="md">
          <Text style={styles.cardTitle}>Severity Legend</Text>
          {heatmapData.severityLegend.map((item, index) => (
            <View key={index} style={styles.infoItem}>
              <View style={[styles.colorBox, { backgroundColor: item.colorHex }]} />
              <Text style={styles.infoText}>
                {item.level}: {item.minInclusive}-{item.maxInclusive === 2147483647 ? '∞' : item.maxInclusive} observations
              </Text>
            </View>
          ))}
          <Divider marginVertical="sm" />
          <Text style={styles.infoNote}>
            Tap any cell to view detailed information about that specific location
          </Text>
        </Card>
      )}

      {/* Action Buttons */}
      <Row gap="md" style={styles.actionButtons}>
        <Button
          title="Generate Report"
          icon="document-text"
          onPress={() => Alert.alert('Coming Soon', 'Report generation coming soon')}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Export Data"
          icon="download"
          onPress={() => Alert.alert('Coming Soon', 'Export feature coming soon')}
          variant="outline"
          style={styles.actionButton}
        />
      </Row>
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
  cardTitle: {
    ...typograph.subtitle,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
  },
  loadButton: {
    marginTop: spacing.md,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  modeButtonActive: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  modeButtonText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  statValue: {
    ...typograph.h3,
    color: colors.text,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  loadingText: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
  alertCard: {
    backgroundColor: `${colors.error}10`,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  alertTitle: {
    ...typograph.subtitle,
    color: colors.error,
    fontWeight: '600',
    flex: 1,
  },
  alertText: {
    ...typograph.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  alertButton: {
    alignSelf: 'flex-start',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    ...typograph.bodySmall,
    color: colors.text,
    flex: 1,
  },
  infoNote: {
    ...typograph.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  actionButtons: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
});

export default HeatMapScreen;