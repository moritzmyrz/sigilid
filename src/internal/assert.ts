export function assertLength(length: number): void {
  if (!Number.isInteger(length) || length < 1 || length > 255) {
    throw new RangeError(`length must be 1–255, got ${length}`);
  }
}

export function assertPrefix(prefix: string): void {
  if (typeof prefix !== "string" || prefix.length === 0) {
    throw new TypeError("prefix must be a non-empty string");
  }
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(prefix)) {
    throw new TypeError("prefix must start with a letter and contain only alphanumeric characters");
  }
}
