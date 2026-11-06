// =============================================================================
// Status Story Viewer Screen (WhatsApp Fullscreen Story Modal)
// Animated progress timer, contact avatar, image & caption
// =============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

const { width, height } = Dimensions.get('window');

export default function StatusViewScreen() {
  const { name, avatar, text, image, timestamp } = useLocalSearchParams<{
    name: string;
    avatar: string;
    text: string;
    image?: string;
    timestamp: string;
  }>();

  const [progress, setProgress] = useState(0);

  // 5 seconds story countdown timer
  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const step = interval / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(timer);
          router.back();
          return 1;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top Story Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Story Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={avatar} style={styles.avatar} contentFit="cover" />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        </View>
        <Pressable onPress={() => router.back()} style={styles.closeBtn} hitSlop={10}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      {/* Main Story Content */}
      <View style={styles.content}>
        {image ? (
          <Image source={image} style={styles.storyImage} contentFit="cover" />
        ) : (
          <View style={styles.textStoryBox}>
            <Text style={styles.bigStoryText}>{text}</Text>
          </View>
        )}

        {/* Text Caption Overlay if image is present */}
        {image && text ? (
          <View style={styles.captionOverlay}>
            <Text style={styles.captionText}>{text}</Text>
          </View>
        ) : null}
      </View>

      {/* Reply bar at bottom */}
      <View style={styles.replyBar}>
        <TextInput
          style={styles.replyInput}
          placeholder="Répondre..."
          placeholderTextColor="rgba(255,255,255,0.7)"
        />
        <Pressable
          style={styles.replySend}
          onPress={() => {
            router.back();
          }}
        >
          <WhatsAppIcon name="send" size={20} color="#ffffff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  progressBarContainer: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  name: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '80%',
  },
  textStoryBox: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigStoryText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 34,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  captionText: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  replyInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 15,
  },
  replySend: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00a884',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
