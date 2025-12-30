// src/screens/analytics/MonthlyReportScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatCard, StatCardGrid } from '../../components/cards/StatCard';
import { Row } from '../../components/layout/Row';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface MonthlyReportScreenProps {
  navigation: any;
  route: any;
}

export const MonthlyReportScreen: React.FC<MonthlyReportScreenProps> = ({
  navigation,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('11');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(false);

  const monthlyData = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [{
      data: [145, 178, 162, 195],
    }],
  };

  const categoryData = {
    labels: ['Pests', 'Diseases', 'Beneficial'],
    datasets: [{
      data: [345, 187, 98],
    }],
  };

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Screen
      title="Monthly Report"
      subtitle="November 2024"
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
      headerActions={[
        {
          icon: 'share',
          onPress: () => console.log('Export'),
          label: 'Export',
        },
      ]}
    >
      {/* Month Selection */}
      <Card padding="md" style={styles.selectionCard}>
        <Text style={styles.cardTitle}>Select Period</Text>
        <Row gap="md">
          <Input
            label="Month"
            value={selectedMonth}
            onChangeText={setSelectedMonth}
            keyboardType="number-pad"
            placeholder="1-12"
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
          title="Generate Report"
          icon="refresh"
          onPress={handleGenerateReport}
          loading={loading}
          style={styles.generateButton}
        />
      </Card>

      {/* Monthly Stats */}
      <StatCardGrid columns={2}>
        <StatCard
          title="Total Observations"
          value={630}
          icon="eye"
          variant="info"
          trend={{ value: 15.2, isPositive: true }}
        />
        <StatCard
          title="Sessions"
          value={24}
          icon="calendar"
          variant="success"
          subtitle="100% complete"
        />
        <StatCard
          title="Avg per Week"
          value={157}
          icon="trending-up"
          variant="default"
        />
        <StatCard
          title="Coverage"
          value="95%"
          icon="grid"
          variant="success"
        />
      </StatCardGrid>

      {/* Weekly Breakdown */}
      <BarChart
        title="Weekly Observations"
        data={monthlyData}
        height={220}
      />

      {/* Category Distribution */}
      <BarChart
        title="Category Distribution"
        data={categoryData}
        height={220}
      />

      {/* Monthly Highlights */}
      <Card padding="md">
        <Text style={styles.cardTitle}>Monthly Highlights</Text>
        
        <View style={styles.highlightSection}>
          <Text style={styles.highlightTitle}>🔴 Critical Issues</Text>
          <Text style={styles.highlightText}>
            • Peak thrips population in Week 3{'\n'}
            • Disease outbreak in Greenhouse 2{'\n'}
            • Emergency intervention required in Bay 5
          </Text>
        </View>

        <View style={styles.highlightSection}>
          <Text style={styles.highlightTitle}>⚠️ Warnings</Text>
          <Text style={styles.highlightText}>
            • Increasing mite population trend{'\n'}
            • Humidity levels above optimal in Week 2{'\n'}
            • Reduced beneficial organism count
          </Text>
        </View>

        <View style={styles.highlightSection}>
          <Text style={styles.highlightTitle}>✅ Improvements</Text>
          <Text style={styles.highlightText}>
            • 25% reduction in whitefly population{'\n'}
            • Successful biological control in Bay 1-3{'\n'}
            • No emergency cases in final week
          </Text>
        </View>
      </Card>

      {/* Recommendations */}
      <Card padding="md">
        <Text style={styles.cardTitle}>Recommendations</Text>
        <View style={styles.recommendation}>
          <Text style={styles.recommendationNumber}>1</Text>
          <Text style={styles.recommendationText}>
            Increase beneficial organism release in affected areas
          </Text>
        </View>
        <View style={styles.recommendation}>
          <Text style={styles.recommendationNumber}>2</Text>
          <Text style={styles.recommendationText}>
            Monitor humidity levels more closely in Greenhouse 2
          </Text>
        </View>
        <View style={styles.recommendation}>
          <Text style={styles.recommendationNumber}>3</Text>
          <Text style={styles.recommendationText}>
            Consider chemical intervention for persistent thrips population
          </Text>
        </View>
      </Card>

      <Button
        title="Export PDF Report"
        icon="download"
        onPress={() => console.log('Export PDF')}
        variant="primary"
        style={styles.exportButton}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  selectionCard: {
    marginBottom: spacing.md,
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
  generateButton: {
    marginTop: spacing.sm,
  },
  highlightSection: {
    marginBottom: spacing.md,
  },
  highlightTitle: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  highlightText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  recommendationNumber: {
    ...typograph.body,
    color: colors.surface,
    fontWeight: '700',
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  recommendationText: {
    ...typograph.body,
    color: colors.text,
    flex: 1,
  },
  exportButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
export default MonthlyReportScreen