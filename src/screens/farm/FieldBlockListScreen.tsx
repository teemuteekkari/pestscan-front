// src/screens/farm/FieldBlockListScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { FloatingActionButton } from '../../components/navigation/FloatingActionButton';
import { Input } from '../../components/common/Input';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { FieldBlockDto } from '../../types/api.types';

interface FieldBlockListScreenProps {
  navigation: any;
  route: {
    params: {
      farmId: string;
    };
  };
}

export const FieldBlockListScreen: React.FC<FieldBlockListScreenProps> = ({
  navigation,
  route,
}) => {
  const { farmId } = route.params;
  const [fieldBlocks, setFieldBlocks] = useState<FieldBlockDto[]>([]);
  const [filteredFieldBlocks, setFilteredFieldBlocks] = useState<FieldBlockDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFieldBlocks();
  }, [farmId]);

  useEffect(() => {
    filterFieldBlocks();
  }, [searchQuery, fieldBlocks]);

  const loadFieldBlocks = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await fieldBlockService.getFieldBlocks(farmId);
      // setFieldBlocks(data);
      
      // Mock data
      setTimeout(() => {
        const mockData: FieldBlockDto[] = [
          {
            id: '1',
            version: 1,
            farmId,
            name: 'North Field',
            bayCount: 20,
            spotChecksPerBay: 8,
            bayTags: ['Organic', 'Premium'],
            active: true,
          },
          {
            id: '2',
            version: 1,
            farmId,
            name: 'South Field',
            bayCount: 15,
            spotChecksPerBay: 6,
            bayTags: ['Standard'],
            active: true,
          },
          {
            id: '3',
            version: 1,
            farmId,
            name: 'East Field',
            bayCount: 12,
            spotChecksPerBay: 5,
            bayTags: ['New', 'Testing'],
            active: false,
          },
        ];
        setFieldBlocks(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Failed to load field blocks:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFieldBlocks();
    setRefreshing(false);
  };

  const filterFieldBlocks = () => {
    if (!searchQuery.trim()) {
      setFilteredFieldBlocks(fieldBlocks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = fieldBlocks.filter(
      (block) =>
        block.name.toLowerCase().includes(query) ||
        block.bayTags.some(tag => tag.toLowerCase().includes(query))
    );
    setFilteredFieldBlocks(filtered);
  };

  const handleFieldBlockPress = (block: FieldBlockDto) => {
    navigation.navigate('FieldBlockDetail', { fieldBlockId: block.id });
  };

  const handleCreateFieldBlock = () => {
    navigation.navigate('CreateFieldBlock', { farmId });
  };

  const renderFieldBlock = ({ item }: { item: FieldBlockDto }) => {
    const totalSpotChecks = (item.bayCount || 0) * (item.spotChecksPerBay || 0);

    return (
      <Card
        padding="md"
        style={styles.card}
        onPress={() => handleFieldBlockPress(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Ionicons name="grid" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>{item.name}</Text>
          </View>
          <Badge
            label={item.active ? 'Active' : 'Inactive'}
            variant={item.active ? 'success' : 'neutral'}
            size="sm"
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.bayCount || 0}</Text>
            <Text style={styles.statLabel}>Bays</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.spotChecksPerBay || 0}</Text>
            <Text style={styles.statLabel}>Checks/Bay</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{totalSpotChecks}</Text>
            <Text style={styles.statLabel}>Total Checks</Text>
          </View>
        </View>

        {item.bayTags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.bayTags.slice(0, 3).map((tag, index) => (
              <Badge key={index} label={tag} variant="info" size="sm" />
            ))}
            {item.bayTags.length > 3 && (
              <Text style={styles.moreText}>+{item.bayTags.length - 3}</Text>
            )}
          </View>
        )}
      </Card>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="grid-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Field Blocks</Text>
      <Text style={styles.emptyText}>
        {searchQuery
          ? 'No field blocks match your search'
          : 'Get started by creating your first field block'}
      </Text>
    </View>
  );

  return (
    <Screen
      title="Field Blocks"
      showBack
      onBackPress={() => navigation.goBack()}
      headerActions={[
        {
          icon: 'add',
          onPress: handleCreateFieldBlock,
          label: 'Add',
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search field blocks..."
            leftIcon="search"
            containerStyle={styles.searchInput}
          />
        </View>

        <FlatList
          data={filteredFieldBlocks}
          renderItem={renderFieldBlock}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={!loading ? renderEmpty : null}
          showsVerticalScrollIndicator={false}
        />

        <FloatingActionButton
          icon="add"
          onPress={handleCreateFieldBlock}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  cardTitle: {
    ...typograph.h4,
    color: colors.text,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    ...typograph.h4,
    color: colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  moreText: {
    ...typograph.caption,
    color: colors.textSecondary,
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
  },
});