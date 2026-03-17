import { DEFAULT_ALPHABET } from "./constants.js";

// Specialized fast path for DEFAULT_ALPHABET (64 chars, power of 2).
// mask is always 63, so byte & 63 is always in range — no rejection sampling needed.
export function generateDefault(length: number): string {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < length; i++) id += DEFAULT_ALPHABET[(bytes[i] as number) & 63];
  return id;
}
