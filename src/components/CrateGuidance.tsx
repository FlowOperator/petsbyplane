import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows } from '../theme';
import { Card } from './ui';

/**
 * Crate acclimatisation guidance & prohibited items list (Section 6.5).
 * Shown in the Profile > Crate section once a crate is assigned.
 */
export function CrateGuidance() {
  return (
    <View style={styles.container}>
      {/* Acclimatisation tips */}
      <Card style={styles.tipsCard}>
        <Text style={styles.title}>Getting your pet comfortable</Text>
        <Text style={styles.subtitle}>
          Your crate will be delivered in advance. Here's how to prepare:
        </Text>
        <View style={styles.tipsList}>
          <TipItem
            number="1"
            text="Place the crate in a familiar room with the door open. Let your pet explore it."
          />
          <TipItem
            number="2"
            text="Put their favourite blanket and a worn item of your clothing inside."
          />
          <TipItem
            number="3"
            text="Feed meals inside the crate to build positive association."
          />
          <TipItem
            number="4"
            text="Gradually close the door for short periods, building up to a few hours."
          />
          <TipItem
            number="5"
            text="Aim for at least 2 weeks of acclimatisation before travel day."
          />
        </View>
      </Card>

      {/* What cannot go in the crate */}
      <Card style={styles.warningCard}>
        <View style={styles.warningHeader}>
          <Ionicons name="alert-circle" size={18} color={colors.primary} />
          <Text style={styles.warningTitle}>Cannot go in the crate</Text>
        </View>
        <Text style={styles.warningSubtitle}>
          These items will be flagged and removed at check-in, causing delays:
        </Text>
        <View style={styles.prohibitedList}>
          <ProhibitedItem text="Choke hazards (small toys, bones)" />
          <ProhibitedItem text="Loose toys that could block airways" />
          <ProhibitedItem text="Tracking devices or GPS collars" />
          <ProhibitedItem text="Cameras or electronic devices" />
          <ProhibitedItem text="Food (water dish only, attached to door)" />
          <ProhibitedItem text="Leashes or harnesses (separate bag)" />
        </View>
      </Card>

      {/* Crate type comparison */}
      <Card>
        <Text style={styles.title}>Plastic vs Wood crates</Text>
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonCol}>
            <Text style={styles.comparisonTitle}>Plastic</Text>
            <Text style={styles.comparisonPro}>✓ Lighter weight</Text>
            <Text style={styles.comparisonPro}>✓ Good for shorter routes</Text>
            <Text style={styles.comparisonCon}>× Can cost more on volume</Text>
            <Text style={styles.comparisonCon}>× Less durable for large breeds</Text>
          </View>
          <View style={styles.comparisonDivider} />
          <View style={styles.comparisonCol}>
            <Text style={styles.comparisonTitle}>Wood</Text>
            <Text style={styles.comparisonPro}>✓ Sturdier for large/heavy pets</Text>
            <Text style={styles.comparisonPro}>✓ Better ventilation options</Text>
            <Text style={styles.comparisonCon}>× Heavier (higher cargo cost)</Text>
            <Text style={styles.comparisonCon}>× Not reusable for returns</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

function TipItem({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.tipRow}>
      <View style={styles.tipNumber}>
        <Text style={styles.tipNumberText}>{number}</Text>
      </View>
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

function ProhibitedItem({ text }: { text: string }) {
  return (
    <View style={styles.prohibitedRow}>
      <Ionicons name="close-circle" size={14} color={colors.primary} />
      <Text style={styles.prohibitedText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  tipsCard: { padding: 18 },
  title: { ...typography.h5, color: colors.textPrimary, marginBottom: 4 },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginBottom: 14, lineHeight: 18 },
  tipsList: { gap: 12 },
  tipRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  tipNumber: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  tipNumberText: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.primary },
  tipText: { ...typography.bodySmall, color: colors.textPrimary, flex: 1, lineHeight: 18 },

  warningCard: { padding: 18 },
  warningHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  warningTitle: { ...typography.h5, color: colors.textPrimary },
  warningSubtitle: { ...typography.caption, color: colors.textSecondary, marginBottom: 12, lineHeight: 18 },
  prohibitedList: { gap: 8 },
  prohibitedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  prohibitedText: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },

  comparisonRow: { flexDirection: 'row', marginTop: 12, gap: 12 },
  comparisonCol: { flex: 1, gap: 4 },
  comparisonDivider: { width: 1, backgroundColor: colors.divider },
  comparisonTitle: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, marginBottom: 4 },
  comparisonPro: { ...typography.tiny, color: colors.success, lineHeight: 16 },
  comparisonCon: { ...typography.tiny, color: colors.textMuted, lineHeight: 16 },
});
