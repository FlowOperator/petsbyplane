import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, radius, typography, shadows } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'small';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  icon,
  style,
}: ButtonProps) {
  const buttonStyles: ViewStyle[] = [
    styles.base,
    sizeStyles[size],
    variantStyles[variant],
    disabled && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.text,
    size === 'small' ? typography.buttonSmall : typography.button,
    variantTextStyles[variant],
    disabled && styles.disabledText,
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textPrimary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    gap: 8,
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

const sizeStyles: Record<string, ViewStyle> = {
  default: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  small: {
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
};

const variantStyles: Record<string, ViewStyle> = {
  primary: {
    backgroundColor: colors.secondary,
    ...shadows.button,
  },
  secondary: {
    backgroundColor: colors.primary,
    ...shadows.primaryButton,
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
};

const variantTextStyles: Record<string, TextStyle> = {
  primary: {
    color: colors.textPrimary,
  },
  secondary: {
    color: colors.white,
  },
  outline: {
    color: colors.textPrimary,
  },
  ghost: {
    color: colors.primary,
  },
};
