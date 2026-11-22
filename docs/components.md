# Vue components

- Use `<script setup lang="ts">`.
- Components are presentational: no simulation math, race-loop logic, or state-machine decisions.
- Keep each component under 150 lines. Extract sub-components before exceeding the limit.
- Read state and trigger actions through Pinia stores; put pure calculations in `src/lib/`.
- Put reusable lifecycle logic in [composables](composables.md); keep one-off logic component-scoped.
- **Folder per component**: `components/<area>/<kebab-name>/<PascalName>.vue`, with `*.stories.ts` and `*.spec.ts` co-located. See [architecture](architecture.md#components).
- **No barrels**: import SFCs and modules directly; never add or use `index.ts` re-export files for app components.
- **Mobile-First Layout**: Structure templates using standard Tailwind flexbox and grid classes (`flex flex-col` base on mobile, `md:grid md:grid-cols-12` on desktop).
  - Wrap application content in a centered container with generous responsive padding (`container mx-auto px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 max-w-7xl`). Content must never stick to `left: 0`.
  - Avoid absolute positioning for layout cards and panels.
  - **One viewport**: the app shell is `h-dvh overflow-hidden`; header is fixed-height, and columns/tabs own their scroll (`min-h-0` + `overflow-y-auto`). Never rely on page scroll.
  - Mobile tabs are `Track | Horses | Program | Results`; the Program tab replaces the removed rounds-schedule card.
- **Track Lanes**: Use CSS container queries (`@container` / `container-type: inline-size`) for horse positioning (`translateX(calc(var(--p) * (100cqi - 100%)))`).
