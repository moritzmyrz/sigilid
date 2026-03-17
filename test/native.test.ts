import { describe, expect, it } from "vitest";

import { isNodeRuntime, loadNativeAddon } from "../src/internal/native.js";
import { DEFAULT_ALPHABET, generateDefault, generateId } from "../src/native.js";

describe("sigilid/native", () => {
  it("generates IDs with the requested length", () => {
    expect(generateDefault(8)).toHaveLength(8);
    expect(generateDefault(21)).toHaveLength(21);
    expect(generateDefault(64)).toHaveLength(64);
    expect(generateDefault(255)).toHaveLength(255);
  });

  it("uses only characters from DEFAULT_ALPHABET", () => {
    const alphabet = new Set(DEFAULT_ALPHABET);
    const id = generateDefault(128);
    for (const char of id) {
      expect(alphabet.has(char)).toBe(true);
    }
  });

  it("exposes generateId as an alias", () => {
    expect(generateId(16)).toHaveLength(16);
  });

  it("throws RangeError for invalid lengths", () => {
    expect(() => generateDefault(0)).toThrow(RangeError);
    expect(() => generateDefault(256)).toThrow(RangeError);
    expect(() => generateDefault(1.5)).toThrow(RangeError);
  });
});

describe("native loader errors", () => {
  it("reports missing addon package clearly", () => {
    expect(() => loadNativeAddon("@sigilid/missing-addon")).toThrow(
      /sigilid\/native failed to load @sigilid\/missing-addon/,
    );
  });

  it("detects Node runtime", () => {
    expect(isNodeRuntime()).toBe(true);
  });

  it("throws a Node-only error outside Node runtime", () => {
    const originalProcess = (globalThis as { process?: unknown }).process;
    (globalThis as { process?: unknown }).process = undefined;
    try {
      expect(() => loadNativeAddon()).toThrow(/only supported in Node\.js/i);
    } finally {
      (globalThis as { process?: unknown }).process = originalProcess;
    }
  });
});
