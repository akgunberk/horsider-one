# Verification and tests

## Gate

Tiered; logic lives in `scripts/verify.ts` (deterministic, not agent judgment). Output is quiet: one line per step, full output only on failure.

| Command | When | Runs |
|---|---|---|
| `pnpm verify:changed` | While working | `vue-tsc --build`, `eslint` + `vitest related` on files changed vs merge-base with `main` (committed + uncommitted + untracked). Empty diff (e.g. on `main`) → full fast tier. |
| `pnpm verify:staged` | Pre-commit hook (`.githooks/pre-commit`) | Blocks direct commits on `main`, then runs `structure`, `vue-tsc --build`, `eslint`, and `vitest related` on staged files only. |
| `pnpm verify` | CI, manual | Full fast tier: `structure`, `vue-tsc --build`, `eslint .`, all unit tests. |
| `pnpm verify:handoff` | Before completing a task | `verify` + path-triggered heavy tiers (below). |

Additional enforced gates:

- `.githooks/commit-msg` enforces Conventional Commits (`type(scope): summary`, allowing Git `Merge`/`Revert`/`fixup!`/`squash!` subjects).
- `eslint.config.ts` enforces layer boundaries (`src/types/` leaf-only, `src/lib/` pure TS + no raw `Math.random()`, `src/stores/` no components/composables, `src/composables/` no components) and Storybook lint rules.
- `scripts/verify.ts` (`structure` step) enforces a flat `src/composables/` directory and forbids barrel `index.ts` files in `src/composables/` and `src/components/{race,layout}/`.

Path rules:

- Docs/markdown-only (`*.md`, `docs/`, `.agents/`, etc.) → skipped.
- `src/**`, `e2e/**` → scoped lint + related unit tests.
- Anything else (config, lockfile, `package.json`, tsconfig, `.storybook/`, `scripts/`) → full fast tier; `handoff` also runs all heavy tiers.
- Heavy tiers (`handoff` only): storybook when `*.stories.ts` or non-`ui/` components change; e2e (Chromium only locally) when `src/components/`, `src/stores/`, `src/App.vue`, `src/style.css`, `index.html`, or `e2e/` change.
- CI (`.github/workflows/ci.yml`) runs everything, including coverage, storybook, and e2e on all browsers.

The hook is installed by `pnpm install` (`prepare` sets `core.hooksPath`). `VERIFY_BASE=<ref>` overrides the diff base.

`pnpm lint` (oxlint + eslint with `--fix`) is for local cleanup, not verification.

## Unit tests

- Vitest specs are co-located with their component: `Component/Component.spec.ts`.
- Domain specs live next to the module: `src/lib/race.spec.ts`, `src/stores/race.spec.ts`.
- The app smoke test lives at `src/App.spec.ts`.
- Deterministic RNG helpers live in `src/test/rng.ts` (`sequenceRng`, `seededRng`).
- `src/test/setup.ts` provides the jsdom `matchMedia` stub used by VueUse.
- Pass a fixed `rng` to code under test; never depend on `Math.random`.
- Test simulation boundaries (finish interpolation, finish order, delta-time clamp, state transitions) and generation invariants (20 unique horses, conditions 1–100, six rounds × 10 participants), not animation frames.
- Run in watch mode with `pnpm test:unit`, or once with `pnpm exec vitest run --project=unit`.

## Coverage

- `pnpm test:coverage` runs the unit project with V8 coverage and enforces 85% thresholds.
- Reports: `text`, `html` (`coverage/index.html`), and `lcov`.
- Excluded: shadcn-vue `ui/**`, stories, mock data, shared types, `src/test/**`, and `src/main.ts`.
- Add or extend a co-located spec when touching app-owned components or data.

## Storybook interaction tests

- Every story file is also a test. Use `play` functions with `expect`, `userEvent`, and `within` from `storybook/test`.
- Cover meaningful interactions (tab switches, disclosures, action buttons) and assert accessible roles. Blocking `axe` checks (`a11y.test: 'error'`) run on every story.
- Run headless in Chromium with `pnpm test:storybook`.
- Interaction tests are not part of `pnpm verify`/`verify:changed` so the inner loop stays fast; `verify:handoff` and CI run them when component/story files change.
- Explore locally with `pnpm storybook`.

## Visual tests (Chromatic)

- Storybook stories are snapshotted in Chromatic's cloud browsers (Chrome), so rendering is identical for macOS and Linux developers and no local browser install is needed.
- CI (`.github/workflows/ci.yml`, `visual` job) runs on pull requests and on `push: main`:
  - PRs: `exitZeroOnChanges: false` — the check fails on any pixel diff until a human approves the build in Chromatic.
  - `main`: `autoAcceptChanges: true` — a merged change becomes the new baseline automatically, so baselines never live in git and cannot conflict.
  - `onlyChanged: true` (TurboSnap) only snapshots stories affected by the diff.
- Secret: `CHROMATIC_PROJECT_TOKEN` (repo settings → secrets → Actions). Fork PRs are skipped because secrets are unavailable to them.
- Approval flow: open the PR → click the failed `UI Tests` check (or the Chromatic comment) → review the diff → Accept → re-run the check. The Chromatic build log records who approved what; use that for blame when a visual regression ships.
- Snapshots are opt-out: `parameters.chromatic.disableSnapshot = true` on kitchen-sink/noisy stories (`Overview/Component Library`). Do the same for any story that depends on timers or randomness.
- Fonts are self-hosted via `@fontsource-variable/*`; keep it that way so snapshots never wait on a network font.
- Local validation: `pnpm build-storybook` then `CHROMATIC_PROJECT_TOKEN=… pnpm test:visual`. This publishes a build to Chromatic, so use it sparingly; `pnpm test:storybook` covers interaction tests locally and is what `verify:handoff` runs.
- To make the check blocking, add the `visual` job to the `main` branch protection rules.

## E2E

`pnpm verify:handoff` runs Chromium e2e automatically for changes to `src/components/`, `src/stores/`, `src/App.vue`, or any user-visible flow. Run `pnpm test:e2e` directly to debug or cover all browsers. Playwright tests live in `e2e/` and cover Chromium, Firefox, and WebKit.

Use `/?speed=120` to accelerate the full six-round race. Assert state through `[data-phase="FINISHED"]` rather than fixed delays.
