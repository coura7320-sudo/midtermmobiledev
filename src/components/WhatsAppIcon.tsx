// =============================================================================
// WhatsApp Custom Vector Icon Component
// Self-contained, zero-dependency, works flawlessly on Native & Web
// =============================================================================

import React from 'react';
import { Text, StyleSheet, View, TextStyle } from 'react-native';

export type IconName =
  | 'search'
  | 'camera'
  | 'dots-vertical'
  | 'menu'
  | 'check'
  | 'check-double'
  | 'call'
  | 'video'
  | 'clip'
  | 'mic'
  | 'send'
  | 'emoji'
  | 'back'
  | 'plus'
  | 'pencil'
  | 'chats'
  | 'status'
  | 'communities'
  | 'settings'
  | 'star'
  | 'devices'
  | 'lock'
  | 'pin'
  | 'moon'
  | 'sun'
  | 'call-incoming'
  | 'call-outgoing'
  | 'call-missed'
  | 'phone'
  | 'user'
  | 'notifications'
  | 'storage'
  | 'info'
  | 'arrow-forward'
  | 'archive'
  | 'check-circle';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  style?: TextStyle;
}

export const WhatsAppIcon: React.FC<Props> = ({ name, size = 22, color = '#111b21', style }) => {
  // Map icons to clean Unicode glyphs and symbols with exact sizing
  const renderGlyph = () => {
    switch (name) {
      case 'search':
        return '🔍';
      case 'camera':
        return '📷';
      case 'dots-vertical':
        return '⋮';
      case 'menu':
        return '☰';
      case 'check':
        return '✓';
      case 'check-double':
        return '✓✓';
      case 'call':
      case 'phone':
        return '📞';
      case 'video':
        return '📹';
      case 'clip':
        return '📎';
      case 'mic':
        return '🎙️';
      case 'send':
        return '➤';
      case 'emoji':
        return '😊';
      case 'back':
        return '←';
      case 'plus':
        return '+';
      case 'pencil':
        return '✏️';
      case 'chats':
        return '💬';
      case 'status':
        return '⭕';
      case 'communities':
        return '👥';
      case 'settings':
        return '⚙️';
      case 'star':
        return '⭐';
      case 'devices':
        return '💻';
      case 'lock':
        return '🔒';
      case 'pin':
        return '📌';
      case 'moon':
        return '🌙';
      case 'sun':
        return '☀️';
      case 'call-incoming':
        return '↙';
      case 'call-outgoing':
        return '↗';
      case 'call-missed':
        return '↙';
      case 'user':
        return '👤';
      case 'notifications':
        return '🔔';
      case 'storage':
        return '💾';
      case 'info':
        return 'ℹ️';
      case 'arrow-forward':
        return '›';
      case 'archive':
        return '📥';
      case 'check-circle':
        return '✔';
      default:
        return '•';
    }
  };

  const isDoubleCheck = name === 'check-double';
  const isDots = name === 'dots-vertical';

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            fontSize: isDots ? size * 1.3 : isDoubleCheck ? size * 0.8 : size,
            color,
            lineHeight: isDots ? size * 1.1 : undefined,
          },
          style,
        ]}
      >
        {renderGlyph()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
