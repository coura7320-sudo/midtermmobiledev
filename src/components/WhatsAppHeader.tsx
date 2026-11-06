// =============================================================================
// WhatsApp Top Header Component
// Includes WhatsApp title, search toggle, camera, drawer menu, and live WS indicator
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useChat } from '@/context/ChatContext';
import { WhatsAppIcon } from './WhatsAppIcon';

interface Props {
  title?: string;
  showSearch?: boolean;
  onCameraPress?: () => void;
}

export const WhatsAppHeader: React.FC<Props> = ({
  title = 'WhatsApp',
  showSearch = true,
  onCameraPress,
}) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { isSocketConnected, searchQuery, setSearchQuery } = useChat();
  const [isSearching, setIsSearching] = useState(false);

  const openDrawer = () => {
    if (typeof navigation.openDrawer === 'function') {
      navigation.openDrawer();
    } else {
      navigation.dispatch({ type: 'OPEN_DRAWER' });
    }
  };

  if (isSearching) {
    return (
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.searchBarBg }]}>
          <Pressable
            onPress={() => {
              setIsSearching(false);
              setSearchQuery('');
            }}
            hitSlop={8}
            style={styles.searchIconButton}
          >
            <WhatsAppIcon name="back" size={20} color={colors.textPrimary} />
          </Pressable>
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Rechercher..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Text style={[styles.clearText, { color: colors.textMuted }]}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
      <View style={styles.leftContainer}>
        {/* Drawer Menu Button */}
        <Pressable
          onPress={openDrawer}
          style={styles.iconButton}
          hitSlop={8}
          accessibilityLabel="Ouvrir le menu"
        >
          <WhatsAppIcon name="menu" size={22} color={colors.headerIcons} />
        </Pressable>

        <Text style={[styles.title, { color: colors.headerText }]}>{title}</Text>

        {/* Live WebSocket Connection Indicator */}
        <View
          style={[
            styles.wsDot,
            { backgroundColor: isSocketConnected ? '#25d366' : '#ea4335' },
          ]}
        />
      </View>

      <View style={styles.rightContainer}>
        {onCameraPress && (
          <Pressable onPress={onCameraPress} style={styles.iconButton} hitSlop={8}>
            <WhatsAppIcon name="camera" size={20} color={colors.headerIcons} />
          </Pressable>
        )}

        {showSearch && (
          <Pressable
            onPress={() => setIsSearching(true)}
            style={styles.iconButton}
            hitSlop={8}
          >
            <WhatsAppIcon name="search" size={20} color={colors.headerIcons} />
          </Pressable>
        )}

        <Pressable onPress={openDrawer} style={styles.iconButton} hitSlop={8}>
          <WhatsAppIcon name="dots-vertical" size={22} color={colors.headerIcons} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  wsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 12,
  },
  searchIconButton: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 16,
    paddingHorizontal: 6,
  },
});
