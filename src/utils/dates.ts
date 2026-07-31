/**
 * Pets by Plane — Date Utilities
 *
 * Helpers for the deadline-heavy compliance workflow.
 */

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a date without the year (for inline use).
 */
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Format date + time.
 */
export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${formatDateShort(dateStr)}, ${d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

/**
 * Get days between now and a target date.
 * Positive = in the future, negative = in the past.
 */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Human-readable "X days left" or "X days ago" string.
 */
export function daysRemainingText(dateStr: string): string {
  const days = daysUntil(dateStr);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 0) return `${days} days left`;
  return `${Math.abs(days)} days overdue`;
}

/**
 * Subtract days from a date string.
 */
export function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

/**
 * Add days to a date string.
 */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Check if a date is within a validity window.
 */
export function isWithinWindow(
  dateStr: string,
  windowDays: number,
  referenceDate: string
): boolean {
  const date = new Date(dateStr);
  const reference = new Date(referenceDate);
  const windowStart = new Date(reference);
  windowStart.setDate(windowStart.getDate() - windowDays);
  return date >= windowStart && date <= reference;
}

/**
 * Get working days between two dates (excludes weekends).
 */
export function workingDaysBetween(startStr: string, endStr: string): number {
  const start = new Date(startStr);
  const end = new Date(endStr);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Check if final payment deadline is met (10 working days before travel).
 */
export function isFinalPaymentDeadlineMet(
  travelDate: string,
  paymentDate?: string
): { met: boolean; deadlineDate: string; workingDaysLeft: number } {
  const deadline = getWorkingDaysBefore(travelDate, 10);
  const today = paymentDate || new Date().toISOString().split('T')[0];
  const met = new Date(today) <= new Date(deadline);
  const workingDaysLeft = workingDaysBetween(today, deadline);

  return { met, deadlineDate: deadline, workingDaysLeft };
}

/**
 * Get a date that is N working days before a reference date.
 */
function getWorkingDaysBefore(dateStr: string, workingDays: number): string {
  const date = new Date(dateStr);
  let count = 0;

  while (count < workingDays) {
    date.setDate(date.getDate() - 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) count++;
  }

  return date.toISOString().split('T')[0];
}
