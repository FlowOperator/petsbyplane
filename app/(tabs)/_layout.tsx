import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, ColorValue } from 'react-native';
import { colors, shadows, typography } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

type TabIconName = 'home' | 'navigate' | 'document-text' | 'chatbubble' | 'person';

function TabIcon({ name, color, focused }: { name: TabIconName; color: ColorValue; focused: boolean }) {
  const iconName = focused ? name : (`${name}-outline` as any);
  return <Ionicons name={iconName} size={22} color={color as string} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="navigate" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="document-text" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="chatbubble" color={color} focused={focused} />
          ),
        }}
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
