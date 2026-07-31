/**
 * Pets by Plane — Design System Colors
 * Extracted from the locked brand guide (Claude Design mockups)
 */

export const colors = {
  // Backgrounds
  background: '#F1EEE7', // Warm oatmeal — main app background
  backgroundOuter: '#EAE6DC', // Slightly darker, used for body/outer areas
  card: '#FFFFFF',

  // Primary accent — the signature orange-red
  primary: '#E8623D',
  primaryLight: 'rgba(232, 98, 61, 0.12)',
  primaryBorder: 'rgba(232, 98, 61, 0.3)',
  primaryShadow: 'rgba(232, 98, 61, 0.45)',
  primarySubtle: 'rgba(232, 98, 61, 0.08)',
  primaryMuted: 'rgba(232, 98, 61, 0.14)',

  // Secondary accent — warm gold (CTAs, highlights)
  secondary: '#EFC26C',
  secondaryDark: '#C98A2E',
  secondaryShadow: 'rgba(239, 194, 108, 0.5)',
  secondarySubtle: 'rgba(239, 194, 108, 0.14)',

  // Status colors
  success: '#4C8B6B',
  successLight: 'rgba(76, 139, 107, 0.14)',
  warning: '#8A6218',
  warningBg: 'rgba(239, 194, 108, 0.35)',
  warningLight: 'rgba(239, 194, 108, 0.28)',
  error: '#E8623D', // Same as primary in this brand

  // Text hierarchy
  textPrimary: '#2E2822',
  textSecondary: '#6B6259',
  textMuted: '#9A9188',
  textDisabled: '#ADA69C',
  textPlaceholder: '#B4ACA1',

  // Borders & dividers
  border: 'rgba(46, 40, 34, 0.06)',
  borderMedium: 'rgba(46, 40, 34, 0.1)',
  borderStrong: 'rgba(46, 40, 34, 0.15)',
  divider: 'rgba(46, 40, 34, 0.08)',

  // Shadows (for use in shadow properties)
  shadowLight: 'rgba(46, 40, 34, 0.06)',
  shadowMedium: 'rgba(46, 40, 34, 0.08)',
  shadowStrong: 'rgba(46, 40, 34, 0.18)',

  // Tab bar
  tabInactive: '#6B6259',
  tabActive: '#E8623D',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(46, 40, 34, 0.5)',
} as const;

export type ColorKey = keyof typeof colors;
