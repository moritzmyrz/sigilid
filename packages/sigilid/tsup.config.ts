import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "non-secure": "src/non-secure.ts",
    prefix: "src/prefix.ts",
    typed: "src/typed.ts",
    validate: "src/validate.ts",
    alphabet: "src/alphabet.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  // Each entrypoint should be a standalone bundle with no cross-entrypoint
  // imports at runtime. Internal helpers are inlined per-entrypoint.
  bundle: true,
  outDir: "dist",
});
