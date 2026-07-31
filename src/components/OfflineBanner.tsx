import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius } from '../theme';
import { useOffline } from '../hooks/useOffline';

/**
 * Offline indicator banner.
 * Shows when connectivity is lost, with "last updated" time.
 * Spec Section 4: gracefully indicate "last updated."
 */
export function OfflineBanner() {
  const { isConnected, lastUpdatedText } = useOffline();

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={14} color={colors.white} />
      <Text style={styles.text}>
        You're offline · Last updated {lastUpdatedText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.textPrimary,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    ...typography.tiny,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.white,
  },
});
