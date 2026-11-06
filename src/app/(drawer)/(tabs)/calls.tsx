// =============================================================================
// Calls / Appels Tab - WhatsApp Call Logs
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useChat } from '@/context/ChatContext';
import { WhatsAppHeader } from '@/components/WhatsAppHeader';
import { CallItem } from '@/components/CallItem';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function CallsScreen() {
  const { colors } = useTheme();
  const { calls } = useChat();

  const handleCreateLink = () => {
    Alert.alert(
      'Lien d\'appel WhatsApp',
      'Partagez ce lien pour inviter des contacts à un appel vidéo ou vocal WhatsApp : \n\nhttps://call.whatsapp.com/daust-cs3542-midterm'
    );
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <WhatsAppHeader title="Appels" />

      {/* Create Call Link Row */}
      <Pressable
        style={({ pressed }) => [
          styles.linkRow,
          { backgroundColor: pressed ? colors.surfaceElevated : colors.surface },
        ]}
        onPress={handleCreateLink}
      >
        <View style={[styles.linkIconBox, { backgroundColor: colors.accentGreen }]}>
          <WhatsAppIcon name="devices" size={20} color="#ffffff" />
        </View>
        <View style={styles.linkInfo}>
          <Text style={[styles.linkTitle, { color: colors.textPrimary }]}>
            Créer un lien d'appel
          </Text>
          <Text style={[styles.linkSubtitle, { color: colors.textMuted }]}>
            Partager un lien pour votre appel WhatsApp
          </Text>
        </View>
      </Pressable>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        Récents
      </Text>

      {/* Calls List */}
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CallItem call={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <WhatsAppIcon name="call" size={44} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Aucun appel récent
            </Text>
          </View>
        }
      />

      {/* Start Call FAB */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.fabBg }]}
        onPress={() => router.push('/new-message')}
      >
        <WhatsAppIcon name="call" size={22} color={colors.fabIcon} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  linkIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 15,
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
