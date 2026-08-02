import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, ColorValue, Platform, Text } from 'react-native';
import { colors, shadows, typography } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../../src/services/store';

type TabIconName = 'home' | 'navigate' | 'document-text' | 'chatbubble' | 'person';

function TabIcon({ name, color, focused }: { name: TabIconName; color: ColorValue; focused: boolean }) {
  const iconName = focused ? name : (`${name}-outline` as any);
  return <Ionicons name={iconName} size={22} color={color as string} />;
}

function LockedTabIcon({ name }: { name: TabIconName }) {
  return (
    <View style={lockedStyles.container}>
      <Ionicons name={`${name}-outline` as any} size={22} color={colors.textDisabled} />
      <View style={lockedStyles.lockBadge}>
        <Ionicons name="lock-closed" size={8} color={colors.textMuted} />
      </View>
    </View>
  );
}

const lockedStyles = StyleSheet.create({
  container: { position: 'relative' },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: colors.border,
    borderRadius: 6,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function TabLayout() {
  const { state } = useAppState();
  const { hasBooking } = state;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: hasBooking ? colors.tabInactive : colors.textDisabled,
        tabBarLabelStyle: {
          ...typography.tabLabel,
          marginTop: 2,
        },
        tabBarStyle: {
          height: 82,
          paddingTop: 10,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          ...shadows.tabBar,
          ...(Platform.OS === 'web' ? { position: 'sticky' as any, bottom: 0 } : {}),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ color, focused }) =>
            hasBooking ? (
              <TabIcon name="navigate" color={color} focused={focused} />
            ) : (
              <LockedTabIcon name="navigate" />
            ),
          tabBarLabelStyle: {
            ...typography.tabLabel,
            marginTop: 2,
            color: hasBooking ? undefined : colors.textDisabled,
          },
        }}
        listeners={() => ({
          tabPress: (e) => {
            if (!hasBooking) e.preventDefault();
          },
        })}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color, focused }) =>
            hasBooking ? (
              <TabIcon name="document-text" color={color} focused={focused} />
            ) : (
              <LockedTabIcon name="document-text" />
            ),
          tabBarLabelStyle: {
            ...typography.tabLabel,
            marginTop: 2,
            color: hasBooking ? undefined : colors.textDisabled,
          },
        }}
        listeners={() => ({
          tabPress: (e) => {
            if (!hasBooking) e.preventDefault();
          },
        })}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) =>
            hasBooking ? (
              <TabIcon name="chatbubble" color={color} focused={focused} />
            ) : (
              <LockedTabIcon name="chatbubble" />
            ),
          tabBarLabelStyle: {
            ...typography.tabLabel,
            marginTop: 2,
            color: hasBooking ? undefined : colors.textDisabled,
          },
        }}
        listeners={() => ({
          tabPress: (e) => {
            if (!hasBooking) e.preventDefault();
          },
        })}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
