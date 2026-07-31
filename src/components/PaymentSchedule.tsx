import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, shadows } from '../theme';
import { Payment } from '../types';

interface PaymentScheduleProps {
  payments: Payment[];
  totalAmount: number;
  onPayDeposit?: () => void;
}

/**
 * Displays the staged payment schedule (Section 6.7).
 * Shows: deposit → instalments → final balance, with status for each.
 */
export function PaymentSchedule({ payments, totalAmount, onPayDeposit }: PaymentScheduleProps) {
  const paidTotal = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const remaining = totalAmount - paidTotal;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Payment schedule</Text>
        <Text style={styles.totalText}>
          £{paidTotal.toLocaleString()} / £{totalAmount.toLocaleString()}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min((paidTotal / totalAmount) * 100, 100)}%` },
          ]}
        />
      </View>

      {/* Payment items */}
      <View style={styles.paymentList}>
        {payments.map((payment) => (
          <View key={payment.id} style={styles.paymentRow}>
            <View style={styles.paymentLeft}>
              <View style={[
                styles.statusIcon,
                payment.status === 'paid' && styles.statusPaid,
                payment.status === 'pending' && styles.statusPending,
                payment.status === 'overdue' && styles.statusOverdue,
              ]}>
                {payment.status === 'paid' && (
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                )}
                {payment.status === 'pending' && (
                  <Ionicons name="time-outline" size={12} color={colors.secondaryDark} />
                )}
                {payment.status === 'overdue' && (
                  <Ionicons name="alert" size={12} color={colors.white} />
                )}
              </View>
              <View>
                <Text style={styles.paymentLabel}>
                  {payment.type === 'deposit' ? 'Deposit' :
                   payment.type === 'final_balance' ? 'Final balance' :
                   payment.description || 'Payment'}
                </Text>
                <Text style={styles.paymentDue}>
                  {payment.status === 'paid'
                    ? `Paid ${payment.paidAt ? formatShortDate(payment.paidAt) : ''}`
                    : `Due ${formatShortDate(payment.dueDate)}`}
                </Text>
              </View>
            </View>
            <View style={styles.paymentRight}>
              <Text style={[
                styles.paymentAmount,
                payment.status === 'overdue' && { color: colors.primary },
              ]}>
                £{payment.amount.toLocaleString()}
              </Text>
              {payment.status === 'pending' && payment.type === 'deposit' && onPayDeposit && (
                <TouchableOpacity
                  style={styles.payNowBtn}
                  onPress={onPayDeposit}
                  accessibilityRole="button"
                >
                  <Text style={styles.payNowText}>Pay now</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Warning if overdue */}
      {payments.some((p) => p.status === 'overdue') && (
        <View style={styles.overdueWarning}>
          <Ionicons name="warning-outline" size={14} color={colors.primary} />
          <Text style={styles.overdueText}>
            Late payment may pause progress on your booking (flight booking, permit applications, vet appointments).
          </Text>
        </View>
      )}

      {/* Final payment note */}
      <Text style={styles.footnote}>
        Final payment must be received at least 10 working days before travel.
      </Text>
    </View>
  );
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 18,
    ...shadows.cardLight,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  totalText: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_700Bold',
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E4DFD4',
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: radius.pill,
  },
  paymentList: {
    gap: 14,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPaid: {
    backgroundColor: colors.success,
  },
  statusPending: {
    backgroundColor: colors.secondarySubtle,
    borderWidth: 1.5,
    borderColor: colors.secondaryDark,
  },
  statusOverdue: {
    backgroundColor: colors.primary,
  },
  paymentLabel: {
    ...typography.bodySmall,
    fontFamily: 'Nunito_600SemiBold',
    color: colors.textPrimary,
  },
  paymentDue: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 1,
  },
  paymentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  paymentAmount: {
    ...typography.body,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  payNowBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  payNowText: {
    ...typography.tiny,
    fontFamily: 'Nunito_700Bold',
    color: colors.textPrimary,
  },
  overdueWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.primarySubtle,
    borderRadius: radius.md,
    padding: 10,
    marginTop: 14,
  },
  overdueText: {
    ...typography.tiny,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 16,
  },
  footnote: {
    ...typography.tiny,
    color: colors.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },
});
