// src/screens/farm/GreenhouseListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { GreenhouseCard } from '../../components/cards/GreenhouseCard';
import { FloatingActionButton } from '../../components/navigation/FloatingActionButton';
import { Input } from '../../components/common/Input';
import { colors, spacing, typograph } from '../../theme/theme';
import { GreenhouseDto } from '../../types/api.types';
import { farmService } from '../../services/farm.service';
import { DashboardStackParamList } from '../../navigation/DashboardNavigator';

type Props = NativeStackScreenProps<DashboardStackParamList, 'GreenhouseList'>;

export const GreenhouseListScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { farmId } = route.params;
  const [greenhouses, setGreenhouses] = useState<GreenhouseDto[]>([]);
  const [filteredGreenhouses, setFilteredGreenhouses] = useState<GreenhouseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGreenhouses();
  }, [farmId]);

  useEffect(() => {
    filterGreenhouses();
  }, [searchQuery, greenhouses]);

  const loadGreenhouses = async () => {
    try {
      setLoading(true);
      const data = await farmService.getGreenhouses(farmId);
      setGreenhouses(data);
    } catch (error) {
      console.error('Failed to load greenhouses:', error);
      Alert.alert('Error', 'Failed to load greenhouses');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGreenhouses();
    setRefreshing(false);
  };

  const filterGreenhouses = () => {
    if (!searchQuery.trim()) {
      setFilteredGreenhouses(greenhouses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = greenhouses.filter(
      (greenhouse) =>
        greenhouse.name.toLowerCase().includes(query) ||
        greenhouse.description?.toLowerCase().includes(query) ||
        (greenhouse.bayTags && greenhouse.bayTags.some(tag => tag.toLowerCase().includes(query)))
    );
    setFilteredGreenhouses(filtered);
  };

  const handleGreenhousePress = (greenhouse: GreenhouseDto) => {
    // navigation.navigate('GreenhouseDetail', { greenhouseId: greenhouse.id });
  };

  const handleCreateGreenhouse = () => {
    navigation.navigate('CreateGreenhouse', { farmId });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="business-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Greenhouses</Text>
      <Text style={styles.emptyText}>
        {searchQuery
          ? 'No greenhouses match your search'
          : 'Get started by creating your first greenhouse'}
      </Text>
    </View>
  );

  return (
    <Screen
      title="Greenhouses"
      showBack
      onBackPress={() => navigation.goBack()}
      headerActions={[
        {
          icon: 'add',
          onPress: handleCreateGreenhouse,
          label: 'Add',
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search greenhouses..."
            leftIcon="search"
            containerStyle={styles.searchInput}
          />
        </View>

        <FlatList
          data={filteredGreenhouses}
          renderItem={({ item }) => (
            <GreenhouseCard
              greenhouse={item}
              onPress={() => handleGreenhousePress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={!loading ? renderEmpty : null}
          showsVerticalScrollIndicator={false}
        />

        <FloatingActionButton
          icon="add"
          onPress={handleCreateGreenhouse}
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

export default GreenhouseListScreen;