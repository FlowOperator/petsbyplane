import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { colors, layout } from '../theme';

interface StickyFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Footer that sticks to the bottom of the screen.
 * On web, uses sticky positioning for better scroll behavior.
 * On native, uses absolute positioning.
 */
export function StickyFooter({ children, style }: StickyFooterProps) {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...(Platform.OS === 'web'
      ? ({
          position: 'sticky' as any,
          bottom: 0,
          zIndex: 10,
        } as any)
      : {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }),
  },
});
