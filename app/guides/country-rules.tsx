import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';

type Mode = 'export' | 'import';

const COUNTRIES = [
  { code: 'US', name: 'USA', summary: 'CDC-compliant import requirements, no quarantine for vaccinated dogs' },
  { code: 'AU', name: 'Australia', summary: '10-day government quarantine on arrival, strict BICON requirements' },
  { code: 'AE', name: 'UAE', summary: 'Microchip, vaccination, and health certificate within 10 days' },
  { code: 'ZA', name: 'South Africa', summary: '7 blood tests required, import permit via DAFF (45-day wait)' },
];

const REQUIREMENTS = {
  US: [
    { icon: 'hardware-chip-outline', title: 'Microchip', desc: 'ISO 15-digit microchip required before any vaccinations' },
    { icon: 'medkit-outline', title: 'Vaccination & titre test', desc: 'Rabies vaccination 30+ days before travel. CDC dog import form required.' },
    { icon: 'time-outline', title: 'Quarantine', desc: 'No quarantine if documentation is complete and valid' },
    { icon: 'document-text-outline', title: 'Crate & documentation', desc: 'IATA-compliant crate, USDA-endorsed health certificate within 10 days' },
  ],
  AU: [
    { icon: 'hardware-chip-outline', title: 'Microchip', desc: 'ISO 15-digit microchip, implanted before rabies vaccination' },
    { icon: 'medkit-outline', title: 'Vaccination & titre test', desc: 'Rabies vaccine + titre test with 0.5 IU/ml result. 180-day wait from titre test.' },
    { icon: 'time-outline', title: 'Quarantine', desc: '10 days minimum in government quarantine facility on arrival' },
    { icon: 'document-text-outline', title: 'Crate & documentation', desc: 'AQIS import permit, IATA crate with absorbent bedding, no food/water bowls attached' },
  ],
  AE: [
    { icon: 'hardware-chip-outline', title: 'Microchip', desc: 'ISO 15-digit microchip required' },
    { icon: 'medkit-outline', title: 'Vaccination & titre test', desc: 'Rabies vaccination 21+ days before travel, titre test optional but recommended' },
    { icon: 'time-outline', title: 'Quarantine', desc: 'No quarantine for approved countries' },
    { icon: 'document-text-outline', title: 'Crate & documentation', desc: 'Health certificate within 10 days, import permit from municipality' },
  ],
  ZA: [
    { icon: 'hardware-chip-outline', title: 'Microchip', desc: 'ISO 15-digit, implanted before all vaccinations' },
    { icon: 'medkit-outline', title: 'Vaccination & titre test', desc: 'Rabies + 7 blood tests including Babesia Gibsoni IFAT within 30 days of departure' },
    { icon: 'time-outline', title: 'Quarantine', desc: 'No quarantine if all blood tests and permits are clear' },
    { icon: 'document-text-outline', title: 'Crate & documentation', desc: 'DAFF import permit (45-day turnaround), DEFRA EHC within 10 days' },
  ],
};

export default function CountryRulesScreen() {
  const [mode, setMode] = useState<Mode>('export');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const { state } = useAppState();
  const { hasBooking } = state;

  const country = COUNTRIES.find((c) => c.code === selectedCountry)!;
  const reqs = REQUIREMENTS[selectedCountry as keyof typeof REQUIREMENTS] || REQUIREMENTS.US;

  if (mode === 'import') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.title}>Country rules</Text>
          </View>
          <ModeToggle mode={mode} onModeChange={setMode} />
          <Card style={styles.importCard}>
            <Ionicons name="airplane" size={24} color={colors.primary} style={{ marginBottom: 12, transform: [{ rotate: '180deg' }] }} />
            <Text style={styles.importTitle}>Importing to the UK?</Text>
            <Text style={styles.importBody}>
              UK imports go through the Animal Reception Centre (ARC). The process is based on your arrival airport and the origin country's disease status — not a per-country rule sheet.
            </Text>
            <Button title="See UK import process" onPress={() => router.push('/guides/import-process')} variant="primary" style={{ marginTop: 16 }} />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Country rules</Text>
        </View>

        <ModeToggle mode={mode} onModeChange={setMode} />

        {/* Country chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {COUNTRIES.map((c) => (
            <TouchableOpacity
              key={c.code}
              style={[styles.chip, selectedCountry === c.code && styles.chipActive]}
              onPress={() => setSelectedCountry(c.code)}
            >
              <Text style={[styles.chipText, selectedCountry === c.code && styles.chipTextActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Country summary */}
        <Text style={styles.countryName}>{country.name}</Text>
        <Text style={styles.countrySummary}>{country.summary}</Text>

        {/* Requirements */}
        {reqs.map((req, i) => (
          <View key={i} style={styles.reqRow}>
            <View style={styles.reqIcon}>
              <Ionicons name={req.icon as any} size={18} color={colors.textSecondary} />
            </View>
            <View style={styles.reqContent}>
              <Text style={styles.reqTitle}>{req.title}</Text>
              <Text style={styles.reqDesc}>{req.desc}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.footerNote}>
          Rules may change — your consultant will confirm the specifics for your exact route and travel date.
        </Text>

        {!hasBooking && (
          <Button title="Ready? Get a quote" onPress={() => router.push('/quote')} variant="primary" style={{ marginTop: 20 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ModeToggle({ mode, onModeChange }: { mode: Mode; onModeChange: (m: Mode) => void }) {
  return (
    <View style={styles.toggleBar}>
      <TouchableOpacity style={[styles.toggleBtn, mode === 'export' && styles.toggleBtnActive]} onPress={() => onModeChange('export')}>
        <Text style={[styles.toggleText, mode === 'export' && styles.toggleTextActive]}>Export (from UK)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.toggleBtn, mode === 'import' && styles.toggleBtnActive]} onPress={() => onModeChange('import')}>
        <Text style={[styles.toggleText, mode === 'import' && styles.toggleTextActive]}>Import (to UK)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.iconButton },
  title: { ...typography.h2, color: colors.textPrimary },

  toggleBar: { flexDirection: 'row', backgroundColor: '#E9E4D8', borderRadius: radius.pill, padding: 4, gap: 4, marginBottom: 16 },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: radius.pill, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: colors.primary },
  toggleText: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  toggleTextActive: { color: colors.white },

  chipRow: { gap: 8, marginBottom: 16 },
  chip: { backgroundColor: colors.white, borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1.5, borderColor: colors.borderMedium },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  chipTextActive: { color: colors.white },

  countryName: { fontFamily: 'Baloo2_700Bold', fontSize: 17, color: colors.textPrimary, marginBottom: 4 },
  countrySummary: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20, marginBottom: 16 },

  reqRow: { flexDirection: 'row', gap: 12, backgroundColor: colors.white, borderRadius: radius.xl, padding: 14, marginBottom: 10, ...shadows.cardLight },
  reqIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  reqContent: { flex: 1 },
  reqTitle: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  reqDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 3, lineHeight: 17 },

  footerNote: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: 16, lineHeight: 18 },

  importCard: { padding: 24, alignItems: 'center' },
  importTitle: { fontFamily: 'Baloo2_700Bold', fontSize: 16, color: colors.textPrimary, marginBottom: 8 },
  importBody: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
