import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    surface: string;
    onSurface: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
  };
}

const lightColors = {
  primary: '#3B82F6',
  background: '#FFFFFF',
  card: '#F8FAFC',
  text: '#1E293B',
  border: '#E2E8F0',
  notification: '#EF4444',
  surface: '#FFFFFF',
  onSurface: '#64748B',
  accent: '#8B5CF6',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

const darkColors = {
  primary: '#60A5FA',
  background: '#0F172A',
  card: '#1E293B',
  text: '#F1F5F9',
  border: '#334155',
  notification: '#F87171',
  surface: '#1E293B',
  onSurface: '#94A3B8',
  accent: '#A78BFA',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_KEY = '@bamboo_theme';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    loadStoredTheme();
  }, []);

  const loadStoredTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        setThemeState(storedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading stored theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  const value: ThemeContextType = {
    theme,
    isDark,
    setTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};