/**
 * Species-specific colour coding from the design handoff.
 * Apply consistently anywhere a species appears — icons, badges, accents.
 */

export const speciesColors = {
  dog: {
    primary: '#E8623D',
    light: 'rgba(232, 98, 61, 0.12)',
    badge: 'rgba(232, 98, 61, 0.14)',
  },
  cat: {
    primary: '#2C4A6E',
    light: 'rgba(44, 74, 110, 0.12)',
    badge: 'rgba(44, 74, 110, 0.14)',
  },
  bird: {
    primary: '#C97A1F',
    light: 'rgba(201, 122, 31, 0.12)',
    badge: 'rgba(201, 122, 31, 0.14)',
  },
  exotic: {
    primary: '#2E8B7E',
    light: 'rgba(46, 139, 126, 0.12)',
    badge: 'rgba(46, 139, 126, 0.14)',
  },
} as const;

export type SpeciesKey = keyof typeof speciesColors;

export function getSpeciesColor(species: string) {
  return speciesColors[species as SpeciesKey] || speciesColors.dog;
}
