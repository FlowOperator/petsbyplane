import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';

export default function VaccinationsScreen() {
  const { state } = useAppState();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Vaccinations & tests</Text>
        </View>

        <Text style={styles.intro}>
          Most destinations require rabies vaccination and some additional blood tests. Timing is critical — some tests need to be done months in advance.
        </Text>

        <Text style={styles.sectionTitle}>Core requirements (dogs)</Text>
        <Card>
          <ReqRow title="Rabies vaccination" timing="30+ days before travel (most destinations)" detail="Must be administered AFTER microchip implant. Valid for 3 years." />
          <ReqRow title="Titre test (RNATT)" timing="3 months before travel" detail="Blood test proving rabies antibody level ≥ 0.5 IU/ml. Required for Australia, Japan, many African & Asian destinations." />
          <ReqRow title="DHPP / core vaccines" timing="Up to date" detail="Distemper, Hepatitis, Parvovirus, Parainfluenza — not always legally required but strongly recommended." />
        </Card>

        <Text style={styles.sectionTitle}>Core requirements (cats)</Text>
        <Card>
          <ReqRow title="Rabies vaccination" timing="21+ days before travel" detail="Same as dogs — must follow microchip implant." />
          <ReqRow title="Titre test" timing="Where required by destination" detail="Same 0.5 IU/ml threshold. Required for Australia, Japan, some Asian destinations." />
          <ReqRow title="FVRCP" timing="Up to date" detail="Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia." />
        </Card>

        <Text style={styles.sectionTitle}>Destination-specific blood tests</Text>
        <Card>
          <ReqRow title="South Africa" timing="Within 30 days of departure" detail="7 blood tests required including Babesia Gibsoni IFAT, Ehrlichia Canis, Brucella Canis." />
          <ReqRow title="Australia" timing="180-day wait after titre" detail="Titre test plus 180-day residency requirement in an approved country." />
          <ReqRow title="Singapore / Taiwan" timing="Varies" detail="Specific blood panels required — your consultant confirms the exact requirements." />
        </Card>

        <Text style={styles.sectionTitle}>Important timing notes</Text>
        <View style={styles.notesList}>
          <NoteRow text="Microchip must be implanted BEFORE any vaccination — otherwise the vaccination doesn't count" />
          <NoteRow text="Titre test blood draw can only happen 30+ days after rabies vaccination" />
          <NoteRow text="Some results take 2–4 weeks from the lab — plan ahead" />
          <NoteRow text="Your consultant will build a timeline specific to your travel date" />
        </View>

        {!state.hasBooking && (
          <Button title="Ready? Get a quote" onPress={() => router.push('/quote')} variant="primary" style={{ marginTop: 24 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ReqRow({ title, timing, detail }: { title: string; timing: string; detail: string }) {
  return (
    <View style={styles.reqRow}>
      <Text style={styles.reqTitle}>{title}</Text>
      <Text style={styles.reqTiming}>{timing}</Text>
      <Text style={styles.reqDetail}>{detail}</Text>
    </View>
  );
}

function NoteRow({ text }: { text: string }) {
  return (
    <View style={styles.noteRow}>
      <Ionicons name="alert-circle-outline" size={14} color={colors.warning} />
      <Text style={styles.noteText}>{text}</Text>
    </View>
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
  sectionTitle: { fontFamily: 'Baloo2_700Bold', fontSize: 15, color: colors.textPrimary, marginTop: 20, marginBottom: 10 },

  reqRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.divider },
  reqTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  reqTiming: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.primary, marginTop: 2 },
  reqDetail: { ...typography.caption, color: colors.textSecondary, marginTop: 4, lineHeight: 17 },

  notesList: { gap: 8 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  noteText: { ...typography.bodySmall, color: colors.textPrimary, flex: 1, lineHeight: 20 },
});
