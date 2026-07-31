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
  firstName: 'Alex',
  surname: 'Whitfield',
  email: 'alex@example.com',
  phone: '+44 7700 900123',
  address: '14 Larch Road, London',
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
  airline: 'British Airways',
  flightNumber: 'BA283',
  route: 'LHR → LAX',
  departureTime: '2026-07-14T10:45:00Z',
  arrivalTime: '2026-07-14T21:50:00Z',
  confirmed: true,
};

export const mockQuote: Quote = {
  id: 'quote-001',
  tripId: 'trip-001',
  amount: 2598,
  deposit: 250,
  status: 'accepted',
  isProvisional: false,
  validUntil: '2026-07-02T00:00:00Z',
  issuedAt: '2026-06-04T00:00:00Z',
  addOns: [
    { id: 'ao-1', name: 'Door collection', description: 'Pickup from home', price: 150, selected: true },
    { id: 'ao-2', name: 'IATA travel crate', description: 'Size 4 plastic', price: 184, selected: true },
    { id: 'ao-3', name: 'Customs clearance', description: 'US side clearance', price: 320, selected: false },
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
    description: "Reviewed Darcy's needs and confirmed the LAX route",
    status: 'completed', completedAt: '2026-06-02T00:00:00Z',
  },
  {
    id: 'ms-2', tripId: 'trip-001', order: 2,
    title: 'Veterinary requirements & health certificates',
    description: 'Vaccinations checked and export health certificate issued',
    status: 'completed', completedAt: '2026-06-14T00:00:00Z',
  },
  {
    id: 'ms-3', tripId: 'trip-001', order: 3,
    title: 'Route planning & flight booking',
    description: 'Direct cargo flight booked with a pet-approved carrier',
    status: 'completed', completedAt: '2026-06-22T00:00:00Z',
  },
  {
    id: 'ms-4', tripId: 'trip-001', order: 4,
    title: 'IATA-compliant crate delivery',
    description: "Darcy's travel crate is out for delivery to your home",
    status: 'current', estimatedDate: '2026-07-03',
  },
  {
    id: 'ms-5', tripId: 'trip-001', order: 5,
    title: 'Export preparation & documentation',
    description: 'Final paperwork bundle prepared for customs',
    status: 'upcoming', plannedDate: '2026-07-10',
  },
  {
    id: 'ms-6', tripId: 'trip-001', order: 6,
    title: 'Collection & airport check-in',
    description: 'Darcy is collected and checked in at LHR cargo terminal',
    status: 'upcoming', plannedDate: '2026-07-14',
  },
  {
    id: 'ms-7', tripId: 'trip-001', order: 7,
    title: 'Arrival & reunion',
    description: 'Darcy lands at LAX and is reunited with you',
    status: 'upcoming', plannedDate: '2026-07-15',
  },
];

export const mockTrip: Trip = {
  id: 'trip-001',
  ownerId: 'owner-001',
  petId: 'pet-001',
  direction: 'export',
  status: 'deposit_pending',
  originCity: 'London',
  originAirport: 'LHR',
  destinationCity: 'Los Angeles',
  destinationAirport: 'LAX',
  travelDate: '2026-07-14',
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
    description: 'Confirms Darcy can be identified on arrival',
    status: 'verified', verifiedAt: '2026-06-05T00:00:00Z',
  },
  {
    id: 'doc-002', petId: 'pet-001', tripId: 'trip-001',
    type: 'rabies_vaccination',
    name: 'Rabies vaccination record',
    description: 'Required proof Darcy is protected against rabies',
    status: 'verified', verifiedAt: '2026-06-05T00:00:00Z',
  },
  {
    id: 'doc-003', petId: 'pet-001', tripId: 'trip-001',
    type: 'titre_test',
    name: 'Rabies antibody titre test (RNATT)',
    description: "Confirms the vaccine has taken effect in Darcy's blood",
    status: 'expiring_soon', expiryDate: '2026-07-20',
    validityWindowDays: 90,
  },
  {
    id: 'doc-004', petId: 'pet-001', tripId: 'trip-001',
    type: 'export_health_certificate',
    name: 'Export Health Certificate',
    description: 'Official sign-off needed before Darcy can fly',
    status: 'missing', validityWindowDays: 10,
  },
  {
    id: 'doc-005', petId: 'pet-001', tripId: 'trip-001',
    type: 'import_permit',
    name: 'USA CDC import permit',
    description: 'Clears Darcy for entry with US customs',
    status: 'missing',
  },
];
