import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';

const DogImage = require('../../assets/dog.svg');

// ─── Data ────────────────────────────────────────────────────────────

interface AirlineProfile {
  name: string;
  hub: string;
  destinations: string;
  ukDepartures: string;
  snubNosePolicy: string;
  highlights: string[];
  details: string;
  comingSoon?: boolean;
}

const AIRLINES: AirlineProfile[] = [
  {
    name: 'British Airways',
    hub: 'London Heathrow (LHR)',
    destinations: '150+',
    ukDepartures: 'Aberdeen, Edinburgh, Manchester, Newcastle, Heathrow, Gatwick (long-haul only)',
    snubNosePolicy: 'Small embargo list — only Pugs, Bulldogs and Pekinese banned',
    highlights: [
      'Hub and spoke system — accepts pets from regional UK airports transiting via Heathrow',
      'Very little temperature restrictions during summer months',
      'Partnership with Animal Air Care at Heathrow and Gatwick',
    ],
    details: 'BA Euroflyer (subsidiary) is not licensed for pets on short-haul from Gatwick. High minimum rates on long-haul network (introduced 2024) can make direct flights uneconomical for smaller dogs and cats. Some aircraft restrictions on crate size and weight.',
  },
  {
    name: 'Emirates',
    hub: 'Dubai (DXB)',
    destinations: '150+',
    ukDepartures: 'Edinburgh, Glasgow, Manchester, Gatwick, Heathrow',
    snubNosePolicy: 'Fairly long banned list, but snub-nosed allowed in cooler months (below 28°C including transit) with IPATA BOAS assessment — generally Nov–Apr',
    highlights: [
      'All wide-body aircraft (A380s, 777s) — no weight or size restrictions',
      'No minimum charges — extremely popular for flying East',
      'State-of-the-art Dubai pet reception centre with feeding, watering, and exercise',
      'Temperature-controlled vans between aircraft and reception centre',
    ],
    details: 'Popular for Melbourne and New Zealand routes via Dubai (minimum 4-hour transit). All documentation required at least 24 hours before departure — quotes include overnight boarding when we complete travel documents as part of the service.',
  },
  {
    name: 'American Airlines',
    hub: 'London Heathrow (LHR)',
    destinations: '9 direct US cities + 50+ via US hub network',
    ukDepartures: 'London Heathrow',
    snubNosePolicy: 'Does not accept snub-nosed pets — extensive list of 40 banned breeds (cats and dogs)',
    highlights: [
      'Direct flights to JFK, DFW, LAX, ORD, BOS, RDU, PHX, CLT',
      'All wide-body aircraft — no weight or size restrictions',
      'Hub and spoke in USA — overnight boarding then onward to 50+ domestic destinations',
      'Heathrow Pet Departure Lounge with overnight boarding and document completion',
    ],
    details: 'Temperature embargoes above 28°C during summer months affect some popular destinations but can be serviced by other carriers. Simplified approach makes AA a fan favourite for UK-to-USA pet travel.',
  },
  {
    name: 'Lufthansa',
    hub: 'Frankfurt (FRA)',
    destinations: '100+',
    ukDepartures: 'London Heathrow, Manchester, Edinburgh',
    snubNosePolicy: 'No snub-nosed restrictions — all breeds accepted (bulldogs, pugs, etc.)',
    highlights: [
      'All breeds welcome — extremely popular for snub-nosed pets',
      'Renowned pet reception centre at Frankfurt with vet inspection',
      'Premium pet service available — photos during transit, feeding/medication program, larger kennel',
      'Favourable shipping rates with few height/weight restrictions',
    ],
    details: 'Almost all pets transit via Frankfurt and enter the EU, so EU pet travel criteria must be met (rabies vaccine 21+ days before, EU transit papers) in addition to destination requirements. Temperature restrictions above 28°C for sustained periods — planning ahead advisable.',
  },
  {
    name: 'Qatar Airways',
    hub: 'Doha (DOH)',
    destinations: '150+',
    ukDepartures: 'London, Manchester, Gatwick, Edinburgh, Glasgow',
    snubNosePolicy: 'Embargo on many snub-nosed dogs, but accepts powerful breeds (Mastiffs, Dobermans, Chow Chows) in reinforced crates',
    highlights: [
      'Multiple daily departures from major UK airports',
      'Newly rebuilt Doha reception centre — top care during minimum 3-hour transit',
      'Photos during transit available on request',
      'Temperature-controlled vans specially adapted for pet transport',
      'Documents needed at check-in only (no day-before requirement)',
    ],
    details: 'Fantastic safety record with various awards for pet transportation. Some minimum rates on popular far-eastern destinations can make other carriers preferred for those routes. Accepts powerful dog breeds in special reinforced crates that other carriers may refuse.',
  },
  {
    name: 'KLM',
    hub: 'Amsterdam (AMS)',
    destinations: '100+',
    ukDepartures: 'London Heathrow, Manchester, Edinburgh',
    snubNosePolicy: 'Few banned breeds for cargo via approved IPATA agent — accepts snub-nosed with BOAS assessment when temperatures below 28°C',
    highlights: [
      'Favourable shipping rates and low minimum rates',
      'Few snub-nosed restrictions via IPATA-approved agents',
      'EU transit requires rabies vaccine 21+ days before and EU pet travel documents',
    ],
    details: 'Operates narrow-body B737s on initial UK sectors which have some height restrictions for larger dogs. Fleet update to A320s expected in 2025 may remove these restrictions. EU transit regulations apply as pets are processed through Amsterdam.',
  },
  {
    name: 'Cathay Pacific',
    hub: 'Hong Kong (HKG)',
    destinations: '—',
    ukDepartures: '—',
    snubNosePolicy: '—',
    highlights: [],
    details: '',
    comingSoon: true,
  },
  {
    name: 'SriLankan Airlines',
    hub: 'Colombo (CMB)',
    destinations: '—',
    ukDepartures: '—',
    snubNosePolicy: '—',
    highlights: [],
    details: '',
    comingSoon: true,
  },
  {
    name: 'Thai Airways',
    hub: 'Bangkok (BKK)',
    destinations: '—',
    ukDepartures: '—',
    snubNosePolicy: '—',
    highlights: [],
    details: '',
    comingSoon: true,
  },
  {
    name: 'Turkish Airlines',
    hub: 'Istanbul (IST)',
    destinations: '—',
    ukDepartures: '—',
    snubNosePolicy: '—',
    highlights: [],
    details: '',
    comingSoon: true,
  },
];

