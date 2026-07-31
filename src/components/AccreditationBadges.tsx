import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows } from '../theme';

interface AccreditationBadgesProps {
  /** Show in compact row (default) or expanded grid */
  layout?: 'row' | 'grid';
}

const BADGES = [
  { id: 'ipata', label: 'IPATA', sublabel: 'Member', icon: 'globe' as const },
  { id: 'iata', label: 'IATA', sublabel: 'Compliant', icon: 'airplane' as const },
  { id: 'defra', label: 'DEFRA', sublabel: 'Registered', icon: 'shield-checkmark' as const },
];

/**
 * Trust/accreditation badges — IPATA, IATA, DEFRA.
 * Spec says these should appear on onboarding, quote screen, and about/help.
 */
export function AccreditationBadges({ layout: badgeLayout = 'row' }: AccreditationBadgesProps) {
  if (badgeLayout === 'grid') {
    return (
      <View style={styles.grid}>
        {BADGES.map((badge) => (
          <View key={badge.id} style={styles.gridItem}>
            <View style={styles.badgeIcon}>
              <Ionicons name={badge.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.badgeLabel}>{badge.label}</Text>
            <Text style={styles.badgeSublabel}>{badge.sublabel}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {BADGES.map((badge, i) => (
        <React.Fragment key={badge.id}>
          <View style={styles.rowItem}>
            <Ionicons name={badge.icon} size={14} color={colors.success} />
            <Text style={styles.rowLabel}>{badge.label}</Text>
          </View>
          {i < BADGES.length - 1 && <View style={styles.rowSeparator} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // Row layout (compact)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowLabel: {
    ...typography.tiny,
    fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary,
  },
  rowSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },

  // Grid layout (expanded)
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeLabel: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  badgeSublabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
