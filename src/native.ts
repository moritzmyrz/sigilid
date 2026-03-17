import { assertLength } from "./internal/assert.js";
import { DEFAULT_ALPHABET } from "./internal/constants.js";
import { loadNativeAddon } from "./internal/native.js";

const nativeAddon = loadNativeAddon();

export { DEFAULT_ALPHABET };

export function generateDefault(length = 21): string {
  assertLength(length);
  return nativeAddon.generateDefault(length);
}

export function generateId(length = 21): string {
  return generateDefault(length);
}
