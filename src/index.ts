import { assertLength } from "./internal/assert.js";
import { DEFAULT_ALPHABET } from "./internal/constants.js";
import { generateDefault } from "./internal/generate.js";

export { DEFAULT_ALPHABET };

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
export function generateId(length = 21): string {
  assertLength(length);
  return generateDefault(length);
}
