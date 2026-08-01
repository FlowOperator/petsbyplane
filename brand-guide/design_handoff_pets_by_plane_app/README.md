# Handoff: Pets by Plane — Mobile App (Full Flow)

## Update log #2 (read this first — most recent changes)

Since the last handoff, three things changed:

**1. Home screen now surfaces browse content directly (not just a quiet link).** This was flagged as underused — the previous single text link to Travel Guides was too easy to miss for not-yet-booked visitors, who are the priority audience for that content. `Home Screen.dc.html` changed as follows, driven by the existing `hasTrip` flag (see `Home_Screen_v2.dc.html` reference if you still have it from before — this is now the live file, not just a reference):

- **`hasNoTrip` (no booking yet):** unchanged "No trip booked yet" card + "Get a quote" CTA stays as-is and remains the most visually prominent element. Directly below it, a new "Not ready to book? Have a browse" section: one line of supporting copy, then 4 horizontally-scrollable cards (Country rules, Travel crates, Vaccines & tests, Airlines & partners — each icon + label, linking straight to that screen), then a "See all travel guides →" link to the Travel Guides hub (this is how the other 2 guides — Import Process and Get In Touch — stay reachable without a 6th card cluttering the row).
- **`hasTrip` (has a booking):** no change at all to the trip card, checklist, deadline countdown, or consultant card. Guides access is a single quiet text link below the consultant card ("Travel guides — crates, vaccinations, country rules & more"), deliberately low-contrast so it doesn't compete with trip content.
- Both states still use the same dev-only "Preview: ..." toggle link to flip between them for review — again, **remove this toggle in the real app**, real trigger is `hasBooking` on the account.

