# Kissonde Gym

Member mobile application for Kissonde Gym, built with Expo, React Native and TypeScript.

## Current product scope

The app now includes:

1. Member sign-in UI with validation
2. Branded home dashboard
3. Offline-ready digital membership card UI
4. QR access credential surface
5. Verified/pending visit history
6. Trackable missing-visit reports
7. Structured training programme
8. Real set-by-set workout logging for weight and repetitions
9. Today / Programme / Progress training navigation
10. Exercise library surface
11. Progress metrics and workout volume
12. Class timetable
13. Explicit confirmed / waitlisted / cancelled reservation states
14. Visible waitlist position
15. Gym occupancy indicator
16. Rewards marketplace
17. Dynamic, auditable points ledger
18. Repeatable reward redemptions with individual redemption references
19. Trainer profiles
20. Persisted PT bookings and cancellations
21. Membership information
22. Notification preferences
23. Trackable support tickets
24. App-level error boundary and safe startup hydration

## Product principles

- Members should always know whether an important action succeeded.
- Visits, points, bookings, waitlists, redemptions and support requests have visible references and states.
- Training is programme-led and records actual sets, weight and repetitions.
- Rewards are member-selected and every points movement produces an auditable ledger entry.
- Gym access must remain usable during temporary connectivity loss once a production offline access credential has been issued.
- Authentication and access control must fail safely in production; local preview state is not a substitute for server authorization.

## Architecture

The member UI has been split into feature modules under `src/screens/` instead of one monolithic screen file.

Core layers:

- `src/domain.ts` — application domain models
- `src/state.tsx` — persisted client-side state and member workflow records
- `src/screens/` — feature screens
- `src/ui.tsx` — reusable UI primitives
- `src/theme.ts` — Kissonde brand and semantic status colours
- `src/services/contracts.ts` — typed backend contract required by the app
- `src/services/http.ts` — timeout/error-aware HTTP boundary
- `src/config.ts` — environment-based runtime configuration
- `src/ErrorBoundary.tsx` — app-level runtime failure containment

## Local data behavior

Until Kissonde's backend is connected, operational records are persisted locally with AsyncStorage so the complete user journeys can be exercised. The local authentication flag is intentionally **not** persisted as a production session token.

The active workout resets when the calendar day changes, while historical-style member records such as points, reservations, redemptions, PT bookings and support references remain persisted.

## Production backend contract

`src/services/contracts.ts` defines the data operations the production backend needs to provide without assuming that Kissonde already has specific HTTP endpoints.

Required server capabilities include:

- Member authentication, refresh and account recovery
- Member and membership status
- Signed access credential issuance and validation
- Check-in/check-out event history
- Visit dispute workflow
- Class schedules, capacities, reservations and waitlists
- Workout history persistence
- Rewards inventory, points ledger and redemption fulfilment
- Trainer availability and PT bookings
- Payments where applicable
- Support ticket workflow
- Live occupancy
- Push notification registration and delivery

## Critical requirements before App Store / Play Store production launch

The front-end is structured for production integration, but the following external dependencies must exist before the app can safely be launched to real members:

1. **Real authentication backend** — the current local sign-in boundary must be replaced by Kissonde member authentication and secure token storage.
2. **Signed/rotating access credentials** — the current QR surface must be backed by a server-issued credential accepted by Kissonde's turnstile/access system. A static member QR must not be used as a production security credential.
3. **Authoritative server state** — class capacity, waitlist position, points, visits, membership status and PT availability must come from the server rather than sample domain data.
4. **Transactional rewards** — reward redemption and point deductions must be atomic on the backend to prevent double-spend.
5. **Payments** — the payment provider and membership billing rules must be confirmed before payment controls are exposed.
6. **Push notifications** — production notification credentials, permissions and event triggers must be configured.
7. **Privacy and legal** — production privacy policy, terms, data retention rules and consent flows must be approved for the markets in which the app is distributed.
8. **Production logo asset** — the exact supplied Kissonde logo is used in-app. For native store icon/splash packaging, the same approved logo needs to be supplied as a clean production PNG asset suitable for iOS/Android packaging; it must not be redrawn.

## Runtime configuration

Copy `.env.example` to your environment configuration and set:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-kissonde-api.example
```

No credentials or secret keys should be committed to the repository.

## Build profiles

`eas.json` provides development, preview and production EAS build profiles.

## Run locally

```bash
npm install
npm start
```

Type safety:

```bash
npm run typecheck
```

GitHub Actions runs the strict TypeScript check on every push to `main` and on pull requests.

## Stack

- Expo 53
- React Native 0.79
- React 19
- TypeScript with `strict` and `noUncheckedIndexedAccess`
- React Navigation
- AsyncStorage for non-sensitive preview/local workflow state
- react-native-qrcode-svg

## Next integration step

Map the `KissondeBackend` interface in `src/services/contracts.ts` to Kissonde's actual member-management, access-control, class, trainer, rewards and support systems. Once those real data sources and authentication rules are confirmed, server-backed implementations can replace the local preview records without redesigning the member-facing product.
