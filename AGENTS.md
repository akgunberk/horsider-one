# AGENTS.md

Horse-racing simulation game: 20 generated horses race 6 scheduled rounds on a Vue 3 + TypeScript + Pinia frontend.

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Essentials

- Package manager: **pnpm**. Node `^22.18.0 || >=24.12.0`.
- Commands: `pnpm dev`, `pnpm verify:changed`, `pnpm verify:handoff`, `pnpm verify`, `pnpm test:coverage`, `pnpm test:storybook`, `pnpm test:e2e`.
- While working: run `pnpm verify:changed` (scoped to diff vs `main`; skips docs-only changes). Work on feature branches.
- Before completing a task: run `pnpm verify:handoff` (full fast gate + path-triggered storybook/e2e). Don't run e2e/storybook manually unless debugging.
- Never bypass the pre-commit hook (`--no-verify`). CI is the authoritative full gate.
- Keep responses terse; omit filler.
- Domain behavior, auto-advance state machine, and edge cases: [SPEC.md](SPEC.md).

## Core Invariants

- `src/lib/` is pure TypeScript. Zero Vue or Pinia imports.
- Simulation math uses injected `rng: () => number`. Never call raw `Math.random()`.
- State transitions strictly enforced via Pinia actions. Action buttons use derived `computed()` getters.
- 60fps progress in store must use `shallowRef` to prevent deep reactive overhead.
- Mobile-first layouts: flexbox and CSS grid classes only. No absolute positioning hacks for layout containers.
- Never weaken `tsconfig` (`strict`, `noUncheckedIndexedAccess`).

## Composables

- Prefer VueUse (`@vueuse/core`) for commodity browser fundamentals already covered upstream: document visibility, window focus, media queries, reduced motion, element size, observers, storage. Do not reimplement or thin-wrap them; upstream tests and maintenance are the point.
- Write custom composables only for domain-specific orchestration (`useRaceLoop`, `useSpeedMultiplier`) or component-scoped behavior.
- No simulation math, race rules, or state-machine decisions in composables; those belong in `src/lib/` and stores.
- Keep `src/composables/` flat, named exports only, no barrel files.

## Detailed guidance

- [Architecture and boundaries](docs/architecture.md)
- [TypeScript and code style](docs/typescript.md)
- [Simulation and animation](docs/simulation.md)
- [Vue components](docs/components.md)
- [Vue composables](docs/composables.md)
- [Verification and tests](docs/testing.md)
