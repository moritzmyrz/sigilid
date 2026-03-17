export function validateAlphabetString(alphabet: string): void {
  if (typeof alphabet !== "string") throw new TypeError("alphabet must be a string");
  if (alphabet.length < 2) throw new RangeError("alphabet must have at least 2 characters");
  if (alphabet.length > 256) throw new RangeError("alphabet must have at most 256 characters");
  if (new Set(alphabet).size !== alphabet.length)
    throw new TypeError("alphabet has duplicate characters");
}

/**
 * Generates an ID of `length` characters drawn from `alphabet` using
 * rejection sampling to avoid modulo bias.
 *
 * The caller is responsible for providing valid `alphabet` and `length` values.
 * Use `validateAlphabetString` and `assertLength` before calling this.
 */
export function generateFromAlphabet(
  alphabet: string,
  length: number,
  getBytes: (count: number) => Uint8Array,
): string {
  const alphabetSize = alphabet.length;

  // Find the smallest bitmask >= alphabetSize to reduce rejection rate.
  let mask = 1;
  while (mask < alphabetSize) mask = (mask << 1) | 1;

  // Overshoot buffer size to reduce round-trips. Most cases complete in one pass.
  const bufferMultiplier = Math.ceil((1.6 * mask * length) / alphabetSize);
  let result = "";

  while (result.length < length) {
    const bytes = getBytes(bufferMultiplier);
    for (let i = 0; i < bytes.length && result.length < length; i++) {
      const byte = (bytes[i] as number) & mask;
      if (byte < alphabetSize) {
        result += alphabet[byte];
      }
    }
  }

  return result;
}
