import { Bench } from "tinybench";

import { generateDefault as generatePooledJs } from "../src/internal/generate.js";
import { loadNativeAddon } from "../src/internal/native.js";
import { generateDefault as generateNative } from "../src/native.js";

const lengths = [8, 16, 21, 32, 64] as const;
const bench = new Bench({
  iterations: 32,
  time: 600,
  warmupTime: 200,
});
const addon = loadNativeAddon();

for (const length of lengths) {
  bench
    .add(`JS pooled generateDefault(${length})`, () => {
      generatePooledJs(length);
    })
    .add(`Native generateDefault(${length})`, () => {
      generateNative(length);
    });
}

// Estimate JS/native crossing overhead by comparing a JS no-op with addon no-op.
const jsNoop = () => {};
bench
  .add("JS boundary baseline (noop)", () => {
    jsNoop();
  })
  .add("Native boundary call (noop)", () => {
    addon.noop?.();
  });

await bench.run();

console.table(
  bench.tasks.map((task) => ({
    name: task.name,
    "ops/sec": task.result?.throughput.mean.toFixed(0) ?? "N/A",
    "avg (ns)": ((task.result?.latency.mean ?? 0) * 1e6).toFixed(2),
    p99: ((task.result?.latency.p99 ?? 0) * 1e6).toFixed(2),
    samples: task.result?.samples.length ?? 0,
  })),
);
