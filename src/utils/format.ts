/**
 * Pets by Plane — Formatting Utilities
 * Consistent date, currency, and text formatting across the app.
 */

/**
 * Format a price in GBP with proper symbol and separators.
 */
export function formatCurrency(amount: number): string {
  return `£${amount.toLocaleString('en-GB')}`;
}

/**
 * Format an ISO date string to human-readable format.
 * e.g. "10 Aug 2026"
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
 * Format an ISO date to short format without year.
 * e.g. "10 Aug"
 */
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/**
 * Format an ISO date to time only.
 * e.g. "09:30"
 */
export function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format an ISO date to date + time.
 * e.g. "10 Aug, 09:30"
 */
export function formatDateTime(dateStr: string): string {
  return `${formatDateShort(dateStr)}, ${formatTime(dateStr)}`;
}

/**
 * Get a relative time string like "2 days ago", "in 5 days", "today".
 */
export function formatRelativeDate(dateStr: string): string {
  const target = new Date(dateStr);
  const today = new Date();
  const days = Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  if (days < 0) return `${Math.abs(days)} days ago`;
  return `in ${days} days`;
}

/**
 * Get days remaining until a date. Negative if past.
 */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Subtract days from a date string and return new ISO string.
 */
export function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/**
 * Get time remaining as "Xh YYm" format for countdowns.
 */
export function formatTimeRemaining(targetStr: string): string | null {
  const target = new Date(targetStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * Get initials from a full name.
 * e.g. "Sarah Whitfield" → "SW"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
