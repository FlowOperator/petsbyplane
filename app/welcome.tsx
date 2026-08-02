import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DogImage = require('../assets/dog.svg');

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    icon: 'heart',
    title: 'Family-run,\nsince day one',
    body: "We've relocated thousands of pets worldwide, treating every animal like our own.",
  },
  {
    icon: 'shield-checkmark',
    title: 'We handle\nevery detail',
    body: 'From vaccinations and blood tests to customs forms and crate delivery — your dedicated consultant manages it all.',
  },
  {
    icon: 'location',
    title: 'Track the\nwhole journey',
    body: "Live milestone updates from collection to reunion. Always know where your pet is and what's happening next.",
  },
];

export default function WelcomeScreen() {
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  const handleNext = () => {
    if (isLast) {
      router.replace('/auth/signup');
    } else {
      setSlide(slide + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Skip */}
        <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/auth/signup')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Illustration */}
        <View style={styles.illustrationArea}>
          <Image
            source={DogImage}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel="Hand-drawn dog with airplane illustration"
          />
        </View>

        {/* Text content */}
        <View style={styles.textArea}>
          <Text style={styles.slideTitle}>{current.title}</Text>
          <Text style={styles.slideBody}>{current.body}</Text>

          {/* Dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === slide && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Bottom CTAs */}
        <View style={styles.bottomArea}>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/quote')} activeOpacity={0.85}>
            <Text style={styles.ctaText}>Get a free quote</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => router.push('/auth/signin')}
            activeOpacity={0.85}
          >
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text style={styles.createAccountText}>
              New here? <Text style={styles.createAccountLink}>Create an account</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our Terms and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F5F0' },
  container: { flex: 1, paddingHorizontal: layout.screenPaddingHorizontal },
  skipBtn: { alignSelf: 'flex-end', paddingVertical: 12, marginTop: 8 },
  skipText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },

  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  heroImage: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_WIDTH * 0.55,
  },

  textArea: {
    paddingBottom: 20,
  },
  slideTitle: {
    fontFamily: 'Baloo2_700Bold', fontSize: 26, color: colors.textPrimary,
    lineHeight: 34,
  },
  slideBody: {
    ...typography.body, color: colors.textSecondary,
    marginTop: 8, lineHeight: 22,
    maxWidth: 320,
  },

  dotsRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  dot: { width: 24, height: 8, borderRadius: 4, backgroundColor: '#E4DFD4' },
  dotActive: { backgroundColor: colors.primary },

  bottomArea: { paddingBottom: 24, gap: 12 },
  ctaBtn: {
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 16, alignItems: 'center', ...shadows.button,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },

  signInBtn: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signInText: { ...typography.button, color: colors.textPrimary },

  createAccountText: {
    ...typography.bodySmall, color: colors.textSecondary,
    textAlign: 'center', marginTop: 4,
  },
  createAccountLink: {
    color: colors.primary,
    fontFamily: 'Nunito_700Bold',
  },
  termsText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 11,
    marginTop: 4,
  },
});
