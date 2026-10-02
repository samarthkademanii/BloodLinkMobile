import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { alerts as mockAlerts, timeAgo, type Alert } from '@/data/mockData';
import { usePoll } from '@/data/usePoll';
import { Card, LiveDot, PrimaryButton, SectionHeader } from '@/components/ui';

export default function Alerts() {
  const theme = useTheme();
  const { data: alerts, connected } = usePoll<Alert[]>('/alerts', mockAlerts);

  function iconBg(level: string) {
    if (level === 'critical') return theme.dangerSoft;
    if (level === 'warning') return theme.warningSoft;
    return theme.accentSoft;
  }
  function borderColor(level: string) {
    if (level === 'critical') return theme.danger;
    if (level === 'warning') return theme.warning;
    return theme.border;
  }

  return (
    <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={styles.content}>
      <SectionHeader theme={theme} title="Emergency Alerts" right={<LiveDot theme={theme} connected={connected} />} />

      <View style={{ gap: 10, marginBottom: 20 }}>
        {alerts.map((a, i) => (
          <Card key={`${a.title}-${i}`} theme={theme} style={[styles.card, { borderColor: borderColor(a.level) }]}>
            <View style={[styles.icon, { backgroundColor: iconBg(a.level) }]}>
              <Text style={{ fontSize: 16 }}>{a.icon}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.title, { color: theme.fg }]}>{a.title}</Text>
              <Text style={[styles.text, { color: theme.fgMuted }]}>{a.text}</Text>
              <Text style={[styles.meta, { color: theme.fgMuted }]}>
                {timeAgo(a.createdAt)}
                {a.hospital ? ` · ${a.hospital}` : ''}
              </Text>
              <View style={styles.actions}>
                {a.level === 'critical' && <PrimaryButton theme={theme} label="Respond Now" variant="danger" onPress={() => {}} />}
                <PrimaryButton theme={theme} label="Details" variant="outline" onPress={() => {}} />
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  card: { flexDirection: 'row', gap: 12, padding: 14, borderWidth: 1.5 },
  icon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.bodyBold, fontSize: 13, marginBottom: 3 },
  text: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, marginBottom: 6 },
  meta: { fontFamily: fonts.body, fontSize: 11, marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8 },
});
