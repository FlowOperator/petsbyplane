import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows } from '../theme';

/**
 * BEHAVET partnership card — free pre-departure behaviourist consultation.
 * Shows on the Home screen or Journey screen as a value-add.
 */
export function BehavetCard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={18} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Free behaviourist consultation</Text>
          <Text style={styles.partner}>BEHAVET Partnership</Text>
        </View>
      </View>
      <Text style={styles.description}>
        Worried about how your pet will cope with travel? Our partner BEHAVET offers
        a free pre-departure consultation to help prepare anxious pets for their journey.
      </Text>
      <TouchableOpacity
        style={styles.bookButton}
        accessibilityRole="button"
        accessibilityLabel="Book a free consultation with BEHAVET"
      >
        <Text style={styles.bookButtonText}>Book free consultation</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 18,
    ...shadows.cardLight,
    borderWidth: 1,
    borderColor: 'rgba(76,139,107,0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  title: {
    ...typography.body,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  partner: {
    ...typography.tiny,
    color: colors.success,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 1,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    borderRadius: radius.pill,
    paddingVertical: 10,
  },
  bookButtonText: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.primary,
  },
});
