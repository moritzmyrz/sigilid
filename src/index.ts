import { generateFromAlphabet } from "./internal/alphabet.js";
import { assertLength } from "./internal/assert.js";
import { DEFAULT_ALPHABET } from "./internal/constants.js";
import { randomBytes } from "./internal/random.js";

export { DEFAULT_ALPHABET };

const DEFAULT_LENGTH = 21;

/**
 * Generates a cryptographically secure random ID.
 *
 * @param length - Number of characters (1–255). Defaults to 21.
 * @returns A random URL-safe string of the requested length.
 *
 * @example
 * import { generateId } from "sigilid";
 * const id = generateId(); // "K7gkJ_q3vR2nL8xH5eM0w"
 */
export function generateId(length: number = DEFAULT_LENGTH): string {
  assertLength(length);
  return generateFromAlphabet(DEFAULT_ALPHABET, length, randomBytes);
}
