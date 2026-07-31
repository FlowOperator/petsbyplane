import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../../src/theme';
import { useChat } from '../../src/hooks/useChat';
import { useAppState } from '../../src/services/store';
import { QUICK_REPLIES, ChatMessage } from '../../src/services/whatsappService';

export default function MessagesScreen() {
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { state } = useAppState();
  const { consultant, pets, activeTrip } = state;
  const pet = pets.find((p) => p.id === activeTrip?.petId);

  const { messages, isSending, handleSend, consultantName, consultantOnline } = useChat();

  const onSend = () => {
    if (!messageText.trim()) return;
    handleSend(messageText);
    setMessageText('');
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const onQuickReply = (text: string) => {
    handleSend(text);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageRow, item.isOwn && styles.messageRowOwn]}>
      {!item.isOwn && (
        <View style={styles.avatarSmall}>
          <Ionicons name="person" size={14} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.messageBubbleContainer}>
        <View style={[styles.messageBubble, item.isOwn && styles.messageBubbleOwn]}>
          <Text style={[styles.messageText, item.isOwn && styles.messageTextOwn]}>
            {item.text}
          </Text>
        </View>
        <View style={[styles.metaRow, item.isOwn && styles.metaRowOwn]}>
          <Text style={styles.timestamp}>
            {formatTime(item.timestamp)}
          </Text>
          {item.isOwn && (
            <Ionicons
              name={item.status === 'read' ? 'checkmark-done' : item.status === 'delivered' ? 'checkmark-done' : 'checkmark'}
              size={12}
              color={item.status === 'read' ? colors.primary : colors.textMuted}
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.consultantAvatar}>
            <Ionicons name="person" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.consultantNameText}>{consultantName}</Text>
            <View style={styles.onlineRow}>
              <View style={[styles.onlineDot, !consultantOnline && styles.offlineDot]} />
              <Text style={styles.onlineText}>
                {pet?.name ? `${pet.name}'s relocation consultant` : 'Relocation consultant'} · {consultantOnline ? 'Online' : 'Away'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => consultant?.phone && Linking.openURL(`tel:${consultant.phone}`)}
            accessibilityLabel="Call consultant"
            accessibilityRole="button"
          >
            <Ionicons name="call-outline" size={17} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Quick replies */}
        <FlatList
          horizontal
          data={QUICK_REPLIES.slice(0, 4)}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesContent}
          style={styles.quickReplies}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.quickReplyChip}
              onPress={() => onQuickReply(item.text)}
              accessibilityRole="button"
            >
              <Text style={styles.quickReplyText}>{item.text}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={`Message ${consultantName.split(' ')[0]}…`}
              placeholderTextColor={colors.textMuted}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={1000}
              accessibilityLabel="Message input"
              onSubmitEditing={onSend}
              returnKeyType="send"
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={onSend}
            disabled={!messageText.trim() || isSending}
            accessibilityLabel="Send message"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-forward" size={19} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 20, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  consultantAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.white, borderWidth: 2, borderColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  headerInfo: { flex: 1, minWidth: 0 },
  consultantNameText: { ...typography.h5, color: colors.textPrimary, fontSize: 15.5 },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.success },
  offlineDot: { backgroundColor: colors.textMuted },
  onlineText: { ...typography.tiny, fontFamily: 'Nunito_600SemiBold', color: colors.textSecondary },
  callButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },

  // Messages
  messagesList: { paddingHorizontal: layout.screenPaddingHorizontal, paddingTop: 18, paddingBottom: 8, gap: 12 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  messageRowOwn: { flexDirection: 'row-reverse' },
  avatarSmall: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  messageBubbleContainer: { maxWidth: '78%' },
  messageBubble: {
    backgroundColor: colors.white, borderRadius: 20, borderBottomLeftRadius: 6,
    paddingVertical: 12, paddingHorizontal: 16, ...shadows.cardLight,
  },
  messageBubbleOwn: {
    backgroundColor: colors.primary, borderBottomLeftRadius: 20, borderBottomRightRadius: 6,
  },
  messageText: { ...typography.body, color: colors.textPrimary, lineHeight: 21 },
  messageTextOwn: { color: colors.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, marginLeft: 4 },
  metaRowOwn: { justifyContent: 'flex-end', marginRight: 4, marginLeft: 0 },
  timestamp: { ...typography.tiny, color: colors.textMuted },

  // Quick replies
  quickReplies: { maxHeight: 44, flexGrow: 0 },
  quickRepliesContent: { paddingHorizontal: layout.screenPaddingHorizontal, gap: 8, paddingVertical: 6 },
  quickReplyChip: {
    backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.borderMedium,
    borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 14,
  },
  quickReplyText: { ...typography.caption, fontFamily: 'Nunito_600SemiBold', color: colors.textPrimary },

  // Input
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 28 : 16,
  },
  inputContainer: {
    flex: 1, backgroundColor: colors.white, borderRadius: radius.pill,
    paddingVertical: 11, paddingHorizontal: 18, ...shadows.cardLight,
    maxHeight: 100,
  },
  textInput: { ...typography.body, color: colors.textPrimary, padding: 0 },
  sendButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    ...shadows.primaryButton,
  },
  sendButtonDisabled: { opacity: 0.5 },
});
