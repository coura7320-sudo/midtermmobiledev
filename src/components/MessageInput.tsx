// =============================================================================
// WhatsApp Chat Message Input Bar Component
// Emoji, Attachment sheet, TextInput, Dynamic Mic/Send button
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface Props {
  onSend: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<Props> = ({ onSend, onTyping }) => {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef<any>(null);

  const handleTextChange = (val: string) => {
    setText(val);

    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    if (onTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      onTyping(false);
    }
  };

  const handleAttachment = () => {
    Alert.alert(
      'Pièce jointe',
      'Choisissez le type de document :',
      [
        { text: '📷 Appareil photo', onPress: () => onSend('📷 [Photo partagée]') },
        { text: '🖼️ Galerie', onPress: () => onSend('🖼️ [Image de la galerie]') },
        { text: '📄 Document PDF', onPress: () => onSend('📄 [Rapport_Midterm.pdf]') },
        { text: '📍 Localisation', onPress: () => onSend('📍 [DAUST Campus, Dakar]') },
        { text: 'Annuler', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleVoice = () => {
    Alert.alert('Message vocal', 'Envoi d\'une note vocale simulée (0:15) ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Envoyer', onPress: () => onSend('🎙️ Message vocal (0:15)') },
    ]);
  };

  const hasText = text.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={[styles.inputBox, { backgroundColor: colors.inputBg }]}>
        <Pressable
          onPress={() => onSend('😊')}
          style={styles.iconButton}
          hitSlop={6}
        >
          <WhatsAppIcon name="emoji" size={22} color={colors.textMuted} />
        </Pressable>

        <TextInput
          style={[styles.input, { color: colors.inputText }]}
          placeholder="Message"
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={handleTextChange}
          multiline
          maxLength={1000}
        />

        <Pressable onPress={handleAttachment} style={styles.iconButton} hitSlop={6}>
          <WhatsAppIcon name="clip" size={20} color={colors.textMuted} />
        </Pressable>

        {!hasText && (
          <Pressable
            onPress={() => onSend('📷 [Photo instantanée]')}
            style={styles.iconButton}
            hitSlop={6}
          >
            <WhatsAppIcon name="camera" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Dynamic Action Button: Send or Mic */}
      <Pressable
        onPress={hasText ? handleSend : handleVoice}
        style={[
          styles.actionButton,
          { backgroundColor: colors.fabBg },
        ]}
        hitSlop={6}
      >
        <WhatsAppIcon
          name={hasText ? 'send' : 'mic'}
          size={18}
          color={colors.fabIcon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 6,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 8,
    minHeight: 46,
    maxHeight: 120,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  iconButton: {
    padding: 6,
  },
  actionButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
