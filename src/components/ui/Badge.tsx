import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, radius, typography } from '../../theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'pet';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'info', style }: BadgeProps) {
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
