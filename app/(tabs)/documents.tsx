import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows, layout } from '../../src/theme';
import { Card, Badge, Button } from '../../src/components/ui';
import { DocumentStatus, DocumentType } from '../../src/types';
import { useAppState } from '../../src/services/store';
import { DocumentUploadSheet } from '../../src/components/DocumentUploadSheet';

// ─── Helpers ─────────────────────────────────────────────────────────

function getDocIcon(type: DocumentType): keyof typeof Ionicons.glyphMap {
  const map: Partial<Record<DocumentType, keyof typeof Ionicons.glyphMap>> = {
    microchip_confirmation: 'hardware-chip-outline',
    rabies_vaccination: 'medkit-outline',
    titre_test: 'time-outline',
    export_health_certificate: 'document-text-outline',
    import_permit: 'shield-checkmark-outline',
    health_screening: 'flask-outline',
    passport: 'card-outline',
    insurance: 'umbrella-outline',
  };
  return map[type] || 'document-outline';
}

function formatDaysUntil(dateStr: string): string {
  const target = new Date(dateStr);
  const today = new Date();
  const days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return `${Math.abs(days)} days ago`;
  if (days === 0) return 'today';
  return `in ${days} days`;
}

function getStatusBadge(status: DocumentStatus) {
  switch (status) {
    case 'verified':
      return { label: '✓ Verified', variant: 'success' as const };
    case 'expiring_soon':
      return { label: 'Expiring soon', variant: 'warning' as const };
    case 'missing':
      return { label: 'Missing', variant: 'error' as const };
    default:
      return { label: status, variant: 'info' as const };
  }
}

function getIconBg(status: DocumentStatus) {
  switch (status) {
    case 'verified':
      return colors.successLight;
    case 'expiring_soon':
      return colors.warningLight;
    case 'missing':
      return colors.primaryLight;
    default:
      return colors.primaryLight;
  }
}

function getIconColor(status: DocumentStatus) {
  switch (status) {
    case 'verified':
      return colors.success;
    case 'expiring_soon':
      return '#B7801F';
    case 'missing':
      return colors.primary;
    default:
      return colors.primary;
  }
}

export default function DocumentsScreen() {
  const { state } = useAppState();
  const { documents, activeTrip, pets } = state;
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<{ type: any; name: string }>({
    type: 'other',
    name: 'Document',
  });

  const pet = pets.find((p) => p.id === activeTrip?.petId);
  const tripDocs = documents.filter((d) => d.tripId === activeTrip?.id);
  const completedCount = tripDocs.filter((d) => d.status === 'verified').length;
  const totalCount = tripDocs.length;

  const handleUpload = (docType: any, docName: string) => {
    setUploadDocType({ type: docType, name: docName });
    setUploadVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{pet?.name ? `${pet.name}'s Documents` : 'Documents'}</Text>
          <Text style={styles.subtitle}>
            {activeTrip ? `Everything needed for ${activeTrip.originAirport} → ${activeTrip.destinationAirport}` : 'Upload and track your documents'}
          </Text>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(completedCount / totalCount) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {completedCount} of {totalCount} ready
            </Text>
          </View>
        </View>

        {/* Document list */}
        <View style={styles.documentList}>
          {tripDocs.map((doc, index) => {
            const badge = getStatusBadge(doc.status);
            const isMissing = doc.status === 'missing';

            return (
              <Card
                key={doc.id}
                variant={isMissing ? 'highlighted' : 'default'}
                style={styles.documentCard}
              >
                <View style={styles.documentRow}>
                  <View
                    style={[styles.documentIcon, { backgroundColor: getIconBg(doc.status) }]}
                  >
                    <Ionicons
                      name={getDocIcon(doc.type)}
                      size={19}
                      color={getIconColor(doc.status)}
                    />
                  </View>
                  <View style={styles.documentContent}>
                    <View style={styles.documentTitleRow}>
                      <Text style={styles.documentTitle}>{doc.name}</Text>
                      <Badge label={badge.label} variant={badge.variant} />
                    </View>
                    <Text style={styles.documentDesc}>{doc.description}</Text>
                    {doc.status === 'expiring_soon' && doc.expiryDate && (
                      <Text style={styles.expiryNote}>
                        Valid window closes {formatDaysUntil(doc.expiryDate)}
                      </Text>
                    )}
                  </View>
                </View>
                {isMissing && (
                  <Button
                    title="Upload"
                    onPress={() => handleUpload(doc.type, doc.name)}
                    variant="primary"
                    size="small"
                    style={styles.uploadButton}
                    icon={
                      <Ionicons name="camera-outline" size={16} color={colors.textPrimary} />
                    }
                  />
                )}
              </Card>
            );
          })}
        </View>

        {/* Reassurance text */}
        <Text style={styles.reassurance}>
          No rush — your consultant will remind you before anything's due.
        </Text>
      </ScrollView>

      {/* Upload sheet */}
      <DocumentUploadSheet
        visible={uploadVisible}
        onClose={() => setUploadVisible(false)}
        documentType={uploadDocType.type}
        documentName={uploadDocType.name}
        petId={activeTrip?.petId || ''}
        tripId={activeTrip?.id || ''}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: layout.screenPaddingTop,
    paddingBottom: 6,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E4DFD4',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  progressText: {
    ...typography.caption,
    fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary,
  },

  // Document list
  documentList: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 16,
    gap: 12,
  },
  documentCard: {
    padding: 16,
  },
  documentRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  documentIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentContent: {
    flex: 1,
    minWidth: 0,
  },
  documentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  documentTitle: {
    ...typography.body,
    fontFamily: 'Baloo2_700Bold',
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  documentDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  expiryNote: {
    ...typography.tiny,
    fontFamily: 'Nunito_700Bold',
    color: colors.warning,
    marginTop: 6,
  },
  uploadButton: {
    marginTop: 12,
  },
  reassurance: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 16,
    lineHeight: 18,
  },
});
