import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { InventoryProvider } from '@/data/InventoryContext';
import { useAppFonts } from '@/theme/fonts';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const scheme = useColorScheme();
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <InventoryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </InventoryProvider>
  );
}
