# TypeScript and code style

- `strict: true` and `noUncheckedIndexedAccess` are enabled. Do not weaken tsconfig to make code compile.
- No `any` or `@ts-ignore`. Fix the type or narrow the value instead.
- Use non-null assertions (`!`) only after an explicit guard that TS cannot narrow.
  Never use `!` to silence an unknown value.
- Import from `src/` with the `@/*` alias.
- Prettier: no semicolons, single quotes, 100-character lines. Run `pnpm format` for `src/` changes.
- Comments: document non-obvious invariants only. Do not narrate syntax.
