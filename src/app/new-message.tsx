// =============================================================================
// New Message / Select Contact Modal
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useChat } from '@/context/ChatContext';
import { Contact } from '@/services/apiService';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function NewMessageModal() {
  const { colors } = useTheme();
  const { contacts, startNewChat } = useChat();
  const [search, setSearch] = useState('');

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectContact = (contact: Contact) => {
    const chatId = startNewChat(contact);
    router.replace({
      pathname: '/chat/[id]',
      params: { id: chatId, name: contact.name, avatar: contact.avatar },
    });
  };

  const renderHeaderAction = (icon: any, title: string, subtitle?: string) => (
    <Pressable
      style={({ pressed }) => [
        styles.actionRow,
        { backgroundColor: pressed ? colors.surfaceElevated : colors.surface },
      ]}
      onPress={() => {}}
    >
      <View style={[styles.actionIconBox, { backgroundColor: colors.accentGreen }]}>
        <WhatsAppIcon name={icon} size={20} color="#ffffff" />
      </View>
      <View style={styles.actionTextContainer}>
        <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Input Bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.searchBarBg }]}>
        <WhatsAppIcon name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Rechercher un contact..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Text style={{ color: colors.textMuted }}>✕</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {renderHeaderAction('communities', 'Nouveau groupe')}
            {renderHeaderAction('user', 'Nouveau contact', 'Ajouter avec QR code')}
            {renderHeaderAction('communities', 'Nouvelle communauté')}
            <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>
              Contacts sur WhatsApp ({filteredContacts.length})
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.contactRow,
              { backgroundColor: pressed ? colors.surfaceElevated : colors.surface },
            ]}
            onPress={() => handleSelectContact(item)}
          >
            <Image source={item.avatar} style={styles.avatar} contentFit="cover" />
            <View style={styles.contactInfo}>
              <Text style={[styles.name, { color: colors.textPrimary }]}>
                {item.name}
              </Text>
              <Text style={[styles.about, { color: colors.textMuted }]} numberOfLines={1}>
                {item.about}
              </Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 21,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  list: {
    paddingBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 14,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  about: {
    fontSize: 13,
    marginTop: 2,
  },
});
