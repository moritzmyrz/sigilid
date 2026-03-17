import { generateFromAlphabet, validateAlphabetString } from "./internal/alphabet.js";
import { assertLength } from "./internal/assert.js";
import { randomBytes } from "./internal/random.js";

const DEFAULT_LENGTH = 21;

/**
 * Validates a custom alphabet string.
 *
 * Throws if the alphabet:
 * - is not a string
 * - has fewer than 2 characters
 * - has more than 256 characters
 * - contains duplicate characters
 *
 * @example
 * import { validateAlphabet } from "sigilid/alphabet";
 * validateAlphabet("abc123"); // ok
 * validateAlphabet("aab");    // throws: duplicate character
 */
export function validateAlphabet(alphabet: string): void {
  validateAlphabetString(alphabet);
}

/**
 * Creates a secure ID generator bound to a custom alphabet.
 *
 * The alphabet is validated once at creation time. The returned object
 * has a single `generate(length?)` method.
 *
 * @param alphabet - A string of unique characters to draw from.
 * @returns An object with a `generate(length?: number): string` method.
 *
 * @example
 * import { createAlphabet } from "sigilid/alphabet";
 * const hex = createAlphabet("0123456789abcdef");
 * hex.generate(32); // "3f2a8c1d..." (32 hex characters)
 */
export function createAlphabet(alphabet: string): { generate(length?: number): string } {
  validateAlphabetString(alphabet);
  return {
    generate(length: number = DEFAULT_LENGTH): string {
      assertLength(length);
      return generateFromAlphabet(alphabet, length, randomBytes);
    },
  };
}
