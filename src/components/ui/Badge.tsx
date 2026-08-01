import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, radius, typography } from '../../theme';
import { getSpeciesColor } from '../../theme/speciesColors';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'pet';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  /** For 'pet' variant, pass the species to get themed colors */
  species?: string;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'info', species, style }: BadgeProps) {
  // Species-themed badge
  if (variant === 'pet' && species) {
    const speciesColor = getSpeciesColor(species);
    return (
      <View style={[styles.base, { backgroundColor: speciesColor.badge }, style]}>
        <Text style={[styles.text, { color: speciesColor.primary }]}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.base, variantBgStyles[variant], style]}>
      <Text style={[styles.text, variantTextStyles[variant]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.labelSmall,
  },
});

const variantBgStyles: Record<BadgeVariant, ViewStyle> = {
  success: { backgroundColor: colors.successLight },
  warning: { backgroundColor: colors.warningBg },
  error: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 98, 61, 0.4)',
  },
  info: { backgroundColor: colors.primaryMuted },
  pet: { backgroundColor: colors.primaryMuted },
};

const variantTextStyles: Record<BadgeVariant, TextStyle> = {
  success: { color: colors.success },
  warning: { color: colors.warning },
  error: { color: colors.primary },
  info: { color: colors.primary },
  pet: { color: colors.primary },
};
