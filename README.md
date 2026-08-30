# Kissonde Gym

Pitch-ready member and management platform for Kissonde Gym, built with Expo, React Native and TypeScript.

## Product position

The project is designed as more than a digital membership card. It combines gym access, personalised training, class discovery, rewards, member support, connected fitness and a management analytics layer.

The current build intentionally uses local/demo data so the product can be completed and pitched before Supabase or other paid infrastructure is connected.

## Current member product scope

The app includes:

1. Branded member sign-in with validation
2. Account recovery states ready for backend integration
3. Four-step personalised onboarding
4. Goal, experience, training-frequency and preferred-day selection
5. Goal-specific training programme selection
6. Personalised home dashboard
7. Offline-ready digital membership card UI
8. QR access credential surface
9. Verified / pending / disputed visit history
10. Trackable missing-visit reports
11. Multiple structured training programmes
12. Real set-by-set workout logging for weight and repetitions
13. Today / Programme / Progress training navigation
14. Previous workout history and volume summaries
15. Detailed exercise guidance: setup, execution, muscles, mistakes and alternatives
16. Exercise demonstration-video surface ready for approved media
17. Progress metrics, workout volume and best-lift tracking
18. Searchable and filterable class timetable
19. Class favourites
20. Explicit confirmed / waitlisted / cancelled reservation states
21. Visible waitlist position and estimated promotion likelihood
22. Instructor ratings and member feedback
23. Trainer profiles, ratings and specialties
24. Persisted PT bookings and cancellations
25. Gym occupancy indicator
26. Rewards marketplace
27. Dynamic, auditable points ledger
28. Repeatable reward redemptions with individual references
29. Challenges and reward-progress surfaces
30. Referral-code experience
31. Notification centre with read/unread state
32. Apple Health integration surface
33. Android Health Connect integration surface
34. Garmin, Strava and Samsung Health integration surfaces
35. Apple Wallet / Apple Watch membership-access surface
36. Google Wallet / Wear OS membership-access surface
37. Membership management: freeze, upgrade, renewal and invoice requests
38. Billing-history and payment-method UX
39. Privacy and consent controls
40. Data-export and deletion-request UX
41. Trackable support tickets
42. App-level error boundary and safe startup hydration
43. Reusable loading, offline, empty and error-state components

## Kissonde management demo

A management dashboard is included for pitch demonstrations. It shows how the same platform can support management decisions with:

- Active members
- Members currently inside the club
- Occupancy
- Visits today and monthly visits
- Retention
- Class fill rates
- At-risk member segments
- Reward usage
- PT bookings
- Support workload
- Visit disputes
- Operational capability explanations

All management numbers are explicitly demo data until a real backend is connected.

## Product principles

- Members should always know whether an important action succeeded.
- Visits, points, bookings, waitlists, redemptions and support requests have visible references and states.
- Training is programme-led and records actual sets, weight and repetitions.
- Rewards are member-selected and every points movement produces an auditable ledger entry.
- Connected activity must retain source/origin information so it can later be verified before affecting rewards.
- Gym access must remain usable during temporary connectivity loss once a production offline access credential has been issued.
- Authentication and access control must fail safely in production; local preview state is not a substitute for server authorization.
- Demo integrations are clearly labelled and do not pretend that external credentials or APIs are already connected.

## Architecture

Core layers:

- `src/domain.ts` — member, class, workout, reward and support domain models
- `src/product.ts` — programmes, exercise guides, integrations, challenges and pitch demo analytics
- `src/state.tsx` — persisted local workflow state
- `src/screens/` — member and management feature screens
- `src/ui.tsx` — reusable UI primitives
- `src/uxStates.tsx` — loading, error, empty and offline states
- `src/theme.ts` — Kissonde brand and semantic status colours
- `src/services/contracts.ts` — typed backend contract required by the product
- `src/services/http.ts` — timeout/error-aware HTTP boundary
- `src/config.ts` — environment-based runtime configuration
- `src/ErrorBoundary.tsx` — app-level runtime failure containment

## Local demo behaviour

Until Kissonde's backend is connected, operational records are persisted locally with AsyncStorage so the complete user journeys can be exercised.

The local authentication flag is intentionally **not** persisted as a production session token.

Persisted demo workflows include:

- Member onboarding preferences
- Points ledger and reward redemptions
- Class bookings and waitlists
- Workout sets
- PT bookings
- Support and visit cases
- Class favourites and instructor ratings
- Challenges
- Connected-integration preview states
- Notification read state
- Membership requests

The active workout resets when the calendar day changes.

## Backend/Supabase boundary

The frontend does not assume Supabase-specific data access. `src/services/contracts.ts` defines the product operations the backend must eventually provide.

Required server capabilities include:

- Member authentication, refresh and recovery
- Member and membership status
- Signed access credential issuance and validation
- Check-in/check-out event history
- Visit dispute workflow
- Class schedules, capacities, reservations and waitlists
- Workout history persistence
- Rewards inventory, points ledger and transactional redemption
- Trainer availability and PT bookings
- Membership billing and payments where applicable
- Support workflow
- Live occupancy
- Push notification registration and delivery
- External activity-source verification where rewards depend on connected fitness data

## What remains intentionally external

The project can be pitched without these systems, but real-member launch requires:

1. **Supabase or another production backend** for real multi-user state.
2. **Real authentication and secure token storage.**
3. **Signed/rotating QR access credentials** accepted by Kissonde's access-control hardware.
4. **Authoritative server state** for membership, visits, class capacity, points, rewards and PT availability.
5. **Atomic reward transactions** to prevent double-spend.
6. **Payment-provider selection and credentials.**
7. **Push-notification credentials and production event triggers.**
8. **Apple Health / Health Connect / wearable credentials and native implementation** where required.
9. **Wallet/watch signing and entitlement configuration.**
10. **Approved privacy policy, terms, retention rules and consent language.**
11. **Clean production logo asset for native store icon/splash packaging.** The supplied Kissonde logo must be used unchanged.

## Validation

Pitch-scope regression check:

```bash
npm run validate:pitch
```

Strict TypeScript validation:

```bash
npm run typecheck
```

Production web export:

```bash
npm run build:web
```

Run all release checks:

```bash
npm run validate
```

GitHub Actions runs the pitch-scope check, strict TypeScript validation and production web export on every push to `main` and on pull requests.

## Runtime configuration

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-kissonde-api.example
```

No credentials or secret keys should be committed to the repository.

## Stack

- Expo 53
- React Native 0.79
- React 19
- TypeScript with `strict` and `noUncheckedIndexedAccess`
- React Navigation
- AsyncStorage for non-sensitive preview/local workflow state
- react-native-qrcode-svg
- Expo web export deployed through Vercel

## Recommended final integration order

1. Final visual/device QA using the pitch build
2. Approved native logo/icon asset
3. Confirm Kissonde membership, access-control, billing and class rules
4. Connect Supabase/backend through the existing service contract
5. Replace demo data with authoritative server state
6. Configure payments, notifications, health/wearable APIs and wallet credentials
7. Security/privacy review
8. App Store / Play Store release build
