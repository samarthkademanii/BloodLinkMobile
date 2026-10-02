import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/colors';
import { hospitals as mockHospitals, type Hospital, type BloodType, type StockLevel } from '@/data/mockData';
import { usePoll } from '@/data/usePoll';
import { Card, LiveDot, SectionHeader } from '@/components/ui';

export default function Hospitals() {
  const theme = useTheme();
  const { data: hospitals, connected } = usePoll<Hospital[]>('/hospitals', mockHospitals);

  function chipColors(level: StockLevel) {
    if (level === 'critical') return { bg: theme.dangerSoft, fg: theme.danger };
    if (level === 'low') return { bg: theme.warningSoft, fg: theme.warning };
    return { bg: theme.successSoft, fg: theme.success };
  }

  return (
    <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={styles.content}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[styles.pageTitle, { color: theme.fg }]}>Partner Hospitals</Text>
        <LiveDot theme={theme} connected={connected} />
      </View>

      <View style={{ gap: 10, marginBottom: 20 }}>
        {hospitals.map((h, i) => (
          <Card key={h.name ?? i} theme={theme} style={{ padding: 14 }}>
            <Text style={[styles.hospitalName, { color: theme.fg }]}>{h.name}</Text>
            <Text style={{ color: theme.fgMuted, fontSize: 11, marginBottom: 10 }}>{h.address}</Text>
            <View style={styles.chipsRow}>
              {(Object.entries(h.needs) as [BloodType, StockLevel][]).map(([type, level]) => {
                const c = chipColors(level);
                return (
                  <View key={type} style={[styles.chip, { backgroundColor: c.bg }]}>
                    <Text style={{ color: c.fg, fontSize: 11, fontWeight: '700' }}>{type}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={{ color: theme.fgMuted, fontSize: 12, marginTop: 10 }}>📞 {h.phone}</Text>
          </Card>
        ))}
      </View>

      <SectionHeader theme={theme} title="Register Your Hospital" />
      <Card theme={theme} style={{ padding: 16 }}>
        <Text style={{ color: theme.fgMuted, fontSize: 12, lineHeight: 18 }}>
          Connect your blood bank to BloodLink to broadcast real-time inventory and receive donor matches. Reach
          out to our partnerships team at{' '}
          <Text style={{ color: theme.accent, fontWeight: '700' }}>partners@bloodlink.org</Text> to get started —
          onboarding typically completes within 48 hours.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  pageTitle: { fontSize: 22, fontWeight: '700', marginBottom: 14 },
  hospitalName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
});
