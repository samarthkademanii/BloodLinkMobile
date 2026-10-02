import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { useInventory, useBackendConnected, totalUnits } from '@/data/InventoryContext';
import { usePoll } from '@/data/usePoll';
import { bloodTypes, donors as mockDonors, requests as mockRequests, hospitals as mockHospitals, levelColor, levelStatus, timeAgo, type Donor, type BloodRequest, type Hospital } from '@/data/mockData';
import { Badge, Card, LiveDot, SectionHeader, StatCard } from '@/components/ui';
import { HospitalMap } from '@/components/HospitalMap';

export default function Dashboard() {
  const theme = useTheme();
  const inventory = useInventory();
  const connected = useBackendConnected();
  const units = totalUnits(inventory);
  const { data: donors } = usePoll<Donor[]>('/donors', mockDonors);
  const { data: requests } = usePoll<BloodRequest[]>('/requests', mockRequests);
  const { data: hospitals } = usePoll<Hospital[]>('/hospitals', mockHospitals);

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={[styles.pageTitle, { color: theme.fg }]}>BloodLink</Text>
      <Text style={[styles.pageSub, { color: theme.fgMuted }]}>City-wide blood availability</Text>

      <View style={styles.statGrid}>
        <StatCard theme={theme} label="Units Available" value={units.toLocaleString()} valueColor={theme.accent} delta="↑ 34 since yesterday" />
        <StatCard theme={theme} label="Registered Donors" value="8,412" delta="↑ 12 this week" />
        <StatCard theme={theme} label="Active Requests" value={String(requests.length * 9 + 2)} delta="↑ 8 since yesterday" />
        <StatCard theme={theme} label="Lives Saved (YTD)" value="3,891" valueColor={theme.success} delta="↑ 23 this month" />
      </View>

      <SectionHeader theme={theme} title="Blood Inventory" right={<LiveDot theme={theme} connected={connected} />} />
      <View style={styles.inventoryGrid}>
        {bloodTypes.map((t) => {
          const entry = inventory[t];
          const pct = entry.units / entry.max;
          const color = levelColor(pct, theme);
          const status = levelStatus(pct);
          const barColor = status.key === 'critical' ? theme.danger : status.key === 'low' ? theme.warning : theme.success;
          const badgeBg = status.key === 'critical' ? theme.dangerSoft : status.key === 'low' ? theme.warningSoft : theme.successSoft;
          return (
            <Card key={t} theme={theme} style={styles.bloodCard}>
              <Text style={[styles.bloodType, { color: theme.fg }]}>{t}</Text>
              <Text style={[styles.bloodUnits, { color }]}>{entry.units}</Text>
              <Text style={[styles.bloodUnitsLabel, { color: theme.fgMuted }]}>units</Text>
              <Badge label={status.label} bg={badgeBg} fg={color} />
              <View style={[styles.barBg, { backgroundColor: theme.surface2 }]}>
                <View style={[styles.barFill, { width: `${Math.min(100, Math.round(pct * 100))}%`, backgroundColor: barColor }]} />
              </View>
            </Card>
          );
        })}
      </View>

      <SectionHeader
        theme={theme}
        title="Active Requests"
        right={
          <Text onPress={() => router.push('/find')} style={{ color: theme.accent, fontSize: 12, fontFamily: fonts.bodyBold }}>
            View all →
          </Text>
        }
      />
      <Card theme={theme} style={{ marginBottom: 20 }}>
        {requests.map((r, i) => (
          <View key={r.patient} style={[styles.row, i < requests.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
            <View style={[styles.bloodBadge, { backgroundColor: theme.accentSoft }]}>
              <Text style={[styles.bloodBadgeText, { color: theme.accent }]}>{r.type}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.rowTitle, { color: theme.fg }]}>{r.patient}</Text>
              <Text style={[styles.rowSub, { color: theme.fgMuted }]} numberOfLines={1}>
                {r.hospital} · {r.units} unit{r.units > 1 ? 's' : ''} · {timeAgo(r.createdAt)}
              </Text>
            </View>
            <Badge
              label={r.urgency}
              bg={r.urgency === 'critical' ? theme.dangerSoft : r.urgency === 'high' ? theme.warningSoft : theme.successSoft}
              fg={r.urgency === 'critical' ? theme.danger : r.urgency === 'high' ? theme.warning : theme.success}
            />
          </View>
        ))}
      </Card>

      <SectionHeader theme={theme} title="Available Donors Nearby" />
      <Card theme={theme} style={{ marginBottom: 20 }}>
        {donors.map((d, i) => {
          const initials = d.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2);
          const dotColor = d.available ? theme.success : d.daysSinceDonation > 50 ? theme.warning : theme.fgMuted;
          return (
            <View key={d.name} style={[styles.row, i < donors.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
              <View style={[styles.avatar, { backgroundColor: theme.surface2, borderColor: theme.border }]}>
                <Text style={{ color: theme.fgMuted, fontFamily: fonts.bodyBold, fontSize: 13 }}>{initials}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.rowTitle, { color: theme.fg }]}>{d.name}</Text>
                <Text style={[styles.rowSub, { color: theme.fgMuted }]}>
                  {d.city} · {d.daysSinceDonation === 0 ? 'Donated today' : `Last donated ${d.daysSinceDonation}d ago`}
                </Text>
              </View>
              <Text style={{ color: theme.accent, fontFamily: fonts.mono, fontSize: 13 }}>{d.type}</Text>
              <View style={[styles.dot, { backgroundColor: dotColor }]} />
            </View>
          );
        })}
      </Card>

      <SectionHeader theme={theme} title="Hospital Locator" right={<Text style={{ color: theme.fgMuted, fontSize: 12 }}>Across India</Text>} />
      <HospitalMap theme={theme} hospitals={hospitals} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  pageTitle: { fontFamily: fonts.display, fontSize: 28 },
  pageSub: { fontFamily: fonts.body, fontSize: 13, marginBottom: 16 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  inventoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  bloodCard: { width: '23%', minWidth: 76, alignItems: 'center', padding: 10 },
  bloodType: { fontFamily: fonts.mono, fontSize: 17 },
  bloodUnits: { fontFamily: fonts.monoMedium, fontSize: 20, marginTop: 4 },
  bloodUnitsLabel: { fontFamily: fonts.body, fontSize: 9, marginBottom: 6 },
  barBg: { width: '100%', height: 4, borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 14 },
  bloodBadge: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  bloodBadgeText: { fontFamily: fonts.mono, fontSize: 10 },
  rowTitle: { fontFamily: fonts.bodyBold, fontSize: 13 },
  rowSub: { fontFamily: fonts.body, fontSize: 11, marginTop: 1 },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
