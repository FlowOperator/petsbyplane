import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';

const AIRLINES = [
  { name: 'KLM Royal Dutch Airlines', hub: 'Amsterdam (AMS)', note: 'Excellent pet handling facilities at Schiphol. Accepts snub-nosed breeds with vet clearance. Strong Africa/Asia coverage via AMS.' },
  { name: 'Ethiopian Airlines', hub: 'Addis Ababa (ADD)', note: 'Best-value option for Southern Africa routes. No breed restrictions. Temperature-controlled cargo hold on all 787 aircraft.' },
  { name: 'Emirates', hub: 'Dubai (DXB)', note: 'Premium pet handling at DXB hub. Good Middle East, Asia, and Australasia connections. Strict crate ventilation requirements.' },
  { name: 'British Airways', hub: 'London (LHR)', note: 'Direct routes from LHR. Premium pricing but minimal transit stress. Some snub-nosed breed restrictions apply.' },
  { name: 'Cathay Pacific', hub: 'Hong Kong (HKG)', note: 'Copy to come from client — operational details being confirmed.' },
  { name: 'SriLankan Airlines', hub: 'Colombo (CMB)', note: 'Copy to come from client — operational details being confirmed.' },
];

export default function AirlinesScreen() {
  const { state } = useAppState();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Airlines & partners</Text>
        </View>

        <Text style={styles.intro}>
          We work with airlines that have proven pet-handling track records. Your consultant picks the right one based on your pet's breed, route, and travel conditions.
        </Text>

        {AIRLINES.map((airline, i) => (
          <Card key={i} style={styles.airlineCard}>
            <View style={styles.airlineHeader}>
              <View style={styles.airlineIcon}>
                <Ionicons name="airplane" size={16} color={colors.textSecondary} />
              </View>
              <View style={styles.airlineInfo}>
                <Text style={styles.airlineName}>{airline.name}</Text>
                <Text style={styles.airlineHub}>Hub: {airline.hub}</Text>
              </View>
            </View>
            <Text style={styles.airlineNote}>{airline.note}</Text>
          </Card>
        ))}

        {!state.hasBooking && (
          <Button title="Ready? Get a quote" onPress={() => router.push('/quote')} variant="primary" style={{ marginTop: 20 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, paddingBottom: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.iconButton },
  title: { ...typography.h2, color: colors.textPrimary },
  intro: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: 20 },

  airlineCard: { marginBottom: 10, padding: 16 },
  airlineHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  airlineIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  airlineInfo: { flex: 1 },
  airlineName: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  airlineHub: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  airlineNote: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
});
