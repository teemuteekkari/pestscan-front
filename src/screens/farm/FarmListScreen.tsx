// src/screens/farm/FarmListScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { FarmCard } from '../../components/cards/FarmCard';
import { FloatingActionButton } from '../../components/navigation/FloatingActionButton';
import { Input, Badge } from '../../components/common';
import { Row } from '../../components/layout/Row';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { FarmResponse, SubscriptionStatus } from '../../types/api.types';

interface FarmListScreenProps {
  navigation: any;
  route?: any;
}

type FilterType = 'all' | 'active' | 'suspended' | 'pending';

export const FarmListScreen: React.FC<FarmListScreenProps> = ({ navigation }) => {
  const [farms, setFarms] = useState<FarmResponse[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<FarmResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    filterFarms();
  }, [searchQuery, selectedFilter, farms]);

  const loadFarms = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await farmService.getFarms();
      // setFarms(data);
      
      // Mock data
      setTimeout(() => {
        const mockData: FarmResponse[] = [
          {
            id: '1',
            farmTag: 'GVF-001',
            name: 'Green Valley Farm',
            description: 'Premium organic greenhouse operation',
            city: 'Portland',
            province: 'Oregon',
            country: 'USA',
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            subscriptionTier: 'PREMIUM' as any,
            licensedAreaHectares: 5.5,
            structureType: 'GREENHOUSE' as any,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-11-20T14:30:00Z',
            ownerId: 'user-1',
          },
          {
            id: '2',
            farmTag: 'SF-002',
            name: 'Sunny Fields',
            description: 'Large-scale field operations',
            city: 'Sacramento',
            province: 'California',
            country: 'USA',
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            subscriptionTier: 'STANDARD' as any,
            licensedAreaHectares: 12.0,
            structureType: 'FIELD' as any,
            createdAt: '2024-02-10T10:00:00Z',
            updatedAt: '2024-11-18T09:15:00Z',
            ownerId: 'user-2',
          },
          {
            id: '3',
            farmTag: 'MH-003',
            name: 'Mountain Harvest',
            description: 'High-altitude greenhouse growing',
            city: 'Denver',
            province: 'Colorado',
            country: 'USA',
            subscriptionStatus: SubscriptionStatus.SUSPENDED,
            subscriptionTier: 'BASIC' as any,
            licensedAreaHectares: 3.2,
            structureType: 'GREENHOUSE' as any,
            createdAt: '2024-03-05T10:00:00Z',
            updatedAt: '2024-11-15T16:45:00Z',
            ownerId: 'user-3',
          },
          {
            id: '4',
            farmTag: 'CF-004',
            name: 'Coastal Farms',
            description: 'Seaside agricultural operations',
            city: 'San Diego',
            province: 'California',
            country: 'USA',
            subscriptionStatus: SubscriptionStatus.PENDING_ACTIVATION,
            subscriptionTier: 'STANDARD' as any,
            licensedAreaHectares: 8.5,
            structureType: 'OTHER' as any,
            createdAt: '2024-11-01T10:00:00Z',
            updatedAt: '2024-11-20T11:30:00Z',
            ownerId: 'user-4',
          },
          {
            id: '5',
            farmTag: 'HV-005',
            name: 'Heritage Valley',
            description: 'Traditional farming with modern techniques',
            city: 'Eugene',
            province: 'Oregon',
            country: 'USA',
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            subscriptionTier: 'PREMIUM' as any,
            licensedAreaHectares: 15.0,
            structureType: 'FIELD' as any,
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-11-19T13:20:00Z',
            ownerId: 'user-5',
          },
        ];
        setFarms(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Failed to load farms:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFarms();
    setRefreshing(false);
  };

  const filterFarms = () => {
    let filtered = [...farms];

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((farm) => {
        switch (selectedFilter) {
          case 'active':
            return farm.subscriptionStatus === SubscriptionStatus.ACTIVE;
          case 'suspended':
            return farm.subscriptionStatus === SubscriptionStatus.SUSPENDED;
          case 'pending':
            return farm.subscriptionStatus === SubscriptionStatus.PENDING_ACTIVATION;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (farm) =>
          farm.name.toLowerCase().includes(query) ||
          farm.farmTag?.toLowerCase().includes(query) ||
          farm.city?.toLowerCase().includes(query) ||
          farm.description?.toLowerCase().includes(query)
      );
    }

    setFilteredFarms(filtered);
  };

  const handleFarmPress = (farm: FarmResponse) => {
    navigation.navigate('FarmDetail', { farmId: farm.id });
  };

  const handleCreateFarm = () => {
    navigation.navigate('CreateFarm');
  };

  const filters: { value: FilterType; label: string; count?: number }[] = [
    { 
      value: 'all', 
      label: 'All', 
      count: farms.length 
    },
    { 
      value: 'active', 
      label: 'Active',
      count: farms.filter(f => f.subscriptionStatus === SubscriptionStatus.ACTIVE).length
    },
    { 
      value: 'pending', 
      label: 'Pending',
      count: farms.filter(f => f.subscriptionStatus === SubscriptionStatus.PENDING_ACTIVATION).length
    },
    { 
      value: 'suspended', 
      label: 'Suspended',
      count: farms.filter(f => f.subscriptionStatus === SubscriptionStatus.SUSPENDED).length
    },
  ];

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="leaf-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Farms Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery
          ? 'No farms match your search criteria'
          : 'Get started by creating your first farm'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={handleCreateFarm}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.emptyButtonText}>Create Farm</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search */}
      <Input
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search farms..."
        leftIcon="search"
        containerStyle={styles.searchInput}
      />

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersLabel}>Filter by:</Text>
        <View style={styles.filters}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                selectedFilter === filter.value && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter.value && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
              {filter.count !== undefined && filter.count > 0 && (
                <View
                  style={[
                    styles.filterBadge,
                    selectedFilter === filter.value && styles.filterBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterBadgeText,
                      selectedFilter === filter.value && styles.filterBadgeTextActive,
                    ]}
                  >
                    {filter.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredFarms.length} {filteredFarms.length === 1 ? 'farm' : 'farms'}
        </Text>
      </View>
    </View>
  );

  return (
    <Screen
      title="Farms"
      subtitle={`${farms.length} total`}
      headerActions={[
        {
          icon: 'add',
          onPress: handleCreateFarm,
          label: 'Add Farm',
        },
      ]}
    >
      <View style={styles.container}>
        <FlatList
          data={filteredFarms}
          renderItem={({ item }) => (
            <FarmCard farm={item} onPress={() => handleFarmPress(item)} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!loading ? renderEmpty : null}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
        />

        <FloatingActionButton icon="add" onPress={handleCreateFarm} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: 0,
  },
  filtersContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  filtersLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round || 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typograph.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },
  filterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  filterBadgeActive: {
    backgroundColor: colors.surface,
  },
  filterBadgeText: {
    ...typograph.caption,
    color: colors.text,
    fontSize: 10,
    fontWeight: '700',
  },
  filterBadgeTextActive: {
    color: colors.primary,
  },
  resultsContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  resultsText: {
    ...typograph.caption,
    color: colors.textSecondary,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl * 2,
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
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.primary}15`,
  },
  emptyButtonText: {
    ...typograph.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
export default FarmListScreen;