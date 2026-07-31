import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';

/**
 * Import Flow — Pet arriving into the UK
 * Distinct from export per Section 6.11.
 * Shorter flow: arrival details → ARC pre-check → landing → clearance → delivery
 */

type ArrivalAirport = 'LHR' | 'LGW' | 'MAN';

const AIRPORTS: { code: ArrivalAirport; name: string; note?: string }[] = [
  { code: 'LHR', name: 'Heathrow' },
  { code: 'LGW', name: 'Gatwick' },
  { code: 'MAN', name: 'Manchester', note: 'Cannot handle commercial pet imports' },
];

export default function ImportScreen() {
  const [originCountry, setOriginCountry] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState<ArrivalAirport | null>(null);
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalFlight, setArrivalFlight] = useState('');
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [needsDelivery, setNeedsDelivery] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Import to UK</Text>
            <Text style={styles.subtitle}>Bringing your pet home</Text>
          </View>
        </View>

        {/* Info card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={18} color={colors.primary} />
            <Text style={styles.infoText}>
              Pets arriving in the UK go through the Animal Reception Centre (ARC).
              The customs process typically takes 4–8 hours after landing.
              Arrivals after 16:30 incur additional fees.
            </Text>
          </View>
        </Card>

        {/* Origin country */}
        <Text style={styles.sectionLabel}>WHERE IS YOUR PET COMING FROM?</Text>
        <Card style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ORIGIN COUNTRY</Text>
            <View style={styles.fieldRow}>
              <Ionicons name="globe-outline" size={18} color={colors.primary} />
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Australia, USA, South Africa"
                placeholderTextColor={colors.textPlaceholder}
                value={originCountry}
                onChangeText={setOriginCountry}
                accessibilityLabel="Origin country"
              />
            </View>
          </View>
        </Card>

        {/* Arrival airport */}
        <Text style={styles.sectionLabel}>ARRIVAL AIRPORT</Text>
        <View style={styles.airportList}>
          {AIRPORTS.map((airport) => (
            <TouchableOpacity
              key={airport.code}
              style={[
                styles.airportChip,
                arrivalAirport === airport.code && styles.airportChipActive,
                airport.note && styles.airportChipDisabled,
              ]}
              onPress={() => !airport.note && setArrivalAirport(airport.code)}
              disabled={!!airport.note}
              accessibilityRole="radio"
              accessibilityState={{ selected: arrivalAirport === airport.code }}
            >
              <Text style={[
                styles.airportChipText,
                arrivalAirport === airport.code && styles.airportChipTextActive,
                airport.note && styles.airportChipTextDisabled,
              ]}>
                {airport.name} ({airport.code})
              </Text>
              {airport.note && (
                <Text style={styles.airportNote}>{airport.note}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Arrival details */}
        <Text style={styles.sectionLabel}>ARRIVAL DETAILS</Text>
        <Card style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ARRIVAL DATE</Text>
            <View style={styles.fieldRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <TextInput
                style={styles.fieldInput}
                placeholder="Approximate arrival date"
                placeholderTextColor={colors.textPlaceholder}
                value={arrivalDate}
                onChangeText={setArrivalDate}
                accessibilityLabel="Arrival date"
              />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ARRIVAL FLIGHT (IF KNOWN)</Text>
            <View style={styles.fieldRow}>
              <Ionicons name="airplane-outline" size={18} color={colors.primary} />
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. QF1"
                placeholderTextColor={colors.textPlaceholder}
                value={arrivalFlight}
                onChangeText={setArrivalFlight}
                accessibilityLabel="Arrival flight number"
              />
            </View>
          </View>
        </Card>

        {/* Delivery option */}
        <Card style={styles.deliveryCard}>
          <Text style={styles.deliveryTitle}>Can't collect in person?</Text>
          <Text style={styles.deliveryDesc}>
            We offer delivery anywhere in the UK if you can't be at the airport.
          </Text>
          <TouchableOpacity
            style={[styles.deliveryToggle, needsDelivery && styles.deliveryToggleActive]}
            onPress={() => setNeedsDelivery(!needsDelivery)}
            accessibilityRole="switch"
            accessibilityState={{ checked: needsDelivery }}
          >
            <Text style={[styles.deliveryToggleText, needsDelivery && styles.deliveryToggleTextActive]}>
              {needsDelivery ? '✓ Delivery requested' : 'I need delivery'}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Notice period */}
        <View style={styles.noticeCard}>
          <Ionicons name="time-outline" size={16} color={colors.warning} />
          <Text style={styles.noticeText}>
            Ideally give us 1+ week notice. Minimum 48 hours for commercial imports.
          </Text>
        </View>

        {/* Submit */}
        <Button
          title="Get import quote"
          onPress={() => {}}
          variant="primary"
          style={styles.submitBtn}
          icon={<Ionicons name="paw" size={18} color={colors.textPrimary} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 20, paddingBottom: 12,
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  infoCard: { marginHorizontal: layout.screenPaddingHorizontal, padding: 14, marginBottom: 16 },
  infoRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  infoText: { ...typography.caption, color: colors.textSecondary, flex: 1, lineHeight: 18 },

  sectionLabel: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary, letterSpacing: 0.5,
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginBottom: 8, marginTop: 8,
  },
  formCard: { marginHorizontal: layout.screenPaddingHorizontal, padding: 18, marginBottom: 16 },
  fieldGroup: { marginBottom: 12 },
  fieldLabel: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.primary, letterSpacing: 0.3, marginBottom: 6, marginLeft: 2,
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.background, borderRadius: radius.md + 2,
    paddingVertical: 13, paddingHorizontal: 14,
  },
  fieldInput: {
    flex: 1, ...typography.body, fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary, padding: 0,
  },

  airportList: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    gap: 8, marginBottom: 16,
  },
  airportChip: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 14, borderWidth: 1.5, borderColor: colors.borderMedium,
  },
  airportChipActive: {
    borderColor: colors.primary, backgroundColor: colors.primarySubtle,
  },
  airportChipDisabled: { opacity: 0.5 },
  airportChipText: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  airportChipTextActive: { color: colors.primary },
  airportChipTextDisabled: { color: colors.textMuted },
  airportNote: { ...typography.tiny, color: colors.primary, marginTop: 4 },

  deliveryCard: { marginHorizontal: layout.screenPaddingHorizontal, padding: 18, marginBottom: 12 },
  deliveryTitle: { ...typography.h5, color: colors.textPrimary, marginBottom: 4 },
  deliveryDesc: { ...typography.caption, color: colors.textSecondary, marginBottom: 12 },
  deliveryToggle: {
    borderWidth: 1.5, borderColor: colors.borderStrong,
    borderRadius: radius.pill, paddingVertical: 10, alignItems: 'center',
  },
  deliveryToggleActive: {
    backgroundColor: colors.success, borderColor: colors.success,
  },
  deliveryToggleText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  deliveryToggleTextActive: { color: colors.white },

  noticeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: layout.screenPaddingHorizontal,
    backgroundColor: colors.secondarySubtle, borderRadius: radius.md,
    padding: 12, marginBottom: 16,
  },
  noticeText: { ...typography.caption, color: colors.warning, flex: 1, lineHeight: 17 },

  submitBtn: { marginHorizontal: layout.screenPaddingHorizontal },
});
