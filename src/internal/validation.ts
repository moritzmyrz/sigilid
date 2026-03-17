export interface ValidationOptions {
  /** Expected exact length of the ID portion (excluding prefix and separator). */
  length?: number;
  /** Expected prefix. The separator `_` is assumed. */
  prefix?: string;
  /** Alphabet the ID characters must belong to. Defaults to DEFAULT_ALPHABET. */
  alphabet?: string;
}

export function isValidIdValue(value: string, options: ValidationOptions = {}): boolean {
  if (typeof value !== "string" || value.length === 0) return false;

  if (options.alphabet !== undefined && options.alphabet.length === 0) {
    throw new TypeError("alphabet option must not be empty");
  }

  let idPart = value;

  if (options.prefix !== undefined) {
    const expected = `${options.prefix}_`;
    if (!value.startsWith(expected)) return false;
    idPart = value.slice(expected.length);
  }

  if (options.length !== undefined && idPart.length !== options.length) return false;
  if (idPart.length === 0) return false;

  if (options.alphabet !== undefined) {
    const charSet = new Set(options.alphabet);
    for (const char of idPart) {
      if (!charSet.has(char)) return false;
    }
  }

  return true;
}
