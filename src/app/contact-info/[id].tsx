// =============================================================================
// Contact Profile & Info Screen
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import { useChat } from '@/context/ChatContext';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function ContactInfoScreen() {
  const { id, name, avatar } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();

  const { colors } = useTheme();
  const { contacts } = useChat();

  const contact = contacts.find((c) => c.id === id);
  const displayName = name || contact?.name || 'Contact';
  const displayAvatar =
    avatar ||
    contact?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
  const displayPhone = contact?.phone || '+221 77 000 00 00';
  const displayAbout = contact?.about || 'Hey there! I am using WhatsApp';

  const handleAudioCall = () => {
    router.push({
      pathname: '/call-screen',
      params: { name: displayName, avatar: displayAvatar, isVideo: '0' },
    });
  };

  const handleVideoCall = () => {
    router.push({
      pathname: '/call-screen',
      params: { name: displayName, avatar: displayAvatar, isVideo: '1' },
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header Card */}
      <View style={[styles.headerCard, { backgroundColor: colors.surface }]}>
        <Image source={displayAvatar} style={styles.avatar} contentFit="cover" />
        <Text style={[styles.name, { color: colors.textPrimary }]}>{displayName}</Text>
        <Text style={[styles.phone, { color: colors.textMuted }]}>{displayPhone}</Text>

        {/* Quick Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <Pressable style={styles.actionCol} onPress={handleAudioCall}>
            <View style={[styles.actionIconCircle, { backgroundColor: colors.chipBg }]}>
              <WhatsAppIcon name="call" size={20} color={colors.accentGreen} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>Audio</Text>
          </Pressable>

          <Pressable style={styles.actionCol} onPress={handleVideoCall}>
            <View style={[styles.actionIconCircle, { backgroundColor: colors.chipBg }]}>
              <WhatsAppIcon name="video" size={20} color={colors.accentGreen} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>Vidéo</Text>
          </Pressable>

          <Pressable
            style={styles.actionCol}
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id } })}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: colors.chipBg }]}>
              <WhatsAppIcon name="chats" size={20} color={colors.accentGreen} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>Message</Text>
          </Pressable>
        </View>
      </View>

      {/* About & Phone Card */}
      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Actu</Text>
        <Text style={[styles.aboutText, { color: colors.textPrimary }]}>{displayAbout}</Text>
        <Text style={[styles.dateText, { color: colors.textMuted }]}>
          Mis à jour récemment
        </Text>
      </View>

      {/* Encryption & Security Card */}
      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <View style={styles.securityRow}>
          <WhatsAppIcon name="lock" size={20} color={colors.accentGreen} />
          <View style={styles.securityTextContainer}>
            <Text style={[styles.securityTitle, { color: colors.textPrimary }]}>
              Chiffrement
            </Text>
            <Text style={[styles.securityDesc, { color: colors.textMuted }]}>
              Les messages et les appels sont chiffrés de bout en bout. Touchez pour vérifier.
            </Text>
          </View>
        </View>
      </View>

      {/* Media & Docs Card */}
      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <View style={styles.mediaRow}>
          <Text style={[styles.mediaTitle, { color: colors.textPrimary }]}>
            Médias, liens et documents
          </Text>
          <Text style={[styles.mediaCount, { color: colors.textMuted }]}>12 ›</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
          <Image
            source="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80"
            style={styles.mediaThumb}
          />
          <Image
            source="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&auto=format&fit=crop&q=80"
            style={styles.mediaThumb}
          />
          <Image
            source="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&auto=format&fit=crop&q=80"
            style={styles.mediaThumb}
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    marginTop: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 20,
  },
  actionCol: {
    alignItems: 'center',
    gap: 6,
  },
  actionIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoCard: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 22,
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityDesc: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  mediaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  mediaCount: {
    fontSize: 14,
  },
  mediaScroll: {
    flexDirection: 'row',
  },
  mediaThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 8,
  },
});
