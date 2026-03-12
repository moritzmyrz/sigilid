// Returns a Uint8Array of `count` cryptographically secure random bytes.
// Works in Node 18+, all modern browsers, and edge runtimes that expose `crypto`.
export function randomBytes(count: number): Uint8Array {
  const bytes = new Uint8Array(count);
  crypto.getRandomValues(bytes);
  return bytes;
}
