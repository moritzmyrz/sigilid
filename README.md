# sigilid

**A tiny, tree-shakeable ID toolkit for TypeScript apps.**

[![CI](https://github.com/moritzmyrz/sigilid/actions/workflows/ci.yml/badge.svg)](https://github.com/moritzmyrz/sigilid/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/sigilid)](https://www.npmjs.com/package/sigilid)
[![bundle size](https://img.shields.io/bundlephobia/minzip/sigilid)](https://bundlephobia.com/package/sigilid)
[![install size](https://packagephobia.com/badge?p=sigilid)](https://packagephobia.com/result?p=sigilid)
[![license](https://img.shields.io/npm/l/sigilid)](./LICENSE)

`sigilid` gives you a secure, URL-safe ID generator as a zero-dependency ESM-first package. The root import is intentionally minimal — extra utilities like prefixed IDs, typed IDs, and validation live in subpath exports so your bundler only pulls in what you actually use.

```ts
import { generateId } from "sigilid";

const id = generateId(); // "K7gkJ_q3vR2nL8xH5eM0w"
```

---

## Features

- **Cryptographically secure** — uses `crypto.getRandomValues`, not `Math.random`
- **URL-safe by default** — 64-character alphabet: `A-Z a-z 0-9 _ -`
- **Tree-shakeable** — subpath exports mean your bundle only includes what you import
- **Zero runtime dependencies** — no third-party code in production output
- **ESM-first with CJS compatibility** — works in modern Node, edge runtimes, and all major bundlers
- **Strong TypeScript support** — strict types, branded ID types, precise inference
- **Predictable behavior** — explicit errors on invalid input, no silent failures
- **One package, six entrypoints** — `install sigilid`, then import only what you need

---

## Install

```bash
npm install sigilid
```

```bash
pnpm add sigilid
```

```bash
yarn add sigilid
```

Node 20+ required. Works in all modern runtimes that expose the Web Crypto API (`globalThis.crypto`).

---

## Quick start

```ts
import { generateId } from "sigilid";

// Default: 21 URL-safe characters using crypto.getRandomValues
generateId();      // "K7gkJ_q3vR2nL8xH5eM0w"
generateId(12);    // "aX4_p9Qr2mNs"
```

---

## Why sigilid?

Most apps eventually need more than a plain random string. They need prefixed IDs to distinguish entity types in logs, branded TypeScript types to prevent mixing `userId` and `postId`, and validation helpers at API boundaries.

`sigilid` is a focused toolkit for exactly that. The root package is as lean as it gets. Everything optional is a subpath import.

---

## When to use the root import vs subpath exports

| If you need... | Import from... |
|---|---|
| A secure random URL-safe ID | `sigilid` |
| A non-crypto ID (tests, fixtures) | `sigilid/non-secure` |
| Prefixed IDs like `usr_abc123` | `sigilid/prefix` |
| Branded TypeScript ID types | `sigilid/typed` |
| Validation at API boundaries | `sigilid/validate` |
| IDs from a custom character set | `sigilid/alphabet` |

The root import has no dependency on any of the subpath modules. Importing only `sigilid` will not pull in prefix, validation, or alphabet code.

---

## API reference

### `sigilid` — secure root

```ts
import { generateId, DEFAULT_ALPHABET } from "sigilid";

generateId();     // 21-character secure ID
generateId(12);   // 12-character secure ID

console.log(DEFAULT_ALPHABET);
// "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-"
```

`generateId` throws a `RangeError` if `length` is outside the range 1–255 or is not an integer.

---

### `sigilid/non-secure` — Math.random-based

```ts
import { generateNonSecureId } from "sigilid/non-secure";

generateNonSecureId();    // 21-character ID using Math.random
generateNonSecureId(8);   // 8-character ID
```

**Not suitable for tokens, secrets, or session identifiers.** Use this only when you explicitly do not need cryptographic quality — for example, in test fixtures or non-sensitive local keys.

---

### `sigilid/prefix` — prefixed IDs

```ts
import { generatePrefixedId, createPrefixedGenerator } from "sigilid/prefix";

// One-off prefixed ID
generatePrefixedId("usr");        // "usr_K7gkJ_q3vR2nL8xH5eM0w"
generatePrefixedId("doc", 10);    // "doc_aX4p9Qr2mN"

// Factory for repeated use
const userId = createPrefixedGenerator("usr");
userId();  // "usr_K7gkJ_q3vR2nL8xH5eM0w"
userId();  // "usr_Xp9mN2qL5vR8nK3eJ7cHw"
```

Prefix rules:
- Must start with a letter
- Must contain only letters and digits
- Separator is always `_`

Throws `TypeError` for invalid prefixes. Throws `RangeError` for invalid lengths.

---

### `sigilid/typed` — branded TypeScript ID types

```ts
import { createTypedGenerator, castId } from "sigilid/typed";
import type { IdOf, Brand } from "sigilid/typed";

// Define typed generators for your entities
const userId  = createTypedGenerator<"User">("usr");
const postId  = createTypedGenerator<"Post">("post");

const uid = userId();  // IdOf<"User"> = "usr_K7gkJ_q3vR2nL8xH5eM0w"
const pid = postId();  // IdOf<"Post">

// TypeScript prevents mixing them up
function getUser(id: IdOf<"User">) { /* ... */ }
getUser(uid); // ✓
getUser(pid); // ✗ type error

// Cast an untyped string at a trust boundary
const fromDb = castId<"User">(row.user_id);

// Unprefixed typed ID
const tokenGen = createTypedGenerator<"Token">();
const token = tokenGen(); // IdOf<"Token">, no prefix
```

`Brand<T, B>` and `IdOf<T>` are pure type-level utilities — no runtime cost.

---

### `sigilid/validate` — validation helpers

```ts
import { isValidId, assertValidId, parseId } from "sigilid/validate";
import type { ValidationOptions } from "sigilid/validate";

// Boolean check
isValidId("K7gkJ_q3vR2nL8xH5eM0w");              // true
isValidId("bad id!");                              // false
isValidId("usr_K7gkJ_q3vR2nL8xH5eM0w", { prefix: "usr" }); // true
isValidId("abc123", { length: 6, alphabet: "abc123def456" }); // true

// Throws TypeError if invalid — good for API boundaries
assertValidId(req.params.id);
assertValidId(req.params.id, { prefix: "usr" });

// Returns the value if valid, throws if not — useful in pipelines
const id = parseId(rawInput);
const id = parseId(rawInput, { prefix: "usr", length: 21 });
```

`ValidationOptions`:

| Option | Type | Description |
|---|---|---|
| `length` | `number` | Expected length of the ID (or ID portion after prefix) |
| `prefix` | `string` | Expected prefix; separator `_` is assumed |
| `alphabet` | `string` | Characters the ID must be drawn from (defaults to `DEFAULT_ALPHABET`) |

---

### `sigilid/alphabet` — custom alphabets

```ts
import { createAlphabet, validateAlphabet } from "sigilid/alphabet";

// Validate first (optional — createAlphabet validates internally)
validateAlphabet("0123456789abcdef");

// Create a bound generator
const hex = createAlphabet("0123456789abcdef");
hex.generate();     // 21-character hex string
hex.generate(32);   // 32-character hex string

// Binary IDs (contrived, but works)
const binary = createAlphabet("01");
binary.generate(16); // "1010011001110101"
```

`createAlphabet` throws immediately if:
- the alphabet has fewer than 2 characters
- the alphabet has more than 256 characters
- the alphabet contains duplicate characters

`generate(length?)` uses rejection sampling to avoid modulo bias.

---

## Built for real TypeScript apps

### Branded types in practice

If you have multiple entity ID types in your codebase, the TypeScript compiler
can silently allow you to pass a `userId` where a `postId` is expected — both
are just `string`. Branded types close that gap.

```ts
import { createTypedGenerator } from "sigilid/typed";
import type { IdOf } from "sigilid/typed";

const newUserId = createTypedGenerator<"User">("usr");
const newPostId = createTypedGenerator<"Post">("post");

type UserId = IdOf<"User">;
type PostId = IdOf<"Post">;

// Your service functions now accept precise types
async function deletePost(postId: PostId) { /* ... */ }
async function getUser(userId: UserId) { /* ... */ }

const uid = newUserId();
const pid = newPostId();

deletePost(pid); // ✓
deletePost(uid); // ✗ Argument of type 'IdOf<"User">' is not assignable to 'IdOf<"Post">'
```

### Validation at the edge

```ts
import { parseId } from "sigilid/validate";

// In an Express/Hono/Fastify handler
app.get("/users/:id", (req, res) => {
  const id = parseId(req.params.id, { prefix: "usr" });
  // id is a plain string, validated — throws before reaching your service
});
```

### Tree-shaking

Because each subpath is a separate bundle with no cross-imports, bundlers like
Vite, esbuild, and webpack can eliminate unused entrypoints entirely. An app
that imports only `generateId` will not include any prefix, validation, or
alphabet code.

---

## Why not just use Nano ID?

Nano ID is excellent. If all you need is the smallest possible secure random
string generator, it may still be the right call — it has a longer track record
and an even smaller core.

`sigilid` is worth considering if:

- You want prefixed IDs and typed IDs in the same package
- You want validation helpers that know about your ID format
- You want stricter TypeScript ergonomics out of the box
- You want a single library that handles the full ID lifecycle

If you are already using Nano ID and are happy with it, there is no compelling
reason to switch just for the root `generateId` function — the behavior is
similar. The subpath ecosystem is where `sigilid` earns its place.

---

## Runtime and environment notes

`sigilid` uses `globalThis.crypto.getRandomValues`, which is available in:

- Node.js 20+ (stable, no flags required)
- All modern browsers
- Edge runtimes: Cloudflare Workers, Vercel Edge, Deno, Bun

If you are targeting an environment without Web Crypto, use `sigilid/non-secure`
with the understanding that `Math.random` is not cryptographically safe.

---

## Package exports

| Import | Entry file | Description |
|---|---|---|
| `sigilid` | `dist/index.js` | Secure root generator |
| `sigilid/non-secure` | `dist/non-secure.js` | Math.random-based generator |
| `sigilid/prefix` | `dist/prefix.js` | Prefixed ID helpers |
| `sigilid/typed` | `dist/typed.js` | Branded types and typed generators |
| `sigilid/validate` | `dist/validate.js` | Validation helpers |
| `sigilid/alphabet` | `dist/alphabet.js` | Custom alphabet factory |

All exports are available as ESM (`.js`) and CommonJS (`.cjs`) with TypeScript declarations (`.d.ts`).

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup
instructions, coding standards, and PR expectations.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for an explanation of the design
decisions and constraints contributors should keep in mind.

---

## Release and versioning

`sigilid` uses [Semantic Versioning](https://semver.org/). Breaking API changes
will bump the major version. Releases are managed with
[Changesets](https://github.com/changesets/changesets).

---

## License

MIT — see [LICENSE](./LICENSE).
