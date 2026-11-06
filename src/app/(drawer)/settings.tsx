// =============================================================================
// Settings Screen
// Implements requirements:
//  - Dark and light theme configuration
//  - Local storage inspect & wipe
//  - Backend API & WebSocket connection status
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { KeyValueStore, SecureStore } from '@/services/storageService';
import { API_BASE_URL, WS_BASE_URL } from '@/services/apiService';
import { WhatsAppIcon, IconName } from '@/components/WhatsAppIcon';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme, theme, setTheme } = useTheme();
  const { user, updateProfile, token } = useAuth();
  const { isSocketConnected, refreshAll } = useChat();

  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  const handleEditProfile = () => {
    Alert.prompt
      ? Alert.prompt(
          'Modifier le nom',
          'Entrez votre nouveau nom d\'utilisateur :',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Enregistrer',
              onPress: (val?: string) => {
                if (val && val.trim()) {
                  updateProfile({ name: val.trim() });
                }
              },
            },
          ],
          'plain-text',
          user.name
        )
      : Alert.alert('Profil', `Nom actuel : ${user.name}\nTéléphone : ${user.phone}`);
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Vider le stockage local',
      'Voulez-vous réinitialiser le cache local (SQLite / Key-Value store) ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: async () => {
            await KeyValueStore.clear();
            await refreshAll();
            Alert.alert('Succès', 'Stockage local réinitialisé et synchronisé avec le serveur.');
          },
        },
      ]
    );
  };

  const renderSectionHeader = (title: string) => (
    <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>{title}</Text>
  );

  const renderSettingRow = (
    icon: IconName,
    title: string,
    subtitle: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        {
          backgroundColor: pressed && onPress ? colors.surfaceElevated : colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.iconBox}>
        <WhatsAppIcon name={icon} size={22} color={colors.accentGreen} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle.length > 0 && (
          <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (
        <WhatsAppIcon name="arrow-forward" size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <WhatsAppIcon name="back" size={22} color={colors.headerIcons} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>Paramètres</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Profile Card */}
        <Pressable
          onPress={handleEditProfile}
          style={[styles.profileCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
        >
          <Image source={user.avatar} style={styles.avatar} contentFit="cover" />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              {user.name}
            </Text>
            <Text style={[styles.profileAbout, { color: colors.textMuted }]} numberOfLines={1}>
              {user.about}
            </Text>
            <Text style={[styles.profilePhone, { color: colors.accentGreen }]}>
              {user.phone}
            </Text>
          </View>
          <View style={styles.qrBox}>
            <WhatsAppIcon name="devices" size={22} color={colors.accentGreen} />
          </View>
        </Pressable>

        {/* Theme Settings Section */}
        {renderSectionHeader('Apparence & Thème')}
        {renderSettingRow(
          isDark ? 'moon' : 'sun',
          'Thème sombre',
          isDark ? 'Activé (WhatsApp Dark #0b141a)' : 'Désactivé (WhatsApp Clair #008069)',
          undefined,
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.accentGreen }}
            thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
          />
        )}

        {/* Backend & WebSocket Status */}
        {renderSectionHeader('Réseau & WebSocket')}
        {renderSettingRow(
          'devices',
          'Serveur WebSocket',
          isSocketConnected ? `Connecté en temps réel : ${WS_BASE_URL}` : `Déconnecté (${WS_BASE_URL})`,
          undefined,
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isSocketConnected ? '#25d366' : '#ea4335' },
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {isSocketConnected ? 'En ligne' : 'Hors ligne'}
            </Text>
          </View>
        )}
        {renderSettingRow(
          'info',
          'API REST Backend',
          API_BASE_URL,
          () => Alert.alert('Backend API', `URL active : ${API_BASE_URL}\nStatut : Opérationnel`)
        )}

        {/* Local Storage & Secure Storage */}
        {renderSectionHeader('Stockage & Données')}
        {renderSettingRow(
          'storage',
          'Stockage local (SQLite / Key-Value)',
          'Données des chats et messages mises en cache localement',
          handleClearCache
        )}
        {renderSettingRow(
          'lock',
          'Stockage sécurisé (SecureStore)',
          token ? `Jeton actif : ${token.substring(0, 16)}...` : 'Aucun jeton sécurisé',
          () => Alert.alert('Secure Storage', `Token JWT chiffré stocké en local :\n${token}`)
        )}

        {/* Notifications & Privacy */}
        {renderSectionHeader('Notifications & Confidentialité')}
        {renderSettingRow(
          'notifications',
          'Notifications push',
          'Sons et alertes de messages',
          undefined,
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: colors.accentGreen }}
            thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
          />
        )}
        {renderSettingRow(
          'check-double',
          'Confirmations de lecture',
          'Afficher les coches bleues (✓✓)',
          undefined,
          <Switch
            value={readReceipts}
            onValueChange={setReadReceipts}
            trackColor={{ false: '#767577', true: colors.accentGreen }}
            thumbColor={readReceipts ? '#ffffff' : '#f4f3f4'}
          />
        )}

        {/* About App */}
        {renderSectionHeader('Projet')}
        {renderSettingRow('info', 'À propos du projet', 'Midterm Mobile Dev 2026', () =>
          router.push('/(drawer)/about')
        )}
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
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileAbout: {
    fontSize: 13,
    marginTop: 3,
  },
  profilePhone: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  qrBox: {
    padding: 8,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  iconBox: {
    width: 30,
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
