import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows } from '../theme';

interface TrustBadgeProps {
  /** Compact mode for inline use (e.g. in headers) */
  compact?: boolean;
  /** Number of reviews — fetched dynamically or passed in */
  reviewCount?: number;
  /** Star rating out of 5 */
  rating?: number;
}

const TRUST_URL = 'https://www.trustindex.io/reviews/www.petsbyplane.com';

/**
 * Trustindex review badge — links to the live review page.
 * Shows: EXCELLENT ★★★★★ {count} reviews ✓ Trustindex
 */
export function TrustBadge({ compact = false, reviewCount, rating = 5 }: TrustBadgeProps) {
  const handlePress = () => {
    Linking.openURL(TRUST_URL);
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="link"
        accessibilityLabel={`Rated excellent on Trustindex${reviewCount ? `, ${reviewCount} reviews` : ''}`}
      >
        <Text style={styles.compactStars}>{'★'.repeat(Math.round(rating))}</Text>
        {reviewCount != null && <Text style={styles.compactCount}>{reviewCount}</Text>}
        <View style={styles.verifiedDot}>
          <Ionicons name="checkmark-circle" size={12} color="#00B67A" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityRole="link"
      accessibilityLabel={`Rated excellent on Trustindex${reviewCount ? ` with ${reviewCount} reviews` : ''}`}
    >
      <Text style={styles.excellentText}>EXCELLENT</Text>
      <View style={styles.starsRow}>
        {Array.from({ length: Math.round(rating) }).map((_, i) => (
          <Text key={i} style={styles.star}>★</Text>
        ))}
      </View>
      {reviewCount != null && (
        <Text style={styles.reviewCount}>{reviewCount} reviews</Text>
      )}
      <View style={styles.trustindexBrand}>
        <Ionicons name="checkmark-circle" size={16} color="#00B67A" />
        <Text style={styles.trustindexText}>Trustindex</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Full badge
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 10,
    ...shadows.cardLight,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  excellentText: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  star: {
    fontSize: 16,
    color: '#F5A623',
  },
  reviewCount: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  trustindexBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustindexText: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },

  // Compact badge
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
    ...shadows.iconButton,
  },
  compactStars: {
    fontSize: 11,
    color: '#F5A623',
    letterSpacing: -0.5,
  },
  compactCount: {
    ...typography.tiny,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  verifiedDot: {
    marginLeft: 1,
  },
});
