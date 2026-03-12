import { describe, expect, it } from "vitest";
import { createPrefixedGenerator, generatePrefixedId } from "../src/prefix.js";

describe("generatePrefixedId", () => {
  it("returns a string in the format {prefix}_{id}", () => {
    const id = generatePrefixedId("usr");
    expect(id).toMatch(/^usr_[A-Za-z0-9_-]{21}$/);
  });

  it("uses the provided length for the random portion", () => {
    const id = generatePrefixedId("usr", 10);
    expect(id).toBe(`usr_${id.slice(4)}`);
    expect(id.slice(4)).toHaveLength(10);
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 500 }, () => generatePrefixedId("x")));
    expect(ids.size).toBe(500);
  });

  it("throws TypeError for empty prefix", () => {
    expect(() => generatePrefixedId("")).toThrow(TypeError);
  });

  it("throws TypeError for prefix starting with a digit", () => {
    expect(() => generatePrefixedId("1usr")).toThrow(TypeError);
  });

  it("throws TypeError for prefix with special characters", () => {
    expect(() => generatePrefixedId("usr!")).toThrow(TypeError);
  });

  it("throws TypeError for prefix with spaces", () => {
    expect(() => generatePrefixedId("my prefix")).toThrow(TypeError);
  });

  it("throws RangeError for invalid length", () => {
    expect(() => generatePrefixedId("usr", 0)).toThrow(RangeError);
    expect(() => generatePrefixedId("usr", 256)).toThrow(RangeError);
  });

  it("accepts multi-segment alphanumeric prefixes", () => {
    const id = generatePrefixedId("sessionToken");
    expect(id.startsWith("sessionToken_")).toBe(true);
  });
});

describe("createPrefixedGenerator", () => {
  it("returns a function that produces correctly formatted IDs", () => {
    const gen = createPrefixedGenerator("post");
    const id = gen();
    expect(id).toMatch(/^post_[A-Za-z0-9_-]{21}$/);
  });

  it("reuses the prefix on every call", () => {
    const gen = createPrefixedGenerator("doc");
    for (let i = 0; i < 10; i++) {
      expect(gen().startsWith("doc_")).toBe(true);
    }
  });

  it("throws at factory creation for invalid prefix", () => {
    expect(() => createPrefixedGenerator("")).toThrow(TypeError);
    expect(() => createPrefixedGenerator("123")).toThrow(TypeError);
  });

  it("throws at factory creation for invalid length", () => {
    expect(() => createPrefixedGenerator("x", 0)).toThrow(RangeError);
  });

  it("respects a custom length", () => {
    const gen = createPrefixedGenerator("item", 8);
    const id = gen();
    expect(id.slice("item_".length)).toHaveLength(8);
  });
});
