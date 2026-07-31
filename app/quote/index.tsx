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
import { colors, typography, spacing, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { TrustBadge } from '../../src/components/TrustBadge';
import { AccreditationBadges } from '../../src/components/AccreditationBadges';
import { PetSpecies, TripDirection } from '../../src/types';
import { useQuoteFlow } from '../../src/services/quoteContext';

/**
 * Quote Search Screen — Step 1 of 4
 * Branded in Pets by Plane style, following FlyMyPet's flow structure:
 * From → To → Date → Pet/Breed → Search
 */
export default function QuoteSearchScreen() {
  const { quoteDispatch } = useQuoteFlow();
  const [direction, setDirection] = useState<TripDirection>('export');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [petType, setPetType] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');

  const handleSearch = () => {
    quoteDispatch({
      type: 'SET_SEARCH_PARAMS',
      payload: {
        direction,
        originCity: origin || 'London',
        originAirport: 'LHR',
        destinationCity: destination || 'Cape Town',
        destinationAirport: 'CPT',
        travelDate: travelDate || '2026-07-15',
        petSpecies: petType,
        breed: breed || 'Akita',
      },
    });
    router.push('/quote/results');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.logoArea}>
              <Ionicons name="paw" size={22} color={colors.primary} />
              <Text style={styles.logoText}>Pets by Plane</Text>
            </View>
            <View style={styles.trustPills}>
              <TrustBadge compact />
            </View>
          </View>
          <Text style={styles.heroTitle}>
            Fly your pet{'\n'}anywhere in the world
          </Text>
          <Text style={styles.heroSubtitle}>
            Get a personalised quote for your pet's journey, then book and track the whole thing in one app.
          </Text>
        </View>

        {/* Search form card */}
        <Card style={styles.formCard}>
          {/* From */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>FROM</Text>
            <TouchableOpacity style={styles.fieldRow} accessibilityRole="button">
              <Ionicons name="airplane-outline" size={18} color={colors.primary} />
              <TextInput
                style={styles.fieldInput}
                placeholder="London (LHR)"
                placeholderTextColor={colors.textPlaceholder}
                value={origin}
                onChangeText={setOrigin}
                accessibilityLabel="Origin city or airport"
              />
            </TouchableOpacity>
          </View>

          {/* Swap */}
          <View style={styles.swapRow}>
            <View style={styles.dividerLine} />
            <TouchableOpacity
              style={styles.swapButton}
              onPress={() => {
                const temp = origin;
                setOrigin(destination);
                setDestination(temp);
              }}
              accessibilityLabel="Swap origin and destination"
            >
              <Ionicons name="swap-vertical" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* To */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>TO</Text>
            <TouchableOpacity style={styles.fieldRow} accessibilityRole="button">
              <Ionicons name="airplane-outline" size={18} color={colors.primary} style={{ transform: [{ rotate: '90deg' }] }} />
              <TextInput
                style={styles.fieldInput}
                placeholder="Cape Town (CPT)"
                placeholderTextColor={colors.textPlaceholder}
                value={destination}
                onChangeText={setDestination}
                accessibilityLabel="Destination city or airport"
              />
            </TouchableOpacity>
          </View>

          {/* Date */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>TRAVEL DATE</Text>
            <TouchableOpacity style={styles.fieldRow} accessibilityRole="button">
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <TextInput
                style={styles.fieldInput}
                placeholder="Wed, 15 Jul 2026"
                placeholderTextColor={colors.textPlaceholder}
                value={travelDate}
                onChangeText={setTravelDate}
                accessibilityLabel="Travel date"
              />
            </TouchableOpacity>
          </View>

          {/* Pet + Breed row */}
          <View style={styles.petBreedRow}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>PET</Text>
              <TouchableOpacity style={styles.fieldRow} accessibilityRole="button">
                <Ionicons name="paw-outline" size={16} color={colors.primary} />
                <Text style={styles.fieldValue}>Dog</Text>
                <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>BREED</Text>
              <TouchableOpacity style={styles.fieldRow} accessibilityRole="button">
                <Ionicons name="paw" size={14} color={colors.primary} />
                <TextInput
                  style={[styles.fieldInput, { flex: 1 }]}
                  placeholder="Akita"
                  placeholderTextColor={colors.textPlaceholder}
                  value={breed}
                  onChangeText={setBreed}
                  accessibilityLabel="Breed"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add another pet */}
          <TouchableOpacity style={styles.addPetRow} accessibilityRole="button">
            <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.addPetText}>Add another pet</Text>
          </TouchableOpacity>

          {/* Search button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Search flights"
          >
            <Ionicons name="paw" size={18} color={colors.textPrimary} />
            <Text style={styles.searchButtonText}>Search flights</Text>
          </TouchableOpacity>
        </Card>

        {/* Accreditations */}
        <View style={styles.accreditationRow}>
          <AccreditationBadges layout="row" />
        </View>

        {/* Popular routes */}
        <Text style={styles.sectionTitle}>Popular pet routes</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.routeChips}
        >
          {[
            { codes: 'JNB → LHR', label: 'Johannesburg → London' },
            { codes: 'LHR → JFK', label: 'London → New York' },
            { codes: 'SYD → LHR', label: 'Sydney → London' },
            { codes: 'DXB → LHR', label: 'Dubai → London' },
          ].map((r, i) => (
            <TouchableOpacity key={i} style={styles.routeChip} accessibilityRole="button">
              <Text style={styles.routeChipCodes}>{r.codes}</Text>
              <Text style={styles.routeChipLabel}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* How it works */}
        <Text style={styles.sectionTitle}>How it works</Text>
        <View style={styles.howSteps}>
          {[
            { icon: 'search-outline' as const, title: 'Search', desc: 'Live airline routes & prices' },
            { icon: 'chatbubbles-outline' as const, title: 'Book', desc: 'Add pets & pay a deposit' },
            { icon: 'location-outline' as const, title: 'Track', desc: 'Follow every leg live' },
          ].map((step, i) => (
            <View key={i} style={styles.howStep}>
              <View style={styles.howStepIcon}>
                <Ionicons name={step.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.howStepTitle}>{step.title}</Text>
              <Text style={styles.howStepDesc}>{step.desc}</Text>
            </View>
          ))}
        </View>

        {/* Trust bar */}
        <View style={styles.trustBar}>
          <View style={styles.trustItem}>
            <Text style={styles.trustNumber}>150+</Text>
            <Text style={styles.trustLabel}>Destinations</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustNumber}>5,000+</Text>
            <Text style={styles.trustLabel}>Pets flown</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustNumber}>4.9★</Text>
            <Text style={styles.trustLabel}>Owner rating</Text>
          </View>
        </View>

        {/* Trustindex badge */}
        <View style={styles.trustBadgeRow}>
          <TrustBadge />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 40 },

  // Hero
  hero: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 20,
    paddingBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  trustPills: {
    flexDirection: 'row',
    gap: 8,
  },
  heroTitle: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 21,
  },

  // Form card
  formCard: {
    marginHorizontal: layout.screenPaddingHorizontal,
    borderRadius: radius.xxxl,
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 4,
  },
  fieldLabel: {
    ...typography.tiny,
    fontFamily: 'Nunito_700Bold',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 6,
    marginLeft: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background,
    borderRadius: radius.md + 2,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  fieldInput: {
    flex: 1,
    ...typography.body,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
    padding: 0,
  },
  fieldValue: {
    ...typography.body,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
    flex: 1,
  },

  // Swap
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -4,
    marginBottom: 4,
    paddingRight: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  swapButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    ...shadows.iconButton,
  },

  // Pet + Breed
  petBreedRow: {
    flexDirection: 'row',
    gap: 10,
  },

  // Add pet
  addPetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 16,
    marginLeft: 2,
  },
  addPetText: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.primary,
  },

  // Search button
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    ...shadows.button,
  },
  searchButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },

  // Accreditations
  accreditationRow: {
    marginTop: 12,
    marginHorizontal: layout.screenPaddingHorizontal,
  },

  // Popular routes
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginTop: 28,
    marginBottom: 12,
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  routeChips: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    gap: 10,
  },
  routeChip: {
    backgroundColor: colors.white,
    borderRadius: radius.md + 2,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    minWidth: 140,
  },
  routeChipCodes: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  routeChipLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // How it works
  howSteps: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPaddingHorizontal,
    gap: 10,
  },
  howStep: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  howStepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  howStepTitle: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  howStepDesc: {
    ...typography.tiny,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 15,
  },

  // Trust bar
  trustBar: {
    flexDirection: 'row',
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
  },
  trustNumber: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 17,
    color: colors.white,
  },
  trustLabel: {
    ...typography.tiny,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  trustBadgeRow: {
    alignItems: 'center',
    marginTop: 18,
    marginHorizontal: layout.screenPaddingHorizontal,
  },
});