**2. Every browse-content screen now offers a consistent way back + a way forward into booking — conditionally.** Applies to: `Travel Guides Screen.dc.html`, `Country Rules Screen.dc.html`, `Travel Crates Screen.dc.html`, `Vaccinations Screen.dc.html`, `Import Process Screen.dc.html`, `Airlines Screen.dc.html`. Each of these now has:
- A back link at the top (to Home, or to the Travel Guides hub, depending on how deep in the hierarchy the screen sits — check each file's existing back-link target, they're intentionally different per screen's place in the hierarchy).
- A "Ready? Get a quote" CTA at the bottom, **shown only when `hasNoTrip` is true**. A user who already has an active booking does not need to be prompted to get a quote again, so this CTA is wrapped in `<sc-if value="{{ hasNoTrip }}">` on every one of these screens and is completely absent when `hasTrip` is true.
- Each of these screens carries its own local `hasTrip` state (defaulting to `true`) with the same dev-only "Preview: ..." toggle as everywhere else, purely so you can review both conditions per screen. **In the real app, all of these local `hasTrip` flags should read from the single shared account-level `hasBooking` value — they are NOT meant to be independent per-screen state**, that's just how the prototype demonstrates each screen in isolation. Wire them all to the same source of truth.

**3. User Flow Map upgraded with mini visual previews.** `User Flow Map.dc.html` is a wide canvas diagram (not part of the app itself — a reference/documentation artifact) that now shows a small mock-up thumbnail of every screen's actual layout (header bars, cards, tab bar with the active tab highlighted, form fields, chat bubbles, etc.) next to its title, organized into the same lanes as before: Auth → Quote flow (with the v1 Flight Results/Quote Pending/Quote & Booking simplification called out) → Core App split into 3a (no booking) / 3b (has booking) → the persistent Travel Guides section reachable from both. Use this as the master visual reference for the whole flow — it's the fastest way to see everything at once and how the `hasBooking` conditionals fan out across every screen.

## Update log #1 (from the previous handoff — still relevant)



This package has been refreshed since the first handoff. Key changes for your build:

**Guest-first flow.** Welcome no longer forces sign-up. Primary CTA + Skip both go straight to "Get a Quote" as a guest. "Sign in" is offered for returning users; account creation happens naturally at Checkout, when the user is ready to pay a deposit. Sign Up is still reachable (from Sign In, and a small link on Welcome) for anyone who wants to create an account upfront.

**Pre-booking empty states, everywhere.** Home, Journey, Documents, Messages, and Profile all now render a distinct empty/limited state when the account has no confirmed booking (`hasBooking = false`), vs. the full experience once booked. Each prototype screen has a small dev-only "Preview: ..." toggle link to flip between the two states for review — **remove that toggle in the real app**; the real trigger is the `hasBooking` flag on the account, set true the moment the deposit is paid at Checkout. See `User Flow Map.dc.html` for the full before/after breakdown, lanes 3a and 3b.

**Flight sourcing changed for v1 — no fake flight data.** Client feedback: real flight/route data can't be provided for v1, and airline/route selection is genuinely consultant-driven (breed embargoes, temperature limits, transit conditions vary by carrier) — not a safe thing for a customer to self-serve pick. So:
- `Flight Results Screen.dc.html` is now a non-interactive reassurance screen ("your consultant picks the route"), not a flight picker.
- It leads to `Quote Pending Screen.dc.html` — a waiting state while the consultant prepares the real quote off-app (outside this prototype; assume a backend/ops tool, not shown here).
- A notification ("Your quote is ready!") in `Notifications Screen.dc.html` links into `Quote Booking Screen.dc.html` once the quote is ready.
- `Quote Booking Screen.dc.html` now shows one non-interactive "recommended route" card instead of 2 selectable flight options.
- The original self-serve/2-option versions are preserved, unmodified, in the `v2/` folder (`v2/Flight Results Screen v2.dc.html`, `v2/Quote Booking Screen v2.dc.html`) in case live flight data becomes available later — do not delete these, they're intentionally kept as a future reference, not dead files.

**Export/Import toggle added.** `New Booking Screen.dc.html` now has an Export (from UK) / Import (to UK) toggle at the top of the form, which flips which route field is locked to "London, UK". `Country Rules Screen.dc.html` has a matching toggle: Export mode keeps the existing per-country lookup; Import mode shows a short explainer card linking to the new `Import Process Screen.dc.html`, since import is a UK-side customs process (keyed on arrival airport + origin-country document category) rather than a per-destination-country lookup — don't build it as a mirrored Country Rules variant.

**New "Travel guides" content section (persistent, not booking-gated).** A permanent entry point — `Travel Guides Screen.dc.html` — reachable from Home (in both booking states) and from Profile. Do not make this conditional on `hasBooking`; it must stay reachable whether or not the user has booked. It links to:
- `Country Rules Screen.dc.html` (existing, now with the Export/Import toggle above)
- `Import Process Screen.dc.html` (new)
- `Travel Crates Screen.dc.html` (new — crate types, measurement guide, acclimatisation tips, FAQ)
- `Vaccinations Screen.dc.html` (new — dog/cat vaccination requirements, blood tests, general timing)
- `Airlines Screen.dc.html` (new — partner airline profiles with real operational detail; 4 more partners marked "copy to come" from the client, not invented)
- `Get In Touch Screen.dc.html` (new — general contact form/details, not tied to a named consultant)

Cross-links added: New Booking's measurements section → Travel Crates; Profile's existing crate-sizing tool → Travel Crates; Country Rules → Vaccinations & tests. `Messages Screen.dc.html` also got a pre-booking empty state ("No consultant assigned yet") with a Get In Touch CTA, since Messages is otherwise correctly consultant-scoped and shouldn't be the only contact option pre-booking.

**Compliance flag stands.** Vaccination timings, quarantine windows, and document requirements in the new content screens are real and specific (e.g. "21 days," "3 months," "180 days for Australia" etc.) — sourced from the live site, but get these signed off by whoever owns compliance before shipping; a copy error here isn't cosmetic.

**Still open / needs a product decision, not designed further without one:**
- Full destination list is 11 countries/regions on the live site vs. 4 hardcoded in the Country Rules prototype — confirm whether all 11 need data before shipping, or a phased rollout is fine.
- Whether "before you book" content (crates, vaccinations, country rules, import) should be static per-app-version or CMS-editable.
- Remaining airline partner copy (Cathay Pacific, SriLankan, Thai, Turkish) — chase the client, don't invent it.



## Overview
Full mobile app design for Pets by Plane, a UK pet relocation company. Covers the entire user journey: onboarding/auth, requesting a quote, booking (flight selection, add-ons, checkout, payment), and the post-booking app experience (home, journey tracking, documents, messages, profile).

## About the Design Files
The `.dc.html` files in this bundle are **design references** built in HTML — high-fidelity prototypes showing intended look, copy, and interaction, not production code to copy directly. The task is to **recreate these designs in the target app's existing environment** (React Native, Flutter, SwiftUI/Kotlin, etc.) using its established component patterns, navigation, and state management — not to embed the HTML.

Each file is self-contained and viewable directly in a browser (open the `.dc.html` file). `support.js` and `image-slot.js` are the prototyping runtime/helpers used only to render these previews — they are not part of the design and have no equivalent needed in the real app (image-slot placeholders should become normal image components / upload pickers).

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and component states are final/intentional. Recreate pixel-close using the exact values below.

## Design Tokens

**Colors**
- Background (screen): `#F1EEE7` (warm cream — never pure white)
- Headings/primary text: `#2E2822` (dark espresso — never pure black)
- Body/secondary text: `#6B6259` (muted grey-brown)
- Muted/disabled text: `#9A9188` / `#B4ACA1` / `#ADA69C`
- Primary brand accent (coral): `#E8623D` — used for dog-species accents, active states, links, alerts
- Primary CTA button (mustard-gold): `#EFC26C`, always with dark text (`#2E2822`) on top
- Success/verified green: `#4C8B6B` (text/icon), `rgba(76,139,107,0.14)` (fill)
- Warning/amber: `#B7801F` / `#8A6218` (text), `rgba(239,194,108,0.28-0.35)` (fill)
- Card white: `#FFFFFF`
- Neutral pill/tag background: `#EFEBE3` / `#E9E4D8` / `#E4DFD4`

**Species colour coding** (apply consistently anywhere a species appears — icons, badges, accents):
- Dog = coral/red (`#E8623D`)
- Cat = navy blue (`#2C4A6E`)
- Bird = amber/orange (`#C97A1F`)
- Snake/exotic = teal/mint (`#2E8B7E`)

**Typography**
- Headings: `Baloo 2` (Google Font), weight 700, rounded/friendly. Sizes range 15–24px across screens (see per-screen notes).
- Body: `Nunito` (Google Font), weights 400/600/700, muted grey-brown (`#6B6259`) for secondary copy, dark espresso for primary values.

**Shape & elevation**
- Buttons: fully pill-shaped (`border-radius: 999px`), never sharp corners.
- Cards: large rounded corners, 18–28px radius, white background, soft shadow `0 8px 24px rgba(46,40,34,0.06-0.08)`.
- Small tags/badges/pills: `border-radius: 999px`, small padding (3–4px vertical, 9–12px horizontal).
- Dashed borders used for "upcoming/planned" states and deadline countdown emphasis.

**Iconography**
Hand-drawn-feel single-color line icons (SVG stroke-based, ~1.6–2px stroke, no fill except small accent dots/badges). Airplane-window/porthole framing for species icons; passport-stamp/travel-sticker motifs implied for travel content. Real product photography (not illustration) for crates — represented in these prototypes as `<image-slot>` placeholders.

## Screens / Views

### 1. Welcome Screen
**Purpose:** First-launch trust-building carousel before sign-up.
**Layout:** 390×844 vertical screen. Centered icon (140×140 circular badge with coral line art), heading (Baloo 2, 22px), body copy (13.5px, max-width 280px), 3 dot-indicators, primary pill CTA, "Skip" text link.
**Content (3 slides):** 1) "Family-run, since day one" / trust copy. 2) "We handle every detail" / logistics copy. 3) "Track the whole journey" / tracking copy.
**Interaction:** "Next" advances slide; last slide CTA reads "Get started" → navigates to Sign Up. "Skip" jumps straight to Sign Up from any slide.
**State:** current slide index (0–2).

