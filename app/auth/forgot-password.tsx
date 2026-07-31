import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.centeredContent}>
          <View style={styles.successIcon}>
            <Ionicons name="mail-outline" size={36} color={colors.primary} />
          </View>
          <Text style={styles.successTitle}>Check your inbox</Text>
          <Text style={styles.successSubtitle}>
            We've sent a password reset link to {email}. It may take a minute to arrive.
          </Text>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.push('/auth/signin')}
            accessibilityRole="link"
          >
            <Text style={styles.backLinkText}>← Back to sign in</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.headerArea}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password.
          </Text>
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

        <TouchableOpacity
          style={[styles.ctaButton, !email && styles.ctaDisabled]}
          onPress={() => setSent(true)}
          disabled={!email}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Send reset link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 20 },
  headerArea: { marginBottom: 28 },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton, marginBottom: 16,
  },
  title: { fontFamily: 'Baloo2_700Bold', fontSize: 24, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 6, lineHeight: 21 },
  fieldGroup: { marginBottom: 16 },
  input: {
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: 14, paddingHorizontal: 18,
    ...typography.body, color: colors.textPrimary, ...shadows.iconButton,
  },
  ctaButton: {
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 16, alignItems: 'center', ...shadows.button,
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { ...typography.button, color: colors.textPrimary },

  // Success state
  centeredContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  successIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: { fontFamily: 'Baloo2_700Bold', fontSize: 22, color: colors.textPrimary, marginBottom: 8 },
  successSubtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 21 },
  backLink: { marginTop: 24 },
  backLinkText: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.primary },
});