// ─── Component ───────────────────────────────────────────────────────

export default function AirlinesScreen() {
  const { state } = useAppState();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Airlines & partners</Text>
        </View>

        <Text style={styles.intro}>
          We partner with the best to offer the most comfortable, reliable and safest service possible for you and your pet.
        </Text>

        {/* Hero illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={DogImage}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel="Dog with airplane illustration"
          />
        </View>

        <Text style={styles.body}>
          We've built strong and lasting relationships with many of the world's leading airlines over the past 25 years. We understand that every journey is unique, so our agents will find the best airline and route considering your pet's type, breed, size, and destination.
        </Text>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Our agents have extensive knowledge of livestock cargo operations across all major airlines and interact with them daily. Transparency is a core principle — we share this knowledge to help you select the ideal carrier.
            </Text>
          </View>
        </Card>

        {/* Airline profiles */}
        <Text style={styles.sectionTitle}>Airline partners</Text>

        {AIRLINES.map((airline) => (
          <AirlineCard key={airline.name} airline={airline} />
        ))}

        {/* Road transport */}
        <Text style={styles.sectionTitle}>Local collection & delivery</Text>
        <Card style={styles.transportCard}>
          <View style={styles.transportHeader}>
            <View style={styles.transportIcon}>
              <Ionicons name="car-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.transportTitle}>Door-to-door service</Text>
          </View>
          <Text style={styles.transportDesc}>
            We can collect your pet on the day of (or the day before) the flight, either heading straight to check-in or providing overnight boarding depending on the services you request. We work with trusted pet transport specialists in the UK and abroad — all vehicles are DEFRA-registered, air-conditioned vans.
          </Text>
        </Card>

        {/* CTA */}
        {!state.hasBooking && (
          <Button title="Ready? Get a quote" onPress={() => router.push('/quote')} variant="primary" style={{ marginTop: 24 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Airline Card ────────────────────────────────────────────────────

function AirlineCard({ airline }: { airline: AirlineProfile }) {
  const [expanded, setExpanded] = useState(false);

  if (airline.comingSoon) {
    return (
      <View style={styles.airlineCardDisabled}>
        <View style={styles.airlineHeader}>
          <View style={styles.airlineIcon}>
            <Ionicons name="airplane" size={18} color={colors.textDisabled} />
          </View>
          <View style={styles.airlineHeaderContent}>
            <Text style={styles.airlineNameDisabled}>{airline.name}</Text>
            <Text style={styles.comingSoonBadge}>Profile coming soon</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.airlineCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
    >
      <View style={styles.airlineHeader}>
        <View style={styles.airlineIcon}>
          <Ionicons name="airplane" size={18} color={colors.primary} />
        </View>
        <View style={styles.airlineHeaderContent}>
          <Text style={styles.airlineName}>{airline.name}</Text>
          <Text style={styles.airlineHub}>Hub: {airline.hub}</Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
      </View>

      {expanded && (
        <View style={styles.airlineDetails}>
          <DetailRow icon="globe-outline" label="Destinations" value={airline.destinations} />
          <DetailRow icon="location-outline" label="UK departures" value={airline.ukDepartures} />
          <DetailRow icon="paw-outline" label="Snub-nosed policy" value={airline.snubNosePolicy} />

          {airline.highlights.length > 0 && (
            <View style={styles.highlightsList}>
              {airline.highlights.map((h, i) => (
                <View key={i} style={styles.highlightRow}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} style={styles.highlightIcon} />
                  <Text style={styles.highlightText}>{h}</Text>
                </View>
              ))}
            </View>
          )}

          {airline.details ? (
            <Text style={styles.airlineNotes}>{airline.details}</Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon as any} size={14} color={colors.textMuted} style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.iconButton },
  title: { ...typography.h2, color: colors.textPrimary },

  intro: { ...typography.body, fontFamily: 'Nunito_600SemiBold', color: colors.textPrimary, lineHeight: 22, marginBottom: 12 },
  imageContainer: { alignItems: 'center', marginBottom: 16 },
  heroImage: { width: 140, height: 130 },
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: 12 },
  sectionTitle: { fontFamily: 'Baloo2_700Bold', fontSize: 17, color: colors.textPrimary, marginTop: 24, marginBottom: 12 },

  infoCard: { padding: 14, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, lineHeight: 20 },

  // Airline cards
  airlineCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 14, marginBottom: 10, ...shadows.cardLight,
  },
  airlineCardDisabled: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 14, marginBottom: 10, opacity: 0.6,
  },
  airlineHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  airlineIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  airlineHeaderContent: { flex: 1 },
  airlineName: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  airlineNameDisabled: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textDisabled },
  airlineHub: { ...typography.tiny, color: colors.textSecondary, marginTop: 1 },
  comingSoonBadge: { ...typography.tiny, color: colors.textMuted, fontStyle: 'italic', marginTop: 1 },

  airlineDetails: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  detailIcon: { marginTop: 3 },
  detailLabel: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  detailValue: { ...typography.tiny, color: colors.textPrimary, flex: 1 },

  highlightsList: { gap: 6, marginTop: 10, marginBottom: 8 },
  highlightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  highlightIcon: { marginTop: 3 },
  highlightText: { ...typography.bodySmall, color: colors.textPrimary, flex: 1, lineHeight: 19 },

  airlineNotes: { ...typography.tiny, color: colors.textMuted, lineHeight: 17, marginTop: 8, fontStyle: 'italic' },

  // Transport
  transportCard: { padding: 16 },
  transportHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  transportIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  transportTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  transportDesc: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
});
