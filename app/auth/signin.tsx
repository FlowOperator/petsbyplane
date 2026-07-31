import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, typography, radius, shadows, layout } from '../../src/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerArea}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to check on your pet's journey.</Text>
        </View>

        <View style={styles.fieldGroup}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={colors.textPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email"
          />
        </View>
        <View style={styles.fieldGroup}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textPlaceholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            accessibilityLabel="Password"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/auth/forgot-password')}
          style={styles.forgotRow}
          accessibilityRole="link"
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/auth/signup')} accessibilityRole="link">
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 40 },
  headerArea: { marginBottom: 28 },
  title: { fontFamily: 'Baloo2_700Bold', fontSize: 24, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 6 },
  fieldGroup: { marginBottom: 12 },
  input: {
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: 14, paddingHorizontal: 18,
    ...typography.body, color: colors.textPrimary, ...shadows.iconButton,
  },
  forgotRow: { alignSelf: 'flex-end', marginTop: 4, marginBottom: 20 },
  forgotText: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.primary },
  bottomArea: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 20 : 16, gap: 12,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  ctaButton: {
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 16, alignItems: 'center', ...shadows.button,
  },
  ctaText: { ...typography.button, color: colors.textPrimary },
  linkText: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  linkBold: { fontFamily: 'Nunito_700Bold', color: colors.primary },
});
