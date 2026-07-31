/**
 * Pets by Plane — Offline Awareness Hook
 *
 * Section 4: Offline tolerance — owners may be travelling internationally
 * with poor connectivity. Critical screens should cache last-known state
 * and gracefully indicate "last updated."
 */

import { useState, useEffect } from 'react';

// Note: @react-native-community/netinfo will be installed for production.
// For now, this provides the interface with a stub implementation.

export interface OfflineState {
  isConnected: boolean;
  lastUpdated: Date | null;
  /** Formatted "last updated" string for display */
  lastUpdatedText: string;
}

/**
 * Returns connectivity status and last-updated tracking.
 * Use this to show "Last updated X minutes ago" on critical screens.
 */
export function useOffline(): OfflineState {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  // For now, assume connected (NetInfo not yet installed)
  // Will be wired to NetInfo.addEventListener in production

  const lastUpdatedText = lastUpdated
    ? getTimeAgoText(lastUpdated)
    : 'Never';

  return { isConnected, lastUpdated, lastUpdatedText };
}

function getTimeAgoText(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
