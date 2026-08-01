import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows, layout } from '../../src/theme';
import { Card } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';
import { EmptyState } from '../../src/components/EmptyState';
import { Milestone } from '../../src/types';
import { router } from 'expo-router';

type JourneyTab = 'before' | 'transit';

export default function JourneyScreen() {
  const [activeTab, setActiveTab] = useState<JourneyTab>('before');
  const { state } = useAppState();
  const { hasBooking, activeTrip, pets, consultant } = state;

  const pet = pets.find((p) => p.id === activeTrip?.petId);
  const milestones = activeTrip?.milestones || [];
  const flight = activeTrip?.flight;

  const currentMilestone = milestones.find((m) => m.status === 'current');
  const isInTransit = activeTrip?.status === 'in_transit';
  const hasTrip = hasBooking && !!activeTrip;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>
            {pet?.name ? `${pet.name}'s Journey` : 'Journey'}
          </Text>
          <Text style={styles.subtitle}>
            {activeTrip ? `${activeTrip.originAirport} → ${activeTrip.destinationAirport}` : 'Track your pet\'s relocation'}
          </Text>
        </View>
      </View>

      {!hasTrip ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState
            icon="navigate-outline"
            title="No journey yet"
            description="Once you've booked a relocation, your pet's journey timeline will appear here — from vet checks to wheels-up to reunion."
            actionLabel="Get a quote"
            onAction={() => router.push('/quote')}
          />
        </ScrollView>
      ) : (
        <>
      {/* Tab toggle */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'before' && styles.tabActive]}
            onPress={() => setActiveTab('before')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'before' }}
          >
            <Text style={[styles.tabText, activeTab === 'before' && styles.tabTextActive]}>
              Before collection
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transit' && styles.tabActive]}
            onPress={() => setActiveTab('transit')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'transit' }}
          >
            <Text style={[styles.tabText, activeTab === 'transit' && styles.tabTextActive]}>
              In transit
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'before' ? (
          <BeforeCollectionView
            milestones={milestones}
            flight={flight}
            activeTrip={activeTrip}
            pet={pet}
            consultant={consultant}
          />
        ) : (
          <InTransitView
            milestones={milestones}
            flight={flight}
            activeTrip={activeTrip}
            pet={pet}
          />
        )}
      </ScrollView>
      </>
      )}
    </SafeAreaView>
  );
}

// ─── Before Collection View ──────────────────────────────────────────

function BeforeCollectionView({
  milestones,
  flight,
  activeTrip,
  pet,
  consultant,
}: {
  milestones: Milestone[];
  flight: any;
  activeTrip: any;
  pet: any;
  consultant: any;
}) {
  const collectionDate = activeTrip?.travelDate
    ? formatDate(activeTrip.travelDate)
    : 'TBC';

  return (
    <>
      {/* Map placeholder */}
      <Card style={styles.mapPlaceholder}>
        <View style={styles.mapIcon}>
          <Ionicons name="globe-outline" size={24} color={colors.textSecondary} />
        </View>
        <Text style={styles.mapTitle}>Live map opens when the journey starts</Text>
        <Text style={styles.mapDate}>
          Confirmed collection:{' '}
          <Text style={{ color: colors.textPrimary, fontFamily: 'Nunito_700Bold' }}>
            {collectionDate}
          </Text>
        </Text>
      </Card>

      {/* Collection details */}
      <Card style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Collection</Text>
        <DetailRow label="Address" value="14 Larch Road, London" />
        <DetailRow label="Carrier contact" value="SkyPets Cargo · 0208 555 0199" />
        <DetailRow
          label="Latest drop-off"
          value={activeTrip?.travelDate ? formatDateShort(subtractDays(activeTrip.travelDate, 1)) + ', 18:00' : 'TBC'}
          highlight
        />
      </Card>

      {/* Flight details */}
      {flight && (
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Flights</Text>
          <DetailRow label="Route" value={flight.route} />
          <DetailRow label="Flight number" value={flight.flightNumber} />
          <DetailRow label="Departure" value={formatDateTime(flight.departureTime)} />
          <DetailRow label="Arrival" value={formatDateTime(flight.arrivalTime) + ' (local)'} />
          {!flight.confirmed && (
            <View style={styles.provisionalBanner}>
              <Ionicons name="information-circle" size={14} color={colors.warning} />
              <Text style={styles.provisionalText}>
                Flight not yet confirmed by airline — details may change
              </Text>
            </View>
          )}
        </Card>
      )}

      {/* Emergency contact */}
      {consultant && (
        <TouchableOpacity
          style={styles.emergencyCard}
          onPress={() => Linking.openURL(`tel:${consultant.phone}`)}
          accessibilityRole="button"
          accessibilityLabel={`Call ${consultant.name}`}
        >
          <View style={styles.emergencyIcon}>
            <Ionicons name="call" size={18} color={colors.white} />
          </View>
          <View style={styles.emergencyInfo}>
            <Text style={styles.emergencyTitle}>Emergency / travel-day contact</Text>
            <Text style={styles.emergencyNumber}>{consultant.phone}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      )}

      {/* Milestone timeline */}
      <View style={styles.timeline}>
        {milestones.map((milestone, index) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            isLast={index === milestones.length - 1}
          />
        ))}
      </View>
    </>
  );
}

