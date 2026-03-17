// Uses globalThis.crypto (Web Crypto API) — Node 20+, all modern browsers,
// Cloudflare Workers, Deno, Bun. Will throw naturally if unavailable.
export function randomBytes(count: number): Uint8Array {
  const bytes = new Uint8Array(count);
  crypto.getRandomValues(bytes);
  return bytes;
}
