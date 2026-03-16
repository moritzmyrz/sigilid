// Returns a Uint8Array of `count` cryptographically secure random bytes.
// Uses globalThis.crypto (Web Crypto API) — available in Node 20+,
// all modern browsers, Cloudflare Workers, Deno, and Bun.
export function randomBytes(count: number): Uint8Array {
  if (typeof globalThis.crypto?.getRandomValues !== "function") {
    throw new Error(
      "Web Crypto API (globalThis.crypto.getRandomValues) is not available in this runtime. " +
        "Use sigilid/non-secure if cryptographic quality is not required.",
    );
  }
  const bytes = new Uint8Array(count);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}
