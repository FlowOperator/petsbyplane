import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../theme';
import { DocumentType, PetDocument } from '../types';
import { useAppState } from '../services/store';

interface DocumentUploadSheetProps {
  visible: boolean;
  onClose: () => void;
  documentType?: DocumentType;
  documentName?: string;
  petId: string;
  tripId: string;
}

/**
 * Bottom-sheet style modal for uploading documents.
 * Offers: Camera capture, Photo library, or File picker.
 */
export function DocumentUploadSheet({
  visible,
  onClose,
  documentType = 'other',
  documentName = 'Document',
  petId,
  tripId,
}: DocumentUploadSheetProps) {
  const { dispatch } = useAppState();
  const [uploading, setUploading] = useState(false);

  const handleCameraCapture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera access is required to scan documents.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      handleUploadSuccess(result.assets[0].uri);
    }
  };

  const handlePhotoLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Photo library access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      handleUploadSuccess(result.assets[0].uri);
    }
  };

  const handleFilePicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      handleUploadSuccess(result.assets[0].uri);
    }
  };

  const handleUploadSuccess = (fileUri: string) => {
    setUploading(true);

    // Simulate upload delay — in production this would be S3
    setTimeout(() => {
      const newDoc: PetDocument = {
        id: `doc-${Date.now()}`,
        petId,
        tripId,
        type: documentType,
        name: documentName,
        description: '',
        status: 'uploaded',
        fileUri,
        uploadedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_DOCUMENT', payload: newDoc });
      setUploading(false);
      onClose();

      Alert.alert(
        'Uploaded',
        `${documentName} has been uploaded. Your consultant will review it shortly.`
      );
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handleBar} />

          <Text style={styles.sheetTitle}>Upload {documentName}</Text>
          <Text style={styles.sheetSubtitle}>
            Take a photo or choose a file from your device
          </Text>

          {/* Options */}
          <View style={styles.options}>
            <TouchableOpacity
              style={styles.option}
              onPress={handleCameraCapture}
              disabled={uploading}
              accessibilityRole="button"
              accessibilityLabel="Take a photo with camera"
            >
              <View style={styles.optionIcon}>
                <Ionicons name="camera" size={24} color={colors.primary} />
              </View>
              <Text style={styles.optionTitle}>Camera</Text>
              <Text style={styles.optionDesc}>Scan or photograph</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={handlePhotoLibrary}
              disabled={uploading}
              accessibilityRole="button"
              accessibilityLabel="Choose from photo library"
            >
              <View style={styles.optionIcon}>
                <Ionicons name="images" size={24} color={colors.primary} />
              </View>
              <Text style={styles.optionTitle}>Photos</Text>
              <Text style={styles.optionDesc}>From library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={handleFilePicker}
              disabled={uploading}
              accessibilityRole="button"
              accessibilityLabel="Choose a file"
            >
              <View style={styles.optionIcon}>
                <Ionicons name="folder-open" size={24} color={colors.primary} />
              </View>
              <Text style={styles.optionTitle}>File</Text>
              <Text style={styles.optionDesc}>PDF or image</Text>
            </TouchableOpacity>
          </View>

          {uploading && (
            <View style={styles.uploadingRow}>
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          )}

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 40, 34, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxxl,
    borderTopRightRadius: radius.xxxl,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: 18,
  },
  sheetTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  sheetSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingVertical: 20,
    paddingHorizontal: 8,
    ...shadows.cardLight,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  optionTitle: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  optionDesc: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  uploadingRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadingText: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.primary,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    ...typography.body,
    fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary,
  },
});
