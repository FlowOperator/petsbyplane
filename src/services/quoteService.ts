/**
 * Pets by Plane — Quote Service
 *
 * Handles the quote-to-booking conversion flow.
 * Creates the Owner, Pet, Trip, and initial documents in state
 * when a user completes the registration step.
 */

import { AppAction } from './store';
import {
  Owner,
  Pet,
  Trip,
  Quote,
  Payment,
  Milestone,
  PetDocument,
  PetSpecies,
  EXPORT_MILESTONES,
  IMPORT_MILESTONES,
  TripDirection,
} from '../types';
import { getRequirementsForTrip } from './rulesEngine';

// ─── Types ───────────────────────────────────────────────────────────

export interface QuoteSearchParams {
  direction: TripDirection;
  originCity: string;
  originAirport: string;
  destinationCity: string;
  destinationAirport: string;
  travelDate: string;
  petSpecies: PetSpecies;
  breed: string;
}

export interface SelectedFlight {
  airline: string;
  price: number;
  route: string;
  via?: string;
}

export interface RegistrationData {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  petName: string;
}

// ─── Quote-to-Booking Conversion ─────────────────────────────────────

/**
 * Create all entities for a new booking and dispatch them to the store.
 * Called when the user completes the register screen.
 */
export function createBookingFromQuote(
  search: QuoteSearchParams,
  selectedFlight: SelectedFlight,
  selectedAddOns: string[],
  registration: RegistrationData,
  dispatch: React.Dispatch<AppAction>
): { ownerId: string; petId: string; tripId: string } {
  const now = new Date().toISOString();
  const ownerId = `owner-${Date.now()}`;
  const petId = `pet-${Date.now()}`;
  const tripId = `trip-${Date.now()}`;
  const quoteId = `quote-${Date.now()}`;

  // Create owner
  const owner: Owner = {
    id: ownerId,
    firstName: registration.firstName,
    surname: registration.surname,
    email: registration.email,
    phone: registration.phone,
    preferredLanguage: 'en',
    mediaConsent: true,
    pets: [petId],
    createdAt: now,
  };

  // Create pet
  const pet: Pet = {
    id: petId,
    ownerId,
    name: registration.petName,
    species: search.petSpecies,
    breed: search.breed,
    dateOfBirth: '',
    weight: 0,
    microchipNumber: '',
    documentStatus: 'missing',
    createdAt: now,
    updatedAt: now,
  };

  // Create milestones
  const milestoneTemplates = search.direction === 'export'
    ? EXPORT_MILESTONES
    : IMPORT_MILESTONES;

  const milestones: Milestone[] = milestoneTemplates.map((title, index) => ({
    id: `ms-${tripId}-${index + 1}`,
    tripId,
    order: index + 1,
    title,
    description: '',
    status: index === 0 ? 'current' : 'upcoming',
  }));

  // Create quote
  const deposit = Math.round(selectedFlight.price * 0.2); // 20% deposit
  const quote: Quote = {
    id: quoteId,
    tripId,
    amount: selectedFlight.price,
    deposit,
    status: 'sent',
    isProvisional: true,
    validUntil: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    issuedAt: now,
    addOns: [],
  };

  // Create initial payment (deposit)
  const payment: Payment = {
    id: `pay-${Date.now()}`,
    tripId,
    type: 'deposit',
    amount: deposit,
    status: 'pending',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'Booking deposit',
  };

  // Create trip
  const trip: Trip = {
    id: tripId,
    ownerId,
    petId,
    direction: search.direction,
    status: 'quote_received',
    originCity: search.originCity,
    originAirport: search.originAirport,
    destinationCity: search.destinationCity,
    destinationAirport: search.destinationAirport,
    travelDate: search.travelDate,
    flight: {
      airline: selectedFlight.airline,
      flightNumber: '',
      route: selectedFlight.route,
      departureTime: '',
      arrivalTime: '',
      confirmed: false,
    },
    quote,
    payments: [payment],
    milestones,
    termsAccepted: {
      acceptedAt: now,
      termsVersion: '2026-01',
      ownerName: `${registration.firstName} ${registration.surname}`,
      tripId,
    },
    createdAt: now,
    updatedAt: now,
  };

  // Generate required documents based on rules engine
  const requirements = getRequirementsForTrip(
    search.petSpecies,
    resolveCountryFromAirport(search.originAirport),
    resolveCountryFromAirport(search.destinationAirport)
  );

  const documents: PetDocument[] = requirements
    .filter((r) => r.mandatory)
    .map((req, i) => ({
      id: `doc-${tripId}-${i}`,
      petId,
      tripId,
      type: req.requirementType as any,
      name: req.title,
      description: req.description,
      status: 'missing' as const,
    }));

  // Dispatch everything to store
  dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  dispatch({ type: 'SET_OWNER', payload: owner });
  dispatch({ type: 'ADD_PET', payload: pet });
  dispatch({ type: 'SET_TRIPS', payload: [trip] });
  dispatch({ type: 'SET_ACTIVE_TRIP', payload: trip });
  dispatch({ type: 'SET_DOCUMENTS', payload: documents });

  return { ownerId, petId, tripId };
}

// ─── Helpers ─────────────────────────────────────────────────────────

function resolveCountryFromAirport(code: string): string {
  const map: Record<string, string> = {
    LHR: 'GB', LGW: 'GB', MAN: 'GB', STN: 'GB',
    JFK: 'US', LAX: 'US', ORD: 'US', MIA: 'US', SFO: 'US',
    CPT: 'ZA', JNB: 'ZA', DUR: 'ZA',
    SYD: 'AU', MEL: 'AU', BNE: 'AU',
    AKL: 'NZ', WLG: 'NZ',
    DXB: 'AE', AUH: 'AE',
    CDG: 'EU', AMS: 'EU', FRA: 'EU', FCO: 'EU', MAD: 'EU', BCN: 'EU',
    ADD: 'ET',
  };
  return map[code] || 'UNKNOWN';
}
