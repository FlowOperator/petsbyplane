/**
 * Hook to get the requirements checklist for the active trip.
 */

import { useMemo } from 'react';
import { useAppState } from '../services/store';
import {
  buildChecklist,
  getTripReadinessSummary,
  RequirementChecklistItem,
} from '../services/rulesEngine';
import { PetSpecies } from '../types';

// Simple country code mapping — would be a proper lookup in production
const CITY_TO_COUNTRY: Record<string, string> = {
  'London': 'GB', 'LHR': 'GB', 'Gatwick': 'GB', 'Manchester': 'GB',
  'Los Angeles': 'US', 'LAX': 'US', 'New York': 'US', 'JFK': 'US',
  'Cape Town': 'ZA', 'CPT': 'ZA', 'Johannesburg': 'ZA', 'JNB': 'ZA',
  'Sydney': 'AU', 'SYD': 'AU', 'Melbourne': 'AU',
  'Auckland': 'NZ', 'AKL': 'NZ',
  'Dubai': 'AE', 'DXB': 'AE',
  'Paris': 'EU', 'Amsterdam': 'EU', 'Frankfurt': 'EU', 'Berlin': 'EU',
  'Madrid': 'EU', 'Rome': 'EU', 'Barcelona': 'EU',
};

function resolveCountry(cityOrAirport: string): string {
  return CITY_TO_COUNTRY[cityOrAirport] || 'UNKNOWN';
}

export function useRequirements() {
  const { state } = useAppState();
  const { activeTrip, pets } = state;

  const checklist = useMemo<RequirementChecklistItem[]>(() => {
    if (!activeTrip) return [];

    const pet = pets.find((p) => p.id === activeTrip.petId);
    if (!pet) return [];

    const origin = resolveCountry(activeTrip.originAirport || activeTrip.originCity);
    const destination = resolveCountry(activeTrip.destinationAirport || activeTrip.destinationCity);
    const travelDate = activeTrip.travelDate || new Date().toISOString();

    return buildChecklist(
      pet.species as PetSpecies,
      origin,
      destination,
      travelDate
    );
  }, [activeTrip, pets]);

  const summary = useMemo(() => getTripReadinessSummary(checklist), [checklist]);

  return { checklist, summary };
}
