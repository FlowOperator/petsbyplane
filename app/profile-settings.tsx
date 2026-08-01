import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';
import { Card } from '../src/components/ui';
import { useAppState } from '../src/services/store';

/**
 * Profile Settings Screen — notification preferences and account actions.
 * From handoff: toggle switches for notifications, change password, log out, delete account.
 */
export default function ProfileSettingsScreen() {
  const { dispatch } = useAppState();
  const [journeyUpdates, setJourneyUpdates] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);
  const [offersNews, setOffersNews] = useState(false);

  const handleLogout = () => {
    // Alert.alert doesn't work on web, so just log out directly
    dispatch({ type: 'LOGOUT' });
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card>
          <ToggleRow
            label="Journey updates"
            value={journeyUpdates}
            onToggle={() => setJourneyUpdates(!journeyUpdates)}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Messages from consultant"
            value={messageNotifs}
            onToggle={() => setMessageNotifs(!messageNotifs)}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Offers & news"
            value={offersNews}
            onToggle={() => setOffersNews(!offersNews)}
          />
        </Card>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card>
          <TouchableOpacity style={styles.navRow} accessibilityRole="button">
            <Text style={styles.navRowText}>Change password</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.navRow} accessibilityRole="button">
            <Text style={styles.navRowText}>Privacy & terms</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Logout + Delete */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteLink}>
          <Text style={styles.deleteText}>Delete my account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle} accessibilityRole="switch" accessibilityState={{ checked: value }}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.togglePill, value && styles.togglePillActive]}>
        <View style={[styles.toggleDot, value && styles.toggleDotActive]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 20, paddingBottom: 12,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40 },

  sectionTitle: { ...typography.h5, color: colors.textPrimary, marginTop: 20, marginBottom: 10 },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14,
  },
  toggleLabel: { ...typography.body, color: colors.textPrimary },
  togglePill: {
    width: 44, height: 26, borderRadius: 13,
    backgroundColor: '#E4DFD4', justifyContent: 'center', paddingHorizontal: 3,
  },
  togglePillActive: { backgroundColor: colors.primary },
  toggleDot: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white,
  },
  toggleDotActive: { alignSelf: 'flex-end' },

  divider: { height: 1, backgroundColor: colors.divider },

  navRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14,
  },
  navRowText: { ...typography.body, color: colors.textPrimary },

  logoutBtn: {
    marginTop: 28, alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.borderStrong,
    borderRadius: radius.pill, paddingVertical: 14,
  },
  logoutText: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },

  deleteLink: { alignItems: 'center', marginTop: 16 },
  deleteText: { ...typography.caption, color: colors.primary },
});
