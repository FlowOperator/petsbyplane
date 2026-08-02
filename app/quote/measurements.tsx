import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card } from '../../src/components/ui';
import { useQuoteFlow } from '../../src/services/quoteContext';

const DogImage = require('../../assets/dog.svg');

/**
 * Dog Measurements Screen — Step between form and reassurance.
 * Only shown when petType === 'dog'. Captures the 4 measurements
 * needed for IATA crate sizing (Section 6.5 of spec).
 *
 * Measurements: nose-to-tail length, height to elbow, width at widest,
 * standing height (top of head/ears).
 *
 * Per spec: liability warning — wrong measurements = owner pays for replacement crate.
 */

interface MeasurementField {
  key: string;
  label: string;
  description: string;
  placeholder: string;
}

const FIELD_COLORS = ['#E8623D', '#2B3A67', '#7B5EA7', '#4C8B6B'] as const;

const FIELDS: MeasurementField[] = [
  {
    key: 'lengthNoseToTail',
    label: 'A',
    description: 'Length of animal from nose to root of tail',
    placeholder: 'e.g. 75',
  },
  {
    key: 'heightToElbow',
    label: 'B',
    description: 'Height from ground to elbow joint',
    placeholder: 'e.g. 32',
  },
  {
    key: 'widthAtWidest',
    label: 'C',
    description: 'Width across widest section (usually shoulders or head)',
    placeholder: 'e.g. 38',
  },
  {
    key: 'standingHeight',
    label: 'D',
    description: 'Height in a natural standing position — from soles of feet to the tallest point (tip of ears or top of head)',
    placeholder: 'e.g. 60',
  },
];

export default function MeasurementsScreen() {
  const { quoteDispatch } = useQuoteFlow();
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    // Only allow numbers
    const numeric = value.replace(/[^0-9]/g, '');
    setValues((prev) => ({ ...prev, [key]: numeric }));
  };

  const allFilled = FIELDS.every((f) => values[f.key] && parseInt(values[f.key]) > 0);

  const handleContinue = () => {
    quoteDispatch({
      type: 'SET_MEASUREMENTS',
      payload: {
        lengthNoseToTail: parseInt(values.lengthNoseToTail) || 0,
        heightToElbow: parseInt(values.heightToElbow) || 0,
        widthAtWidest: parseInt(values.widthAtWidest) || 0,
        standingHeight: parseInt(values.standingHeight) || 0,
      },
    });
    router.push('/quote/flight-results');
  };

  const handleSkip = () => {
    router.push('/quote/flight-results');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Back */}
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={16} color={colors.primary} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Measure your dog</Text>
        <Text style={styles.subtitle}>
          We use these to size the right IATA-compliant travel crate. All measurements in centimetres.
        </Text>

        {/* Dog illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={DogImage}
            style={styles.dogImage}
            resizeMode="contain"
            accessibilityLabel="Dog illustration showing measurement points"
          />
        </View>

        {/* Illustration hint */}
        <Card style={styles.hintCard}>
          <View style={styles.hintRow}>
            <Ionicons name="resize-outline" size={20} color={colors.primary} />
            <Text style={styles.hintText}>
              Have your dog standing on all fours on a flat surface. Use a tape measure or ruler held against a wall for height.
            </Text>
          </View>
        </Card>

        {/* Measurement fields */}
        <View style={styles.fieldsContainer}>
          {FIELDS.map((field, index) => (
            <View key={field.key} style={styles.fieldGroup}>
              <View style={styles.fieldHeader}>
                <View style={[styles.fieldBadge, { backgroundColor: FIELD_COLORS[index] }]}>
                  <Text style={styles.fieldBadgeText}>{field.label}</Text>
                </View>
                <Text style={styles.fieldDescription}>{field.description}</Text>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textPlaceholder}
                  value={values[field.key] || ''}
                  onChangeText={(v) => handleChange(field.key, v)}
                  keyboardType="numeric"
                  accessibilityLabel={`Measurement ${field.label}: ${field.description}, in centimetres`}
                  maxLength={3}
                />
                <Text style={styles.unitLabel}>cm</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Liability warning */}
        <View style={styles.warningCard}>
          <Ionicons name="warning-outline" size={18} color={colors.warning} />
          <Text style={styles.warningText}>
            If measurements are incorrect and a different crate is needed, the replacement cost is the owner's responsibility. Take your time — accuracy matters.
          </Text>
        </View>

        {/* Skip option */}
        <TouchableOpacity onPress={handleSkip} style={styles.skipRow}>
          <Text style={styles.skipText}>
            I'll measure later — use breed averages for now
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[styles.ctaButton, !allFilled && styles.ctaButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={!allFilled}
        >
          <Text style={styles.ctaText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  backRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 16, paddingBottom: 8,
  },
  backText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.primary },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: layout.screenPaddingHorizontal, paddingBottom: 120 },

  title: { fontFamily: 'Baloo2_700Bold', fontSize: 22, color: colors.textPrimary, marginTop: 8 },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 4, marginBottom: 16, lineHeight: 21 },

  imageContainer: {
    alignItems: 'center', marginBottom: 16,
  },
  dogImage: {
    width: 160, height: 140,
  },

  hintCard: { padding: 14, marginBottom: 20 },
  hintRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  hintText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, lineHeight: 19 },

  fieldsContainer: { gap: 18 },
  fieldGroup: { marginBottom: 0 },
  fieldHeader: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8,
  },
  fieldBadge: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  fieldBadgeText: {
    fontFamily: 'Nunito_700Bold', fontSize: 14, color: colors.white,
  },
  fieldDescription: {
    ...typography.body, color: colors.textPrimary, flex: 1, lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: 14, paddingHorizontal: 18,
    ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary,
    ...shadows.iconButton,
  },
  unitLabel: {
    ...typography.body, fontFamily: 'Nunito_600SemiBold', color: colors.textMuted, width: 28,
  },

  warningCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: colors.warningLight, borderRadius: radius.lg,
    padding: 14, marginTop: 20,
  },
  warningText: {
    ...typography.tiny, color: colors.warning, flex: 1, lineHeight: 17,
    fontFamily: 'Nunito_600SemiBold',
  },

  skipRow: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  skipText: { ...typography.bodySmall, color: colors.primary, fontFamily: 'Nunito_600SemiBold' },

  bottomArea: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border,
  },
  ctaButton: {
    backgroundColor: colors.secondary, borderRadius: radius.pill,
    paddingVertical: 16, alignItems: 'center', ...shadows.button,
  },
  ctaButtonDisabled: { opacity: 0.5 },
  ctaText: { ...typography.button, color: colors.textPrimary },
});
