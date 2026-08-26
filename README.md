# Kissonde Gym — Phase 1

Mobile member app for Kissonde Gym, built with Expo + React Native + TypeScript.

## Phase 1 scope implemented

1. Member sign-in flow (demo authentication boundary ready for real API)
2. Home dashboard
3. Offline-ready digital membership card
4. QR access credential
5. Verified/pending visit history and missing-visit reporting
6. Structured training programme
7. Workout completion/logging state
8. Exercise library
9. Progress dashboard
10. Class timetable
11. Class booking
12. Waitlist position
13. Gym occupancy indicator
14. Rewards marketplace
15. Transparent points ledger
16. Trainer profiles
17. PT booking flow
18. Membership information
19. Notification preferences
20. Support issue routing

## Product principles

- Members should always know whether an important action succeeded.
- Visits, points, bookings, waitlists and payments should have visible status/history.
- Training is programme-led rather than a loose collection of videos.
- Rewards are user-selected and auditable.
- Gym access should not depend on a live data connection.

## Current implementation status

This Phase 1 repository is a functional front-end MVP with local persisted demo state. It deliberately does **not** invent Kissonde production APIs, member credentials, payment providers, turnstile protocols or operational data.

The following require connection to Kissonde's real systems before production launch:

- Member authentication and account recovery
- Membership/payment database
- Dynamic QR/access-token signing and turnstile validation
- Live check-in/check-out feed
- Real class schedules, capacities and waitlists
- PT calendars and payment
- Live occupancy data
- Exercise video/content catalogue
- Push notifications
- Rewards inventory and redemption fulfilment
- Support ticket backend

## Run locally

```bash
npm install
npm start
```

Then open the project in Expo Go, an Android/iOS simulator, or the web target.

## Demo behaviour

The sign-in screen accepts any password because authentication is mocked. Bookings, completed exercises, points and redemptions persist locally using AsyncStorage.

## Stack

- Expo 53
- React Native 0.79
- React 19
- TypeScript
- React Navigation
- AsyncStorage
- react-native-qrcode-svg

## Next engineering step

Define the Kissonde backend contract: member identity, memberships, access events, classes, trainers, rewards, payments and support. Once those data sources are confirmed, replace the mock domain data with API services without changing the user-facing product structure.
