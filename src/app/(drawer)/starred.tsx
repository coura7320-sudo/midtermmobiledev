// =============================================================================
// Starred Messages Screen (Messages Importants)
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function StarredScreen() {
  const { colors } = useTheme();

  const starredItems = [
    {
      id: 'star_1',
      sender: 'Prof. Diop (Mobile Dev)',
      date: 'Aujourd hui à 19:15',
      text: "Consignes du Midterm : Tabs, Drawer, Context API, Dark/Light theme, Backend API, WebSocket et Local Storage.",
    },
    {
      id: 'star_2',
      sender: 'Fatou Ndiaye',
      date: 'Hier à 17:15',
      text: "N'oublie pas de vérifier que le WebSocket fonctionne en temps réel avec le prof !",
    },
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <WhatsAppIcon name="back" size={22} color={colors.headerIcons} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>Messages importants</Text>
      </View>

      <FlatList
        data={starredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.sender, { color: colors.accentGreen }]}>{item.sender}</Text>
              <Text style={[styles.date, { color: colors.textMuted }]}>{item.date}</Text>
            </View>
            <Text style={[styles.text, { color: colors.textPrimary }]}>{item.text}</Text>
            <View style={styles.starFooter}>
              <WhatsAppIcon name="star" size={14} color="#fbc02d" />
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 16,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sender: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  starFooter: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },
});
