import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography, radius, shadows } from '../theme';

interface AcceptanceCardProps {
  title: string;
  summary: string;
  fullText: string;
  linkLabel?: string;
  onAcceptChange?: (accepted: boolean) => void;
}

/**
 * Reusable T&Cs / consent acceptance card.
 * Models the real requirement: explicit consent with timestamp + version tracking.
 */
export function AcceptanceCard({
  title,
  summary,
  fullText,
  linkLabel = 'View full terms',
  onAcceptChange,
}: AcceptanceCardProps) {
  const [accepted, setAccepted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleToggleAccept = () => {
    const newValue = !accepted;
    setAccepted(newValue);
    onAcceptChange?.(newValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.checkRow}
          onPress={handleToggleAccept}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
          accessibilityLabel={`Accept ${title}`}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.acceptLabel}>I accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Hide full terms' : linkLabel}
        >
          <Text style={styles.linkText}>
            {expanded ? 'Hide full terms' : linkLabel}
          </Text>
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={styles.expandedContainer}>
          <ScrollView
            style={styles.expandedScroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            <Text style={styles.fullText}>{fullText}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 18,
    paddingHorizontal: 20,
    ...shadows.cardLight,
  },
  title: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  summary: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(46, 40, 34, 0.3)',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderWidth: 0,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  acceptLabel: {
    ...typography.caption,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  linkText: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.primary,
  },
  expandedContainer: {
    marginTop: 12,
    backgroundColor: '#F7F4EC',
    borderRadius: radius.md,
    padding: 12,
    maxHeight: 140,
  },
  expandedScroll: {
    maxHeight: 116,
  },
  fullText: {
    ...typography.tiny,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
