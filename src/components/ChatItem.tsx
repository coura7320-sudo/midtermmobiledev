// =============================================================================
// WhatsApp Chat List Item Component
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Chat } from '@/services/apiService';
import { useTheme } from '@/context/ThemeContext';
import { useChat } from '@/context/ChatContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface Props {
  chat: Chat;
}

export const ChatItem: React.FC<Props> = ({ chat }) => {
  const { colors } = useTheme();
  const { typingMap } = useChat();

  const isTyping = !!typingMap[chat.id];

  const handlePress = () => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: chat.id, name: chat.name, avatar: chat.avatar },
    });
  };

  const renderStatusIcon = () => {
    if (chat.status === 'read') {
      return <WhatsAppIcon name="check-double" size={14} color={colors.readTick} />;
    }
    if (chat.status === 'delivered') {
      return <WhatsAppIcon name="check-double" size={14} color={colors.deliveredTick} />;
    }
    return <WhatsAppIcon name="check" size={14} color={colors.deliveredTick} />;
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? colors.surfaceElevated : colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Avatar Container with Online Indicator */}
      <View style={styles.avatarContainer}>
        <Image
          source={chat.avatar}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        {chat.unreadCount > 0 && <View style={[styles.onlineDot, { backgroundColor: colors.accentGreen }]} />}
      </View>

      {/* Main Details */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[styles.name, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {chat.name}
          </Text>
          <Text
            style={[
              styles.timestamp,
              {
                color: chat.unreadCount > 0 ? colors.accentGreen : colors.textMuted,
                fontWeight: chat.unreadCount > 0 ? '600' : 'normal',
              },
            ]}
          >
            {chat.lastTimestamp}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.messagePreviewContainer}>
            {!isTyping && renderStatusIcon()}
            <Text
              style={[
                styles.messagePreview,
                {
                  color: isTyping ? colors.accentGreen : colors.textSecondary,
                  fontStyle: isTyping ? 'italic' : 'normal',
                  fontWeight: chat.unreadCount > 0 ? '600' : 'normal',
                },
              ]}
              numberOfLines={1}
            >
              {isTyping ? typingMap[chat.id] : chat.lastMessage}
            </Text>
          </View>

          <View style={styles.badgeContainer}>
            {chat.pinned && (
              <WhatsAppIcon name="pin" size={14} color={colors.textMuted} style={styles.pinIcon} />
            )}
            {chat.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.badgeBg }]}>
                <Text style={[styles.unreadCountText, { color: colors.badgeText }]}>
                  {chat.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ccc',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
    marginRight: 8,
  },
  messagePreview: {
    fontSize: 14,
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinIcon: {
    marginRight: 2,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadCountText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
