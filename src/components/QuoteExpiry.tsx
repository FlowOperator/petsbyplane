import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../theme';

interface QuoteExpiryProps {
  validUntil: string;
  isProvisional: boolean;
}

/**
 * Shows quote validity countdown and provisional pricing warning.
 * Section 6.7: quotes valid 28 days, pricing provisional until airline confirms.
 */
export function QuoteExpiry({ validUntil, isProvisional }: QuoteExpiryProps) {
  const expiry = new Date(validUntil);
  const now = new Date();
  const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;
  const isUrgent = daysLeft > 0 && daysLeft <= 5;

  return (
    <View style={styles.container}>
      {/* Expiry countdown */}
      <View style={[
        styles.expiryRow,
        isExpired && styles.expiryExpired,
        isUrgent && styles.expiryUrgent,
      ]}>
        <Ionicons
          name={isExpired ? 'alert-circle' : 'time-outline'}
          size={16}
          color={isExpired ? colors.primary : isUrgent ? colors.warning : colors.textSecondary}
        />
        <Text style={[
          styles.expiryText,
          isExpired && styles.expiryTextExpired,
          isUrgent && styles.expiryTextUrgent,
        ]}>
          {isExpired
            ? 'This quote has expired. Please request a new one.'
            : `Quote valid for ${daysLeft} more day${daysLeft !== 1 ? 's' : ''} (expires ${expiry.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})`}
        </Text>
      </View>

      {/* Provisional pricing warning */}
      {isProvisional && !isExpired && (
        <View style={styles.provisionalRow}>
          <Ionicons name="information-circle-outline" size={14} color={colors.secondaryDark} />
          <Text style={styles.provisionalText}>
            Price is estimated until the airline confirms. Final price may be adjusted up to 14 days before departure.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  expiryRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.background, borderRadius: radius.md,
    paddingVertical: 10, paddingHorizontal: 12,
  },
  expiryExpired: { backgroundColor: 'rgba(232,98,61,0.1)' },
  expiryUrgent: { backgroundColor: colors.secondarySubtle },
  expiryText: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  expiryTextExpired: { color: colors.primary, fontFamily: 'Nunito_700Bold' },
  expiryTextUrgent: { color: colors.warning, fontFamily: 'Nunito_600SemiBold' },
  provisionalRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    paddingHorizontal: 4,
  },
  provisionalText: { ...typography.tiny, color: colors.secondaryDark, flex: 1, lineHeight: 16 },
});
