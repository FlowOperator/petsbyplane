# Design: Pets by Plane V1 — Realistic Rebuild

## Architecture Overview

The app is a single-page Expo Router application with two primary states controlled by one global flag: `hasBooking: boolean`. This flag is the sole determinant of what users see across all 5 tabs and determines whether the quote flow or the trip-management experience is shown.

```
┌─────────────────────────────────────────────────┐
│  AppProvider (global state + hasBooking flag)    │
├─────────────────────────────────────────────────┤
│  RootLayout (_layout.tsx)                       │
│  ├── / (Landing/Welcome)                        │
│  ├── /auth/signin                               │
│  ├── /auth/signup                               │
│  ├── /auth/forgot-password                      │
│  ├── /quote (New Booking form)                  │
│  ├── /quote/flight-results (reassurance page)   │
│  ├── /quote/pending (waiting for consultant)    │
│  ├── /quote/booking (consultant's quote)        │
│  ├── /quote/checkout                            │
│  ├── /quote/payment                             │
│  ├── /quote/confirmation                        │
│  ├── /guides (Travel Guides hub)                │
│  ├── /guides/country-rules                      │
│  ├── /guides/import-process                     │
│  ├── /guides/crates                             │
│  ├── /guides/vaccinations                       │
│  ├── /guides/airlines                           │
│  ├── /guides/contact (Get In Touch)             │
│  ├── /notifications                             │
│  └── /(tabs)                                    │
│       ├── index (Home)                          │
│       ├── journey                               │
│       ├── documents                             │
│       ├── messages                              │
│       └── profile                               │
│            └── /profile-settings                │
└─────────────────────────────────────────────────┘
```

## State Design

### Global State Shape (simplified for V1)

```typescript
interface AppState {
  // Auth
  isAuthenticated: boolean;
  
  // The single source of truth
  hasBooking: boolean;
  
  // User data (populated at checkout)
  owner: Owner | null;
  
  // Pet data (populated at checkout)  
  pets: Pet[];
  
  // Trip data (populated when quote is accepted + deposit paid)
  activeTrip: Trip | null;
  
  // Consultant (assigned after booking)
  consultant: Consultant | null;
  
  // Documents (populated by consultant after booking)
  documents: PetDocument[];
  
  // Quote state (transient during quote flow)
  pendingQuote: PendingQuote | null;
  quoteReady: boolean;
}
```

### Key State Transitions

1. **App opened fresh** → `hasBooking: false`, show Welcome
2. **Guest submits quote form** → `pendingQuote` populated, navigate to Flight Results → Quote Pending
3. **"Quote ready" notification tapped** → navigate to Quote & Booking screen
4. **Deposit paid at Checkout** → `hasBooking: true`, all tabs flip to active state
5. **Logout** → reset to initial state, navigate to Welcome

## Screen Designs

### Mapping to Requirements

| Req | Screens | Key Change from Current |
|-----|---------|------------------------|
| R1 | Welcome, Sign In, Sign Up, Forgot Password | Welcome → quote form (not tabs) |
| R2 | New Booking, Flight Results (reassurance), Quote Pending | Remove flight picker, add pending state |
| R3 | Quote & Booking | Single route card, not multi-select |
| R4 | Checkout, Payment, Confirmation | Mostly unchanged |
| R5 | All tabs | Add hasBooking conditional everywhere |
| R6 | Home | Add browse cards for no-booking state |
| R7 | Journey | Remove live map, keep milestone timeline |
| R8 | Guides hub + 6 sub-screens | New screens to build |
| R9 | Messages | Add proper empty state |
| R10 | Documents | Add proper empty state |
| R11 | Profile, Profile Settings | Mostly unchanged |
| R12 | Notifications | Add "quote ready" notification type |

## Component Strategy

### Reuse from current codebase
- `Card`, `Button`, `Badge`, `StatusDot`, `Divider` — keep as-is
- `EmptyState` — keep, may need variant for browse-content CTAs
- `ProgressSteps` — keep for checkout flow
- `BackButton`, `PageHeader` — keep
- `TabToggle` — keep for Journey/Profile/Country Rules
- `SearchableDropdown`, `DatePickerModal` — keep for New Booking form
- `AcceptanceCard` — keep for T&Cs

### New components needed
- `BrowseCard` — horizontal scroll card for travel guides (icon + label)
- `QuotePendingCard` — waiting state with animation/illustration
- `RouteCard` — single recommended route display (non-interactive)
- `GuideScreen` — wrapper layout for content screens (back link + conditional CTA)

