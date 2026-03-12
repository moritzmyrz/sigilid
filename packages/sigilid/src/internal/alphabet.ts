const MIN_ALPHABET_SIZE = 2;
const MAX_ALPHABET_SIZE = 256;

export function validateAlphabetString(alphabet: string): void {
  if (typeof alphabet !== "string") {
    throw new TypeError("Alphabet must be a string");
  }
  if (alphabet.length < MIN_ALPHABET_SIZE) {
    throw new RangeError(
      `Alphabet must have at least ${MIN_ALPHABET_SIZE} characters, got ${alphabet.length}`,
    );
  }
  if (alphabet.length > MAX_ALPHABET_SIZE) {
    throw new RangeError(
      `Alphabet must have at most ${MAX_ALPHABET_SIZE} characters, got ${alphabet.length}`,
    );
  }
  const seen = new Set<string>();
  for (const char of alphabet) {
    if (seen.has(char)) {
      throw new TypeError(`Alphabet contains duplicate character: "${char}"`);
    }
    seen.add(char);
  }
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
