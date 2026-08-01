import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Button } from '../../src/components/ui';

/**
 * Quote Pending Screen — waiting for consultant to prepare the quote.
 * Matches design comp: centered messaging, consultant card, simple CTAs.
 */
export default function QuotePendingScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Clock icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="time-outline" size={30} color="#B7801F" />
        </View>

        {/* Main messaging */}
        <Text style={styles.title}>Your quote is on its way</Text>
        <Text style={styles.body}>
          Your consultant is putting together the best route and price for your pet.
          This usually takes less than a working day — we'll let you know the moment it's ready.
        </Text>

        {/* Consultant card */}
        <View style={styles.consultantCard}>
          <View style={styles.consultantAvatar}>
            <Ionicons name="person" size={19} color={colors.primary} />
          </View>
          <View style={styles.consultantInfo}>
            <Text style={styles.consultantName}>Sarah Whitfield</Text>
            <Text style={styles.consultantStatus}>Preparing your quote now</Text>
          </View>
        </View>

        {/* Change link */}
        <TouchableOpacity onPress={() => router.push('/guides/contact')}>
          <Text style={styles.changeLink}>Need to change something? Get in touch</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomArea}>
        {/* Demo shortcut for testing — remove in production */}
        <TouchableOpacity
          style={styles.demoBtn}
          onPress={() => router.push('/quote/booking')}
        >
          <Text style={styles.demoBtnText}>Demo: View quote now →</Text>
        </TouchableOpacity>

        <Button
          title="Back to Home"
          onPress={() => router.replace('/(tabs)')}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239, 194, 108, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontFamily: 'Baloo2_700Bold',
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 280,
  },
  consultantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 16,
    width: '100%',
    marginTop: 22,
    ...shadows.cardLight,
  },
  consultantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultantInfo: { flex: 1 },
  consultantName: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  consultantStatus: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  changeLink: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.primary,
    marginTop: 16,
  },
  bottomArea: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: 16,
    paddingBottom: 30,
    gap: 10,
  },
  demoBtn: {
    backgroundColor: 'rgba(232, 98, 61, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(232, 98, 61, 0.3)',
    borderRadius: radius.pill,
    paddingVertical: 13,
    alignItems: 'center',
  },
  demoBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: colors.primary,
  },
});
