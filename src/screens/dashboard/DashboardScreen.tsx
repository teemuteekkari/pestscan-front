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
import { Role, FarmResponse } from '../../types/api.types';
import { colors, spacing, typograph, borderRadius, shadows } from '../../theme/theme';
import { formatDate, getCurrentWeek, getCurrentYear } from '../../utils/helpers';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [currentFarm, setCurrentFarm] = useState<FarmResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const farmsData = await farmService.getFarms();
      setFarms(farmsData);
      
      // Set first farm as current if available
      if (farmsData.length > 0 && !currentFarm) {
        setCurrentFarm(farmsData[0]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load farms');
    } finally {
      setLoading(false);
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

  const handleNewSession = () => {
    if (currentFarm) {
      navigation.navigate('FarmDetail', { farmId: currentFarm.id });
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

  // Mock data for now - TODO: Replace with actual scouting service
  const sessions: any[] = []; // Will be populated from scouting service later
  const activeSessions = 0;
  const completedThisWeek = 0;
  const totalObservations = 0;

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
      <View style={styles.kpiContainer}>
        <KPICard
          title="Active Sessions"
          value={activeSessions}
          icon="timer"
          color={colors.info}
          subtitle="In progress"
        />
        <KPICard
          title="Completed This Week"
          value={completedThisWeek}
          icon="checkmark-circle"
          color={colors.success}
          subtitle={`Week ${getCurrentWeek()}`}
        />
        <KPICard
          title="Total Observations"
          value={totalObservations}
          icon="eye"
          color={colors.secondary}
          subtitle="All time"
        />
        <KPICard
          title="Farms"
          value={farms.length}
          icon="leaf"
          color={colors.primary}
          subtitle="Under management"
        />
      </View>

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
              onPress={() => Alert.alert('Coming Soon', 'Analytics feature coming soon')}
            >
              <Ionicons name="analytics" size={40} color={colors.surface} />
              <Text style={styles.actionText}>View Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.accent }]}
              onPress={() => Alert.alert('Coming Soon', 'Reports feature coming soon')}
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
});

export default DashboardScreen;