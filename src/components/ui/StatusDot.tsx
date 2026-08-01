import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme';

interface StatusDotProps {
  color?: string;
  size?: number;
  /** Animate a pulse effect (for "live" indicators) */
  pulse?: boolean;
}

/**
 * Small circular status indicator.
 * Used for online status, live tracking, milestone progress.
 */
export function StatusDot({
  color = colors.primary,
  size = 9,
  pulse = false,
}: StatusDotProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      {pulse && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              width: size * 2,
              height: size * 2,
              borderRadius: size,
              backgroundColor: color,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
      )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    zIndex: 1,
  },
  pulseRing: {
    position: 'absolute',
  },
});
