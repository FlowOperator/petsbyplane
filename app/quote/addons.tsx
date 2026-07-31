import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';

/**
 * Add-ons Screen — Step 3 of 4
 * Shows selected flight summary + optional services.
 */

interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const ADD_ONS: AddOnItem[] = [
  { id: 'customs', name: 'Customs clearance', description: 'Partner agent clears customs at destination', price: '£426', icon: 'document-text-outline' },
  { id: 'collection', name: 'Door collection', description: 'Pickup from your home to the airport', price: 'By distance', icon: 'car-outline' },
  { id: 'delivery', name: 'Door delivery', description: 'Destination airport to your door', price: 'By distance', icon: 'home-outline' },
  { id: 'boarding', name: 'Pet boarding / kennelling', description: 'Pre-flight accommodation, per night', price: 'Per night', icon: 'bed-outline' },
  { id: 'crate', name: 'IATA travel crate', description: 'Airline-approved crate, per pet', price: '£184', icon: 'cube-outline' },
  { id: 'vetcover', name: 'In-transit vet cover', description: '24/7 veterinary support', price: '£75', icon: 'heart-outline' },
  { id: 'cancellation', name: 'Cancellation waiver', description: 'Change or cancel free up to 7 days', price: '£145', icon: 'shield-outline' },
];

const NOT_INCLUDED = [
  'Customs clearance', 'Door collection', 'Door delivery',
  'Pet boarding / kennelling', 'IATA travel crate',
  'In-transit vet cover', 'Cancellation waiver',
];

export default function AddOnsScreen() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleAddon = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={styles.progressDot} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Flight summary card */}
        <Card style={styles.summaryCard}>
          <View style={styles.airlineRow}>
            <View style={styles.airlineLogo}>
              <Ionicons name="airplane" size={16} color={colors.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.airlineName}>Ethiopian Airlines</Text>
              <Text style={styles.flightMeta}>Wed, 15 Jul 2026 · Akita</Text>
            </View>
            <View style={styles.viaBadge}>
              <Text style={styles.viaText}>via ADD</Text>
            </View>
          </View>

          {/* Route visual */}
          <View style={styles.routeVisual}>
            <View style={styles.routeEndpoint}>
              <Text style={styles.routeCode}>LHR</Text>
              <Text style={styles.routeCity}>London</Text>
            </View>
            <View style={styles.routeLineContainer}>
              <View style={styles.routeDashLine} />
              <Ionicons name="arrow-forward" size={14} color={colors.textMuted} style={styles.routeArrow} />
              <Text style={styles.routeViaLabel}>via ADD</Text>
            </View>
            <View style={styles.routeEndpoint}>
              <Text style={styles.routeCode}>CPT</Text>
              <Text style={styles.routeCity}>Cape Town</Text>
            </View>
          </View>

          {/* Included / Not included */}
          <View style={styles.inclusionRow}>
            <View style={styles.inclusionCol}>
              <Text style={styles.includedTitle}>INCLUDED</Text>
              <Text style={styles.includedItem}>✓ Pet flight</Text>
            </View>
            <View style={[styles.inclusionCol, { flex: 2 }]}>
              <Text style={styles.notIncludedTitle}>NOT INCLUDED</Text>
              {NOT_INCLUDED.map((item, i) => (
                <Text key={i} style={styles.notIncludedItem}>× {item}</Text>
              ))}
            </View>
          </View>

          {/* Totals */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total £1,453</Text>
            <Text style={styles.depositAmount}>Deposit £291</Text>
          </View>
        </Card>

        {/* Add-ons section */}
        <Text style={styles.addOnsTitle}>ADD SERVICES (OPTIONAL)</Text>

        {ADD_ONS.map((addon) => {
          const isSelected = selected.has(addon.id);
          return (
            <View key={addon.id} style={styles.addonRow}>
              <View style={styles.addonIconCircle}>
                <Ionicons name={addon.icon} size={18} color={colors.textSecondary} />
              </View>
              <View style={styles.addonInfo}>
                <Text style={styles.addonName}>{addon.name}</Text>
                <Text style={styles.addonDesc}>{addon.description}</Text>
              </View>
              <View style={styles.addonRight}>
                <Text style={styles.addonPrice}>{addon.price}</Text>
                <TouchableOpacity
                  style={[styles.addBtn, isSelected && styles.addBtnActive]}
                  onPress={() => toggleAddon(addon.id)}
                  accessibilityRole="button"
                  accessibilityLabel={isSelected ? `Remove ${addon.name}` : `Add ${addon.name}`}
                >
                  <Text style={[styles.addBtnText, isSelected && styles.addBtnTextActive]}>
                    {isSelected ? '✓ Added' : '+ Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.push('/quote/checkout')}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.continueBtnText}>Continue to book →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  progressRow: {
    flexDirection: 'row', gap: 6,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 16, marginBottom: 16,
  },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E4DFD4' },
  progressActive: { backgroundColor: colors.primary },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 100,
  },

  // Summary card
  summaryCard: { marginBottom: 24, padding: 20, borderRadius: radius.xxl },
  airlineRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  airlineLogo: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  airlineName: {
    ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary,
  },
  flightMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  viaBadge: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  viaText: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.secondaryDark,
  },

  // Route visual
  routeVisual: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 20, marginBottom: 16,
  },
  routeEndpoint: { alignItems: 'center' },
  routeCode: { fontFamily: 'Baloo2_700Bold', fontSize: 22, color: colors.textPrimary },
  routeCity: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  routeLineContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 8,
  },
  routeDashLine: {
    position: 'absolute', left: 0, right: 0, top: '50%',
    height: 1.5, borderTopWidth: 1.5,
    borderStyle: 'dashed', borderColor: colors.textMuted,
  },
  routeArrow: { zIndex: 1, backgroundColor: colors.white, paddingHorizontal: 4 },
  routeViaLabel: {
    ...typography.tiny, color: colors.textMuted, marginTop: 4,
  },

  // Inclusion
  inclusionRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  inclusionCol: { flex: 1 },
  includedTitle: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.success, marginBottom: 6, letterSpacing: 0.3,
  },
  includedItem: { ...typography.caption, color: colors.textPrimary },
  notIncludedTitle: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.primary, marginBottom: 6, letterSpacing: 0.3,
  },
  notIncludedItem: {
    ...typography.caption, color: colors.textSecondary, marginBottom: 2,
  },

  // Totals
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.divider,
  },
  totalLabel: { ...typography.body, color: colors.textSecondary },
  depositAmount: {
    fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.primary,
  },

  // Add-ons
  addOnsTitle: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary, letterSpacing: 0.5, marginBottom: 14,
  },
  addonRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  addonIconCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  addonInfo: { flex: 1, minWidth: 0 },
  addonName: {
    ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary,
  },
  addonDesc: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  addonRight: { alignItems: 'flex-end', gap: 6 },
  addonPrice: {
    ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary,
  },
  addBtn: {
    borderWidth: 1.5, borderColor: colors.borderStrong,
    borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 14,
  },
  addBtnActive: { backgroundColor: colors.success, borderColor: colors.success },
  addBtnText: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.textPrimary,
  },
  addBtnTextActive: { color: colors.white },

  // Bottom
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: 16, paddingBottom: 28,
    backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  continueBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.button,
  },
  continueBtnText: {
    ...typography.button, color: colors.textPrimary,
  },
});