### Screens to rebuild from scratch (matching design comps)
- `/quote/flight-results` — reassurance page, not a picker
- `/quote/pending` — new screen (waiting for consultant)
- `/quote/booking` — single route + add-ons (not multi-select flights)
- `/guides/*` — 6 new content screens + hub
- Home screen no-booking state (add browse cards)

### Screens to modify
- Home (add browse section for no-booking)
- Journey (remove live map, simplify transit view)
- Messages (proper empty state with "Get in Touch" CTA)
- Tab layout (grey out tabs when hasBooking = false)

### Screens mostly unchanged
- Welcome, Sign In, Sign Up, Forgot Password
- Checkout, Payment, Confirmation
- Documents (just needs proper empty state)
- Profile, Profile Settings
- Notifications (add "quote ready" type)

## Navigation Flow

```
Welcome ──→ Sign Up (optional) ──→ New Booking (Get a Quote)
  │                                      │
  ├── Sign In ──→ Home (has/no booking)  │
  │                                      ▼
  │                              Flight Results (reassurance)
  │                                      │
  │                                      ▼
  │                              Quote Pending (wait)
  │                                      │
  │                              [notification arrives]
  │                                      │
  │                                      ▼
  │                              Quote & Booking (consultant's quote)
  │                                      │
  │                                      ▼
  │                              Checkout (create account + summary)
  │                                      │
  │                                      ▼
  │                              Payment
  │                                      │
  │                                      ▼
  │                              Confirmation ──→ Home (hasBooking = true)
  │
  └── [any state] ──→ Travel Guides hub ──→ Country Rules
                                          ──→ Import Process
                                          ──→ Travel Crates
                                          ──→ Vaccinations
                                          ──→ Airlines
                                          ──→ Get In Touch
```

## Tab Bar Behavior

| State | Home | Journey | Documents | Messages | Profile |
|-------|------|---------|-----------|----------|---------|
| No booking | Active | Greyed/disabled | Greyed/disabled | Greyed/disabled | Active |
| Has booking | Active | Active | Active | Active | Active |

On pre-booking screens (New Booking, Flight Results, etc.), the tab bar shows with Journey/Documents/Messages greyed out.

## File Structure (target)

```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab bar with conditional greying
│   ├── index.tsx            # Home (both states)
│   ├── journey.tsx          # Journey (both states)
│   ├── documents.tsx        # Documents (both states)
│   ├── messages.tsx         # Messages (both states)
│   └── profile.tsx          # Profile (both states)
├── auth/
│   ├── signin.tsx
│   ├── signup.tsx
│   └── forgot-password.tsx
├── quote/
│   ├── _layout.tsx          # Quote flow context provider
│   ├── index.tsx            # New Booking form
│   ├── flight-results.tsx   # Reassurance (NOT a picker)
│   ├── pending.tsx          # NEW — waiting for consultant
│   ├── booking.tsx          # Consultant's prepared quote
│   ├── checkout.tsx
│   ├── payment.tsx
│   └── confirmation.tsx
├── guides/
│   ├── index.tsx            # Travel Guides hub
│   ├── country-rules.tsx
│   ├── import-process.tsx
│   ├── crates.tsx
│   ├── vaccinations.tsx
│   ├── airlines.tsx
│   └── contact.tsx          # Get In Touch
├── notifications.tsx
├── profile-settings.tsx
├── index.tsx                # Landing/Welcome
├── +not-found.tsx
├── +html.tsx
└── _layout.tsx              # Root layout
```

## Implementation Phases

### Phase 1: Core state + routing restructure
- Refactor store to use `hasBooking` as primary flag (not `activeTrip`)
- Remove auto-seed of mock data (start in empty/no-booking state)
- Restructure routes to match new file structure
- Update tab layout to conditionally disable tabs

### Phase 2: Quote flow rebuild
- New Booking form (keep existing, minor tweaks)
- Flight Results → reassurance page (rebuild)
- Quote Pending (new screen)
- Quote & Booking → single route card (rebuild)
- Checkout + Payment + Confirmation (minor tweaks)

### Phase 3: Home + empty states
- Home no-booking state with browse cards
- Home has-booking state (keep existing trip card)
- Journey/Documents/Messages proper empty states
- Profile limited state

### Phase 4: Travel Guides
- Hub screen
- Country Rules (keep existing, add Export/Import toggle)
- 5 new content screens

### Phase 5: Polish + deploy
- Match all screens pixel-close to design comps
- Test all state transitions
- Clean up unused code from the old futuristic version
- Deploy
