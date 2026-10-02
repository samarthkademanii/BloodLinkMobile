import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';
import { useTheme } from '@/theme/colors';

function TabIcon({ emoji, focused, color }: { emoji: string; focused: boolean; color: ColorValue }) {
  return <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6, color }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
          title: 'Dashboard',
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
