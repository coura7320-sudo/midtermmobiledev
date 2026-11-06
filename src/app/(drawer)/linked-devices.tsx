// =============================================================================
// Linked Devices Screen (Appareils Connectés / WhatsApp Web)
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function LinkedDevicesScreen() {
  const { colors } = useTheme();

  const handleLinkDevice = () => {
    Alert.alert(
      'Connecter un appareil',
      'Pointez votre téléphone vers le QR Code affiché sur https://web.whatsapp.com pour lier votre session.'
    );
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <WhatsAppIcon name="back" size={22} color={colors.headerIcons} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>Appareils connectés</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.deviceIconCircle, { backgroundColor: colors.chipBg }]}>
          <WhatsAppIcon name="devices" size={48} color={colors.accentGreen} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Utiliser WhatsApp sur d'autres appareils
        </Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Liez votre compte sur WhatsApp Web, Desktop ou d'autres téléphones pour synchroniser vos discussions en temps réel.
        </Text>

        <Pressable
          style={[styles.linkBtn, { backgroundColor: colors.fabBg }]}
          onPress={handleLinkDevice}
        >
          <Text style={styles.linkBtnText}>Connecter un appareil</Text>
        </Pressable>

        <View style={styles.deviceList}>
          <Text style={[styles.deviceSectionTitle, { color: colors.textSecondary }]}>
            Statut des appareils
          </Text>
          <View style={[styles.deviceItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <WhatsAppIcon name="devices" size={22} color={colors.accentGreen} />
            <View style={styles.deviceInfo}>
              <Text style={[styles.deviceName, { color: colors.textPrimary }]}>
                Google Chrome (Windows)
              </Text>
              <Text style={[styles.deviceTime, { color: colors.textMuted }]}>
                Dernière activité aujourd'hui à 19:30
              </Text>
            </View>
          </View>
        </View>
      </View>
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
  content: {
    alignItems: 'center',
    padding: 24,
  },
  deviceIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  linkBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  linkBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceList: {
    width: '100%',
  },
  deviceSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 14,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
  },
  deviceTime: {
    fontSize: 12,
    marginTop: 2,
  },
});
