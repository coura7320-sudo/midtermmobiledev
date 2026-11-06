// =============================================================================
// About Screen - Midterm Project Information & Requirements Verification
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function AboutScreen() {
  const { colors } = useTheme();

  const requirements = [
    { title: 'Navigation Tabs & Drawer', desc: '4 onglets (Discussions, Actus, Communautés, Appels) + Menu latéral Drawer.', done: true },
    { title: 'Context API', desc: 'ThemeContext (Thème), AuthContext (Profil), ChatContext (Messages & Sockets).', done: true },
    { title: 'Thème Sombre & Clair', desc: 'Codes couleurs officiels de WhatsApp (#008069 / #1f2c34 / #0b141a).', done: true },
    { title: 'API Backend REST', desc: 'Serveur Node.js avec endpoints /chats, /messages, /contacts, /status, /profile.', done: true },
    { title: 'WebSocket en temps réel', desc: 'Messagerie instantanée bidirectionnelle, accusés de réception et indicateur de saisie.', done: true },
    { title: 'Stockage local (SQLite / Key-Value)', desc: 'Persistance locale avec KeyValueStore, SQLiteStore et SecureStore pour le token.', done: true },
    { title: 'Hooks React avancés', desc: 'useCallback, useMemo, useRef, useEffect, useDebounce et useLocalStorage.', done: true },
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <WhatsAppIcon name="back" size={22} color={colors.headerIcons} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>À propos du projet</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={[styles.bannerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.logoCircle, { backgroundColor: colors.accentGreen }]}>
            <WhatsAppIcon name="chats" size={32} color="#ffffff" />
          </View>
          <Text style={[styles.appTitle, { color: colors.textPrimary }]}>
            WhatsApp Prototype Mobile
          </Text>
          <Text style={[styles.appSubtitle, { color: colors.accentGreen }]}>
            Mobile Dev Midterm • DAUST 2026
          </Text>
          <Text style={[styles.appAuthor, { color: colors.textMuted }]}>
            Réalisé par : <Text style={{ fontWeight: 'bold', color: colors.textPrimary }}>Couraba Gueye</Text>
          </Text>
        </View>

        {/* Requirements Checklist */}
        <Text style={[styles.sectionHeading, { color: colors.textSecondary }]}>
          Vérification des exigences du professeur :
        </Text>

        {requirements.map((req, i) => (
          <View
            key={i}
            style={[
              styles.reqCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.checkCircle}>
              <WhatsAppIcon name="check-circle" size={18} color="#00a884" />
            </View>
            <View style={styles.reqContent}>
              <Text style={[styles.reqTitle, { color: colors.textPrimary }]}>
                {req.title}
              </Text>
              <Text style={[styles.reqDesc, { color: colors.textSecondary }]}>
                {req.desc}
              </Text>
            </View>
          </View>
        ))}

        {/* Architecture details */}
        <View style={[styles.infoCard, { backgroundColor: colors.chipBg }]}>
          <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
            Stack Technique :
          </Text>
          <Text style={[styles.infoBody, { color: colors.textSecondary }]}>
            • Frontend : React Native, Expo Router (SDK 57), TypeScript{'\n'}
            • Navigation : Expo Router Drawer + Tabs + Stacks{'\n'}
            • Backend : Node.js REST API + WebSocket (ws){'\n'}
            • Stockage : FileSystem Key-Value, SQLite Store & SecureStore
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  appAuthor: {
    fontSize: 13,
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  reqCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  checkCircle: {
    marginTop: 2,
  },
  reqContent: {
    flex: 1,
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  reqDesc: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoBody: {
    fontSize: 13,
    lineHeight: 20,
  },
});
