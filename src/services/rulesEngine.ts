/**
 * Pets by Plane — Country Requirements Rules Engine
 *
 * Core differentiator per Section 6.3 of the spec.
 * Keyed by (species, origin, destination) → returns a structured checklist
 * with deadlines calculated backward from the travel date.
 *
 * This is the data layer. In production, rules would live in a database
 * (DynamoDB/Aurora) and be admin-editable. For now, we hardcode the most
 * common destinations to demonstrate the engine's shape.
 */

import { CountryRequirement, PetSpecies, RequirementType } from '../types';

// ─── Requirement Templates ───────────────────────────────────────────

/**
 * A requirement template defines a rule without a specific travel date.
 * The engine calculates actual deadlines from the travel date.
 */
export interface RequirementChecklistItem {
  requirement: CountryRequirement;
  /** Calculated deadline (ISO date) — when this must be done by */
  deadline: string;
  /** Calculated earliest start date (for validity windows) */
  earliestStart?: string;
  /** Days remaining from today */
  daysRemaining: number;
  /** Whether this is overdue */
  isOverdue: boolean;
  /** Whether this is urgent (within 7 days) */
  isUrgent: boolean;
}

// ─── Rules Database (hardcoded for MVP) ──────────────────────────────

const RULES: CountryRequirement[] = [
  // ── Universal requirements ──
  {
    id: 'universal-microchip',
    species: ['dog', 'cat'],
    destinationCountry: '*',
    requirementType: 'microchip',
    title: 'ISO-compliant microchip',
    description: '15-digit ISO-compatible microchip must be implanted before any vaccinations.',
    leadTimeDays: 0,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'IATA / DEFRA',
  },
  {
    id: 'universal-rabies',
    species: ['dog', 'cat'],
    destinationCountry: '*',
    requirementType: 'rabies_vaccination',
    title: 'Rabies vaccination',
    description: 'Primary rabies vaccination required. Must be administered after microchipping.',
    leadTimeDays: 21,
    validityWindowDays: 1095, // 3 years
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'DEFRA',
  },

  // ── USA ──
  {
    id: 'usa-cdc-permit',
    species: ['dog'],
    destinationCountry: 'US',
    requirementType: 'import_permit',
    title: 'CDC import permit',
    description: 'Dogs require a CDC import permit for entry to the USA. Fast online approval (~5 minutes).',
    leadTimeDays: 7,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'CDC',
  },
  {
    id: 'usa-health-cert',
    species: ['dog', 'cat'],
    destinationCountry: 'US',
    requirementType: 'health_certificate',
    title: 'Export Health Certificate (EHC)',
    description: 'Must be completed by an authorised vet within 10 days of departure.',
    leadTimeDays: 10,
    validityWindowDays: 10,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'DEFRA',
  },

  // ── South Africa ──
  {
    id: 'za-neutering',
    species: ['dog'],
    destinationCountry: 'ZA',
    requirementType: 'neutering',
    title: 'Neutering / desexing',
    description: 'All dogs must be neutered for entry to South Africa.',
    leadTimeDays: 30,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'DAFF',
  },
  {
    id: 'za-rabies-30d',
    species: ['dog', 'cat'],
    destinationCountry: 'ZA',
    requirementType: 'rabies_vaccination',
    title: 'Rabies vaccination (30-day rule)',
    description: 'Rabies vaccination must be no less than 30 days before departure.',
    leadTimeDays: 30,
    validityWindowDays: 1095,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'DAFF',
  },
  {
    id: 'za-import-permit',
    species: ['dog'],
    destinationCountry: 'ZA',
    requirementType: 'import_permit',
    title: 'South Africa import permit',
    description: 'Import permit obtained within SA. ~45 days for dogs, ~10 days for cats. Arranged by destination partner.',
    leadTimeDays: 45,
    mandatory: true,
    fulfilledWhere: 'destination',
    authoritySource: 'DAFF',
  },
  {
    id: 'za-import-permit-cat',
    species: ['cat'],
    destinationCountry: 'ZA',
    requirementType: 'import_permit',
    title: 'South Africa import permit',
    description: 'Import permit obtained within SA. ~10 days for cats. Arranged by destination partner.',
    leadTimeDays: 10,
    mandatory: true,
    fulfilledWhere: 'destination',
    authoritySource: 'DAFF',
  },
  {
    id: 'za-blood-tests',
    species: ['dog'],
    destinationCountry: 'ZA',
    requirementType: 'blood_test',
    title: 'Blood tests (7 required)',
    description: 'Seven blood tests required within 30 days of departure. Includes Babesia Gibsoni IFAT (~28-day turnaround).',
    leadTimeDays: 30,
    validityWindowDays: 30,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'DAFF',
  },
  {
    id: 'za-ehc',
    species: ['dog', 'cat'],
    destinationCountry: 'ZA',
    requirementType: 'health_certificate',
    title: 'DEFRA Export Health Certificate',
    description: 'Must be completed within 10 days of departure.',
    leadTimeDays: 10,
    validityWindowDays: 10,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'DEFRA',
  },

  // ── Australia ──
  {
    id: 'au-titre-test',
    species: ['dog', 'cat'],
    destinationCountry: 'AU',
    requirementType: 'titre_test',
    title: 'Rabies antibody titre test (RNATT)',
    description: 'Required 6 months before travel. Must pass threshold at an approved lab.',
    leadTimeDays: 180,
    validityWindowDays: 730,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'Australian DAFF',
  },
  {
    id: 'au-import-permit',
    species: ['dog', 'cat'],
    destinationCountry: 'AU',
    requirementType: 'import_permit',
    title: 'Australian import permit',
    description: 'Required before travel. Long lead time destination — price may be revised.',
    leadTimeDays: 60,
    mandatory: true,
    fulfilledWhere: 'destination',
    authoritySource: 'Australian DAFF',
  },
  {
    id: 'au-quarantine',
    species: ['dog', 'cat'],
    destinationCountry: 'AU',
    requirementType: 'quarantine',
    title: 'Quarantine (10 days minimum)',
    description: 'All pets entering Australia must complete a minimum 10-day quarantine at a government facility.',
    leadTimeDays: 0,
    mandatory: true,
    fulfilledWhere: 'destination',
    authoritySource: 'Australian DAFF',
  },

  // ── New Zealand ──
  {
    id: 'nz-titre-test',
    species: ['dog', 'cat'],
    destinationCountry: 'NZ',
    requirementType: 'titre_test',
    title: 'Rabies antibody titre test (RNATT)',
    description: 'Required 6 months before travel (NZ specific). 3-month post-test wait.',
    leadTimeDays: 180,
    validityWindowDays: 730,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'NZ MPI',
  },

  // ── EU (generic) ──
  {
    id: 'eu-pet-passport',
    species: ['dog', 'cat'],
    destinationCountry: 'EU',
    requirementType: 'health_certificate',
    title: 'Animal Health Certificate (AHC)',
    description: 'Required for travel from GB to EU. Valid for 10 days for entry, then 4 months for return.',
    leadTimeDays: 10,
    validityWindowDays: 10,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'DEFRA / EU Regulation 576/2013',
  },
  {
    id: 'eu-tapeworm',
    species: ['dog'],
    destinationCountry: 'EU',
    requirementType: 'parasite_treatment',
    title: 'Tapeworm treatment (dogs)',
    description: 'Echinococcus treatment required 1–5 days before entry to certain EU countries (e.g. Finland, Ireland, Norway).',
    leadTimeDays: 5,
    validityWindowDays: 5,
    mandatory: true,
    fulfilledWhere: 'origin',
    authoritySource: 'EU Regulation 576/2013',
  },
];

