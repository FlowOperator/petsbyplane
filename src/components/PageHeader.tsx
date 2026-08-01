import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, layout } from '../theme';
import { BackButton } from './BackButton';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Show back button (default true) */
  showBack?: boolean;
  /** Override back navigation */
  onBack?: () => void;
  /** Right-side action element */
  right?: React.ReactNode;
}

/**
 * Reusable page header with back button, title, and optional subtitle.
 * Ensures consistent spacing and alignment across all screens.
 */
export function PageHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  right,
}: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && <BackButton onPress={onBack} />}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: layout.screenPaddingTop,
    paddingBottom: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textSecondary,
    marginTop: 1,
  },
  right: {},
});
