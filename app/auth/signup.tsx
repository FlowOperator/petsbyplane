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
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';

export default function SignUpScreen() {
  const [name, setName] = useState('');
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
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join thousands of pet owners who trust us with their precious cargo.
          </Text>
        </View>

        {/* SSO buttons */}
        <TouchableOpacity style={styles.ssoButton} accessibilityRole="button">
          <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
          <Text style={styles.ssoButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ssoButton} accessibilityRole="button">
          <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
          <Text style={styles.ssoButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form fields */}
        <View style={styles.fieldGroup}>
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor={colors.textPlaceholder}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            accessibilityLabel="Full name"
          />
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
      </ScrollView>

      {/* Bottom */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.replace('/quote')}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Create account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/auth/signin')} accessibilityRole="link">
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Sign in</Text>
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
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 6, lineHeight: 21 },

  ssoButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: 14, marginBottom: 10, ...shadows.iconButton,
  },
  ssoButtonText: { ...typography.body, fontFamily: 'Nunito_600SemiBold', color: colors.textPrimary },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { ...typography.caption, color: colors.textMuted, marginHorizontal: 12 },

  fieldGroup: { marginBottom: 12 },
  input: {
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: 14, paddingHorizontal: 18,
    ...typography.body, color: colors.textPrimary, ...shadows.iconButton,
  },

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
