import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card } from '../../src/components/ui';
import { useQuoteFlow } from '../../src/services/quoteContext';

/**
 * Checkout Screen — account/contact details + booking summary before payment.
 * From the handoff: pet name, full name, email, phone, password + summary card.
 */
export default function CheckoutScreen() {
  const { quoteState } = useQuoteFlow();
  const flight = quoteState.selectedFlight;
  const search = quoteState.searchParams;
  const deposit = flight ? Math.round(flight.price * 0.2) : 0;

  const [petName, setPetName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [mediaConsent, setMediaConsent] = useState(true); // Default true per T&Cs, but explicit opt-out available

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Back link */}
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color={colors.primary} />
        <Text style={styles.backText}>Back to quote</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          We'll save your details so you can track {petName || 'your pet'}'s journey.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <InputField label="PET'S NAME" placeholder="e.g. Darcy" value={petName} onChangeText={setPetName} />
          <InputField label="FULL NAME" placeholder="Your full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
          <InputField label="EMAIL" placeholder="your@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <InputField label="PHONE" placeholder="+44 7700 000000" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <InputField label="PASSWORD" placeholder="Create a password" value={password} onChangeText={setPassword} secureTextEntry />
        </View>

        {/* Media consent — per Section 6.14 of spec */}
        <TouchableOpacity
          style={styles.consentRow}
          onPress={() => setMediaConsent(!mediaConsent)}
          activeOpacity={0.7}
          accessibilityRole="switch"
          accessibilityState={{ checked: mediaConsent }}
          accessibilityLabel="Allow photos and videos of your pet to be used for marketing"
        >
          <View style={[styles.consentCheckbox, mediaConsent && styles.consentCheckboxActive]}>
            {mediaConsent && <Ionicons name="checkmark" size={14} color={colors.white} />}
          </View>
          <View style={styles.consentContent}>
            <Text style={styles.consentTitle}>Photo & video consent</Text>
            <Text style={styles.consentDescription}>
              Allow Pets by Plane to use photos/videos of your pet for social media and marketing. You can change this anytime in settings.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Summary card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Route</Text>
            <Text style={styles.summaryValue}>
              {search?.originAirport || 'LHR'} → {search?.destinationAirport || 'CPT'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Airline</Text>
            <Text style={styles.summaryValue}>{flight?.airline || 'TBC'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Add-ons</Text>
            <Text style={styles.summaryValue}>{quoteState.selectedAddOns.length} selected</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.depositLabel}>Deposit due today</Text>
            <Text style={styles.depositValue}>£{deposit}</Text>
          </View>
          <Text style={styles.depositNote}>
            25% of total — remainder due before collection
          </Text>
        </Card>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/quote/payment')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Continue to payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InputField({ label, placeholder, value, onChangeText, ...props }: any) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={label}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  backRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 16, paddingBottom: 8,
  },
  backText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.primary },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 120 },
  title: { fontFamily: 'Baloo2_700Bold', fontSize: 22, color: colors.textPrimary, marginTop: 8 },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 4, marginBottom: 20 },

  form: { gap: 0 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary, letterSpacing: 0.3, marginBottom: 6, marginLeft: 4,
  },
  input: {
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: 14, paddingHorizontal: 18,
    ...typography.body, color: colors.textPrimary, ...shadows.iconButton,
  },

  summaryCard: { marginTop: 8, padding: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { ...typography.caption, color: colors.textSecondary },
  summaryValue: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 10 },
  depositLabel: { fontFamily: 'Baloo2_700Bold', fontSize: 16, color: colors.textPrimary },
  depositValue: { fontFamily: 'Baloo2_700Bold', fontSize: 18, color: colors.primary },
  depositNote: { ...typography.tiny, color: colors.textMuted, marginTop: 4 },

  consentRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    marginTop: 18, marginBottom: 8, paddingVertical: 4,
  },
  consentCheckbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  consentCheckboxActive: {
    backgroundColor: colors.primary, borderColor: colors.primary,
  },
  consentContent: { flex: 1 },
  consentTitle: {
    ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary,
  },
  consentDescription: {
    ...typography.tiny, color: colors.textSecondary, marginTop: 3, lineHeight: 16,
  },

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
