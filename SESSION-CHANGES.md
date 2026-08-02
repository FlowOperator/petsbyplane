# Session Changes — Vibe Coding Session (1–2 Aug 2026)

## What happened

This project was copied from a previous vibe coding session (stored in OneDrive) into `C:\Dev\pets-by-plane` so that we could auto-push to GitHub. During this session we made significant architectural changes to ground the app in reality for a small company's V1.

---

## Major Changes Made

### 1. Removed "futuristic" features that need APIs the company doesn't have

**Before:** The app had a live flight picker (6 airlines with real-time pricing), instant quote generation, real-time GPS pet tracking with animated map, and auto-seeded demo data on every load.

**After:** 
- Quote is now **consultant-prepared** — user submits a form, waits, gets notified when ready
- Flight selection replaced with a **reassurance page** ("your consultant finds the best route")
- Journey tracking is **milestone-based** (manually updated by consultant), not live GPS
- App starts **empty** — no mock data seeded, user goes through the real flow

### 2. Added `hasBooking` as the single state flag

**Before:** `activeTrip` was checked everywhere, mock data was always present.

**After:** One boolean `hasBooking` controls everything:
- `false` → empty states on all tabs, browse content accessible, tab bar greys out Journey/Documents/Messages
- `true` → full trip experience, all tabs active, consultant assigned

### 3. Rebuilt the quote flow

**Before:** Form → instant flight picker → select airline → add-ons → pay

**After:** Form → reassurance page → **Quote Pending** (wait for consultant) → consultant's prepared quote (single route, add-ons) → checkout → payment → confirmation

New screens created:
- `/quote/flight-results.tsx` — reassurance (not a picker)
- `/quote/pending.tsx` — waiting state
- `/quote/booking.tsx` — consultant's quote with single route + add-ons + T&Cs

### 4. Added Travel Guides (persistent content, not booking-gated)

New route group `/guides/` with 6 screens:
- Country Rules (with Export/Import toggle)
- Import Process (UK ARC explainer)
- Travel Crates (sizing, acclimatisation, FAQ)
- Vaccinations & Tests (timing, blood tests)
- Airlines & Partners (6 profiles)
- Get In Touch (contact form)

All accessible from Home in both states. Each shows "Ready? Get a quote" CTA only when `hasBooking = false`.

### 5. Rebuilt the Welcome/Landing screen

**Before:** Marketing page with stats, "how it works", accreditation badges.

**After:** Dark-background 3-slide carousel matching the design comp — auto-rotating slides, gold "Get a free quote" CTA, "Sign in" outlined button, "Skip" top-right.

### 6. Home screen now has two distinct states

**No booking:** Empty card + "Get a quote" CTA + 4 horizontal browse cards (Country rules, Travel crates, Vaccines, Airlines) + "See all travel guides" link.

**Has booking:** Trip card with pet info, route, status message, attention items, consultant card, quiet guides link. Status text is dynamic based on trip status.

### 7. Fixed web rendering issues

- Added 480px max-width container with box-shadow (phone-frame effect)
- Replaced all `borderStyle: 'dashed'` (unreliable on web) with solid alternatives
- Added custom `+html.tsx` with OG meta tags, focus-visible styles
- Tab bar sticky on web
- Logout works on web (removed Alert.alert)

### 8. Added reusable components

- `EmptyState` — icon + title + description + CTA
- `ProgressSteps` — segmented progress bar for quote flow
- `Skeleton` / `SkeletonCard` — loading placeholders
- `BackButton` / `PageHeader` / `TabToggle` — shared UI patterns
- `StickyFooter` — cross-platform sticky bottom bar
- `StatusDot` — with pulse animation
- `Badge` — now supports species-themed colors
- Format utilities (`formatCurrency`, `formatDate`, etc.)

### 9. Added spec/requirements files

- `.kiro/specs/v1-realistic-rebuild/requirements.md` — 12 requirements
- `.kiro/specs/v1-realistic-rebuild/design.md` — architecture + screen map
- `.kiro/specs/v1-realistic-rebuild/tasks.md` — 36 tasks (mostly complete)

### 10. Brand guide committed

The design handoff zip was extracted into `brand-guide/` — all `.dc.html` design comps are viewable in a browser for reference.

---

## Files/Screens Removed

- `app/requirements.tsx`
- `app/country-rules.tsx` (moved to `/guides/country-rules`)
- `app/measurements.tsx` (now in New Booking form + Profile)
- `app/quote/results.tsx` (replaced by `flight-results.tsx`)
- `app/quote/addons.tsx` (replaced by `booking.tsx`)
- `app/import/` directory (moved to `/guides/import-process`)

---

## How To Move This Back to OneDrive

The project currently lives at `C:\Dev\pets-by-plane`. To move it back:

### Option A: Move the whole folder
```
1. Close any running terminals/IDE instances using this folder
2. Move the folder:
   C:\Dev\pets-by-plane → [Your OneDrive Path]\Dev\pets-by-plane
3. Open it from the new location in your IDE
4. Git still works — the remote (GitHub) is configured inside the .git folder
```

### Option B: Copy source only (skip heavy folders)
```
1. Copy everything EXCEPT:
   - node_modules/  (regenerated by `npm install`)
   - dist/          (regenerated by `npx expo export`)
   - .expo/         (cache, regenerated automatically)
2. When you want to run it again from OneDrive:
   cd [your-onedrive-path]/pets-by-plane
   npm install
```

### What stays on GitHub regardless
The GitHub repo at `https://github.com/FlowOperator/petsbyplane` has everything pushed. The GitHub Actions workflow auto-deploys to GitHub Pages on every push to `main`. Where the folder lives on your machine doesn't affect any of this — you can push from OneDrive just the same as from `C:\Dev\`.

### If you want to work from OneDrive AND still auto-push
Just open the project from your OneDrive path in your IDE next time. Git commands work from any location. The only reason it was moved to `C:\Dev\` was to keep the path simple — there's no technical requirement for it to be there.

---

## What This Session Did NOT Change

- The original product requirements document (the full spec from the OneDrive session) was not in this repo — it was only provided at the end of this session
- The brand guide zip was added during this session
- The existing theme system (colors, typography, spacing, shadows) was kept intact
- The existing components that still make sense (Card, Button, Badge, SearchableDropdown, DatePickerModal, AcceptanceCard) were kept
- The Expo Router structure and deployment pipeline were kept

---

## Current State of the Live Site

URL: `https://flowoperator.github.io/petsbyplane/`

Working flows:
1. Welcome → Get a quote → Fill form → Reassurance → Pending → (Demo: View quote) → Booking → Checkout → Payment → Confirmation → Home (with booking)
2. Welcome → Sign in → Home (empty) → Demo: Skip to booked state → Home (active trip)
3. Any state → Travel Guides (6 screens of real content)
4. Profile → Settings → Logout → back to Welcome
