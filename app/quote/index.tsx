import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows, layout } from '../../src/theme';
import { Card } from '../../src/components/ui';
import { TrustBadge } from '../../src/components/TrustBadge';
import { AccreditationBadges } from '../../src/components/AccreditationBadges';
import { SearchableDropdown } from '../../src/components/SearchableDropdown';
import { DatePickerModal } from '../../src/components/DatePickerModal';
import { PetSpecies, TripDirection } from '../../src/types';
import { useQuoteFlow } from '../../src/services/quoteContext';
import { getBreedsForSpecies } from '../../src/data/breeds';
import { searchAirports, AIRPORTS, POPULAR_ROUTES } from '../../src/data/airports';

// Pet type images
const DogImage = require('../../src/assets/Dog.svg');
const CatImage = require('../../src/assets/Cat.svg');
const BirdImage = require('../../src/assets/Bird.svg');

type PetOption = { species: PetSpecies; label: string; image: any; iconFallback: string };
const PET_OPTIONS: PetOption[] = [
  { species: 'dog', label: 'Dog', image: DogImage, iconFallback: 'paw' },
  { species: 'cat', label: 'Cat', image: CatImage, iconFallback: 'paw' },
  { species: 'bird', label: 'Bird', image: BirdImage, iconFallback: 'leaf' },
  { species: 'exotic', label: 'Other', image: null, iconFallback: 'help-circle' },
];

