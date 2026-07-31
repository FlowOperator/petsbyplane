import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows, layout } from '../../src/theme';
import { Card, Badge, Button } from '../../src/components/ui';
import { useAppState } from '../../src/services/store';

type ProfileTab = 'pets' | 'owner';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('pets');
  const { state } = useAppState();
  const { pets, owner, documents, activeTrip } = state;

  const pet = pets[0]; // Primary pet for now
  const petDocs = documents.filter((d) => d.petId === pet?.id);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header + tabs */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pets' && styles.tabActive]}
              onPress={() => setActiveTab('pets')}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === 'pets' }}
            >
              <Text style={[styles.tabText, activeTab === 'pets' && styles.tabTextActive]}>
                Pets
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'owner' && styles.tabActive]}
              onPress={() => setActiveTab('owner')}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === 'owner' }}
            >
              <Text style={[styles.tabText, activeTab === 'owner' && styles.tabTextActive]}>
                Owner
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'pets' ? (
          <PetsView pet={pet} petDocs={petDocs} />
        ) : (
          <OwnerView owner={owner} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Pets Tab ────────────────────────────────────────────────────────

function PetsView({ pet, petDocs }: { pet: any; petDocs: any[] }) {
  if (!pet) {
    return (
      <View style={styles.tabContent}>
        <Card>
          <Text style={styles.emptyText}>No pets added yet. Start a quote to add your pet.</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      {/* Pet details card */}
      <Card style={styles.petCard}>
        <View style={styles.petHeader}>
          <View style={styles.petAvatar}>
            <Ionicons name="paw" size={26} color={colors.primary} />
          </View>
          <View style={styles.petHeaderInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed} · {pet.species}</Text>
          </View>
          <Badge
            label={pet.documentStatus === 'complete' ? '✓ Ready' : 'Docs needed'}
            variant={pet.documentStatus === 'complete' ? 'success' : 'error'}
          />
        </View>

        <View style={styles.detailsList}>
          <DetailRow label="Date of birth" value={formatDate(pet.dateOfBirth)} />
          <DetailRow label="Microchip number" value={pet.microchipNumber} mono />
          <DetailRow label="Weight" value={`${pet.weight} kg`} />
          {pet.rabiesVaccineDate && (
            <DetailRow
              label="Rabies vaccine"
              badge={{ label: '✓ Verified', variant: 'success' }}
            />
          )}
          {pet.otherVaccines && pet.otherVaccines.length > 0 && (
            <DetailRow
              label="Other vaccines"
              value={pet.otherVaccines.map((v: any) => v.name).join(', ') + ' — up to date'}
            />
          )}
          {pet.assignedCrate && (
            <DetailRow
              label="Assigned crate"
              value={`IATA ${pet.assignedCrate.iataSize} · ${pet.assignedCrate.dimensions}`}
            />
          )}
          {pet.isNeutered !== undefined && (
            <DetailRow label="Neutered" value={pet.isNeutered ? 'Yes' : 'No'} />
          )}
        </View>
      </Card>

      {/* Documents for pet */}
      <Card>
        <Text style={styles.sectionTitle}>Documents for {pet.name}</Text>
        <View style={styles.docList}>
          {petDocs.map((doc) => (
            <DocRow key={doc.id} title={doc.name} status={doc.status} />
          ))}
          {petDocs.length === 0 && (
            <Text style={styles.emptyText}>No documents uploaded yet.</Text>
          )}
        </View>
        <Button
          title="Upload document"
          onPress={() => {}}
          variant="primary"
          style={{ marginTop: 14 }}
        />
      </Card>

      {/* Crate section */}
      <Card>
        <Text style={styles.sectionTitle}>Your travel crate</Text>
        <Text style={styles.crateSubtitle}>
          {pet.name}'s {pet.weight}kg allows up to a Size 4 crate on volumetric weight
        </Text>

        {/* Own crate check */}
        <View style={styles.ownCrateBox}>
          <Text style={styles.ownCrateTitle}>Already have a crate?</Text>
          <View style={styles.ownCrateInput}>
            <TextInput
              style={styles.crateInput}
              placeholder="e.g. 91 × 58 × 64 cm"
              placeholderTextColor={colors.textPlaceholder}
              accessibilityLabel="Enter your crate dimensions"
            />
            <TouchableOpacity style={styles.checkButton} accessibilityRole="button">
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended crates */}
        <Text style={styles.recommendedTitle}>Or choose a recommended crate</Text>
        <View style={styles.crateList}>
          <CrateOption
            size="IATA Size 4"
            dimensions="91 × 58 × 64 cm · fits up to 32kg volumetric"
            price="£129"
            recommended
          />
          <CrateOption
            size="IATA Size 3"
            dimensions="81 × 51 × 56 cm · fits up to 22kg volumetric"
            price="£99"
          />
          <CrateOption
            size="IATA Size 5"
            dimensions="102 × 69 × 76 cm · fits up to 45kg volumetric"
            price="£159"
          />
        </View>
      </Card>

      {/* Measurements (dogs only) */}
      {pet.species === 'dog' && pet.measurements && (
        <Card>
          <Text style={styles.sectionTitle}>Measurements</Text>
          <Text style={styles.measurementWarning}>
            ⚠️ If these measurements are incorrect and a replacement crate is needed, you'll be liable for the cost.
          </Text>
          <View style={styles.detailsList}>
            <DetailRow label="Length (nose to tail)" value={`${pet.measurements.lengthNoseToTail} cm`} />
            <DetailRow label="Height to elbow" value={`${pet.measurements.heightToElbow} cm`} />
            <DetailRow label="Width at widest" value={`${pet.measurements.widthAtWidest} cm`} />
            <DetailRow label="Standing height" value={`${pet.measurements.standingHeight} cm`} />
          </View>
        </Card>
      )}
    </View>
  );
}

// ─── Owner Tab ───────────────────────────────────────────────────────

function OwnerView({ owner }: { owner: any }) {
  if (!owner) {
    return (
      <View style={styles.tabContent}>
        <Card>
          <Text style={styles.emptyText}>Owner profile not set up yet.</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Card>
        <View style={styles.ownerHeader}>
          <Text style={styles.sectionTitle}>Owner</Text>
          <TouchableOpacity accessibilityRole="link">
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailsList}>
          <DetailRow label="Name" value={`${owner.firstName} ${owner.surname}`} />
          <DetailRow label="Email" value={owner.email} />
          <DetailRow label="Phone" value={owner.phone} />
          {owner.address && <DetailRow label="Home address" value={owner.address} />}
          <View style={styles.divider} />
          <DetailRow label="Passport number" value={owner.passportNumber || '—'} muted={!owner.passportNumber} />
          <DetailRow label="Nationality" value={owner.nationality || '—'} muted={!owner.nationality} />
          <DetailRow label="Visa status" value={owner.visaStatus || '—'} muted={!owner.visaStatus} />
          <View style={styles.divider} />
          <DetailRow label="Arrival date" value={owner.arrivalDate ? formatDate(owner.arrivalDate) : '—'} muted={!owner.arrivalDate} />
          <DetailRow label="Arrival flight" value={owner.arrivalFlight || '—'} muted={!owner.arrivalFlight} />
          <View style={styles.divider} />
          <DetailRow label="Next of kin name" value={owner.nextOfKinName || '—'} muted={!owner.nextOfKinName} />
          <DetailRow label="Next of kin phone" value={owner.nextOfKinPhone || '—'} muted={!owner.nextOfKinPhone} />
        </View>
        <Button
          title="Scan passport / visa"
          onPress={() => {}}
          variant="outline"
          style={{ marginTop: 16 }}
          icon={<Ionicons name="camera-outline" size={16} color={colors.textPrimary} />}
        />
      </Card>

      {/* Collection person */}
      <Card>
        <Text style={styles.sectionTitle}>Who's collecting on arrival?</Text>
        <Text style={styles.collectionDesc}>
          If someone other than you will collect your pet at the destination airport,
          add their details so customs and our local partner can release them.
        </Text>
        {owner.collectionPerson ? (
          <View style={[styles.detailsList, { marginTop: 12 }]}>
            <DetailRow label="Name" value={owner.collectionPerson.name} />
            <DetailRow label="Phone" value={owner.collectionPerson.phone} />
            {owner.collectionPerson.email && (
              <DetailRow label="Email" value={owner.collectionPerson.email} />
            )}
          </View>
        ) : (
          <Button
            title="Add collection person"
            onPress={() => {}}
            variant="primary"
            style={{ marginTop: 14 }}
          />
        )}
      </Card>

      {/* Settings */}
      <Card>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.detailsList}>
          <DetailRow label="Language" value={owner.preferredLanguage === 'en' ? 'English' : owner.preferredLanguage} />
          <DetailRow label="Media consent" value={owner.mediaConsent ? 'Photos may be used' : 'Opted out'} />
        </View>
      </Card>
    </View>
  );
}

