import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme/colors';
import { useInventory } from '@/data/InventoryContext';
import { usePoll } from '@/data/usePoll';
import { bloodTypes, compatibility, hospitals as mockHospitals, levelColor, type Hospital, type BloodType } from '@/data/mockData';
import { Card, PrimaryButton, SectionHeader } from '@/components/ui';

export default function FindBlood() {
  const theme = useTheme();
  const inventory = useInventory();
  const { data: hospitals } = usePoll<Hospital[]>('/hospitals', mockHospitals);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<BloodType | 'all'>('all');

  const results = useMemo(() => {
    const rows: { type: BloodType; hospital: string; address: string; units: number; pct: number }[] = [];
    hospitals.forEach((h) => {
      (Object.keys(h.needs) as BloodType[]).forEach((type) => {
        if (filter !== 'all' && filter !== type) return;
        const q = query.toLowerCase();
        if (q && !h.name.toLowerCase().includes(q) && !h.address.toLowerCase().includes(q)) return;
        const inv = inventory[type];
        const pct = inv ? inv.units / inv.max : 0;
        rows.push({ type, hospital: h.name, address: h.address, units: inv?.units ?? 0, pct });
      });
    });
    rows.sort((a, b) => a.pct - b.pct);
    return rows;
  }, [query, filter, inventory, hospitals]);

  return (
    <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={styles.content}>
      <Text style={[styles.pageTitle, { color: theme.fg }]}>Find Blood</Text>

      <TextInput
        placeholder="Hospital name or location…"
        placeholderTextColor={theme.fgMuted}
        value={query}
        onChangeText={setQuery}
        style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.fg }]}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={['all', ...bloodTypes] as (BloodType | 'all')[]}
        keyExtractor={(t) => t}
        style={{ marginBottom: 16, flexGrow: 0 }}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => {
          const active = filter === item;
          return (
            <Text
              onPress={() => setFilter(item)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.accent : theme.surface,
                  borderColor: active ? theme.accent : theme.border,
                  color: active ? '#fff' : theme.fgMuted,
                },
              ]}
            >
              {item === 'all' ? 'All Types' : item}
            </Text>
          );
        }}
      />

      {results.length === 0 ? (
        <Text style={{ color: theme.fgMuted, textAlign: 'center', paddingVertical: 24 }}>No results found</Text>
      ) : (
        <View style={styles.resultsGrid}>
          {results.map((r, i) => {
            const color = levelColor(r.pct, theme);
            return (
              <Card key={`${r.hospital}-${r.type}-${i}`} theme={theme} style={styles.resultCard}>
                <View style={styles.resultTop}>
                  <Text style={[styles.resultType, { color }]}>{r.type}</Text>
                  <Text style={{ color: theme.fgMuted, fontSize: 11, textAlign: 'right' }}>
                    <Text style={{ color, fontSize: 16, fontWeight: '700' }}>{r.units}</Text>{'\n'}units
                  </Text>
                </View>
                <Text style={[styles.resultHospital, { color: theme.fg }]}>{r.hospital}</Text>
                <Text style={{ color: theme.fgMuted, fontSize: 11 }}>{r.address}</Text>
                <PrimaryButton theme={theme} label="Contact Blood Bank" variant="outline" onPress={() => {}} />
              </Card>
            );
          })}
        </View>
      )}

      <SectionHeader theme={theme} title="Blood Type Compatibility" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 32 }}>
        <View>
          <View style={styles.compatRow}>
            <Text style={[styles.compatHeadCell, { color: theme.fgMuted }]}>Donor</Text>
            {bloodTypes.map((t) => (
              <Text key={t} style={[styles.compatHeadCell, { color: theme.fgMuted }]}>
                {t}
              </Text>
            ))}
          </View>
          {bloodTypes.map((donor, i) => (
            <View
              key={donor}
              style={[
                styles.compatRow,
                { backgroundColor: theme.surface, borderBottomWidth: i < bloodTypes.length - 1 ? 1 : 0, borderBottomColor: theme.border },
              ]}
            >
              <Text style={[styles.compatDonorCell, { color: theme.accent }]}>{donor}</Text>
              {bloodTypes.map((recv) => {
                const can = compatibility[donor].includes(recv);
                return (
                  <View key={recv} style={styles.compatCellWrap}>
                    <View
                      style={[
                        styles.compatDot,
                        { backgroundColor: can ? theme.successSoft : theme.surface2 },
                      ]}
                    >
                      <Text style={{ fontSize: 9, color: can ? theme.success : theme.fgMuted, fontWeight: '700' }}>
                        {can ? '✓' : '–'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  pageTitle: { fontSize: 22, fontWeight: '700', marginBottom: 14 },
  search: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1.5, fontSize: 12, fontWeight: '700', overflow: 'hidden' },
  resultsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  resultCard: { width: '47%', padding: 12, gap: 6 },
  resultTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  resultType: { fontSize: 22, fontWeight: '700' },
  resultHospital: { fontSize: 13, fontWeight: '700' },
  compatRow: { flexDirection: 'row', alignItems: 'center' },
  compatHeadCell: { width: 40, fontSize: 10, fontWeight: '700', textAlign: 'center', paddingVertical: 6 },
  compatDonorCell: { width: 40, fontSize: 11, fontWeight: '700', paddingVertical: 8, textAlign: 'center' },
  compatCellWrap: { width: 40, alignItems: 'center', justifyContent: 'center' },
  compatDot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
});