// ─── In Transit View ─────────────────────────────────────────────────

function InTransitView({
  milestones,
  flight,
  activeTrip,
  pet,
}: {
  milestones: Milestone[];
  flight: any;
  activeTrip: any;
  pet: any;
}) {
  // Calculate time remaining
  const landingIn = flight?.arrivalTime
    ? getTimeRemaining(flight.arrivalTime)
    : null;

  return (
    <>
      {/* Live status bar + map */}
      <View style={styles.transitHeader}>
        <View style={styles.transitStatusBar}>
          <View style={styles.pulseDot} />
          <Text style={styles.transitStatusText}>
            {landingIn
              ? `In transit · landing in ${landingIn}`
              : 'In transit'}
          </Text>
        </View>
        <View style={styles.transitMap}>
          {/* Simplified map visual */}
          <View style={styles.mapRouteVisual}>
            <View style={styles.mapEndpoint}>
              <View style={styles.mapDot} />
              <Text style={styles.mapLabel}>{activeTrip?.originAirport || 'LHR'}</Text>
            </View>
            <View style={styles.mapRouteLine} />
            <View style={styles.movingDot} />
            <View style={styles.mapRouteLine} />
            <View style={styles.mapEndpoint}>
              <View style={[styles.mapDot, { backgroundColor: colors.textPrimary }]} />
              <Text style={styles.mapLabel}>{activeTrip?.destinationAirport || 'LAX'}</Text>
            </View>
          </View>
          {/* Hold temperature */}
          <View style={styles.holdTemp}>
            <Ionicons name="thermometer-outline" size={13} color={colors.success} />
            <Text style={styles.holdTempText}>Hold: 19°C</Text>
          </View>
        </View>
      </View>

      {/* Transit milestones */}
      <View style={styles.transitTimeline}>
        <TransitStep title="Collected from home" time="06:40" completed />
        <TransitStep title="Vet check & documents" time="07:55" completed />
        <TransitStep title="Airport check-in" time="09:10" completed />
        <TransitStep
          title={`Departed ${activeTrip?.originAirport || 'LHR'}`}
          time={flight ? `${formatTimeOnly(flight.departureTime)} · expected ${activeTrip?.destinationAirport || 'LAX'} ${formatTimeOnly(flight.arrivalTime)} local` : ''}
          current
        />
        <TransitStep title="Customs & arrival" upcoming />
        <TransitStep title={`Reunion at ${activeTrip?.destinationAirport || 'LAX'}`} upcoming />
      </View>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, highlight && { color: colors.primary }]}>{value}</Text>
    </View>
  );
}

