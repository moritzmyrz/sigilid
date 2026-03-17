import { describe, expect, expectTypeOf, it } from "vitest";
import { castId, createTypedGenerator } from "../src/typed.js";
import type { IdOf } from "../src/typed.js";

describe("castId", () => {
  it("returns the same string value at runtime", () => {
    const raw = "usr_abc123";
    const id = castId<"User">(raw);
    expect(id).toBe(raw);
  });

  it("produces the correct branded type", () => {
    const id = castId<"Order">("ord_xyz");
    expectTypeOf(id).toMatchTypeOf<IdOf<"Order">>();
  });
});

describe("createTypedGenerator", () => {
  it("generates an ID with the correct prefix format", () => {
    const gen = createTypedGenerator<"User">("usr");
    const id = gen();
    expect(id).toMatch(/^usr_[A-Za-z0-9_-]{21}$/);
  });

  it("generates an unprefixed ID when no prefix is provided", () => {
    const gen = createTypedGenerator<"Token">();
    const id = gen();
    expect(id).toHaveLength(21);
    expect(id).toMatch(/^[A-Za-z0-9_-]{21}$/);
  });

  it("generates unique IDs", () => {
    const gen = createTypedGenerator<"Post">("post");
    const ids = new Set(Array.from({ length: 500 }, () => gen()));
    expect(ids.size).toBe(500);
  });

  it("produces a value with the branded type", () => {
    const gen = createTypedGenerator<"Product">("prod");
    const id = gen();
    expectTypeOf(id).toMatchTypeOf<IdOf<"Product">>();
  });

  it("throws at factory creation for invalid prefix", () => {
    expect(() => createTypedGenerator<"X">("")).toThrow(TypeError);
    expect(() => createTypedGenerator<"X">("1bad")).toThrow(TypeError);
  });

  it("throws at factory creation for invalid length", () => {
    expect(() => createTypedGenerator<"X">("x", 0)).toThrow(RangeError);
  });

  it("respects a custom length", () => {
    const gen = createTypedGenerator<"Short">("s", 8);
    const id = gen();
    expect(id.slice("s_".length)).toHaveLength(8);
  });
});
