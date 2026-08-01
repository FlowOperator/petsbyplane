import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { colors, typography, radius } from '../src/theme';

const DogImage = require('../assets/dog.svg');

const SLIDES = [
  {
    title: 'Family-run,\nsince day one',
    body: "We've relocated thousands of pets worldwide, treating every animal like our own.",
  },
  {
    title: 'We handle\nevery detail',
    body: 'Flights, paperwork, crates and customs — all coordinated by your dedicated consultant.',
  },
  {
    title: 'Track the\nwhole journey',
    body: "See exactly where your pet is and what's next, right up to the moment you're reunited.",
  },
];

/**
 * Welcome Screen — 3-slide carousel with dark full-bleed background.
 * Primary CTA goes to quote form. Skip also goes to quote form.
 * Sign in for returning users.
 */
export default function WelcomeScreen() {
  const [slide, setSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % 3);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const current = SLIDES[slide];

  return (
    <View style={styles.container}>
      {/* Hero image area */}
      <View style={styles.heroArea}>
        <Image
          source={DogImage}
          style={styles.heroImage}
          resizeMode="contain"
          accessibilityLabel="Hand-drawn dog illustration"
        />
      </View>

      {/* Gradient overlay */}
      <View style={styles.gradientOverlay} />

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => router.push('/quote')}
        accessibilityRole="button"
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slide content */}
      <View style={styles.slideArea}>
        <Text style={styles.slideTitle}>{current.title}</Text>
        <Text style={styles.slideBody}>{current.body}</Text>
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSlide(i)}
            style={[styles.dot, i === slide && styles.dotActive]}
          />
        ))}
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/quote')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Get a free quote</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInBtn}
          onPress={() => router.push('/auth/signin')}
          activeOpacity={0.85}
        >
          <Text style={styles.signInBtnText}>Sign in</Text>
        </TouchableOpacity>

        <Text style={styles.createText}>
          New here?{' '}
          <Text style={styles.createLink} onPress={() => router.push('/auth/signup')}>
            Create an account
          </Text>
        </Text>

        <Text style={styles.legalText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E2822',
  },

  // Hero
  heroArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 200,
    height: 240,
    opacity: 0.85,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    // Simulate gradient with a semi-transparent overlay at the bottom
    borderBottomWidth: 0,
  },

  // Skip
  skipBtn: {
    position: 'absolute',
    top: 50,
    right: 22,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    color: '#F1EEE7',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },

  // Slide content
  slideArea: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 250,
  },
  slideTitle: {
    color: '#FFFFFF',
    fontFamily: 'Baloo2_700Bold',
    fontSize: 26,
    lineHeight: 32,
  },
  slideBody: {
    color: 'rgba(241, 238, 231, 0.85)',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 10,
    lineHeight: 22,
  },

  // Dots
  dotsRow: {
    position: 'absolute',
    left: 24,
    bottom: 225,
    flexDirection: 'row',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(241, 238, 231, 0.35)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#EFC26C',
  },

  // Bottom
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingBottom: 34,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#EFC26C',
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#2E2822',
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
  },
  signInBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(241, 238, 231, 0.4)',
    backgroundColor: 'rgba(241, 238, 231, 0.1)',
    borderRadius: radius.pill,
    paddingVertical: 13,
    alignItems: 'center',
  },
  signInBtnText: {
    color: '#F1EEE7',
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
  },
  createText: {
    textAlign: 'center',
    color: 'rgba(241, 238, 231, 0.7)',
    fontSize: 12.5,
    fontFamily: 'Nunito_400Regular',
  },
  createLink: {
    color: '#EFC26C',
    fontFamily: 'Nunito_700Bold',
  },
  legalText: {
    textAlign: 'center',
    color: 'rgba(241, 238, 231, 0.55)',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
});
