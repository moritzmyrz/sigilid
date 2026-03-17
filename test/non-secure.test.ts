import { describe, expect, it } from "vitest";
import { DEFAULT_ALPHABET } from "../src/index.js";
import { generateNonSecureId } from "../src/non-secure.js";

describe("generateNonSecureId", () => {
  it("returns a string of the default length (21)", () => {
    expect(generateNonSecureId()).toHaveLength(21);
  });

  it("returns a string of the requested length", () => {
    expect(generateNonSecureId(10)).toHaveLength(10);
    expect(generateNonSecureId(50)).toHaveLength(50);
  });

  it("uses only characters from DEFAULT_ALPHABET", () => {
    const alphabetSet = new Set(DEFAULT_ALPHABET);
    const id = generateNonSecureId(100);
    for (const char of id) {
      expect(alphabetSet.has(char)).toBe(true);
    }
  });

  it("throws RangeError for length 0", () => {
    expect(() => generateNonSecureId(0)).toThrow(RangeError);
  });

  it("throws RangeError for negative length", () => {
    expect(() => generateNonSecureId(-5)).toThrow(RangeError);
  });

  it("throws RangeError for length > 255", () => {
    expect(() => generateNonSecureId(256)).toThrow(RangeError);
  });

  it("throws RangeError for non-integer length", () => {
    expect(() => generateNonSecureId(2.9)).toThrow(RangeError);
  });

  it("accepts boundary length values 1 and 255", () => {
    expect(generateNonSecureId(1)).toHaveLength(1);
    expect(generateNonSecureId(255)).toHaveLength(255);
  });

  it("produces different values across calls (statistical sanity)", () => {
    const results = new Set(Array.from({ length: 100 }, () => generateNonSecureId()));
    // With 21-char strings from 64 chars, collision rate is negligible
    expect(results.size).toBeGreaterThan(90);
  });
});
