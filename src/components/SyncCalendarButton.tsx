import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows } from '../theme';
import { useAppState } from '../services/store';
import { useRequirements } from '../hooks/useRequirements';
import { syncTripToCalendar, syncRequirementsToCalendar } from '../services/calendarService';

/**
 * One-tap button to sync all trip dates + requirement deadlines
 * to the device calendar.
 */
export function SyncCalendarButton() {
  const [syncing, setSyncing] = useState(false);
  const { state } = useAppState();
  const { activeTrip, pets } = state;
  const { checklist } = useRequirements();

  const pet = pets.find((p) => p.id === activeTrip?.petId);

  const handleSync = async () => {
    if (!activeTrip || !pet) {
      Alert.alert('No active trip', 'Start a booking first to sync dates.');
      return;
    }

    setSyncing(true);
    try {
      const tripEvents = await syncTripToCalendar(activeTrip, pet.name);
      const reqEvents = await syncRequirementsToCalendar(checklist, pet.name);
      const total = tripEvents + reqEvents;

      if (total > 0) {
        Alert.alert(
          'Calendar synced',
          `Added ${total} event${total !== 1 ? 's' : ''} to your calendar — travel dates, milestones, and requirement deadlines.`
        );
      }
    } catch (error) {
      Alert.alert('Sync failed', 'Could not add events to your calendar. Check your permissions in Settings.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleSync}
      disabled={syncing}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Sync trip dates to calendar"
    >
      {syncing ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
      )}
      <Text style={styles.text}>
        {syncing ? 'Syncing...' : 'Add to calendar'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    ...shadows.iconButton,
  },
  text: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
});
