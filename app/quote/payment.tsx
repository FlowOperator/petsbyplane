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
import { useAppState } from '../../src/services/store';

/**
 * Payment Method Screen — card entry for the deposit.
 * From handoff: name on card, card number, expiry + CVC, postcode.
 */
export default function PaymentScreen() {
  const { quoteState } = useQuoteFlow();
  const { dispatch } = useAppState();
  const flight = quoteState.selectedFlight;
  const deposit = flight ? Math.round(flight.price * 0.2) : 0;

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [postcode, setPostcode] = useState('');

  const handlePay = () => {
    // Create the booking — this flips hasBooking to true
    const search = quoteState.searchParams;
    const flight = quoteState.selectedFlight;
    const now = new Date().toISOString();
    const tripId = `trip-${Date.now()}`;
    const petId = `pet-${Date.now()}`;
    const ownerId = `owner-${Date.now()}`;
    
    dispatch({
      type: 'SET_BOOKING',
      payload: {
        owner: {
          id: ownerId,
          firstName: cardName.split(' ')[0] || 'Alex',
          surname: cardName.split(' ').slice(1).join(' ') || '',
          email: '',
          phone: '',
          preferredLanguage: 'en',
          mediaConsent: true,
          pets: [petId],
          createdAt: now,
        },
        pet: {
          id: petId,
          ownerId,
          name: 'Darcy',
          species: search?.petSpecies || 'dog',
          breed: search?.breed || 'Labrador Retriever',
          dateOfBirth: '2022-03-12',
          weight: 28,
          microchipNumber: '981 000 012 345 678',
          documentStatus: 'pending',
          createdAt: now,
          updatedAt: now,
        },
        trip: {
          id: tripId,
          ownerId,
          petId,
          direction: search?.direction || 'export',
          status: 'active',
          originCity: search?.originCity || 'London',
          originAirport: search?.originAirport || 'LHR',
          destinationCity: search?.destinationCity || 'Cape Town',
          destinationAirport: search?.destinationAirport || 'CPT',
          travelDate: search?.travelDate || '2026-09-15',
          flight: {
            airline: flight?.airline || 'KLM',
            flightNumber: '',
            route: flight?.route || 'LHR → AMS → CPT',
            departureTime: '',
            arrivalTime: '',
            confirmed: false,
          },
          payments: [],
          milestones: [
            { id: `ms-1`, tripId, order: 1, title: 'Initial consultation & quote', description: 'Quote accepted, deposit paid', status: 'completed', completedAt: now },
            { id: `ms-2`, tripId, order: 2, title: 'Veterinary requirements', description: 'Vaccinations and blood tests', status: 'current', estimatedDate: search?.travelDate || '2026-09-15' },
            { id: `ms-3`, tripId, order: 3, title: 'Route planning & flight booking', description: 'Airline confirmation', status: 'upcoming' },
            { id: `ms-4`, tripId, order: 4, title: 'IATA crate delivery', description: 'Crate delivered for acclimatisation', status: 'upcoming' },
            { id: `ms-5`, tripId, order: 5, title: 'Export preparation', description: 'Health certificates and permits', status: 'upcoming' },
            { id: `ms-6`, tripId, order: 6, title: 'Collection & check-in', description: 'Pet collected and checked in', status: 'upcoming' },
            { id: `ms-7`, tripId, order: 7, title: 'Arrival & reunion', description: 'Landing and customs clearance', status: 'upcoming' },
          ],
          createdAt: now,
          updatedAt: now,
        },
        consultant: {
          id: 'cons-001',
          name: 'Sarah Whitfield',
          phone: '+44 1903 741 000',
          email: 'sarah@petsbyplane.com',
          isOnline: true,
        },
        documents: [
          { id: 'doc-1', petId, tripId, type: 'rabies_vaccination', name: 'Rabies vaccination record', description: 'Must be 30+ days before travel', status: 'missing' },
          { id: 'doc-2', petId, tripId, type: 'microchip_confirmation', name: 'Microchip confirmation', description: '15-digit ISO microchip', status: 'missing' },
          { id: 'doc-3', petId, tripId, type: 'health_screening', name: 'Blood tests', description: 'Required for destination', status: 'missing' },
        ],
      },
    });
    
    router.push('/quote/confirmation');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color={colors.primary} />
        <Text style={styles.backText}>Back to checkout</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>
          Your card will only be charged for the deposit today.
        </Text>

        {/* Card form */}
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>NAME ON CARD</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name as on card"
              placeholderTextColor={colors.textPlaceholder}
              value={cardName}
              onChangeText={setCardName}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CARD NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.textPlaceholder}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>EXPIRY</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor={colors.textPlaceholder}
                value={expiry}
                onChangeText={setExpiry}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>CVC</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor={colors.textPlaceholder}
                value={cvc}
                onChangeText={setCvc}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>BILLING POSTCODE</Text>
            <TextInput
              style={styles.input}
              placeholder="SW1A 1AA"
              placeholderTextColor={colors.textPlaceholder}
              value={postcode}
              onChangeText={setPostcode}
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Security note */}
        <View style={styles.securityRow}>
          <Ionicons name="lock-closed" size={14} color={colors.success} />
          <Text style={styles.securityText}>
            Payments are encrypted and processed securely
          </Text>
        </View>

        {/* Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Deposit</Text>
            <Text style={styles.summaryValue}>£{deposit}</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Pay CTA */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handlePay}
          activeOpacity={0.85}
        >
          <Ionicons name="lock-closed" size={16} color={colors.textPrimary} />
          <Text style={styles.ctaText}>Pay £{deposit} deposit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  rowFields: { flexDirection: 'row', gap: 12 },

  securityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginVertical: 12, paddingHorizontal: 4,
  },
  securityText: { ...typography.caption, color: colors.success },

  summaryCard: { padding: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { ...typography.body, color: colors.textSecondary },
  summaryValue: { fontFamily: 'Baloo2_700Bold', fontSize: 20, color: colors.primary },

  bottomArea: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border,
  },
  ctaButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 16, ...shadows.button,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },
});
