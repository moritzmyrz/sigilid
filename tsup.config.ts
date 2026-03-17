import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    native: "src/native.ts",
    "non-secure": "src/non-secure.ts",
    prefix: "src/prefix.ts",
    typed: "src/typed.ts",
    validate: "src/validate.ts",
    alphabet: "src/alphabet.ts",
  },
  format: ["esm"],
  dts: true,
  // Source maps inflate the npm tarball by ~66 kB for minimal benefit —
  // minified maps aren't useful for debugging, and the source is on GitHub.
  sourcemap: false,
  clean: true,
  minify: true,
  splitting: false,
  treeshake: true,
  // Each entrypoint should be a standalone bundle with no cross-entrypoint
  // imports at runtime. Internal helpers are inlined per-entrypoint.
  bundle: true,
  outDir: "dist",
});
