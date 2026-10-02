import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeOverride = 'light' | 'dark' | null;

const STORAGE_KEY = 'bl-theme';

const ThemeOverrideCtx = createContext<{
  override: ThemeOverride;
  resolvedScheme: 'light' | 'dark';
  toggle: () => void;
}>({
  override: null,
  resolvedScheme: 'light',
  toggle: () => {},
});

// Mirrors the website's toggle: defaults to the system setting, but an
// explicit choice (persisted) overrides it either way, same as the site's
// own data-theme attribute + localStorage behavior.
export function ThemeOverrideProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<ThemeOverride>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') setOverride(saved);
      })
      .finally(() => setLoaded(true));
  }, []);

  const resolvedScheme = override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  function toggle() {
    const next: ThemeOverride = resolvedScheme === 'dark' ? 'light' : 'dark';
    setOverride(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }

  if (!loaded) return null;

  return (
    <ThemeOverrideCtx.Provider value={{ override, resolvedScheme, toggle }}>{children}</ThemeOverrideCtx.Provider>
  );
}

export function useThemeOverride() {
  return useContext(ThemeOverrideCtx);
}
