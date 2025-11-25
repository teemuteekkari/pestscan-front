// src/components/Avatar.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typograph, borderRadius } from '../../theme/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
  backgroundColor?: string;
  textColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: {
    color: string;
    position?: 'top-right' | 'bottom-right';
  };
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  backgroundColor,
  textColor = colors.surface,
  icon,
  badge,
}) => {
  const getSize = (): number => {
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 56;
      case 'xl':
        return 80;
      default:
        return 40;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'xs':
        return 10;
      case 'sm':
        return 12;
      case 'md':
        return 16;
      case 'lg':
        return 20;
      case 'xl':
        return 28;
      default:
        return 16;
    }
  };

  const getIconSize = (): number => {
    return getFontSize() * 1.2;
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const generateBackgroundColor = (name: string): string => {
    const avatarColors = [
      '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
      '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
  };

  const avatarSize = getSize();
  const bgColor = backgroundColor || (name ? generateBackgroundColor(name) : colors.primary);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: source ? 'transparent' : bgColor,
          },
        ]}
      >
        {source ? (
          <Image
            source={source}
            style={[
              styles.image,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
              },
            ]}
          />
        ) : icon ? (
          <Ionicons name={icon} size={getIconSize()} color={textColor} />
        ) : name ? (
          <Text style={[styles.initials, { fontSize: getFontSize(), color: textColor }]}>
            {getInitials(name)}
          </Text>
        ) : (
          <Ionicons name="person" size={getIconSize()} color={textColor} />
        )}
      </View>
      {badge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: badge.color,
              width: avatarSize * 0.3,
              height: avatarSize * 0.3,
              borderRadius: avatarSize * 0.15,
              top: badge.position === 'bottom-right' ? undefined : 0,
              bottom: badge.position === 'bottom-right' ? 0 : undefined,
              right: 0,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    ...typograph.subtitle,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.surface,
  },
});