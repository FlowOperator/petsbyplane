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

/**
 * Quote & Booking Screen — Consultant's prepared quote.
 * Shows ONE recommended route (non-selectable) + toggleable add-on services.
 * Terms must be accepted before proceeding to checkout.
 */

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: keyof typeof Ionicons.glyphMap;
}

const ROUTE = {
  airline: 'KLM',
  route: 'LHR → CPT via AMS',
  price: 1240,
  note: 'Chosen by your consultant — best fit for breed and temperature restrictions on this route',
};

const ADD_ONS: AddOn[] = [
  { id: 'crate', name: 'Travel crate', description: 'IATA-compliant crate sized for your pet', price: 145, icon: 'cube-outline' },
  { id: 'ehc', name: 'EHC completion & delivery', description: 'Boarding, EHC completion, delivery to check-in', price: 220, icon: 'document-text-outline' },
  { id: 'booking', name: 'Booking fee', description: 'Dedicated consultant, compliance advisory, meet & greet', price: 180, icon: 'person-outline' },
  { id: 'collection', name: 'Collection from home', description: 'We collect your pet from your address', price: 95, icon: 'home-outline' },
  { id: 'blood', name: 'Pre-export blood tests', description: 'Titre test & other required bloodwork', price: 110, icon: 'water-outline' },
  { id: 'arrival', name: 'Destination arrival services', description: 'Import permit, customs, vet inspection', price: 260, icon: 'shield-checkmark-outline' },
];

export default function QuoteBookingScreen() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    crate: true,
    booking: true,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const toggleAddon = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const addOnTotal = ADD_ONS.reduce(
    (sum, a) => sum + (selected[a.id] ? a.price : 0),
    0
  );
  const total = ROUTE.price + addOnTotal;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.editLink}>← Edit trip details</Text>
          </TouchableOpacity>
          <Text style={styles.quoteNumber}>Quote #PBP-48213</Text>
          <Text style={styles.validity}>
            Issued 28 Jul 2026 · Valid until{' '}
            <Text style={{ color: colors.primary, fontFamily: 'Nunito_700Bold' }}>11 Aug 2026</Text>
          </Text>
        </View>
        <View style={styles.consultantBadge}>
          <Ionicons name="person" size={18} color={colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Recommended route */}
        <Text style={styles.sectionTitle}>Your recommended route</Text>
        <View style={styles.routeCard}>
          <View style={styles.airlineChip}>
            <Text style={styles.airlineChipText}>{ROUTE.airline}</Text>
          </View>
          <View style={styles.routeInfo}>
            <Text style={styles.routeText}>{ROUTE.route}</Text>
            <Text style={styles.routeNote}>{ROUTE.note}</Text>
          </View>
          <Text style={styles.routePrice}>£{ROUTE.price.toLocaleString()}</Text>
        </View>

        {/* Add-ons */}
        <Text style={styles.sectionTitle}>Add-on services</Text>
        {ADD_ONS.map((addon) => {
          const isOn = !!selected[addon.id];
          return (
            <TouchableOpacity
              key={addon.id}
              style={[styles.addonCard, isOn && styles.addonCardActive]}
              onPress={() => toggleAddon(addon.id)}
              activeOpacity={0.85}
            >
              <View style={styles.addonIcon}>
                <Ionicons name={addon.icon} size={17} color={colors.textPrimary} />
              </View>
              <View style={styles.addonInfo}>
                <Text style={styles.addonName}>{addon.name}</Text>
                <Text style={styles.addonDesc}>{addon.description}</Text>
              </View>
              <View style={styles.addonRight}>
                <Text style={styles.addonPrice}>£{addon.price}</Text>
                <View style={[styles.addonPill, isOn && styles.addonPillActive]}>
                  <Text style={[styles.addonPillText, isOn && styles.addonPillTextActive]}>
                    {isOn ? '✓ Added' : 'Not selected'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text style={styles.footerCount}>Options selected: {selectedCount} of 6</Text>
          <Text style={styles.footerTotal}>£{total.toLocaleString()}</Text>
        </View>
        <Text style={styles.footerNote}>Provisional — confirmed once your flight is booked</Text>

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
            {termsAccepted && <Ionicons name="checkmark" size={12} color={colors.white} />}
          </View>
          <Text style={styles.termsText}>
            I've read and accept the{' '}
            <Text style={{ color: colors.primary, fontFamily: 'Nunito_700Bold' }}>
              Terms & Conditions
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.ctaBtn, !termsAccepted && styles.ctaBtnDisabled]}
          onPress={() => router.push('/quote/checkout')}
          disabled={!termsAccepted}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaBtnText, !termsAccepted && styles.ctaBtnTextDisabled]}>
            Continue to checkout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 24,
    paddingBottom: 12,
  },
  editLink: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  quoteNumber: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 19,
    color: colors.textPrimary,
  },
  validity: { ...typography.caption, color: colors.textSecondary, marginTop: 3 },
  consultantBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    ...shadows.iconButton,
  },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 20 },

  sectionTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 10,
    marginBottom: 10,
  },

  // Route card
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 98, 61, 0.3)',
    borderRadius: radius.xl,
    padding: 14,
    paddingRight: 16,
    marginBottom: 18,
  },
  airlineChip: {
    width: 38,
    height: 26,
    backgroundColor: colors.background,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  airlineChipText: { fontSize: 9, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  routeInfo: { flex: 1, minWidth: 0 },
  routeText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  routeNote: { ...typography.caption, color: colors.textSecondary, marginTop: 3, lineHeight: 16 },
  routePrice: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },

  // Add-on cards
  addonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(46, 40, 34, 0.1)',
    borderRadius: radius.xl,
    padding: 14,
    paddingRight: 16,
    marginBottom: 10,
  },
  addonCardActive: {
    borderColor: 'rgba(76, 139, 107, 0.4)',
  },
  addonIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(46, 40, 34, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addonInfo: { flex: 1, minWidth: 0 },
  addonName: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  addonDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  addonRight: { alignItems: 'flex-end', gap: 5 },
  addonPrice: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  addonPill: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(46, 40, 34, 0.15)',
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  addonPillActive: {
    backgroundColor: colors.successLight,
    borderColor: 'rgba(76, 139, 107, 0.3)',
  },
  addonPillText: { fontSize: 10, fontFamily: 'Nunito_700Bold', color: colors.textMuted },
  addonPillTextActive: { color: colors.success },

  // Footer
  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 16,
    paddingBottom: 14,
    ...shadows.tabBar,
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  footerCount: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  footerTotal: { fontFamily: 'Baloo2_700Bold', fontSize: 19, color: colors.textPrimary },
  footerNote: { ...typography.tiny, color: colors.textMuted, textAlign: 'right', marginBottom: 12 },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginBottom: 14 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(46, 40, 34, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: { ...typography.caption, color: colors.textSecondary, flex: 1, lineHeight: 18 },

  ctaBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    ...shadows.button,
  },
  ctaBtnDisabled: { opacity: 0.45 },
  ctaBtnText: { ...typography.button, color: colors.textPrimary },
  ctaBtnTextDisabled: { opacity: 0.7 },
});
