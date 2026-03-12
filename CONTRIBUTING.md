# Contributing to sigilid

Thanks for considering a contribution. This document covers how to work on the project, what kinds of contributions are valuable, and the standards we hold the codebase to.

## Project philosophy

`sigilid` is a small, focused library. The goal is not to be the most feature-rich ID library — it is to be the most trustworthy one for TypeScript developers who care about bundle size, API clarity, and long-term maintenance.

That means:

- **Less is more.** A small, stable public surface is harder to misuse and easier to document.
- **Explicitness over convenience.** Subpath imports are more verbose but more intentional.
- **Zero surprises.** Behavior should be deterministic, documented, and predictable.
- **Docs are not optional.** A feature without documentation does not exist for most users.

## What kinds of contributions are valuable?

Things we are actively interested in:

- Bug fixes with a clear reproduction
- Documentation improvements (typos, clarity, missing examples)
- Test coverage gaps
- Tooling improvements (CI, build config, DX)
- New subpath exports that fit the scope and follow the design constraints

Things that need discussion first:

- New subpath exports (open an issue before writing code)
- Changes to the public API of existing entrypoints
- Adding runtime dependencies

Things that are unlikely to be accepted:

- Convenience re-exports from the root entrypoint
- Features that belong in application code, not a utility library
- Complexity that breaks the "junior developer can understand this" test

## Local setup

You will need Node.js 20 or later and npm 9 or later.

```bash
git clone https://github.com/moritzmyrz/sigilid.git
cd sigilid
npm install
```

Build the main package:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Lint and format:

```bash
npm run lint
npm run lint:fix
```

Typecheck:

```bash
npm run typecheck
```

## Workspace overview

```
sigilid/
├── packages/sigilid/   ← the only published package
├── apps/playground/    ← local integration demo (not published)
├── benchmarks/core/    ← local benchmarks (not published)
```

Most contributions will touch only `packages/sigilid/`.

The playground is useful for quickly verifying that imports work correctly after a change. Run it with:

```bash
cd apps/playground && npm run start
```

## Coding standards

- TypeScript throughout. No plain JS files in `packages/sigilid/src/`.
- Strict TypeScript config. Do not loosen the `tsconfig.json` settings.
- Biome handles formatting and linting. Run `npm run lint:fix` before committing.
- No runtime dependencies in `packages/sigilid`. If a proposed change requires one, that is a signal to reconsider the approach.
- Prefer explicit over implicit. Named exports only; no default exports.
- Keep functions small. If a function is doing more than one thing, split it.

## Testing expectations

- All public API functions must have tests.
- Tests live in `packages/sigilid/test/`, one file per entrypoint.
- Use Vitest. Keep tests deterministic.
- Do not write statistical collision tests that could flake under load.
- Edge cases (empty strings, zero lengths, invalid alphabets) should be tested explicitly.
- If you add a new public function, add tests before submitting.

## API design expectations

- Keep the public surface small and stable.
- Parameter order should be consistent with existing functions.
- Optional parameters should have sensible defaults.
- Functions should throw with descriptive messages on invalid input, never silently return garbage.
- Types should be precise but not opaque. A type that requires reading the source to understand is a problem.

## Bundle size and public surface discipline

Before adding to the public surface, ask:

1. Is this something a caller cannot reasonably implement themselves in two lines?
2. Will it be used by more than a handful of people?
3. Does it stay under the existing pattern of the entrypoint it belongs in?

Internal utilities go under `src/internal/`. They are not exported and not part of any promise to callers.

If you are not sure whether something belongs in `src/internal/` or as a public export, it probably belongs in `src/internal/`.

## Commit and PR expectations

- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `chore:`, `test:`, etc.
- Subject line: 50 characters or fewer, imperative mood.
- PR title should match the commit subject.
- One logical change per PR.
- Do not mix formatting changes with behavior changes.
- Include a changeset file if your change affects the published package. Run `npx changeset` to create one.

## Proposing new subpath exports

Open a GitHub issue first. Describe:

- What the export does
- Why it cannot live in an existing entrypoint
- Who the intended audience is
- Whether it requires any new dependencies

New subpath exports also require updates to:

- `packages/sigilid/package.json` (exports map)
- `packages/sigilid/tsup.config.ts` (build entry)
- `README.md` (API docs)
- `ARCHITECTURE.md` (if the structure changes)

## Leaking internals

Do not export anything from `src/internal/`. If a function in `src/internal/` looks useful to external callers, open an issue to discuss whether it should become a public export with proper API design — not just a quiet re-export.

## Documentation quality

Documentation matters as much as the code. If your change introduces new behavior or a new public API:

- Update `README.md` with a usage example
- Make sure the example compiles and runs correctly
- Keep language concise and practical

Docs that are out of sync with the code are bugs.

## Questions?

Open a GitHub issue. Label it `question`.
