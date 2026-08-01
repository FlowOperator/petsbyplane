import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Platform,
  StyleSheet,
} from 'react-native';

interface AccessibleTouchableProps extends TouchableOpacityProps {
  /** Descriptive label for screen readers */
  label: string;
  /** Role hint for assistive technology */
  role?: 'button' | 'link' | 'tab' | 'menuitem';
}

/**
 * TouchableOpacity with enforced accessibility props.
 * Adds web-specific focus styling and proper ARIA attributes.
 */
export function AccessibleTouchable({
  label,
  role = 'button',
  style,
  children,
  ...props
}: AccessibleTouchableProps) {
  return (
    <TouchableOpacity
      accessibilityLabel={label}
      accessibilityRole={role}
      activeOpacity={0.8}
      style={[styles.base, style]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    // On web, add focus-visible outline via CSS (handled by RNW)
    ...(Platform.OS === 'web'
      ? ({ cursor: 'pointer', outlineOffset: 2 } as any)
      : {}),
  },
});
