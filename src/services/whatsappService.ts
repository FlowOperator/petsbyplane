/**
 * Pets by Plane — WhatsApp Business API Integration
 *
 * Section 6.9: Messaging built via WhatsApp Business API so staff
 * can keep working in WhatsApp itself while messages mirror into
 * the app automatically.
 *
 * This service handles:
 * - Sending messages from the app (proxied through backend to WhatsApp Business API)
 * - Receiving webhook messages and mapping them into the app's chat state
 * - Quick reply templates for common questions
 *
 * In production, a Lambda function acts as the webhook receiver and
 * pushes messages to the app via WebSocket or polling.
 */

export interface ChatMessage {
  id: string;
  tripId: string;
  senderId: string; // 'owner' | consultant ID
  senderName: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  /** If this message includes a document/image */
  attachment?: {
    type: 'image' | 'document';
    uri: string;
    filename?: string;
  };
}

export interface QuickReply {
  id: string;
  text: string;
  /** Category for grouping */
  category: 'status' | 'documents' | 'logistics' | 'general';
}

// ─── Quick Reply Templates ───────────────────────────────────────────

export const QUICK_REPLIES: QuickReply[] = [
  { id: 'qr-1', text: "Where's my pet now?", category: 'status' },
  { id: 'qr-2', text: 'What documents do I still need?', category: 'documents' },
  { id: 'qr-3', text: 'What crate size do I need?', category: 'logistics' },
  { id: 'qr-4', text: 'When is the next deadline?', category: 'documents' },
  { id: 'qr-5', text: "Can I change my pet's travel date?", category: 'logistics' },
  { id: 'qr-6', text: 'How do I prepare my pet for the flight?', category: 'general' },
  { id: 'qr-7', text: "What happens when my pet arrives?", category: 'logistics' },
  { id: 'qr-8', text: 'Can someone else collect my pet?', category: 'logistics' },
];

// ─── Message Sending (Mock) ──────────────────────────────────────────

/**
 * Send a message from the owner to their consultant.
 * In production: POST to backend → WhatsApp Business API → consultant's WhatsApp.
 */
export async function sendMessage(
  tripId: string,
  ownerName: string,
  text: string
): Promise<ChatMessage> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    tripId,
    senderId: 'owner',
    senderName: ownerName,
    text,
    timestamp: new Date().toISOString(),
    isOwn: true,
    status: 'sent',
  };

  return message;
}

/**
 * Send a document/image via the chat.
 * In production: uploads to S3 then sends a WhatsApp media message.
 */
export async function sendAttachment(
  tripId: string,
  ownerName: string,
  uri: string,
  type: 'image' | 'document',
  caption?: string
): Promise<ChatMessage> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    tripId,
    senderId: 'owner',
    senderName: ownerName,
    text: caption || (type === 'image' ? '📷 Photo' : '📄 Document'),
    timestamp: new Date().toISOString(),
    isOwn: true,
    status: 'sent',
    attachment: { type, uri },
  };

  return message;
}

// ─── Webhook Simulation ──────────────────────────────────────────────

/**
 * Simulates receiving a message from the consultant.
 * In production: WebSocket connection or polling endpoint.
 */
export function simulateConsultantReply(
  tripId: string,
  consultantName: string,
  petName: string
): ChatMessage {
  const replies = [
    `Hi! Just checking in — ${petName}'s paperwork is progressing well. Nothing urgent from you right now.`,
    `Good news — I've confirmed the flight details with the airline. You'll see the update in your Journey tab.`,
    `Quick reminder: ${petName}'s titre test window opens next week. I'll send a notification when it's time to book.`,
    `The crate has been dispatched and should arrive within 2-3 working days. Start the acclimatisation as soon as it's there!`,
    `Just a heads up — I've uploaded the latest version of the health certificate to your Documents tab for review.`,
  ];

  const randomReply = replies[Math.floor(Math.random() * replies.length)];

  return {
    id: `msg-${Date.now()}`,
    tripId,
    senderId: 'consultant',
    senderName: consultantName,
    text: randomReply,
    timestamp: new Date().toISOString(),
    isOwn: false,
    status: 'delivered',
  };
}

// ─── WhatsApp Deep Link (Fallback) ──────────────────────────────────

/**
 * Opens WhatsApp directly to the Pets by Plane business number.
 * Used as a fallback if the in-app chat has issues, or for
 * the "emergency contact" one-tap-to-call feature.
 */
export function getWhatsAppDeepLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encoded = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}${encoded ? `?text=${encoded}` : ''}`;
}