// ─── Shared sub-components ───────────────────────────────────────────

function DetailRow({ label, value, mono, muted, badge }: {
  label: string; value?: string; mono?: boolean; muted?: boolean;
  badge?: { label: string; variant: 'success' | 'warning' | 'error' };
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      {badge ? (
        <Badge label={badge.label} variant={badge.variant} />
      ) : (
        <Text style={[
          styles.detailValue,
          mono && styles.monoValue,
          muted && { color: colors.textMuted },
        ]}>
          {value}
        </Text>
      )}
    </View>
  );
}

function DocRow({ title, status }: { title: string; status: string }) {
  const badgeMap: Record<string, { label: string; variant: 'success' | 'warning' | 'error' }> = {
    verified: { label: '✓ Verified', variant: 'success' },
    expiring_soon: { label: 'Expiring soon', variant: 'warning' },
    missing: { label: 'Missing', variant: 'error' },
    uploaded: { label: 'Uploaded', variant: 'success' },
    expired: { label: 'Expired', variant: 'error' },
  };
  const badge = badgeMap[status] || { label: status, variant: 'warning' as const };

  return (
    <View style={styles.docRow}>
      <Text style={styles.docTitle}>{title}</Text>
      <Badge label={badge.label} variant={badge.variant} />
    </View>
  );
}

