import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';
import { TabToggle } from '../../src/components/TabToggle';

const DogImage = require('../../assets/dog.svg');
const CatImage = require('../../assets/cat.svg');

// ─── Data ────────────────────────────────────────────────────────────

interface VaccineInfo {
  name: string;
  description: string;
}

const DOG_VACCINES: VaccineInfo[] = [
  {
    name: 'Rabies',
    description: 'Required for entry into almost every country. Not routinely given in the UK, so often a new requirement. After the initial vaccination, most countries require a mandatory waiting period — typically around 21 days, though New Zealand mandates 6 months. Vaccines are generally valid for 1–3 years, but not all countries recognise 3-year formulations.',
  },
  {
    name: 'DHPP (Distemper, Hepatitis, Parvovirus)',
    description: 'A combination vaccine commonly included in routine UK annual vaccinations. Not every country requires it for entry, but many do. For dogs over 12 weeks, a single DHPP vaccination typically offers protection for up to 3 years before a booster is needed.',
  },
  {
    name: 'Leptospirosis',
    description: 'Required by many countries for pet travel. One of the most frequently mis-administered vaccines — to be valid for travel, manufacturer\'s recommendations must be followed: two initial doses exactly 28 days apart, with the annual booster no more than 12 months after the second dose. If missed, the entire course must restart. Your pet may appear up-to-date but still not meet international travel requirements.',
  },
  {
    name: 'Bordetella (Kennel Cough)',
    description: 'Not required for international travel itself, but strongly recommended — particularly for dogs travelling to countries with mandatory quarantine. If your pet will be boarding with us prior to departure, this vaccine is mandatory and must be administered at least 14 days before boarding. Annual boosters required.',
  },
];

const CAT_VACCINES: VaccineInfo[] = [
  {
    name: 'Rabies',
    description: 'Required for entry into almost every country. Not routinely given in the UK. After vaccination, most countries require a mandatory waiting period — typically 21 days, though New Zealand mandates 6 months. Valid for 1–3 years, but not all countries recognise 3-year formulations.',
  },
  {
    name: 'FVRCP (Rhinotracheitis, Calicivirus, Panleukopenia)',
    description: 'Most commonly covered by Nobivac TRIcat. This is a 3-year vaccine for one element only — to keep it valid, DUOcat must be administered no more than 12 months after the initial vaccine. If year 0 is the initial vaccine, years 1 and 2 use DUOcat, then TRIcat in year 3, restarting the cycle. Initial course is always two vaccines, 3–4 weeks apart, followed by the annual booster no later than 12 months.',
  },
  {
    name: 'Feline Leukemia (FeLV)',
    description: 'Protects against cancer and anaemia. Requires an initial dose with a second 3–4 weeks apart, then annual vaccinations thereafter. Can sometimes be combined with FVRCP for multiple coverage, but this depends on other factors and should be discussed with your vet.',
  },
];

interface BloodTestInfo {
  name: string;
  description: string;
}

const BLOOD_TESTS: BloodTestInfo[] = [
  {
    name: 'Rabies Antibody Titre Test (RNATT/FAVN)',
    description: 'One of the most commonly required blood tests. Since rabies poses a serious risk to human health, many countries want proof of immunity beyond just vaccination. Most countries have a mandatory waiting period after a successful result — Australia requires 6 months, New Zealand 3 months. A favourable result of 0.5 IU/ml is required, or your pet would need to be revaccinated and tested again. Start early!',
  },
  {
    name: 'Leptospirosis',
    description: 'For dogs, particularly if travelling to tropical or subtropical countries.',
  },
  {
    name: 'Brucellosis',
    description: 'For dogs, especially if breeding or certain regions are involved.',
  },
  {
    name: 'Leishmaniasis',
    description: 'Common for pets travelling to Mediterranean or Middle Eastern countries.',
  },
  {
    name: 'Ehrlichiosis & Babesiosis',
    description: 'For pets travelling to areas with high tick prevalence.',
  },
  {
    name: 'FeLV & FIV',
    description: 'For cats, depending on the destination country\'s requirements.',
  },
  {
    name: 'General Health Screening (CBC & Biochemistry)',
    description: 'Not always mandatory for export but may be required by some countries or airlines. Assesses overall health including organ function (liver, kidney), red and white blood cell counts, and other essential parameters.',
  },
];

// ─── Component ───────────────────────────────────────────────────────

