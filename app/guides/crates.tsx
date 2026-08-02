import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';

const DogImage = require('../../assets/dog.svg');

const FIELD_COLORS = ['#E8623D', '#2B3A67', '#7B5EA7', '#4C8B6B'] as const;

const MEASUREMENTS = [
  { label: 'A', description: 'Length from your pet\'s nose to base of their tail (not including the tail).' },
  { label: 'B', description: 'Height from ground to their elbow joint.' },
  { label: 'C', description: 'Width across widest section (usually across the shoulders).' },
  { label: 'D', description: 'Height of the animal in a natural standing position, from the floor to the top of its head or tip of the ears (whichever is higher).' },
];

const ACCLIMATION_TIPS = [
  'Leave their travel crate in a place where your dog or cat can explore it and place things they like inside, such as a favourite toy, blanket or treat.',
  'For the first few days tie the door open so your pet can go in and out as it pleases.',
  'Once your pet starts resting in their crate, begin to shut the door and let them have a short nap! Just close it for a few minutes to start with, then increase the length of time gradually.',
  'Finally, if you have the space, start taking your pet on car journeys whilst in the crate with just bedding.',
  'For dogs, it\'s a good idea to go to places it loves, such as the park, so it can see that travelling in the crate leads to fun things. When you return home, give your pet a treat and some fuss as a reward.',
];

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'What travel crate will my pet travel in?',
    a: 'We provide both wooden and plastic crates depending on your pet\'s size, journey and breed. When we provide a quote, we will clearly show what crate we have proposed, including the measurements, which will have taken into account all the relevant factors.',
  },
  {
    q: 'Can I use my own crate?',
    a: 'If you already own an IATA-compliant travel crate, we\'ll gladly reuse it. However, IATA Live Animal Regulations and airline-specific policies can change over time. A crate that was acceptable a few years ago may no longer comply. We suggest sending photos of your crate so we can check it won\'t be rejected at check-in. We can also modify crates to ensure they are compliant.',
  },
  {
    q: 'How big will my pet\'s crate be?',
    a: 'Using your pet\'s measurements, we use an internationally approved formula to calculate the correct-sized travel crate. This ensures it meets strict regulations so your pet travels safely and comfortably. This is why we request accurate measurements as early as possible (dogs only) as it determines airline costs based on crate volume.',
  },
  {
    q: 'Do you deliver beforehand?',
    a: 'Yes, we can deliver the crate in advance — for longer journeys this is recommended so your pet can get used to the crate before travel.',
  },
  {
    q: 'Do I keep my crate?',
    a: 'All crates we provide are yours to keep! They will need to be collected at the destination. Should you not wish to keep your crate, let us know and we\'ll try to arrange for it to be re-used and recycled at your destination.',
  },
  {
    q: 'What does the crate come with?',
    a: 'All crates come airline and IATA approved with suitable bedding, water bowls and funnels ready for your pet\'s travel. When the crates leave our factory, the bedding is sprayed with natural pheromones which mimic that of mother animals and help promote calm.',
  },
  {
    q: 'Can I put anything in the crate?',
    a: 'A blanket, pillow or bedding is fine, but anything seen as a choke hazard (toys, chewable items) is strictly not permitted. Cameras or tracking devices are also strictly forbidden. The crate will be x-rayed at check-in — any forbidden items will need to be removed, which may delay your pet\'s flight and incur additional costs.',
  },
  {
    q: 'My pet is nervous — what can I do?',
    a: 'For nervous pets we recommend receiving the crate around 1 month beforehand and building up their confidence going in and out. The bedding is sprayed with natural pheromones to promote calm. See our specific guidance on crate acclimatisation above.',
  },
];