function CrateOption({ size, dimensions, price, recommended }: {
  size: string; dimensions: string; price: string; recommended?: boolean;
}) {
  return (
    <View style={[styles.crateOption, recommended && styles.crateOptionRecommended]}>
      {recommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedBadgeText}>Recommended</Text>
        </View>
      )}
      <View style={styles.crateOptionContent}>
        <View style={styles.crateOptionInfo}>
          <Text style={styles.crateSize}>{size}</Text>
          <Text style={styles.crateDimensions}>{dimensions}</Text>
        </View>
        <Text style={styles.cratePrice}>{price}</Text>
      </View>
      <Button
        title="Add"
        onPress={() => {}}
        variant={recommended ? 'primary' : 'outline'}
        size="small"
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 120 },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: layout.screenPaddingTop, paddingBottom: 14,
  },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 16 },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#E9E4D8',
    borderRadius: radius.pill, padding: 4, gap: 4,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textSecondary },
  tabTextActive: { color: colors.white },
  tabContent: { paddingHorizontal: layout.screenPaddingHorizontal, gap: 16 },

  // Pet card
  petCard: {},
  petHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  petAvatar: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 3, borderColor: colors.textPrimary,
    backgroundColor: '#FBE9E2',
    alignItems: 'center', justifyContent: 'center',
  },
  petHeaderInfo: { flex: 1, minWidth: 0 },
  petName: { ...typography.h4, color: colors.textPrimary },
  petBreed: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  // Details
  detailsList: { marginTop: 16, gap: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { ...typography.bodySmall, color: colors.textSecondary },
  detailValue: {
    ...typography.bodySmall, fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary, textAlign: 'right', flexShrink: 1,
  },
  monoValue: { fontFamily: 'Nunito_700Bold', fontSize: 13.5, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 4 },

  // Documents
  sectionTitle: { ...typography.h5, color: colors.textPrimary, marginBottom: 12 },
  docList: { gap: 10 },
  docRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docTitle: { ...typography.bodySmall, fontFamily: 'Nunito_600SemiBold', color: colors.textPrimary, flex: 1 },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', paddingVertical: 12 },

  // Crate section
  crateSubtitle: { ...typography.caption, color: colors.textSecondary, marginBottom: 14, lineHeight: 18 },
  ownCrateBox: { backgroundColor: '#F7F4EC', borderRadius: radius.lg, padding: 14, marginBottom: 16 },
  ownCrateTitle: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, marginBottom: 8 },
  ownCrateInput: { flexDirection: 'row', gap: 8 },
  crateInput: {
    flex: 1, backgroundColor: colors.white,
    borderWidth: 1.5, borderColor: colors.borderMedium,
    borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: 14,
    ...typography.bodySmall, color: colors.textPrimary,
  },
  checkButton: {
    backgroundColor: colors.textPrimary, borderRadius: radius.md,
    paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
  },
  checkButtonText: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.background },
  recommendedTitle: { ...typography.bodySmall, fontFamily: 'Nunito_700Bold', color: colors.textPrimary, marginBottom: 10 },
  crateList: { gap: 10 },
  crateOption: { borderWidth: 1, borderColor: colors.borderMedium, borderRadius: radius.lg, padding: 14 },
  crateOptionRecommended: {
    borderWidth: 1.5, borderColor: 'rgba(232,98,61,0.4)',
    backgroundColor: 'rgba(232,98,61,0.06)', position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute', top: -9, left: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill,
  },
  recommendedBadgeText: { ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.white, fontSize: 10.5 },
  crateOptionContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  crateOptionInfo: { flex: 1 },
  crateSize: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },
  crateDimensions: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  cratePrice: { ...typography.body, fontFamily: 'Nunito_700Bold', color: colors.textPrimary },

  // Measurements
  measurementWarning: {
    ...typography.caption, color: colors.warning,
    backgroundColor: colors.secondarySubtle,
    borderRadius: radius.md, padding: 10, marginBottom: 12, lineHeight: 18,
  },

  // Owner tab
  ownerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  editLink: { ...typography.caption, fontFamily: 'Nunito_700Bold', color: colors.primary },
  collectionDesc: { ...typography.caption, color: colors.textSecondary, lineHeight: 18, marginBottom: 0 },
});
