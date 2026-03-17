import { DEFAULT_ALPHABET } from "./constants.js";

const POOL_SIZE = 1024;
const pool = new Uint8Array(POOL_SIZE);
const chars = DEFAULT_ALPHABET;
let poolOffset = POOL_SIZE;

export function generateDefault(length: number): string {
  if (poolOffset + length > POOL_SIZE) {
    crypto.getRandomValues(pool);
    poolOffset = 0;
  }

  let result = "";
  const end = poolOffset + length;
  while (poolOffset < end) {
    result += chars[(pool[poolOffset++] as number) & 63] as string;
  }
  return result;
}
