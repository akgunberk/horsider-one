# Horse Racing Game — Specification

## Stack

- Vue 3+ (`<script setup lang="ts">`, Composition API only), TypeScript (strict, `noUncheckedIndexedAccess`), Pinia (setup stores), Vite
- UI: Tailwind CSS v4, shadcn-vue (`new-york` neutral theme, reka-ui primitives), `@lucide/vue` icons
- Testing: Vitest + `@vue/test-utils` (engine, store, components), Playwright (E2E)

## Domain Rules

- **Horses:** Exactly 20 generated on app load and replaced together with the schedule on **Regenerate**. Static during an active race session.
  - `id: number` (1-20)
  - `name: string` (unique)
  - `color: string` (20 visually distinct hex/HSL colors)
  - `condition: number` (integer 1-100, static for the entire session)
- **Schedule:** 6 rounds with fixed distances: `[1200, 1400, 1600, 1800, 2000, 2200]` meters.
- **Participants:** Each round selects 10 unique random horses from the 20 (Fisher-Yates shuffle). Selection is independent per round; a horse can run multiple rounds.
- **Auto-Advance & Execution:**
  - Rounds run sequentially (Round 1 -> 6).
  - When all 10 horses cross the finish line of a round, the game transitions to `INTERSTITIAL`.
  - In `INTERSTITIAL`, a 5-second countdown timer runs with a progress indicator and next-round preview.
  - **Stop Auto-Advance:** User can click "Stop Auto-Advance", which cancels the countdown and sets state to `SCHEDULED` (Round N+1 ready, Start button enabled). The auto-advance bar stays visible in a stopped state with **Resume Auto-Advance** so the countdown can be re-enabled from where it stopped.
  - **Start Now:** User can click "Start Now", which skips the remaining countdown and immediately transitions to `RUNNING` for Round N+1.
  - If timer reaches 0s without interruption, it auto-advances to `RUNNING`.
- **Results:** Recorded per round in finish order immediately as each round completes, displayed sequentially in the Results panel.

## Simulation & Movement

- `requestAnimationFrame` loop with clamped `dt` (max 50ms) managed in `src/composables/useRaceLoop.ts`.
- Pure deterministic engine with seedable PRNG (`rng: () => number = Math.random`).
- Speed formula: `speed = BASE * (0.75 + condition / 400) * (1 + noise)`, where `noise ∈ [-VAR, +VAR]` is drawn per tick. Higher condition favors winning without making outcomes 100% static.
- **Track Movement:**
  - Horses move across 10 lanes from 0% to 100% of track width.
  - Use container queries on the lane: `transform: translateX(calc(var(--p) * (100cqi - 100%)))` with `container-type: inline-size`. Percentage-based transforms must not be relative to marker width.
  - Animate only `transform` (`will-change: transform`), never `left` or `margin-left`.
- **Finish Ordering:** Exact finish timestamp/overshoot interpolation (`finishTime = elapsedBefore + (distance - posBefore) / speed`). Ties broken deterministically by `id`.
- **Test Speed Multiplier:** Expose an optional `speedMultiplier` (default 1) to enable sub-second E2E race completion in Playwright.

## State Machine

| State          | Generate               | Start / Pause      | Interstitial Actions                                               | Notes                                           |
| :------------- | :--------------------- | :----------------- | :----------------------------------------------------------------- | :---------------------------------------------- |
| `IDLE`         | Enabled                | Disabled           | N/A                                                                | 20 horses generated, no schedule.               |
| `SCHEDULED`    | Enabled                | **Start** Enabled  | N/A                                                                | Schedule generated, active round ready.         |
| `RUNNING`      | Disabled               | **Pause** Enabled  | N/A                                                                | Active round animating.                         |
| `PAUSED`       | Enabled                | **Resume** Enabled | N/A                                                                | Animation frozen, `dt` reset cleanly on resume. |
| `INTERSTITIAL` | Disabled               | Disabled           | **Stop Auto-Advance** -> `SCHEDULED`<br>**Start Now** -> `RUNNING` | 5s countdown active between rounds.             |
| `FINISHED`     | Enabled                | Disabled           | N/A                                                                | All 6 rounds complete. Results displayed.       |

## UI & Responsive Layout (Mobile-First)

The UI uses standard Tailwind CSS flexbox and grid utilities without absolute positioning hacks:

- **Global Container & Page Padding**:
  - Main view wrapped in a responsive centered container: `container mx-auto px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 max-w-7xl`.
  - Content must never sit flush against the browser viewport edges (`left: 0`).
- **Mobile (`< 768px`)**: Single-column vertical flex stack (`flex flex-col gap-4`).
  - Top bar with compact logo and actions.
  - `Round Leader Banner` directly below header while a round is underway.
  - Segmented tab navigation (`Track` | `Horses` | `Program` | `Results`).
  - Single viewport: the page itself does not scroll; the active tab, roster, track, program, and results scroll internally.
  - 10-lane race track in compact mode (lane number + marker).
  - Clean alert banner when auto-advance interstitial is active.
- **Tablet (`768px - 1023px`)**: 12-column grid (`grid grid-cols-12 gap-6`).
  - Track stage spans 12 columns.
  - Horse list (4 cols) and tabbed Program/Results (8 cols) side-by-side below track.
- **Desktop (`>= 1024px`)**: 12-column 3-column layout (`grid grid-cols-12 gap-6`).
  - Left panel: Horse List (3 cols).
  - Center stage: Auto-advance alert + Track (6 cols).
  - Right panel: Tabbed Program and Results tables (3 cols).

## Accessibility & Edge Cases

- Rapid clicks on Generate/Start cannot spawn duplicate rAF loops (enforced in both store action and composable `rafId` check).
- Switching browser tabs or losing window focus pauses cleanly (`useDocumentVisibility` + `useWindowFocus`) and clamps `dt` to 50ms maximum.
- Controls are native `<button>` elements with accessible names matching visible labels.
- Screen readers receive live round updates via an `aria-live="polite"` region.
- `usePreferredReducedMotion()` honors `prefers-reduced-motion` with simplified track fill and stepped countdown visuals.