### 2. Sign Up Screen
**Purpose:** Account creation (email or SSO).
**Layout:** Centered heading + subcopy, two full-width white pill SSO buttons (Apple, Google) with brand-colored icons, "OR" divider, 3 stacked text inputs (name, email, password), sticky bottom CTA "Create account" (mustard), text link to Sign In.
**Interaction:** CTA → New Booking Screen (i.e., straight into the quote flow post-signup — no forced onboarding step).

### 3. Sign In Screen
**Purpose:** Returning user login.
**Layout:** Heading, 2 inputs (email, password), "Forgot password?" link (right-aligned, coral), sticky CTA "Sign in", link to Sign Up.
**Interaction:** "Forgot password?" → Forgot Password Screen. CTA → Home Screen.

### 4. Forgot Password Screen
**Purpose:** Password reset request.
**Layout:** Two states in one screen: (a) email input + "Send reset link" CTA; (b) confirmation state — envelope icon, "Check your inbox" message, link back to Sign In.
**State:** `sent: boolean` toggles between the two views.

### 5. New Booking Screen ("Get a Quote")
**Purpose:** Landing page for a not-yet-booked user to request a quote. This is the generic quote-request entry point — **no pet name/identity is assumed yet** (a returning/booked user's pet, e.g. "Darcy", only exists after this).
**Layout:** Heading "Get a quote". Sections in order: (1) species selector — 4 equal tiles (dog/cat/bird/exotic) each with a colored circular icon background in that species' color and a label, dog selected by default; (2) pet name (optional) + breed inputs side by side; (3) route — two text inputs with pin icons (origin pre-filled "London, UK", destination placeholder); (4) travel date input; (5) reason-for-travel pill chips (Relocation/Holiday/Breeding-show, single-select, "Relocation" active by default); (6) optional pet-measurements 2×2 grid (length/width/height/weight) with reassuring "we'll use average measurements" note; (7) optional notes textarea; (8) a "Browse country requirements" link-card. Sticky bottom CTA "Get my quote". Below the CTA, its own bottom tab bar with Journey/Documents/Messages tabs greyed out and non-interactive (no booking exists yet), Home and Profile active/reachable.
**Interaction:** CTA → Flight Results Screen. Country-requirements card → Country Rules Screen.

### 6. Country Rules Screen
**Purpose:** Browse destination-country import requirements, reachable any time from the quote form (not gated behind booking).
**Layout:** Horizontal scrollable chip row (USA/Australia/UAE/France, pill-selected style), country name + one-line summary, then 4 white rounded rows each with icon + label + short rule description: Microchip, Vaccination & titre test, Quarantine, Crate & documentation. Footer note: rules may change, consultant confirms specifics.
**State:** selected country code; each country has its own copy for summary/microchip/vaccine/quarantine/crate.

### 7. Flight Results Screen
**Purpose:** Show route/flight options after submitting the quote form.
**Layout:** Header with route summary ("3 routes available", "London (LHR) → Los Angeles (LAX) · 1 pet"). 3 selectable route cards, each: airline code chip, route string (single line, no wrap), stop-count pill (Direct/1 stop), price (right-aligned), and a bottom stats row (Depart / duration / Arrive, all single-line/no-wrap). Selected card gets a coral 1.5px border. Sticky CTA "Continue with selected route".
**State:** selected route id (defaults to the mid-price transit option).
**Interaction:** CTA → Quote & Booking Screen.

### 8. Quote & Booking Screen (`Quote Booking Screen.dc.html`)
**Purpose:** Formal quote presentation — flight choice confirmation + optional add-on services + terms acceptance.
**Layout:** Header: quote number, issue date, "Valid until" expiry, small consultant avatar+name top-right, "← Edit trip details" link back to New Booking. Section 1 "Choose your flight": 2 mutually-exclusive radio cards (Transit/Direct) with airline chip, route, stop-type pill, price; selected = coral outline + filled radio dot. Section 2 "Add-on services": 6 toggle cards (Travel crate, EHC completion & delivery, Booking fee, Collection from home, Pre-export blood tests, Destination arrival services), each with icon, title, one-line description, price, and an "Added" (green pill) / "Not selected" (grey outline pill) status toggle. Sticky footer: "Options selected: N of 6", running total price, "Provisional — confirmed once your flight is booked" muted subtext, Terms & Conditions checkbox (gates the CTA — disabled/muted button state until checked) with "Terms & Conditions" link, CTA "Continue to checkout". Below footer: bottom tab bar (Journey/Documents/Messages greyed out, Home links back to New Booking, Profile active).
**State:** selected flight (radio), 6 independent add-on booleans, terms-accepted boolean, computed running total and selected-count.
**Interaction:** CTA (enabled only when terms accepted) → Checkout Screen.

### 9. Checkout Screen
**Purpose:** Account/contact details + booking summary before payment.
**Layout:** Back link to Quote & Booking. Heading "Create your account" / subcopy. Stacked inputs: pet's name (pre-filled), full name, email, phone, password. Summary card: route, add-ons count, divider, "Deposit due today" total (Baloo 2, 18px) with "25% of total — remainder due before collection" muted note. Sticky CTA "Continue to payment".
**Interaction:** CTA → Payment Method Screen.

### 10. Payment Method Screen
**Purpose:** Card payment entry for the deposit.
**Layout:** Back link to Checkout. Heading + subcopy ("card only charged for the deposit today"). Inputs: name on card, card number, MM/YY + CVC (side by side), billing postcode. Small reassurance line with lock/shield icon: "Payments are encrypted and processed securely". Summary card repeating the deposit total. Sticky CTA "Pay £[amount] deposit" (amount interpolated from the running total, e.g. £405).
**Interaction:** CTA → Booking Confirmation Screen.

### 11. Booking Confirmation Screen
**Purpose:** Success state + clear next steps immediately after paying the deposit.
**Layout:** Centered coral checkmark badge, "Booking confirmed!" heading, one-line reassurance. Boarding-pass-style card: booking ref, origin/destination codes with a coral paper-plane divider icon. "What to do next" — 4 numbered rows (coral numbered circle + task text): upload rabies vaccination record, book titre test, confirm crate, meet consultant. Sticky CTA "Go to my journey".
**Interaction:** CTA → Home Screen (which should now reflect the pending-booking state — see Home Screen below).

### 12. Home Screen
**Purpose:** Main post-booking landing screen; also demonstrates the **no-booking-yet empty state**.
**Layout:** Header: "Welcome back, Alex" + notification bell (badge dot) linking to Notifications. A dev-only "Preview: no trip yet / active trip" text toggle sits directly under the header (**remove this toggle in the real app** — it exists only so both states are visible in this prototype; in production this should be a real conditional based on booking status, not a manual switch).
**State A — has active trip:** Trip card (white, 28px radius) with: circular pet illustration slot (coral ring, "DOG" badge), pet name + breed, LHR→LAX route strip with a plane icon, status row (colored dot + plain-language status, e.g. "Your booking is pending — we need your deposit and a few documents..."), and — in the pending-booking sub-state — a 2-item checklist (Deposit paid / Documents uploaded, each with a one-tap action link, styled in mustard/amber, not red/error). Below the trip card: an outstanding-items nudge (coral-bordered card, "N things need your attention" label + "See all" link, then a card with icon+copy for the top item + full-width "Upload now" CTA). Then a dashed-border deadline countdown chip (e.g. "3 days left until [X] closes"). Then a consultant card (photo, name, role, circular message-shortcut button). Floating circular contact/chat bubble pinned bottom-right (coral, always visible). Bottom tab bar (5 tabs: Home/Journey/Documents/Messages/Profile, Home active).
**State B — no trip yet:** Trip-card area replaced by a single centered empty-state card (icon, "No trip booked yet" heading, reassuring copy, "Get a quote" CTA linking to New Booking Screen). Consultant card, outstanding-items, deadline countdown are all hidden in this state (there is nothing to show yet).
**Interaction:** notification bell → Notifications; "Get a quote" → New Booking; tab bar → respective screens.

### 13. Journey Screen
**Purpose:** Trip milestone timeline, with a before/after-collection toggle, plus an empty state and a map-offline error state.
**Layout:** Header with back chevron, "[Pet]'s Journey", route subtitle. Segmented pill toggle: "Before collection" / "In transit" (active = coral fill, white text). Dev-only "Preview: no trip yet / active journey" toggle link (**remove in production**, same rationale as Home).
**Empty state:** centered card, plane icon, "No journey to show yet", "Get a quote" CTA.
**Before-collection state:** (1) placeholder card — "Live map opens when the journey starts" + confirmed collection date; (2) "Collection" card — address, carrier contact, latest drop-off deadline (coral-highlighted); (3) "Flights" card — route/flight number/departure/arrival; (4) full 7-step vertical milestone timeline (see below) reused in this state.
**In-transit state:** dark status bar ("In transit · landing in Xh Ym") with a small "simulate offline / back online" dev toggle (**remove in production** — represents a real connectivity-loss condition the app should detect automatically) — live map (animated SVG route line + moving marker between LHR/LAX, small "Hold: [temp]°C" environmental readout chip) OR, in the offline sub-state, a calm "Signal lost over the Atlantic" placeholder card (warning-triangle icon, reassuring copy, no alarming red). Below the map: a granular same-day checklist with real timestamps (Collected from home, Vet check & documents, Airport check-in, Departed [origin] — each ticked/coral once complete; Customs & arrival and Reunion — greyed/dashed, upcoming).
**7-step milestone timeline (before-collection view):** Initial consultation & quote (done), Veterinary requirements & health certificates (done), Route planning & flight booking (done), IATA-compliant crate delivery (current — coral highlight box with ring), Export preparation & documentation (upcoming, dashed/muted), Collection & airport check-in (upcoming), Arrival & reunion (upcoming). Each row: icon-in-circle + title + one-line description + date (actual for done, "Expected/Planned" for future).
**State:** `mode` (before/after), `hasTrip` boolean, `mapOnline` boolean.

### 14. Documents Screen
**Purpose:** Document/test checklist, plus empty state.
**Layout:** Header with title, subtitle, progress bar ("N of 5 ready"), dev-only empty-state toggle (**remove in production**).
**Empty state:** centered card, document icon, "No documents needed yet", "Get a quote" CTA.
**Normal state:** 5 white rounded rows, each icon + title + "why needed" one-liner + status badge (top-right, `flex-shrink:0` so it never gets squeezed by wrapping titles — title column uses `flex:1;min-width:0`): Verified (green pill, ✓), Expiring soon (amber pill) with an extra "valid window closes in N days" line, Missing (red/coral outline pill) with a full-width "Upload" button (camera icon implies scan-capture). Footer reassurance line: "No rush — your consultant will remind you before anything's due."

### 15. Messages Screen
**Purpose:** 1:1 chat with assigned consultant.
**Layout:** Persistent header — consultant photo + name + small "call" icon (emergency contact). Scrollable chat thread — consultant's opening message references the pet and route by name. 3–4 quick-reply suggestion chips above the input. Bottom input bar: text field + circular send button.

### 16. Profile Screen
**Purpose:** Pet details + owner details, tab-toggled.
**Layout:** Header "Profile" + gear icon (top-right) → Profile Settings. Segmented pill toggle: "Pets" / "Owner".
**Pets tab:** pet card (icon, name, breed/species, "Docs needed" status badge top-right) with rows: DOB, microchip number (monospace, prominent), weight, rabies-vaccine status (verified pill), other vaccines, assigned crate. "Documents for [pet]" card — list with status pills, "Upload document" CTA. "Your travel crate" card — two paths: (a) text input to enter an existing crate's dimensions + "Check" button (validated against volumetric allowance); (b) 3 recommended-crate options (IATA size code, dimensions, price, "fits up to Xkg volumetric"), best match flagged "Recommended" (coral badge + highlighted border), each with an "Add" button.
**Owner tab:** profile card with "Edit" link top-right; rows for name/email/phone/address, then passport number/nationality/visa status, then arrival date/flight, then next-of-kin name/phone (dashes shown for any empty field) — grouped with thin dividers. "Scan passport / visa" pill button (camera icon). Separate "Who's collecting on arrival?" card — explanatory copy + "Add collection person" CTA.

### 17. Profile Settings Screen
**Purpose:** Notification preferences and account actions.
**Layout:** Back chevron + "Settings" header. "Notifications" section — 3 rows (Journey updates, Messages from consultant, Offers & news) each with a custom pill toggle switch (coral = on). "Account" section — "Change password" and "Privacy & terms" nav rows (chevron). "Log out" (outlined pill button) and "Delete my account" (small red-brown text link) at the bottom.

### 18. Notifications Screen
**Purpose:** Notification inbox.
**Layout:** Back chevron + "Notifications" header. Feed of cards, each icon + title + one-line body + relative timestamp. Unread/priority item (e.g. document expiring) gets a coral border to stand out; others are plain white cards.

### 19. Acceptance Card (+ Demo)
**Purpose:** Reusable lightweight consent/acceptance component for 3 contexts: Terms & Conditions, media consent, owner-supplied-crate waiver.
**Layout:** White rounded card — bold title, 1–2 line plain-English summary, a row with (a) a checkbox + "I accept" label and (b) a "View full terms" text link. Clicking the link expands an inline scrollable panel with the full legal text (collapsible, does not navigate away).
**Props (for reuse):** `title`, `summary`, `linkLabel`, `fullText` — swap per context, no layout changes needed. `Acceptance Card Demo.dc.html` shows all 3 contexts stacked to demonstrate reuse.

## Interactions & Behavior Notes
- Dev-only preview toggles (small muted text links reading "Preview: ...") appear on Home, Journey, and Documents screens purely so this prototype can show both the has-booking and no-booking states in one file. **These should not exist in the shipped app** — the real app should render the empty vs. populated state based on actual booking/account data.
- Similarly, the "simulate offline" toggle on the Journey in-transit map is a prototyping aid — real behavior should be driven by actual connectivity/data-feed status.
- The bottom tab bar's Journey/Documents/Messages tabs are shown greyed-out and non-interactive on the pre-booking screens (New Booking, Flight Results, Quote & Booking) since there's no trip yet to show on those tabs.
- Terms & Conditions checkbox on Quote & Booking gates the primary CTA (disabled/muted styling until checked).
- All flows are simple full-page navigations (`window.location.href` in the prototype) — in the target app these should be proper in-app navigation/route transitions, not full page loads.

## Flow Diagram
```
Welcome → Sign Up ──┐
Sign In → Forgot Password → (back to) Sign In
                     ↓
              New Booking (Get a Quote) → Country Rules
                     ↓
              Flight Results
                     ↓
              Quote & Booking (flights + add-ons + T&Cs)
                     ↓
              Checkout (account details)
                     ↓
              Payment Method
                     ↓
              Booking Confirmation
                     ↓
              Home ⇄ Journey ⇄ Documents ⇄ Messages ⇄ Profile
              Home → Notifications
              Profile → Profile Settings → Log out → Welcome
```

## Assets
- Fonts: Google Fonts `Baloo 2` (weights 600/700/800) and `Nunito` (weights 400/600/700) — loaded via `<link>` tag, standard Google Fonts CDN.
- Icons: hand-drawn-style inline SVGs (stroke-based line icons), authored directly in each file — no icon library dependency. Recreate using the target app's icon system in the same visual style (thin rounded strokes, single color, no fill except small status dots).
- Pet illustration / consultant photo / crate photo: represented as `<image-slot>` placeholders in the prototype (drag-and-drop image targets). In production these are real uploaded/CMS images — pet line-art illustrations should follow the brand's hand-drawn single-color style on a soft species-colored wash background; crate images should be real product photography, never illustrated.

## Files
All screens are individual `.dc.html` files in this folder, named to match the screen names above (e.g. `Home Screen.dc.html`, `Quote Booking Screen.dc.html`). Each is a complete, standalone HTML document viewable in a browser. `support.js` and `image-slot.js` are prototyping runtime dependencies only — not needed in the production app.
