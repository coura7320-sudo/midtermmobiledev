// =============================================================================
// Theme Context (Light / Dark Theme)
// Implements requirements:
//  - use Context api
//  - Dark and light theme
// =============================================================================

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeColors, ThemeMode, lightColors, darkColors } from '@/constants/theme';
import { KeyValueStore } from '@/services/storageService';

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  // Load persisted theme preference from local storage
  useEffect(() => {
    (async () => {
      const savedTheme = await KeyValueStore.getItem<ThemeMode>('theme_preference');
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    })();
  }, []);

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemScheme]);

  const colors = useMemo(() => {
    return isDark ? darkColors : lightColors;
  }, [isDark]);

  const toggleTheme = () => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(next);
    KeyValueStore.setItem('theme_preference', next);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    KeyValueStore.setItem('theme_preference', mode);
  };

  return (
    <ThemeContext.Provider value={{ theme: themeMode, colors, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
