/**
 * Staff Portal — Mock Data
 * Represents the shared state consultants see across all trips.
 */

export type TripStatus = 'quote_requested' | 'quote_sent' | 'deposit_pending' | 'active' | 'in_transit' | 'completed';
export type QuoteSource = 'app' | 'website';

export interface StaffTrip {
  id: string;
  petName: string;
  petSpecies: 'dog' | 'cat' | 'bird' | 'exotic';
  breed: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  origin: string;
  destination: string;
  travelDate: string;
  status: TripStatus;
  source: QuoteSource;
  consultant: string;
  milestones: StaffMilestone[];
  documents: StaffDocument[];
  createdAt: string;
  quote?: { amount: number; deposit: number; validUntil: string };
}

export interface StaffMilestone {
  id: string;
  order: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  completedAt?: string;
  plannedDate?: string;
}

export interface StaffDocument {
  id: string;
  name: string;
  status: 'verified' | 'uploaded' | 'missing' | 'expiring_soon';
  uploadedAt?: string;
}

// ─── Sample Data ─────────────────────────────────────────────────────

export const MOCK_TRIPS: StaffTrip[] = [
  {
    id: 'trip-001',
    petName: 'Darcy',
    petSpecies: 'dog',
    breed: 'Labrador Retriever',
    ownerName: 'Freddie Instone',
    ownerEmail: 'freddie@example.com',
    ownerPhone: '+44 7700 900123',
    origin: 'LHR',
    destination: 'CPT',
    travelDate: '2026-09-10',
    status: 'active',
    source: 'app',
    consultant: 'Sarah Whitfield',
    createdAt: '2026-06-01',
    quote: { amount: 2050, deposit: 410, validUntil: '2026-07-01' },
    milestones: [
      { id: 'ms-1', order: 1, title: 'Initial consultation & quote', description: 'Route confirmed via KLM Amsterdam', status: 'completed', completedAt: '2026-06-04' },
      { id: 'ms-2', order: 2, title: 'Veterinary requirements', description: 'Rabies, DHPP, Lepto confirmed. 7 blood tests scheduled.', status: 'completed', completedAt: '2026-06-18' },
      { id: 'ms-3', order: 3, title: 'Route planning & flight booking', description: 'KLM via Amsterdam booked', status: 'completed', completedAt: '2026-06-25' },
      { id: 'ms-4', order: 4, title: 'IATA crate delivery', description: 'Size 4 plastic crate delivered for acclimatisation', status: 'completed', completedAt: '2026-07-10' },
      { id: 'ms-5', order: 5, title: 'Export preparation & documentation', description: 'EHC, SA import permit, blood results — in progress', status: 'current', plannedDate: '2026-08-31' },
      { id: 'ms-6', order: 6, title: 'Collection & airport check-in', description: 'Door collection → LHR cargo', status: 'upcoming', plannedDate: '2026-09-10' },
      { id: 'ms-7', order: 7, title: 'Arrival & reunion', description: 'Cape Town landing, customs clearance', status: 'upcoming', plannedDate: '2026-09-11' },
    ],
    documents: [
      { id: 'doc-1', name: 'Microchip confirmation', status: 'verified', uploadedAt: '2026-06-05' },
      { id: 'doc-2', name: 'Rabies vaccination record', status: 'verified', uploadedAt: '2026-06-05' },
      { id: 'doc-3', name: 'Blood tests (7 for SA)', status: 'uploaded', uploadedAt: '2026-07-28' },
      { id: 'doc-4', name: 'SA import permit', status: 'verified', uploadedAt: '2026-07-20' },
      { id: 'doc-5', name: 'DEFRA Export Health Certificate', status: 'missing' },
    ],
  },
  {
    id: 'trip-002',
    petName: 'Luna',
    petSpecies: 'cat',
    breed: 'British Shorthair',
    ownerName: 'Amira Khalil',
    ownerEmail: 'amira.k@example.com',
    ownerPhone: '+44 7788 112233',
    origin: 'LHR',
    destination: 'DXB',
    travelDate: '2026-08-20',
    status: 'active',
    source: 'website',
    consultant: 'Sarah Whitfield',
    createdAt: '2026-05-15',
    quote: { amount: 1380, deposit: 276, validUntil: '2026-06-15' },
    milestones: [
      { id: 'ms-1', order: 1, title: 'Initial consultation & quote', description: 'Emirates direct confirmed', status: 'completed', completedAt: '2026-05-18' },
      { id: 'ms-2', order: 2, title: 'Veterinary requirements', description: 'Rabies + FVRCP — all current', status: 'completed', completedAt: '2026-06-01' },
      { id: 'ms-3', order: 3, title: 'Route planning & flight booking', description: 'Emirates EK2, overnight boarding included', status: 'completed', completedAt: '2026-06-10' },
      { id: 'ms-4', order: 4, title: 'IATA crate delivery', description: 'Size 2 plastic crate delivered', status: 'completed', completedAt: '2026-07-01' },
      { id: 'ms-5', order: 5, title: 'Export preparation & documentation', description: 'UAE import permit pending', status: 'current', plannedDate: '2026-08-10' },
      { id: 'ms-6', order: 6, title: 'Collection & airport check-in', description: 'Overnight boarding then LHR check-in', status: 'upcoming', plannedDate: '2026-08-19' },
      { id: 'ms-7', order: 7, title: 'Arrival & reunion', description: 'Dubai landing', status: 'upcoming', plannedDate: '2026-08-20' },
    ],
    documents: [
      { id: 'doc-1', name: 'Microchip confirmation', status: 'verified', uploadedAt: '2026-05-20' },
      { id: 'doc-2', name: 'Rabies vaccination', status: 'verified', uploadedAt: '2026-05-20' },
      { id: 'doc-3', name: 'UAE import permit', status: 'missing' },
      { id: 'doc-4', name: 'Export Health Certificate', status: 'missing' },
    ],
  },
  {
    id: 'trip-003',
    petName: 'Winston',
    petSpecies: 'dog',
    breed: 'French Bulldog',
    ownerName: 'Tom Henderson',
    ownerEmail: 'tom.h@example.com',
    ownerPhone: '+44 7900 555666',
    origin: 'LHR',
    destination: 'JFK',
    travelDate: '',
    status: 'quote_requested',
    source: 'app',
    consultant: 'Unassigned',
    createdAt: '2026-08-01',
    milestones: [],
    documents: [],
  },
  {
    id: 'trip-004',
    petName: 'Milo',
    petSpecies: 'dog',
    breed: 'Golden Retriever',
    ownerName: 'Jessica Park',
    ownerEmail: 'jess.park@example.com',
    ownerPhone: '+44 7711 223344',
    origin: 'MAN',
    destination: 'SYD',
    travelDate: '2026-11-15',
    status: 'quote_sent',
    source: 'website',
    consultant: 'Sarah Whitfield',
    createdAt: '2026-07-25',
    quote: { amount: 3200, deposit: 640, validUntil: '2026-08-22' },
    milestones: [
      { id: 'ms-1', order: 1, title: 'Initial consultation & quote', description: 'Quote sent, awaiting acceptance', status: 'current' },
    ],
    documents: [],
  },
  {
    id: 'trip-005',
    petName: 'Bella',
    petSpecies: 'dog',
    breed: 'Cocker Spaniel',
    ownerName: 'Mark & Sarah Collins',
    ownerEmail: 'collins.family@example.com',
    ownerPhone: '+44 7800 998877',
    origin: 'LHR',
    destination: 'AKL',
    travelDate: '2026-12-05',
    status: 'deposit_pending',
    source: 'app',
    consultant: 'Sarah Whitfield',
    createdAt: '2026-07-10',
    quote: { amount: 3800, deposit: 760, validUntil: '2026-08-07' },
    milestones: [
      { id: 'ms-1', order: 1, title: 'Initial consultation & quote', description: 'Quote accepted — awaiting deposit', status: 'current' },
    ],
    documents: [],
  },
];

export function getStatusLabel(status: TripStatus): string {
  switch (status) {
    case 'quote_requested': return 'New request';
    case 'quote_sent': return 'Quote sent';
    case 'deposit_pending': return 'Awaiting deposit';
    case 'active': return 'Active';
    case 'in_transit': return 'In transit';
    case 'completed': return 'Completed';
  }
}

export function getStatusVariant(status: TripStatus): string {
  switch (status) {
    case 'quote_requested': return 'quote';
    case 'quote_sent': return 'pending';
    case 'deposit_pending': return 'pending';
    case 'active': return 'active';
    case 'in_transit': return 'active';
    case 'completed': return 'completed';
  }
}
