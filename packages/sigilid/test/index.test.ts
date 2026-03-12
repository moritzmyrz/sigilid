import { describe, expect, it } from "vitest";
import { DEFAULT_ALPHABET, generateId } from "../src/index.js";

describe("generateId", () => {
  it("returns a string of the default length (21)", () => {
    expect(generateId()).toHaveLength(21);
  });

  it("returns a string of the requested length", () => {
    expect(generateId(10)).toHaveLength(10);
    expect(generateId(50)).toHaveLength(50);
  });

  it("uses only characters from DEFAULT_ALPHABET", () => {
    const alphabetSet = new Set(DEFAULT_ALPHABET);
    const id = generateId(100);
    for (const char of id) {
      expect(alphabetSet.has(char)).toBe(true);
    }
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 1000 }, () => generateId()));
    expect(ids.size).toBe(1000);
  });

  it("throws RangeError for length 0", () => {
    expect(() => generateId(0)).toThrow(RangeError);
  });

  it("throws RangeError for negative length", () => {
    expect(() => generateId(-1)).toThrow(RangeError);
  });

  it("throws RangeError for length > 255", () => {
    expect(() => generateId(256)).toThrow(RangeError);
  });

  it("throws RangeError for non-integer length", () => {
    expect(() => generateId(1.5)).toThrow(RangeError);
  });

  it("accepts boundary length values 1 and 255", () => {
    expect(generateId(1)).toHaveLength(1);
    expect(generateId(255)).toHaveLength(255);
  });
});

describe("DEFAULT_ALPHABET", () => {
  it("is a 64-character string", () => {
    expect(DEFAULT_ALPHABET).toHaveLength(64);
  });

  it("contains no duplicate characters", () => {
    const unique = new Set(DEFAULT_ALPHABET);
    expect(unique.size).toBe(DEFAULT_ALPHABET.length);
  });

  it("is URL-safe (no characters requiring percent-encoding)", () => {
    // RFC 3986 unreserved characters: A-Z a-z 0-9 - _ . ~
    // Our alphabet uses A-Z a-z 0-9 _ -, all unreserved.
    expect(DEFAULT_ALPHABET).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
