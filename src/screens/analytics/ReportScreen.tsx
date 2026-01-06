// src/screens/analytics/ReportScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Row } from '../../components/layout/Row';
import { Divider } from '../../components/layout/Divider';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { analyticsService } from '../../services/analytics.service';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsNavigator';
import { ReportExportRequest } from '../../types/api.types'

type Props = NativeStackScreenProps<AnalyticsStackParamList, 'Report'>;

type ReportType = 'weekly' | 'monthly' | 'quarterly' | 'custom';
type ExportFormat = 'pdf' | 'excel' | 'csv';

export const ReportScreen: React.FC<Props> = ({ navigation, route }) => {
  const farmId = route.params?.farmId;
  const [reportType, setReportType] = useState<ReportType>('monthly');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    observations: true,
    charts: true,
    heatmaps: true,
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

  const handleGenerateReport = async () => {
  if (!farmId) {
    Alert.alert('Error', 'No farm selected');
    return;
  }

  // Validate inputs based on report type
  if (reportType === 'monthly') {
    const year = parseInt(selectedYear, 10);
    const month = parseInt(selectedMonth, 10);

    if (isNaN(year) || year < 2000 || year > 2100) {
      Alert.alert('Invalid Year', 'Please enter a valid year');
      return;
    }

    if (isNaN(month) || month < 1 || month > 12) {
      Alert.alert('Invalid Month', 'Please enter a month between 1 and 12');
      return;
    }

    // ✅ Just navigate with parameters, let MonthlyReportScreen fetch the data
    navigation.navigate('MonthlyReport', { 
      farmId, 
      year, 
      month,
    });
      
  } else if (reportType === 'custom') {
    // ✅ Use the export endpoint for custom date ranges
    await handleExportReport();
  } else {
    // Weekly and Quarterly not implemented yet
    Alert.alert(
      'Coming Soon',
      `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} reports will be available soon`
    );
  }
};

  const handleExportReport = async () => {
  if (!farmId) {
    Alert.alert('Error', 'No farm selected');
    return;
  }

  if (!startDate || !endDate) {
    Alert.alert('Error', 'Please select start and end dates');
    return;
  }

  try {
    setLoading(true);

    const exportRequest: ReportExportRequest = {
      farmId,
      startDate,
      endDate,
      format: exportFormat.toUpperCase() as 'PDF' | 'EXCEL' | 'CSV',
      sections: selectedSections,
    };

    const response = await analyticsService.exportReport(exportRequest);

    // Open download URL or show success
    Alert.alert(
      'Export Ready',
      `Your ${exportFormat.toUpperCase()} report is ready for download.\n\nFile: ${response.fileName}\nSize: ${(response.fileSize / 1024).toFixed(2)} KB`,
      [
        {
          text: 'Download',
          onPress: () => {
            // Open URL in browser or download
            // Linking.openURL(response.downloadUrl);
            console.log('Download URL:', response.downloadUrl);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  } catch (error) {
    console.error('Export failed:', error);
    Alert.alert('Error', 'Failed to export report');
  } finally {
    setLoading(false);
  }
};

  const getMonthName = (month: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || '';
  };

  if (!farmId) {
    return (
      <Screen title="Reports">
        <View style={styles.emptyContainer}>
          <Text>No farm selected</Text>
        </View>
      </Screen>
    );
  }

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
              {type.value !== 'monthly' && (
                <Badge label="Soon" variant="info" size="sm" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Monthly Report Parameters */}
      {reportType === 'monthly' && (
        <Card padding="md">
          <Text style={styles.cardTitle}>Report Period</Text>
          <Row gap="md">
            <Input
              label="Year"
              value={selectedYear}
              onChangeText={setSelectedYear}
              keyboardType="number-pad"
              placeholder="2024"
              containerStyle={styles.input}
            />
            <Input
              label="Month"
              value={selectedMonth}
              onChangeText={setSelectedMonth}
              keyboardType="number-pad"
              placeholder="1-12"
              containerStyle={styles.input}
            />
          </Row>
          <Text style={styles.periodPreview}>
            {getMonthName(parseInt(selectedMonth, 10))} {selectedYear}
          </Text>
        </Card>
      )}

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
        {exportFormat !== 'pdf' && (
          <Text style={styles.formatNote}>
            Note: {exportFormat.toUpperCase()} export via API endpoint (coming soon)
          </Text>
        )}
      </Card>

      {/* Preview Info */}
      <Card padding="md" style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Report will include data from {
              reportType === 'monthly' 
                ? `${getMonthName(parseInt(selectedMonth, 10))} ${selectedYear}`
                : reportType === 'custom' 
                  ? 'selected date range' 
                  : `last ${reportType} period`
            }
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
        title={`Generate Report`}
        icon="document-text"
        onPress={handleGenerateReport}
        loading={loading}
        disabled={
          (reportType === 'custom' && (!startDate || !endDate)) ||
          (reportType === 'monthly' && (!selectedYear || !selectedMonth))
        }
        size="lg"
        style={styles.generateButton}
      />
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
  periodPreview: {
    ...typograph.body,
    color: colors.primary,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontWeight: '600',
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
  formatNote: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
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

export default ReportScreen;