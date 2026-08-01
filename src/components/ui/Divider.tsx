import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme';

interface DividerProps {
  /** Horizontal margins */
  margin?: number;
  style?: ViewStyle;
}

/**
 * Simple horizontal divider line.
 */
export function Divider({ margin = 0, style }: DividerProps) {
  return (
    <View
      style={[
        styles.divider,
        margin > 0 && { marginHorizontal: margin },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 4,
  },
});
