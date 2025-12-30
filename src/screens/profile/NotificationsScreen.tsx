// src/screens/profile/NotificationsScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/layout/Screen';
import { Card, Badge } from '../../components/common';
import { colors, spacing, typograph, borderRadius } from '../../theme/theme';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await notificationService.getNotifications();
      // setNotifications(data);

      // Mock data
      setTimeout(() => {
        const mockData: Notification[] = [
          {
            id: '1',
            type: 'alert',
            title: 'High Pest Activity Detected',
            message: 'Thrips population exceeded threshold in Greenhouse A, Bay 3',
            timestamp: '2024-11-23T10:30:00Z',
            read: false,
          },
          {
            id: '2',
            type: 'warning',
            title: 'Disease Warning',
            message: 'Powdery mildew detected in multiple locations',
            timestamp: '2024-11-23T09:15:00Z',
            read: false,
          },
          {
            id: '3',
            type: 'success',
            title: 'Session Completed',
            message: 'Scouting session for Week 47 successfully completed',
            timestamp: '2024-11-22T16:45:00Z',
            read: true,
          },
          {
            id: '4',
            type: 'info',
            title: 'Weekly Report Available',
            message: 'Your weekly pest management report is ready to view',
            timestamp: '2024-11-22T08:00:00Z',
            read: true,
          },
          {
            id: '5',
            type: 'alert',
            title: 'Emergency Alert',
            message: 'Critical pest infestation requires immediate attention',
            timestamp: '2024-11-21T14:20:00Z',
            read: false,
          },
        ];
        setNotifications(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Failed to load notifications:', error);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    // Navigate to relevant screen based on notification type
    console.log('Notification pressed:', notification.id);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'success':
        return 'checkmark-circle';
      case 'info':
        return 'information-circle';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'success':
        return colors.success;
      case 'info':
        return colors.info;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  // src/screens/profile/NotificationsScreen.tsx (Fixed)

const renderNotification = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);
    const color = getNotificationColor(item.type);
  
    // Build the card style
    const cardStyle = {
      ...styles.notificationCard,
      ...(item.read ? {} : styles.unreadCard),
    };
  
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleNotificationPress(item)}
      >
        <Card padding="md" style={cardStyle}>
          <View style={styles.notificationContent}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
              <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.textContent}>
              <View style={styles.header}>
                <Text style={styles.title}>{item.title}</Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.message} numberOfLines={2}>
                {item.message}
              </Text>
              <Text style={styles.timestamp}>{getTimeAgo(item.timestamp)}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>
        You're all caught up! Check back later for updates.
      </Text>
    </View>
  );

  return (
    <Screen
      title="Notifications"
      showBack
      onBackPress={() => navigation.goBack()}
      headerActions={[
        {
          icon: 'checkmark-done',
          onPress: handleMarkAllRead,
          label: 'Mark all read',
        },
        {
          icon: 'trash',
          onPress: handleClearAll,
          label: 'Clear all',
        },
      ]}
    >
      <View style={styles.container}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
            onPress={() => setFilter('unread')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={!loading ? renderEmpty : null}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
  },
  notificationCard: {
    marginBottom: spacing.md,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    ...typograph.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  message: {
    ...typograph.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  timestamp: {
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