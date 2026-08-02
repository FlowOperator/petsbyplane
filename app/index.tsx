import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, typography, radius, shadows, layout } from '../src/theme';
import { TrustBadge } from '../src/components/TrustBadge';

const CatImage = require('../assets/cat.svg');
const DogImage = require('../assets/dog.svg');

const IMAGES = [
  { source: DogImage, label: 'Hand-drawn dog with airplane illustration' },
  { source: CatImage, label: 'Hand-drawn cat with airplane illustration' },
];

/**
 * Landing Page — light, airy design with illustration focus.
 * Cream/off-white background, bold headline, hand-drawn illustration, CTAs.
 * Image flips between dog and cat every 4 seconds.
 */
export default function LandingScreen() {
  const [imageIndex, setImageIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const imageSize = isWeb ? Math.min(width * 0.35, 220) : 200;

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = IMAGES[imageIndex];
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Trust badge */}
        <View style={styles.trustRow}>
          <TrustBadge />
        </View>

        {/* Illustration — flips between cat and dog */}
        <View style={styles.illustrationArea}>
          <Image
            source={currentImage.source}
            style={{ width: imageSize, height: imageSize * 0.9 }}
            resizeMode="contain"
            accessibilityLabel={currentImage.label}
          />
        </View>

        {/* Hero text */}
        <View style={styles.heroText}>
          <Text style={styles.headline}>
            Worldwide Pet Travel from the UK made simple, safe and stress-free
          </Text>
          <Text style={styles.subtitle}>
            Pet transport to over 150 worldwide destinations by one of the UK's most trusted and experienced pet travel providers.
          </Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaArea}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/quote')}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>Get a free quote</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/auth/signin')}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryBtnText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text style={styles.createAccountText}>
              New here? <Text style={styles.createAccountLink}>Create an account</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text
              style={styles.termsLink}
              onPress={() => Linking.openURL('https://www.petsbyplane.com/terms-and-conditions')}
              accessibilityRole="link"
            >
              Terms
            </Text>
            {' '}and{' '}
            <Text
              style={styles.termsLink}
              onPress={() => Linking.openURL('https://www.petsbyplane.com/privacy-policy')}
              accessibilityRole="link"
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F5F0' },
  container: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 24,
  },

  trustRow: { alignItems: 'flex-start' },

  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  heroText: { paddingBottom: 12 },
  headline: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 26,
    lineHeight: 33,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    maxWidth: 320,
  },

  ctaArea: {
    gap: 12,
    paddingTop: 8,
  },
  primaryBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    ...shadows.button,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  createAccountText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
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
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
