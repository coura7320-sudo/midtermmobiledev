// =============================================================================
// WhatsApp Filter Chips Component ("Tous", "Non lus", "Favoris", "Groupes")
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useChat, ChatFilter } from '@/context/ChatContext';

interface ChipItem {
  id: ChatFilter;
  label: string;
}

const CHIPS: ChipItem[] = [
  { id: 'all', label: 'Tous' },
  { id: 'unread', label: 'Non lus' },
  { id: 'favorites', label: 'Favoris' },
  { id: 'groups', label: 'Groupes' },
];

export const FilterChips: React.FC = () => {
  const { colors } = useTheme();
  const { activeFilter, setActiveFilter, totalUnreadCount } = useChat();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CHIPS.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <Pressable
              key={chip.id}
              onPress={() => setActiveFilter(chip.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? colors.chipActiveBg : colors.chipBg,
                  borderColor: isActive ? colors.accent : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? colors.chipActiveText : colors.chipText,
                    fontWeight: isActive ? 'bold' : '500',
                  },
                ]}
              >
                {chip.label}
                {chip.id === 'unread' && totalUnreadCount > 0 ? ` (${totalUnreadCount})` : ''}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
  },
});
