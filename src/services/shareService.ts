/**
 * Pets by Plane — Shareable Tracking Link Service
 *
 * Generates shareable tracking URLs/views for family members
 * or the receiving vet at the destination (Section 6.8).
 *
 * In production, this creates a short-lived authenticated URL
 * that shows a read-only view of the journey milestones.
 */

import { Share, Platform } from 'react-native';
import { Trip, Pet, Milestone } from '../types';

// ─── Types ───────────────────────────────────────────────────────────

export interface ShareableTrackingData {
  petName: string;
  route: string;
  travelDate: string;
  currentStatus: string;
  milestones: { title: string; status: string; date?: string }[];
  shareUrl: string;
}

// ─── URL Generation ──────────────────────────────────────────────────

/**
 * Generate a shareable tracking URL.
 * In production this would hit an API endpoint that creates a
 * time-limited token and returns a proper URL.
 */
function generateTrackingUrl(tripId: string): string {
  // Placeholder — would be: https://app.petsbyplane.com/track/{token}
  return `https://app.petsbyplane.com/track/${tripId}`;
}

// ─── Share Functions ─────────────────────────────────────────────────

/**
 * Share the journey tracking link via the system share sheet.
 */
export async function shareTrackingLink(trip: Trip, pet: Pet): Promise<boolean> {
  const url = generateTrackingUrl(trip.id);
  const currentMilestone = trip.milestones.find((m) => m.status === 'current');

  const message = [
    `🐾 Track ${pet.name}'s journey!`,
    '',
    `${trip.originAirport} → ${trip.destinationAirport}`,
    trip.travelDate ? `Travel date: ${new Date(trip.travelDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}` : '',
    currentMilestone ? `Current step: ${currentMilestone.title}` : '',
    '',
    `Follow ${pet.name}'s live progress:`,
    url,
  ].filter(Boolean).join('\n');

  try {
    const result = await Share.share({
      message,
      url: Platform.OS === 'ios' ? url : undefined,
      title: `${pet.name}'s Journey — Pets by Plane`,
    });

    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Share specifically with the destination vet.
 * Includes more detail about the pet's medical requirements.
 */
export async function shareWithVet(trip: Trip, pet: Pet): Promise<boolean> {
  const url = generateTrackingUrl(trip.id);

  const message = [
    `Pet Transport Tracking — ${pet.name}`,
    '',
    `Species: ${pet.species}`,
    `Breed: ${pet.breed}`,
    `Microchip: ${pet.microchipNumber}`,
    `Weight: ${pet.weight}kg`,
    '',
    `Route: ${trip.originAirport} → ${trip.destinationAirport}`,
    trip.flight ? `Flight: ${trip.flight.flightNumber} (${trip.flight.airline})` : '',
    trip.travelDate ? `ETA: ${new Date(trip.travelDate).toLocaleDateString('en-GB')}` : '',
    '',
    `Track arrival and documents:`,
    url,
    '',
    `— Sent via Pets by Plane`,
  ].filter(Boolean).join('\n');

  try {
    const result = await Share.share({
      message,
      title: `${pet.name} — Vet Tracking Link`,
    });
    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Vet share failed:', error);
    return false;
  }
}

/**
 * Build a data object for a read-only tracking view.
 * Used by the web companion to render a shared tracking page.
 */
export function buildTrackingData(trip: Trip, pet: Pet): ShareableTrackingData {
  const currentMilestone = trip.milestones.find((m) => m.status === 'current');

  return {
    petName: pet.name,
    route: `${trip.originAirport} → ${trip.destinationAirport}`,
    travelDate: trip.travelDate || '',
    currentStatus: currentMilestone?.title || trip.status,
    milestones: trip.milestones.map((m) => ({
      title: m.title,
      status: m.status,
      date: m.completedAt || m.plannedDate || m.estimatedDate,
    })),
    shareUrl: generateTrackingUrl(trip.id),
  };
}
