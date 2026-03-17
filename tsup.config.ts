import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "non-secure": "src/non-secure.ts",
    prefix: "src/prefix.ts",
    typed: "src/typed.ts",
    validate: "src/validate.ts",
    alphabet: "src/alphabet.ts",
    constants: "src/constants.ts",
  },
  format: ["esm"],
  dts: true,
  // Source maps inflate the npm tarball by ~66 kB for minimal benefit —
  // minified maps aren't useful for debugging, and the source is on GitHub.
  sourcemap: false,
  clean: true,
  minify: true,
  splitting: true,
  treeshake: true,
  // Allow shared chunks so duplicated internal helpers are emitted once.
  bundle: true,
  outDir: "dist",
});
