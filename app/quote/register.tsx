import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card } from '../../src/components/ui';
import { AcceptanceCard } from '../../src/components/AcceptanceCard';
import { ProgressSteps } from '../../src/components/ProgressSteps';
import { useQuoteFlow } from '../../src/services/quoteContext';
import { useAppState } from '../../src/services/store';
import { createBookingFromQuote } from '../../src/services/quoteService';

/**
 * Register Screen — Step 4 of 4
 * Account creation + T&Cs acceptance to reserve the booking.
 */
export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [petName, setPetName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { quoteState } = useQuoteFlow();
  const { dispatch } = useAppState();

  const handleCreateAccount = () => {
    if (!quoteState.searchParams || !quoteState.selectedFlight) {
      router.replace('/(tabs)');
      return;
    }

    createBookingFromQuote(
      quoteState.searchParams,
      quoteState.selectedFlight,
      quoteState.selectedAddOns,
      { firstName, surname, email, phone, petName },
      dispatch
    );

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Progress — all filled */}
      <ProgressSteps total={4} current={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Flight summary (compact) */}
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
          {/* Route codes */}
          <View style={styles.routeRow}>
            <Text style={styles.codeText}>LHR</Text>
            <View style={styles.routeDash} />
            <Ionicons name="arrow-forward" size={12} color={colors.textMuted} />
            <View style={styles.routeDash} />
            <Text style={styles.codeText}>CPT</Text>
          </View>
          {/* Totals */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total £1,453</Text>
            <Text style={styles.depositLabel}>Deposit £291</Text>
          </View>
        </Card>

        {/* Your details */}
        <Text style={styles.sectionLabel}>YOUR DETAILS</Text>
        <Card style={styles.formCard}>
          <View style={styles.nameRow}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>FIRST NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor={colors.textPlaceholder}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                accessibilityLabel="First name"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>SURNAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Surname"
                placeholderTextColor={colors.textPlaceholder}
                value={surname}
                onChangeText={setSurname}
                autoCapitalize="words"
                accessibilityLabel="Surname"
              />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={colors.textPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PHONE</Text>
            <TextInput
              style={styles.input}
              placeholder="+44 7700 000000"
              placeholderTextColor={colors.textPlaceholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              accessibilityLabel="Phone"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CREATE A PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={colors.textPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              accessibilityLabel="Password"
            />
          </View>
        </Card>

        {/* Pet name */}
        <Text style={styles.sectionLabel}>YOUR PET</Text>
        <Card style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>AKITA NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Your pet's name"
              placeholderTextColor={colors.textPlaceholder}
              value={petName}
              onChangeText={setPetName}
              autoCapitalize="words"
              accessibilityLabel="Pet name"
            />
          </View>
        </Card>

        {/* T&Cs */}
        <View style={styles.termsContainer}>
          <AcceptanceCard
            title="Terms & Conditions"
            summary="You're agreeing to our standard booking terms, including payment schedule and cancellation policy."
            fullText="Full terms and conditions for Live Logistix Ltd (trading as Pets by Plane), Company No. 15123404. All bookings are subject to deposit payment and document submission before any advice, itineraries, or vet guidance is provided. Quotes are valid for 28 days. Cancellation fees apply on a tiered basis depending on proximity to the travel date."
            onAcceptChange={setTermsAccepted}
          />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.createBtn, !termsAccepted && styles.createBtnDisabled]}
          onPress={handleCreateAccount}
          disabled={!termsAccepted}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Create account and reserve"
        >
          <Text style={[styles.createBtnText, !termsAccepted && styles.createBtnTextDisabled]}>
            Create account & reserve →
          </Text>
        </TouchableOpacity>
        <Text style={styles.legalNote}>
          No payment is taken yet. Your quote is reserved for 28 days.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 140,
  },

  // Summary
  summaryCard: { marginBottom: 20, padding: 18 },
  airlineRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  airlineLogo: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  airlineName: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  flightMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  viaBadge: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  viaText: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.secondaryDark },
  routeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 14,
  },
  codeText: { fontFamily: 'Baloo2_700Bold', fontSize: 20, color: colors.textPrimary },
  routeDash: { width: 30, height: 1.5, backgroundColor: colors.divider },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 14, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
  totalLabel: { ...typography.body, color: colors.textSecondary },
  depositLabel: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.primary },

  // Form sections
  sectionLabel: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary, letterSpacing: 0.5,
    marginBottom: 10, marginTop: 4,
  },
  formCard: { marginBottom: 20, padding: 18 },
  nameRow: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  fieldGroup: { marginTop: 14 },
  fieldLabel: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary, letterSpacing: 0.3,
    marginBottom: 6, marginLeft: 2,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md + 2,
    paddingVertical: 13, paddingHorizontal: 14,
    ...typography.body, color: colors.textPrimary,
  },

  // Terms
  termsContainer: { marginTop: 4, marginBottom: 16 },

  // Bottom
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 14, paddingBottom: 28,
    backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  createBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.button,
  },
  createBtnDisabled: {
    opacity: 0.5,
  },
  createBtnText: { ...typography.button, color: colors.textPrimary },
  createBtnTextDisabled: { opacity: 0.7 },
  legalNote: {
    ...typography.tiny, color: colors.textMuted,
    textAlign: 'center', marginTop: 10,
  },
});
