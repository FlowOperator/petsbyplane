import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card } from '../../src/components/ui';

/**
 * Booking Confirmation Screen — success state after payment.
 * Shows boarding-pass-style card + "what to do next" steps.
 */
export default function BookingConfirmationScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Success badge */}
        <View style={styles.successArea}>
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={36} color={colors.white} />
          </View>
          <Text style={styles.successTitle}>Booking confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your deposit is paid and your consultant will be in touch within 24 hours.
          </Text>
        </View>

        {/* Boarding pass card */}
        <View style={styles.boardingPass}>
          <Text style={styles.refLabel}>BOOKING REF</Text>
          <Text style={styles.refCode}>PBP-2026-0847</Text>

          <View style={styles.routeStrip}>
            <View style={styles.routeEnd}>
              <Text style={styles.routeCode}>LHR</Text>
              <Text style={styles.routeCity}>London</Text>
            </View>
            <View style={styles.routeMiddle}>
              <View style={styles.routeDash} />
              <Ionicons name="paper-plane" size={16} color={colors.primary} />
              <View style={styles.routeDash} />
            </View>
            <View style={styles.routeEnd}>
              <Text style={styles.routeCode}>CPT</Text>
              <Text style={styles.routeCity}>Cape Town</Text>
            </View>
          </View>

          {/* Tear line */}
          <View style={styles.tearLine}>
            <View style={styles.tearCircleLeft} />
            <View style={styles.tearDashes} />
            <View style={styles.tearCircleRight} />
          </View>

          <View style={styles.boardingDetails}>
            <View style={styles.boardingRow}>
              <Text style={styles.boardingLabel}>Pet</Text>
              <Text style={styles.boardingValue}>Darcy</Text>
            </View>
            <View style={styles.boardingRow}>
              <Text style={styles.boardingLabel}>Airline</Text>
              <Text style={styles.boardingValue}>Ethiopian Airlines</Text>
            </View>
            <View style={styles.boardingRow}>
              <Text style={styles.boardingLabel}>Travel date</Text>
              <Text style={styles.boardingValue}>10 Aug 2026</Text>
            </View>
          </View>
        </View>

        {/* What to do next */}
        <Text style={styles.nextTitle}>What to do next</Text>
        <View style={styles.nextSteps}>
          <NextStep number="1" text="Upload Darcy's rabies vaccination record" />
          <NextStep number="2" text="Book the required blood tests (7 for SA)" />
          <NextStep number="3" text="Confirm crate delivery address" />
          <NextStep number="4" text="Meet your consultant, Sarah Whitfield" />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Go to my journey</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function NextStep({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepCircle}>
        <Text style={styles.stepNumber}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 40, paddingBottom: 100 },

  // Success
  successArea: { alignItems: 'center', marginBottom: 28 },
  checkBadge: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, ...shadows.primaryButton,
  },
  successTitle: { fontFamily: 'Baloo2_700Bold', fontSize: 24, color: colors.textPrimary },
  successSubtitle: {
    ...typography.body, color: colors.textSecondary,
    textAlign: 'center', marginTop: 6, lineHeight: 21,
  },

  // Boarding pass
  boardingPass: {
    backgroundColor: colors.white, borderRadius: radius.xxl,
    padding: 20, ...shadows.card, marginBottom: 24,
  },
  refLabel: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.textMuted, letterSpacing: 0.5,
  },
  refCode: {
    fontFamily: 'Baloo2_700Bold', fontSize: 18, color: colors.textPrimary, marginTop: 2,
  },
  routeStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 20, marginBottom: 16,
  },
  routeEnd: { alignItems: 'center' },
  routeCode: { fontFamily: 'Baloo2_700Bold', fontSize: 22, color: colors.textPrimary },
  routeCity: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  routeMiddle: { flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
  routeDash: { flex: 1, height: 1.5, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primaryBorder },

  // Tear line
  tearLine: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  tearCircleLeft: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.background, marginLeft: -28,
  },
  tearDashes: {
    flex: 1, height: 1, borderTopWidth: 1.5,
    borderStyle: 'dashed', borderColor: colors.divider, marginHorizontal: 4,
  },
  tearCircleRight: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.background, marginRight: -28,
  },

  boardingDetails: { gap: 8 },
  boardingRow: { flexDirection: 'row', justifyContent: 'space-between' },
  boardingLabel: { ...typography.caption, color: colors.textSecondary },
  boardingValue: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },

  // Next steps
  nextTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: 14 },
  nextSteps: { gap: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  stepNumber: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.white },
  stepText: { ...typography.body, color: colors.textPrimary, flex: 1 },

  // Bottom
  bottomArea: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border,
  },
  ctaButton: {
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 16, alignItems: 'center', ...shadows.button,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },
});
