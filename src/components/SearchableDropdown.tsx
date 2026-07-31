import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../theme';

interface SearchableDropdownProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  items: string[];
  title: string;
  placeholder?: string;
  /** If true, shows items as code + label (e.g. airports) */
  renderItem?: (item: string) => { primary: string; secondary?: string };
}

/**
 * Full-screen searchable dropdown/modal.
 * Used for breed selection, airport search, etc.
 */
export function SearchableDropdown({
  visible,
  onClose,
  onSelect,
  items,
  title,
  placeholder = 'Search...',
  renderItem,
}: SearchableDropdownProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return items.slice(0, 20);
    const q = query.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(q)).slice(0, 20);
  }, [query, items]);

  const handleSelect = (item: string) => {
    onSelect(item);
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Search input */}
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder={placeholder}
              placeholderTextColor={colors.textPlaceholder}
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCorrect={false}
              accessibilityLabel={`Search ${title}`}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Results */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const rendered = renderItem
                ? renderItem(item)
                : { primary: item };

              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                  accessibilityRole="button"
                >
                  <Text style={styles.itemPrimary}>{rendered.primary}</Text>
                  {rendered.secondary && (
                    <Text style={styles.itemSecondary}>{rendered.secondary}</Text>
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No results found</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 40, 34, 0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xxxl,
    borderTopRightRadius: radius.xxxl,
    maxHeight: '85%',
    minHeight: '60%',
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: 12,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: layout.screenPaddingHorizontal,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    ...shadows.iconButton,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  itemPrimary: {
    ...typography.body,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textPrimary,
  },
  itemSecondary: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 30,
  },
});