export default function QuoteSearchScreen() {
  const { quoteDispatch } = useQuoteFlow();

  // Form state
  const [direction, setDirection] = useState<TripDirection>('export');
  const [originCode, setOriginCode] = useState('');
  const [originDisplay, setOriginDisplay] = useState('');
  const [destCode, setDestCode] = useState('');
  const [destDisplay, setDestDisplay] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelDateDisplay, setTravelDateDisplay] = useState('');
  const [petType, setPetType] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');

  // Modal visibility
  const [showOriginPicker, setShowOriginPicker] = useState(false);
  const [showDestPicker, setShowDestPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBreedPicker, setShowBreedPicker] = useState(false);

  const airportNames = AIRPORTS.map((a) => `${a.city} (${a.code})`);
  const breeds = getBreedsForSpecies(petType);

  const handleSearch = () => {
    quoteDispatch({
      type: 'SET_SEARCH_PARAMS',
      payload: {
        direction,
        originCity: originDisplay || 'London',
        originAirport: originCode || 'LHR',
        destinationCity: destDisplay || 'Cape Town',
        destinationAirport: destCode || 'CPT',
        travelDate: travelDate || '2026-07-15',
        petSpecies: petType,
        breed: breed || 'Labrador Retriever',
      },
    });
    router.push('/quote/results');
  };

  const handlePopularRoute = (from: string, fromCity: string, to: string, toCity: string) => {
    setOriginCode(from);
    setOriginDisplay(fromCity);
    setDestCode(to);
    setDestDisplay(toCity);
  };

  const handleAirportSelect = (value: string, isOrigin: boolean) => {
    // Parse "City (CODE)" format
    const match = value.match(/\(([A-Z]{3})\)/);
    const code = match ? match[1] : '';
    const city = value.replace(/\s*\([A-Z]{3}\)/, '');

    if (isOrigin) {
      setOriginCode(code);
      setOriginDisplay(city);
    } else {
      setDestCode(code);
      setDestDisplay(city);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.heroTop}>
          <View style={styles.logoRow}>
            <Ionicons name="paw" size={20} color={colors.primary} />
            <Text style={styles.logoText}>Pets by Plane</Text>
          </View>
          <TrustBadge compact />
        </View>

        <Text style={styles.heroTitle}>Fly your pet{'\n'}anywhere in the world</Text>
        <Text style={styles.heroSubtitle}>
          Get a personalised quote for your pet's journey. A consultant will be in touch within 24 hours.
        </Text>

        {/* Direction toggle */}
        <View style={styles.directionToggle}>
          <TouchableOpacity
            style={[styles.dirBtn, direction === 'export' && styles.dirBtnActive]}
            onPress={() => setDirection('export')}
          >
            <Ionicons name="airplane" size={14} color={direction === 'export' ? colors.white : colors.textSecondary} />
            <Text style={[styles.dirText, direction === 'export' && styles.dirTextActive]}>Export (UK → Abroad)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dirBtn, direction === 'import' && styles.dirBtnActive]}
            onPress={() => setDirection('import')}
          >
            <Ionicons name="airplane" size={14} color={direction === 'import' ? colors.white : colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
            <Text style={[styles.dirText, direction === 'import' && styles.dirTextActive]}>Import (Abroad → UK)</Text>
          </TouchableOpacity>
        </View>

        {/* Pet type selector with illustrations */}
        <Text style={styles.sectionLabel}>WHAT PET ARE YOU FLYING?</Text>
        <View style={styles.petTypeRow}>
          {PET_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.species}
              style={[styles.petTypeCard, petType === opt.species && styles.petTypeCardActive]}
              onPress={() => { setPetType(opt.species); setBreed(''); }}
              accessibilityRole="radio"
              accessibilityState={{ selected: petType === opt.species }}
            >
              {opt.image ? (
                <Image source={opt.image} style={styles.petTypeImage} resizeMode="contain" />
              ) : (
                <View style={styles.petTypeIconFallback}>
                  <Ionicons name={opt.iconFallback as any} size={24} color={colors.primary} />
                </View>
              )}
              <Text style={[styles.petTypeLabel, petType === opt.species && styles.petTypeLabelActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search form */}
        <Card style={styles.formCard}>
          {/* From */}
          <TouchableOpacity style={styles.fieldRow} onPress={() => setShowOriginPicker(true)}>
            <Ionicons name="airplane-outline" size={18} color={colors.primary} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>FROM</Text>
              <Text style={[styles.fieldValue, !originDisplay && styles.fieldPlaceholder]}>
                {originDisplay ? `${originDisplay} (${originCode})` : 'Select origin airport'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.fieldDivider} />

          {/* To */}
          <TouchableOpacity style={styles.fieldRow} onPress={() => setShowDestPicker(true)}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>TO</Text>
              <Text style={[styles.fieldValue, !destDisplay && styles.fieldPlaceholder]}>
                {destDisplay ? `${destDisplay} (${destCode})` : 'Select destination'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.fieldDivider} />

          {/* Date */}
          <TouchableOpacity style={styles.fieldRow} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>TRAVEL DATE</Text>
              <Text style={[styles.fieldValue, !travelDateDisplay && styles.fieldPlaceholder]}>
                {travelDateDisplay || 'Pick a date'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.fieldDivider} />

          {/* Breed */}
          <TouchableOpacity style={styles.fieldRow} onPress={() => setShowBreedPicker(true)}>
            <Ionicons name="paw-outline" size={18} color={colors.primary} />
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>BREED</Text>
              <Text style={[styles.fieldValue, !breed && styles.fieldPlaceholder]}>
                {breed || `Select ${petType} breed`}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Search button */}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
          <Ionicons name="paw" size={18} color={colors.textPrimary} />
          <Text style={styles.searchBtnText}>Get a quote</Text>
        </TouchableOpacity>

        {/* Popular routes */}
        <Text style={styles.popularTitle}>Popular pet routes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularList}>
          {POPULAR_ROUTES.map((r, i) => (
            <TouchableOpacity
              key={i}
              style={styles.routeChip}
              onPress={() => handlePopularRoute(r.from, r.fromCity, r.to, r.toCity)}
            >
              <Text style={styles.routeChipCode}>{r.from} → {r.to}</Text>
              <Text style={styles.routeChipLabel}>{r.fromCity} → {r.toCity}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Accreditations */}
        <View style={styles.accreditRow}>
          <AccreditationBadges layout="row" />
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
            <Text style={styles.trustNumber}>30+</Text>
            <Text style={styles.trustLabel}>Airline partners</Text>
          </View>
        </View>

        {/* Import link */}
        <TouchableOpacity
          style={styles.importLink}
          onPress={() => router.push('/import')}
          accessibilityRole="link"
        >
          <Text style={styles.importLinkText}>Importing a pet to the UK? →</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Pickers */}
      <SearchableDropdown
        visible={showOriginPicker}
        onClose={() => setShowOriginPicker(false)}
        onSelect={(v) => handleAirportSelect(v, true)}
        items={airportNames}
        title="Origin airport"
        placeholder="Search city or airport code..."
      />
      <SearchableDropdown
        visible={showDestPicker}
        onClose={() => setShowDestPicker(false)}
        onSelect={(v) => handleAirportSelect(v, false)}
        items={airportNames}
        title="Destination"
        placeholder="Search city or airport code..."
      />
      <SearchableDropdown
        visible={showBreedPicker}
        onClose={() => setShowBreedPicker(false)}
        onSelect={setBreed}
        items={breeds}
        title={`Select ${petType} breed`}
        placeholder="Search breed..."
      />
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={(iso, formatted) => { setTravelDate(iso); setTravelDateDisplay(formatted); }}
        title="When is your pet travelling?"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 40 },

  // Hero
  heroTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 16, marginBottom: 16,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { ...typography.h5, color: colors.textPrimary },
  heroTitle: {
    fontFamily: 'Baloo2_700Bold', fontSize: 26, lineHeight: 34,
    color: colors.textPrimary,
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  heroSubtitle: {
    ...typography.body, color: colors.textSecondary, marginTop: 6,
    paddingHorizontal: layout.screenPaddingHorizontal, lineHeight: 21, marginBottom: 16,
  },

  // Direction
  directionToggle: {
    flexDirection: 'row', marginHorizontal: layout.screenPaddingHorizontal,
    backgroundColor: '#E9E4D8', borderRadius: radius.pill, padding: 4, gap: 4, marginBottom: 18,
  },
  dirBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: radius.pill,
  },
  dirBtnActive: { backgroundColor: colors.primary },
  dirText: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  dirTextActive: { color: colors.white },

  // Pet type selector
  sectionLabel: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.textSecondary,
    letterSpacing: 0.5, paddingHorizontal: layout.screenPaddingHorizontal, marginBottom: 10,
  },
  petTypeRow: {
    flexDirection: 'row', paddingHorizontal: layout.screenPaddingHorizontal,
    gap: 10, marginBottom: 18,
  },
  petTypeCard: {
    flex: 1, alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.lg, paddingVertical: 14, paddingHorizontal: 6,
    borderWidth: 2, borderColor: 'transparent', ...shadows.iconButton,
  },
  petTypeCardActive: {
    borderColor: colors.primary, backgroundColor: colors.primarySubtle,
  },
  petTypeImage: { width: 44, height: 44, marginBottom: 6 },
  petTypeIconFallback: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  petTypeLabel: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  petTypeLabelActive: { color: colors.primary },

  // Form card
  formCard: { marginHorizontal: layout.screenPaddingHorizontal, padding: 0, borderRadius: radius.xxl },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 16, paddingHorizontal: 18,
  },
  fieldContent: { flex: 1 },
  fieldLabel: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.primary, letterSpacing: 0.3, marginBottom: 2,
  },
  fieldValue: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  fieldPlaceholder: { color: colors.textPlaceholder, fontFamily: 'Nunito_400Regular' },
  fieldDivider: { height: 1, backgroundColor: colors.divider, marginHorizontal: 18 },

  // Search button
  searchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginHorizontal: layout.screenPaddingHorizontal, marginTop: 16,
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 16, ...shadows.button,
  },
  searchBtnText: { ...typography.button, color: colors.textPrimary },

  // Popular routes
  popularTitle: {
    ...typography.h5, color: colors.textPrimary,
    paddingHorizontal: layout.screenPaddingHorizontal, marginTop: 28, marginBottom: 12,
  },
  popularList: { paddingHorizontal: layout.screenPaddingHorizontal, gap: 10 },
  routeChip: {
    backgroundColor: colors.white, borderRadius: radius.md + 2,
    paddingVertical: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: colors.borderMedium, minWidth: 140,
  },
  routeChipCode: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  routeChipLabel: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },

  // Accreditations
  accreditRow: { marginTop: 24, paddingHorizontal: layout.screenPaddingHorizontal },

  // Trust bar
  trustBar: {
    flexDirection: 'row', marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: 16, backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 16, paddingHorizontal: 12,
  },
  trustItem: { flex: 1, alignItems: 'center' },
  trustNumber: { fontFamily: 'Baloo2_700Bold', fontSize: 17, color: colors.white },
  trustLabel: { ...typography.tiny, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Import link
  importLink: { alignItems: 'center', marginTop: 20, paddingVertical: 10 },
  importLinkText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.primary },
});
