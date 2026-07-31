import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';
import { TrustBadge } from '../src/components/TrustBadge';
import { AccreditationBadges } from '../src/components/AccreditationBadges';
import { useAppState } from '../src/services/store';

// SVG assets — use platform-appropriate rendering
const DogImage = require('../assets/dog.svg');

/**
 * Landing Page — first screen when app is opened.
 * New users: see brand intro → tap to get a quote or sign in.
 * Returning users: would be auto-directed to (tabs) via auth check.
 */
export default function LandingScreen() {
  const { state } = useAppState();

  // Auto-redirect authenticated users to the main app
  useEffect(() => {
    if (state.isAuthenticated && state.activeTrip) {
      router.replace('/(tabs)');
    }
  }, [state.isAuthenticated, state.activeTrip]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo + brand */}
        <View style={styles.brandArea}>
          {/* Hero illustration */}
          <View style={styles.illustrationWrap}>
            <Image
              source={DogImage}
              style={styles.heroIllustration}
              resizeMode="contain"
              accessibilityLabel="Hand-drawn dog with airplane illustration"
            />
          </View>
          <Text style={styles.brandName}>Pets by Plane</Text>
          <Text style={styles.motto}>"We Care in the Air"</Text>
        </View>

        {/* Hero text */}
        <View style={styles.heroArea}>
          <Text style={styles.heroTitle}>
            Fly your pet{'\n'}anywhere in the world
          </Text>
          <Text style={styles.heroSubtitle}>
            Expert-led pet relocation with a dedicated consultant guiding
            every step. Visible, trackable, stress-free.
          </Text>
        </View>

        {/* Trust badges */}
        <AccreditationBadges layout="row" />

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>25+</Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5,000+</Text>
            <Text style={styles.statLabel}>Pets flown</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>150+</Text>
            <Text style={styles.statLabel}>Destinations</Text>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.howSection}>
          <Text style={styles.howTitle}>How it works</Text>
          <View style={styles.howSteps}>
            <HowStep
              number="1"
              icon="chatbubbles-outline"
              title="Get a quote"
              desc="Tell us about your pet and destination"
            />
            <HowStep
              number="2"
              icon="person-outline"
              title="Dedicated consultant"
              desc="A named expert handles everything"
            />
            <HowStep
              number="3"
              icon="location-outline"
              title="Track live"
              desc="Follow your pet's journey in real-time"
            />
          </View>
        </View>

        {/* Trustindex */}
        <View style={styles.trustRow}>
          <TrustBadge />
        </View>
      </ScrollView>

      {/* Bottom CTAs */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/welcome')}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Ionicons name="paw" size={18} color={colors.textPrimary} />
          <Text style={styles.primaryBtnText}>Get started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/auth/signin')}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryBtnText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function HowStep({ number, icon, title, desc }: {
  number: string; icon: keyof typeof Ionicons.glyphMap; title: string; desc: string;
}) {
  return (
    <View style={styles.howStep}>
      <View style={styles.howStepNumber}>
        <Text style={styles.howStepNumberText}>{number}</Text>
      </View>
      <View style={styles.howStepIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={styles.howStepTitle}>{title}</Text>
      <Text style={styles.howStepDesc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 20 },

  // Brand
  brandArea: { alignItems: 'center', paddingTop: 30, marginBottom: 20 },
  illustrationWrap: {
    width: 180, height: 200,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  heroIllustration: {
    width: 170, height: 190,
  },
  brandName: {
    fontFamily: 'Baloo2_700Bold', fontSize: 26, color: colors.textPrimary,
  },
  motto: {
    ...typography.bodySmall, fontFamily: 'Nunito_600SemiBold',
    color: colors.textSecondary, fontStyle: 'italic', marginTop: 4,
  },

  // Hero
  heroArea: { alignItems: 'center', marginBottom: 20 },
  heroTitle: {
    fontFamily: 'Baloo2_700Bold', fontSize: 30, lineHeight: 38,
    color: colors.textPrimary, textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.body, color: colors.textSecondary,
    textAlign: 'center', marginTop: 10, lineHeight: 22,
    paddingHorizontal: 10,
  },

  // Stats
  statsStrip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.xl,
    paddingVertical: 16, paddingHorizontal: 12,
    marginTop: 16, ...shadows.cardLight,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 30, backgroundColor: colors.divider },
  statNumber: { fontFamily: 'Baloo2_700Bold', fontSize: 18, color: colors.primary },
  statLabel: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },

  // How it works
  howSection: { marginTop: 28 },
  howTitle: { ...typography.h4, color: colors.textPrimary, textAlign: 'center', marginBottom: 16 },
  howSteps: { gap: 12 },
  howStep: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderRadius: radius.xl,
    padding: 16, ...shadows.cardLight,
    flexWrap: 'wrap',
  },
  howStepNumber: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  howStepNumberText: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.white,
  },
  howStepIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  howStepTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  howStepDesc: { ...typography.tiny, color: colors.textSecondary, flex: 1 },

  // Trust
  trustRow: { alignItems: 'center', marginTop: 20 },

  // Bottom
  bottomArea: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 12, paddingBottom: 20,
    borderTopWidth: 1, borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: colors.secondary,
    borderRadius: radius.pill, paddingVertical: 16,
    ...shadows.button,
  },
  primaryBtnText: { ...typography.button, color: colors.textPrimary },
  secondaryBtn: {
    alignItems: 'center', paddingVertical: 12,
  },
  secondaryBtnText: {
    ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.primary,
  },
});
