import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import type { Theme } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { HOSPITAL_COORDS, INDIA_CENTER, distanceKm, type Hospital } from '@/data/mockData';
import { PrimaryButton } from './ui';

function buildMapHtml(hospitals: Hospital[], userCoords: [number, number] | null) {
  const markers = hospitals.map((h) => {
    const coords = HOSPITAL_COORDS[h.name] ?? INDIA_CENTER;
    const needs = Object.entries(h.needs)
      .map(([t, lvl]) => `${t} (${lvl})`)
      .join(', ');
    return { coords, name: h.name, address: h.address, phone: h.phone, needs };
  });

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>html,body,#map{height:100%;margin:0;padding:0}
.popup b{font-size:13px}
.popup .addr{font-size:11px;color:#555;margin:3px 0}
</style></head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map').setView([${INDIA_CENTER[0]}, ${INDIA_CENTER[1]}], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors', maxZoom: 18,
  }).addTo(map);
  const markers = ${JSON.stringify(markers)};
  const group = markers.map(m => {
    const mk = L.marker(m.coords).addTo(map);
    mk.bindPopup('<div class="popup"><b>' + m.name + '</b><div class="addr">' + m.address + '<br>' + m.phone + '</div><div>' + m.needs + '</div></div>');
    return mk;
  });
  ${userCoords ? `
  const youIcon = L.divIcon({ className: '', html: '<div style="width:16px;height:16px;border-radius:50%;background:#C01429;border:3px solid #fff;box-shadow:0 0 0 2px #C01429"></div>', iconSize: [16,16] });
  L.marker([${userCoords[0]}, ${userCoords[1]}], { icon: youIcon }).addTo(map);
  ` : ''}
  if (group.length) {
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(L.featureGroup(${userCoords ? 'group.concat([L.marker([' + userCoords[0] + ',' + userCoords[1] + '])])' : 'group'}).getBounds().pad(0.2));
    }, 200);
  }
</script>
</body></html>`;
}

export function HospitalMap({ theme, hospitals }: { theme: Theme; hospitals: Hospital[] }) {
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const webviewRef = useRef<WebView>(null);

  const html = useMemo(() => buildMapHtml(hospitals, userCoords), [hospitals, userCoords]);

  async function locateMe() {
    const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
    if (permStatus !== 'granted') {
      setStatus({ kind: 'error', text: 'Location permission denied. Enable it in Settings to see distances.' });
      return;
    }
    setStatus({ kind: 'ok', text: 'Locating you…' });
    try {
      const pos = await Location.getCurrentPositionAsync({});
      const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      setUserCoords(coords);
      let nearest: { name: string; km: number } | null = null;
      hospitals.forEach((h) => {
        const hc = HOSPITAL_COORDS[h.name] ?? INDIA_CENTER;
        const km = distanceKm(coords, hc);
        if (!nearest || km < nearest.km) nearest = { name: h.name, km };
      });
      setStatus({
        kind: 'ok',
        text: nearest ? `You're located. Nearest hospital: ${(nearest as { name: string; km: number }).name} (${(nearest as { name: string; km: number }).km.toFixed(1)} km away).` : "You're located.",
      });
    } catch {
      setStatus({ kind: 'error', text: 'Could not determine your location.' });
    }
  }

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={{ fontSize: 11, color: theme.fgMuted }}>🏥 Hospital &nbsp; 📍 You</Text>
        <PrimaryButton theme={theme} label="Use my location" variant="outline" onPress={locateMe} />
      </View>
      {status && (
        <View
          style={[
            styles.statusBox,
            {
              backgroundColor: status.kind === 'error' ? theme.dangerSoft : theme.successSoft,
              borderColor: status.kind === 'error' ? theme.danger : theme.success,
            },
          ]}
        >
          <Text style={{ fontSize: 12, color: status.kind === 'error' ? theme.danger : theme.success, fontFamily: fonts.body }}>
            {status.text}
          </Text>
        </View>
      )}
      <View style={[styles.mapWrap, { borderColor: theme.border }]}>
        <WebView ref={webviewRef} source={{ html }} style={styles.map} javaScriptEnabled originWhitelist={['*']} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  statusBox: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  mapWrap: { height: 260, borderRadius: 10, overflow: 'hidden', borderWidth: 1 },
  map: { flex: 1 },
});
