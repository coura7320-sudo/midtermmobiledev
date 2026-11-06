// =============================================================================
// Drawer Layout Component (with Custom WhatsApp Drawer Sidebar)
// Implements requirements:
//  - Tabs, Drawer
//  - Dark and light theme toggle
// =============================================================================

import { Drawer } from 'expo-router/drawer';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { WhatsAppIcon, IconName } from '@/components/WhatsAppIcon';

function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const menuItems: { label: string; icon: IconName; route: string }[] = [
    { label: 'Discussions', icon: 'chats', route: '/(drawer)/(tabs)' },
    { label: 'Nouveau groupe', icon: 'communities', route: '/new-message' },
    { label: 'Appareils connectés', icon: 'devices', route: '/(drawer)/linked-devices' },
    { label: 'Messages importants', icon: 'star', route: '/(drawer)/starred' },
    { label: 'Paramètres', icon: 'settings', route: '/(drawer)/settings' },
    { label: 'À propos', icon: 'info', route: '/(drawer)/about' },
  ];

  return (
    <View style={[styles.drawerContainer, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Drawer WhatsApp Profile Header */}
      <View style={[styles.headerBanner, { backgroundColor: colors.headerBg }]}>
        <Image source={user.avatar} style={styles.headerAvatar} contentFit="cover" />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.headerText }]}>
            {user.name}
          </Text>
          <Text style={[styles.headerPhone, { color: 'rgba(255,255,255,0.8)' }]}>
            {user.phone}
          </Text>
          <Text style={[styles.headerAbout, { color: 'rgba(255,255,255,0.85)' }]} numberOfLines={1}>
            {user.about}
          </Text>
        </View>
      </View>

      {/* Navigation Links */}
      <ScrollView style={styles.menuScroll}>
        {menuItems.map((item, idx) => (
          <Pressable
            key={idx}
            onPress={() => {
              props.navigation.closeDrawer();
              router.navigate(item.route as any);
            }}
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: pressed ? colors.surfaceElevated : 'transparent' },
            ]}
          >
            <View style={styles.menuIconBox}>
              <WhatsAppIcon name={item.icon} size={22} color={colors.accentGreen} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Bottom Theme Toggle Bar */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        <View style={styles.themeRow}>
          <View style={styles.themeLeft}>
            <WhatsAppIcon name={isDark ? 'moon' : 'sun'} size={20} color={colors.accentGreen} />
            <Text style={[styles.themeText, { color: colors.textPrimary }]}>
              Thème sombre
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.accentGreen }}
            thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
          />
        </View>
        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          WhatsApp Prototype • DAUST Midterm 2026
        </Text>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
          width: 310,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'WhatsApp',
          title: 'WhatsApp',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          headerShown: false,
          drawerLabel: 'Paramètres',
          title: 'Paramètres',
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          headerShown: false,
          drawerLabel: 'À propos',
          title: 'À propos',
        }}
      />
      <Drawer.Screen
        name="starred"
        options={{
          headerShown: false,
          drawerLabel: 'Messages importants',
          title: 'Messages importants',
        }}
      />
      <Drawer.Screen
        name="linked-devices"
        options={{
          headerShown: false,
          drawerLabel: 'Appareils connectés',
          title: 'Appareils connectés',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  headerBanner: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  headerAbout: {
    fontSize: 12,
    marginTop: 3,
    fontStyle: 'italic',
  },
  menuScroll: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuIconBox: {
    width: 28,
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
