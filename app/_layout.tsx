import React, { useCallback } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '../src/theme';
import { AppProvider } from '../src/services/AppProvider';
import { Ionicons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Minimal loading state while fonts load
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="paw" size={40} color="#E8623D" />
        <Text style={styles.loadingText}>Pets by Plane</Text>
      </View>
    );
  }

  return (
    <AppProvider>
      <View style={styles.outer}>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          />
        </View>
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.backgroundOuter,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    ...(Platform.OS === 'web' ? {
      maxWidth: 480,
      boxShadow: '0 0 40px rgba(46, 40, 34, 0.12)',
      overflow: 'hidden',
    } as any : {}),
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F1EEE7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 20,
    color: '#2E2822',
  },
});
