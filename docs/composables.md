# Vue composables

## Naming

- Prefix every composable file and function with `use` in camelCase (`useDebounce.ts`).
- Match the filename and primary export exactly: `useCart.ts` -> `export function useCart()`.
- Name by specific capability or domain (`useUserPermissions`). Never use generic names (`useHelpers`, `useUtils`, `useData`).

## Placement

- **Global/reusable:** `src/composables/`. Keep this directory flat.
- **Component-scoped:** co-locate as `src/components/<Component>/use<Logic>.ts` when only one component uses it.
- **Feature-scoped:** if feature folders are introduced, co-locate in `src/features/<feature>/composables/`.
- Move a component-scoped composable to `src/composables/` only when it is reused.

## Exports and imports

- Use named exports (`export function useX()`). No default exports.
- Do not create barrel files such as `src/composables/index.ts`. Import directly from the file path.
- No subdirectories inside `src/composables/`; the flat structure is intentional.
- This project uses explicit imports, not auto-imports.

## Boundaries

- Composables own reusable Vue/browser lifecycle logic (for example `useRaceLoop`, `useSpeedMultiplier`).
- **Prefer VueUse** for commodity fundamentals: `useDocumentVisibility`, `useWindowFocus`, `usePreferredReducedMotion`, `useElementSize`, `useMediaQuery`, storage, observers. Do not reimplement or wrap them in a custom composable.
- Write custom composables only for domain-specific orchestration or component-scoped behavior.
- Do not put simulation math, race rules, or state-machine decisions in composables. Those belong in `src/lib/` or `src/stores/`.
- Do not duplicate race state in a composable; read and mutate it through the store.
- See [architecture](architecture.md) for allowed dependencies.
