import { describe, expect, it } from "vitest";
import { generateId } from "../src/index.js";
import { assertValidId, isValidId, parseId } from "../src/validate.js";

describe("isValidId", () => {
  it("returns true for a valid generated ID", () => {
    expect(isValidId(generateId())).toBe(true);
  });

  it("returns false for an empty string", () => {
    expect(isValidId("")).toBe(false);
  });

  it("returns false for a string with characters outside the default alphabet", () => {
    expect(isValidId("hello world!")).toBe(false);
    expect(isValidId("abc/def")).toBe(false);
  });

  it("returns true for a generated ID with correct length constraint", () => {
    const id = generateId(10);
    expect(isValidId(id, { length: 10 })).toBe(true);
  });

  it("returns false when length does not match", () => {
    const id = generateId(10);
    expect(isValidId(id, { length: 21 })).toBe(false);
  });

  it("returns true for a prefixed ID with matching prefix option", () => {
    expect(isValidId("usr_K7gkJq3vR2nL8xH5eM0w", { prefix: "usr" })).toBe(true);
  });

  it("returns false for a prefixed ID with wrong prefix", () => {
    expect(isValidId("usr_abc123", { prefix: "doc" })).toBe(false);
  });

  it("returns false for a prefixed ID when prefix option is missing the separator", () => {
    expect(isValidId("usrabc123", { prefix: "usr" })).toBe(false);
  });

  it("returns true with a custom alphabet that matches", () => {
    expect(isValidId("abc", { alphabet: "abcdef" })).toBe(true);
  });

  it("returns false with a custom alphabet that does not match", () => {
    expect(isValidId("xyz", { alphabet: "abcdef" })).toBe(false);
  });

  it("returns false for prefix option with empty ID portion", () => {
    expect(isValidId("usr_", { prefix: "usr" })).toBe(false);
  });

  it("throws TypeError when alphabet option is an empty string", () => {
    expect(() => isValidId("abc", { alphabet: "" })).toThrow(TypeError);
  });
});

describe("assertValidId", () => {
  it("does not throw for a valid ID", () => {
    expect(() => assertValidId(generateId())).not.toThrow();
  });

  it("throws TypeError for an invalid ID", () => {
    expect(() => assertValidId("")).toThrow(TypeError);
    expect(() => assertValidId("bad id!")).toThrow(TypeError);
  });

  it("throws TypeError when prefix does not match", () => {
    expect(() => assertValidId("usr_abc", { prefix: "doc" })).toThrow(TypeError);
  });
});

describe("parseId", () => {
  it("returns the same string for a valid ID", () => {
    const id = generateId();
    expect(parseId(id)).toBe(id);
  });

  it("throws for an invalid ID", () => {
    expect(() => parseId("!!!")).toThrow(TypeError);
  });

  it("works with prefix validation", () => {
    const id = "usr_K7gkJq3vR2nL8xH5eM0w";
    expect(parseId(id, { prefix: "usr" })).toBe(id);
  });
});
