# Simulation and animation

- Animate with `requestAnimationFrame`; never use `setInterval`.
- Clamp frame delta time (max 50 ms) before applying it.
- Move horses with container query calculations (`transform: translateX(calc(var(--p) * (100cqi - 100%)))`). Never animate `left` or `margin-left`.
- Keep simulation logic in pure TypeScript files inside `src/lib/`; see [architecture](architecture.md).

## Randomness

- Every random operation accepts `rng: RngFn`. Do not call `Math.random()` inside domain helpers.
- `src/lib/random.ts` provides `randomInt` and `shuffle`.
- Generation order is deterministic: roster names → colors → conditions → six round draws. Tests pin outcomes with `sequenceRng` / `seededRng` from `src/test/rng.ts`.
- The Pinia store supplies `Math.random` only as the default action argument, so tests and stories can inject a seed.

## Engine

`src/lib/race.ts` is pure:

- `speed = BASE_SPEED × (0.75 + condition / 400) × (1 + noise)`, `noise ∈ [-0.08, 0.08]`.
- `stepRound(state, distance, dt, rng)` returns the next immutable state.
- Finish time is interpolated: `elapsed + remainingDistance / speed`.
- `finishOrder()` sorts by finish time, then horse id.
- `formatRaceTime()` renders `m:ss.ss`.

## Loop

`src/composables/useRaceLoop.ts` owns the browser lifecycle:

- single `requestAnimationFrame` loop (`rafId` guard),
- `dt` clamped to 50 ms, then multiplied by `?speed=` for E2E/demos,
- ticks only in `RUNNING` / `INTERSTITIAL`, stops otherwise,
- `useDocumentVisibility()` + `useWindowFocus()` stop the loop when the tab is hidden or the window loses focus.
- A running race moves to `PAUSED`; an interstitial countdown freezes and resumes from its remaining time on focus.
- `usePreferredReducedMotion()` in `App.vue` simplifies decorative motion (track fill / countdown animation); movement stays accessible.

The store owns all race rules: round completion, results, 5-second interstitial countdown, auto-advance, stop/resume auto-advance, start now, pause/resume, and generation guards. Lane progress is a `shallowRef`-backed state replaced each tick.

Race rules, finish-order semantics, auto-advance countdown, and edge cases are defined in [SPEC.md](../SPEC.md).
