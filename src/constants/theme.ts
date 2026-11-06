// =============================================================================
// WhatsApp Theme Colors & Styling Constants
// =============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  headerBg: string;
  headerText: string;
  headerIcons: string;
  background: string;
  chatBackground: string;
  surface: string;
  surfaceElevated: string;
  bubbleMine: string;
  bubbleMineText: string;
  bubbleOther: string;
  bubbleOtherText: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  accentGreen: string;
  fabBg: string;
  fabIcon: string;
  badgeBg: string;
  badgeText: string;
  readTick: string;
  deliveredTick: string;
  searchBarBg: string;
  searchBarText: string;
  chipBg: string;
  chipActiveBg: string;
  chipText: string;
  chipActiveText: string;
  tabBarBg: string;
  tabBarActive: string;
  tabBarInactive: string;
  inputBg: string;
  inputText: string;
  modalBg: string;
  danger: string;
}

export const lightColors: ThemeColors = {
  headerBg: '#008069',
  headerText: '#ffffff',
  headerIcons: '#ffffff',
  background: '#ffffff',
  chatBackground: '#efeae2',
  surface: '#ffffff',
  surfaceElevated: '#f7f8fa',
  bubbleMine: '#d9fdd3',
  bubbleMineText: '#111b21',
  bubbleOther: '#ffffff',
  bubbleOtherText: '#111b21',
  textPrimary: '#111b21',
  textSecondary: '#667781',
  textMuted: '#8696a0',
  border: '#e9edef',
  accent: '#008069',
  accentGreen: '#25d366',
  fabBg: '#008069',
  fabIcon: '#ffffff',
  badgeBg: '#25d366',
  badgeText: '#ffffff',
  readTick: '#53bdeb',
  deliveredTick: '#8696a0',
  searchBarBg: '#f0f2f5',
  searchBarText: '#111b21',
  chipBg: '#f0f2f5',
  chipActiveBg: '#d9fdd3',
  chipText: '#54656f',
  chipActiveText: '#008069',
  tabBarBg: '#ffffff',
  tabBarActive: '#008069',
  tabBarInactive: '#667781',
  inputBg: '#ffffff',
  inputText: '#111b21',
  modalBg: '#ffffff',
  danger: '#ea4335',
};

export const darkColors: ThemeColors = {
  headerBg: '#1f2c34',
  headerText: '#e9edef',
  headerIcons: '#aebac1',
  background: '#111b21',
  chatBackground: '#0b141a',
  surface: '#111b21',
  surfaceElevated: '#202c33',
  bubbleMine: '#005c4b',
  bubbleMineText: '#e9edef',
  bubbleOther: '#202c33',
  bubbleOtherText: '#e9edef',
  textPrimary: '#e9edef',
  textSecondary: '#8696a0',
  textMuted: '#667781',
  border: '#222d34',
  accent: '#00a884',
  accentGreen: '#00a884',
  fabBg: '#00a884',
  fabIcon: '#ffffff',
  badgeBg: '#00a884',
  badgeText: '#111b21',
  readTick: '#53bdeb',
  deliveredTick: '#8696a0',
  searchBarBg: '#202c33',
  searchBarText: '#e9edef',
  chipBg: '#202c33',
  chipActiveBg: '#0a332c',
  chipText: '#8696a0',
  chipActiveText: '#00a884',
  tabBarBg: '#111b21',
  tabBarActive: '#00a884',
  tabBarInactive: '#8696a0',
  inputBg: '#2a3942',
  inputText: '#e9edef',
  modalBg: '#1f2c34',
  danger: '#f28b82',
};
