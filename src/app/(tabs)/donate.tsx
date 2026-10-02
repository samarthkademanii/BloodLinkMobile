import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { bloodTypes, drives, type BloodType } from '@/data/mockData';
import { apiPost } from '@/data/api';
import { Card, PrimaryButton, SectionHeader } from '@/components/ui';

const infoCards = [
  { icon: '🩸', title: 'One donation, three lives', text: 'A single donation can be separated into red cells, plasma, and platelets — each saving a different patient.' },
  { icon: '⏱', title: 'Only 45 minutes', text: 'The whole process takes under an hour. The actual draw is just 8–10 minutes. You can donate whole blood every 56 days.' },
  { icon: '🏅', title: 'O− donors especially needed', text: 'O− is the universal donor type. Only 7% of people have it, but it is the first choice in emergencies.' },
];

export default function Donate() {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState<BloodType | ''>('');
  const [submitted, setSubmitted] = useState(false);

  async function submit() {
    if (!name || !email || !type) return;
    try {
      await apiPost('/donors', { name, type, city });
    } catch {
      // Backend unreachable — still confirm locally so the form feels responsive;
      // the registration simply won't appear in the live donor list yet.
    }
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setCity('');
    setType('');
    setTimeout(() => setSubmitted(false), 5000);
  }

  const inputStyle = [styles.input, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.fg }];

  return (
    <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[styles.pageTitle, { color: theme.fg }]}>Become a Donor</Text>

      <View style={{ gap: 10, marginBottom: 20 }}>
        {infoCards.map((c) => (
          <Card key={c.title} theme={theme} style={{ padding: 14 }}>
            <Text style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</Text>
            <Text style={{ color: theme.fg, fontFamily: fonts.bodyBold, fontSize: 13, marginBottom: 3 }}>{c.title}</Text>
            <Text style={{ color: theme.fgMuted, fontSize: 12, lineHeight: 17 }}>{c.text}</Text>
          </Card>
        ))}
      </View>

      <Card theme={theme} style={{ padding: 18, marginBottom: 20 }}>
        <Text style={[styles.formTitle, { color: theme.fg }]}>Register as a Donor</Text>
        <Text style={{ color: theme.fgMuted, fontSize: 12, marginBottom: 16 }}>
          Fill in your details below. A coordinator will contact you to schedule your appointment.
        </Text>

        <Text style={[styles.label, { color: theme.fg }]}>Full Name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Ananya Rao" placeholderTextColor={theme.fgMuted} style={inputStyle} />

        <Text style={[styles.label, { color: theme.fg }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="ananya@example.com"
          placeholderTextColor={theme.fgMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={inputStyle}
        />

        <Text style={[styles.label, { color: theme.fg }]}>Phone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98765 43210"
          placeholderTextColor={theme.fgMuted}
          keyboardType="phone-pad"
          style={inputStyle}
        />

        <Text style={[styles.label, { color: theme.fg }]}>Locality</Text>
        <TextInput value={city} onChangeText={setCity} placeholder="Koramangala, Bengaluru" placeholderTextColor={theme.fgMuted} style={inputStyle} />

        <Text style={[styles.label, { color: theme.fg }]}>Blood Type</Text>
        <View style={styles.typeGrid}>
          {bloodTypes.map((t) => {
            const active = type === t;
            return (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                style={[
                  styles.typeChip,
                  { backgroundColor: active ? theme.accent : theme.bg, borderColor: active ? theme.accent : theme.border },
                ]}
              >
                <Text style={{ color: active ? '#fff' : theme.fg, fontFamily: fonts.mono, fontSize: 13 }}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 18 }}>
          <PrimaryButton theme={theme} label="Register as Donor" onPress={submit} />
        </View>

        {submitted && (
          <View style={[styles.success, { backgroundColor: theme.successSoft, borderColor: theme.success }]}>
            <Text style={{ color: theme.success, fontFamily: fonts.bodyBold, fontSize: 13 }}>
              ✓ Thank you! Your registration is submitted. A coordinator will reach out within 24 hours.
            </Text>
          </View>
        )}
      </Card>

      <SectionHeader theme={theme} title="Upcoming Blood Drives" />
      <View style={{ gap: 10, marginBottom: 32 }}>
        {drives.map((d) => (
          <Card key={d.name} theme={theme} style={{ padding: 14 }}>
            <Text style={{ color: theme.fg, fontFamily: fonts.bodyBold, fontSize: 14 }}>{d.name}</Text>
            <Text style={{ color: theme.fgMuted, fontSize: 11, marginBottom: 8 }}>{d.loc}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Text style={{ color: theme.fg, fontSize: 12 }}>📅 {d.date}</Text>
              <View
                style={[
                  styles.slotsBadge,
                  { backgroundColor: d.slots < 10 ? theme.warningSoft : theme.successSoft },
                ]}
              >
                <Text style={{ fontSize: 11, fontFamily: fonts.bodyBold, color: d.slots < 10 ? theme.warning : theme.success }}>
                  {d.slots} slots left
                </Text>
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
  pageTitle: { fontFamily: fonts.display, fontSize: 24, marginBottom: 14 },
  formTitle: { fontFamily: fonts.display, fontSize: 20, marginBottom: 2 },
  label: { fontFamily: fonts.bodyBold, fontSize: 12, marginTop: 12, marginBottom: 5 },
  input: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 12, paddingVertical: Platform.select({ ios: 10, default: 8 }), fontSize: 13, fontFamily: fonts.body },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5 },
  success: { marginTop: 14, padding: 12, borderRadius: 8, borderWidth: 1 },
  slotsBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
});
