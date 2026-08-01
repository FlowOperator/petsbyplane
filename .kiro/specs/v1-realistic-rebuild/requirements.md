# Requirements: Pets by Plane V1 — Realistic Rebuild

## Context

Pets by Plane is a small, family-run UK pet relocation company (Live Logistix Ltd). The app serves as a customer-facing portal for pet owners booking international pet transport. This V1 must be buildable and functional **without any external APIs, live flight data, or real-time tracking infrastructure**. All dynamic data (quotes, milestones, flight details) is consultant-managed — entered manually via a backend tool (not part of this app).

Source: `brand-guide/design_handoff_pets_by_plane_app/README.md`

---

## Requirement 1: Guest-First Onboarding

### What
Users can browse the app, view travel guides, and request a quote without creating an account. Account creation happens at checkout (when paying the deposit), not upfront.

### Acceptance Criteria
- [ ] Welcome carousel shows 3 trust-building slides with Skip option
- [ ] "Get started" and "Skip" both navigate to the quote request form (New Booking)
- [ ] Sign In is available for returning users; routes to Home with appropriate state
- [ ] No forced sign-up gate before browsing content or requesting a quote
- [ ] Account is created at the Checkout step, not before

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Welcome Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Sign Up Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Sign In Screen.dc.html]]

---

## Requirement 2: Quote Request Flow (No Live Pricing)

### What
Users fill a form describing their pet and route. This does NOT produce an instant quote. Instead, it submits an enquiry to the consultant team, who manually prepare a quote offline. The user sees a "Quote Pending" screen while waiting.

### Acceptance Criteria
- [ ] New Booking form collects: species, pet name (optional), breed, origin/destination, travel date, reason for travel, optional measurements, optional notes
- [ ] Export/Import toggle determines which route field is locked to "London, UK"
- [ ] Submit → "Flight Results" screen is a **reassurance page** (not a picker): "Your consultant will find the best route based on [pet]'s breed, size, and destination"
- [ ] After Flight Results → "Quote Pending" waiting screen with clear messaging that the consultant is preparing the quote
- [ ] No prices, flight options, or airline selections shown at this stage
- [ ] User receives a notification when quote is ready (mock for now)
- [ ] Notification links to "Quote & Booking" screen showing the consultant's recommended route + pricing

### References
#[[brand-guide/design_handoff_pets_by_plane_app/New Booking Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Flight Results Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Quote Pending Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Quote Booking Screen.dc.html]]

---

## Requirement 3: Quote & Booking (Consultant-Prepared)

### What
Once the consultant has prepared a quote, the user sees a single recommended route (not multiple selectable options) with optional add-on services, total price, and deposit amount. Terms must be accepted before proceeding.

### Acceptance Criteria
- [ ] Shows one recommended route card (non-selectable — consultant's choice)
- [ ] Add-on services listed with toggle to add/remove (travel crate, collection, EHC, blood tests, etc.)
- [ ] Running total updates as add-ons are toggled
- [ ] Quote expiry date shown ("Valid until [date]")
- [ ] Terms & Conditions checkbox gates the "Continue to checkout" CTA
- [ ] Acceptance Card component is reusable (T&Cs, media consent, crate waiver)
- [ ] "Edit trip details" link goes back to New Booking

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Quote Booking Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Acceptance Card.dc.html]]

---

## Requirement 4: Checkout & Payment

### What
User creates their account and pays the deposit. This is where the account is actually created — combining registration with payment in one step.

### Acceptance Criteria
- [ ] Checkout collects: pet name, full name, email, phone, password
- [ ] Summary card shows route, add-ons count, deposit amount (20% of total)
- [ ] Payment screen collects card details (name, number, expiry, CVC, postcode)
- [ ] Security reassurance messaging present
- [ ] Successful payment → Booking Confirmation screen
- [ ] `hasBooking` flag flips true at this point — all empty states across the app now show real data

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Checkout Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Payment Method Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Booking Confirmation Screen.dc.html]]

---

## Requirement 5: Conditional App States (hasBooking)

### What
Every core tab (Home, Journey, Documents, Messages, Profile) renders differently based on whether the user has an active booking. This is a single shared boolean, not per-screen state.

### Acceptance Criteria
- [ ] `hasBooking = false`: Home shows "No trip booked yet" card + "Get a quote" CTA + browse content cards (Country Rules, Travel Crates, Vaccines, Airlines)
- [ ] `hasBooking = false`: Journey, Documents show empty state + "Get a quote" CTA
- [ ] `hasBooking = false`: Messages shows "No consultant assigned yet" + "Get in Touch" CTA
- [ ] `hasBooking = false`: Profile shows limited state (no pet data, owner details editable)
- [ ] `hasBooking = false`: Tab bar shows Journey/Documents/Messages as greyed/non-interactive on pre-booking screens
- [ ] `hasBooking = true`: All tabs show full trip data, milestones, documents, chat, profile
- [ ] State is derived from a single source of truth (booking record exists)

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Home Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Journey Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Documents Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Messages Screen.dc.html]]

---

## Requirement 6: Home Screen (Both States)

### What
The Home screen is the main hub. Its content changes entirely based on booking status.

### Acceptance Criteria
- [ ] **No booking**: empty-state card with icon + "No trip booked yet" + "Get a quote" CTA. Below: "Not ready to book? Have a browse" section with 4 horizontal scroll cards (Country rules, Travel crates, Vaccines & tests, Airlines) + "See all travel guides →" link
- [ ] **Has booking**: Trip card with pet avatar, name, breed, route strip, status message, onboarding checklist (deposit paid / docs uploaded). Attention-needed section. Deadline countdown. Consultant card. Quiet "Travel guides" text link below consultant card
- [ ] Notification bell in header (both states)
- [ ] Floating chat FAB (only when hasBooking = true)

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Home Screen.dc.html]]

