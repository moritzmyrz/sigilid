# sigilid

**A tiny, tree-shakeable ID toolkit for TypeScript apps.**

[![CI](https://github.com/moritzmyrz/sigilid/actions/workflows/ci.yml/badge.svg)](https://github.com/moritzmyrz/sigilid/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/sigilid)](https://www.npmjs.com/package/sigilid)
[![bundle size](https://img.shields.io/bundlephobia/minzip/sigilid)](https://bundlephobia.com/package/sigilid)
[![install size](https://packagephobia.com/badge?p=sigilid)](https://packagephobia.com/result?p=sigilid)
[![license](https://img.shields.io/npm/l/sigilid)](./LICENSE)

Zero runtime dependencies. ESM-first with CJS compatibility. Strong TypeScript support.

```ts
import { generateId } from "sigilid";
generateId(); // "K7gkJ_q3vR2nL8xH5eM0w"
```

For full documentation, see the [repository README](https://github.com/moritzmyrz/sigilid#readme).

## Install

```bash
npm install sigilid
```

## Subpath exports

| Import               | Description                 |
| -------------------- | --------------------------- |
| `sigilid`            | Secure random ID generator  |
| `sigilid/non-secure` | Math.random-based generator |
| `sigilid/prefix`     | Prefixed IDs (`usr_abc123`) |
| `sigilid/typed`      | Branded TypeScript ID types |
| `sigilid/validate`   | Validation helpers          |
| `sigilid/alphabet`   | Custom alphabet factory     |

## License

MIT
