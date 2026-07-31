/**
 * Pets by Plane — Mock Data
 * Realistic seed data for development, based on the South Africa worked example
 * and the brand guide screens (Darcy the Labrador, LHR → LAX).
 */

import {
  Pet,
  Owner,
  Trip,
  Consultant,
  PetDocument,
  Milestone,
  Quote,
  Payment,
  FlightDetails,
  AddOn,
} from '../types';

// ─── Consultant ──────────────────────────────────────────────────────

export const mockConsultant: Consultant = {
  id: 'cons-001',
  name: 'Sarah Whitfield',
  phone: '+44 1903 741 000',
  email: 'sarah@petsbyplane.com',
  isOnline: true,
};

// ─── Owner ───────────────────────────────────────────────────────────

export const mockOwner: Owner = {
  id: 'owner-001',
  firstName: 'Freddie',
  surname: 'Instone',
  email: 'freddie@petsbyplane.com',
  phone: '+44 7700 900123',
  address: 'Charity Farm, Pulborough Road, West Sussex',
  nationality: 'British',
  preferredLanguage: 'en',
  mediaConsent: true,
  pets: ['pet-001'],
  createdAt: '2026-05-20T10:00:00Z',
};

// ─── Pet ─────────────────────────────────────────────────────────────

export const mockPet: Pet = {
  id: 'pet-001',
  ownerId: 'owner-001',
  name: 'Darcy',
  species: 'dog',
  breed: 'Labrador Retriever',
  dateOfBirth: '2022-03-12',
  weight: 28,
  microchipNumber: '981 000 012 345 678',
  isNeutered: true,
  rabiesVaccineDate: '2026-01-15',
  rabiesVaccineExpiry: '2029-01-15',
  otherVaccines: [
    { name: 'DHPP', dateAdministered: '2025-11-01', verified: true },
    { name: 'Bordetella', dateAdministered: '2026-04-10', verified: true },
  ],
  assignedCrate: {
    iataSize: 'Size 4',
    dimensions: '91 × 58 × 64 cm',
    type: 'plastic',
    isOwnerSupplied: false,
    complianceChecked: true,
  },
  measurements: {
    lengthNoseToTail: 75,
    heightToElbow: 32,
    widthAtWidest: 38,
    standingHeight: 60,
  },
  documentStatus: 'pending',
  createdAt: '2026-05-20T10:00:00Z',
  updatedAt: '2026-06-14T09:00:00Z',
};

// ─── Trip ────────────────────────────────────────────────────────────

export const mockFlight: FlightDetails = {
  airline: 'Ethiopian Airlines',
  flightNumber: 'ET701',
  route: 'LHR → ADD → CPT',
  departureTime: '2026-08-10T09:30:00Z',
  arrivalTime: '2026-08-11T06:45:00Z',
  transitHub: 'ADD',
  confirmed: true,
};

export const mockQuote: Quote = {
  id: 'quote-001',
  tripId: 'trip-001',
  amount: 1453,
  deposit: 291,
  status: 'accepted',
  isProvisional: false,
  validUntil: '2026-08-02T00:00:00Z',
  issuedAt: '2026-06-04T00:00:00Z',
  addOns: [
    { id: 'ao-1', name: 'Door collection', description: 'Pickup from home to LHR', price: 150, selected: true },
    { id: 'ao-2', name: 'IATA travel crate', description: 'Size 4 plastic crate', price: 184, selected: true },
    { id: 'ao-3', name: 'Customs clearance', description: 'SA partner handles destination customs', price: 426, selected: true },
    { id: 'ao-4', name: 'In-transit vet cover', description: '24/7 veterinary support', price: 75, selected: false },
  ],
};

export const mockPayments: Payment[] = [
  {
    id: 'pay-001',
    tripId: 'trip-001',
    type: 'deposit',
    amount: 250,
    status: 'pending',
    dueDate: '2026-06-10',
    description: 'Booking deposit',
  },
];

