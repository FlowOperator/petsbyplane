import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';

interface GuideItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const GUIDES: GuideItem[] = [
  {
    id: 'country-rules',
    title: 'Country rules',
    description: 'Import requirements by destination',
    icon: 'globe-outline',
    route: '/guides/country-rules',
  },
  {
    id: 'import-process',
    title: 'Import to UK',
    description: 'How the ARC process works',
    icon: 'airplane-outline',
    route: '/guides/import-process',
  },
  {
    id: 'crates',
    title: 'Travel crates',
    description: 'Types, sizing & acclimatisation',
    icon: 'cube-outline',
    route: '/guides/crates',
  },
  {
    id: 'vaccinations',
    title: 'Vaccinations & tests',
    description: 'What your pet needs and when',
    icon: 'medkit-outline',
    route: '/guides/vaccinations',
  },
  {
    id: 'airlines',
    title: 'Airlines & partners',
    description: 'Who we fly with and why',
    icon: 'business-outline',
    route: '/guides/airlines',
  },
  {
    id: 'contact',
    title: 'Get in touch',
    description: 'Questions? We\'re here to help',
    icon: 'chatbubble-ellipses-outline',
    route: '/guides/contact',
  },
];

/**
 * Travel Guides Hub — persistent content accessible in both booking states.
 */
export default function GuidesHubScreen() {
  const { state } = useAppState();
  const { hasBooking } = state;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Travel guides</Text>
        </View>

        <Text style={styles.subtitle}>
          Everything you need to know about flying your pet — from vaccinations to crates to country-specific rules.
        </Text>

        {/* Guide cards */}
        <View style={styles.guideList}>
          {GUIDES.map((guide) => (
            <TouchableOpacity
              key={guide.id}
              style={styles.guideCard}
              onPress={() => router.push(guide.route as any)}
              activeOpacity={0.85}
            >
              <View style={styles.guideIcon}>
                <Ionicons name={guide.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.guideInfo}>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideDesc}>{guide.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quote CTA — only when no booking */}
        {!hasBooking && (
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to fly your pet?</Text>
            <Button
              title="Get a quote"
              onPress={() => router.push('/quote')}
              variant="primary"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingTop: 20, paddingBottom: 8,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: {
    ...typography.body, color: colors.textSecondary,
    lineHeight: 22, marginBottom: 20,
  },

  guideList: { gap: 10 },
  guideCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.white, borderRadius: radius.xl,
    padding: 16, ...shadows.cardLight,
  },
  guideIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  guideInfo: { flex: 1 },
  guideTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  guideDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },

  ctaSection: { marginTop: 28, alignItems: 'center', gap: 12 },
  ctaTitle: { ...typography.h5, color: colors.textPrimary },
});
