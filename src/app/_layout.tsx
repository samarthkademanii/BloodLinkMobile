import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { InventoryProvider } from '@/data/InventoryContext';

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <InventoryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </InventoryProvider>
  );
}
