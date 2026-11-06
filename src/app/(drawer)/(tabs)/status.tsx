// =============================================================================
// Updates / Actus (Status) Tab - WhatsApp Status Stories
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { WhatsAppHeader } from '@/components/WhatsAppHeader';
import { StatusItem } from '@/components/StatusItem';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function StatusScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { statusStories, addStatusStory } = useChat();

  const handleAddStatus = () => {
    Alert.prompt
      ? Alert.prompt(
          'Nouveau statut',
          'Que voulez-vous partager avec vos contacts ?',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Publier',
              onPress: (text?: string) => {
                if (text && text.trim()) {
                  addStatusStory(text.trim());
                }
              },
            },
          ],
          'plain-text',
          'Présentation du prototype WhatsApp en cours ! 🚀'
        )
      : Alert.alert('Statut', 'Ajout d\'un statut rapide :', [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Publier',
            onPress: () =>
              addStatusStory('Présentation du prototype WhatsApp en cours ! 🚀'),
          },
        ]);
  };

  const myStatus = statusStories.find((s) => s.mine) || {
    id: 's_me',
    contactId: user.id || 'user_me',
    name: 'Mon statut',
    avatar: user.avatar,
    timestamp: 'Appuyez pour ajouter une actualité',
    text: user.about,
    viewed: true,
    mine: true,
  };

  const recentUpdates = statusStories.filter((s) => !s.mine && !s.viewed);
  const viewedUpdates = statusStories.filter((s) => !s.mine && s.viewed);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <WhatsAppHeader title="Actus" onCameraPress={handleAddStatus} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Header Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Statut</Text>

        {/* My Status */}
        <StatusItem status={myStatus} isMyStatus onAddPress={handleAddStatus} />

        {/* Recent Updates */}
        {recentUpdates.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Mises à jour récentes
            </Text>
            {recentUpdates.map((item) => (
              <StatusItem key={item.id} status={item} />
            ))}
          </>
        )}

        {/* Viewed Updates */}
        {viewedUpdates.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Mises à jour vues
            </Text>
            {viewedUpdates.map((item) => (
              <StatusItem key={item.id} status={item} />
            ))}
          </>
        )}

        {/* Security / Privacy notice */}
        <View style={styles.privacyBox}>
          <WhatsAppIcon name="lock" size={14} color={colors.textMuted} />
          <Text style={[styles.privacyText, { color: colors.textMuted }]}>
            Vos mises à jour de statut sont chiffrées de bout en bout.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <Pressable
          style={[styles.smallFab, { backgroundColor: colors.surfaceElevated }]}
          onPress={handleAddStatus}
        >
          <WhatsAppIcon name="pencil" size={18} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          style={[styles.fab, { backgroundColor: colors.fabBg }]}
          onPress={handleAddStatus}
        >
          <WhatsAppIcon name="camera" size={22} color={colors.fabIcon} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  privacyText: {
    fontSize: 12,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    gap: 12,
  },
  smallFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  fab: {
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
