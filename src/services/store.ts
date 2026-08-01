/**
 * Pets by Plane — Global State Store (V1 Realistic Rebuild)
 * 
 * Central flag: `hasBooking` — determines what every screen shows.
 * Set true when deposit is paid at checkout.
 */

import { createContext, useContext } from 'react';
import {
  Pet,
  Owner,
  Trip,
  Consultant,
  PetDocument,
  TripStatus,
} from '../types';

// ─── State Shape ─────────────────────────────────────────────────────

export interface AppState {
  // Auth
  isAuthenticated: boolean;

  // The single source of truth for app state
  hasBooking: boolean;

  // User data (populated at checkout)
  owner: Owner | null;

  // Pet data (populated at checkout)
  pets: Pet[];

  // Trip data (populated when booking is confirmed)
  activeTrip: Trip | null;
  trips: Trip[];

  // Consultant (assigned after booking)
  consultant: Consultant | null;

  // Documents (populated by consultant after booking)
  documents: PetDocument[];

  // Quote flow state
  quoteReady: boolean;
}

export const initialState: AppState = {
  isAuthenticated: false,
  hasBooking: false,
  owner: null,
  pets: [],
  activeTrip: null,
  trips: [],
  consultant: null,
  documents: [],
  quoteReady: false,
};

// ─── Actions ─────────────────────────────────────────────────────────

export type AppAction =
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_OWNER'; payload: Owner }
  | { type: 'ADD_PET'; payload: Pet }
  | { type: 'UPDATE_PET'; payload: Pet }
  | { type: 'SET_TRIPS'; payload: Trip[] }
  | { type: 'SET_ACTIVE_TRIP'; payload: Trip }
  | { type: 'UPDATE_TRIP_STATUS'; payload: { tripId: string; status: TripStatus } }
  | { type: 'SET_CONSULTANT'; payload: Consultant }
  | { type: 'SET_DOCUMENTS'; payload: PetDocument[] }
  | { type: 'ADD_DOCUMENT'; payload: PetDocument }
  | { type: 'UPDATE_DOCUMENT'; payload: PetDocument }
  | { type: 'SET_BOOKING'; payload: { owner: Owner; pet: Pet; trip: Trip; consultant: Consultant; documents: PetDocument[] } }
  | { type: 'SET_QUOTE_READY'; payload: boolean }
  | { type: 'LOGOUT' };

// ─── Reducer ─────────────────────────────────────────────────────────

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };

    case 'SET_OWNER':
      return { ...state, owner: action.payload };

    case 'ADD_PET':
      return { ...state, pets: [...state.pets, action.payload] };

    case 'UPDATE_PET':
      return {
        ...state,
        pets: state.pets.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case 'SET_TRIPS':
      return { ...state, trips: action.payload };

    case 'SET_ACTIVE_TRIP':
      return { ...state, activeTrip: action.payload };

    case 'UPDATE_TRIP_STATUS':
      return {
        ...state,
        trips: state.trips.map((t) =>
          t.id === action.payload.tripId
            ? { ...t, status: action.payload.status }
            : t
        ),
        activeTrip:
          state.activeTrip?.id === action.payload.tripId
            ? { ...state.activeTrip, status: action.payload.status }
            : state.activeTrip,
      };

    case 'SET_CONSULTANT':
      return { ...state, consultant: action.payload };

    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };

    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };

    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map((d) =>
          d.id === action.payload.id ? action.payload : d
        ),
      };

    // The key transition: deposit paid → full booking experience
    case 'SET_BOOKING':
      return {
        ...state,
        isAuthenticated: true,
        hasBooking: true,
        owner: action.payload.owner,
        pets: [action.payload.pet],
        activeTrip: action.payload.trip,
        trips: [action.payload.trip],
        consultant: action.payload.consultant,
        documents: action.payload.documents,
      };

    case 'SET_QUOTE_READY':
      return { ...state, quoteReady: action.payload };

    case 'LOGOUT':
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────

export interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue>({
  state: initialState,
  dispatch: () => {},
});

export function useAppState() {
  return useContext(AppContext);
}
