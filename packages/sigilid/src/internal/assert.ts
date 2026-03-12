const MIN_LENGTH = 1;
const MAX_LENGTH = 255;

export function assertLength(length: number): void {
  if (!Number.isInteger(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new RangeError(
      `ID length must be an integer between ${MIN_LENGTH} and ${MAX_LENGTH}, got ${length}`,
    );
  }
}

export function assertPrefix(prefix: string): void {
  if (typeof prefix !== "string" || prefix.length === 0) {
    throw new TypeError("Prefix must be a non-empty string");
  }
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(prefix)) {
    throw new TypeError("Prefix must start with a letter and contain only letters and digits");
  }
}
