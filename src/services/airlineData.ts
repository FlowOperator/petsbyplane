/**
 * Pets by Plane — Airline Partner Data
 *
 * Structured data about airline partners including:
 * - Breed restrictions (brachycephalic/snub-nosed policies)
 * - Temperature embargoes
 * - Hub airports
 * - Minimum charges
 *
 * Feeds into route recommendation logic (Section 6.6).
 */

export interface AirlineProfile {
  id: string;
  name: string;
  iataCode: string;
  hub: string;
  logo?: string;
  /** Breeds banned outright */
  bannedBreeds: string[];
  /** Breeds restricted (may require extra paperwork or conditions) */
  restrictedBreeds: string[];
  /** Whether brachycephalic breeds are banned */
  brachycephalicBanned: boolean;
  /** Temperature threshold (°C) above which live animal transport is suspended */
  temperatureEmbargoThreshold: number;
  /** Months where temperature embargoes typically apply (for route warnings) */
  embargoMonths: number[];
  /** Minimum cargo charge (GBP) */
  minimumCharge: number;
  /** Whether in-transit photos are available as add-on */
  transitPhotosAvailable: boolean;
  /** Transit reception centre info */
  transitCentre?: string;
  /** Notes for the consultant */
  notes?: string;
}

// ─── Airline Database ────────────────────────────────────────────────

export const AIRLINE_PARTNERS: AirlineProfile[] = [
  {
    id: 'ba',
    name: 'British Airways',
    iataCode: 'BA',
    hub: 'LHR',
    bannedBreeds: [],
    restrictedBreeds: ['American Pit Bull Terrier', 'Dogo Argentino', 'Fila Brasileiro', 'Japanese Tosa'],
    brachycephalicBanned: true,
    temperatureEmbargoThreshold: 28,
    embargoMonths: [6, 7, 8], // June-August for hot destinations
    minimumCharge: 250,
    transitPhotosAvailable: false,
    notes: 'Direct routes to many destinations. No snub-nosed breeds in cargo.',
  },
  {
    id: 'klm',
    name: 'KLM Royal Dutch Airlines',
    iataCode: 'KL',
    hub: 'AMS',
    bannedBreeds: [],
    restrictedBreeds: [],
    brachycephalicBanned: true,
    temperatureEmbargoThreshold: 28,
    embargoMonths: [6, 7, 8],
    minimumCharge: 200,
    transitPhotosAvailable: true,
    transitCentre: 'KLM Animal Hotel, Amsterdam Schiphol',
    notes: 'Excellent transit facilities at AMS. Photo service available during layover.',
  },
  {
    id: 'lufthansa',
    name: 'Lufthansa',
    iataCode: 'LH',
    hub: 'FRA',
    bannedBreeds: [],
    restrictedBreeds: [],
    brachycephalicBanned: true,
    temperatureEmbargoThreshold: 27,
    embargoMonths: [6, 7, 8],
    minimumCharge: 220,
    transitPhotosAvailable: true,
    transitCentre: 'Lufthansa Animal Lounge, Frankfurt',
    notes: 'Premium animal handling facilities. Purpose-built Animal Lounge at FRA.',
  },
  {
    id: 'emirates',
    name: 'Emirates',
    iataCode: 'EK',
    hub: 'DXB',
    bannedBreeds: ['Pit Bull', 'Japanese Tosa'],
    restrictedBreeds: [],
    brachycephalicBanned: true,
    temperatureEmbargoThreshold: 28,
    embargoMonths: [5, 6, 7, 8, 9], // Longer embargo due to DXB climate
    minimumCharge: 300,
    transitPhotosAvailable: false,
    notes: 'Good for Middle East/Asia/Australia routes. Summer embargo on DXB transit.',
  },
  {
    id: 'ethiopian',
    name: 'Ethiopian Airlines',
    iataCode: 'ET',
    hub: 'ADD',
    bannedBreeds: [],
    restrictedBreeds: [],
    brachycephalicBanned: false,
    temperatureEmbargoThreshold: 30,
    embargoMonths: [],
    minimumCharge: 180,
    transitPhotosAvailable: false,
    notes: 'Often cheapest for Africa routes. Accepts snub-nosed breeds. ADD transit is basic.',
  },
  {
    id: 'virgin',
    name: 'Virgin Atlantic',
    iataCode: 'VS',
    hub: 'LHR',
    bannedBreeds: [],
    restrictedBreeds: [],
    brachycephalicBanned: true,
    temperatureEmbargoThreshold: 28,
    embargoMonths: [6, 7, 8],
    minimumCharge: 280,
    transitPhotosAvailable: false,
    notes: 'Direct USA routes. Good cargo handling at LHR.',
  },
  {
    id: 'qantas',
    name: 'Qantas',
    iataCode: 'QF',
    hub: 'SYD',
    bannedBreeds: ['American Pit Bull Terrier', 'Dogo Argentino'],
    restrictedBreeds: [],
    brachycephalicBanned: true,
    temperatureEmbargoThreshold: 28,
    embargoMonths: [12, 1, 2], // Southern hemisphere summer
    minimumCharge: 400,
    transitPhotosAvailable: false,
    notes: 'Australia/NZ routes. Strict quarantine requirements at destination.',
  },
  {
    id: 'air-france',
    name: 'Air France',
    iataCode: 'AF',
    hub: 'CDG',
    bannedBreeds: [],
    restrictedBreeds: [],
    brachycephalicBanned: true,
    temperatureEmbargoThreshold: 28,
    embargoMonths: [7, 8],
    minimumCharge: 200,
    transitPhotosAvailable: false,
    transitCentre: 'Hub Safe Animal Facility, CDG',
    notes: 'Good Europe/Africa connections via CDG.',
  },
];

