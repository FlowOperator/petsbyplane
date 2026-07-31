import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../src/theme';
import { Card } from '../src/components/ui';
import { TrustBadge } from '../src/components/TrustBadge';
import { AccreditationBadges } from '../src/components/AccreditationBadges';

/**
 * About / Help screen.
 * Company info, accreditations, legal entity details, and contact.
 */
export default function AboutScreen() {
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
          <Text style={styles.title}>About</Text>
        </View>

        {/* Brand hero */}
        <View style={styles.brandSection}>
          <View style={styles.logoRow}>
            <Ionicons name="paw" size={28} color={colors.primary} />
            <Text style={styles.brandName}>Pets by Plane</Text>
          </View>
          <Text style={styles.motto}>"We Care in the Air"</Text>
          <Text style={styles.heritage}>
            Part of the Instone Air Group — animal transport heritage since 1919.
            Family-run, 4th-generation. Based in Storrington, Sussex.
          </Text>
        </View>

        {/* Trustindex */}
        <View style={styles.trustRow}>
          <TrustBadge />
        </View>

        {/* Accreditations */}
        <Text style={styles.sectionTitle}>Accreditations</Text>
        <AccreditationBadges layout="grid" />

        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>25+</Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5,000+</Text>
              <Text style={styles.statLabel}>Pets transported</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>150+</Text>
              <Text style={styles.statLabel}>Destinations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>30+</Text>
              <Text style={styles.statLabel}>Airline partners</Text>
            </View>
          </View>
        </Card>

        {/* Legal */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <Card style={styles.legalCard}>
          <Text style={styles.legalText}>
            Pets By Plane trades as <Text style={styles.bold}>Live Logistix Ltd</Text>
          </Text>
          <Text style={styles.legalText}>Company No. 15123404</Text>
          <Text style={styles.legalText}>
            Registered office: Charity Farm, Pulborough Road, West Sussex, RH20 4HP
          </Text>
          <Text style={styles.legalText}>VAT: Pet exports are zero-rated</Text>
        </Card>

        {/* Contact */}
        <Text style={styles.sectionTitle}>Contact</Text>
        <Card>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('mailto:bookings@petsbyplane.com')}
            accessibilityRole="link"
          >
            <Ionicons name="mail-outline" size={18} color={colors.primary} />
            <Text style={styles.contactText}>bookings@petsbyplane.com</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('https://www.petsbyplane.com')}
            accessibilityRole="link"
          >
            <Ionicons name="globe-outline" size={18} color={colors.primary} />
            <Text style={styles.contactText}>petsbyplane.com</Text>
          </TouchableOpacity>
        </Card>

        {/* Partners */}
        <Text style={styles.sectionTitle}>Partners</Text>
        <Card>
          <View style={styles.partnerRow}>
            <Ionicons name="heart" size={16} color={colors.success} />
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName}>BEHAVET</Text>
              <Text style={styles.partnerDesc}>Free pre-departure behaviourist consultations</Text>
            </View>
          </View>
          <View style={styles.partnerRow}>
            <Ionicons name="globe" size={16} color={colors.success} />
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName}>IPATA Network</Text>
              <Text style={styles.partnerDesc}>Registered destination agents worldwide</Text>
            </View>
          </View>
        </Card>

        {/* Version */}
        <Text style={styles.versionText}>Pets by Plane v1.0.0</Text>
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

  // Brand
  brandSection: { alignItems: 'center', paddingVertical: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  brandName: { fontFamily: 'Baloo2_700Bold', fontSize: 24, color: colors.textPrimary },
  motto: {
    ...typography.body, fontFamily: 'Nunito_600SemiBold',
    color: colors.primary, fontStyle: 'italic', marginBottom: 10,
  },
  heritage: {
    ...typography.caption, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 18, paddingHorizontal: 20,
  },

  trustRow: { alignItems: 'center', marginBottom: 20 },

  sectionTitle: {
    ...typography.h5, color: colors.textPrimary,
    marginTop: 20, marginBottom: 10,
  },

  // Stats
  statsCard: { padding: 16 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
  statItem: { width: '50%', alignItems: 'center', paddingVertical: 10 },
  statNumber: { fontFamily: 'Baloo2_700Bold', fontSize: 20, color: colors.primary },
  statLabel: { ...typography.tiny, color: colors.textSecondary, marginTop: 2 },

  // Legal
  legalCard: { padding: 16 },
  legalText: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
  bold: { fontFamily: 'Nunito_700Bold', color: colors.textPrimary },

  // Contact
  contactRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  contactText: { ...typography.body, color: colors.primary },

  // Partners
  partnerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  partnerInfo: { flex: 1 },
  partnerName: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  partnerDesc: { ...typography.tiny, color: colors.textSecondary, marginTop: 1 },

  versionText: {
    ...typography.tiny, color: colors.textMuted,
    textAlign: 'center', marginTop: 24,
  },
});
