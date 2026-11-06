// =============================================================================
// WhatsApp Call History Item Component
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { CallLog } from '@/services/apiService';
import { useTheme } from '@/context/ThemeContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface Props {
  call: CallLog;
}

export const CallItem: React.FC<Props> = ({ call }) => {
  const { colors } = useTheme();

  const handleStartCall = () => {
    router.push({
      pathname: '/call-screen',
      params: {
        name: call.name,
        avatar: call.avatar,
        isVideo: call.isVideo ? '1' : '0',
      },
    });
  };

  const isMissed = call.type === 'missed';
  const arrowColor = isMissed ? colors.danger : colors.accentGreen;
  const arrowIcon = call.type === 'outgoing' ? 'call-outgoing' : 'call-incoming';

  return (
    <Pressable
      onPress={handleStartCall}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: pressed ? colors.surfaceElevated : colors.surface },
      ]}
    >
      <Image source={call.avatar} style={styles.avatar} contentFit="cover" />

      <View style={styles.content}>
        <Text
          style={[
            styles.name,
            { color: isMissed ? colors.danger : colors.textPrimary },
          ]}
          numberOfLines={1}
        >
          {call.name}
        </Text>
        <View style={styles.subRow}>
          <WhatsAppIcon name={arrowIcon} size={15} color={arrowColor} />
          <Text style={[styles.timestamp, { color: colors.textMuted }]}>
            {call.timestamp}
          </Text>
        </View>
      </View>

      <Pressable onPress={handleStartCall} style={styles.callButton} hitSlop={8}>
        <WhatsAppIcon
          name={call.isVideo ? 'video' : 'call'}
          size={20}
          color={colors.accentGreen}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestamp: {
    fontSize: 13,
  },
  callButton: {
    padding: 8,
  },
});
