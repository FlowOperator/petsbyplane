import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';
import { Card, Button } from '../src/components/ui';
import { useAppState } from '../src/services/store';
import { DogMeasurements } from '../src/types';

/**
 * Dog Measurement Capture Screen (Section 6.5)
 * 4 measurements: length (nose to tail), height to elbow,
 * width at widest, standing height.
 * Not required for cats.
 */

interface MeasurementField {
  key: keyof DogMeasurements;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
}

const FIELDS: MeasurementField[] = [
  {
    key: 'lengthNoseToTail',
    label: 'Length',
    description: 'Nose to base of tail (not tip)',
    icon: 'resize-outline',
    placeholder: 'e.g. 75',
  },
  {
    key: 'heightToElbow',
    label: 'Height to elbow',
    description: 'Ground to the elbow joint',
    icon: 'arrow-up-outline',
    placeholder: 'e.g. 32',
  },
  {
    key: 'widthAtWidest',
    label: 'Width',
    description: 'Widest point (usually shoulders)',
    icon: 'swap-horizontal-outline',
    placeholder: 'e.g. 38',
  },
  {
    key: 'standingHeight',
    label: 'Standing height',
    description: 'Ground to top of head/ears (standing naturally)',
    icon: 'arrow-up',
    placeholder: 'e.g. 60',
  },
];

export default function MeasurementsScreen() {
  const { state, dispatch } = useAppState();
  const pet = state.pets.find((p) => p.id === state.activeTrip?.petId);

  const [measurements, setMeasurements] = useState<Record<string, string>>({
    lengthNoseToTail: pet?.measurements?.lengthNoseToTail?.toString() || '',
    heightToElbow: pet?.measurements?.heightToElbow?.toString() || '',
    widthAtWidest: pet?.measurements?.widthAtWidest?.toString() || '',
    standingHeight: pet?.measurements?.standingHeight?.toString() || '',
  });

  const handleSave = () => {
    const parsed: DogMeasurements = {
      lengthNoseToTail: parseFloat(measurements.lengthNoseToTail) || 0,
      heightToElbow: parseFloat(measurements.heightToElbow) || 0,
      widthAtWidest: parseFloat(measurements.widthAtWidest) || 0,
      standingHeight: parseFloat(measurements.standingHeight) || 0,
    };

    // Validate all fields have values
    if (Object.values(parsed).some((v) => v === 0)) {
      Alert.alert('Missing measurements', 'Please fill in all four measurements.');
      return;
    }

    if (pet) {
      dispatch({
        type: 'UPDATE_PET',
        payload: { ...pet, measurements: parsed },
      });
    }

    Alert.alert(
      'Measurements saved',
      'Your consultant will confirm crate sizing based on these measurements.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
          <View>
            <Text style={styles.title}>Measurements</Text>
            <Text style={styles.subtitle}>{pet?.name || 'Your dog'}'s travel crate sizing</Text>
          </View>
        </View>

        {/* Liability warning */}
        <View style={styles.warningCard}>
          <Ionicons name="alert-circle" size={18} color={colors.primary} />
          <Text style={styles.warningText}>
            If these measurements are incorrect and a replacement crate is needed, the owner is liable for the replacement cost. Please measure carefully.
          </Text>
        </View>

        {/* Measurement fields */}
        <Card style={styles.formCard}>
          {FIELDS.map((field, index) => (
            <View key={field.key} style={[styles.fieldGroup, index > 0 && styles.fieldGroupBorder]}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldIconCircle}>
                  <Ionicons name={field.icon} size={16} color={colors.primary} />
                </View>
                <View style={styles.fieldLabelArea}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldDesc}>{field.description}</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textPlaceholder}
                  keyboardType="numeric"
                  value={measurements[field.key]}
                  onChangeText={(v) => setMeasurements((prev) => ({ ...prev, [field.key]: v }))}
                  accessibilityLabel={field.label}
                />
                <Text style={styles.unitLabel}>cm</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Measuring tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Use a soft tape measure</Text>
            <Text style={styles.tipItem}>• Measure while your dog is standing naturally</Text>
            <Text style={styles.tipItem}>• Add 5cm to each measurement for comfort in the crate</Text>
            <Text style={styles.tipItem}>• If unsure, your consultant can help verify against breed averages</Text>
          </View>
        </Card>

        <Button
          title="Save measurements"
          onPress={handleSave}
          variant="primary"
          style={styles.saveBtn}
        />
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
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  warningCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: 'rgba(232,98,61,0.08)',
    borderWidth: 1.5, borderColor: 'rgba(232,98,61,0.3)',
    borderRadius: radius.lg, padding: 14, marginBottom: 16,
  },
  warningText: { ...typography.caption, color: colors.textPrimary, flex: 1, lineHeight: 18 },

  formCard: { padding: 0, marginBottom: 16 },
  fieldGroup: { padding: 16 },
  fieldGroupBorder: { borderTopWidth: 1, borderTopColor: colors.divider },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  fieldIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  fieldLabelArea: { flex: 1 },
  fieldLabel: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  fieldDesc: { ...typography.tiny, color: colors.textSecondary, marginTop: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1, backgroundColor: colors.background,
    borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 14,
    ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary,
  },
  unitLabel: {
    ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textSecondary,
    width: 28,
  },

  tipsCard: { padding: 16, marginBottom: 16 },
  tipsTitle: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, marginBottom: 8 },
  tipsList: { gap: 4 },
  tipItem: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },

  saveBtn: { marginTop: 4 },
});
