// =============================================================================
// Active Call Screen (Audio / Video Call Interface)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function CallScreen() {
  const { name, avatar, isVideo } = useLocalSearchParams<{
    name: string;
    avatar: string;
    isVideo?: string;
  }>();

  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(isVideo === '1');

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleHangUp = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topInfo}>
        <View style={styles.encryptionHeader}>
          <WhatsAppIcon name="lock" size={14} color="#aebac1" />
          <Text style={styles.encryptionText}>Appel chiffré de bout en bout</Text>
        </View>

        <Text style={styles.contactName}>{name}</Text>
        <Text style={styles.callStatus}>
          {callDuration > 0 ? formatDuration(callDuration) : 'Appel en cours...'}
        </Text>
      </View>

      <View style={styles.centerAvatarContainer}>
        <Image source={avatar} style={styles.avatar} contentFit="cover" />
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <Pressable
            style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
            onPress={() => setIsSpeaker(!isSpeaker)}
          >
            <WhatsAppIcon name="phone" size={24} color="#ffffff" />
          </Pressable>

          <Pressable
            style={[styles.controlBtn, isVideoOn && styles.controlBtnActive]}
            onPress={() => setIsVideoOn(!isVideoOn)}
          >
            <WhatsAppIcon name="video" size={24} color="#ffffff" />
          </Pressable>

          <Pressable
            style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
            onPress={() => setIsMuted(!isMuted)}
          >
            <WhatsAppIcon name="mic" size={24} color="#ffffff" />
          </Pressable>

          {/* Red Hangup button */}
          <Pressable style={styles.hangupBtn} onPress={handleHangUp}>
            <WhatsAppIcon name="call" size={26} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1c24',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  topInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  encryptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  encryptionText: {
    color: '#aebac1',
    fontSize: 12,
  },
  contactName: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  callStatus: {
    color: '#aebac1',
    fontSize: 15,
    marginTop: 6,
  },
  centerAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#00a884',
  },
  controlsContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1f2c34',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnActive: {
    backgroundColor: '#00a884',
  },
  hangupBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ea4335',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
