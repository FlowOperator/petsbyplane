import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme';

interface BackButtonProps {
  /** Override default back behavior */
  onPress?: () => void;
  /** Custom label for accessibility */
  label?: string;
}

/**
 * Consistent back button used across screens.
 * Circular white button with a chevron icon.
 */
export function BackButton({ onPress, label = 'Go back' }: BackButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress || (() => router.back())}
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.iconButton,
  },
});
