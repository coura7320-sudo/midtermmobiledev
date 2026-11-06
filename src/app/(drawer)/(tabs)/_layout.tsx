// =============================================================================
// WhatsApp Tabs Layout Component
// 4 Tabs: Discussions (Chats), Actus (Status), Communautés, Appels (Calls)
// =============================================================================

import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useChat } from '@/context/ChatContext';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default function TabsLayout() {
  const { colors } = useTheme();
  const { totalUnreadCount } = useChat();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discussions',
          tabBarBadge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.badgeBg,
            color: colors.badgeText,
            fontSize: 10,
          },
          tabBarIcon: ({ color, focused }) => (
            <WhatsAppIcon name="chats" size={focused ? 24 : 22} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="status"
        options={{
          title: 'Actus',
          tabBarIcon: ({ color, focused }) => (
            <WhatsAppIcon name="status" size={focused ? 24 : 22} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Communautés',
          tabBarIcon: ({ color, focused }) => (
            <WhatsAppIcon name="communities" size={focused ? 24 : 22} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: 'Appels',
          tabBarIcon: ({ color, focused }) => (
            <WhatsAppIcon name="call" size={focused ? 24 : 22} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
