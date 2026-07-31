import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows } from '../theme';
import { useAppState } from '../services/store';
import { shareTrackingLink, shareWithVet } from '../services/shareService';

interface ShareTrackingButtonProps {
  /** 'family' shares a general link, 'vet' includes medical info */
  variant?: 'family' | 'vet';
}

/**
 * One-tap share button for the journey tracking link.
 * Opens the system share sheet with a pre-formatted message.
 */
export function ShareTrackingButton({ variant = 'family' }: ShareTrackingButtonProps) {
  const { state } = useAppState();
  const { activeTrip, pets } = state;
  const pet = pets.find((p) => p.id === activeTrip?.petId);

  const handleShare = async () => {
    if (!activeTrip || !pet) {
      Alert.alert('No active trip', 'Start a booking first to share tracking.');
      return;
    }

    const success = variant === 'vet'
      ? await shareWithVet(activeTrip, pet)
      : await shareTrackingLink(activeTrip, pet);

    if (!success) {
      // User cancelled — no alert needed
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleShare}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={variant === 'vet' ? 'Share tracking with vet' : 'Share tracking link'}
    >
      <Ionicons
        name={variant === 'vet' ? 'medkit-outline' : 'share-outline'}
        size={16}
        color={colors.primary}
      />
      <Text style={styles.text}>
        {variant === 'vet' ? 'Share with vet' : 'Share tracking'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    ...shadows.iconButton,
  },
  text: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.primary,
  },
});
