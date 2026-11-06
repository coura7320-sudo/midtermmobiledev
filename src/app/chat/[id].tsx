// =============================================================================
// Chat Screen (WhatsApp Conversation Interface)
// Real-time WebSocket messaging, typing indicator, authentic speech bubbles
// =============================================================================

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import { useChat } from '@/context/ChatContext';
import { ChatBubble } from '@/components/ChatBubble';
import { MessageInput } from '@/components/MessageInput';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function ChatScreen() {
  const { id, name, avatar } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();

  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    messages,
    sendMessage,
    markChatAsRead,
    sendTypingStatus,
    typingMap,
    chats,
    contacts,
  } = useChat();

  const flatListRef = useRef<FlatList>(null);

  // Find contact details
  const targetContact = useMemo(() => {
    return contacts.find((c) => c.id === id);
  }, [contacts, id]);

  const contactName = name || targetContact?.name || 'Contact';
  const contactAvatar =
    avatar ||
    targetContact?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

  const isTyping = !!typingMap[id];
  const typingText = typingMap[id] || '';

  const chatMessages = messages[id] || [];

  // Mark messages as read when opening chat
  useEffect(() => {
    if (id) {
      markChatAsRead(id);
    }
  }, [id, markChatAsRead]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages.length, isTyping]);

  const handleSend = (text: string) => {
    if (id) {
      sendMessage(id, text);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (id) {
      sendTypingStatus(id, typing);
    }
  };

  const handleAudioCall = () => {
    router.push({
      pathname: '/call-screen',
      params: { name: contactName, avatar: contactAvatar, isVideo: '0' },
    });
  };

  const handleVideoCall = () => {
    router.push({
      pathname: '/call-screen',
      params: { name: contactName, avatar: contactAvatar, isVideo: '1' },
    });
  };

  const handleOpenInfo = () => {
    router.push({
      pathname: '/contact-info/[id]',
      params: { id, name: contactName, avatar: contactAvatar },
    });
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.chatBackground }]}
      edges={['top', 'bottom']}
    >
      {/* WhatsApp Chat Top Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <WhatsAppIcon name="back" size={20} color={colors.headerIcons} />
          </Pressable>

          <Pressable onPress={handleOpenInfo} style={styles.contactPressable}>
            <Image source={contactAvatar} style={styles.headerAvatar} contentFit="cover" />
            <View style={styles.contactInfo}>
              <Text
                style={[styles.headerContactName, { color: colors.headerText }]}
                numberOfLines={1}
              >
                {contactName}
              </Text>
              <Text
                style={[
                  styles.headerStatus,
                  { color: isTyping ? '#25d366' : 'rgba(255,255,255,0.85)' },
                ]}
                numberOfLines={1}
              >
                {isTyping ? typingText : targetContact?.online ? 'en ligne' : 'Vu aujourd\'hui à 19:25'}
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.headerRight}>
          <Pressable onPress={handleVideoCall} style={styles.headerActionBtn} hitSlop={8}>
            <WhatsAppIcon name="video" size={20} color={colors.headerIcons} />
          </Pressable>
          <Pressable onPress={handleAudioCall} style={styles.headerActionBtn} hitSlop={8}>
            <WhatsAppIcon name="call" size={20} color={colors.headerIcons} />
          </Pressable>
          <Pressable onPress={handleOpenInfo} style={styles.headerActionBtn} hitSlop={8}>
            <WhatsAppIcon name="dots-vertical" size={20} color={colors.headerIcons} />
          </Pressable>
        </View>
      </View>

      {/* Chat Messages Body with Keyboard Avoidance */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item} showSenderName={id === 'c5'} />
          )}
          contentContainerStyle={styles.messagesList}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {/* End-to-end encryption notice pill */}
              <View style={[styles.encryptionPill, { backgroundColor: colors.surfaceElevated }]}>
                <WhatsAppIcon name="lock" size={12} color={colors.textMuted} />
                <Text style={[styles.encryptionText, { color: colors.textMuted }]}>
                  Les messages et appels sont chiffrés de bout en bout.
                </Text>
              </View>

              {/* Date pill */}
              <View style={[styles.datePill, { backgroundColor: colors.chipBg }]}>
                <Text style={[styles.datePillText, { color: colors.textMuted }]}>
                  AUJOURD'HUI
                </Text>
              </View>
            </View>
          }
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.typingBubble, { backgroundColor: colors.bubbleOther }]}>
                <Text style={[styles.typingBubbleText, { color: colors.accentGreen }]}>
                  {typingText}
                </Text>
              </View>
            ) : null
          }
        />

        {/* Message Input Footer */}
        <MessageInput onSend={handleSend} onTyping={handleTyping} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    padding: 6,
    marginRight: 2,
  },
  contactPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contactInfo: {
    flex: 1,
  },
  headerContactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerStatus: {
    fontSize: 12,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 6,
  },
  headerActionBtn: {
    padding: 6,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    flexGrow: 1,
  },
  listHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  encryptionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 6,
    elevation: 1,
  },
  encryptionText: {
    fontSize: 11,
    textAlign: 'center',
    flex: 1,
  },
  datePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    elevation: 1,
  },
  datePillText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  typingBubble: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '75%',
    marginLeft: 12,
    marginVertical: 4,
    alignSelf: 'flex-start',
    elevation: 1,
  },
  typingBubbleText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});
