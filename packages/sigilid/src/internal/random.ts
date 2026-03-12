// Returns a Uint8Array of `count` cryptographically secure random bytes.
// Uses globalThis.crypto (Web Crypto API) — available in Node 18.17+,
// all modern browsers, Cloudflare Workers, Deno, and Bun.
export function randomBytes(count: number): Uint8Array {
  const bytes = new Uint8Array(count);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}
