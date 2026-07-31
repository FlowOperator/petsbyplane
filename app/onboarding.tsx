import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';
import { AccreditationBadges } from '../src/components/AccreditationBadges';
import { TrustBadge } from '../src/components/TrustBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingPage {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const PAGES: OnboardingPage[] = [
  {
    icon: 'paw',
    title: 'Your pet, anywhere\nin the world',
    description: 'Expert-led pet relocation with a dedicated consultant guiding you through every step. No stress, no confusion.',
  },
  {
    icon: 'shield-checkmark',
    title: 'Compliance\nmade simple',
    description: 'Our rules engine calculates every vaccination, test, and document deadline automatically. You just follow the checklist.',
  },
  {
    icon: 'location',
    title: 'Track every\nstep live',
    description: "From collection to reunion — watch your pet's journey in real-time with milestone updates and live map tracking.",
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);

  const isLast = currentPage === PAGES.length - 1;
  const page = PAGES[currentPage];

  const handleNext = () => {
    if (isLast) {
      router.replace('/quote');
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    router.replace('/quote');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Skip button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.contentArea}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name={page.icon} size={48} color={colors.primary} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{page.title}</Text>
          <Text style={styles.description}>{page.description}</Text>
        </View>

        {/* Trust section (visible on first page) */}
        {currentPage === 0 && (
          <View style={styles.trustSection}>
            <AccreditationBadges layout="row" />
            <View style={styles.trustBadgeWrap}>
              <TrustBadge compact />
            </View>
          </View>
        )}

        {/* Bottom area */}
        <View style={styles.bottomArea}>
          {/* Dots */}
          <View style={styles.dotsRow}>
            {PAGES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentPage && styles.dotActive]}
              />
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleNext}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>
              {isLast ? 'Get started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Already have an account */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.replace('/(tabs)')}
            accessibilityRole="link"
          >
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Sign in</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: layout.screenPaddingHorizontal },

  skipButton: {
    alignSelf: 'flex-end', marginTop: 12,
    paddingVertical: 8, paddingHorizontal: 12,
  },
  skipText: {
    ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textSecondary,
  },

  contentArea: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingBottom: 20,
  },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontFamily: 'Baloo2_700Bold', fontSize: 28, lineHeight: 36,
    color: colors.textPrimary, textAlign: 'center', marginBottom: 14,
  },
  description: {
    ...typography.body, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 22, paddingHorizontal: 20,
  },

  trustSection: { alignItems: 'center', marginBottom: 16 },
  trustBadgeWrap: { marginTop: 8 },

  bottomArea: { paddingBottom: 20, gap: 16 },
  dotsRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#E4DFD4',
  },
  dotActive: { backgroundColor: colors.primary, width: 24 },

  ctaButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 16, ...shadows.button,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },

  loginLink: { alignItems: 'center', paddingVertical: 4 },
  loginText: { ...typography.bodySmall, color: colors.textSecondary },
  loginBold: { fontFamily: 'Nunito_700Bold', color: colors.primary },
});