// ─── Engine Functions ────────────────────────────────────────────────

/**
 * Get all applicable requirements for a given trip.
 */
export function getRequirementsForTrip(
  species: PetSpecies,
  originCountry: string,
  destinationCountry: string
): CountryRequirement[] {
  return RULES.filter((rule) => {
    // Species match
    if (!rule.species.includes(species)) return false;

    // Destination match — '*' means universal
    if (rule.destinationCountry !== '*' && rule.destinationCountry !== destinationCountry) {
      return false;
    }

    // Origin match (if specified on the rule)
    if (rule.originCountry && rule.originCountry !== originCountry) {
      return false;
    }

    return true;
  });
}

/**
 * Build a deadline-aware checklist from requirements and a travel date.
 * Returns items sorted by deadline (most urgent first).
 */
export function buildChecklist(
  species: PetSpecies,
  originCountry: string,
  destinationCountry: string,
  travelDate: string
): RequirementChecklistItem[] {
  const requirements = getRequirementsForTrip(species, originCountry, destinationCountry);
  const travel = new Date(travelDate);
  const today = new Date();

  const checklist: RequirementChecklistItem[] = requirements.map((req) => {
    // Deadline = travel date minus lead time
    const deadline = new Date(travel);
    deadline.setDate(deadline.getDate() - req.leadTimeDays);

    // Earliest start (if there's a validity window)
    let earliestStart: string | undefined;
    if (req.validityWindowDays) {
      const earliest = new Date(deadline);
      earliest.setDate(earliest.getDate() - req.validityWindowDays);
      // But not before today
      earliestStart = earliest.toISOString().split('T')[0];
    }

    const daysRemaining = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      requirement: req,
      deadline: deadline.toISOString().split('T')[0],
      earliestStart,
      daysRemaining,
      isOverdue: daysRemaining < 0,
      isUrgent: daysRemaining >= 0 && daysRemaining <= 7,
    };
  });

  // Sort: overdue first, then by days remaining ascending
  return checklist.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Get a human-readable summary of trip readiness.
 */
export function getTripReadinessSummary(checklist: RequirementChecklistItem[]): {
  totalRequired: number;
  overdue: number;
  urgent: number;
  upcoming: number;
} {
  return {
    totalRequired: checklist.length,
    overdue: checklist.filter((i) => i.isOverdue).length,
    urgent: checklist.filter((i) => i.isUrgent).length,
    upcoming: checklist.filter((i) => !i.isOverdue && !i.isUrgent).length,
  };
}
