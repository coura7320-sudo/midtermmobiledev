// =============================================================================
// WhatsApp Chat Message Bubble Component
// Authentic speech bubble with timestamp, tails, and blue ticks
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/services/apiService';
import { useTheme } from '@/context/ThemeContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface Props {
  message: Message;
  showSenderName?: boolean;
}

export const ChatBubble: React.FC<Props> = ({ message, showSenderName = false }) => {
  const { colors } = useTheme();
  const isMine = message.mine;

  const renderStatus = () => {
    if (!isMine) return null;
    if (message.status === 'read') {
      return <WhatsAppIcon name="check-double" size={13} color={colors.readTick} />;
    }
    if (message.status === 'delivered') {
      return <WhatsAppIcon name="check-double" size={13} color={colors.deliveredTick} />;
    }
    return <WhatsAppIcon name="check" size={13} color={colors.deliveredTick} />;
  };

  return (
    <View style={[styles.wrapper, isMine ? styles.wrapperMine : styles.wrapperOther]}>
      <View
        style={[
          styles.bubble,
          isMine
            ? [
                styles.bubbleMine,
                {
                  backgroundColor: colors.bubbleMine,
                  borderTopRightRadius: 2,
                },
              ]
            : [
                styles.bubbleOther,
                {
                  backgroundColor: colors.bubbleOther,
                  borderTopLeftRadius: 2,
                },
              ],
        ]}
      >
        {/* Sender Name in group discussions */}
        {!isMine && showSenderName && (
          <Text style={[styles.senderName, { color: colors.accentGreen }]}>
            {message.senderName}
          </Text>
        )}

        {/* Message Content */}
        <Text
          style={[
            styles.messageText,
            { color: isMine ? colors.bubbleMineText : colors.bubbleOtherText },
          ]}
        >
          {message.text}
        </Text>

        {/* Timestamp and Read Status footer */}
        <View style={styles.footer}>
          <Text style={[styles.timestamp, { color: colors.textMuted }]}>
            {message.timestamp}
          </Text>
          {renderStatus()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 3,
    paddingHorizontal: 10,
    width: '100%',
  },
  wrapperMine: {
    alignItems: 'flex-end',
  },
  wrapperOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1.5,
  },
  bubbleMine: {
    alignSelf: 'flex-end',
  },
  bubbleOther: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  timestamp: {
    fontSize: 11,
  },
});
