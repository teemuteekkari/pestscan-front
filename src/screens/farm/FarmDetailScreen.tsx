// src/screens/farm/FarmDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatCard, StatCardGrid } from '../../components/cards/StatCard';
import { Row } from '../../components/layout/Row';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { FarmResponse, SubscriptionStatus } from '../../types/api.types';
import { getStatusLabel } from '../../utils/helpers';
import { farmService } from '../../services/farm.service';
import { DashboardStackParamList } from '../../navigation/DashboardNavigator';

type Props = NativeStackScreenProps<DashboardStackParamList, 'FarmDetail'>;

export const FarmDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { farmId } = route.params;
  const [farm, setFarm] = useState<FarmResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFarmData();
  }, [farmId]);

  const loadFarmData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await farmService.getFarm(farmId);
      setFarm(data);
    } catch (error) {
      console.error('Failed to load farm data:', error);
      Alert.alert('Error', 'Failed to load farm data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadFarmData(true);
  };

  const handleEdit = () => {
    navigation.navigate('EditFarm', { farmId });
  };

  const handleViewGreenhouses = () => {
    navigation.navigate('GreenhouseList', { farmId });
  };

  const handleViewFieldBlocks = () => {
    navigation.navigate('FieldBlockList', { farmId });
  };

  const handleCreateGreenhouse = () => {
    navigation.navigate('CreateGreenhouse', { farmId });
  };

  const handleCreateFieldBlock = () => {
    navigation.navigate('CreateFieldBlock', { farmId });
  };

  const handleViewAnalytics = () => {
    // Navigate to Analytics tab with farm context
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      (rootNavigation as any).navigate('Analytics', {
        screen: 'Dashboard',
        params: { farmId }
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Farm',
      'Are you sure you want to delete this farm? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement delete endpoint if available
              // await farmService.deleteFarm(farmId);
              Alert.alert('Coming Soon', 'Delete functionality will be available soon');
              // navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete farm');
            }
          },
        },
      ]
    );
  };

  if (loading || !farm) {
    return (
      <Screen
        title="Farm Details"
        showBack
        onBackPress={() => navigation.goBack()}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      title={farm.name}
      subtitle={farm.farmTag}
      showBack
      onBackPress={() => navigation.goBack()}
      scroll
      padding="md"
      headerActions={[
        {
          icon: 'refresh',
          onPress: handleRefresh,
          label: 'Refresh',
        },
        {
          icon: 'create',
          onPress: handleEdit,
          label: 'Edit',
        },
        {
          icon: 'trash',
          onPress: handleDelete,
          label: 'Delete',
        },
      ]}
    >
      {/* Status Card */}
      <Card padding="md">
        <Row justify="space-between" align="center">
          <View>
            <Text style={styles.label}>Subscription Status</Text>
            <Text style={styles.value}>{farm.subscriptionTier}</Text>
          </View>
          <Badge
            label={getStatusLabel(farm.subscriptionStatus)}
            variant={farm.subscriptionStatus === SubscriptionStatus.ACTIVE ? 'success' : 'warning'}
          />
        </Row>
      </Card>

      {/* Stats */}
      <StatCardGrid columns={2}>
        <StatCard
          title="Licensed Area"
          value={`${farm.licensedAreaHectares} ha`}
          icon="resize"
          variant="info"
        />
        <StatCard
          title="Structure Type"
          value={farm.structureType}
          icon="business"
          variant="default"
        />
        <StatCard
          title="Unit Quota"
          value={farm.licensedUnitQuota || 0}
          icon="albums"
          variant="success"
        />
        <StatCard
          title="Discount"
          value={`${farm.quotaDiscountPercentage || 0}%`}
          icon="pricetag"
          variant="warning"
        />
      </StatCardGrid>

      {/* Location Information */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Location</Text>
        {farm.address && (
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>{farm.address}</Text>
              <Text style={styles.infoText}>
                {farm.city}, {farm.province} {farm.postalCode}
              </Text>
              <Text style={styles.infoText}>{farm.country}</Text>
            </View>
          </View>
        )}
        {farm.timezone && (
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>{farm.timezone}</Text>
          </View>
        )}
      </Card>

      {/* Contact Information */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Contact Information</Text>
        {farm.contactName && (
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>{farm.contactName}</Text>
          </View>
        )}
        {farm.contactEmail && (
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>{farm.contactEmail}</Text>
          </View>
        )}
        {farm.contactPhone && (
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>{farm.contactPhone}</Text>
          </View>
        )}
        {farm.billingEmail && (
          <View style={styles.infoRow}>
            <Ionicons name="card" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>{farm.billingEmail}</Text>
          </View>
        )}
      </Card>

      {/* Default Configuration */}
      <Card padding="md">
        <Text style={styles.sectionTitle}>Default Configuration</Text>
        <Row gap="md" style={styles.configRow}>
          <View style={styles.configItem}>
            <Text style={styles.configValue}>{farm.defaultBayCount || 0}</Text>
            <Text style={styles.configLabel}>Bays</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configValue}>{farm.defaultBenchesPerBay || 0}</Text>
            <Text style={styles.configLabel}>Benches/Bay</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configValue}>{farm.defaultSpotChecksPerBench || 0}</Text>
            <Text style={styles.configLabel}>Spot Checks</Text>
          </View>
        </Row>
      </Card>

      {/* Description */}
      {farm.description && (
        <Card padding="md">
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{farm.description}</Text>
        </Card>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Row gap="md">
          <Button
            title="Create Greenhouse"
            icon="add-circle"
            onPress={handleCreateGreenhouse}
            variant="primary"
            style={styles.halfButton}
          />
          <Button
            title="Create Field Block"
            icon="add-circle"
            onPress={handleCreateFieldBlock}
            variant="primary"
            style={styles.halfButton}
          />
        </Row>

        <Button
          title="View Greenhouses"
          icon="business"
          onPress={handleViewGreenhouses}
          variant="outline"
          fullWidth
          style={styles.actionButton}
        />
        <Button
          title="View Field Blocks"
          icon="grid"
          onPress={handleViewFieldBlocks}
          variant="outline"
          fullWidth
          style={styles.actionButton}
        />
        <Button
          title="View Analytics"
          icon="analytics"
          onPress={handleViewAnalytics}
          variant="outline"
          fullWidth
          style={styles.actionButton}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  sectionTitle: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  label: {
    ...typograph.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  value: {
    ...typograph.h4,
    color: colors.text,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    ...typograph.body,
    color: colors.text,
    flex: 1,
  },
  configRow: {
    justifyContent: 'space-around',
  },
  configItem: {
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    minWidth: 80,
  },
  configValue: {
    ...typograph.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  configLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  descriptionText: {
    ...typograph.body,
    color: colors.text,
    lineHeight: 24,
  },
  actionsContainer: {
    marginTop: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  halfButton: {
    flex: 1,
  },
});

export default FarmDetailScreen;