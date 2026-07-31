import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme';

interface StatusDotProps {
  color?: string;
  size?: number;
  pulse?: boolean;
}

export function StatusDot({
  color = colors.primary,
  size = 9,
  pulse = false,
}: StatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {},
});
