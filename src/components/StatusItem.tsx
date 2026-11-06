// =============================================================================
// WhatsApp Status Story Item Component
// Avatar with circular story border, contact name, timestamp
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusStory } from '@/services/apiService';
import { useTheme } from '@/context/ThemeContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface Props {
  status: StatusStory;
  isMyStatus?: boolean;
  onAddPress?: () => void;
}

export const StatusItem: React.FC<Props> = ({ status, isMyStatus = false, onAddPress }) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (isMyStatus && onAddPress) {
      onAddPress();
      return;
    }

    router.push({
      pathname: '/status-view',
      params: {
        id: status.id,
        name: status.name,
        avatar: status.avatar,
        text: status.text,
        image: status.image || '',
        timestamp: status.timestamp,
      },
    });
  };

  const ringColor = status.viewed ? colors.border : colors.accentGreen;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: pressed ? colors.surfaceElevated : colors.surface },
      ]}
    >
      <View style={[styles.avatarBorder, { borderColor: isMyStatus ? 'transparent' : ringColor }]}>
        <Image source={status.avatar} style={styles.avatar} contentFit="cover" />
        {isMyStatus && (
          <View style={[styles.plusBadge, { backgroundColor: colors.accentGreen }]}>
            <WhatsAppIcon name="plus" size={14} color="#ffffff" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {status.name}
        </Text>
        <Text style={[styles.timestamp, { color: colors.textMuted }]}>
          {status.timestamp}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  avatarBorder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  timestamp: {
    fontSize: 13,
  },
});
