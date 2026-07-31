import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';
import { Card } from '../src/components/ui';

/**
 * Country Rules Screen — browse destination import requirements.
 * Reachable from the quote form without needing a booking.
 */

interface CountryRules {
  code: string;
  name: string;
  summary: string;
  microchip: string;
  vaccine: string;
  quarantine: string;
  crate: string;
}

const COUNTRIES: CountryRules[] = [
  {
    code: 'US',
    name: 'United States',
    summary: 'CDC import permit required for dogs. Generally straightforward for vaccinated pets.',
    microchip: 'ISO 15-digit microchip required before vaccination',
    vaccine: 'Rabies vaccination required. CDC dog import permit (online, ~5 min approval)',
    quarantine: 'No quarantine for compliant pets',
    crate: 'IATA-compliant crate mandatory. No tracking devices inside.',
  },
  {
    code: 'AU',
    name: 'Australia',
    summary: 'Strict biosecurity. Titre test 6 months before travel. Quarantine on arrival.',
    microchip: 'ISO 15-digit microchip required',
    vaccine: 'Rabies titre test (RNATT) required 6 months before travel. Multiple blood tests.',
    quarantine: 'Minimum 10 days government quarantine facility on arrival',
    crate: 'IATA-compliant crate. Strict fumigation requirements.',
  },
  {
    code: 'AE',
    name: 'UAE (Dubai)',
    summary: 'Import permit required. No quarantine for compliant pets. Temperature embargoes in summer.',
    microchip: 'ISO 15-digit microchip required',
    vaccine: 'Rabies vaccination + titre test. Health certificate within 10 days of departure.',
    quarantine: 'No quarantine if all documents in order',
    crate: 'IATA-compliant crate. Summer temperature embargo May–September via some carriers.',
  },
  {
    code: 'ZA',
    name: 'South Africa',
    summary: '7 blood tests for dogs. Import permit via local partner (~45 days). Dogs must be neutered.',
    microchip: 'ISO 15-digit microchip required',
    vaccine: 'Rabies vaccination 30+ days before departure. DHPP & Lepto recommended.',
    quarantine: 'No quarantine but 7 mandatory blood tests within 30 days of departure',
    crate: 'IATA-compliant crate. DEFRA Export Health Certificate within 10 days.',
  },
  {
    code: 'EU',
    name: 'Europe (EU)',
    summary: 'Animal Health Certificate required. Tapeworm treatment for dogs entering some countries.',
    microchip: 'ISO 15-digit microchip required',
    vaccine: 'Rabies vaccination. Animal Health Certificate (AHC) within 10 days.',
    quarantine: 'No quarantine for EU PETS scheme compliant pets',
    crate: 'IATA-compliant crate. Tapeworm (Echinococcus) treatment 1–5 days before entry for some countries.',
  },
];

export default function CountryRulesScreen() {
  const [selected, setSelected] = useState(0);
  const country = COUNTRIES[selected];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Country requirements</Text>
      </View>

      {/* Country chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {COUNTRIES.map((c, i) => (
          <TouchableOpacity
            key={c.code}
            style={[styles.chip, i === selected && styles.chipActive]}
            onPress={() => setSelected(i)}
            accessibilityRole="radio"
            accessibilityState={{ selected: i === selected }}
          >
            <Text style={[styles.chipText, i === selected && styles.chipTextActive]}>
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <Text style={styles.countryName}>{country.name}</Text>
        <Text style={styles.countrySummary}>{country.summary}</Text>

        {/* Rule cards */}
        <View style={styles.ruleList}>
          <RuleCard icon="hardware-chip-outline" title="Microchip" description={country.microchip} />
          <RuleCard icon="medkit-outline" title="Vaccination & titre test" description={country.vaccine} />
          <RuleCard icon="home-outline" title="Quarantine" description={country.quarantine} />
          <RuleCard icon="cube-outline" title="Crate & documentation" description={country.crate} />
        </View>

        {/* Footer note */}
        <Text style={styles.footerNote}>
          Rules may change — your consultant will confirm the exact requirements for your specific trip.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function RuleCard({ icon, title, description }: {
  icon: keyof typeof Ionicons.glyphMap; title: string; description: string;
}) {
  return (
    <View style={styles.ruleCard}>
      <View style={styles.ruleIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.ruleContent}>
        <Text style={styles.ruleTitle}>{title}</Text>
        <Text style={styles.ruleDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 20, paddingBottom: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  title: { ...typography.h3, color: colors.textPrimary },

  chipRow: { paddingHorizontal: layout.screenPaddingHorizontal, gap: 8, paddingBottom: 12 },
  chip: {
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: 9, paddingHorizontal: 16,
    borderWidth: 1.5, borderColor: colors.borderMedium,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  chipTextActive: { color: colors.white },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40 },
  countryName: { ...typography.h4, color: colors.textPrimary, marginTop: 8 },
  countrySummary: { ...typography.body, color: colors.textSecondary, marginTop: 4, marginBottom: 18, lineHeight: 21 },

  ruleList: { gap: 10 },
  ruleCard: {
    flexDirection: 'row', gap: 14, backgroundColor: colors.white,
    borderRadius: radius.xl, padding: 16, ...shadows.cardLight,
  },
  ruleIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  ruleContent: { flex: 1 },
  ruleTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  ruleDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 3, lineHeight: 18 },

  footerNote: {
    ...typography.caption, color: colors.textMuted,
    textAlign: 'center', marginTop: 24, lineHeight: 18,
    paddingHorizontal: 20,
  },
});
