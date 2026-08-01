import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, radius, layout } from '../theme';

interface TabToggleProps<T extends string> {
  tabs: { key: T; label: string }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

/**
 * Pill-shaped toggle for switching between 2-3 tab views.
 * Used in Journey (Before/In Transit) and Profile (Pets/Owner).
 */
export function TabToggle<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabToggleProps<T>) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onTabChange(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 14,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#E9E4D8',
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
});