export const mockMilestones: Milestone[] = [
  {
    id: 'ms-1', tripId: 'trip-001', order: 1,
    title: 'Initial consultation & quote',
    description: "Reviewed Darcy's needs and confirmed the Cape Town route via Addis Ababa",
    status: 'completed', completedAt: '2026-06-02T00:00:00Z',
  },
  {
    id: 'ms-2', tripId: 'trip-001', order: 2,
    title: 'Veterinary requirements & health certificates',
    description: 'Vaccinations checked, 7 blood tests scheduled, neutering confirmed',
    status: 'completed', completedAt: '2026-06-14T00:00:00Z',
  },
  {
    id: 'ms-3', tripId: 'trip-001', order: 3,
    title: 'Route planning & flight booking',
    description: 'Ethiopian Airlines via Addis Ababa confirmed — best value for SA',
    status: 'completed', completedAt: '2026-06-22T00:00:00Z',
  },
  {
    id: 'ms-4', tripId: 'trip-001', order: 4,
    title: 'IATA-compliant crate delivery',
    description: "Darcy's Size 4 travel crate delivered for acclimatisation",
    status: 'completed', completedAt: '2026-07-03T00:00:00Z',
  },
  {
    id: 'ms-5', tripId: 'trip-001', order: 5,
    title: 'Export preparation & documentation',
    description: 'DEFRA Export Health Certificate, SA import permit, blood test results — all in order',
    status: 'current', estimatedDate: '2026-07-31',
  },
  {
    id: 'ms-6', tripId: 'trip-001', order: 6,
    title: 'Collection & airport check-in',
    description: 'Darcy collected from home and checked in at LHR cargo terminal',
    status: 'upcoming', plannedDate: '2026-08-10',
  },
  {
    id: 'ms-7', tripId: 'trip-001', order: 7,
    title: 'Arrival & reunion',
    description: 'Darcy lands at Cape Town International and clears customs',
    status: 'upcoming', plannedDate: '2026-08-11',
  },
];

export const mockTrip: Trip = {
  id: 'trip-001',
  ownerId: 'owner-001',
  petId: 'pet-001',
  direction: 'export',
  status: 'active',
  originCity: 'London',
  originAirport: 'LHR',
  destinationCity: 'Cape Town',
  destinationAirport: 'CPT',
  travelDate: '2026-08-10',
  flight: mockFlight,
  consultantId: 'cons-001',
  consultant: mockConsultant,
  quote: mockQuote,
  payments: mockPayments,
  milestones: mockMilestones,
  createdAt: '2026-06-01T00:00:00Z',
  updatedAt: '2026-06-28T00:00:00Z',
};

// ─── Documents ───────────────────────────────────────────────────────

export const mockDocuments: PetDocument[] = [
  {
    id: 'doc-001', petId: 'pet-001', tripId: 'trip-001',
    type: 'microchip_confirmation',
    name: 'Microchip confirmation',
    description: '15-digit ISO-compliant microchip verified',
    status: 'verified', verifiedAt: '2026-06-05T00:00:00Z',
  },
  {
    id: 'doc-002', petId: 'pet-001', tripId: 'trip-001',
    type: 'rabies_vaccination',
    name: 'Rabies vaccination record',
    description: 'Administered 30+ days before departure as required for SA',
    status: 'verified', verifiedAt: '2026-06-05T00:00:00Z',
  },
  {
    id: 'doc-003', petId: 'pet-001', tripId: 'trip-001',
    type: 'blood_test',
    name: 'Blood tests (7 required for SA)',
    description: 'Including Babesia Gibsoni IFAT — all within 30 days of departure',
    status: 'verified', verifiedAt: '2026-07-15T00:00:00Z',
  },
  {
    id: 'doc-004', petId: 'pet-001', tripId: 'trip-001',
    type: 'import_permit',
    name: 'South Africa import permit',
    description: 'Obtained via SA destination partner (DAFF) — ~45 day turnaround',
    status: 'verified', verifiedAt: '2026-07-20T00:00:00Z',
  },
  {
    id: 'doc-005', petId: 'pet-001', tripId: 'trip-001',
    type: 'export_health_certificate',
    name: 'DEFRA Export Health Certificate',
    description: 'Must be completed within 10 days of departure',
    status: 'missing', validityWindowDays: 10,
  },
];