export default function CratesScreen() {
  const { state } = useAppState();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Travel crates</Text>
        </View>

        <Text style={styles.intro}>
          One of the most critical aspects of pet travel is your travel crate. It serves as your pet's home away from home during their journey through the skies.
        </Text>
        <Text style={styles.body}>
          To ensure your pet travels in comfort, the crate must be the correct size. Your pet should be able to lie down, stand up, and turn around comfortably, reducing stress and promoting a safe travel experience.
        </Text>
        <Text style={styles.body}>
          We offer both high-quality plastic crates and custom-built wooden crates, tailored to suit your pet and the specific requirements of their journey. All crates fully comply with IATA Live Animal Regulations and airline-specific requirements.
        </Text>

        {/* Crate Types */}
        <Text style={styles.sectionTitle}>Crate types</Text>

        <Card style={styles.crateCard}>
          <View style={styles.crateHeader}>
            <View style={styles.crateIconCircle}>
              <Ionicons name="construct-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.crateType}>Wooden crates</Text>
          </View>
          <Text style={styles.crateDesc}>
            Built to exact dimensions, ensuring a perfect fit and minimising excess volume — important when airline charges are based on crate size. Incredibly sturdy, withstanding the rigours of long-distance travel. Often preferred (and sometimes required by airlines) for heavier or more powerful animals. Solid construction helps reduce stress by limiting external noise and visual stimuli.
          </Text>
        </Card>

        <Card style={styles.crateCard}>
          <View style={styles.crateHeader}>
            <View style={styles.crateIconCircle}>
              <Ionicons name="cube-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.crateType}>Plastic crates</Text>
          </View>
          <Text style={styles.crateDesc}>
            Durable, lightweight, and easy to clean. Solid walls with secure ventilation openings keep pets safe and comfortable. Available in a wide range of sizes. However, they may be slightly oversized — on longer routes, as cargo rates are calculated based on volume, an oversized crate can significantly increase transport costs.
          </Text>
        </Card>

        {/* How to measure */}
        <Text style={styles.sectionTitle}>How to measure your dog</Text>

        <View style={styles.imageContainer}>
          <Image
            source={DogImage}
            style={styles.dogImage}
            resizeMode="contain"
            accessibilityLabel="Dog illustration"
          />
        </View>

        <Text style={styles.body}>
          We'll ask for these measurements when you complete a quote.
        </Text>

        <View style={styles.measurementsList}>
          {MEASUREMENTS.map((m, i) => (
            <View key={m.label} style={styles.measurementRow}>
              <View style={[styles.measurementBadge, { backgroundColor: FIELD_COLORS[i] }]}>
                <Text style={styles.measurementBadgeText}>{m.label}</Text>
              </View>
              <Text style={styles.measurementDesc}>{m.description}</Text>
            </View>
          ))}
        </View>

        {/* Acclimatisation */}
        <Text style={styles.sectionTitle}>Crate acclimatisation</Text>
        <Text style={styles.body}>
          When you book with Pets by Plane, we can deliver your pet's travel crate well in advance of the flight. This gives your pet time to get comfortable — especially helpful for nervous pets or distant destinations where they'll be in the crate for an extended period.
        </Text>

        <View style={styles.tipsList}>
          {ACCLIMATION_TIPS.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} style={styles.tipIcon} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>FAQ</Text>
        <Card style={styles.faqCard}>
          {FAQS.map((faq, i) => (
            <FAQRow key={i} q={faq.q} a={faq.a} isLast={i === FAQS.length - 1} />
          ))}
        </Card>

        {/* CTA */}
        {!state.hasBooking && (
          <Button title="Ready? Get a quote" onPress={() => router.push('/quote')} variant="primary" style={{ marginTop: 24 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FAQRow({ q, a, isLast }: { q: string; a: string; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.faqItem, !isLast && styles.faqItemBorder]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{q}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
      </View>
      {expanded && <Text style={styles.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.iconButton },
  title: { ...typography.h2, color: colors.textPrimary },

  intro: { ...typography.body, fontFamily: 'Nunito_600SemiBold', color: colors.textPrimary, lineHeight: 22, marginBottom: 12 },
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: 12 },
  sectionTitle: { fontFamily: 'Baloo2_700Bold', fontSize: 17, color: colors.textPrimary, marginTop: 24, marginBottom: 12 },

  // Crate types
  crateCard: { padding: 16, marginBottom: 10 },
  crateHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  crateIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  crateType: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  crateDesc: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },

  // Measurements
  imageContainer: { alignItems: 'center', marginBottom: 16 },
  dogImage: { width: 160, height: 140 },
  measurementsList: { gap: 14, marginBottom: 8 },
  measurementRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  measurementBadge: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  measurementBadgeText: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: colors.white },
  measurementDesc: { ...typography.body, color: colors.textPrimary, flex: 1, lineHeight: 21 },

  // Acclimatisation
  tipsList: { gap: 10, marginTop: 4 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipIcon: { marginTop: 3 },
  tipText: { ...typography.bodySmall, color: colors.textPrimary, flex: 1, lineHeight: 20 },

  // FAQ
  faqCard: { padding: 0 },
  faqItem: { paddingVertical: 14, paddingHorizontal: 16 },
  faqItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  faqQ: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, flex: 1 },
  faqA: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20, marginTop: 8 },
});
