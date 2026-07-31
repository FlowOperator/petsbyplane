import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, layout } from '../theme';

interface ProgressStepsProps {
  /** Total number of steps */
  total: number;
  /** Current step (1-indexed) */
  current: number;
  /** Step labels (optional) */
  labels?: string[];
}

/**
 * Segmented progress bar for multi-step flows.
 * Used in the quote funnel (4 steps).
 */
export function ProgressSteps({ total, current, labels }: ProgressStepsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.barRow}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              i < current && styles.segmentActive,
            ]}
          />
        ))}
      </View>
      {labels && labels.length > 0 && (
        <View style={styles.labelRow}>
          {labels.map((label, i) => (
            <Text
              key={i}
              style={[
                styles.label,
                i < current && styles.labelActive,
                i === current - 1 && styles.labelCurrent,
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 16,
    marginBottom: 14,
  },
  barRow: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E4DFD4',
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  labelRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  label: {
    flex: 1,
    ...typography.tiny,
    color: colors.textMuted,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.textSecondary,
  },
  labelCurrent: {
    fontFamily: 'Nunito_700Bold',
    color: colors.primary,
  },
});
