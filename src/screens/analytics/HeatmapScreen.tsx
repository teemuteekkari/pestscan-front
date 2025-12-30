// src/screens/analytics/HeatMapScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { HeatMapChart } from '../../components/charts/HeatMapChart';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Row } from '../../components/layout/Row';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { 
  HeatmapResponse, 
  HeatmapCellResponse, 
  SeverityLevel,
  ObservationCategory 
} from '../../types/api.types';

interface HeatMapScreenProps {
  navigation: any;
  route: any;
}

type ViewMode = 'total' | 'pest' | 'disease' | 'beneficial' | 'severity';
type TargetType = 'all' | 'greenhouse' | 'fieldblock';

export const HeatMapScreen: React.FC<HeatMapScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('47');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [viewMode, setViewMode] = useState<ViewMode>('total');
  const [targetType, setTargetType] = useState<TargetType>('all');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);

  useEffect(() => {
    loadHeatmap();
  }, [selectedWeek, selectedYear, targetType, selectedTarget]);

  const loadHeatmap = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await heatmapService.getHeatmap(farmId, week, year, targetId);
      // setHeatmapData(data);

      // Mock data
      setHeatmapData(generateMockHeatmapData());
    } catch (error) {
      console.error('Failed to load heatmap:', error);
      Alert.alert('Error', 'Failed to load heatmap data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockHeatmapData = (): HeatmapResponse => {
    const cells: HeatmapCellResponse[] = [];
    
    for (let bay = 0; bay < 10; bay++) {
      for (let bench = 0; bench < 4; bench++) {
        const pestCount = Math.floor(Math.random() * 50);
        const diseaseCount = Math.floor(Math.random() * 30);
        const beneficialCount = Math.floor(Math.random() * 20);
        const totalCount = pestCount + diseaseCount + beneficialCount;
        
        cells.push({
          bayIndex: bay,
          benchIndex: bench,
          pestCount,
          diseaseCount,
          beneficialCount,
          totalCount,
          severityLevel: getSeverityLevel(totalCount),
          colorHex: getSeverityColor(getSeverityLevel(totalCount)),
        });
      }
    }

    return {
      farmId: '1',
      farmName: 'Green Valley Farm',
      week: 47,
      year: 2024,
      bayCount: 10,
      benchesPerBay: 4,
      cells,
      sections: [],
      severityLegend: [
        { level: 'ZERO', minInclusive: 0, maxInclusive: 0, colorHex: '#E5E7EB' },
        { level: 'LOW', minInclusive: 1, maxInclusive: 10, colorHex: '#10B981' },
        { level: 'MODERATE', minInclusive: 11, maxInclusive: 25, colorHex: '#FBBF24' },
        { level: 'HIGH', minInclusive: 26, maxInclusive: 50, colorHex: '#F59E0B' },
        { level: 'VERY_HIGH', minInclusive: 51, maxInclusive: 75, colorHex: '#EF4444' },
        { level: 'EMERGENCY', minInclusive: 76, maxInclusive: 999, colorHex: '#DC2626' },
      ],
    };
  };

  const getSeverityLevel = (count: number): SeverityLevel => {
    if (count === 0) return SeverityLevel.ZERO;
    if (count <= 10) return SeverityLevel.LOW;
    if (count <= 25) return SeverityLevel.MODERATE;
    if (count <= 50) return SeverityLevel.HIGH;
    if (count <= 75) return SeverityLevel.VERY_HIGH;
    return SeverityLevel.EMERGENCY;
  };

  const getSeverityColor = (level: SeverityLevel): string => {
    switch (level) {
      case SeverityLevel.ZERO:
        return '#E5E7EB';
      case SeverityLevel.LOW:
        return '#10B981';
      case SeverityLevel.MODERATE:
        return '#FBBF24';
      case SeverityLevel.HIGH:
        return '#F59E0B';
      case SeverityLevel.VERY_HIGH:
        return '#EF4444';
      case SeverityLevel.EMERGENCY:
        return '#DC2626';
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
    if (value === 0) return '#E5E7EB';
    if (value <= 10) return '#10B981';
    if (value <= 25) return '#FBBF24';
    if (value <= 50) return '#F59E0B';
    if (value <= 75) return '#EF4444';
    return '#DC2626';
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

  return (
    <Screen
      title="Heatmap"
      subtitle={`Week ${selectedWeek}, ${selectedYear}`}
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
      headerActions={[
        {
          icon: 'share',
          onPress: () => console.log('Share heatmap'),
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

      {/* Heatmap */}
      {loading ? (
        <Card padding="md">
          <Text style={styles.loadingText}>Loading heatmap...</Text>
        </Card>
      ) : (
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
            onPress={() => console.log('View hotspots')}
            variant="danger"
            size="sm"
            style={styles.alertButton}
          />
        </Card>
      )}

      {/* Legend Info */}
      <Card padding="md">
        <Text style={styles.cardTitle}>How to Read the Heatmap</Text>
        <View style={styles.infoItem}>
          <Ionicons name="square" size={16} color="#10B981" />
          <Text style={styles.infoText}>Green: Low activity (0-10 observations)</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="square" size={16} color="#FBBF24" />
          <Text style={styles.infoText}>Yellow: Moderate activity (11-25)</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="square" size={16} color="#F59E0B" />
          <Text style={styles.infoText}>Orange: High activity (26-50)</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="square" size={16} color="#EF4444" />
          <Text style={styles.infoText}>Red: Very high activity (51-75)</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="square" size={16} color="#DC2626" />
          <Text style={styles.infoText}>Dark Red: Emergency (76+)</Text>
        </View>
        <Divider marginVertical="sm" />
        <Text style={styles.infoNote}>
          Tap any cell to view detailed information about that specific location
        </Text>
      </Card>

      {/* Action Buttons */}
      <Row gap="md" style={styles.actionButtons}>
        <Button
          title="Generate Report"
          icon="document-text"
          onPress={() => navigation.navigate('Report')}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Export Data"
          icon="download"
          onPress={() => console.log('Export')}
          variant="outline"
          style={styles.actionButton}
        />
      </Row>
    </Screen>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    ...typograph.subtitle,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
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
  infoText: {
    ...typograph.bodySmall,
    color: colors.text,
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
export default HeatMapScreen