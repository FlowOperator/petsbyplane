import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors, radius, layout, shadows } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'highlighted' | 'outlined';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style;

  return (
    <View style={[styles.base, variantStyles[variant], flatStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: layout.cardPadding,
    ...shadows.card,
  },
});

const variantStyles: Record<string, ViewStyle> = {
  default: {},
  highlighted: {
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    shadowOpacity: 0,
    elevation: 0,
  },
};
