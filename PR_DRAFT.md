## Title

`feat: optimize shared bundle chunks`

## Description

## Summary

- Enable split ESM output in `tsup` so shared internals are emitted once across entrypoints.
- Refactor `typed` runtime to reuse `prefix` generator logic for prefixed IDs.
- Add a `sigilid/constants` subpath export and keep root `DEFAULT_ALPHABET` as a deprecated compatibility re-export.
- Rebaseline `size-limit` budgets and update README bundle/export docs.

## Test Plan

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npx size-limit`
