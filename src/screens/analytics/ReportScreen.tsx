// src/screens/analytics/ReportScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Row } from '../../components/layout/Row';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

interface ReportScreenProps {
  navigation: any;
  route: any;
}

type ReportType = 'weekly' | 'monthly' | 'quarterly' | 'custom';
type ExportFormat = 'pdf' | 'excel' | 'csv';

export const ReportScreen: React.FC<ReportScreenProps> = ({ navigation }) => {
  const [reportType, setReportType] = useState<ReportType>('weekly');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    observations: true,
    charts: true,
    heatmaps: false,
    recommendations: true,
    photos: false,
  });

  const reportTypes: { value: ReportType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'weekly', label: 'Weekly', icon: 'calendar' },
    { value: 'monthly', label: 'Monthly', icon: 'calendar-outline' },
    { value: 'quarterly', label: 'Quarterly', icon: 'calendar-sharp' },
    { value: 'custom', label: 'Custom', icon: 'create' },
  ];

  const exportFormats: { value: ExportFormat; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'pdf', label: 'PDF', icon: 'document-text' },
    { value: 'excel', label: 'Excel', icon: 'grid' },
    { value: 'csv', label: 'CSV', icon: 'list' },
  ];

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleGenerateReport = () => {
    setLoading(true);
    // TODO: Implement report generation
    setTimeout(() => {
      setLoading(false);
      // Navigate to generated report or show success
    }, 2000);
  };

  return (
    <Screen
      title="Custom Report"
      subtitle="Generate & Export Reports"
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
    >
      {/* Report Type Selection */}
      <Card padding="md">
        <Text style={styles.cardTitle}>Report Type</Text>
        <View style={styles.typeGrid}>
          {reportTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeButton,
                reportType === type.value && styles.typeButtonActive,
              ]}
              onPress={() => setReportType(type.value)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={type.icon}
                size={24}
                color={reportType === type.value ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  reportType === type.value && styles.typeButtonTextActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Date Range (for custom reports) */}
      {reportType === 'custom' && (
        <Card padding="md">
          <Text style={styles.cardTitle}>Date Range</Text>
          <Input
            label="Start Date"
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            leftIcon="calendar"
          />
          <Input
            label="End Date"
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
            leftIcon="calendar"
          />
        </Card>
      )}

      {/* Report Sections */}
      <Card padding="md">
        <Text style={styles.cardTitle}>Include Sections</Text>
        
        {Object.entries(selectedSections).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={styles.sectionItem}
            onPress={() => toggleSection(key as keyof typeof selectedSections)}
            activeOpacity={0.7}
          >
            <View style={styles.sectionLeft}>
              <Ionicons
                name={value ? 'checkbox' : 'square-outline'}
                size={24}
                color={value ? colors.primary : colors.textSecondary}
              />
              <Text style={styles.sectionText}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </View>
            {key === 'heatmaps' && (
              <Badge label="Premium" variant="warning" size="sm" />
            )}
            {key === 'photos' && (
              <Badge label="Large File" variant="info" size="sm" />
            )}
          </TouchableOpacity>
        ))}
      </Card>

      {/* Export Format */}
      <Card padding="md">
        <Text style={styles.cardTitle}>Export Format</Text>
        <Row gap="sm">
          {exportFormats.map((format) => (
            <TouchableOpacity
              key={format.value}
              style={[
                styles.formatButton,
                exportFormat === format.value && styles.formatButtonActive,
              ]}
              onPress={() => setExportFormat(format.value)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={format.icon}
                size={20}
                color={exportFormat === format.value ? colors.surface : colors.textSecondary}
              />
              <Text
                style={[
                  styles.formatButtonText,
                  exportFormat === format.value && styles.formatButtonTextActive,
                ]}
              >
                {format.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Row>
      </Card>

      {/* Preview Info */}
      <Card padding="md" style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Report will include data from {reportType === 'custom' ? 'selected date range' : `last ${reportType} period`}
          </Text>
        </View>
        <Divider marginVertical="sm" />
        <View style={styles.infoRow}>
          <Ionicons name="document" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            {Object.values(selectedSections).filter(Boolean).length} sections selected
          </Text>
        </View>
        <Divider marginVertical="sm" />
        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Estimated generation time: 10-30 seconds
          </Text>
        </View>
      </Card>

      {/* Generate Button */}
      <Button
        title={`Generate ${exportFormat.toUpperCase()} Report`}
        icon="download"
        onPress={handleGenerateReport}
        loading={loading}
        disabled={reportType === 'custom' && (!startDate || !endDate)}
        size="lg"
        style={styles.generateButton}
      />
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.xs,
  },
  typeButtonActive: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  typeButtonText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  sectionText: {
    ...typograph.body,
    color: colors.text,
  },
  formatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formatButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  formatButtonText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  formatButtonTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: `${colors.info}10`,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    ...typograph.bodySmall,
    color: colors.text,
    flex: 1,
  },
  generateButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
export default ReportScreen