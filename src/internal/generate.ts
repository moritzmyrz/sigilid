import { DEFAULT_ALPHABET } from "./constants.js";

// Specialized fast path for DEFAULT_ALPHABET (64 chars, power of 2).
// mask is always 63, so byte & 63 is always in range — no rejection sampling needed.
export function generateDefault(length: number): string {
  return Array.from(
    crypto.getRandomValues(new Uint8Array(length)),
    (b) => DEFAULT_ALPHABET[b & 63] as string,
  ).join("");
}
