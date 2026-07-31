/**
 * Pets by Plane — Cancellation Policy Engine
 *
 * Based on the real T&Cs (Section 6.15).
 * Tiered fee structure that shows the owner what they'd owe
 * if they cancel at any given point.
 */

import { CancellationTier } from '../types';

// ─── Policy Tiers ────────────────────────────────────────────────────

export const CANCELLATION_TIERS: CancellationTier[] = [
  {
    daysBeforeTravel: 56, // 8+ weeks
    feePercentage: 25,
    description: 'More than 8 weeks before travel — 25% of total fee retained',
  },
  {
    daysBeforeTravel: 42, // 6-8 weeks
    feePercentage: 50,
    description: '6–8 weeks before travel — 50% of total fee retained',
  },
  {
    daysBeforeTravel: 28, // 4-6 weeks
    feePercentage: 75,
    description: '4–6 weeks before travel — 75% of total fee retained',
  },
  {
    daysBeforeTravel: 14, // 2-4 weeks
    feePercentage: 90,
    description: '2–4 weeks before travel — 90% of total fee retained',
  },
  {
    daysBeforeTravel: 0, // Less than 2 weeks
    feePercentage: 100,
    description: 'Less than 2 weeks before travel — 100% of total fee retained (no refund)',
  },
];

// ─── Calculator ──────────────────────────────────────────────────────

export interface CancellationEstimate {
  tier: CancellationTier;
  feeAmount: number;
  refundAmount: number;
  daysUntilTravel: number;
  /** Whether cancellation is still possible (some bookings are non-refundable past a point) */
  canCancel: boolean;
}

/**
 * Calculate what the owner would owe if they cancelled today.
 */
export function calculateCancellationFee(
  totalAmount: number,
  travelDate: string
): CancellationEstimate {
  const today = new Date();
  const travel = new Date(travelDate);
  const daysUntilTravel = Math.ceil(
    (travel.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Find the applicable tier (first tier where days remaining is less than threshold)
  let applicableTier = CANCELLATION_TIERS[CANCELLATION_TIERS.length - 1];

  for (const tier of CANCELLATION_TIERS) {
    if (daysUntilTravel >= tier.daysBeforeTravel) {
      applicableTier = tier;
      break;
    }
  }

  const feeAmount = Math.round((totalAmount * applicableTier.feePercentage) / 100);
  const refundAmount = totalAmount - feeAmount;

  return {
    tier: applicableTier,
    feeAmount,
    refundAmount,
    daysUntilTravel,
    canCancel: true, // Could be false for certain booking types
  };
}

/**
 * Get a human-readable summary for display in the app.
 */
export function getCancellationSummary(
  totalAmount: number,
  travelDate: string
): string {
  const estimate = calculateCancellationFee(totalAmount, travelDate);

  if (estimate.refundAmount <= 0) {
    return `If you cancel now (${estimate.daysUntilTravel} days before travel), no refund would be due.`;
  }

  return `If you cancel now (${estimate.daysUntilTravel} days before travel), you'd receive a £${estimate.refundAmount} refund. £${estimate.feeAmount} would be retained (${estimate.tier.feePercentage}%).`;
}
