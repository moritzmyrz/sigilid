import { assertLength } from "./internal/assert.js";
import { generateDefault } from "./internal/generate.js";

/** @deprecated Import from "sigilid/constants" instead. */
export { DEFAULT_ALPHABET } from "./constants.js";

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
