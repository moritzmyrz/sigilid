# Architecture

This document covers the structural decisions behind `sigilid` and the constraints contributors should keep in mind.

## Why a monorepo?

The repository hosts one published package (`packages/sigilid`), a local playground app, and a benchmark workspace. A monorepo makes it natural to iterate across all of these together without the overhead of multiple repositories or published cross-dependencies.

The root workspace is intentionally minimal: it holds shared tooling config (`tsconfig.base.json`, `biome.json`) and workspace-level scripts that delegate to the package.

## Why only one published package?

`sigilid` v1 ships a single package with multiple subpath exports rather than splitting features into separate packages. This keeps installation simple (`npm install sigilid`) while still giving bundlers enough granularity to tree-shake aggressively. A monorepo with one published package is easier to maintain, version, and reason about than a multi-package setup at this stage.

## Package structure

```
packages/sigilid/src/
├── index.ts          ← root entrypoint, secure randomness only
├── non-secure.ts     ← Math.random-based generation
├── prefix.ts         ← prefixed ID helpers
├── typed.ts          ← TypeScript brand types and typed generators
├── validate.ts       ← validation helpers
├── alphabet.ts       ← custom alphabet factory
└── internal/
    ├── assert.ts     ← shared input validation guards
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
- `.cjs` (CommonJS)
- `.d.ts` + `.d.ts.map` (TypeScript declarations)

The `exports` field in `package.json` maps each subpath to the correct files for each module resolution condition. The `types` condition comes first so TypeScript resolution works correctly in both `bundler` and `node16` module modes.

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
