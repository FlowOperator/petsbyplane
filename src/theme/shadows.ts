/**
 * Pets by Plane — Shadow Presets
 * (React Native shadow properties)
 */

import { ViewStyle } from 'react-native';

export const shadows = {
  card: {
    shadowColor: '#2E2822',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  } as ViewStyle,

  cardLight: {
    shadowColor: '#2E2822',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  } as ViewStyle,

  cardStrong: {
    shadowColor: '#2E2822',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  } as ViewStyle,

  button: {
    shadowColor: '#EFC26C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 4,
  } as ViewStyle,

  primaryButton: {
    shadowColor: '#E8623D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  } as ViewStyle,

  fab: {
    shadowColor: '#E8623D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
  } as ViewStyle,

  tabBar: {
    shadowColor: '#2E2822',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  } as ViewStyle,

  iconButton: {
    shadowColor: '#2E2822',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
} as const;
