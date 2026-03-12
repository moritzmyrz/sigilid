import { DEFAULT_ALPHABET } from "./index.js";
import { assertLength } from "./internal/assert.js";

const DEFAULT_LENGTH = 21;

/**
 * Generates a non-cryptographic random ID using `Math.random`.
 *
 * **Not suitable for security-sensitive contexts** such as tokens, session
 * identifiers, or secrets. Use `generateId` from `"sigilid"` when in doubt.
 *
 * Useful for cases where performance matters more than entropy quality, such
 * as temporary keys in test fixtures or non-sensitive local identifiers.
 *
 * @param length - Number of characters (1–255). Defaults to 21.
 * @returns A random URL-safe string of the requested length.
 *
 * @example
 * import { generateNonSecureId } from "sigilid/non-secure";
 * const id = generateNonSecureId(); // "a5Fq2J8mXkR9vL3nP0eHw"
 */
export function generateNonSecureId(length: number = DEFAULT_LENGTH): string {
  assertLength(length);
  let result = "";
  const size = DEFAULT_ALPHABET.length;
  for (let i = 0; i < length; i++) {
    result += DEFAULT_ALPHABET[Math.floor(Math.random() * size)];
  }
  return result;
}
