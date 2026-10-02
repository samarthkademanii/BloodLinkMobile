import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Theme } from '@/theme/colors';

export function Card({ theme, children, style }: { theme: Theme; children: React.ReactNode; style?: any }) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 10,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SectionHeader({ theme, title, right }: { theme: Theme; title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.fg }]}>{title}</Text>
      {right}
    </View>
  );
}

export function LiveDot({ theme, connected = true }: { theme: Theme; connected?: boolean }) {
  const color = connected ? theme.success : theme.warning;
  return (
    <View style={styles.liveDotWrap}>
      <View style={[styles.liveDotCircle, { backgroundColor: color }]} />
      <Text style={[styles.liveDotText, { color }]}>{connected ? 'Live' : 'Offline · demo data'}</Text>
    </View>
  );
}

export function Badge({
  label,
  bg,
  fg,
}: {
  label: string;
  bg: string;
  fg: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function StatCard({
  theme,
  label,
  value,
  valueColor,
  delta,
}: {
  theme: Theme;
  label: string;
  value: string;
  valueColor?: string;
  delta?: string;
}) {
  return (
    <Card theme={theme} style={{ flex: 1, padding: 14, minWidth: '45%' }}>
      <Text style={[styles.statLabel, { color: theme.fgMuted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor ?? theme.fg }]}>{value}</Text>
      {delta ? <Text style={[styles.statDelta, { color: theme.fgMuted }]}>{delta}</Text> : null}
    </Card>
  );
}

export function PrimaryButton({
  theme,
  label,
  onPress,
  variant = 'primary',
}: {
  theme: Theme;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
}) {
  const { Pressable } = require('react-native');
  const bg = variant === 'primary' ? theme.accent : variant === 'danger' ? theme.dangerSoft : 'transparent';
  const fg = variant === 'primary' ? '#fff' : variant === 'danger' ? theme.danger : theme.fg;
  const borderColor = variant === 'outline' ? theme.border : variant === 'danger' ? theme.danger : bg;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [
        styles.btn,
        { backgroundColor: bg, borderColor, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[styles.btnText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  liveDotWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDotCircle: { width: 7, height: 7, borderRadius: 4 },
  liveDotText: { fontSize: 11, fontWeight: '700' },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
  statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '700' },
  statDelta: { fontSize: 11, marginTop: 3 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontSize: 13, fontWeight: '700' },
});
