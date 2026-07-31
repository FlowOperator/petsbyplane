/**
 * Pets by Plane — Typography System
 * Heading: Baloo 2 (600/700/800)
 * Body: Nunito (400/600/700)
 */

import { TextStyle } from 'react-native';

export const fontFamilies = {
  heading: 'Baloo2_700Bold',
  headingBold: 'Baloo2_800ExtraBold',
  headingSemiBold: 'Baloo2_600SemiBold',
  body: 'Nunito_400Regular',
  bodySemiBold: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
} as const;

export const typography = {
  // Headings
  h1: {
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    lineHeight: 32,
  } as TextStyle,

  h2: {
    fontFamily: fontFamilies.heading,
    fontSize: 22,
    lineHeight: 28,
  } as TextStyle,

  h3: {
    fontFamily: fontFamilies.heading,
    fontSize: 20,
    lineHeight: 26,
  } as TextStyle,

  h4: {
    fontFamily: fontFamilies.heading,
    fontSize: 17,
    lineHeight: 22,
  } as TextStyle,

  h5: {
    fontFamily: fontFamilies.heading,
    fontSize: 15,
    lineHeight: 20,
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 21,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 18,
  } as TextStyle,

  caption: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,

  tiny: {
    fontFamily: fontFamilies.body,
    fontSize: 11,
    lineHeight: 15,
  } as TextStyle,

  // Labels & buttons
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
  } as TextStyle,

  labelSmall: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 11,
    lineHeight: 15,
  } as TextStyle,

  button: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 15,
    lineHeight: 20,
  } as TextStyle,

  buttonSmall: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: 13.5,
    lineHeight: 18,
  } as TextStyle,

  tabLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 11,
    lineHeight: 15,
  } as TextStyle,
} as const;
