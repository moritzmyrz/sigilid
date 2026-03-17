/**
 * Playground — local integration demo only, not published.
 *
 * Run with: npm run playground (from repo root)
 * Requires a build first: npm run build
 */
import { DEFAULT_ALPHABET, generateId } from "sigilid";
import { createAlphabet, validateAlphabet } from "sigilid/alphabet";
import { generateNonSecureId } from "sigilid/non-secure";
import { createPrefixedGenerator, generatePrefixedId } from "sigilid/prefix";
import { castId, createTypedGenerator } from "sigilid/typed";
import type { IdOf } from "sigilid/typed";
import { assertValidId, isValidId, parseId } from "sigilid/validate";

console.log("--- sigilid playground ---\n");

// Root
console.log("Root import (secure):");
console.log("  generateId()         =", generateId());
console.log("  generateId(12)       =", generateId(12));
console.log("  DEFAULT_ALPHABET     =", DEFAULT_ALPHABET);
console.log();

// Non-secure
console.log("Non-secure:");
console.log("  generateNonSecureId()   =", generateNonSecureId());
console.log();

// Prefix
console.log("Prefix:");
console.log("  generatePrefixedId('usr')       =", generatePrefixedId("usr"));
console.log("  generatePrefixedId('doc', 10)   =", generatePrefixedId("doc", 10));
const invoiceId = createPrefixedGenerator("inv");
console.log("  createPrefixedGenerator('inv')() =", invoiceId());
console.log();

// Typed
console.log("Typed:");
const userId = createTypedGenerator<"User">("usr");
const postId = createTypedGenerator<"Post">("post");
const uid: IdOf<"User"> = userId();
const pid: IdOf<"Post"> = postId();
console.log("  userId()   =", uid);
console.log("  postId()   =", pid);
const casted = castId<"Order">("ord_abc123");
console.log("  castId<'Order'>('ord_abc123') =", casted);
console.log();

// Validate
console.log("Validate:");
const validId = generateId();
console.log("  isValidId(generateId())       =", isValidId(validId));
console.log("  isValidId('bad id!')          =", isValidId("bad id!"));
console.log("  isValidId('usr_abc', { prefix: 'usr' }) =", isValidId("usr_abc", { prefix: "usr" }));
console.log("  parseId(generateId())         =", parseId(generateId()));
try {
  assertValidId("not valid!!!");
} catch (e) {
  console.log("  assertValidId('not valid!!!'): threw as expected —", (e as Error).message);
}
console.log();

// Alphabet
console.log("Alphabet:");
validateAlphabet("0123456789abcdef");
console.log("  validateAlphabet('0123456789abcdef') — ok");
const hex = createAlphabet("0123456789abcdef");
console.log("  hex.generate(32) =", hex.generate(32));
const binary = createAlphabet("01");
console.log("  binary.generate(16) =", binary.generate(16));
console.log();

console.log("--- all imports resolved, no errors ---");
