import { createRequire } from "node:module";

export type NativeAddon = {
  generateDefault: (length: number) => string;
  noop?: () => void;
};

const require = createRequire(import.meta.url);
const NATIVE_PACKAGE = "@sigilid/native-addon";

export function isNodeRuntime(): boolean {
  return typeof process !== "undefined" && typeof process.versions?.node === "string";
}

export function loadNativeAddon(packageName = NATIVE_PACKAGE): NativeAddon {
  if (!isNodeRuntime()) {
    throw new Error("sigilid/native is only supported in Node.js.");
  }

  try {
    const addon = require(packageName) as Partial<NativeAddon>;
    if (typeof addon.generateDefault !== "function") {
      throw new TypeError(`${packageName} does not export generateDefault(length).`);
    }
    return addon as NativeAddon;
  } catch (error) {
    const message =
      `sigilid/native failed to load ${packageName}. ` +
      `Install it with "npm install ${packageName}" and ensure native builds are available.`;
    const wrappedError = new Error(message);
    if (error instanceof Error) {
      Object.defineProperty(wrappedError, "cause", {
        value: error,
        enumerable: false,
        configurable: true,
        writable: true,
      });
    }
    throw wrappedError;
  }
}
