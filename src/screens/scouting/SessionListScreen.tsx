import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card, Badge, Input } from '../../components/common/';
import { FloatingActionButton } from '../../components/navigation/FloatingActionButton';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';
import { ScoutingSessionDetailDto, SessionStatus } from '../../types/api.types';

interface SessionListScreenProps {
  navigation: any;
  route?: any;
}

type FilterType = 'all' | 'draft' | 'in_progress' | 'completed';

export const SessionListScreen: React.FC<SessionListScreenProps> = ({ navigation }) => {
  const [sessions, setSessions] = useState<ScoutingSessionDetailDto[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ScoutingSessionDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [searchQuery, selectedFilter, sessions]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await scoutingService.getSessions(farmId);
      // setSessions(data);

      // Mock data
      setTimeout(() => {
        const mockData: ScoutingSessionDetailDto[] = [
          {
            id: '1',
            farmId: 'farm-1',
            sessionDate: '2024-11-23',
            weekNumber: 47,
            status: SessionStatus.IN_PROGRESS,
            crop: 'Tomatoes',
            variety: 'Roma',
            temperatureCelsius: 22,
            relativeHumidityPercent: 65,
            confirmationAcknowledged: false,
            sections: [],
            recommendations: [],
          },
          {
            id: '2',
            farmId: 'farm-1',
            sessionDate: '2024-11-20',
            weekNumber: 47,
            status: SessionStatus.COMPLETED,
            crop: 'Peppers',
            variety: 'Bell',
            temperatureCelsius: 24,
            relativeHumidityPercent: 60,
            confirmationAcknowledged: true,
            sections: [],
            recommendations: [],
          },
          {
            id: '3',
            farmId: 'farm-1',
            sessionDate: '2024-11-22',
            weekNumber: 47,
            status: SessionStatus.DRAFT,
            crop: 'Tomatoes',
            confirmationAcknowledged: false,
            sections: [],
            recommendations: [],
          },
        ];
        setSessions(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Failed to load sessions:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const filterSessions = () => {
    let filtered = [...sessions];

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((session) => {
        switch (selectedFilter) {
          case 'draft':
            return session.status === SessionStatus.DRAFT;
          case 'in_progress':
            return session.status === SessionStatus.IN_PROGRESS;
          case 'completed':
            return session.status === SessionStatus.COMPLETED;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.crop?.toLowerCase().includes(query) ||
          session.variety?.toLowerCase().includes(query) ||
          session.sessionDate.includes(query)
      );
    }

    setFilteredSessions(filtered);
  };

  const handleSessionPress = (session: ScoutingSessionDetailDto) => {
    navigation.navigate('SessionDetail', { sessionId: session.id });
  };

  const handleCreateSession = () => {
    navigation.navigate('CreateSession');
  };

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.COMPLETED:
        return 'success';
      case SessionStatus.IN_PROGRESS:
        return 'info';
      case SessionStatus.DRAFT:
        return 'warning';
      case SessionStatus.CANCELLED:
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.COMPLETED:
        return 'Completed';
      case SessionStatus.IN_PROGRESS:
        return 'In Progress';
      case SessionStatus.DRAFT:
        return 'Draft';
      case SessionStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'in_progress', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  const renderSession = ({ item }: { item: ScoutingSessionDetailDto }) => (
    <Card padding="md" style={styles.card} onPress={() => handleSessionPress(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="search" size={24} color={colors.primary} />
          <View style={styles.cardTitle}>
            <Text style={styles.sessionDate}>
              {new Date(item.sessionDate).toLocaleDateString()}
            </Text>
            {item.weekNumber && (
              <Text style={styles.weekNumber}>Week {item.weekNumber}</Text>
            )}
          </View>
        </View>
        <Badge
          label={getStatusLabel(item.status)}
          variant={getStatusColor(item.status) as any}
          size="sm"
        />
      </View>

      {(item.crop || item.variety) && (
        <View style={styles.cropInfo}>
          <Ionicons name="leaf" size={16} color={colors.textSecondary} />
          <Text style={styles.cropText}>
            {item.crop}
            {item.variety && ` - ${item.variety}`}
          </Text>
        </View>
      )}

      <View style={styles.statsRow}>
        {item.temperatureCelsius && (
          <View style={styles.stat}>
            <Ionicons name="thermometer" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.temperatureCelsius}°C</Text>
          </View>
        )}
        {item.relativeHumidityPercent && (
          <View style={styles.stat}>
            <Ionicons name="water" size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.relativeHumidityPercent}%</Text>
          </View>
        )}
        <View style={styles.stat}>
          <Ionicons name="location" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{item.sections.length} locations</Text>
        </View>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Scouting Sessions</Text>
      <Text style={styles.emptyText}>
        {searchQuery
          ? 'No sessions match your search'
          : 'Get started by creating your first scouting session'}
      </Text>
    </View>
  );

  return (
    <Screen
      title="Scouting Sessions"
      headerActions={[
        {
          icon: 'add',
          onPress: handleCreateSession,
          label: 'New Session',
        },
      ]}
    >
      <View style={styles.container}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search sessions..."
            leftIcon="search"
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
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
                  styles.filterText,
                  selectedFilter === filter.value && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sessions List */}
        <FlatList
          data={filteredSessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={!loading ? renderEmpty : null}
          showsVerticalScrollIndicator={false}
        />

        <FloatingActionButton icon="add" onPress={handleCreateSession} />
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
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  searchInput: {
    marginBottom: 0,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round || 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typograph.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.surface,
    fontWeight: '600',
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
    marginBottom: spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  cardTitle: {
    flex: 1,
  },
  sessionDate: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
  },
  weekNumber: {
    ...typograph.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cropText: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
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

export default SessionListScreen;