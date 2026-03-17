# Architecture

This document covers the structural decisions behind `sigilid` and the constraints contributors should keep in mind.

## Why a single-package repo?

`sigilid` is intentionally maintained as a single package in a single repository.
That keeps the contribution model simple: one `package.json`, one build config,
one test suite, and one release flow.

## Why only one published package?

`sigilid` v1 ships a single package with multiple subpath exports rather than splitting features into separate packages. This keeps installation simple (`npm install sigilid`) while still giving bundlers enough granularity to tree-shake aggressively.

## Package structure

```
src/
├── index.ts          ← root entrypoint, secure randomness only
├── native.ts         ← optional Node-only loader for native addon
├── non-secure.ts     ← Math.random-based generation
├── prefix.ts         ← prefixed ID helpers
├── typed.ts          ← TypeScript brand types and typed generators
├── validate.ts       ← validation helpers
├── alphabet.ts       ← custom alphabet factory
└── internal/
    ├── assert.ts     ← shared input validation guards
    ├── native.ts     ← Node runtime checks + native addon loading
    ├── random.ts     ← crypto.getRandomValues abstraction
    ├── alphabet.ts   ← alphabet string validation and character sampling
    └── validation.ts ← predicates shared by validate.ts
```

### Why the root entrypoint is intentionally minimal

`index.ts` exposes `generateId` and `DEFAULT_ALPHABET`. Nothing else. This is deliberate:

- Bundlers that only `import { generateId } from "sigilid"` pull in exactly one small function and its internal dependency on `crypto`.
- Optional features (prefixes, typed IDs, custom alphabets, validation) live in subpath exports. Importing them is explicit and intentional.
- The root import has no cross-subpath dependencies, so there is no risk of accidentally dragging in validation or prefix logic for users who only want a random ID.

### Why subpath exports instead of named exports from the root

A common pattern is `import { generatePrefixedId } from "sigilid"` from a single barrel. This is convenient but has two costs:

1. Bundlers that are not sophisticated about side-effect analysis may include code the caller never uses.
2. The public surface of the package becomes a flat list of everything, which is harder to document, version, and reason about.

Subpath exports make the intent explicit and the tradeoffs clear at the import statement level.

## Internal modules

Code under `src/internal/` is not part of the public API. It will never appear in the `exports` field of `package.json`. Public modules import from internal helpers; internal helpers do not import from public modules.

- `assert.ts`: throws `RangeError` or `TypeError` for invalid inputs (length out of range, empty prefix, etc.). Used by all entrypoints that accept user input.
- `random.ts`: wraps `crypto.getRandomValues` into a byte-generation function, used by `index.ts`, `prefix.ts`, `alphabet.ts`, and `typed.ts`.
- `alphabet.ts`: validates alphabet strings and performs character sampling via the rejection-sampling algorithm that avoids modulo bias.
- `validation.ts`: pure predicate functions used by `validate.ts`. No side effects, no throws.

## Build output

tsup builds all entrypoints in a single pass. Each entrypoint produces:
- `.js` (ESM)
- `.d.ts` (TypeScript declarations)

The `exports` field in `package.json` maps each subpath to the correct ESM file
and declaration file. The package is ESM-only.

### Optional native companion package

The `sigilid/native` subpath is intentionally separate from the default root path:

- Root `sigilid` stays pure JS and browser-safe.
- `sigilid/native` is Node-only and attempts to load `@sigilid/native-addon`.
- The companion addon can compile/install independently without forcing native toolchains on default users.
- The addon install flow is prebuild-friendly (`node-gyp-build` first, then source build fallback).

If the addon is unavailable, `sigilid/native` throws a clear runtime error with install guidance.

## Design constraints for contributors

**Do not add runtime dependencies unless the benefit is substantial and clearly documented.** Zero runtime dependencies is a strong signal of quality for a utility library.

**Do not re-export subpath features from the root.** The root import bundle size will grow, and users will lose the option to import only what they need.

**Internal helpers stay internal.** If a function is useful across modules, put it in `src/internal/`. Do not make it public.

**Keep the public surface small.** More exports means more API surface to support, document, and version. Fewer, more composable functions are better than many convenience wrappers.

**tsup config is intentionally verbose.** All entrypoints are listed explicitly so that adding a new subpath export requires a conscious, deliberate change across source, build config, exports map, and docs.

## Adding future features

Before adding a new subpath export, consider:

1. Is this useful to a meaningful number of callers?
2. Can it be implemented without new runtime dependencies?
3. Does it fit the "ID generation and handling" theme, or is it scope creep?
4. Can it be expressed as a thin wrapper over existing internal utilities?

If the answer to all four is yes, follow this checklist:

- Add the source file under `src/`
- Add internal helpers to `src/internal/` as needed
- Add the entry to `tsup.config.ts`
- Add the subpath to the `exports` field in `package.json`
- Add tests
- Add documentation in `README.md`
- Update this file if the architecture changes meaningfully
