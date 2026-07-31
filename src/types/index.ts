/**
 * Pets by Plane — Core Data Types
 * Based on Section 7 of the requirements spec
 */

// ─── Pet Types ───────────────────────────────────────────────────────

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'exotic' | 'horse';

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  dateOfBirth: string; // ISO date
  weight: number; // kg
  microchipNumber: string;
  photo?: string; // URI
  isNeutered?: boolean;

  // Vaccination status
  rabiesVaccineDate?: string;
  rabiesVaccineExpiry?: string;
  otherVaccines?: VaccineRecord[];

  // Crate
  assignedCrate?: CrateAssignment;

  // Measurements (dogs only)
  measurements?: DogMeasurements;

  // Status
  documentStatus: 'complete' | 'pending' | 'missing';
  createdAt: string;
  updatedAt: string;
}

export interface DogMeasurements {
  lengthNoseToTail: number; // cm
  heightToElbow: number; // cm
  widthAtWidest: number; // cm
  standingHeight: number; // cm (top of head/ears)
}

export interface VaccineRecord {
  name: string; // e.g. "DHPP", "Bordetella", "Leptospirosis"
  dateAdministered: string;
  expiryDate?: string;
  verified: boolean;
}

export interface CrateAssignment {
  iataSize: string; // e.g. "Size 4"
  dimensions: string; // e.g. "91 × 58 × 64 cm"
  type: 'plastic' | 'wood';
  isOwnerSupplied: boolean;
  complianceChecked: boolean;
}

// ─── Owner / User ────────────────────────────────────────────────────

export interface Owner {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  address?: string;
  passportNumber?: string;
  nationality?: string;
  visaStatus?: string;
  arrivalDate?: string;
  arrivalFlight?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  preferredLanguage: string;
  mediaConsent: boolean; // default true per T&Cs
  collectionPerson?: CollectionPerson;
  pets: string[]; // Pet IDs
  createdAt: string;
}

export interface CollectionPerson {
  name: string;
  phone: string;
  email?: string;
  relationship?: string;
}

// ─── Trip / Booking ──────────────────────────────────────────────────

export type TripDirection = 'export' | 'import';

export type TripStatus =
  | 'quote_requested'
  | 'quote_received'
  | 'deposit_pending'
  | 'documents_pending'
  | 'active'
  | 'in_transit'
  | 'arrived'
  | 'completed'
  | 'cancelled';

export interface Trip {
  id: string;
  ownerId: string;
  petId: string;
  direction: TripDirection;
  status: TripStatus;

  // Route
  originCity: string;
  originAirport: string; // IATA code
  destinationCity: string;
  destinationAirport: string; // IATA code
  travelDate?: string; // ISO date
  returnDate?: string; // for return trips

  // Flight details (once confirmed)
  flight?: FlightDetails;

  // Consultant
  consultantId?: string;
  consultant?: Consultant;

  // Financial
  quote?: Quote;
  payments: Payment[];

  // Milestones
  milestones: Milestone[];

  // Consents
  termsAccepted?: ConsentRecord;
  mediaConsent?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface FlightDetails {
  airline: string;
  flightNumber: string;
  route: string; // e.g. "LHR → ADD → CPT"
  departureTime: string;
  arrivalTime: string;
  transitHub?: string;
  confirmed: boolean;
}

// ─── Quote & Payment ─────────────────────────────────────────────────

export type QuoteStatus = 'pending' | 'sent' | 'accepted' | 'expired' | 'revised';

export interface Quote {
  id: string;
  tripId: string;
  amount: number; // GBP
  deposit: number;
  status: QuoteStatus;
  isProvisional: boolean; // true until airline confirms
  validUntil: string; // 28 days from issue
  issuedAt: string;
  addOns: AddOn[];
  breakdown?: QuoteBreakdown[];
}

export interface QuoteBreakdown {
  label: string;
  amount: number;
  included: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number | 'by_distance' | 'per_night';
  selected: boolean;
}

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'refunded';

export interface Payment {
  id: string;
  tripId: string;
  type: 'deposit' | 'instalment' | 'final_balance' | 'additional_fee';
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  description?: string;
}

// ─── Milestones & Tracking ───────────────────────────────────────────

export type MilestoneStatus = 'completed' | 'current' | 'upcoming';

export interface Milestone {
  id: string;
  tripId: string;
  order: number;
  title: string;
  description: string;
  status: MilestoneStatus;
  plannedDate?: string;
  completedAt?: string;
  estimatedDate?: string;
}

// Export milestones (7-step journey)
export const EXPORT_MILESTONES = [
  'Initial consultation & quote',
  'Veterinary requirements & health certificates',
  'Route planning & flight booking',
  'IATA-compliant crate delivery',
  'Export preparation & documentation',
  'Collection & airport check-in',
  'Arrival & reunion',
] as const;

// Import milestones (shorter ARC-based flow)
export const IMPORT_MILESTONES = [
  'Arrival details confirmed',
  'Animal Reception Centre pre-check',
  'Landing',
  'Vet & document check at ARC',
  'Customs clearance',
  'Collection or delivery',
] as const;

// ─── Consultant ──────────────────────────────────────────────────────

export interface Consultant {
  id: string;
  name: string;
  photo?: string;
  phone: string;
  email: string;
  isOnline?: boolean;
}

// ─── Documents ───────────────────────────────────────────────────────

export type DocumentStatus = 'verified' | 'expiring_soon' | 'missing' | 'uploaded' | 'expired';

export interface PetDocument {
  id: string;
  petId: string;
  tripId: string;
  type: DocumentType;
  name: string;
  description: string;
  status: DocumentStatus;
  fileUri?: string;
  uploadedAt?: string;
  expiryDate?: string;
  verifiedAt?: string;
  validityWindowDays?: number;
}

export type DocumentType =
  | 'microchip_confirmation'
  | 'rabies_vaccination'
  | 'titre_test'
  | 'export_health_certificate'
  | 'import_permit'
  | 'health_screening'
  | 'passport'
  | 'insurance'
  | 'other';

// ─── Country Requirements (Rules Engine) ─────────────────────────────

export interface CountryRequirement {
  id: string;
  species: PetSpecies[];
  originCountry?: string; // ISO country code, or null for "any"
  destinationCountry: string;
  requirementType: RequirementType;
  title: string;
  description: string; // Plain-English explanation
  leadTimeDays: number; // Days before travel this must be done
  validityWindowDays?: number; // How long the result is valid
  mandatory: boolean;
  fulfilledWhere: 'origin' | 'destination' | 'either';
  authoritySource?: string; // e.g. "DEFRA", "CDC", "DAFF"
  breedRestrictions?: string[]; // If only certain breeds
}

export type RequirementType =
  | 'microchip'
  | 'rabies_vaccination'
  | 'titre_test'
  | 'blood_test'
  | 'vaccination'
  | 'import_permit'
  | 'health_certificate'
  | 'quarantine'
  | 'health_screening'
  | 'neutering'
  | 'parasite_treatment'
  | 'other';

// ─── Consent / Legal ─────────────────────────────────────────────────

export interface ConsentRecord {
  acceptedAt: string;
  termsVersion: string;
  ownerName: string;
  tripId: string;
}

// ─── Cancellation Policy ─────────────────────────────────────────────

export interface CancellationTier {
  daysBeforeTravel: number; // e.g. 30+ days
  feePercentage: number; // e.g. 25 means 25%
  description: string;
}
