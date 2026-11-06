// =============================================================================
// Communities / Communautés Tab
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { WhatsAppHeader } from '@/components/WhatsAppHeader';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function CommunitiesScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <WhatsAppHeader title="Communautés" showSearch={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* New Community Row */}
        <Pressable
          style={({ pressed }) => [
            styles.newCommunityRow,
            { backgroundColor: pressed ? colors.surfaceElevated : colors.surface },
          ]}
          onPress={() => router.push('/new-message')}
        >
          <View style={[styles.newIconBox, { backgroundColor: colors.accentGreen }]}>
            <WhatsAppIcon name="communities" size={24} color="#ffffff" />
            <View style={styles.newPlus}>
              <WhatsAppIcon name="plus" size={12} color="#ffffff" />
            </View>
          </View>
          <Text style={[styles.newCommunityText, { color: colors.textPrimary }]}>
            Nouvelle communauté
          </Text>
        </Pressable>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Existing Community: DAUST Campus */}
        <View style={[styles.communityCard, { backgroundColor: colors.surface }]}>
          <View style={styles.communityHeader}>
            <Image
              source="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&auto=format&fit=crop&q=80"
              style={styles.communityAvatar}
            />
            <View style={styles.communityInfo}>
              <Text style={[styles.communityTitle, { color: colors.textPrimary }]}>
                DAUST Engineering Campus 🎓
              </Text>
              <Text style={[styles.communitySubtitle, { color: colors.textMuted }]}>
                Communauté officielle des étudiants & professeurs
              </Text>
            </View>
          </View>

          {/* Sub-groups */}
          <Pressable
            style={styles.subGroupItem}
            onPress={() =>
              router.push({
                pathname: '/chat/[id]',
                params: {
                  id: 'c5',
                  name: 'Annonces Campus',
                  avatar:
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
                },
              })
            }
          >
            <View style={[styles.subGroupIcon, { backgroundColor: colors.chipBg }]}>
              <WhatsAppIcon name="notifications" size={18} color={colors.accentGreen} />
            </View>
            <View style={styles.subGroupDetails}>
              <Text style={[styles.subGroupName, { color: colors.textPrimary }]}>
                📢 Annonces officielles
              </Text>
              <Text style={[styles.subGroupLastMsg, { color: colors.textSecondary }]}>
                Prof. Diop: N'oubliez pas les soutenances du midterm lundi.
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.subGroupItem}
            onPress={() =>
              router.push({
                pathname: '/chat/[id]',
                params: {
                  id: 'c5',
                  name: 'DAUST CS Mobile Dev Class 🎓',
                  avatar:
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
                },
              })
            }
          >
            <View style={[styles.subGroupIcon, { backgroundColor: colors.chipBg }]}>
              <WhatsAppIcon name="chats" size={18} color={colors.accentGreen} />
            </View>
            <View style={styles.subGroupDetails}>
              <Text style={[styles.subGroupName, { color: colors.textPrimary }]}>
                💻 CS3542 Mobile Dev Lab
              </Text>
              <Text style={[styles.subGroupLastMsg, { color: colors.textSecondary }]}>
                Fatou: Le code du WebSocket et Context API fonctionne super bien !
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  newCommunityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  newIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  newPlus: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#008069',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  newCommunityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 8,
  },
  communityCard: {
    paddingTop: 14,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  communityAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  communityInfo: {
    flex: 1,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  communitySubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  subGroupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 14,
  },
  subGroupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subGroupDetails: {
    flex: 1,
  },
  subGroupName: {
    fontSize: 15,
    fontWeight: '600',
  },
  subGroupLastMsg: {
    fontSize: 13,
    marginTop: 2,
  },
});
