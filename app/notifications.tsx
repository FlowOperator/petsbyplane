import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';

interface Notification {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  time: string;
  priority?: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: 'alert-circle',
    title: 'Export Health Certificate due soon',
    body: 'Must be completed within 10 days of departure (by 31 Jul)',
    time: '2h ago',
    priority: true,
  },
  {
    id: '2',
    icon: 'checkmark-circle',
    title: 'Blood tests verified',
    body: 'All 7 blood tests for South Africa have been verified by your consultant.',
    time: '1 day ago',
  },
  {
    id: '3',
    icon: 'chatbubble',
    title: 'Sarah Whitfield sent a message',
    body: "Hi! Just confirming the import permit has come through from DAFF.",
    time: '2 days ago',
  },
  {
    id: '4',
    icon: 'cube',
    title: 'Crate delivered',
    body: "Darcy's IATA Size 4 crate has been delivered. Start acclimatisation!",
    time: '5 days ago',
  },
  {
    id: '5',
    icon: 'airplane',
    title: 'Flight confirmed',
    body: 'Ethiopian Airlines ET701, LHR → ADD → CPT, 10 Aug 2026',
    time: '1 week ago',
  },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NOTIFICATIONS.map((notif) => (
          <View
            key={notif.id}
            style={[styles.notifCard, notif.priority && styles.notifCardPriority]}
          >
            <View style={[styles.notifIcon, notif.priority && styles.notifIconPriority]}>
              <Ionicons
                name={notif.icon}
                size={18}
                color={notif.priority ? colors.primary : colors.textSecondary}
              />
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifTitle}>{notif.title}</Text>
              <Text style={styles.notifBody}>{notif.body}</Text>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40, gap: 10 },

  notifCard: {
    flexDirection: 'row', gap: 12,
    backgroundColor: colors.white, borderRadius: radius.xl,
    padding: 16, ...shadows.cardLight,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  notifCardPriority: { borderColor: colors.primaryBorder },
  notifIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center',
  },
  notifIconPriority: { backgroundColor: colors.primaryLight },
  notifContent: { flex: 1 },
  notifTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  notifBody: { ...typography.caption, color: colors.textSecondary, marginTop: 3, lineHeight: 18 },
  notifTime: { ...typography.tiny, color: colors.textMuted, marginTop: 6 },
});
