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
import { useRequirements } from '../../src/hooks/useRequirements';
import { ShareTrackingButton } from '../../src/components/ShareTrackingButton';
import { SyncCalendarButton } from '../../src/components/SyncCalendarButton';
import { BehavetCard } from '../../src/components/BehavetCard';
import { TrustBadge } from '../../src/components/TrustBadge';
import { EmptyState } from '../../src/components/EmptyState';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { state } = useAppState();
  const { owner, activeTrip, consultant, pets, documents } = state;
  const { checklist, summary } = useRequirements();

  const pet = pets.find((p) => p.id === activeTrip?.petId);
  const pendingDocs = documents.filter((d) => d.status === 'missing' || d.status === 'expiring_soon');
  const urgentItems = checklist.filter((i) => i.isUrgent || i.isOverdue);
  const hasTrip = !!activeTrip;

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
          </TouchableOpacity>
        </View>

        {/* Empty state when no active trip */}
        {!hasTrip && (
          <EmptyState
            icon="paw"
            title="Ready to fly your pet?"
            description="Get a free quote and we'll guide you through everything — vaccinations, crates, paperwork, and the flight itself."
            actionLabel="Get a quote"
            onAction={() => router.push('/quote')}
            secondaryLabel="Learn how it works"
            onSecondary={() => router.push('/about')}
          />
        )}

        {hasTrip && (
          <>

        {/* Active Trip Card */}
        <Card style={styles.tripCard}>
          {/* Pet info row */}
          <View style={styles.petRow}>
            <View style={styles.petAvatarContainer}>
              <View style={styles.petAvatarGlow} />
              <View style={styles.petAvatar}>
                <Ionicons name="paw" size={32} color={colors.primary} />
              </View>
            </View>
            <View style={styles.petInfo}>
              <View style={styles.petNameRow}>
                <Text style={styles.petName}>{pet?.name || 'Your pet'}</Text>
                <Badge label={pet?.species?.toUpperCase() || 'PET'} variant="pet" />
              </View>
              <Text style={styles.petBreed}>{pet?.breed || ''}</Text>
            </View>
          </View>

          {/* Route indicator */}
          <View style={styles.routeRow}>
            <Text style={styles.routeCode}>{activeTrip?.originAirport || 'LHR'}</Text>
            <View style={styles.routeLine}>
              <Ionicons name="airplane" size={18} color={colors.primary} />
            </View>
            <Text style={styles.routeCode}>{activeTrip?.destinationAirport || 'LAX'}</Text>
          </View>

          {/* Status message */}
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.secondaryDark }]} />
            <Text style={styles.statusText}>
              {activeTrip?.status === 'deposit_pending'
                ? `Your booking is pending — we need your deposit and a few documents before ${pet?.name || 'your pet'}'s journey can begin.`
                : `${pet?.name || 'Your pet'}'s journey is in progress.`}
            </Text>
          </View>

          {/* Onboarding gate checklist */}
          <View style={styles.checklist}>
            <View style={styles.checkItem}>
              <View style={styles.checkItemLeft}>
                <View style={styles.checkbox} />
                <Text style={styles.checkItemText}>Deposit paid</Text>
              </View>
              <TouchableOpacity accessibilityRole="link">
                <Text style={styles.checkItemAction}>Pay now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.checkItem}>
              <View style={styles.checkItemLeft}>
                <View style={styles.checkbox} />
                <Text style={styles.checkItemText}>Documents uploaded</Text>
              </View>
              <TouchableOpacity accessibilityRole="link">
                <Text style={styles.checkItemAction}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Attention needed */}
        <View style={styles.attentionHeader}>
          <Text style={styles.attentionCount}>{pendingDocs.length} things need your attention</Text>
          <TouchableOpacity accessibilityRole="link">
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Action card */}
        <Card variant="highlighted" style={styles.actionCard}>
          <View style={styles.actionRow}>
            <View style={styles.actionIcon}>
              <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                {pendingDocs.length > 0
                  ? `Upload ${pet?.name || 'your pet'}'s ${pendingDocs[0]?.name || 'document'}`
                  : 'All documents uploaded'}
              </Text>
              <Text style={styles.actionSubtitle}>
                {pendingDocs.length > 0
                  ? 'Must be completed within 10 days of departure'
                  : 'Your consultant will verify everything'}
              </Text>
            </View>
          </View>
        </Card>

        <Button
          title="Upload now"
          onPress={() => router.push('/(tabs)/documents')}
          variant="primary"
          style={styles.uploadButton}
        />

        {/* Deadline countdown */}
        {urgentItems.length > 0 && (
          <View style={styles.deadlineCard}>
            <View style={styles.deadlineCircle}>
              <Text style={styles.deadlineNumber}>{urgentItems[0].daysRemaining}d</Text>
            </View>
            <Text style={styles.deadlineText}>
              {urgentItems[0].daysRemaining} days left until {pet?.name || "your pet"}'s{' '}
              <Text style={{ color: colors.primary }}>{urgentItems[0].requirement.title}</Text> deadline
            </Text>
          </View>
        )}

        {/* Consultant card */}
        <Card style={styles.consultantCard}>
          <View style={styles.consultantRow}>
            <View style={styles.consultantAvatar}>
              <Ionicons name="person" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.consultantInfo}>
              <Text style={styles.consultantName}>{consultant?.name || 'Your consultant'}</Text>
              <Text style={styles.consultantRole}>{pet?.name ? `${pet.name}'s relocation consultant` : 'Relocation consultant'}</Text>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              accessibilityLabel="Message consultant"
              accessibilityRole="button"
            >
              <Ionicons name="chatbubble-outline" size={19} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>
        {/* Quick actions */}
        <View style={styles.quickActions}>
          <ShareTrackingButton />
          <SyncCalendarButton />
        </View>

        {/* BEHAVET card */}
        <View style={styles.behavetWrap}>
          <BehavetCard />
        </View>

        {/* Trustindex */}
        <View style={styles.trustWrap}>
          <TrustBadge />
        </View>
        </>
        )}
      </ScrollView>

      {/* Floating chat FAB */}
      <TouchableOpacity
        style={styles.fab}
        accessibilityLabel="Chat with consultant"
        accessibilityRole="button"
        onPress={() => router.push('/(tabs)/messages')}
      >
        <Ionicons name="chatbubble" size={22} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.md,
  },
  greeting: {
    ...typography.label,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  notificationButton: {
    width: layout.iconButtonSize,
    height: layout.iconButtonSize,
    borderRadius: layout.iconButtonSize / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.iconButton,
  },

  // Trip card
  tripCard: {
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: spacing.md,
    borderRadius: radius.xxxl,
    padding: 20,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  petAvatarContainer: {
    position: 'relative',
    width: 76,
    height: 76,
  },
  petAvatarGlow: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 44,
    backgroundColor: 'rgba(232, 98, 61, 0.12)',
  },
  petAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colors.textPrimary,
    backgroundColor: '#FBE9E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petInfo: {
    flex: 1,
  },
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  petName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  petBreed: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Route
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 18,
    marginBottom: 6,
  },
  routeCode: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  routeLine: {
    flex: 1,
    height: 2,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(232, 98, 61, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Status
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  statusText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontFamily: 'Nunito_600SemiBold',
    flex: 1,
    lineHeight: 18,
  },

  // Checklist
  checklist: {
    marginTop: 14,
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondarySubtle,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  checkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.secondaryDark,
  },
  checkItemText: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textPrimary,
  },
  checkItemAction: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.secondaryDark,
  },

  // Attention
  attentionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: 18,
  },
  attentionCount: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.primary,
  },
  seeAll: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary,
  },

  // Action card
  actionCard: {
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: 8,
    padding: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...typography.body,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  uploadButton: {
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: 12,
  },

  // Deadline
  deadlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: 14,
    backgroundColor: colors.primarySubtle,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(232, 98, 61, 0.5)',
    borderRadius: radius.lg + 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  deadlineCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  deadlineNumber: {
    ...typography.h5,
    fontFamily: 'Baloo2_800ExtraBold',
    color: colors.primary,
  },
  deadlineText: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },

  // Consultant
  consultantCard: {
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: 14,
    padding: 14,
  },
  consultantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  consultantAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultantInfo: {
    flex: 1,
  },
  consultantName: {
    ...typography.body,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  consultantRole: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Quick actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: 16,
  },
  behavetWrap: {
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: 14,
  },
  trustWrap: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.fab,
  },
});
