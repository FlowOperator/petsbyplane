import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';
import { Card } from '../src/components/ui';
import { useAppState } from '../src/services/store';

export default function SettingsScreen() {
  const { state, dispatch } = useAppState();
  const { owner } = state;
  const [mediaConsent, setMediaConsent] = useState(owner?.mediaConsent ?? true);

  const handleMediaConsentToggle = (value: boolean) => {
    setMediaConsent(value);
    if (owner) {
      dispatch({
        type: 'SET_OWNER',
        payload: { ...owner, mediaConsent: value },
      });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out? You can sign back in at any time.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'LOGOUT' });
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Language */}
        <Text style={styles.sectionTitle}>Language</Text>
        <Card>
          <TouchableOpacity style={styles.settingRow} accessibilityRole="button">
            <Ionicons name="language-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>App language</Text>
            <Text style={styles.settingValue}>English</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Privacy & Consent */}
        <Text style={styles.sectionTitle}>Privacy & consent</Text>
        <Card>
          <View style={styles.settingRow}>
            <Ionicons name="camera-outline" size={20} color={colors.textSecondary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Media consent</Text>
              <Text style={styles.settingDesc}>
                Allow photos/videos of your pet to be used for marketing
              </Text>
            </View>
            <Switch
              value={mediaConsent}
              onValueChange={handleMediaConsentToggle}
              trackColor={{ false: '#E4DFD4', true: colors.success }}
              thumbColor={colors.white}
              accessibilityLabel="Media consent toggle"
            />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} accessibilityRole="button">
            <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} accessibilityRole="button">
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card>
          <View style={styles.settingRow}>
            <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Push notifications</Text>
              <Text style={styles.settingDesc}>Milestone updates, deadlines, and messages</Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: '#E4DFD4', true: colors.success }}
              thumbColor={colors.white}
              accessibilityLabel="Push notifications toggle"
            />
          </View>
        </Card>

        {/* Help */}
        <Text style={styles.sectionTitle}>Help & support</Text>
        <Card>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => router.push('/about')}
            accessibilityRole="button"
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>About Pets by Plane</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} accessibilityRole="button">
            <Ionicons name="help-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>FAQ</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} accessibilityRole="button">
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Contact support</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card>
          <TouchableOpacity style={styles.settingRow} accessibilityRole="button">
            <Ionicons name="key-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Change password</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleLogout}
            accessibilityRole="button"
          >
            <Ionicons name="log-out-outline" size={20} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.primary }]}>Sign out</Text>
          </TouchableOpacity>
        </Card>

        <Text style={styles.version}>Pets by Plane v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingTop: 20, paddingBottom: 16,
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  title: { ...typography.h2, color: colors.textPrimary },

  sectionTitle: {
    ...typography.h5, color: colors.textPrimary,
    marginTop: 20, marginBottom: 8,
  },

  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14,
  },
  settingContent: { flex: 1 },
  settingLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  settingValue: { ...typography.bodySmall, color: colors.textSecondary },
  settingDesc: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.divider },

  version: {
    ...typography.tiny, color: colors.textMuted,
    textAlign: 'center', marginTop: 24,
  },
});
