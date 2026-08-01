import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { Card, Button } from '../../src/components/ui';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Get in touch</Text>
        </View>

        <Text style={styles.intro}>
          Got a question before booking? Drop us a line and we'll get back to you within 24 hours.
        </Text>

        {/* Contact info */}
        <Card style={styles.contactCard}>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:bookings@petsbyplane.com')}>
            <Ionicons name="mail-outline" size={18} color={colors.primary} />
            <Text style={styles.contactText}>bookings@petsbyplane.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:+441903741000')}>
            <Ionicons name="call-outline" size={18} color={colors.primary} />
            <Text style={styles.contactText}>+44 1903 741 000</Text>
          </TouchableOpacity>
          <View style={styles.contactRow}>
            <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.contactTextMuted}>Mon–Fri, 9am–5pm GMT</Text>
          </View>
        </Card>

        {/* Contact form */}
        <Text style={styles.sectionTitle}>Send us a message</Text>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={colors.textPlaceholder} value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email address" placeholderTextColor={colors.textPlaceholder} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={[styles.input, styles.textarea]} placeholder="How can we help?" placeholderTextColor={colors.textPlaceholder} value={message} onChangeText={setMessage} multiline numberOfLines={4} />
          <Button title="Send message" onPress={() => {}} variant="primary" />
        </View>

        {/* Location */}
        <Card style={{ marginTop: 20 }}>
          <Text style={styles.locationTitle}>Pets by Plane</Text>
          <Text style={styles.locationAddress}>Charity Farm, Pulborough Road{'\n'}Storrington, West Sussex{'\n'}RH20 4HP</Text>
        </Card>
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
  sectionTitle: { fontFamily: 'Baloo2_700Bold', fontSize: 15, color: colors.textPrimary, marginTop: 20, marginBottom: 12 },

  contactCard: { padding: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.divider },
  contactText: { ...typography.body, color: colors.primary },
  contactTextMuted: { ...typography.body, color: colors.textSecondary },

  form: { gap: 12 },
  input: {
    backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: 14, paddingHorizontal: 18,
    ...typography.body, color: colors.textPrimary, ...shadows.iconButton,
  },
  textarea: { borderRadius: radius.xl, minHeight: 100, textAlignVertical: 'top', paddingTop: 14 },

  locationTitle: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, marginBottom: 4 },
  locationAddress: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
});
