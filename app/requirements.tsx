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
import { useRequirements } from '../src/hooks/useRequirements';
import { RequirementChecklistItem } from '../src/services/rulesEngine';

/**
 * Full requirements checklist screen.
 * Shows all compliance requirements for the active trip,
 * calculated by the rules engine with deadlines.
 */
export default function RequirementsScreen() {
  const { state } = useAppState();
  const { activeTrip, pets } = state;
  const { checklist, summary } = useRequirements();

  const pet = pets.find((p) => p.id === activeTrip?.petId);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Requirements</Text>
          <Text style={styles.subtitle}>
            {pet?.name ? `${pet.name}'s compliance checklist` : 'Compliance checklist'}
          </Text>
        </View>
      </View>

      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{summary.totalRequired}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        {summary.overdue > 0 && (
          <View style={[styles.summaryItem, styles.summaryOverdue]}>
            <Text style={[styles.summaryNumber, { color: colors.primary }]}>{summary.overdue}</Text>
            <Text style={styles.summaryLabel}>Overdue</Text>
          </View>
        )}
        {summary.urgent > 0 && (
          <View style={[styles.summaryItem, styles.summaryUrgent]}>
            <Text style={[styles.summaryNumber, { color: colors.warning }]}>{summary.urgent}</Text>
            <Text style={styles.summaryLabel}>Urgent</Text>
          </View>
        )}
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: colors.success }]}>{summary.upcoming}</Text>
          <Text style={styles.summaryLabel}>Upcoming</Text>
        </View>
      </View>

      {/* Checklist */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {checklist.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>
              No requirements found. Start a booking to see your compliance checklist.
            </Text>
          </Card>
        ) : (
          checklist.map((item) => (
            <RequirementCard key={item.requirement.id} item={item} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function RequirementCard({ item }: { item: RequirementChecklistItem }) {
  const { requirement, deadline, daysRemaining, isOverdue, isUrgent } = item;

  const getBadge = () => {
    if (isOverdue) return { label: `${Math.abs(daysRemaining)}d overdue`, variant: 'error' as const };
    if (isUrgent) return { label: `${daysRemaining}d left`, variant: 'warning' as const };
    return { label: `${daysRemaining}d`, variant: 'info' as const };
  };

  const badge = getBadge();

  return (
    <Card
      style={styles.reqCard}
      variant={isOverdue ? 'highlighted' : 'default'}
    >
      <View style={styles.reqHeader}>
        <View style={styles.reqTitleRow}>
          <Text style={styles.reqTitle}>{requirement.title}</Text>
          <Badge label={badge.label} variant={badge.variant} />
        </View>
        {requirement.mandatory && (
          <Text style={styles.mandatoryLabel}>MANDATORY</Text>
        )}
      </View>

      <Text style={styles.reqDesc}>{requirement.description}</Text>

      <View style={styles.reqMeta}>
        <View style={styles.reqMetaRow}>
          <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
          <Text style={styles.reqMetaText}>
            Deadline: {new Date(deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
        {requirement.validityWindowDays && (
          <View style={styles.reqMetaRow}>
            <Ionicons name="time-outline" size={12} color={colors.textMuted} />
            <Text style={styles.reqMetaText}>
              Valid for {requirement.validityWindowDays} days once done
            </Text>
          </View>
        )}
        <View style={styles.reqMetaRow}>
          <Ionicons name="location-outline" size={12} color={colors.textMuted} />
          <Text style={styles.reqMetaText}>
            Fulfilled: {requirement.fulfilledWhere === 'origin' ? 'In UK (pre-departure)' :
                        requirement.fulfilledWhere === 'destination' ? 'At destination' : 'Either'}
          </Text>
        </View>
        {requirement.authoritySource && (
          <View style={styles.reqMetaRow}>
            <Ionicons name="shield-outline" size={12} color={colors.textMuted} />
            <Text style={styles.reqMetaText}>Source: {requirement.authoritySource}</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 20, paddingBottom: 12,
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  headerInfo: { flex: 1 },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  // Summary
  summaryBar: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPaddingHorizontal,
    gap: 8, marginBottom: 16,
  },
  summaryItem: {
    flex: 1, alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.md,
    paddingVertical: 10, ...shadows.iconButton,
  },
  summaryOverdue: { borderWidth: 1.5, borderColor: colors.primaryBorder },
  summaryUrgent: { borderWidth: 1.5, borderColor: 'rgba(239,194,108,0.6)' },
  summaryNumber: { fontFamily: 'Baloo2_700Bold', fontSize: 18, color: colors.textPrimary },
  summaryLabel: { ...typography.tiny, color: colors.textSecondary, marginTop: 1 },

  // List
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 40, gap: 12,
  },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', paddingVertical: 20 },

  // Requirement card
  reqCard: { padding: 16 },
  reqHeader: { marginBottom: 8 },
  reqTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: 8,
  },
  reqTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, flex: 1, lineHeight: 20 },
  mandatoryLabel: {
    ...typography.tiny, fontFamily: 'Nunito_700Bold',
    color: colors.primary, letterSpacing: 0.5, marginTop: 4,
  },
  reqDesc: { ...typography.caption, color: colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  reqMeta: { gap: 4 },
  reqMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reqMetaText: { ...typography.tiny, color: colors.textMuted },
});
