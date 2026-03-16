import { DEFAULT_ALPHABET } from "./internal/constants.js";
import type { ValidationOptions } from "./internal/validation.js";
import { isValidIdValue } from "./internal/validation.js";

export type { ValidationOptions };

/**
 * Returns `true` if `value` is a valid ID, `false` otherwise.
 *
 * By default, validates that the value is a non-empty string of characters
 * from the default URL-safe alphabet. Options can constrain length, prefix,
 * and alphabet.
 *
 * @example
 * import { isValidId } from "sigilid/validate";
 * isValidId("K7gkJ_q3vR2nL8xH5eM0w"); // true
 * isValidId("usr_K7gkJ_q3vR2nL8xH5eM0w", { prefix: "usr" }); // true
 * isValidId("", {}); // false
 */
export function isValidId(value: string, options: ValidationOptions = {}): boolean {
  const opts = { alphabet: DEFAULT_ALPHABET, ...options };
  return isValidIdValue(value, opts);
}

/**
 * Throws a `TypeError` if `value` is not a valid ID.
 *
 * Useful for asserting IDs at API boundaries.
 *
 * @example
 * import { assertValidId } from "sigilid/validate";
 * assertValidId(req.params.id); // throws if invalid
 */
export function assertValidId(value: string, options: ValidationOptions = {}): void {
  if (!isValidId(value, options)) {
    throw new TypeError(`Invalid ID: "${value}"`);
  }
}

/**
 * Parses and returns the ID if valid, otherwise throws.
 *
 * A convenience wrapper over `assertValidId` for use in pipelines where
 * you want the validated value back from the same call.
 *
 * @example
 * import { parseId } from "sigilid/validate";
 * const id = parseId(rawInput); // throws if invalid, returns the same string if valid
 */
export function parseId(value: string, options: ValidationOptions = {}): string {
  assertValidId(value, options);
  return value;
}