// ─── Route Warning Logic ─────────────────────────────────────────────

export interface RouteWarning {
  type: 'breed_banned' | 'breed_restricted' | 'brachycephalic' | 'temperature_embargo';
  airline: string;
  message: string;
  severity: 'block' | 'warning';
}

/**
 * Check if a given breed has restrictions on an airline.
 */
export function getBreedWarnings(
  breed: string,
  isBrachycephalic: boolean,
  travelMonth: number
): RouteWarning[] {
  const warnings: RouteWarning[] = [];
  const breedLower = breed.toLowerCase();

  for (const airline of AIRLINE_PARTNERS) {
    // Check banned breeds
    const isBanned = airline.bannedBreeds.some(
      (b) => breedLower.includes(b.toLowerCase())
    );
    if (isBanned) {
      warnings.push({
        type: 'breed_banned',
        airline: airline.name,
        message: `${breed} is not accepted by ${airline.name}`,
        severity: 'block',
      });
    }

    // Check restricted breeds
    const isRestricted = airline.restrictedBreeds.some(
      (b) => breedLower.includes(b.toLowerCase())
    );
    if (isRestricted) {
      warnings.push({
        type: 'breed_restricted',
        airline: airline.name,
        message: `${breed} has restrictions on ${airline.name} — extra documentation may be needed`,
        severity: 'warning',
      });
    }

    // Check brachycephalic
    if (isBrachycephalic && airline.brachycephalicBanned) {
      warnings.push({
        type: 'brachycephalic',
        airline: airline.name,
        message: `${airline.name} does not accept snub-nosed breeds in cargo`,
        severity: 'block',
      });
    }

    // Check temperature embargo
    if (airline.embargoMonths.includes(travelMonth)) {
      warnings.push({
        type: 'temperature_embargo',
        airline: airline.name,
        message: `${airline.name} may have a temperature embargo via ${airline.hub} in this month (threshold: ${airline.temperatureEmbargoThreshold}°C)`,
        severity: 'warning',
      });
    }
  }

  return warnings;
}

/**
 * Known brachycephalic (snub-nosed) breeds.
 */
export const BRACHYCEPHALIC_BREEDS = [
  'Pug', 'French Bulldog', 'English Bulldog', 'British Bulldog',
  'Boston Terrier', 'Boxer', 'Cavalier King Charles Spaniel',
  'Shih Tzu', 'Pekingese', 'Lhasa Apso', 'Affenpinscher',
  'Brussels Griffon', 'Japanese Chin', 'Tibetan Spaniel',
  'Dogue de Bordeaux', 'Bullmastiff', 'Staffordshire Bull Terrier',
  // Cats
  'Persian', 'Himalayan', 'Exotic Shorthair', 'British Shorthair',
  'Scottish Fold', 'Burmese',
];

/**
 * Check if a breed is brachycephalic.
 */
export function isBrachycephalicBreed(breed: string): boolean {
  const breedLower = breed.toLowerCase();
  return BRACHYCEPHALIC_BREEDS.some((b) => breedLower.includes(b.toLowerCase()));
}
