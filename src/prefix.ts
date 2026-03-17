import { assertLength, assertPrefix } from "./internal/assert.js";
import { generateDefault } from "./internal/generate.js";

/**
 * Generates a prefixed, cryptographically secure ID.
 *
 * The format is `{prefix}_{id}`, e.g. `usr_K7gkJ_q3vR2nL8xH5eM0w`.
 *
 * @param prefix - Alphanumeric prefix starting with a letter, e.g. `"usr"`.
 * @param length - Length of the random portion (1–255). Defaults to 21.
 * @returns A string in the form `{prefix}_{id}`.
 *
 * @example
 * import { generatePrefixedId } from "sigilid/prefix";
 * const userId = generatePrefixedId("usr"); // "usr_K7gkJ_q3vR2nL8xH5eM0w"
 */
export function generatePrefixedId(prefix: string, length = 21): string {
  assertPrefix(prefix);
  assertLength(length);
  return `${prefix}_${generateDefault(length)}`;
}

/**
 * Returns a factory function that generates prefixed IDs with fixed settings.
 *
 * Useful when you generate IDs for a specific entity type throughout your
 * codebase and want to avoid repeating the prefix at every call site.
 *
 * @param prefix - Alphanumeric prefix starting with a letter.
 * @param length - Length of the random portion. Defaults to 21.
 * @returns A zero-argument function that returns a new prefixed ID each call.
 *
 * @example
 * import { createPrefixedGenerator } from "sigilid/prefix";
 * const userId = createPrefixedGenerator("usr");
 * userId(); // "usr_K7gkJ_q3vR2nL8xH5eM0w"
 * userId(); // "usr_Xp9mN2qL5vR8nK3eJ7cHw"
 */
export function createPrefixedGenerator(prefix: string, length = 21): () => string {
  // Validate eagerly so callers get errors at factory creation, not later.
  assertPrefix(prefix);
  assertLength(length);
  return () => `${prefix}_${generateDefault(length)}`;
}
