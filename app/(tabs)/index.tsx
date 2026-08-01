import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows, layout } from '../../src/theme';
import { Card, Badge, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { state } = useAppState();
  const { hasBooking, owner, activeTrip, consultant, pets, documents } = state;
  const pet = pets.find((p) => p.id === activeTrip?.petId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.userName}>{owner?.firstName || 'there'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {hasBooking ? (
          <HasBookingView pet={pet} activeTrip={activeTrip} consultant={consultant} documents={documents} />
        ) : (
          <NoBookingView />
        )}
      </ScrollView>

      {/* Floating chat FAB — only when has booking */}
      {hasBooking && (
        <TouchableOpacity
          style={styles.fab}
          accessibilityLabel="Chat with consultant"
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/messages')}
        >
          <Ionicons name="chatbubble" size={22} color={colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// ─── Has Booking View ────────────────────────────────────────────────

function HasBookingView({ pet, activeTrip, consultant, documents }: any) {
  const pendingDocs = documents?.filter((d: any) => d.status === 'missing') || [];

  return (
    <>
      {/* Trip card */}
      <Card style={styles.tripCard}>
        <View style={styles.petRow}>
          <View style={styles.petAvatar}>
            <Ionicons name="paw" size={32} color={colors.primary} />
          </View>
          <View style={styles.petInfo}>
            <View style={styles.petNameRow}>
              <Text style={styles.petName}>{pet?.name || 'Your pet'}</Text>
              <Badge label={pet?.species?.toUpperCase() || 'PET'} variant="pet" />
            </View>
            <Text style={styles.petBreed}>{pet?.breed || ''}</Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeRow}>
          <Text style={styles.routeCode}>{activeTrip?.originAirport || 'LHR'}</Text>
          <View style={styles.routeLine}>
            <Ionicons name="airplane" size={18} color={colors.primary} />
          </View>
          <Text style={styles.routeCode}>{activeTrip?.destinationAirport || 'LAX'}</Text>
        </View>

        {/* Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, activeTrip?.status === 'active' && { backgroundColor: colors.success }]} />
          <Text style={styles.statusText}>
            {activeTrip?.status === 'deposit_pending'
              ? `Your booking is pending — we need your deposit and a few documents before ${pet?.name || 'your pet'}'s journey can begin.`
              : activeTrip?.status === 'active'
              ? `${pet?.name || 'Your pet'}'s journey is in progress. Your consultant is managing everything.`
              : `${pet?.name || 'Your pet'}'s journey is being prepared.`}
          </Text>
        </View>

        {/* Checklist — only show when deposit pending */}
        {activeTrip?.status === 'deposit_pending' && (
        <View style={styles.checklist}>
          <ChecklistItem label="Deposit paid" action="Pay now" />
          <ChecklistItem label="Documents uploaded" action="Upload" />
        </View>
        )}
      </Card>

      {/* Attention needed */}
      {pendingDocs.length > 0 && (
        <>
          <View style={styles.attentionHeader}>
            <Text style={styles.attentionCount}>{pendingDocs.length} things need your attention</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <Card variant="highlighted" style={styles.actionCard}>
            <View style={styles.actionRow}>
              <View style={styles.actionIcon}>
                <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Upload {pet?.name}'s rabies vaccination record</Text>
                <Text style={styles.actionSubtitle}>Needed before the titre test can be booked</Text>
              </View>
            </View>
          </Card>
          <Button title="Upload now" onPress={() => {}} variant="primary" style={styles.uploadBtn} />
        </>
      )}

      {/* Consultant */}
      {consultant && (
        <Card style={styles.consultantCard}>
          <View style={styles.consultantRow}>
            <View style={styles.consultantAvatar}>
              <Ionicons name="person" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.consultantInfo}>
              <Text style={styles.consultantName}>{consultant.name}</Text>
              <Text style={styles.consultantRole}>{pet?.name}'s relocation consultant</Text>
            </View>
            <TouchableOpacity style={styles.chatButton}>
              <Ionicons name="chatbubble-outline" size={19} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Quiet guides link */}
      <TouchableOpacity onPress={() => router.push('/guides')} style={styles.guidesLinkQuiet}>
        <Text style={styles.guidesLinkQuietText}>Travel guides — crates, vaccinations, country rules & more</Text>
      </TouchableOpacity>
    </>
  );
}

// ─── No Booking View ─────────────────────────────────────────────────

function NoBookingView() {
  const { dispatch } = useAppState();

  const handleDemoSkip = () => {
    const now = new Date().toISOString();
    const tripId = 'trip-demo';
    const petId = 'pet-demo';
    const ownerId = 'owner-demo';
    dispatch({
      type: 'SET_BOOKING',
      payload: {
        owner: { id: ownerId, firstName: 'Alex', surname: 'Demo', email: 'alex@demo.com', phone: '+44 7700 000000', preferredLanguage: 'en', mediaConsent: true, pets: [petId], createdAt: now },
        pet: { id: petId, ownerId, name: 'Darcy', species: 'dog', breed: 'Labrador Retriever', dateOfBirth: '2022-03-12', weight: 28, microchipNumber: '981 000 012 345 678', documentStatus: 'pending', createdAt: now, updatedAt: now },
        trip: { id: tripId, ownerId, petId, direction: 'export', status: 'active', originCity: 'London', originAirport: 'LHR', destinationCity: 'Cape Town', destinationAirport: 'CPT', travelDate: '2026-09-10', flight: { airline: 'KLM', flightNumber: 'KL592', route: 'LHR → AMS → CPT', departureTime: '2026-09-10T09:30:00Z', arrivalTime: '2026-09-10T22:45:00Z', confirmed: true }, payments: [], milestones: [
          { id: 'ms-1', tripId, order: 1, title: 'Initial consultation & quote', description: 'Reviewed needs, route confirmed', status: 'completed', completedAt: now },
          { id: 'ms-2', tripId, order: 2, title: 'Veterinary requirements', description: 'Vaccinations and blood tests', status: 'completed', completedAt: now },
          { id: 'ms-3', tripId, order: 3, title: 'Route planning & flight booking', description: 'KLM via Amsterdam confirmed', status: 'completed', completedAt: now },
          { id: 'ms-4', tripId, order: 4, title: 'IATA crate delivery', description: 'Size 4 crate delivered', status: 'completed', completedAt: now },
          { id: 'ms-5', tripId, order: 5, title: 'Export preparation', description: 'EHC and permits in progress', status: 'current', estimatedDate: '2026-09-01' },
          { id: 'ms-6', tripId, order: 6, title: 'Collection & check-in', description: 'Pickup and airport check-in', status: 'upcoming', plannedDate: '2026-09-10' },
          { id: 'ms-7', tripId, order: 7, title: 'Arrival & reunion', description: 'Landing at CPT', status: 'upcoming', plannedDate: '2026-09-10' },
        ], createdAt: now, updatedAt: now },
        consultant: { id: 'cons-001', name: 'Sarah Whitfield', phone: '+44 1903 741 000', email: 'sarah@petsbyplane.com', isOnline: true },
        documents: [
          { id: 'doc-1', petId, tripId, type: 'microchip_confirmation', name: 'Microchip confirmation', description: '15-digit ISO microchip verified', status: 'verified', verifiedAt: now },
          { id: 'doc-2', petId, tripId, type: 'rabies_vaccination', name: 'Rabies vaccination', description: 'Administered 30+ days before departure', status: 'verified', verifiedAt: now },
          { id: 'doc-3', petId, tripId, type: 'health_screening', name: 'Blood tests', description: 'Required for South Africa', status: 'verified', verifiedAt: now },
          { id: 'doc-4', petId, tripId, type: 'export_health_certificate', name: 'Export Health Certificate', description: 'Must be within 10 days of departure', status: 'missing' },
        ],
      },
    });
  };

  return (
    <>
      {/* Empty state card */}
      <Card style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Ionicons name="paper-plane-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>No trip booked yet</Text>
        <Text style={styles.emptyBody}>
          When you're ready, get a free quote and we'll take care of the rest.
        </Text>
        <Button
          title="Get a quote"
          onPress={() => router.push('/quote')}
          variant="primary"
          style={styles.emptyButton}
        />
      </Card>

      {/* Browse section */}
      <Text style={styles.browseTitle}>Not ready to book? Have a browse</Text>
      <Text style={styles.browseSubtitle}>
        Get a feel for how it all works — crates, vaccines, destinations, the airlines we fly with.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.browseRow}
      >
        <BrowseCard icon="globe-outline" label="Country rules" route="/guides/country-rules" iconColor={colors.primary} iconBg={colors.primaryLight} />
        <BrowseCard icon="cube-outline" label="Travel crates" route="/guides/crates" />
        <BrowseCard icon="medkit-outline" label="Vaccines & tests" route="/guides/vaccinations" />
        <BrowseCard icon="airplane-outline" label="Airlines & partners" route="/guides/airlines" />
      </ScrollView>

      <TouchableOpacity onPress={() => router.push('/guides')} style={styles.seeAllGuides}>
        <Text style={styles.seeAllGuidesText}>See all travel guides →</Text>
      </TouchableOpacity>

      {/* Demo shortcut — remove in production */}
      <TouchableOpacity style={styles.demoSkipBtn} onPress={handleDemoSkip}>
        <Text style={styles.demoSkipText}>Demo: Skip to booked state →</Text>
      </TouchableOpacity>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function ChecklistItem({ label, action }: { label: string; action: string }) {
  return (
    <View style={styles.checkItem}>
      <View style={styles.checkItemLeft}>
        <View style={styles.checkbox} />
        <Text style={styles.checkItemText}>{label}</Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.checkItemAction}>{action}</Text>
      </TouchableOpacity>
    </View>
  );
}

function BrowseCard({ icon, label, route, iconColor, iconBg }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <TouchableOpacity style={styles.browseCard} onPress={() => router.push(route as any)}>
      <View style={[styles.browseCardIcon, iconBg ? { backgroundColor: iconBg } : {}]}>
        <Ionicons name={icon} size={16} color={iconColor || colors.textPrimary} />
      </View>
      <Text style={styles.browseCardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 120 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xxxl, paddingBottom: spacing.md,
  },
  greeting: { ...typography.label, color: colors.textSecondary },
  userName: { ...typography.h1, color: colors.textPrimary },
  notificationButton: {
    width: layout.iconButtonSize, height: layout.iconButtonSize,
    borderRadius: layout.iconButtonSize / 2, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', ...shadows.iconButton,
  },
  notifDot: {
    position: 'absolute', top: 9, right: 10,
    width: 9, height: 9, borderRadius: 4.5,
    backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.white,
  },

  // Trip card
  tripCard: { marginHorizontal: layout.screenPaddingHorizontal, marginTop: spacing.md, padding: 20 },
  petRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  petAvatar: {
    width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: colors.textPrimary,
    backgroundColor: '#FBE9E2', alignItems: 'center', justifyContent: 'center',
  },
  petInfo: { flex: 1 },
  petNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  petName: { fontFamily: 'Baloo2_700Bold', fontSize: 19, color: colors.textPrimary },
  petBreed: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  routeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginTop: 18, marginBottom: 6,
  },
  routeCode: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: colors.textPrimary },
  routeLine: {
    flex: 1, height: 2, backgroundColor: 'rgba(232, 98, 61, 0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  statusDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#C98A2E' },
  statusText: { ...typography.bodySmall, fontFamily: 'Nunito_600SemiBold', color: colors.textPrimary, flex: 1, lineHeight: 18 },
  checklist: { marginTop: 14, gap: 8 },
  checkItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.secondarySubtle, borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: 12,
  },
  checkItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 2, borderColor: colors.secondaryDark },
  checkItemText: { ...typography.bodySmall, fontFamily: 'Nunito_600SemiBold', color: colors.textPrimary },
  checkItemAction: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.secondaryDark },

  // Attention
  attentionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: layout.screenPaddingHorizontal, marginTop: 18,
  },
  attentionCount: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.primary },
  seeAll: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  actionCard: { marginHorizontal: layout.screenPaddingHorizontal, marginTop: 8, padding: 18 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  actionIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  actionContent: { flex: 1 },
  actionTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, lineHeight: 18 },
  actionSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  uploadBtn: { marginHorizontal: layout.screenPaddingHorizontal, marginTop: 12 },

  // Consultant
  consultantCard: { marginHorizontal: layout.screenPaddingHorizontal, marginTop: 14, padding: 14 },
  consultantRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  consultantAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.background,
    borderWidth: 2, borderColor: colors.background, alignItems: 'center', justifyContent: 'center',
  },
  consultantInfo: { flex: 1 },
  consultantName: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  consultantRole: { ...typography.caption, color: colors.textSecondary },
  chatButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },

  // Quiet guides link
  guidesLinkQuiet: { alignItems: 'center', marginTop: 16, marginBottom: 20 },
  guidesLinkQuietText: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.textMuted },

  // FAB
  fab: {
    position: 'absolute', right: 20, bottom: 100,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    ...shadows.fab,
  },

  // ─── No Booking State ───
  emptyCard: {
    marginHorizontal: layout.screenPaddingHorizontal, marginTop: 32,
    padding: 36, alignItems: 'center',
  },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(232, 98, 61, 0.1)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontFamily: 'Baloo2_700Bold', fontSize: 16.5, color: colors.textPrimary },
  emptyBody: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  emptyButton: { marginTop: 20 },

  // Browse
  browseTitle: {
    fontFamily: 'Baloo2_700Bold', fontSize: 15, color: colors.textPrimary,
    marginHorizontal: layout.screenPaddingHorizontal, marginTop: 24,
  },
  browseSubtitle: {
    ...typography.caption, color: colors.textSecondary, lineHeight: 18,
    marginHorizontal: layout.screenPaddingHorizontal, marginTop: 4, marginBottom: 12,
  },
  browseRow: { paddingHorizontal: layout.screenPaddingHorizontal, gap: 10 },
  browseCard: {
    width: 112, backgroundColor: colors.white, borderRadius: radius.xl,
    padding: 14, paddingHorizontal: 12, ...shadows.cardLight,
  },
  browseCardIcon: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(46, 40, 34, 0.06)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  browseCardLabel: { color: colors.textPrimary, fontFamily: 'Nunito_700Bold', fontSize: 12, lineHeight: 16 },
  seeAllGuides: { alignItems: 'center', marginTop: 12, paddingVertical: 8 },
  seeAllGuidesText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.primary },
  demoSkipBtn: {
    alignItems: 'center', marginTop: 16, marginHorizontal: layout.screenPaddingHorizontal,
    backgroundColor: 'rgba(232, 98, 61, 0.08)', borderWidth: 1.5, borderColor: 'rgba(232, 98, 61, 0.25)',
    borderRadius: radius.pill, paddingVertical: 12,
  },
  demoSkipText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: colors.primary },
});
