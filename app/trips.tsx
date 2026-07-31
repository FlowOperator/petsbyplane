import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';
import { Card, Badge } from '../src/components/ui';
import { useAppState } from '../src/services/store';
import { Trip, TripStatus } from '../src/types';

/**
 * Trip History / All Trips screen.
 * Section 6.13 — multiple pets, multiple past/future trips.
 */

function getStatusBadge(status: TripStatus): { label: string; variant: 'success' | 'warning' | 'error' | 'info' } {
  const map: Record<TripStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
    quote_requested: { label: 'Quote requested', variant: 'info' },
    quote_received: { label: 'Quote ready', variant: 'info' },
    deposit_pending: { label: 'Deposit needed', variant: 'warning' },
    documents_pending: { label: 'Docs needed', variant: 'warning' },
    active: { label: 'Active', variant: 'success' },
    in_transit: { label: 'In transit', variant: 'success' },
    arrived: { label: 'Arrived', variant: 'success' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'error' },
  };
  return map[status] || { label: status, variant: 'info' };
}

export default function TripsScreen() {
  const { state, dispatch } = useAppState();
  const { trips, pets } = state;

  const activeTrips = trips.filter((t) => !['completed', 'cancelled'].includes(t.status));
  const pastTrips = trips.filter((t) => ['completed', 'cancelled'].includes(t.status));

  const handleSelectTrip = (trip: Trip) => {
    dispatch({ type: 'SET_ACTIVE_TRIP', payload: trip });
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>My Trips</Text>
          <TouchableOpacity
            style={styles.newTripBtn}
            onPress={() => router.push('/quote')}
            accessibilityRole="button"
          >
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Active trips */}
        {activeTrips.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active</Text>
            {activeTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                pet={pets.find((p) => p.id === trip.petId)}
                onPress={() => handleSelectTrip(trip)}
              />
            ))}
          </>
        )}

        {/* Past trips */}
        {pastTrips.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Past</Text>
            {pastTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                pet={pets.find((p) => p.id === trip.petId)}
                onPress={() => handleSelectTrip(trip)}
                past
              />
            ))}
          </>
        )}

        {trips.length === 0 && (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="airplane-outline" size={32} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptyDesc}>
              Start your first booking and your pet's journey will appear here.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/quote')}
              accessibilityRole="button"
            >
              <Text style={styles.emptyBtnText}>Get a quote</Text>
            </TouchableOpacity>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TripCard({ trip, pet, onPress, past }: {
  trip: Trip; pet: any; onPress: () => void; past?: boolean;
}) {
  const badge = getStatusBadge(trip.status);
  const currentMilestone = trip.milestones.find((m) => m.status === 'current');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      <Card style={[styles.tripCard, past ? styles.tripCardPast : {}]}>
        <View style={styles.tripHeader}>
          <View style={styles.tripPetInfo}>
            <View style={styles.petIcon}>
              <Ionicons name="paw" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.tripPetName}>{pet?.name || 'Pet'}</Text>
              <Text style={styles.tripBreed}>{pet?.breed || ''}</Text>
            </View>
          </View>
          <Badge label={badge.label} variant={badge.variant} />
        </View>

        <View style={styles.tripRoute}>
          <Text style={styles.routeCode}>{trip.originAirport}</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.textMuted} />
          <Text style={styles.routeCode}>{trip.destinationAirport}</Text>
          {trip.travelDate && (
            <Text style={styles.tripDate}>
              {new Date(trip.travelDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          )}
        </View>

        {currentMilestone && !past && (
          <View style={styles.currentStep}>
            <View style={styles.stepDot} />
            <Text style={styles.stepText}>{currentMilestone.title}</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingTop: 20, paddingBottom: 16,
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  title: { ...typography.h2, color: colors.textPrimary, flex: 1 },
  newTripBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },

  sectionTitle: {
    ...typography.h5, color: colors.textSecondary,
    marginTop: 16, marginBottom: 10,
  },

  tripCard: { marginBottom: 12 },
  tripCardPast: { opacity: 0.7 },
  tripHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  tripPetInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  petIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FBE9E2',
    alignItems: 'center', justifyContent: 'center',
  },
  tripPetName: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  tripBreed: { ...typography.tiny, color: colors.textSecondary },

  tripRoute: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  routeCode: { fontFamily: 'Baloo2_700Bold', fontSize: 16, color: colors.textPrimary },
  tripDate: { ...typography.caption, color: colors.textSecondary, marginLeft: 'auto' },

  currentStep: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 10, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  stepText: { ...typography.caption, fontFamily: 'Nunito_600SemiBold', color: colors.textSecondary },

  // Empty state
  emptyCard: { alignItems: 'center', paddingVertical: 40, marginTop: 40 },
  emptyIcon: { marginBottom: 16 },
  emptyTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: 6 },
  emptyDesc: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: 20 },
  emptyBtn: {
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 12, paddingHorizontal: 24, ...shadows.button,
  },
  emptyBtnText: { ...typography.button, color: colors.textPrimary },
});
