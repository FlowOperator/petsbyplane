import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useQuoteFlow } from '../../src/services/quoteContext';

/**
 * Flight Results Screen — V1 Reassurance Page
 * 
 * NOT a flight picker. Explains that the consultant will find the best route
 * based on the pet's breed, size, and destination requirements.
 * Leads to Quote Pending (waiting screen).
 */
export default function FlightResultsScreen() {
  const { quoteState } = useQuoteFlow();
  const search = quoteState.searchParams;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Back */}
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={16} color={colors.primary} />
          <Text style={styles.backText}>Edit details</Text>
        </TouchableOpacity>

        {/* Route summary */}
        <View style={styles.routeSummary}>
          <Text style={styles.routeCode}>{search?.originAirport || 'LHR'}</Text>
          <View style={styles.routeLine}>
            <Ionicons name="airplane" size={16} color={colors.primary} />
          </View>
          <Text style={styles.routeCode}>{search?.destinationAirport || 'LAX'}</Text>
        </View>
        <Text style={styles.routeSubtitle}>
          {search?.originCity || 'London'} → {search?.destinationCity || 'Los Angeles'} · 1 pet
        </Text>

        {/* Main reassurance card */}
        <Card style={styles.mainCard}>
          <View style={styles.cardIcon}>
            <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Your consultant finds the best route</Text>
          <Text style={styles.cardBody}>
            Every pet's journey is different. Your dedicated consultant considers:
          </Text>
          <View style={styles.factorsList}>
            <FactorRow icon="paw-outline" text={`${search?.breed || 'Your pet'}'s breed restrictions & airline policies`} />
            <FactorRow icon="thermometer-outline" text="Temperature embargoes & hold conditions" />
            <FactorRow icon="time-outline" text="Transit duration & layover regulations" />
            <FactorRow icon="cash-outline" text="Best value route for your destination" />
          </View>
        </Card>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <Button
            title="Submit my request"
            onPress={() => router.push('/quote/pending')}
            variant="primary"
          />
          <Text style={styles.ctaNote}>
            No commitment yet — you'll review pricing before paying anything
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FactorRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.factorRow}>
      <Ionicons name={icon} size={16} color={colors.textSecondary} />
      <Text style={styles.factorText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  backRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingTop: 16, paddingBottom: 12,
  },
  backText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.primary },

  // Route summary
  routeSummary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 12, marginTop: 8, marginBottom: 4,
  },
  routeCode: { fontFamily: 'Baloo2_700Bold', fontSize: 28, color: colors.textPrimary },
  routeLine: {
    flex: 1, maxWidth: 80, height: 2,
    backgroundColor: 'rgba(232, 98, 61, 0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  routeSubtitle: {
    ...typography.caption, color: colors.textSecondary,
    textAlign: 'center', marginBottom: 24,
  },

  // Main card
  mainCard: { padding: 24, alignItems: 'center' },
  cardIcon: { marginBottom: 14 },
  cardTitle: {
    fontFamily: 'Baloo2_700Bold', fontSize: 18,
    color: colors.textPrimary, textAlign: 'center', marginBottom: 8,
  },
  cardBody: {
    ...typography.body, color: colors.textSecondary,
    textAlign: 'center', marginBottom: 18,
  },
  factorsList: { width: '100%', gap: 10 },
  factorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  factorText: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },

  // CTA
  ctaArea: { marginTop: 'auto', paddingBottom: 24, gap: 10 },
  ctaNote: {
    ...typography.caption, color: colors.textMuted, textAlign: 'center',
  },
});
