import { describe, expect, it } from "vitest";
import { createAlphabet, validateAlphabet } from "../src/alphabet.js";

describe("validateAlphabet", () => {
  it("does not throw for a valid alphabet", () => {
    expect(() => validateAlphabet("abc123")).not.toThrow();
    expect(() => validateAlphabet("0123456789abcdef")).not.toThrow();
  });

  it("throws TypeError for a non-string input", () => {
    // @ts-expect-error intentional invalid input
    expect(() => validateAlphabet(123)).toThrow(TypeError);
  });

  it("throws RangeError for a single-character alphabet", () => {
    expect(() => validateAlphabet("a")).toThrow(RangeError);
  });

  it("throws TypeError for an alphabet with duplicate characters", () => {
    expect(() => validateAlphabet("aab")).toThrow(TypeError);
    expect(() => validateAlphabet("abcabc")).toThrow(TypeError);
  });

  it("accepts a 2-character alphabet (minimum valid)", () => {
    expect(() => validateAlphabet("01")).not.toThrow();
  });

  it("throws RangeError for an alphabet longer than 256 characters", () => {
    const longAlphabet = Array.from({ length: 257 }, (_, i) => String.fromCodePoint(i + 32)).join(
      "",
    );
    expect(() => validateAlphabet(longAlphabet)).toThrow(RangeError);
  });
});

describe("createAlphabet", () => {
  it("returns an object with a generate method", () => {
    const gen = createAlphabet("abc123");
    expect(typeof gen.generate).toBe("function");
  });

  it("generates an ID of the default length (21)", () => {
    const gen = createAlphabet("abc123");
    expect(gen.generate()).toHaveLength(21);
  });

  it("generates an ID of the requested length", () => {
    const gen = createAlphabet("abc123");
    expect(gen.generate(10)).toHaveLength(10);
    expect(gen.generate(50)).toHaveLength(50);
  });

  it("only uses characters from the provided alphabet", () => {
    const alphabet = "01";
    const gen = createAlphabet(alphabet);
    const id = gen.generate(100);
    expect(id).toMatch(/^[01]+$/);
  });

  it("generates IDs with a hex alphabet", () => {
    const hex = createAlphabet("0123456789abcdef");
    const id = hex.generate(32);
    expect(id).toHaveLength(32);
    expect(id).toMatch(/^[0-9a-f]+$/);
  });

  it("throws at creation for an invalid alphabet", () => {
    expect(() => createAlphabet("a")).toThrow(RangeError);
    expect(() => createAlphabet("aab")).toThrow(TypeError);
  });

  it("throws RangeError for invalid length in generate()", () => {
    const gen = createAlphabet("abc123");
    expect(() => gen.generate(0)).toThrow(RangeError);
    expect(() => gen.generate(256)).toThrow(RangeError);
  });

  it("generates unique IDs across calls", () => {
    const gen = createAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    const ids = new Set(Array.from({ length: 500 }, () => gen.generate()));
    expect(ids.size).toBe(500);
  });
});
