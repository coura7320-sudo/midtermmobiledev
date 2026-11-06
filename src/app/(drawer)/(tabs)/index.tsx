// =============================================================================
// Discussions (Chats) Tab - WhatsApp Home Screen
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useChat } from '@/context/ChatContext';
import { WhatsAppHeader } from '@/components/WhatsAppHeader';
import { FilterChips } from '@/components/FilterChips';
import { ChatItem } from '@/components/ChatItem';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function ChatsScreen() {
  const { colors } = useTheme();
  const { filteredChats, refreshAll, isSocketConnected } = useChat();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      {/* WhatsApp Top Header */}
      <WhatsAppHeader
        title="WhatsApp"
        onCameraPress={() => router.push('/new-message')}
      />

      {/* Filter Chips Bar */}
      <FilterChips />

      {/* Archived Row Banner */}
      <Pressable
        style={({ pressed }) => [
          styles.archivedRow,
          {
            backgroundColor: pressed ? colors.surfaceElevated : colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
        onPress={() => router.push('/(drawer)/starred')}
      >
        <View style={styles.archivedLeft}>
          <WhatsAppIcon name="archive" size={20} color={colors.accentGreen} />
          <Text style={[styles.archivedText, { color: colors.textPrimary }]}>
            Archivées
          </Text>
        </View>
        <Text style={[styles.archivedCount, { color: colors.accentGreen }]}>1</Text>
      </Pressable>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem chat={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accentGreen]}
            tintColor={colors.accentGreen}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <WhatsAppIcon name="chats" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              Aucune discussion trouvée
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Touchez le bouton en bas à droite pour démarrer une nouvelle conversation en temps réel.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* WhatsApp Green Floating Action Button (FAB) */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.fabBg }]}
        onPress={() => router.push('/new-message')}
      >
        <WhatsAppIcon name="chats" size={22} color={colors.fabIcon} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  archivedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  archivedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  archivedText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  archivedCount: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
