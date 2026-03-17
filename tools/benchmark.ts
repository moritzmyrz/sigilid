import { generateId } from "sigilid";
import { createAlphabet } from "sigilid/alphabet";
import { generateNonSecureId } from "sigilid/non-secure";
import { generatePrefixedId } from "sigilid/prefix";
/**
 * Local benchmarks only — not representative of production performance.
 * Results vary by hardware, Node version, and system load.
 *
 * Run with: npm run bench (from repo root)
 * Requires a build first: npm run build
 */
import { Bench } from "tinybench";

const hex = createAlphabet("0123456789abcdef");

const bench = new Bench({ time: 2000 });

bench
  .add("generateId() — default (21 chars, secure)", () => {
    generateId();
  })
  .add("generateId(8) — short secure ID", () => {
    generateId(8);
  })
  .add("generateId(36) — longer secure ID", () => {
    generateId(36);
  })
  .add("generateNonSecureId() — Math.random (21 chars)", () => {
    generateNonSecureId();
  })
  .add("generatePrefixedId('usr') — prefixed secure ID", () => {
    generatePrefixedId("usr");
  })
  .add("hex.generate(32) — custom alphabet", () => {
    hex.generate(32);
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
