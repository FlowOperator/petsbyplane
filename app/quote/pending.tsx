import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';

/**
 * Quote Pending Screen — waiting for consultant to prepare the quote.
 * V1: no live pricing. The consultant builds the quote offline and
 * the user gets a notification when it's ready.
 */
export default function QuotePendingScreen() {
  // In production, this would poll/listen for the quote being ready.
  // For demo, we'll have a button to simulate the notification.
  const handleSimulateReady = () => {
    router.push('/quote/booking');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="time-outline" size={40} color={colors.secondary} />
        </View>

        {/* Messaging */}
        <Text style={styles.title}>We're preparing your quote</Text>
        <Text style={styles.body}>
          Your dedicated consultant is reviewing your pet's breed, size, and
          destination to find the safest, best-value route. We'll notify you
          as soon as your personalised quote is ready.
        </Text>

        {/* Timeframe */}
        <Card style={styles.timeCard}>
          <View style={styles.timeRow}>
            <Ionicons name="notifications-outline" size={18} color={colors.primary} />
            <View style={styles.timeContent}>
              <Text style={styles.timeTitle}>Usually within 24 hours</Text>
              <Text style={styles.timeSubtitle}>
                We'll send you a notification — check your inbox or come back here
              </Text>
            </View>
          </View>
        </Card>

        {/* What happens next */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsTitle}>What happens next</Text>
          <StepRow number="1" text="We check airline availability for your route" />
          <StepRow number="2" text="We confirm breed/size restrictions are met" />
          <StepRow number="3" text="You receive your personalised quote with pricing" />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Go to Home"
            onPress={() => router.replace('/(tabs)')}
            variant="primary"
          />
          <TouchableOpacity
            style={styles.browseLink}
            onPress={() => router.push('/guides')}
          >
            <Text style={styles.browseLinkText}>Browse travel guides while you wait →</Text>
          </TouchableOpacity>
        </View>

        {/* Demo shortcut — remove in production */}
        <TouchableOpacity style={styles.demoBtn} onPress={handleSimulateReady}>
          <Text style={styles.demoBtnText}>Demo: Simulate quote ready →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function StepRow({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepCircle}>
        <Text style={styles.stepNumber}>{number}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 48,
    alignItems: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(239, 194, 108, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  timeCard: { width: '100%', padding: 16, marginBottom: 24 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timeContent: { flex: 1 },
  timeTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  timeSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },

  stepsSection: { width: '100%', marginBottom: 28 },
  stepsTitle: { ...typography.h5, color: colors.textPrimary, marginBottom: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  stepCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumber: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.primary },
  stepText: { ...typography.body, color: colors.textPrimary, flex: 1 },

  actions: { width: '100%', gap: 12 },
  browseLink: { alignItems: 'center', paddingVertical: 8 },
  browseLinkText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.primary },

  demoBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(232, 98, 61, 0.08)',
    borderRadius: radius.pill,
  },
  demoBtnText: { ...typography.tiny, color: colors.primary },
});
