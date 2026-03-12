# Changesets

This directory manages releases for the `sigilid` monorepo.

## Creating a changeset

When your PR includes a change that should bump the `sigilid` package version,
run the following from the repo root and follow the prompts:

```bash
npx changeset
```

Select `sigilid`, choose the bump type (`patch` / `minor` / `major`), and
write a short description of the change. Commit the generated file alongside
your code changes.

## Releasing

When merged to `main`, a maintainer runs:

```bash
npx changeset version   # bumps versions and updates CHANGELOG.md
git commit -am "chore: version packages"
git push
```

Then create a GitHub Release for the new tag to trigger the publish workflow.

## When not to add a changeset

- Docs-only changes
- Changes to `apps/playground` or `benchmarks/core`
- CI/tooling changes that do not affect the published package
