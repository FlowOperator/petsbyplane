/**
 * Pets by Plane — Push Notification Service
 *
 * Handles scheduling local push notifications for:
 * - Milestone transitions (journey progress)
 * - Deadline reminders from the rules engine
 * - Consultant message notifications
 *
 * Uses expo-notifications for local scheduling.
 * In production, backend-triggered push via SNS/Pinpoint.
 */

import { Platform } from 'react-native';
import { Trip, Milestone, PetDocument } from '../types';
import { RequirementChecklistItem } from './rulesEngine';

// ─── Notification Types ──────────────────────────────────────────────

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  triggerDate: Date;
  data?: Record<string, string>;
}

// ─── Scheduling Logic ────────────────────────────────────────────────

/**
 * Generate all notifications that should be scheduled for a trip.
 * These would be sent to expo-notifications scheduleNotificationAsync.
 */
export function generateTripNotifications(
  trip: Trip,
  petName: string
): ScheduledNotification[] {
  const notifications: ScheduledNotification[] = [];

  // Travel day reminder (day before)
  if (trip.travelDate) {
    const dayBefore = new Date(trip.travelDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    dayBefore.setHours(18, 0, 0);

    notifications.push({
      id: `trip-${trip.id}-travel-reminder`,
      title: `${petName}'s big day is tomorrow! ✈️`,
      body: `Everything is set for ${petName}'s journey from ${trip.originAirport} to ${trip.destinationAirport}. Make sure the crate is ready with bedding and water.`,
      triggerDate: dayBefore,
      data: { type: 'travel_reminder', tripId: trip.id },
    });

    // Morning of travel
    const travelMorning = new Date(trip.travelDate);
    travelMorning.setHours(5, 30, 0);

    notifications.push({
      id: `trip-${trip.id}-travel-day`,
      title: `Today's the day! 🐾`,
      body: `${petName} is being collected this morning. Check the Journey tab for live updates once collection begins.`,
      triggerDate: travelMorning,
      data: { type: 'travel_day', tripId: trip.id },
    });
  }

  return notifications;
}

/**
 * Generate deadline reminder notifications from the rules engine.
 */
export function generateDeadlineNotifications(
  checklist: RequirementChecklistItem[],
  petName: string,
  tripId: string
): ScheduledNotification[] {
  const notifications: ScheduledNotification[] = [];

  for (const item of checklist) {
    if (item.isOverdue) continue;

    const deadline = new Date(item.deadline);

    // 7 days before deadline
    if (item.daysRemaining > 7) {
      const sevenDaysBefore = new Date(deadline);
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
      sevenDaysBefore.setHours(9, 0, 0);

      notifications.push({
        id: `req-${item.requirement.id}-7d`,
        title: `${petName}: ${item.requirement.title} due in 7 days`,
        body: item.requirement.description,
        triggerDate: sevenDaysBefore,
        data: { type: 'deadline_reminder', tripId, requirementId: item.requirement.id },
      });
    }

    // 3 days before deadline
    if (item.daysRemaining > 3) {
      const threeDaysBefore = new Date(deadline);
      threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
      threeDaysBefore.setHours(9, 0, 0);

      notifications.push({
        id: `req-${item.requirement.id}-3d`,
        title: `⚠️ ${petName}: ${item.requirement.title} due in 3 days`,
        body: `Don't forget — this needs to be done by ${deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}. ${item.requirement.description}`,
        triggerDate: threeDaysBefore,
        data: { type: 'deadline_urgent', tripId, requirementId: item.requirement.id },
      });
    }

    // Day of deadline
    const dayOf = new Date(deadline);
    dayOf.setHours(8, 0, 0);

    notifications.push({
      id: `req-${item.requirement.id}-today`,
      title: `🚨 ${petName}: ${item.requirement.title} — today!`,
      body: `This is due today. If it's not done, it may delay ${petName}'s journey.`,
      triggerDate: dayOf,
      data: { type: 'deadline_today', tripId, requirementId: item.requirement.id },
    });
  }

  return notifications;
}

/**
 * Generate milestone transition notification (triggered by backend in production).
 */
export function createMilestoneNotification(
  milestone: Milestone,
  petName: string
): ScheduledNotification {
  const messages: Record<string, { title: string; body: string }> = {
    'Initial consultation & quote': {
      title: `${petName}'s journey has begun! 🎉`,
      body: 'Your quote is confirmed and a consultant has been assigned.',
    },
    'Veterinary requirements & health certificates': {
      title: `Vet check complete ✓`,
      body: `${petName}'s vaccinations and health certificates have been reviewed.`,
    },
    'Route planning & flight booking': {
      title: `Flight booked! ✈️`,
      body: `${petName}'s route has been confirmed. Check the Journey tab for details.`,
    },
    'IATA-compliant crate delivery': {
      title: `Crate on its way! 📦`,
      body: `${petName}'s travel crate is being delivered. Start acclimatisation as soon as it arrives.`,
    },
    'Export preparation & documentation': {
      title: `Paperwork complete ✓`,
      body: `All export documents for ${petName} are in order.`,
    },
    'Collection & airport check-in': {
      title: `${petName} collected! 🚗`,
      body: `${petName} has been picked up and is on the way to the airport. Live tracking is now active.`,
    },
    'Arrival & reunion': {
      title: `${petName} has landed! 🎊`,
      body: `${petName} is through customs and ready for reunion. Welcome home!`,
    },
  };

  const msg = messages[milestone.title] || {
    title: `${petName}: ${milestone.title}`,
    body: milestone.description,
  };

  return {
    id: `milestone-${milestone.id}`,
    title: msg.title,
    body: msg.body,
    triggerDate: new Date(),
    data: { type: 'milestone', milestoneId: milestone.id },
  };
}

/**
 * Consultant message notification.
 */
export function createMessageNotification(
  consultantName: string,
  messagePreview: string
): ScheduledNotification {
  return {
    id: `msg-${Date.now()}`,
    title: consultantName,
    body: messagePreview.length > 100
      ? messagePreview.slice(0, 97) + '...'
      : messagePreview,
    triggerDate: new Date(),
    data: { type: 'message' },
  };
}
