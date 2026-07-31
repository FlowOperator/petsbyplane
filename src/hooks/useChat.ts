/**
 * Pets by Plane — Chat Hook
 *
 * Manages chat state for the Messages screen.
 * Handles sending, receiving (simulated), and quick replies.
 */

import { useState, useCallback } from 'react';
import { useAppState } from '../services/store';
import {
  ChatMessage,
  sendMessage,
  sendAttachment,
  simulateConsultantReply,
} from '../services/whatsappService';

export function useChat() {
  const { state } = useAppState();
  const { activeTrip, owner, consultant, pets } = state;
  const pet = pets.find((p) => p.id === activeTrip?.petId);

  // Initialize with welcome messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!consultant || !pet) return [];
    return [
      {
        id: 'welcome-1',
        tripId: activeTrip?.id || '',
        senderId: consultant.id,
        senderName: consultant.name,
        text: `Hi there! I'm ${consultant.name.split(' ')[0]}, your dedicated consultant for ${pet.name}'s journey 🐾 I'll be looking after every step of the trip from ${activeTrip?.originCity || 'London'} to ${activeTrip?.destinationCity || 'your destination'}.`,
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isOwn: false,
        status: 'read',
      },
      {
        id: 'welcome-2',
        tripId: activeTrip?.id || '',
        senderId: consultant.id,
        senderName: consultant.name,
        text: "There's nothing urgent from you right now — I'm just keeping an eye on the paperwork. Feel free to ask me anything, any time.",
        timestamp: new Date(Date.now() - 3540000).toISOString(), // 59 min ago
        isOwn: false,
        status: 'read',
      },
    ];
  });

  const [isSending, setIsSending] = useState(false);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || !activeTrip || !owner) return;

    setIsSending(true);
    try {
      const ownerName = `${owner.firstName} ${owner.surname}`;
      const sent = await sendMessage(activeTrip.id, ownerName, text.trim());
      setMessages((prev) => [...prev, sent]);

      // Simulate consultant reply after a delay (dev only)
      if (consultant && pet) {
        setTimeout(() => {
          const reply = simulateConsultantReply(activeTrip.id, consultant.name, pet.name);
          setMessages((prev) => [...prev, reply]);
        }, 2000 + Math.random() * 3000);
      }
    } finally {
      setIsSending(false);
    }
  }, [activeTrip, owner, consultant, pet]);

  const handleSendAttachment = useCallback(async (
    uri: string,
    type: 'image' | 'document',
    caption?: string
  ) => {
    if (!activeTrip || !owner) return;

    setIsSending(true);
    try {
      const ownerName = `${owner.firstName} ${owner.surname}`;
      const sent = await sendAttachment(activeTrip.id, ownerName, uri, type, caption);
      setMessages((prev) => [...prev, sent]);
    } finally {
      setIsSending(false);
    }
  }, [activeTrip, owner]);

  return {
    messages,
    isSending,
    handleSend,
    handleSendAttachment,
    consultantName: consultant?.name || 'Your consultant',
    consultantOnline: consultant?.isOnline || false,
    petName: pet?.name || 'Your pet',
  };
}
