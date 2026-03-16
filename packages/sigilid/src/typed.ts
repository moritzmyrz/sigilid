import { generateFromAlphabet } from "./internal/alphabet.js";
import { assertLength, assertPrefix } from "./internal/assert.js";
import { DEFAULT_ALPHABET } from "./internal/constants.js";
import { randomBytes } from "./internal/random.js";

const DEFAULT_LENGTH = 21;
const SEPARATOR = "_";

/**
 * A nominal type brand. Attach this to a string type to create a distinct
 * branded string that is not assignable from plain `string`.
 *
 * @example
 * type UserId = Brand<string, "UserId">;
 */
export type Brand<T, B> = T & { readonly __brand: B };

/**
 * A branded string type for an entity named `T`.
 * Equivalent to `Brand<string, T>`, but more ergonomic for ID types.
 *
 * @example
 * type UserId = IdOf<"User">;
 * type PostId = IdOf<"Post">;
 */
export type IdOf<T extends string> = Brand<string, T>;

/**
 * Casts a plain string to a branded `IdOf<T>`.
 *
 * This is a type-only operation at runtime — no validation is performed.
 * Use `assertValidId` from `"sigilid/validate"` first if you need runtime safety.
 *
 * @example
 * import { castId } from "sigilid/typed";
 * const id = castId<"User">("usr_abc123");
 */
export function castId<T extends string>(value: string): IdOf<T> {
  return value as IdOf<T>;
}

/**
 * Returns a factory function that generates cryptographically secure branded IDs.
 *
 * The type parameter `T` sets the brand. If a prefix is provided, the format
 * is `{prefix}_{id}`, otherwise it is a plain random string.
 *
 * Validation happens at factory creation, not per-call.
 *
 * @param prefix - Optional alphanumeric prefix.
 * @param length - Length of the random portion (1–255). Defaults to 21.
 * @returns A zero-argument function returning `IdOf<T>`.
 *
 * @example
 * import { createTypedGenerator } from "sigilid/typed";
 * const userId = createTypedGenerator<"User">("usr");
 * const id = userId(); // IdOf<"User"> = "usr_K7gkJ_q3vR2nL8xH5eM0w"
 */
export function createTypedGenerator<T extends string>(
  prefix?: string,
  length: number = DEFAULT_LENGTH,
): () => IdOf<T> {
  if (prefix !== undefined) assertPrefix(prefix);
  assertLength(length);

  return (): IdOf<T> => {
    const raw = generateFromAlphabet(DEFAULT_ALPHABET, length, randomBytes);
    const value = prefix !== undefined ? `${prefix}${SEPARATOR}${raw}` : raw;
    return value as IdOf<T>;
  };
}
