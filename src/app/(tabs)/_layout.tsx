import { Tabs } from 'expo-router';
import { Pressable, Text, type ColorValue } from 'react-native';
import { useTheme } from '@/theme/colors';
import { useThemeOverride } from '@/theme/ThemeContext';
import { fonts } from '@/theme/fonts';

function TabIcon({ emoji, focused, color }: { emoji: string; focused: boolean; color: ColorValue }) {
  return <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6, color }}>{emoji}</Text>;
}

function ThemeToggleButton() {
  const theme = useTheme();
  const { resolvedScheme, toggle } = useThemeOverride();
  return (
    <Pressable
      onPress={toggle}
      hitSlop={10}
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: theme.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
      }}
    >
      <Text style={{ fontSize: 15, color: theme.fgMuted }}>{resolvedScheme === 'dark' ? '☾' : '☀'}</Text>
    </Pressable>
  );
}

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.surface },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: fonts.display, fontSize: 20, color: theme.fg },
        headerRight: () => <ThemeToggleButton />,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.fgMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'BloodLink',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="📊" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="find"
        options={{
          title: 'Find Blood',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🔍" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="donate"
        options={{
          title: 'Donate',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🩸" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="hospitals"
        options={{
          title: 'Hospitals',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🏥" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🚨" focused={focused} color={color} />,
        }}
      />
    </Tabs>
  );
}
