import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';

export default function CratesScreen() {
  const { state } = useAppState();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Travel crates</Text>
        </View>

        <Text style={styles.intro}>
          Your pet travels in an IATA-compliant crate. Here's what you need to know about sizing, types, and getting your pet comfortable before travel day.
        </Text>

        <Text style={styles.sectionTitle}>How to measure your pet</Text>
        <Card style={styles.measureCard}>
          <MeasureRow label="Length" desc="Nose to base of tail (not tip)" />
          <MeasureRow label="Height" desc="Floor to top of head/ears (standing)" />
          <MeasureRow label="Width" desc="Widest point (usually shoulders)" />
          <Text style={styles.formula}>Crate must be at least: length + 10cm, height + 10cm, width + 10cm</Text>
        </Card>

        <Text style={styles.sectionTitle}>Crate types</Text>
        <Card>
          <Text style={styles.crateType}>Plastic (most common)</Text>
          <Text style={styles.crateDesc}>Rigid shell, ventilation on all sides. Required by most airlines. Sizes 1–7 cover Chihuahuas to Great Danes.</Text>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Text style={styles.crateType}>Wooden (large dogs / special routes)</Text>
          <Text style={styles.crateDesc}>Custom-built for very large or heavy dogs, or routes with specific airline requirements. Always IATA-compliant.</Text>
        </Card>

        <Text style={styles.sectionTitle}>Acclimatisation tips</Text>
        <View style={styles.tipsList}>
          <TipRow text="Leave the crate open at home for 2–3 weeks before travel" />
          <TipRow text="Feed meals inside the crate so your pet associates it with positive experiences" />
          <TipRow text="Add a familiar blanket or worn t-shirt for comfort" />
          <TipRow text="Practice closing the door for short periods, gradually increasing duration" />
          <TipRow text="Never force your pet in — patience builds confidence" />
        </View>

        <Text style={styles.sectionTitle}>FAQ</Text>
        <Card>
          <FAQ q="Can I use my own crate?" a="Yes, if it meets IATA standards. Your consultant will check the dimensions and condition." />
          <FAQ q="What if my pet is between sizes?" a="Always go up a size. Your pet must be able to stand, turn around, and lie down comfortably." />
          <FAQ q="Do you supply crates?" a="Yes — we deliver the correctly sized IATA crate to your door, usually 2–3 weeks before travel." />
        </Card>

        {!state.hasBooking && (
          <Button title="Ready? Get a quote" onPress={() => router.push('/quote')} variant="primary" style={{ marginTop: 24 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MeasureRow({ label, desc }: { label: string; desc: string }) {
  return (
    <View style={styles.measureRow}>
      <Text style={styles.measureLabel}>{label}</Text>
      <Text style={styles.measureDesc}>{desc}</Text>
    </View>
  );
}

function TipRow({ text }: { text: string }) {
  return (
    <View style={styles.tipRow}>
      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <View style={styles.faqItem}>
      <Text style={styles.faqQ}>{q}</Text>
      <Text style={styles.faqA}>{a}</Text>
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

  measureCard: { padding: 16 },
  measureRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.divider },
  measureLabel: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  measureDesc: { ...typography.caption, color: colors.textSecondary, flex: 1, textAlign: 'right' },
  formula: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.primary, marginTop: 12 },

  crateType: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, marginBottom: 4 },
  crateDesc: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },

  tipsList: { gap: 8 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipText: { ...typography.bodySmall, color: colors.textPrimary, flex: 1, lineHeight: 20 },

  faqItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.divider },
  faqQ: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, marginBottom: 4 },
  faqA: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
});
