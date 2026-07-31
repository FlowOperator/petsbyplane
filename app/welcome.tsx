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
    body: "4th-generation animal transport experts. We've been flying pets since before most airlines existed.",
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

        {/* Content */}
        <View style={styles.slideArea}>
          <View style={styles.iconBadge}>
            <Ionicons name={current.icon} size={48} color={colors.primary} />
          </View>
          <Text style={styles.slideTitle}>{current.title}</Text>
          <Text style={styles.slideBody}>{current.body}</Text>
        </View>

        {/* Bottom */}
        <View style={styles.bottomArea}>
          {/* Dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === slide && styles.dotActive]} />
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.ctaBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.ctaText}>{isLast ? 'Get started' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: layout.screenPaddingHorizontal },
  skipBtn: { alignSelf: 'flex-end', paddingVertical: 12, marginTop: 8 },
  skipText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },

  slideArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  iconBadge: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },
  slideTitle: {
    fontFamily: 'Baloo2_700Bold', fontSize: 22, color: colors.textPrimary,
    textAlign: 'center', lineHeight: 30,
  },
  slideBody: {
    ...typography.bodySmall, color: colors.textSecondary,
    textAlign: 'center', marginTop: 12, lineHeight: 20,
    maxWidth: 280,
  },

  bottomArea: { paddingBottom: 20, gap: 16 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E4DFD4' },
  dotActive: { backgroundColor: colors.primary, width: 24 },

  ctaBtn: {
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 16, alignItems: 'center', ...shadows.button,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },
});
