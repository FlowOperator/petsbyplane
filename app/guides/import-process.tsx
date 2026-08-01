import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';

export default function ImportProcessScreen() {
  const { state } = useAppState();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>UK import process</Text>
        </View>

        <Text style={styles.intro}>
          All pets arriving in the UK go through the Animal Reception Centre (ARC). Here's what to expect.
        </Text>

        <StepCard number="1" title="Before arrival" body="Your pet needs a microchip, valid rabies vaccination (21+ days old), and a health certificate issued within 10 days of travel. Titre test may be required depending on origin country." />
        <StepCard number="2" title="Landing & ARC check-in" body="Your pet is transferred to the ARC at the arrival airport. The process typically takes 4–8 hours. Arrivals after 16:30 incur additional overnight fees." />
        <StepCard number="3" title="Vet inspection & document check" body="An official vet verifies microchip number matches certificates, checks vaccination dates, and confirms the pet is healthy to enter the UK." />
        <StepCard number="4" title="Customs clearance" body="HMRC clearance is handled by our agent. Any duty or import fees are covered in the destination arrival services add-on." />
        <StepCard number="5" title="Collection or delivery" body="You collect your pet from the ARC, or we deliver anywhere in the UK. Collection is available the same day if paperwork clears before 16:00." />

        <Card style={styles.noteCard}>
          <View style={styles.noteRow}>
            <Ionicons name="information-circle" size={16} color={colors.warning} />
            <Text style={styles.noteText}>
              Heathrow and Gatwick handle commercial pet imports. Manchester cannot accept commercial imports.
            </Text>
          </View>
        </Card>

        {!state.hasBooking && (
          <Button title="Ready? Get a quote" onPress={() => router.push('/quote')} variant="primary" style={{ marginTop: 16 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StepCard({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepCircle}><Text style={styles.stepNumber}>{number}</Text></View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepBody}>{body}</Text>
      </View>
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

  stepCard: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepNumber: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.white },
  stepContent: { flex: 1, backgroundColor: colors.white, borderRadius: radius.xl, padding: 14, ...shadows.cardLight },
  stepTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, marginBottom: 4 },
  stepBody: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },

  noteCard: { padding: 14, marginTop: 8 },
  noteRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  noteText: { ...typography.caption, color: colors.textSecondary, flex: 1, lineHeight: 18 },
});
