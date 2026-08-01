# Tasks: Pets by Plane V1 — Realistic Rebuild

## Phase 1: Core State + Routing

- [x] 1. Refactor `AppState` to use `hasBooking` as the primary conditional flag instead of `activeTrip`
- [x] 2. Remove auto-seed of mock data in `AppProvider` — app starts in empty/no-booking state
- [x] 3. Add `SET_BOOKING` action that flips `hasBooking: true` and populates trip/pet/owner/consultant
- [x] 4. Create `/guides` route group with `_layout.tsx`
- [x] 5. Rename `/quote/results.tsx` → `/quote/flight-results.tsx` (reassurance page)
- [x] 6. Create `/quote/pending.tsx` (new waiting screen)
- [x] 7. Rename `/quote/addons.tsx` → `/quote/booking.tsx` (consultant's quote)
- [x] 8. Update tab `_layout.tsx` to conditionally grey/disable Journey, Documents, Messages tabs when `hasBooking = false`
- [x] 9. Remove old components/screens that don't match the V1 spec (ShareTracking, SyncCalendar, BehavetCard, CrateGuidance, etc.)

## Phase 2: Quote Flow Rebuild

- [x] 10. Rebuild `New Booking` form to match design comp (species tiles, route fields, measurements grid, reason chips)
- [x] 11. Rebuild `Flight Results` as a reassurance page — no flight picker, just "your consultant finds the best route" messaging
- [x] 12. Build `Quote Pending` screen — waiting illustration, "we'll notify you when your quote is ready" messaging, estimated timeframe
- [x] 13. Rebuild `Quote & Booking` screen — single consultant-recommended route card (not selectable), add-on toggles, running total, T&Cs checkbox
- [x] 14. Update `Checkout` — account creation combined with booking summary (pet name, full name, email, phone, password)
- [x] 15. Update `Payment` — card form + deposit amount from quote
- [x] 16. Update `Confirmation` — boarding-pass card + "what to do next" steps + trigger `hasBooking = true`

## Phase 3: Home + Empty States

- [x] 17. Rebuild Home no-booking state: "No trip booked yet" card + "Get a quote" CTA + "Have a browse" section with 4 horizontal scroll cards linking to guides
- [x] 18. Rebuild Home has-booking state to match design comp (trip card, status, checklist, attention items, consultant card, quiet guides link)
- [x] 19. Update Journey empty state + simplify transit view (remove live map, keep timestamp checklist)
- [x] 20. Update Documents empty state
- [x] 21. Update Messages: pre-booking empty state with "No consultant assigned yet" + "Get in Touch" CTA
- [ ] 22. Update Profile: limited state when no booking (no pet data shown)

## Phase 4: Travel Guides

- [x] 23. Build Travel Guides hub screen (6 linked cards)
- [x] 24. Rebuild Country Rules with Export/Import toggle (keep destination chip selector)
- [x] 25. Build Import Process screen (UK ARC process explainer)
- [x] 26. Build Travel Crates screen (types, measurements, acclimatisation)
- [x] 27. Build Vaccinations & Tests screen (requirements, timing, blood tests)
- [x] 28. Build Airlines & Partners screen (partner profiles)
- [x] 29. Build Get In Touch screen (general contact form)
- [x] 30. Add conditional "Ready? Get a quote" CTA to all guide screens (only when hasBooking = false)

## Phase 5: Polish + Deploy

- [x] 31. Match typography, colors, spacing pixel-close to design comps across all screens
- [x] 32. Remove unused old components (live flight picker, real-time map, instant quote logic)
- [ ] 33. Test full flow: Welcome → Quote → Pending → Booking → Checkout → Payment → Confirmation → Home (with booking)
- [ ] 34. Test empty states: all tabs show correct no-booking UI
- [ ] 35. Test guides: all 6 reachable from Home (both states) and Profile
- [x] 36. Clean up unused files, verify web export builds, push final version