function MilestoneItem({ milestone, isLast }: { milestone: Milestone; isLast: boolean }) {
  const isCompleted = milestone.status === 'completed';
  const isCurrent = milestone.status === 'current';

  return (
    <View style={styles.milestoneRow}>
      {!isLast && (
        <View
          style={[
            styles.milestoneLine,
            { backgroundColor: isCompleted || isCurrent ? colors.primary : 'rgba(107,98,89,0.25)' },
          ]}
        />
      )}
      <View
        style={[
          styles.milestoneDot,
          isCompleted && styles.milestoneDotCompleted,
          isCurrent && styles.milestoneDotCurrent,
          milestone.status === 'upcoming' && styles.milestoneDotUpcoming,
        ]}
      >
        {isCompleted && <Ionicons name="checkmark" size={15} color={colors.white} />}
        {isCurrent && <Ionicons name="cube-outline" size={15} color={colors.white} />}
      </View>

      {isCurrent ? (
        <View style={styles.milestoneCurrentCard}>
          <View style={styles.milestoneCurrentHeader}>
            <View style={styles.pulseDotSmall} />
            <Text style={styles.milestoneCurrentTitle}>{milestone.title}</Text>
          </View>
          <Text style={styles.milestoneCurrentDesc}>{milestone.description}</Text>
          <Text style={styles.milestoneCurrentDate}>
            {milestone.estimatedDate ? `Expected ${formatDate(milestone.estimatedDate)}` : ''}
          </Text>
        </View>
      ) : (
        <View style={styles.milestoneContent}>
          <Text style={[styles.milestoneTitle, milestone.status === 'upcoming' && styles.textMuted]}>
            {milestone.title}
          </Text>
          <Text style={[styles.milestoneDesc, milestone.status === 'upcoming' && styles.textDisabled]}>
            {milestone.description}
          </Text>
          <Text style={[styles.milestoneDate, milestone.status === 'upcoming' && styles.textDisabled]}>
            {milestone.completedAt
              ? formatDate(milestone.completedAt)
              : milestone.plannedDate
              ? `Planned ${formatDate(milestone.plannedDate)}`
              : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

function TransitStep({ title, time, completed, current, upcoming }: {
  title: string; time?: string; completed?: boolean; current?: boolean; upcoming?: boolean;
}) {
  return (
    <View style={styles.transitStepRow}>
      <View style={[
        styles.transitDot,
        completed && styles.transitDotCompleted,
        current && styles.transitDotCurrent,
        upcoming && styles.transitDotUpcoming,
      ]}>
        {completed && <Ionicons name="checkmark" size={14} color={colors.white} />}
        {current && <Ionicons name="paper-plane" size={12} color={colors.white} />}
      </View>
      <View style={styles.transitStepContent}>
        <Text style={[
          styles.transitStepTitle,
          upcoming && { color: colors.textMuted },
          current && { fontFamily: 'Nunito_700Bold' },
        ]}>
          {title}
        </Text>
        {time ? (
          <Text style={styles.transitStepTime}>{time}</Text>
        ) : null}
      </View>
    </View>
  );
}

// ─── Date Helpers ────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

function formatTimeOnly(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function getTimeRemaining(arrivalStr: string): string | null {
  const arrival = new Date(arrivalStr);
  const now = new Date();
  const diff = arrival.getTime() - now.getTime();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: layout.screenPaddingTop, paddingBottom: 8,
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: {
    ...typography.caption, fontFamily: 'Nunito_600SemiBold',
    color: colors.textSecondary, marginTop: 1,
  },

  // Tabs
  tabContainer: { paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 14 },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#E9E4D8',
    borderRadius: radius.pill, padding: 4, gap: 4,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: radius.pill, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  tabTextActive: { color: colors.white },

  // Scroll
  scrollView: { flex: 1 },
  scrollContent: {
    padding: layout.screenPaddingHorizontal, paddingTop: 16, paddingBottom: 120, gap: 14,
  },

  // Map placeholder
  mapPlaceholder: { alignItems: 'center', paddingVertical: 22 },
  mapIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(46,40,34,0.06)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  mapTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  mapDate: { ...typography.caption, color: colors.textSecondary, marginTop: 8 },

  // Details cards
  detailsCard: { padding: 18 },
  sectionTitle: { ...typography.h5, color: colors.textPrimary, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  detailLabel: { ...typography.bodySmall, color: colors.textSecondary },
  detailValue: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, textAlign: 'right', flexShrink: 1 },
  provisionalBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.secondarySubtle, borderRadius: radius.md,
    paddingVertical: 8, paddingHorizontal: 10, marginTop: 8,
  },
  provisionalText: { ...typography.tiny, color: colors.warning, flex: 1, lineHeight: 15 },

  // Emergency contact
  emergencyCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderRadius: radius.xl,
    padding: 14, ...shadows.cardLight,
  },
  emergencyIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  emergencyInfo: { flex: 1 },
  emergencyTitle: { ...typography.caption, fontFamily: 'Nunito_600SemiBold', color: colors.textSecondary },
  emergencyNumber: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, marginTop: 2 },

  // Timeline
  timeline: { marginTop: 4 },
  milestoneRow: { flexDirection: 'row', gap: 16, paddingBottom: 26, position: 'relative' },
  milestoneLine: { position: 'absolute', left: 15, top: 32, bottom: 0, width: 2 },
  milestoneDot: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  milestoneDotCompleted: { backgroundColor: colors.primary },
  milestoneDotCurrent: {
    backgroundColor: colors.primary, borderWidth: 3,
    borderColor: colors.background,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 4, elevation: 4,
  },
  milestoneDotUpcoming: {
    backgroundColor: colors.background, borderWidth: 2,
    borderColor: 'rgba(107,98,89,0.35)',
  },
  milestoneContent: { flex: 1, paddingTop: 2 },
  milestoneTitle: { ...typography.h5, color: colors.textPrimary },
  milestoneDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 3, lineHeight: 18 },
  milestoneDate: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.textSecondary, marginTop: 6 },
  milestoneCurrentCard: {
    flex: 1, backgroundColor: colors.primarySubtle,
    borderWidth: 1.5, borderColor: 'rgba(232,98,61,0.35)',
    borderRadius: radius.lg + 2, padding: 14, marginTop: -4,
  },
  milestoneCurrentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  milestoneCurrentTitle: { ...typography.h5, fontSize: 15.5, color: colors.textPrimary },
  milestoneCurrentDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 5, lineHeight: 18 },
  milestoneCurrentDate: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.primary, marginTop: 8 },
  pulseDotSmall: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  textMuted: { color: colors.textMuted },
  textDisabled: { color: colors.textDisabled },

  // Transit view
  transitHeader: {},
  transitStatusBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.textPrimary,
    borderTopLeftRadius: 18, borderTopRightRadius: 18,
    paddingVertical: 12, paddingHorizontal: 16,
  },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  transitStatusText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.background },
  transitMap: {
    backgroundColor: '#DCE7E6',
    borderBottomLeftRadius: 18, borderBottomRightRadius: 18,
    height: 180, padding: 20, justifyContent: 'center',
    ...shadows.card,
  },
  mapRouteVisual: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  mapEndpoint: { alignItems: 'center', gap: 4 },
  mapDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  mapLabel: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  mapRouteLine: { flex: 1, height: 2, backgroundColor: 'rgba(232,98,61,0.4)' },
  movingDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.primary, marginHorizontal: -2,
  },
  holdTemp: {
    position: 'absolute', top: 10, right: 10,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 12,
  },
  holdTempText: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },

  // Transit timeline
  transitTimeline: { marginTop: 16 },
  transitStepRow: { flexDirection: 'row', gap: 16, paddingBottom: 22, position: 'relative' },
  transitDot: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  transitDotCompleted: { backgroundColor: colors.primary },
  transitDotCurrent: { backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.background },
  transitDotUpcoming: { backgroundColor: colors.background, borderWidth: 2, borderColor: 'rgba(107,98,89,0.35)' },
  transitStepContent: { flex: 1, paddingTop: 5 },
  transitStepTitle: { ...typography.bodySmall, fontFamily: 'Nunito_600SemiBold', color: colors.textPrimary },
  transitStepTime: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