---

## Requirement 7: Journey Screen (Milestone-Based, Not Live Tracking)

### What
Shows the pet's journey as a consultant-updated milestone timeline. No live GPS/flight API needed. The "In transit" view shows a simplified status with timestamps — data is pushed by the consultant on travel day, not pulled from a flight API.

### Acceptance Criteria
- [ ] Empty state when no booking
- [ ] "Before collection" tab: milestone timeline (7 steps for export, 6 for import) with done/current/upcoming states. Collection details card. Flight details card (when confirmed)
- [ ] "In transit" tab: simple status bar + timestamp-based checklist (collected, vet check, check-in, departed, customs, reunion). Map is a static/placeholder visual — NOT a live GPS feed
- [ ] Offline state: calm "Signal lost" card (not alarming), shown when connectivity drops on travel day
- [ ] All milestone updates come from backend (consultant enters them) — app just renders current state

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Journey Screen.dc.html]]

---

## Requirement 8: Travel Guides (Persistent Content, Not Booking-Gated)

### What
A set of informational content screens accessible from Home in both states and from Profile. These are educational — helping users understand the process before (and during) booking.

### Acceptance Criteria
- [ ] Travel Guides hub screen with links to: Country Rules, Import Process, Travel Crates, Vaccinations & Tests, Airlines & Partners, Get In Touch
- [ ] Accessible from Home (both states) and Profile
- [ ] Each guide screen has a back link + conditional "Ready? Get a quote" CTA (shown only when hasBooking = false)
- [ ] Country Rules: Export/Import toggle, per-country requirement cards (microchip, vaccination, quarantine, crate)
- [ ] Import Process: UK-specific ARC process explainer
- [ ] Travel Crates: types, measurement guide, acclimatisation tips
- [ ] Vaccinations: dog/cat requirements, blood tests, timing
- [ ] Airlines: partner profiles with operational detail
- [ ] Get In Touch: general contact form (not consultant-specific)

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Travel Guides Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Country Rules Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Import Process Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Travel Crates Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Vaccinations Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Airlines Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Get In Touch Screen.dc.html]]

---

## Requirement 9: Messages (Consultant Chat, Post-Booking Only)

### What
1:1 messaging with the assigned consultant. Only functional after booking — pre-booking shows an empty state directing users to "Get In Touch" instead.

### Acceptance Criteria
- [ ] Pre-booking: "No consultant assigned yet" empty state + "Get in Touch" CTA
- [ ] Post-booking: consultant header (photo, name, call button), scrollable chat thread, quick-reply chips, text input + send
- [ ] Messages are per-trip (consultant is assigned to the trip)
- [ ] In V1, messages are stored locally / simulated — real WhatsApp Business API integration is a future enhancement

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Messages Screen.dc.html]]

---

## Requirement 10: Documents Screen (Post-Booking Checklist)

### What
Shows required documents for the trip with upload capability. Empty state pre-booking.

### Acceptance Criteria
- [ ] Pre-booking: empty state + "Get a quote" CTA
- [ ] Post-booking: progress bar, document list with status badges (Verified, Expiring soon, Missing)
- [ ] Missing documents show "Upload" button with camera/scan capability
- [ ] Reassurance footer: "No rush — your consultant will remind you"
- [ ] Document list is populated based on the trip's destination requirements (consultant-configured, not auto-calculated from an API)

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Documents Screen.dc.html]]

---

## Requirement 11: Profile & Settings

### What
Pet details + owner details with tab toggle. Settings for notifications and account management.

### Acceptance Criteria
- [ ] Pets tab: pet card, documents for pet, travel crate section (check existing + recommended options), measurements (dogs only)
- [ ] Owner tab: personal details with edit, passport/visa scan, collection person, preferences
- [ ] Profile Settings: notification toggles, change password, privacy/terms, logout, delete account
- [ ] Logout clears state and returns to Welcome/landing
- [ ] Gear icon in Profile header navigates to Settings

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Profile Screen.dc.html]]
#[[brand-guide/design_handoff_pets_by_plane_app/Profile Settings Screen.dc.html]]

---

## Requirement 12: Notifications

### What
Simple notification inbox showing trip-related updates pushed by the consultant/system.

### Acceptance Criteria
- [ ] Card-based feed with icon, title, body, timestamp
- [ ] Priority/unread items highlighted with coral border
- [ ] "Your quote is ready!" notification links to Quote & Booking screen
- [ ] Accessible via bell icon on Home screen

### References
#[[brand-guide/design_handoff_pets_by_plane_app/Notifications Screen.dc.html]]

---

## Out of Scope for V1

These are explicitly deferred per the brand guide:
- Live flight data / airline route APIs
- Real-time GPS pet tracking
- Instant/algorithmic quote pricing
- WhatsApp Business API integration (simulated only)
- CMS-editable content (static per app version for now)
- Full 11-country destination data (start with 4, expand later)
- Remaining airline partner copy (Cathay Pacific, SriLankan, Thai, Turkish — awaiting client)

---

## Technical Constraints

- **Platform**: Expo React Native (web + iOS + Android via single codebase)
- **Deployment**: GitHub Pages (web export) via GitHub Actions
- **State**: React Context + useReducer (no backend needed for V1 demo)
- **Fonts**: Google Fonts — Baloo 2 (headings), Nunito (body)
- **Design tokens**: Exact values in README.md (colors, spacing, radii, shadows)
- **Navigation**: Expo Router with typed routes
