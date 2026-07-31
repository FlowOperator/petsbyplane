/**
 * Pets by Plane — Calendar & Reminders Service
 *
 * Pushes key dates to the device calendar, replacing today's manual
 * Google Calendar invites. Each event includes context about what needs
 * to happen and a reminder notification.
 */

import { Platform, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import { Trip, Milestone } from '../types';
import { RequirementChecklistItem } from './rulesEngine';

const CALENDAR_TITLE = 'Pets by Plane';
const CALENDAR_COLOR = '#E8623D';

// ─── Calendar Setup ──────────────────────────────────────────────────

/**
 * Get or create the Pets by Plane calendar on the device.
 */
async function getOrCreateCalendar(): Promise<string | null> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Calendar Permission',
      'We need calendar access to add your pet travel dates. You can enable this in Settings.'
    );
    return null;
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const existing = calendars.find((c) => c.title === CALENDAR_TITLE);

  if (existing) return existing.id;

  // Create a new calendar
  const defaultCalendar = calendars.find(
    (c) => c.allowsModifications && c.source
  );

  if (!defaultCalendar?.source) {
    Alert.alert('Calendar Error', 'Could not find a writable calendar on this device.');
    return null;
  }

  const newCalendarId = await Calendar.createCalendarAsync({
    title: CALENDAR_TITLE,
    color: CALENDAR_COLOR,
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendar.source.id,
    source: defaultCalendar.source,
    name: 'petsbyplane',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });

  return newCalendarId;
}

// ─── Event Creation ──────────────────────────────────────────────────

interface CalendarEvent {
  title: string;
  notes: string;
  startDate: Date;
  endDate: Date;
  alarms?: { relativeOffset: number }[]; // minutes before
}

/**
 * Add a single event to the Pets by Plane calendar.
 */
export async function addEventToCalendar(event: CalendarEvent): Promise<boolean> {
  try {
    const calendarId = await getOrCreateCalendar();
    if (!calendarId) return false;

    await Calendar.createEventAsync(calendarId, {
      title: event.title,
      notes: event.notes,
      startDate: event.startDate,
      endDate: event.endDate,
      alarms: event.alarms || [{ relativeOffset: -60 * 24 }], // Default: 1 day before
      timeZone: 'Europe/London',
    });

    return true;
  } catch (error) {
    console.error('Calendar event creation failed:', error);
    return false;
  }
}

/**
 * Add all key trip dates to the calendar at once.
 */
export async function syncTripToCalendar(trip: Trip, petName: string): Promise<number> {
  const calendarId = await getOrCreateCalendar();
  if (!calendarId) return 0;

  let eventsCreated = 0;
  const events: CalendarEvent[] = [];

  // Travel day
  if (trip.travelDate) {
    const travelStart = new Date(trip.travelDate);
    travelStart.setHours(6, 0, 0);
    const travelEnd = new Date(trip.travelDate);
    travelEnd.setHours(23, 59, 0);

    events.push({
      title: `🐾 ${petName} — Travel Day!`,
      notes: `${petName}'s flight from ${trip.originAirport} to ${trip.destinationAirport}. ${trip.flight?.flightNumber || ''}\n\nMake sure all documents are packed and ready.`,
      startDate: travelStart,
      endDate: travelEnd,
      alarms: [
        { relativeOffset: -60 * 24 * 2 }, // 2 days before
        { relativeOffset: -60 * 24 },     // 1 day before
        { relativeOffset: -60 * 3 },      // 3 hours before
      ],
    });
  }

  // Collection day (day before or same day)
  if (trip.travelDate) {
    const collectionDate = new Date(trip.travelDate);
    collectionDate.setHours(6, 30, 0);
    const collectionEnd = new Date(trip.travelDate);
    collectionEnd.setHours(8, 0, 0);

    events.push({
      title: `📦 ${petName} — Collection`,
      notes: `${petName} will be collected from your home for transport to ${trip.originAirport}.\n\nEnsure crate is ready with bedding, water dish attached, and "Live Animal" labels visible.`,
      startDate: collectionDate,
      endDate: collectionEnd,
      alarms: [{ relativeOffset: -60 * 12 }], // 12 hours before
    });
  }

  // Milestones with planned dates
  for (const milestone of trip.milestones) {
    if (milestone.status === 'upcoming' && milestone.plannedDate) {
      const start = new Date(milestone.plannedDate);
      start.setHours(9, 0, 0);
      const end = new Date(milestone.plannedDate);
      end.setHours(17, 0, 0);

      events.push({
        title: `🐾 ${petName} — ${milestone.title}`,
        notes: milestone.description,
        startDate: start,
        endDate: end,
        alarms: [{ relativeOffset: -60 * 24 }],
      });
    }
  }

  // Create all events
  for (const event of events) {
    try {
      await Calendar.createEventAsync(calendarId, {
        title: event.title,
        notes: event.notes,
        startDate: event.startDate,
        endDate: event.endDate,
        alarms: event.alarms,
        timeZone: 'Europe/London',
      });
      eventsCreated++;
    } catch (e) {
      console.error('Failed to create event:', event.title, e);
    }
  }

  return eventsCreated;
}

/**
 * Add requirement deadline reminders to the calendar.
 */
export async function syncRequirementsToCalendar(
  checklist: RequirementChecklistItem[],
  petName: string
): Promise<number> {
  const calendarId = await getOrCreateCalendar();
  if (!calendarId) return 0;

  let eventsCreated = 0;

  for (const item of checklist) {
    if (item.isOverdue) continue; // Don't create past events

    const deadline = new Date(item.deadline);
    deadline.setHours(9, 0, 0);
    const end = new Date(item.deadline);
    end.setHours(10, 0, 0);

    try {
      await Calendar.createEventAsync(calendarId, {
        title: `⚠️ ${petName} — ${item.requirement.title} deadline`,
        notes: `${item.requirement.description}\n\nThis must be completed by this date for ${petName}'s trip.\n\nSource: ${item.requirement.authoritySource || 'Pets by Plane'}`,
        startDate: deadline,
        endDate: end,
        alarms: [
          { relativeOffset: -60 * 24 * 7 }, // 1 week before
          { relativeOffset: -60 * 24 * 3 }, // 3 days before
          { relativeOffset: -60 * 24 },     // 1 day before
        ],
        timeZone: 'Europe/London',
      });
      eventsCreated++;
    } catch (e) {
      console.error('Failed to create requirement event:', item.requirement.title, e);
    }
  }

  return eventsCreated;
}
