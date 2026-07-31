import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows, layout } from '../theme';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string, formatted: string) => void;
  title?: string;
  /** Minimum selectable date (ISO string) */
  minDate?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Simple calendar date picker modal.
 * Designed to feel native without needing a heavy library.
 */
export function DatePickerModal({
  visible,
  onClose,
  onSelect,
  title = 'Select travel date',
  minDate,
}: DatePickerModalProps) {
  const today = new Date();
  const min = minDate ? new Date(minDate) : today;

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday = 0

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleSelect = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (date < min) return;
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (!selectedDate) return;
    const iso = selectedDate.toISOString().split('T')[0];
    const formatted = selectedDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    onSelect(iso, formatted);
    onClose();
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      viewMonth === selectedDate.getMonth() &&
      viewYear === selectedDate.getFullYear()
    );
  };

  const isPast = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    return date < min;
  };

  // Build calendar grid
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button">
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Month navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={goPrev} style={styles.navBtn} accessibilityLabel="Previous month">
              <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={goNext} style={styles.navBtn} accessibilityLabel="Next month">
              <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAY_NAMES.map((d) => (
              <Text key={d} style={styles.dayHeaderText}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calendarGrid}>
            {cells.map((day, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dayCell,
                  day && isSelected(day) && styles.dayCellSelected,
                  day && isToday(day) && !isSelected(day) && styles.dayCellToday,
                ]}
                onPress={() => day && handleSelect(day)}
                disabled={!day || isPast(day)}
                accessibilityRole="button"
                accessibilityLabel={day ? `${day} ${MONTH_NAMES[viewMonth]}` : undefined}
              >
                {day && (
                  <Text style={[
                    styles.dayText,
                    isSelected(day) && styles.dayTextSelected,
                    isPast(day) && styles.dayTextPast,
                    isToday(day) && !isSelected(day) && styles.dayTextToday,
                  ]}>
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            style={[styles.confirmBtn, !selectedDate && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={!selectedDate}
            accessibilityRole="button"
          >
            <Text style={styles.confirmBtnText}>
              {selectedDate
                ? `Select ${selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`
                : 'Pick a date'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const CELL_SIZE = 44;

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
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: 12,
  },
  title: { ...typography.h4, color: colors.textPrimary },

  // Month nav
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginBottom: 12,
  },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.iconButton,
  },
  monthLabel: {
    ...typography.h5, color: colors.textPrimary,
  },

  // Day headers
  dayHeaders: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginBottom: 4,
  },
  dayHeaderText: {
    width: CELL_SIZE, textAlign: 'center',
    ...typography.tiny, fontFamily: 'Nunito_700Bold', color: colors.textMuted,
  },

  // Grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginBottom: 16,
  },
  dayCell: {
    width: CELL_SIZE, height: CELL_SIZE,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: CELL_SIZE / 2,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellToday: {
    borderWidth: 2, borderColor: colors.primary,
  },
  dayText: {
    ...typography.body, fontFamily: 'Nunito_600SemiBold', color: colors.textPrimary,
  },
  dayTextSelected: { color: colors.white },
  dayTextPast: { color: colors.textDisabled },
  dayTextToday: { color: colors.primary },

  // Confirm
  confirmBtn: {
    marginHorizontal: layout.screenPaddingHorizontal,
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    ...shadows.button,
  },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmBtnText: { ...typography.button, color: colors.textPrimary },
});