export default function VaccinationsScreen() {
  const { state } = useAppState();
  const [activeTab, setActiveTab] = useState<'dogs' | 'cats'>('dogs');

  const vaccines = activeTab === 'dogs' ? DOG_VACCINES : CAT_VACCINES;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Vaccines & blood tests</Text>
        </View>

        <Text style={styles.intro}>
          A quick guide to the most requested vaccinations and tests required when transporting your pet from the UK.
        </Text>

        <Text style={styles.body}>
          Pet travel entry requirements differ by country. Some mandate vaccinations, others demand blood tests, and some require a combination of both.
        </Text>

        <Text style={styles.body}>
          If your pet has no vaccinations, it's advisable to begin the process well before your departure date. Delaying the start can lead to complications with your timeline due to the waiting periods between initial vaccine doses.
        </Text>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="medkit-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              As part of our service, we provide a comprehensive schedule tailored to your destination and coordinate with your vet to ensure everything is completed within the necessary time frame.
            </Text>
          </View>
        </Card>

        {/* Vaccinations section */}
        <Text style={styles.sectionTitle}>Vaccinations</Text>
        <Text style={styles.sectionSubtitle}>
          These are the most commonly requested vaccinations for importing a pet.
        </Text>

        {/* Species illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={activeTab === 'dogs' ? DogImage : CatImage}
            style={styles.speciesImage}
            resizeMode="contain"
            accessibilityLabel={activeTab === 'dogs' ? 'Dog illustration' : 'Cat illustration'}
          />
        </View>

        <TabToggle
          tabs={[
            { key: 'dogs', label: 'Dogs' },
            { key: 'cats', label: 'Cats' },
          ]}
          activeKey={activeTab}
          onTabPress={(key) => setActiveTab(key as 'dogs' | 'cats')}
        />

        <View style={styles.vaccineList}>
          {vaccines.map((v, i) => (
            <VaccineCard key={i} name={v.name} description={v.description} />
          ))}
        </View>

        {activeTab === 'cats' && (
          <Text style={styles.catNote}>
            Vaccinations for cats can seem complex — not because of the illnesses they protect against, but because of the various acronyms used by different manufacturers to denote the same diseases.
          </Text>
        )}

        {/* Blood tests section */}
        <Text style={styles.sectionTitle}>Blood & other tests</Text>
        <Text style={styles.body}>
          The number of tests your pet needs varies by destination. Some countries (e.g. the USA) may require only one or two tests, while others (e.g. South Africa) could demand as many as seven.
        </Text>
        <Text style={styles.body}>
          We create a personalised, step-by-step schedule and collaborate closely with your vet to ensure all tests are completed accurately and on time.
        </Text>

        <Card style={styles.labCard}>
          <View style={styles.labRow}>
            <Ionicons name="flask-outline" size={18} color={colors.primary} />
            <Text style={styles.labText}>
              Most UK export blood tests are sent to the Animal and Plant Health Agency (APHA) in Weybridge. Alternative testing methods exist, and some countries accept only specific types.
            </Text>
          </View>
        </Card>

        <View style={styles.testList}>
          {BLOOD_TESTS.map((test, i) => (
            <TestCard key={i} name={test.name} description={test.description} isFirst={i === 0} />
          ))}
        </View>

        {/* CTA */}
        {!state.hasBooking && (
          <Button title="Ready? Get a quote" onPress={() => router.push('/quote')} variant="primary" style={{ marginTop: 24 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function VaccineCard({ name, description }: VaccineInfo) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.vaccineCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
    >
      <View style={styles.vaccineHeader}>
        <View style={styles.vaccineIcon}>
          <Ionicons name="shield-checkmark" size={16} color={colors.success} />
        </View>
        <Text style={styles.vaccineName}>{name}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
      </View>
      {expanded && <Text style={styles.vaccineDesc}>{description}</Text>}
    </TouchableOpacity>
  );
}

function TestCard({ name, description, isFirst }: BloodTestInfo & { isFirst: boolean }) {
  const [expanded, setExpanded] = useState(isFirst); // First one expanded by default

  return (
    <TouchableOpacity
      style={styles.testCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
    >
      <View style={styles.testHeader}>
        <View style={styles.testIcon}>
          <Ionicons name="water" size={16} color={colors.primary} />
        </View>
        <Text style={styles.testName}>{name}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
      </View>
      {expanded && <Text style={styles.testDesc}>{description}</Text>}
    </TouchableOpacity>
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
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: 12 },
  sectionTitle: { fontFamily: 'Baloo2_700Bold', fontSize: 17, color: colors.textPrimary, marginTop: 24, marginBottom: 8 },
  sectionSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 12 },

  imageContainer: { alignItems: 'center', marginBottom: 12 },
  speciesImage: { width: 120, height: 110 },

  infoCard: { padding: 14, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, lineHeight: 20 },

  catNote: { ...typography.bodySmall, fontStyle: 'italic', color: colors.textMuted, marginTop: 8, lineHeight: 19 },

  // Vaccine cards
  vaccineList: { gap: 8, marginTop: 12 },
  vaccineCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 14, ...shadows.cardLight,
  },
  vaccineHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  vaccineIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.successLight, alignItems: 'center', justifyContent: 'center' },
  vaccineName: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, flex: 1 },
  vaccineDesc: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20, marginTop: 10, marginLeft: 38 },

  // Lab info
  labCard: { padding: 14, marginBottom: 12 },
  labRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  labText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, lineHeight: 20 },

  // Test cards
  testList: { gap: 8 },
  testCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 14, ...shadows.cardLight,
  },
  testHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  testIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  testName: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, flex: 1 },
  testDesc: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20, marginTop: 10, marginLeft: 38 },
});
