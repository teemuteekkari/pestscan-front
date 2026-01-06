// src/screens/dashboard/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Button, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardStackParamList } from '../../navigation/DashboardNavigator';
import { useAuth } from '../../store/AuthContext';
import { farmService } from '../../services/farm.service';
import { analyticsService } from '../../services/analytics.service';
import { Role, FarmResponse, DashboardSummaryDto } from '../../types/api.types';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';
import { getCurrentWeek } from '../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Auth: undefined;
  Main: {
    screen: string;
    params?: any;
  };
};

type Props = NativeStackScreenProps<DashboardStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = useNavigation<any>();
  const { user } = useAuth();
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [currentFarm, setCurrentFarm] = useState<FarmResponse | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (currentFarm) {
      loadDashboardSummary(currentFarm.id);
    }
  }, [currentFarm]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const farmsData = await farmService.getFarms();
      setFarms(farmsData);
      
      // Set first farm as current if available
      if (farmsData.length > 0 && !currentFarm) {
        const firstFarm = farmsData[0];
        setCurrentFarm(firstFarm);
        await loadDashboardSummary(firstFarm.id);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load farms');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardSummary = async (farmId: string) => {
    try {
      const summary = await analyticsService.getDashboardSummary(farmId);
      setDashboardData(summary);
    } catch (error) {
      console.error('Failed to load dashboard summary:', error);
      // Don't show alert here - farm might not have data yet
      setDashboardData(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleFarmSelect = () => {
    navigation.navigate('FarmList');
  };

  const handleFarmChange = async (farm: FarmResponse) => {
    setCurrentFarm(farm);
    await loadDashboardSummary(farm.id);
  };

  const handleNewSession = () => {
    if (currentFarm) {
      // TODO: Navigate to create session screen when implemented
      navigation.navigate('FarmDetail', { farmId: currentFarm.id });
    } else {
      Alert.alert('No Farm Selected', 'Please select a farm first');
    }
  };

  const handleViewAnalytics = () => {
    if (currentFarm) {
      // Navigate to Analytics tab first, then to the specific screen
      rootNavigation.navigate('Analytics', { 
        screen: 'Dashboard',
        params: { farmId: currentFarm.id }
      });
    } else {
      Alert.alert('No Farm Selected', 'Please select a farm first');
    }
  };

  const handleViewReports = () => {
    if (currentFarm) {
      rootNavigation.navigate('Analytics', { 
        screen: 'Report',
        params: { farmId: currentFarm.id }
      });
    } else {
      Alert.alert('No Farm Selected', 'Please select a farm first');
    }
  };

  // Helper function to check user roles
  const hasRole = (roles: Role | Role[]): boolean => {
    if (!user?.role) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // Calculate active sessions (in progress)
  const activeSessions = dashboardData?.totalSessions 
    ? dashboardData.totalSessions - (dashboardData.totalSessions || 0)
    : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.firstName || 'User'}!</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.farmSelector}
          onPress={handleFarmSelect}
        >
          <Ionicons name="business" size={20} color={colors.primary} />
          <Text style={styles.farmName} numberOfLines={1}>
            {currentFarm?.name || 'Select Farm'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* KPI Cards */}
      {dashboardData && (
        <View style={styles.kpiContainer}>
          <KPICard
            title="Total Sessions"
            value={dashboardData.totalSessions}
            icon="calendar"
            color={colors.info}
            subtitle="All time"
          />
          <KPICard
            title="Active Scouts"
            value={dashboardData.activeScouts}
            icon="people"
            color={colors.success}
            subtitle="Working now"
          />
          <KPICard
            title="Pests This Week"
            value={dashboardData.pestsDetectedThisWeek}
            icon="bug"
            color={colors.error}
            subtitle={`Week ${getCurrentWeek()}`}
          />
          <KPICard
            title="Avg Severity"
            value={dashboardData.averageSeverityThisWeek.toFixed(1)}
            icon="alert-circle"
            color={
              dashboardData.averageSeverityThisWeek > dashboardData.averageSeverityLastWeek
                ? colors.error
                : colors.success
            }
            subtitle={
              dashboardData.averageSeverityThisWeek > dashboardData.averageSeverityLastWeek
                ? '↑ Increasing'
                : '↓ Decreasing'
            }
          />
        </View>
      )}

      {/* Severity Comparison Card */}
      {dashboardData && (
        <Card style={[styles.severityCard, shadows.sm]}>
          <Card.Content>
            <Text style={styles.cardTitle}>Severity Trend</Text>
            <View style={styles.severityComparison}>
              <View style={styles.severityItem}>
                <Text style={styles.severityLabel}>This Week</Text>
                <Text style={[styles.severityValue, { color: colors.primary }]}>
                  {dashboardData.averageSeverityThisWeek.toFixed(2)}
                </Text>
              </View>
              <View style={styles.severityDivider} />
              <View style={styles.severityItem}>
                <Text style={styles.severityLabel}>Last Week</Text>
                <Text style={[styles.severityValue, { color: colors.textSecondary }]}>
                  {dashboardData.averageSeverityLastWeek.toFixed(2)}
                </Text>
              </View>
            </View>
            {dashboardData.averageSeverityThisWeek > dashboardData.averageSeverityLastWeek && (
              <View style={styles.warningBanner}>
                <Ionicons name="warning" size={20} color={colors.error} />
                <Text style={styles.warningText}>
                  Severity is increasing - review alerts
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      {hasRole([Role.MANAGER, Role.FARM_ADMIN, Role.SUPER_ADMIN]) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.primary }]}
              onPress={handleNewSession}
            >
              <Ionicons name="add-circle" size={40} color={colors.surface} />
              <Text style={styles.actionText}>New Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.secondary }]}
              onPress={handleViewAnalytics}
            >
              <Ionicons name="analytics" size={40} color={colors.surface} />
              <Text style={styles.actionText}>View Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.accent }]}
              onPress={handleViewReports}
            >
              <Ionicons name="document-text" size={40} color={colors.surface} />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.warning }]}
              onPress={handleFarmSelect}
            >
              <Ionicons name="settings" size={40} color={colors.surface} />
              <Text style={styles.actionText}>Manage Farms</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Empty State */}
      {farms.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="business-outline" size={80} color={colors.border} />
          <Text style={styles.emptyTitle}>No Farms Yet</Text>
          <Text style={styles.emptyText}>
            {hasRole(Role.SCOUT)
              ? 'Wait for your manager to add you to a farm'
              : 'Create your first farm to get started'}
          </Text>
          {hasRole([Role.MANAGER, Role.FARM_ADMIN, Role.SUPER_ADMIN]) && (
            <Button
              mode="contained"
              onPress={handleFarmSelect}
              style={styles.emptyButton}
            >
              Add Farm
            </Button>
          )}
        </View>
      )}

      {/* No Data State */}
      {farms.length > 0 && !dashboardData && (
        <Card style={[styles.noDataCard, shadows.sm]}>
          <Card.Content style={styles.noDataContent}>
            <Ionicons name="information-circle-outline" size={60} color={colors.info} />
            <Text style={styles.noDataTitle}>No Data Yet</Text>
            <Text style={styles.noDataText}>
              Start scouting to see analytics and insights
            </Text>
            <Button
              mode="contained"
              onPress={handleNewSession}
              style={styles.noDataButton}
            >
              Start First Session
            </Button>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

// KPI Card Component
interface KPICardProps {
  title: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card style={[styles.kpiCard, shadows.sm]}>
    <Card.Content style={styles.kpiContent}>
      <View style={[styles.kpiIconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.kpiTextContainer}>
        <Text style={styles.kpiTitle}>{title}</Text>
        <Text style={[styles.kpiValue, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
      </View>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typograph.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  date: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  farmSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  farmName: {
    ...typograph.body,
    color: colors.text,
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  kpiCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  kpiContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kpiIconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  kpiTextContainer: {
    flex: 1,
  },
  kpiTitle: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  kpiValue: {
    ...typograph.h2,
    fontWeight: 'bold',
  },
  kpiSubtitle: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  severityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typograph.subtitle,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  severityComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  severityItem: {
    flex: 1,
    alignItems: 'center',
  },
  severityLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  severityValue: {
    ...typograph.h2,
    fontWeight: '700',
  },
  severityDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: `${colors.error}10`,
    borderRadius: borderRadius.sm,
  },
  warningText: {
    ...typograph.bodySmall,
    color: colors.error,
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typograph.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  actionText: {
    ...typograph.body,
    color: colors.surface,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    ...typograph.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  noDataCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  noDataContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  noDataTitle: {
    ...typograph.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  noDataText: {
    ...typograph.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  noDataButton: {
    marginTop: spacing.md,
  },
});

export default DashboardScreen;